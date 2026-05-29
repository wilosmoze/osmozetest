// Re-uses the OG image generator. `runtime` must be exported as a literal
// (Next.js can't trace re-exports), so we declare it explicitly.
export const runtime = "edge";
export { default, alt, size, contentType } from "./opengraph-image";
