import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  Lock,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/brand";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: `Checkout — ${BRAND.name}` },
      { name: "description", content: `Complete your ${BRAND.name} order.` },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Checkout — ${BRAND.name}` },
    ],
  }),
  component: Checkout,
});

/* ---------------------------------------------------------------- delivery */

const DELIVERY = [
  {
    id: "standard",
    name: "Standard",
    detail: "3–5 business days",
    cost: (subtotal: number) => (subtotal > 150 ? 0 : 12),
  },
  { id: "express", name: "Express", detail: "1–2 business days", cost: () => 20 },
  { id: "overnight", name: "Overnight", detail: "Next business day", cost: () => 35 },
] as const;

type DeliveryId = (typeof DELIVERY)[number]["id"];

/* -------------------------------------------------------------- validation */

/** Luhn checksum — catches mistyped card numbers before they reach a processor. */
function luhn(value: string) {
  let sum = 0;
  let double = false;
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = Number(value[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return value.length > 0 && sum % 10 === 0;
}

const schema = z.object({
  email: z.string().min(1, "Required").email("Enter a valid email address"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postal: z.string().min(3, "Enter a valid postal code"),
  country: z.string().min(1, "Required"),
  phone: z.string().optional(),
  newsletter: z.boolean().optional(),

  delivery: z.enum(["standard", "express", "overnight"]),

  cardName: z.string().min(1, "Required"),
  cardNumber: z
    .string()
    .min(1, "Required")
    .refine((v) => /^\d{13,19}$/.test(v.replace(/\s/g, "")), "Enter a valid card number")
    .refine((v) => luhn(v.replace(/\s/g, "")), "That card number doesn't look right"),
  expiry: z
    .string()
    .min(1, "Required")
    .refine((v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v), "Use MM/YY")
    .refine((v) => {
      const [month, year] = v.split("/").map(Number);
      const now = new Date();
      const end = new Date(2000 + year, month, 0, 23, 59, 59);
      return end >= now;
    }, "That date has passed"),
  cvc: z.string().regex(/^\d{3,4}$/, "3 or 4 digits"),
  billingSame: z.boolean().optional(),
});

type Values = z.infer<typeof schema>;

const STEPS = [
  { id: 0, label: "Information", fields: ["email", "firstName", "lastName", "address", "apartment", "city", "state", "postal", "country", "phone"] },
  { id: 1, label: "Delivery", fields: ["delivery"] },
  { id: 2, label: "Payment", fields: ["cardName", "cardNumber", "expiry", "cvc"] },
] as const;

/* ------------------------------------------------------------- formatting */

const formatCardNumber = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

/* ------------------------------------------------------------------ order */

type PlacedLine = { product: Product; size: string; color: string; quantity: number };
type PlacedOrder = {
  id: string;
  email: string;
  lines: PlacedLine[];
  delivery: (typeof DELIVERY)[number];
  subtotal: number;
  shipping: number;
  total: number;
};

/* ------------------------------------------------------------------- page */

function Checkout() {
  const { items, resolve, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { country: "United States", delivery: "standard", billingSame: true },
  });
  const { register, handleSubmit, trigger, watch, formState } = form;

  const deliveryId = watch("delivery") as DeliveryId;
  const method = DELIVERY.find((d) => d.id === deliveryId) ?? DELIVERY[0];
  const shipping = method.cost(subtotal);
  const total = subtotal + shipping;

  const next = async () => {
    const ok = await trigger(STEPS[step].fields as unknown as (keyof Values)[]);
    if (!ok) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = (values: Values) => {
    const lines = items
      .map((it) => {
        const product = resolve(it);
        return product ? { product, size: it.size, color: it.color, quantity: it.quantity } : null;
      })
      .filter((l): l is PlacedLine => l !== null);

    setPlaced({
      id: `POG-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      email: values.email,
      lines,
      delivery: method,
      subtotal,
      shipping,
      total,
    });
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) return <Confirmation order={placed} />;
  if (items.length === 0) return <EmptyCheckout />;

  return (
    <Layout>
      <section className="container-x pt-12 pb-6 border-b border-border">
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Checkout</div>
        <h1 className="text-4xl md:text-5xl">Complete your order</h1>
      </section>

      <section className="container-x py-10 md:py-12 grid lg:grid-cols-3 gap-10 lg:gap-14 items-start">
        <MobileSummary
          lines={items.map((it) => ({ item: it, product: resolve(it) }))}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          method={method}
        />

        <div className="lg:col-span-2">
          <Steps current={step} />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10" noValidate>
            {step === 0 && <InformationStep form={form} />}
            {step === 1 && <DeliveryStep form={form} subtotal={subtotal} />}
            {step === 2 && <PaymentStep form={form} />}

            <div className="mt-10 flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-between">
              {step === 0 ? (
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Return to cart
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to {STEPS[step - 1].label.toLowerCase()}
                </button>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={next}
                  className="h-12 px-8 rounded-full bg-ink text-white text-sm font-medium hover:bg-brand transition-colors"
                >
                  Continue to {STEPS[step + 1].label.toLowerCase()}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="h-12 px-8 rounded-full bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" /> Place order · ${total.toFixed(0)}
                </button>
              )}
            </div>
          </form>
        </div>

        <Summary
          lines={items.map((it) => ({ item: it, product: resolve(it) }))}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          method={method}
        />
      </section>
    </Layout>
  );
}

/* ------------------------------------------------------------------ steps */

function Steps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-3 sm:gap-4">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.id} className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-7 h-7 rounded-full grid place-items-center text-xs font-medium transition-colors ${
                  active
                    ? "bg-brand text-brand-foreground"
                    : done
                      ? "bg-white text-ink"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </span>
              <span
                className={`text-xs uppercase tracking-widest hidden sm:block ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className="w-6 sm:w-10 h-px bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

type FormApi = ReturnType<typeof useForm<Values>>;

function InformationStep({ form }: { form: FormApi }) {
  const { register, formState } = form;
  const e = formState.errors;
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-lg font-display mb-4">Contact</legend>
        <Field label="Email" error={e.email?.message}>
          <input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className={inputCls(!!e.email)} />
        </Field>
        <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
          <Checkbox {...register("newsletter")} />
          Email me with news and offers
        </label>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-display mb-4">Shipping address</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" error={e.firstName?.message}>
            <input {...register("firstName")} autoComplete="given-name" className={inputCls(!!e.firstName)} />
          </Field>
          <Field label="Last name" error={e.lastName?.message}>
            <input {...register("lastName")} autoComplete="family-name" className={inputCls(!!e.lastName)} />
          </Field>
        </div>
        <Field label="Address" error={e.address?.message} className="mt-4">
          <input {...register("address")} autoComplete="address-line1" className={inputCls(!!e.address)} />
        </Field>
        <Field label="Apartment, suite, etc. (optional)" className="mt-4">
          <input {...register("apartment")} autoComplete="address-line2" className={inputCls(false)} />
        </Field>
        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <Field label="City" error={e.city?.message}>
            <input {...register("city")} autoComplete="address-level2" className={inputCls(!!e.city)} />
          </Field>
          <Field label="State / Region" error={e.state?.message}>
            <input {...register("state")} autoComplete="address-level1" className={inputCls(!!e.state)} />
          </Field>
          <Field label="Postal code" error={e.postal?.message}>
            <input {...register("postal")} autoComplete="postal-code" className={inputCls(!!e.postal)} />
          </Field>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Field label="Country" error={e.country?.message}>
            <select {...register("country")} autoComplete="country-name" className={inputCls(!!e.country)}>
              {["United States", "United Kingdom", "Canada", "Australia", "France", "Germany", "Italy", "Japan", "Pakistan", "United Arab Emirates"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phone (optional)">
            <input {...register("phone")} type="tel" autoComplete="tel" className={inputCls(false)} />
          </Field>
        </div>
      </fieldset>
    </div>
  );
}

function DeliveryStep({ form, subtotal }: { form: FormApi; subtotal: number }) {
  const { register, watch } = form;
  const selected = watch("delivery");
  return (
    <fieldset>
      <legend className="text-lg font-display mb-4">Delivery method</legend>
      <div className="grid gap-3">
        {DELIVERY.map((d) => {
          const cost = d.cost(subtotal);
          const active = selected === d.id;
          return (
            <label
              key={d.id}
              className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-colors ${
                active ? "border-brand bg-brand/10" : "border-border hover:border-muted-foreground"
              }`}
            >
              <input {...register("delivery")} type="radio" value={d.id} className="sr-only" />
              <span
                className={`w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 transition-colors ${
                  active ? "border-brand" : "border-border"
                }`}
              >
                {active && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium">{d.name}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{d.detail}</span>
              </span>
              <span className="text-sm font-medium shrink-0">{cost === 0 ? "Free" : `$${cost}`}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs">
        {[
          [Truck, "Tracked and insured"],
          [RefreshCw, "30-day returns"],
          [ShieldCheck, "Lifetime repairs"],
        ].map(([Icon, label], i) => {
          const I = Icon as typeof Truck;
          return (
            <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
              <I className="w-4 h-4 text-brand shrink-0" />
              <span>{label as string}</span>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function PaymentStep({ form }: { form: FormApi }) {
  const { register, formState } = form;
  const e = formState.errors;
  const card = register("cardNumber");
  const exp = register("expiry");

  return (
    <fieldset>
      <legend className="text-lg font-display mb-4">Payment</legend>

      <Field label="Name on card" error={e.cardName?.message}>
        <input {...register("cardName")} autoComplete="cc-name" className={inputCls(!!e.cardName)} />
      </Field>

      <Field label="Card number" error={e.cardNumber?.message} className="mt-4">
        <div className="relative">
          <input
            {...card}
            onChange={(event) => {
              event.target.value = formatCardNumber(event.target.value);
              card.onChange(event);
            }}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            className={`${inputCls(!!e.cardNumber)} pr-12`}
          />
          <CreditCard className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </Field>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <Field label="Expiry" error={e.expiry?.message}>
          <input
            {...exp}
            onChange={(event) => {
              event.target.value = formatExpiry(event.target.value);
              exp.onChange(event);
            }}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            className={inputCls(!!e.expiry)}
          />
        </Field>
        <Field label="CVC" error={e.cvc?.message}>
          <input {...register("cvc")} inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} className={inputCls(!!e.cvc)} />
        </Field>
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
        <Checkbox {...register("billingSame")} />
        Billing address is the same as shipping
      </label>

      <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
        <Lock className="w-3.5 h-3.5 mt-px shrink-0" />
        No payment is taken — connect a payment provider to accept live orders.
      </p>
    </fieldset>
  );
}

/* ---------------------------------------------------------------- summary */

type SummaryProps = {
  lines: { item: { productId: string; size: string; color: string; quantity: number }; product: Product | undefined }[];
  subtotal: number;
  shipping: number;
  total: number;
  method: (typeof DELIVERY)[number];
};

/** Collapsible summary shown above the form on narrow screens. */
function MobileSummary(props: SummaryProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden rounded-2xl bg-secondary overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm text-brand">
          <ShoppingBag className="w-4 h-4" />
          {open ? "Hide" : "Show"} order summary
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
        <span className="text-base font-medium shrink-0">${props.total.toFixed(0)}</span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <SummaryBody {...props} />
        </div>
      )}
    </div>
  );
}

function Summary(props: SummaryProps) {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-28">
      <div className="rounded-2xl bg-secondary p-6 md:p-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Order Summary</div>
        <SummaryBody {...props} />
      </div>

      <Link
        to="/cart"
        className="mt-3 w-full h-11 rounded-full border border-border text-sm inline-flex items-center justify-center hover:border-muted-foreground transition-colors"
      >
        Edit cart
      </Link>
    </aside>
  );
}

function SummaryBody({ lines, subtotal, shipping, total, method }: SummaryProps) {
  return (
    <>
      <ul className="space-y-4">
        {lines.map(({ item, product }) =>
          product ? (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
              <div className="relative w-16 shrink-0">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-background">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink text-white text-[10px] grid place-items-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium line-clamp-1">{product.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.color} · Size {item.size}
                </div>
              </div>
              <div className="text-sm shrink-0">${(product.price * item.quantity).toFixed(0)}</div>
            </li>
          ) : null,
        )}
      </ul>

      <div className="my-5 h-px bg-border" />

      <div className="space-y-3 text-sm">
        <Row label="Subtotal" value={`$${subtotal.toFixed(0)}`} />
        <Row label={`Shipping · ${method.name}`} value={shipping === 0 ? "Free" : `$${shipping.toFixed(0)}`} />
      </div>

      <div className="my-5 h-px bg-border" />

      <div className="flex justify-between text-base font-medium">
        <span>Total</span>
        <span>${total.toFixed(0)}</span>
      </div>
    </>
  );
}

/* ----------------------------------------------------------- other states */

function Confirmation({ order }: { order: PlacedOrder }) {
  return (
    <Layout>
      <section className="container-x py-20 md:py-28 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-brand grid place-items-center mx-auto mb-8">
          <Check className="w-7 h-7 text-brand-foreground" />
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Order {order.id}</div>
        <h1 className="text-4xl md:text-5xl">Thank you.</h1>
        <p className="mt-4 text-muted-foreground">
          Your order is confirmed. We&rsquo;ve sent a receipt to{" "}
          <span className="text-foreground">{order.email}</span> and will email tracking as soon as it
          ships — {order.delivery.detail.toLowerCase()}.
        </p>

        <div className="mt-10 rounded-2xl bg-secondary p-6 md:p-8 text-left">
          <ul className="space-y-4">
            {order.lines.map((line) => (
              <li key={`${line.product.id}-${line.size}-${line.color}`} className="flex gap-4">
                <div className="w-16 shrink-0 aspect-[3/4] rounded-lg overflow-hidden bg-background">
                  <img src={line.product.images[0]} alt={line.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-1">{line.product.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {line.color} · Size {line.size} · Qty {line.quantity}
                  </div>
                </div>
                <div className="text-sm shrink-0">${(line.product.price * line.quantity).toFixed(0)}</div>
              </li>
            ))}
          </ul>
          <div className="my-5 h-px bg-border" />
          <div className="space-y-3 text-sm">
            <Row label="Subtotal" value={`$${order.subtotal.toFixed(0)}`} />
            <Row
              label={`Shipping · ${order.delivery.name}`}
              value={order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(0)}`}
            />
          </div>
          <div className="my-5 h-px bg-border" />
          <div className="flex justify-between text-base font-medium">
            <span>Total</span>
            <span>${order.total.toFixed(0)}</span>
          </div>
        </div>

        <Link
          to="/shop"
          className="mt-10 inline-flex items-center h-12 px-8 rounded-full bg-ink text-white text-sm font-medium hover:bg-brand transition-colors"
        >
          Continue Shopping
        </Link>
      </section>
    </Layout>
  );
}

function EmptyCheckout() {
  return (
    <Layout>
      <section className="container-x py-24 text-center">
        <img src={BRAND.logoLight} alt={BRAND.name} className="h-16 w-auto mx-auto mb-8 object-contain opacity-20" />
        <div className="w-16 h-16 rounded-full bg-secondary grid place-items-center mx-auto mb-6">
          <ShoppingBag className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="text-2xl font-display">There&rsquo;s nothing to check out.</div>
        <p className="text-muted-foreground mt-2">Add a piece to your bag to continue.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center h-12 px-7 rounded-full bg-ink text-white text-sm font-medium hover:bg-brand transition-colors"
        >
          Continue Shopping
        </Link>
      </section>
    </Layout>
  );
}

/* ------------------------------------------------------------ form pieces */

const inputCls = (invalid: boolean) =>
  `mt-2 w-full h-12 rounded-xl bg-secondary border px-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
    invalid ? "border-destructive focus:border-destructive" : "border-border focus:border-brand"
  }`;

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

/** Checkbox styled to match the site rather than the browser default. */
function Checkbox(props: UseFormRegisterReturn) {
  return (
    <span className="relative inline-grid place-items-center shrink-0">
      <input
        {...props}
        type="checkbox"
        className="peer appearance-none w-5 h-5 rounded-md border border-border bg-secondary checked:bg-brand checked:border-brand transition-colors cursor-pointer"
      />
      <Check className="w-3 h-3 text-brand-foreground absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
    </span>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="shrink-0">{value}</span>
  </div>
);
