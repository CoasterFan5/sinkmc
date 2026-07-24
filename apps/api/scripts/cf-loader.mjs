/**
 * Custom Node.js ESM loader that stubs Workers
 * Used when running scripts in Node.js since the workers runtime isnt there and isnt required.
 * (e.g. OpenAPI spec generation).
 *
 */
export function resolve(specifier, context, next) {
  if (specifier.startsWith("cloudflare:")) {
    // empty stubs are safe b/c we dont actually need this unless we are in runtime
    const stub = encodeURIComponent("export const env = {}; export default {};");
    return { shortCircuit: true, url: `data:text/javascript,${stub}` };
  }
  return next(specifier, context);
}
