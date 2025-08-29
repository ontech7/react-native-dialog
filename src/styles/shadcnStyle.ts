import { DialogStyleConfig } from "../DialogProvider";

export const shadcnStyle: DialogStyleConfig = {
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#e5e5e5",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 0 0 #0000, 0 0 0 #0000, 0 10px 15px -3px #00000010, 0 4px 6px -4px #00000010",
  },
  title: {
    color: "#0a0a0a",
  },
  description: {
    color: "#737373",
  },
  footer: {
    gap: 8,
  },
  body: {
    gap: 8,
  },
  input: {
    label: {
      color: "#0a0a0a",
    },
    textInput: {
      fontSize: 14,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#e5e5e5",
      paddingHorizontal: 12,
      paddingVertical: 4,
      boxShadow: "0 0 0 #0000, 0 0 0 #0000, 0 1px 2px 0 #00000010",
    },
  },
  action: {
    button: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#e5e5e5",
      backgroundColor: "#ffffff",
      paddingHorizontal: 16,
      paddingVertical: 8,
      boxShadow: "0 0 0 #0000, 0 0 0 #0000, 0 1px 2px 0 #00000010",
    },
    text: {
      fontSize: 14,
      fontWeight: "500",
    },
  },
};
