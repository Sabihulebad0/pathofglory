import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
//
// `createCsrfMiddleware` is server-only — its implementation is stripped from the
// client build. Some versions of the Start plugin fold the stripped call away and
// some leave it in place calling an `undefined` binding, which throws
// "createCsrfMiddleware is not a function" during hydration. `import.meta.env.SSR`
// is replaced at build time, so the client bundle never contains the call at all.
const requestMiddleware = import.meta.env.SSR
  ? [errorMiddleware, createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" })]
  : [errorMiddleware];

export const startInstance = createStart(() => ({ requestMiddleware }));
