/** Single source of truth for brand naming and shared social/meta assets. */
export const BRAND = {
  name: "Path of Glory",
  tagline: "Considered Essentials",
  social: "@pathofglory",
  /** Full lockup, white artwork on transparent — for dark surfaces. */
  logoLight: "/logo-white.png",
  /** Full lockup, black artwork on transparent — for light surfaces. */
  logoDark: "/logo-black.png",
  /** Original supplied artwork, kept as the canonical source file. */
  logo: "/logo.png",
  ogImage: "/og-image.png",
} as const;
