import React from "react";
import {
  AccessibilityInfo,
  BackHandler,
  Keyboard,
  LayoutAnimation,
  Modal,
  StyleSheet,
  Text,
  View,
  type KeyboardEvent,
} from "react-native";
import {
  act,
  fireEvent,
  isHiddenFromAccessibility,
  render,
  screen,
  within,
} from "@testing-library/react-native";

import {
  Dialog,
  DialogAction,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogTitle,
} from "..";

// Jest's mocked window is 750x1334.
const WINDOW_HEIGHT = 1334;

/** Collects the handlers a dialog registers on a mocked RN event source. */
function captureListeners(
  target: { addListener?: unknown; addEventListener?: unknown },
  method: "addListener" | "addEventListener"
) {
  const listeners: Record<string, ((...args: any[]) => any)[]> = {};
  const removed: ((...args: any[]) => any)[] = [];

  jest
    .spyOn(target as any, method)
    .mockImplementation((event: any, handler: any) => {
      (listeners[event] ??= []).push(handler);
      return { remove: () => removed.push(handler) };
    });

  const active = (event: string) =>
    (listeners[event] ?? []).filter((h) => !removed.includes(h));

  return {
    listeners,
    active,
    isActive: (event: string) => active(event).length > 0,
    emit: (event: string, ...args: any[]) =>
      (listeners[event] ?? [])
        .filter((h) => !removed.includes(h))
        .map((h) => h(...args)),
  };
}

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("style props", () => {
  it("DialogDescription merges `style` over the themed style", async () => {
    await render(
      <DialogProvider customStyles={{ description: { color: "red" } }}>
        <Dialog>
          <DialogDescription style={{ color: "blue", lineHeight: 22 }}>
            Desc
          </DialogDescription>
        </Dialog>
      </DialogProvider>
    );

    expect(screen.getByText("Desc")).toHaveStyle({
      color: "blue",
      lineHeight: 22,
    });
  });

  it("DialogTitle applies `style` to its Text", async () => {
    await render(
      <DialogProvider customStyles={{ title: { color: "red" } }}>
        <Dialog>
          <DialogTitle style={{ color: "blue", letterSpacing: 1 }}>
            Title
          </DialogTitle>
        </Dialog>
      </DialogProvider>
    );

    expect(screen.getByText("Title")).toHaveStyle({
      color: "blue",
      letterSpacing: 1,
    });
  });

  it("Dialog `style` wins over the themed container style", async () => {
    await render(
      <DialogProvider customStyles={{ container: { borderRadius: 4 } }}>
        <Dialog testID="dialog" style={{ borderRadius: 30, maxHeight: 200 }} />
      </DialogProvider>
    );

    expect(screen.getByTestId("dialog")).toHaveStyle({
      borderRadius: 30,
      maxHeight: 200,
    });
  });
});

describe("dismissing", () => {
  it("does not call onPressOut when tapping non-touchable content inside the dialog", async () => {
    const onPressOut = jest.fn();

    await render(
      <DialogProvider>
        <Dialog onPressOut={onPressOut}>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Text>Plain text</Text>
          </DialogBody>
        </Dialog>
      </DialogProvider>
    );

    await fireEvent.press(screen.getByText("Title"));
    await fireEvent.press(screen.getByText("Desc"));
    await fireEvent.press(screen.getByText("Plain text"));

    expect(onPressOut).not.toHaveBeenCalled();
  });

  it("calls onPressOut when tapping the backdrop", async () => {
    const onPressOut = jest.fn();

    await render(
      <DialogProvider>
        <Dialog testID="dialog" onPressOut={onPressOut}>
          <DialogFooter>
            <DialogAction>OK</DialogAction>
          </DialogFooter>
        </Dialog>
      </DialogProvider>
    );

    await fireEvent.press(screen.getByTestId("dialog-backdrop"));

    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it("calls onRequestClose when tapping the backdrop", async () => {
    const onRequestClose = jest.fn();

    await render(
      <DialogProvider>
        <Dialog testID="dialog" onRequestClose={onRequestClose} />
      </DialogProvider>
    );

    await fireEvent.press(screen.getByTestId("dialog-backdrop"));

    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });

  it("calls only onRequestClose when onPressOut is passed too", async () => {
    const onRequestClose = jest.fn();
    const onPressOut = jest.fn();

    await render(
      <DialogProvider>
        <Dialog
          testID="dialog"
          onRequestClose={onRequestClose}
          onPressOut={onPressOut}
        />
      </DialogProvider>
    );

    await fireEvent.press(screen.getByTestId("dialog-backdrop"));

    expect(onRequestClose).toHaveBeenCalledTimes(1);
    expect(onPressOut).not.toHaveBeenCalled();
  });

  it("falls back to onPressOut for the Android back button (1.3 apps keep working)", async () => {
    const back = captureListeners(BackHandler, "addEventListener");
    const onPressOut = jest.fn();

    await render(
      <DialogProvider>
        <Dialog onPressOut={onPressOut} />
      </DialogProvider>
    );

    await act(async () => back.emit("hardwareBackPress"));

    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it("ignores backdrop taps and action presses while the close animation runs", async () => {
    const onRequestClose = jest.fn();
    const onAction = jest.fn();

    const ui = (open: boolean) => (
      <DialogProvider>
        <Dialog testID="dialog" open={open} onRequestClose={onRequestClose}>
          <DialogFooter>
            <DialogAction onPress={onAction}>OK</DialogAction>
          </DialogFooter>
        </Dialog>
      </DialogProvider>
    );

    await render(ui(true));
    await screen.rerender(ui(false));

    // still mounted: the fade-out is running
    expect(screen.getByText("OK")).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId("dialog-backdrop"));
    await fireEvent.press(screen.getByText("OK"));

    expect(onRequestClose).not.toHaveBeenCalled();
    expect(onAction).not.toHaveBeenCalled();
  });

  it("closes on the Android back button while open, consuming the event", async () => {
    const back = captureListeners(BackHandler, "addEventListener");
    const onRequestClose = jest.fn();

    const ui = (open: boolean) => (
      <DialogProvider>
        <Dialog open={open} onRequestClose={onRequestClose} />
      </DialogProvider>
    );

    await render(ui(true));

    const results = await act(async () => back.emit("hardwareBackPress"));
    expect(results).toEqual([true]);
    expect(onRequestClose).toHaveBeenCalledTimes(1);

    await screen.rerender(ui(false));
    expect(back.isActive("hardwareBackPress")).toBe(false);
  });

  it("blocks the Android back button while open, even without onRequestClose", async () => {
    const back = captureListeners(BackHandler, "addEventListener");

    await render(
      <DialogProvider>
        <Dialog onPressOut={() => {}} />
      </DialogProvider>
    );

    // a non-dismissible dialog must not let the press reach the screen behind
    const results = await act(async () => back.emit("hardwareBackPress"));
    expect(results.at(-1)).toBe(true);
  });

  it("keeps the topmost dialog first for the back button when a lower one changes onRequestClose", async () => {
    const back = captureListeners(BackHandler, "addEventListener");
    const closeLower = jest.fn();
    const closeUpper = jest.fn();

    const ui = (saving: boolean, upperOpen: boolean) => (
      <DialogProvider>
        <Dialog onRequestClose={saving ? undefined : closeLower} />
        <Dialog open={upperOpen} onRequestClose={closeUpper} />
      </DialogProvider>
    );

    await render(ui(true, false));
    await screen.rerender(ui(true, true));
    await screen.rerender(ui(false, true));

    // BackHandler calls the most recently registered handler first
    await act(async () => back.active("hardwareBackPress").at(-1)?.());

    expect(closeUpper).toHaveBeenCalledTimes(1);
    expect(closeLower).not.toHaveBeenCalled();
  });

  it("registers the back handler once, even when onRequestClose changes every render", async () => {
    const spy = jest.spyOn(BackHandler, "addEventListener");

    const ui = () => (
      <DialogProvider>
        <Dialog onRequestClose={() => {}} />
      </DialogProvider>
    );

    await render(ui());
    await screen.rerender(ui());
    await screen.rerender(ui());

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls onRequestClose on the iOS accessibility escape gesture", async () => {
    const onRequestClose = jest.fn();

    await render(
      <DialogProvider>
        <Dialog testID="dialog" onRequestClose={onRequestClose} />
      </DialogProvider>
    );

    await fireEvent(screen.getByTestId("dialog"), "accessibilityEscape");

    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });
});

describe("lifecycle callbacks", () => {
  it("plays the entrance animation when mounted already open", async () => {
    jest.useFakeTimers();
    const onShow = jest.fn();

    await render(
      <DialogProvider>
        <Dialog testID="dialog" duration={200} onShow={onShow} />
      </DialogProvider>
    );
    // starts hidden instead of popping in fully visible
    expect(screen.getByTestId("dialog")).toHaveStyle({ opacity: 0 });
    expect(onShow).not.toHaveBeenCalled();

    // (the native-driven value isn't re-rendered in tests: check its end)
    await act(async () => jest.advanceTimersByTime(300));
    expect(onShow).toHaveBeenCalledTimes(1);
  });

  it("calls onShow after the open animation and onDismiss after the close animation", async () => {
    jest.useFakeTimers();
    const onShow = jest.fn();
    const onDismiss = jest.fn();

    const ui = (open: boolean) => (
      <DialogProvider>
        <Dialog
          open={open}
          duration={200}
          onShow={onShow}
          onDismiss={onDismiss}
        >
          <Text>Content</Text>
        </Dialog>
      </DialogProvider>
    );

    await render(ui(false));
    expect(onDismiss).not.toHaveBeenCalled();

    await screen.rerender(ui(true));
    expect(onShow).not.toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(300));
    expect(onShow).toHaveBeenCalledTimes(1);

    await screen.rerender(ui(false));
    expect(onDismiss).not.toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(300));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Content")).toBeNull();
  });

  it("calls onShow and onDismiss right away when animation is disabled", async () => {
    const onShow = jest.fn();
    const onDismiss = jest.fn();

    const ui = (open: boolean) => (
      <DialogProvider>
        <Dialog
          open={open}
          animation={false}
          onShow={onShow}
          onDismiss={onDismiss}
        />
      </DialogProvider>
    );

    await render(ui(false));
    await screen.rerender(ui(true));
    expect(onShow).toHaveBeenCalledTimes(1);

    await screen.rerender(ui(false));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("layout", () => {
  it("caps the dialog height to the window when the body is scrollable", async () => {
    await render(
      <DialogProvider>
        <Dialog testID="dialog">
          <DialogBody scrollable />
        </Dialog>
      </DialogProvider>
    );

    expect(screen.getByTestId("dialog")).toHaveStyle({
      maxHeight: WINDOW_HEIGHT - 2 * 64,
    });
  });

  it("does not cap the height without a scrollable body (nothing could shrink)", async () => {
    await render(
      <DialogProvider>
        <Dialog testID="dialog">
          <DialogBody />
        </Dialog>
      </DialogProvider>
    );

    const style = StyleSheet.flatten(screen.getByTestId("dialog").props.style);
    expect(style.maxHeight).toBeUndefined();
  });

  it("DialogBody `scrollable` renders its content inside a ScrollView", async () => {
    await render(
      <DialogProvider customStyles={{ body: { paddingTop: 7 } }}>
        <Dialog>
          <DialogBody scrollable testID="body">
            <Text>Long content</Text>
          </DialogBody>
        </Dialog>
      </DialogProvider>
    );

    const scrollView = screen.getByTestId("body").children[0] as any;
    expect(scrollView.type).toBe("RCTScrollView");
    expect(within(scrollView).getByText("Long content")).toBeOnTheScreen();
  });

  it("DialogBody `scrollable` keeps the body's box styles and props on the body, scrolling only its content", async () => {
    const onLayout = jest.fn();

    await render(
      <DialogProvider
        customStyles={{
          body: {
            paddingTop: 7,
            paddingHorizontal: 5,
            gap: 4,
            backgroundColor: "pink",
            marginTop: 8,
          },
        }}
      >
        <Dialog>
          <DialogBody
            scrollable
            testID="body"
            onLayout={onLayout}
            style={{ paddingBottom: 3 }}
          >
            <Text>Long content</Text>
          </DialogBody>
        </Dialog>
      </DialogProvider>
    );

    const body = screen.getByTestId("body");
    // same box as a plain body; the vertical padding stays put, so scrolled
    // content is clipped below the header instead of sliding against it
    expect(body).toHaveStyle({
      backgroundColor: "pink",
      marginTop: 8,
      paddingTop: 7,
      paddingBottom: 3,
    });
    expect(body.props.onLayout).toBe(onLayout);

    const scrollView = body.children[0] as any;
    const content = StyleSheet.flatten(scrollView.props.contentContainerStyle);
    expect(content).toEqual({ paddingHorizontal: 5, gap: 4 });
  });

  it("moves the dialog above the keyboard and shrinks its max height", async () => {
    const keyboard = captureListeners(Keyboard, "addListener");

    await render(
      <DialogProvider>
        <Dialog testID="dialog">
          <DialogBody scrollable />
        </Dialog>
      </DialogProvider>
    );

    const event = {
      endCoordinates: { height: 300, screenX: 0, screenY: 1034, width: 750 },
    } as KeyboardEvent;

    // jest runs as iOS; with the keyboard up the margins shrink to 16, so a
    // regular form still fits on small phones
    await act(async () => keyboard.emit("keyboardWillShow", event));
    expect(screen.getByTestId("dialog")).toHaveStyle({
      maxHeight: WINDOW_HEIGHT - 300 - 2 * 16,
    });

    await act(async () => keyboard.emit("keyboardWillHide", event));
    expect(screen.getByTestId("dialog")).toHaveStyle({
      maxHeight: WINDOW_HEIGHT - 2 * 64,
    });
  });

  it("corrects the keyboard height from the did* events on iOS", async () => {
    const keyboard = captureListeners(Keyboard, "addListener");

    await render(
      <DialogProvider>
        <Dialog testID="dialog">
          <DialogBody scrollable />
        </Dialog>
      </DialogProvider>
    );

    // e.g. the dialog opened between keyboardWillShow and keyboardDidShow
    const event = {
      endCoordinates: { height: 300, screenX: 0, screenY: 1034, width: 750 },
    } as KeyboardEvent;
    await act(async () => keyboard.emit("keyboardDidShow", event));
    expect(screen.getByTestId("dialog")).toHaveStyle({
      maxHeight: WINDOW_HEIGHT - 300 - 2 * 16,
    });

    await act(async () => keyboard.emit("keyboardDidHide", event));
    expect(screen.getByTestId("dialog")).toHaveStyle({
      maxHeight: WINDOW_HEIGHT - 2 * 64,
    });
  });

  it("does not schedule a layout animation when the keyboard height is unchanged", async () => {
    const keyboard = captureListeners(Keyboard, "addListener");
    const configureNext = jest
      .spyOn(LayoutAnimation, "configureNext")
      .mockImplementation(() => {});

    await render(
      <DialogProvider>
        <Dialog testID="dialog" />
      </DialogProvider>
    );

    // switching focus between two inputs fires keyboardWillShow again
    const event = {
      duration: 250,
      easing: "keyboard",
      endCoordinates: { height: 300, screenX: 0, screenY: 1034, width: 750 },
    } as KeyboardEvent;
    await act(async () => keyboard.emit("keyboardWillShow", event));
    await act(async () => keyboard.emit("keyboardWillShow", event));

    expect(configureNext).toHaveBeenCalledTimes(1);
  });

  it("ignores the keyboard when avoidKeyboard is false", async () => {
    const keyboard = captureListeners(Keyboard, "addListener");

    await render(
      <DialogProvider>
        <Dialog testID="dialog" avoidKeyboard={false} />
      </DialogProvider>
    );

    expect(keyboard.isActive("keyboardWillShow")).toBe(false);
  });
});

describe("accessibility", () => {
  it("hides the app behind an open dialog from screen readers", async () => {
    const ui = (open: boolean) => (
      <DialogProvider>
        <View testID="app" />
        <Dialog open={open} animation={false} testID="dialog" />
      </DialogProvider>
    );

    await render(ui(false));
    expect(isHiddenFromAccessibility(screen.getByTestId("app"))).toBe(false);

    await screen.rerender(ui(true));
    const app = screen.getByTestId("app", { includeHiddenElements: true });
    expect(isHiddenFromAccessibility(app)).toBe(true);
    expect(isHiddenFromAccessibility(screen.getByTestId("dialog"))).toBe(false);
  });

  it("makes only the topmost of stacked dialogs modal for screen readers", async () => {
    const ui = (upperOpen: boolean) => (
      <DialogProvider>
        <Dialog testID="lower" animation={false}>
          <Text>Lower</Text>
        </Dialog>
        <Dialog testID="upper" open={upperOpen} animation={false}>
          <Text>Upper</Text>
        </Dialog>
      </DialogProvider>
    );

    await render(ui(true));
    expect(screen.getByText("Upper")).toBeOnTheScreen();
    expect(screen.queryByText("Lower")).toBeNull(); // hidden behind the upper one

    await screen.rerender(ui(false));
    expect(screen.getByText("Lower")).toBeOnTheScreen();
  });

  it("exposes the title as a header and actions as buttons", async () => {
    await render(
      <DialogProvider>
        <Dialog>
          <DialogTitle>Delete note?</DialogTitle>
          <DialogAction>Delete</DialogAction>
        </Dialog>
      </DialogProvider>
    );

    expect(
      screen.getByRole("header", { name: "Delete note?" })
    ).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Delete" })).toBeOnTheScreen();
  });

  it("shares one reduce-motion subscription between all dialogs", async () => {
    // already a mock in the RN preset: drop the calls made by earlier tests
    const addEventListener = jest.spyOn(AccessibilityInfo, "addEventListener");
    addEventListener.mockClear();

    await render(
      <DialogProvider>
        <Dialog open={false} />
        <Dialog open={false} />
        <Dialog open={false} />
      </DialogProvider>
    );

    const reduceMotionSubscriptions = addEventListener.mock.calls.filter(
      ([event]) => (event as string) === "reduceMotionChanged"
    );
    expect(reduceMotionSubscriptions).toHaveLength(1);
  });

  it("only fades (no slide) when the OS asks to reduce motion", async () => {
    jest
      .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
      .mockResolvedValueOnce(true);

    await render(
      <DialogProvider>
        <Dialog testID="dialog" slideFrom="bottom" />
      </DialogProvider>
    );

    const style = StyleSheet.flatten(screen.getByTestId("dialog").props.style);
    expect(style.transform).toBeUndefined();
  });

  it("slides when reduce motion is off", async () => {
    await render(
      <DialogProvider>
        <Dialog testID="dialog" slideFrom="bottom" />
      </DialogProvider>
    );

    const style = StyleSheet.flatten(screen.getByTestId("dialog").props.style);
    expect(style.transform).toEqual([{ translateY: expect.any(Number) }]);
  });

  it("keeps only the newest dialog modal across nested hosts", async () => {
    const ui = (innerOpen: boolean) => (
      <DialogProvider>
        <Dialog animation={false}>
          <Text>Outer</Text>
        </Dialog>
        <View>
          <DialogProvider>
            <Dialog open={innerOpen} animation={false}>
              <Text>Inner</Text>
            </Dialog>
          </DialogProvider>
        </View>
      </DialogProvider>
    );

    await render(ui(false));
    await screen.rerender(ui(true));

    expect(screen.getByText("Inner")).toBeOnTheScreen();
  });
});

describe("stacking", () => {
  const overlayZIndex = (testID: string) =>
    StyleSheet.flatten(
      screen.getByTestId(`${testID}-backdrop`, { includeHiddenElements: true })
        .parent!.props.style
    ).zIndex;

  it("draws a dialog reopened during its close animation above the ones opened meanwhile", async () => {
    const ui = (a: boolean, b: boolean) => (
      <DialogProvider>
        <Dialog testID="a" open={a} />
        <Dialog testID="b" open={b} />
      </DialogProvider>
    );

    await render(ui(true, false));
    await screen.rerender(ui(false, false)); // A starts closing, still mounted
    await screen.rerender(ui(false, true)); // B opens on top
    await screen.rerender(ui(true, true)); // A reopens: now the newest

    expect(overlayZIndex("a")).toBeGreaterThan(overlayZIndex("b"));
  });
});

describe("portal host", () => {
  it("hosts a nested provider's dialogs where it is mounted by default, e.g. inside a Modal", async () => {
    await render(
      <DialogProvider>
        <Modal visible testID="modal">
          <DialogProvider>
            <Dialog>
              <DialogTitle>Inside modal</DialogTitle>
            </Dialog>
          </DialogProvider>
        </Modal>
      </DialogProvider>
    );

    expect(
      within(screen.getByTestId("modal")).getByText("Inside modal")
    ).toBeOnTheScreen();
  });

  it("renders a `host={false}` provider's dialogs at the parent host, with its styles", async () => {
    await render(
      <DialogProvider customStyles={{ title: { color: "green" } }}>
        <View testID="section">
          <DialogProvider
            host={false}
            customStyles={{ title: { color: "red" } }}
          >
            <Dialog>
              <DialogTitle>Nested</DialogTitle>
            </Dialog>
          </DialogProvider>
        </View>
      </DialogProvider>
    );

    // The open dialog hides the rest of the app from accessibility queries.
    const section = screen.getByTestId("section", {
      includeHiddenElements: true,
    });
    expect(
      within(section).queryByText("Nested", { includeHiddenElements: true })
    ).toBeNull();
    expect(screen.getByText("Nested")).toHaveStyle({ color: "red" });
  });

  it("leaves the back button alone when nothing is shown (no DialogProvider)", async () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const back = captureListeners(BackHandler, "addEventListener");

    await render(<Dialog />);

    expect(back.isActive("hardwareBackPress")).toBe(false);
  });

  it("warns instead of failing silently without a DialogProvider", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    await render(
      <Dialog>
        <Text>Orphan</Text>
      </Dialog>
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("DialogProvider")
    );
  });
});
