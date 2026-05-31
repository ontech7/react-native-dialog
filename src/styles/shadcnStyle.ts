import type { DialogStyleConfig, DialogStyleTheme } from "../DialogProvider";

/**
 * shadcn/ui `Dialog` look, matching the component's tokens and spacing:
 * `DialogContent` is `p-6` (24) with `gap-4` (16) between sections, `rounded-lg`
 * (8), `border` + `shadow-lg`; the header is `gap-2` (8); the title is
 * `text-lg font-semibold tracking-tight`; the description is `text-sm
 * text-muted-foreground`; the footer is right-aligned with `gap-2`; buttons are
 * the `outline` variant (`rounded-md` 6, `h-9`, `text-sm font-medium`, `shadow-sm`).
 *
 * Light: bg #ffffff, fg #0a0a0a, muted #737373, border/input #e5e5e5.
 * Dark:  bg #0a0a0a, fg #fafafa, muted #a3a3a3, border/input #262626.
 */
const shadowLg =
  "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)";
const shadowSm = "0px 1px 2px 0px rgba(0,0,0,0.05)";

const light: DialogStyleConfig = {
  container: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#e5e5e5",
    backgroundColor: "#ffffff",
    boxShadow: shadowLg,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
  },
  footer: {
    backgroundColor: "rgba(246, 246, 246, 0.5)",
    borderTopWidth: 1,
    borderColor: "rgba(232, 232, 232, 1)",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
    justifyContent: "flex-end",
  },
  title: {
    color: "#0a0a0a",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  description: {
    color: "#737373",
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    label: {
      color: "#0a0a0a",
      fontSize: 14,
      fontWeight: "500",
    },
    textInput: {
      color: "#0a0a0a",
      fontSize: 14,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#e5e5e5",
      backgroundColor: "#ffffff",
      paddingHorizontal: 12,
      paddingVertical: 8,
      boxShadow: shadowSm,
    },
  },
  action: {
    button: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#e5e5e5",
      backgroundColor: "#ffffff",
      paddingHorizontal: 10,
      paddingVertical: 6,
      boxShadow: shadowSm,
    },
    text: {
      color: "#0a0a0a",
      fontSize: 14,
      fontWeight: "500",
    },
  },
};

const dark: DialogStyleConfig = {
  container: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(23, 23, 23, 1)",
    boxShadow:
      "0px 10px 15px -3px rgba(0,0,0,0.5), 0px 4px 6px -4px rgba(0,0,0,0.5)",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
  },
  footer: {
    backgroundColor: "rgba(39, 39, 39, 0.5)",
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
    justifyContent: "flex-end",
  },
  title: {
    color: "#fafafa",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  description: {
    color: "#a3a3a3",
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    label: {
      color: "#fafafa",
      fontSize: 14,
      fontWeight: "500",
    },
    textInput: {
      color: "#fafafa",
      fontSize: 14,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "rgba(255, 255, 255, 0.15)",
      backgroundColor: "rgba(255, 255, 255, 0.045)",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
  },
  action: {
    button: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "rgba(255, 255, 255, 0.15)",
      backgroundColor: "rgba(255, 255, 255, 0.045)",
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    text: {
      color: "#fafafa",
      fontSize: 14,
      fontWeight: "500",
    },
  },
};

export const shadcnStyle: DialogStyleTheme = { light, dark };
