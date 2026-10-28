import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { Dialog, DialogProvider, useDialog, type DialogController } from "..";

/** Renders a provider and hands back the controller seen by a child component. */
async function renderController(
  wrap: (child: React.ReactElement) => React.ReactElement = (child) => (
    <DialogProvider>{child}</DialogProvider>
  )
) {
  let controller!: DialogController;

  function Grab() {
    controller = useDialog();
    return null;
  }

  await render(wrap(<Grab />));
  return controller;
}

describe("useDialog", () => {
  it("confirm() resolves true when the confirm action is pressed", async () => {
    const dialog = await renderController();

    let answer: Promise<boolean>;
    await act(async () => {
      answer = dialog.confirm({
        title: "Delete note?",
        description: "This cannot be undone.",
        confirmLabel: "Delete",
        cancelLabel: "Keep",
      });
    });

    expect(screen.getByText("Delete note?")).toBeOnTheScreen();
    expect(screen.getByText("This cannot be undone.")).toBeOnTheScreen();

    await fireEvent.press(screen.getByText("Delete"));
    await expect(answer!).resolves.toBe(true);
  });

  it("confirm() resolves false when the cancel action is pressed", async () => {
    const dialog = await renderController();

    let answer: Promise<boolean>;
    await act(async () => {
      answer = dialog.confirm({ title: "Leave?" });
    });

    await fireEvent.press(screen.getByText("Cancel"));
    await expect(answer!).resolves.toBe(false);
  });

  it("confirm() resolves false when dismissed from the backdrop", async () => {
    const dialog = await renderController();

    let answer: Promise<boolean>;
    await act(async () => {
      answer = dialog.confirm({
        title: "Leave?",
        dialogProps: { testID: "confirm" },
      });
    });

    await fireEvent.press(screen.getByTestId("confirm-backdrop"));
    await expect(answer!).resolves.toBe(false);
  });

  it("keeps the dialog open on backdrop taps when dismissible is false", async () => {
    const dialog = await renderController();

    const settled = jest.fn();
    await act(async () => {
      dialog
        .confirm({
          title: "Required",
          dismissible: false,
          dialogProps: { testID: "confirm" },
        })
        .then(settled);
    });

    await fireEvent.press(screen.getByTestId("confirm-backdrop"));

    expect(settled).not.toHaveBeenCalled();
    expect(screen.getByText("Required")).toBeOnTheScreen();
  });

  it("alert() resolves when its single action is pressed", async () => {
    const dialog = await renderController();

    let done: Promise<void>;
    await act(async () => {
      done = dialog.alert({ title: "Saved", confirmLabel: "Got it" });
    });

    expect(screen.queryByText("Cancel")).toBeNull();
    await fireEvent.press(screen.getByText("Got it"));
    await expect(done!).resolves.toBeUndefined();
  });

  it("answers only once, even if the action is pressed twice", async () => {
    const dialog = await renderController();

    const settled = jest.fn();
    await act(async () => {
      dialog.confirm({ title: "Once" }).then(settled);
    });

    const confirm = screen.getByText("Confirm");
    await fireEvent.press(confirm);
    await fireEvent.press(confirm);

    expect(settled).toHaveBeenCalledTimes(1);
  });

  it("queues requests and shows the next one after the previous is dismissed", async () => {
    const dialog = await renderController();

    let first: Promise<boolean>;
    let second: Promise<boolean>;
    await act(async () => {
      first = dialog.confirm({
        title: "First",
        dialogProps: { animation: false },
      });
      second = dialog.confirm({
        title: "Second",
        dialogProps: { animation: false },
      });
    });

    expect(screen.getByText("First")).toBeOnTheScreen();
    expect(screen.queryByText("Second")).toBeNull();

    await fireEvent.press(screen.getByText("Confirm"));
    await expect(first!).resolves.toBe(true);

    expect(screen.queryByText("First")).toBeNull();
    expect(screen.getByText("Second")).toBeOnTheScreen();

    await fireEvent.press(screen.getByText("Cancel"));
    await expect(second!).resolves.toBe(false);
  });

  it("renders cancel as a secondary action and confirm as primary (or destructive)", async () => {
    const dialog = await renderController((child) => (
      <DialogProvider
        customStyles={{
          action: {
            text: { color: "black" },
            variants: {
              primary: { text: { color: "blue" } },
              secondary: { text: { color: "gray" } },
              destructive: { text: { color: "red" } },
            },
          },
        }}
      >
        {child}
      </DialogProvider>
    ));

    await act(async () => {
      dialog.confirm({ title: "Save?", confirmLabel: "Save" });
    });
    expect(screen.getByText("Cancel")).toHaveStyle({ color: "gray" });
    expect(screen.getByText("Save")).toHaveStyle({ color: "blue" });
    await fireEvent.press(screen.getByText("Cancel"));
  });

  it("uses the styles of the nearest provider", async () => {
    const dialog = await renderController((child) => (
      <DialogProvider customStyles={{ title: { color: "green" } }}>
        <View>
          <DialogProvider customStyles={{ title: { color: "red" } }}>
            {child}
          </DialogProvider>
        </View>
      </DialogProvider>
    ));

    await act(async () => {
      dialog.alert({ title: "Scoped" });
    });

    expect(screen.getByText("Scoped")).toHaveStyle({ color: "red" });
  });

  it("can be used from an event handler", async () => {
    const onAnswer = jest.fn();

    function Screen() {
      const dialog = useDialog();
      return (
        <TouchableOpacity
          onPress={() => {
            dialog.confirm({ title: "Go?" }).then(onAnswer);
          }}
        >
          <Text>Open</Text>
        </TouchableOpacity>
      );
    }

    await render(
      <DialogProvider>
        <Screen />
      </DialogProvider>
    );

    await fireEvent.press(screen.getByText("Open"));
    await fireEvent.press(screen.getByText("Confirm"));

    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("works from a component rendered inside a Dialog", async () => {
    function DeleteButton() {
      const dialog = useDialog();
      return (
        <TouchableOpacity
          onPress={() => {
            dialog.confirm({ title: "Really delete?" });
          }}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      );
    }

    await render(
      <DialogProvider>
        <Dialog>
          <DeleteButton />
        </Dialog>
      </DialogProvider>
    );

    await fireEvent.press(screen.getByText("Delete"));
    expect(screen.getByText("Really delete?")).toBeOnTheScreen();
  });

  it("throws a helpful error outside a DialogProvider", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    function Orphan() {
      useDialog();
      return null;
    }

    await expect(render(<Orphan />)).rejects.toThrow(/DialogProvider/);
  });
});
