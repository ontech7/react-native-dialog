import type { DialogStyleConfig, DialogStyleTheme } from "../theme";

/**
 * shadcn/ui `Dialog` look, matching the component's tokens and spacing:
 * `DialogContent` is `p-6` (24) with `gap-4` (16) between sections, `rounded-lg`
 * (8), `border` + `shadow-lg`; the header is `gap-2` (8); the title is
 * `text-lg font-semibold tracking-tight`; the description is `text-sm
 * text-muted-foreground`; the footer is right-aligned with `gap-2`; buttons are
 * the `outline` variant (`rounded-md` 6, `h-9`, `text-sm font-medium`, `shadow-sm`);
 * `variant="primary"` and `"destructive"` map to the matching shadcn/ui button
 * variants, `"secondary"` to `outline` (what shadcn dialogs use for Cancel).
 *
 * Light: bg #ffffff, fg #0a0a0a, muted #737373, border/input #e5e5e5.
 * Dark:  bg #0a0a0a, fg #fafafa, muted #a3a3a3, border/input #262626.
 */
const shadowLg =
  "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)";
const shadowSm = "0px 1px 2px 0px rgba(0,0,0,0.05)";

const light: DialogStyleConfig = {
  container: {
    // bottom spacing for dialogs without a footer; the footer band cancels it
    // with a negative margin so it stays flush with the bottom edge
    paddingBottom: 16,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#e5e5e5",
    backgroundColor: "#ffffff",
    boxShadow: shadowLg,
  },
  // 16 between sections (`gap-4`): the body keeps it on top and the footer
  // adds it above itself, so every header / body / footer combination (e.g. a
  // header + footer confirm) is spaced like a full dialog.
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  footer: {
    marginTop: 16,
    marginBottom: -16,
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
      minHeight: 36,
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#e5e5e5",
      backgroundColor: "#ffffff",
      paddingHorizontal: 16,
      paddingVertical: 6,
      boxShadow: shadowSm,
    },
    text: {
      color: "#0a0a0a",
      fontSize: 14,
      fontWeight: "500",
    },
    variants: {
      primary: {
        button: { backgroundColor: "#171717", borderColor: "#171717" },
        text: { color: "#fafafa" },
      },
      // shadcn dialogs pair the primary action with an `outline` one, which
      // is the base action style.
      secondary: {},
      destructive: {
        button: { backgroundColor: "#dc2626", borderColor: "#dc2626" },
        text: { color: "#ffffff" },
      },
    },
  },
};

const dark: DialogStyleConfig = {
  container: {
    paddingBottom: 16,
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
    gap: 8,
  },
  footer: {
    marginTop: 16,
    marginBottom: -16,
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
      minHeight: 36,
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "rgba(255, 255, 255, 0.15)",
      backgroundColor: "rgba(255, 255, 255, 0.045)",
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    text: {
      color: "#fafafa",
      fontSize: 14,
      fontWeight: "500",
    },
    variants: {
      primary: {
        button: { backgroundColor: "#e5e5e5", borderColor: "#e5e5e5" },
        text: { color: "#171717" },
      },
      secondary: {},
      destructive: {
        button: {
          backgroundColor: "rgba(239, 68, 68, 0.6)",
          borderColor: "transparent",
        },
        text: { color: "#ffffff" },
      },
    },
  },
};

export const shadcnStyle: DialogStyleTheme = { light, dark };
