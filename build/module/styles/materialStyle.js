/**
 * Material Design 3 dialog: 28dp rounded "surface container high", 24dp padding,
 * left-aligned "headline small" title, supporting text, and primary-colored
 * text (pill) buttons aligned to the end. Variants are 40dp pill buttons:
 * `primary` filled, `secondary` outlined, `destructive` filled with the error
 * color.
 *
 * Colors follow the M3 baseline scheme for light and dark.
 */
const light = {
    container: {
        borderRadius: 28,
        backgroundColor: "#ece6f0",
        boxShadow: "0px 2px 6px 2px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3)",
    },
    header: { paddingHorizontal: 24, paddingTop: 24, gap: 16 },
    body: { paddingHorizontal: 24, paddingTop: 16 },
    title: {
        color: "#1d1b20",
        fontSize: 24,
        fontWeight: "400",
        lineHeight: 32,
    },
    description: {
        color: "#49454f",
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
        gap: 8,
        justifyContent: "flex-end",
    },
    input: {
        label: { color: "#49454f", fontSize: 12 },
        textInput: {
            color: "#1d1b20",
            fontSize: 16,
            borderWidth: 0,
            borderRadius: 0,
            borderBottomWidth: 1,
            borderColor: "#79747e",
            backgroundColor: "transparent",
            paddingHorizontal: 0,
            paddingVertical: 8,
        },
    },
    action: {
        button: {
            minHeight: 40,
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "transparent",
            paddingHorizontal: 12,
            paddingVertical: 10,
            minWidth: 48,
            alignItems: "center",
        },
        text: {
            color: "#6750a4",
            fontSize: 14,
            fontWeight: "500",
            textAlign: "center",
        },
        variants: {
            primary: {
                button: { backgroundColor: "#6750a4", paddingHorizontal: 24 },
                text: { color: "#ffffff" },
            },
            secondary: {
                button: {
                    borderWidth: 1,
                    borderColor: "#79747e",
                    paddingHorizontal: 24,
                },
            },
            destructive: {
                button: { backgroundColor: "#b3261e", paddingHorizontal: 24 },
                text: { color: "#ffffff" },
            },
        },
    },
};
const dark = {
    container: {
        borderRadius: 28,
        backgroundColor: "#2b2930",
        boxShadow: "0px 2px 6px 2px rgba(0,0,0,0.45), 0px 1px 2px 0px rgba(0,0,0,0.6)",
    },
    header: { paddingHorizontal: 24, paddingTop: 24, gap: 16 },
    body: { paddingHorizontal: 24, paddingTop: 16 },
    title: {
        color: "#e6e0e9",
        fontSize: 24,
        fontWeight: "400",
        lineHeight: 32,
    },
    description: {
        color: "#cac4d0",
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
        gap: 8,
        justifyContent: "flex-end",
    },
    input: {
        label: { color: "#cac4d0", fontSize: 12 },
        textInput: {
            color: "#e6e0e9",
            fontSize: 16,
            borderWidth: 0,
            borderRadius: 0,
            borderBottomWidth: 1,
            borderColor: "#938f99",
            backgroundColor: "transparent",
            paddingHorizontal: 0,
            paddingVertical: 8,
        },
    },
    action: {
        button: {
            minHeight: 40,
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "transparent",
            paddingHorizontal: 12,
            paddingVertical: 10,
            minWidth: 48,
            alignItems: "center",
        },
        text: {
            color: "#d0bcff",
            fontSize: 14,
            fontWeight: "500",
            textAlign: "center",
        },
        variants: {
            primary: {
                button: { backgroundColor: "#d0bcff", paddingHorizontal: 24 },
                text: { color: "#381e72" },
            },
            secondary: {
                button: {
                    borderWidth: 1,
                    borderColor: "#938f99",
                    paddingHorizontal: 24,
                },
            },
            destructive: {
                button: { backgroundColor: "#f2b8b5", paddingHorizontal: 24 },
                text: { color: "#601410" },
            },
        },
    },
};
export const materialStyle = { light, dark };
