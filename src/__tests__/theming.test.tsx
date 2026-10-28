import React from "react";
import { StyleSheet } from "react-native";
import { render, screen } from "@testing-library/react-native";

import {
  Dialog,
  DialogAction,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogInput,
  DialogProvider,
  DialogTitle,
  extendDialogTheme,
  materialStyle,
  shadcnStyle,
  type DialogProviderProps,
} from "..";

async function renderThemed(
  providerProps: Omit<DialogProviderProps, "children">,
  children: React.ReactNode
) {
  await render(
    <DialogProvider {...providerProps}>
      <Dialog testID="dialog">{children}</Dialog>
    </DialogProvider>
  );
}

describe("DialogProvider styles", () => {
  it("applies every customStyles slot to its component", async () => {
    await renderThemed(
      {
        customStyles: {
          container: { backgroundColor: "#111" },
          header: { paddingTop: 1 },
          body: { paddingTop: 2 },
          footer: { paddingTop: 3 },
          title: { color: "#222" },
          description: { color: "#333" },
          input: {
            wrapper: { marginTop: 4 },
            label: { color: "#444" },
            textInput: { color: "#555" },
          },
          action: { button: { paddingTop: 5 }, text: { color: "#666" } },
        },
      },
      <>
        <DialogHeader testID="header">
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Desc</DialogDescription>
        </DialogHeader>
        <DialogBody testID="body">
          <DialogInput label="Name" placeholder="Your name" />
        </DialogBody>
        <DialogFooter testID="footer">
          <DialogAction testID="action">OK</DialogAction>
        </DialogFooter>
      </>
    );

    expect(screen.getByTestId("dialog")).toHaveStyle({
      backgroundColor: "#111",
    });
    expect(screen.getByTestId("header")).toHaveStyle({ paddingTop: 1 });
    expect(screen.getByTestId("body")).toHaveStyle({ paddingTop: 2 });
    expect(screen.getByTestId("footer")).toHaveStyle({ paddingTop: 3 });
    expect(screen.getByText("Title")).toHaveStyle({ color: "#222" });
    expect(screen.getByText("Desc")).toHaveStyle({ color: "#333" });
    expect(screen.getByText("Name")).toHaveStyle({ color: "#444" });
    expect(screen.getByPlaceholderText("Your name")).toHaveStyle({
      color: "#555",
    });
    expect(screen.getByTestId("action")).toHaveStyle({ paddingTop: 5 });
    expect(screen.getByText("OK")).toHaveStyle({ color: "#666" });
  });

  it("picks the dark styles from a theme when colorScheme is dark", async () => {
    await renderThemed(
      {
        customStyles: {
          light: { title: { color: "black" } },
          dark: { title: { color: "white" } },
        },
        colorScheme: "dark",
      },
      <DialogTitle>Title</DialogTitle>
    );

    expect(screen.getByText("Title")).toHaveStyle({ color: "white" });
  });

  it("uses `darkStyles` next to a single light config", async () => {
    await renderThemed(
      {
        customStyles: { title: { color: "black" } },
        darkStyles: { title: { color: "white" } },
        colorScheme: "dark",
      },
      <DialogTitle>Title</DialogTitle>
    );

    expect(screen.getByText("Title")).toHaveStyle({ color: "white" });
  });

  it("falls back to light styles for a null colorScheme (as useColorScheme can return)", async () => {
    await renderThemed(
      {
        customStyles: {
          light: { title: { color: "black" } },
          dark: { title: { color: "white" } },
        },
        colorScheme: null,
      },
      <DialogTitle>Title</DialogTitle>
    );

    expect(screen.getByText("Title")).toHaveStyle({ color: "black" });
  });

  it.each([
    ["header + body + footer", true, true, true],
    ["header + footer", true, false, true],
    ["body + footer", false, true, true],
    ["header + body", true, true, false],
    ["body only", false, true, false],
  ])(
    "shadcnStyle spaces sections by 16 and keeps the footer band flush (%s)",
    async (_, withHeader, withBody, withFooter) => {
      await renderThemed(
        { customStyles: shadcnStyle },
        <>
          {withHeader && (
            <DialogHeader testID="header">
              <DialogTitle>Title</DialogTitle>
            </DialogHeader>
          )}
          {withBody && <DialogBody testID="body" />}
          {withFooter && <DialogFooter testID="footer" />}
        </>
      );

      const style = (id: string) =>
        StyleSheet.flatten(screen.getByTestId(id).props.style);
      const sections = [
        withHeader && "header",
        withBody && "body",
        withFooter && "footer",
      ].filter(Boolean) as string[];

      // space before the first section, between sections, and after the last
      const top = (id: string) =>
        (style(id).paddingTop ?? 0) * (id === "footer" ? 0 : 1) +
        (style(id).marginTop ?? 0);
      const bottom = (id: string) =>
        (style(id).paddingBottom ?? 0) * (id === "footer" ? 0 : 1) +
        (style(id).marginBottom ?? 0);
      const containerBottom = style("dialog").paddingBottom ?? 0;

      if (sections[0] !== "footer") expect(top(sections[0])).toBe(16);
      for (let i = 1; i < sections.length; i++) {
        expect(bottom(sections[i - 1]) + top(sections[i])).toBe(16);
      }
      const last = sections[sections.length - 1];
      expect(bottom(last) + containerBottom).toBe(last === "footer" ? 0 : 16);
    }
  );

  it.each([
    ["shadcnStyle", shadcnStyle],
    ["materialStyle", materialStyle],
  ])("%s ships distinct light and dark text colors", async (_, preset) => {
    expect(preset.dark).toBeDefined();
    expect(preset.light.title?.color).not.toEqual(preset.dark?.title?.color);
    expect(preset.light.description?.color).not.toEqual(
      preset.dark?.description?.color
    );
  });
});

describe("DialogAction", () => {
  const themedVariants = {
    action: {
      button: { backgroundColor: "white" },
      text: { color: "black" },
      variants: {
        destructive: {
          button: { backgroundColor: "red" },
          text: { color: "white" },
        },
      },
    },
  };

  it("uses the base action style without a variant", async () => {
    await renderThemed(
      { customStyles: themedVariants },
      <DialogAction testID="action">Keep</DialogAction>
    );

    expect(screen.getByTestId("action")).toHaveStyle({
      backgroundColor: "white",
    });
    expect(screen.getByText("Keep")).toHaveStyle({ color: "black" });
  });

  it("merges the themed variant over the base style", async () => {
    await renderThemed(
      { customStyles: themedVariants },
      <DialogAction testID="action" variant="destructive">
        Delete
      </DialogAction>
    );

    expect(screen.getByTestId("action")).toHaveStyle({
      backgroundColor: "red",
    });
    expect(screen.getByText("Delete")).toHaveStyle({ color: "white" });
  });

  it("lets `style` and `textStyle` override the variant", async () => {
    await renderThemed(
      { customStyles: themedVariants },
      <DialogAction
        testID="action"
        variant="destructive"
        style={[{ backgroundColor: "orange" }]}
        textStyle={{ color: "navy" }}
      >
        Delete
      </DialogAction>
    );

    expect(screen.getByTestId("action")).toHaveStyle({
      backgroundColor: "orange",
    });
    expect(screen.getByText("Delete")).toHaveStyle({ color: "navy" });
  });

  it("uses only the themed variant when the theme defines it (no built-in fallback mixed in)", async () => {
    await renderThemed(
      {
        customStyles: {
          action: {
            text: { fontWeight: "500" },
            variants: { destructive: { text: { color: "white" } } },
          },
        },
      },
      <DialogAction variant="destructive">Delete</DialogAction>
    );

    expect(screen.getByText("Delete")).toHaveStyle({
      color: "white",
      fontWeight: "500",
    });
  });

  it.each([
    ["shadcnStyle", shadcnStyle],
    ["materialStyle", materialStyle],
  ])(
    "%s gives every variant the same minimum height as the base action",
    async (_, preset) => {
      const base = preset.light.action?.button?.minHeight;
      expect(base).toBeGreaterThanOrEqual(36);

      for (const variant of ["primary", "secondary", "destructive"] as const) {
        const themed = preset.light.action?.variants?.[variant];
        expect(themed).toBeDefined();
        expect(themed?.button?.minHeight ?? base).toBe(base);
      }
    }
  );

  it("still distinguishes a destructive action when the theme defines no variants", async () => {
    await renderThemed(
      { customStyles: { action: { text: { color: "black" } } } },
      <DialogAction variant="destructive">Delete</DialogAction>
    );

    expect(screen.getByText("Delete")).not.toHaveStyle({ color: "black" });
  });

  it.each([
    ["shadcnStyle", shadcnStyle],
    ["materialStyle", materialStyle],
  ])(
    "%s styles primary and destructive differently from the base action",
    async (_, preset) => {
      const { light } = preset;

      for (const variant of ["primary", "destructive"] as const) {
        const themed = light.action?.variants?.[variant];
        expect(themed).toBeDefined();
        expect({ ...light.action?.text, ...themed?.text }).not.toEqual(
          light.action?.text
        );
      }
    }
  );

  it("dims a disabled action and reports it as disabled", async () => {
    await renderThemed(
      {},
      <DialogAction testID="action" disabled>
        Save
      </DialogAction>
    );

    expect(screen.getByTestId("action")).toHaveStyle({ opacity: 0.5 });
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});

describe("DialogInput", () => {
  it("accepts style arrays for wrapperStyle and labelStyle", async () => {
    await renderThemed(
      {},
      <DialogInput
        testID="input"
        label="Name"
        wrapperStyle={[{ marginTop: 9 }]}
        labelStyle={[{ color: "teal" }]}
      />
    );

    expect(screen.getByText("Name")).toHaveStyle({ color: "teal" });
  });

  it("uses the label as the input's accessible name", async () => {
    await renderThemed({}, <DialogInput label="Username" />);

    expect(screen.getByLabelText("Username")).toBeOnTheScreen();
  });
});

describe("extendDialogTheme", () => {
  it("overrides a nested slot and keeps the rest of the preset", () => {
    const theme = extendDialogTheme(shadcnStyle, {
      action: { text: { color: "#2563eb" } },
    });

    expect(theme.light.action?.text).toEqual({
      color: "#2563eb",
      fontSize: 14,
      fontWeight: "500",
    });
    expect(theme.light.container).toEqual(shadcnStyle.light.container);
    expect(theme.dark?.action?.text?.color).toBe("#2563eb");
    expect(theme.dark?.container).toEqual(shadcnStyle.dark?.container);
  });

  it("applies light and dark overrides separately", () => {
    const theme = extendDialogTheme(shadcnStyle, {
      light: { title: { color: "navy" } },
      dark: { title: { color: "skyblue" } },
    });

    expect(theme.light.title?.color).toBe("navy");
    expect(theme.dark?.title?.color).toBe("skyblue");
    expect(theme.light.title?.fontSize).toBe(18);
  });

  it("keeps a light-only base light-only, so `darkStyles` still applies", async () => {
    const theme = extendDialogTheme(
      { title: { color: "black" } },
      { title: { fontSize: 30 } }
    );

    expect(theme.dark).toBeUndefined();

    await renderThemed(
      {
        customStyles: theme,
        darkStyles: { title: { color: "white" } },
        colorScheme: "dark",
      },
      <DialogTitle>Title</DialogTitle>
    );
    expect(screen.getByText("Title")).toHaveStyle({ color: "white" });
  });

  it("does not mutate the preset", () => {
    const before = JSON.stringify(shadcnStyle);

    extendDialogTheme(shadcnStyle, { title: { color: "navy" } });

    expect(JSON.stringify(shadcnStyle)).toBe(before);
  });

  it("replaces array values instead of merging them index by index", () => {
    const theme = extendDialogTheme(
      { container: { transform: [{ scale: 1 }, { rotate: "1deg" }] } },
      { container: { transform: [{ scale: 2 }] } }
    );

    expect(theme.light.container?.transform).toEqual([{ scale: 2 }]);
  });

  it("drives the dialog through DialogProvider", async () => {
    await renderThemed(
      {
        customStyles: extendDialogTheme(materialStyle, {
          dark: { title: { color: "gold" } },
        }),
        colorScheme: "dark",
      },
      <DialogTitle>Title</DialogTitle>
    );

    expect(screen.getByText("Title")).toHaveStyle({
      color: "gold",
      fontSize: 24,
    });
  });
});
