import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

/**
 * `variant` is the colour of the artwork itself: "light" is the white lockup for
 * the storefront's dark surfaces, "dark" is the black lockup for light surfaces.
 */
export function Logo({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const src = variant === "dark" ? BRAND.logoDark : BRAND.logoLight;
  return (
    <Link
      to="/"
      className={`inline-flex items-center ${className}`}
      aria-label={`${BRAND.name} — Home`}
    >
      <img
        src={src}
        alt={BRAND.name}
        className="h-12 md:h-16 w-auto object-contain"
        width={1522}
        height={1024}
      />
    </Link>
  );
}
