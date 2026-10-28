import { type DialogStyleConfig, type DialogStyleTheme } from "./theme";
type ThemeOverrides = DialogStyleConfig | Partial<DialogStyleTheme>;
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
export declare function extendDialogTheme(base: DialogStyleConfig | DialogStyleTheme, overrides: ThemeOverrides): DialogStyleTheme;
export {};
