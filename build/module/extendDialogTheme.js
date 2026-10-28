import { isTheme, } from "./theme";
/**
 * Builds a new theme from a preset (or your own styles) plus a few overrides,
 * deep-merged slot by slot so you only write what changes:
 *
 * ```ts
 * // same overrides for light and dark
 * extendDialogTheme(shadcnStyle, { action: { text: { color: "#2563eb" } } });
 *
 * // or per scheme
 * extendDialogTheme(materialStyle, {
 *   light: { title: { color: "#1d4ed8" } },
 *   dark: { title: { color: "#93c5fd" } },
 * });
 * ```
 *
 * The base is never mutated. Arrays (e.g. `transform`) are replaced, not merged.
 */
export function extendDialogTheme(base, overrides) {
    const baseTheme = isTheme(base) ? base : { light: base };
    const isPerScheme = isTheme(overrides);
    const perScheme = isPerScheme
        ? overrides
        : {
            light: overrides,
            dark: overrides,
        };
    const light = deepMerge(baseTheme.light, perScheme.light);
    // A light-only base stays light-only unless explicit dark overrides are
    // given, so `DialogProvider`'s `darkStyles` keeps working as its fallback.
    const dark = baseTheme.dark || (isPerScheme && perScheme.dark)
        ? deepMerge(baseTheme.dark ?? baseTheme.light, perScheme.dark)
        : undefined;
    return dark ? { light, dark } : { light };
}
function isPlainObject(value) {
    return (typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype);
}
function deepMerge(base, override) {
    if (!override)
        return base;
    const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
        // Never let a crafted `__proto__` key reach the prototype chain.
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
            continue;
        }
        const current = result[key];
        result[key] =
            isPlainObject(current) && isPlainObject(value)
                ? deepMerge(current, value)
                : value;
    }
    return result;
}
