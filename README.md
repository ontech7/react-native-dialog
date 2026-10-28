# react-native-dialog

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square&colorB=191A17)
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://snack.expo.io/@dontrok1/react-native-dialog-simple-example)
[![npm](https://img.shields.io/npm/v/@ontech7/react-native-dialog.svg?style=flat-square)](https://www.npmjs.com/package/@ontech7/react-native-dialog)
[![npm](https://img.shields.io/npm/dm/@ontech7/react-native-dialog.svg?style=flat-square&colorB=red)](https://www.npmjs.com/package/@ontech7/react-native-dialog)
[![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@ontech7/react-native-dialog)

Simple and lightweight dialog component for React Native, structure similar to shadcn/ui, with dimezis background blur. Compatible with Android & iOS.

**Features**:

- Compatible with Expo SDK >= 49 and bare projects (React 18+, React Native 0.71+), no native code
- `shadcn/ui` approach, with fully customizable components
- Possibility to change global styles from the `DialogProvider`
- Light & dark mode theming, with built-in `shadcnStyle` and `materialStyle` presets
- Portalized popup/dialog
- Closes on backdrop tap, Android back button and the iOS escape gesture (`onRequestClose`)
- Scrollable body for long content, with the header and footer always visible
- Action variants: `primary`, `secondary`, `destructive`
- Imperative `confirm` / `alert` dialogs with `useDialog()`
- Moves above the software keyboard
- Accessible: modal for screen readers, header and button roles, respects "reduce motion"
- Modifiable duration (default: `200`)
- Modifiable tint dark/light (default: `dark`)
- Modifiable slide-in animation (default: `none`)
- Possibility to add blur layer with `BlurComponent` prop

## Showcase

| No Slide                                                                                    | Slide-in                                                                                   |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| ![default](https://github.com/user-attachments/assets/c9dec9c0-7bb1-4cae-9e3a-94fcc9f17116) | ![slide](https://github.com/user-attachments/assets/0f1f8ef3-9b9b-4bb7-a94f-80919d82354f)  |
| **Input**                                                                                   | **Global Custom Styles**                                                                   |
| ![input](https://github.com/user-attachments/assets/f16b4a23-bc10-4bfd-81e7-09cbdee20226)   | ![custom](https://github.com/user-attachments/assets/d282916b-3db6-4ea6-a2dc-6d1cf7078d2c) |

## Custom themes / styles

<table>
<tr>
<td> Style </td> <td> Code </td>
</tr>
<tr>
<td> <a href="https://ui.shadcn.com/" target="_blank"><b>Shadcn/ui</b></a> <br /><br /> <img src="https://github.com/user-attachments/assets/3540789d-1f61-41cc-825b-a7d5ae9467f7" style="width: 320px; height: auto" /> </td>
<td>

```jsx
import {
  DialogProvider,
  shadcnStyle
} from "@ontech7/react-native-dialog";

export default function RootLayout() {
  return (
    <DialogProvider customStyles={shadcnStyle}>
      {/* ... rest of the code here ... */}
    </DialogProvider>
  )
}
```

</td>
</tr>
</table>

Two presets ship out of the box, each as a `{ light, dark }` theme: **`shadcnStyle`** (matches the shadcn/ui `Dialog`) and **`materialStyle`** (Material Design 3).

### Tweaking a preset

`extendDialogTheme` deep-merges your overrides into a preset (or into your own styles), so you only write what changes. The preset itself is never modified.

```jsx
import { extendDialogTheme, shadcnStyle } from "@ontech7/react-native-dialog";

// same overrides for light and dark
const theme = extendDialogTheme(shadcnStyle, {
  container: { borderRadius: 20 },
  action: { variants: { primary: { button: { backgroundColor: "#2563eb" } } } },
});

// or per scheme
const blueTheme = extendDialogTheme(shadcnStyle, {
  light: { title: { color: "#1d4ed8" } },
  dark: { title: { color: "#93c5fd" } },
});

<DialogProvider customStyles={theme} colorScheme={scheme}>{/* ... */}</DialogProvider>;
```

### Nested providers

A `DialogProvider` nested inside another one sets the styles for the dialogs below it, and by default also **hosts** them: they render where the nested provider is mounted. That's what you want inside a React Native `Modal` or a modal screen (e.g. expo-router `presentation: "modal"`), which the root provider can't draw over:

```jsx
<Modal visible={visible}>
  <DialogProvider customStyles={shadcnStyle}>
    {/* dialogs opened here show on top of the modal */}
  </DialogProvider>
</Modal>
```

To only scope styles for part of a screen, pass `host={false}`: its dialogs render at the parent provider, covering the whole screen even when the nested provider sits inside a `ScrollView` or a sized view. Set `host` once: changing it at runtime remounts everything below the provider.

```jsx
<DialogProvider customStyles={shadcnStyle}>
  {/* shadcn dialogs */}
  <ScrollView>
    <DialogProvider host={false} customStyles={materialStyle}>
      {/* material dialogs, still full screen */}
    </DialogProvider>
  </ScrollView>
</DialogProvider>
```

## Dark mode

`customStyles` accepts either a single `DialogStyleConfig` (light only, as before) or a `{ light, dark }` theme. All built-in presets are themes. The active variant is chosen by `colorScheme`, which **defaults to `"light"`**: you decide what drives dark mode (the OS, or your own in-app toggle):

```jsx
import { useColorScheme } from "react-native";
import { DialogProvider, shadcnStyle } from "@ontech7/react-native-dialog";

// follow the OS appearance
const scheme = useColorScheme(); // "light" | "dark" | null
<DialogProvider customStyles={shadcnStyle} colorScheme={scheme}>
  {/* ... */}
</DialogProvider>;

// or follow an in-app theme toggle
<DialogProvider customStyles={shadcnStyle} colorScheme={isDark ? "dark" : "light"}>
  {/* ... */}
</DialogProvider>;
```

Without `colorScheme` (or with anything other than `"dark"`), the light variant is used. You can also define your own styles, either as a theme or via the separate `darkStyles` prop:

```jsx
<DialogProvider
  customStyles={myLightStyles}
  darkStyles={myDarkStyles}
  colorScheme={isDark ? "dark" : "light"}
>
  {/* ... */}
</DialogProvider>
```

## Usage

```bash
$ yarn add @ontech7/react-native-dialog
# or
$ npm install @ontech7/react-native-dialog
# or
$ pnpm add @ontech7/react-native-dialog
```

You need to import the `DialogProvider` and put it in your App.js or root \_layout.tsx component.

```jsx
// _layout.tsx
import { DialogProvider } from "@ontech7/react-native-dialog";

export default function RootLayout() {
  return (
    <DialogProvider>
      {/* ... rest of the code here ... */}
    </DialogProvider>
  )
}
```

> [!IMPORTANT]
> Mount the root `DialogProvider` at a **full-screen root** (your `App.tsx` / root `_layout.tsx`). The dialog overlay is rendered in-tree relative to the provider that hosts it, so its parent must fill the screen and must not be transformed or clipped (`overflow: "hidden"`). On React Native's New Architecture (RN 0.85+ / Expo SDK 56) a parent that collapses to zero size will make the backdrop disappear. For nested providers that only scope styles, use `host={false}` (see [Nested providers](#nested-providers)).
>
> An open dialog is modal for screen readers over the content of the provider that hosts it, so wrap your navigator with the root provider: headers and tab bars rendered outside it stay reachable by VoiceOver.

```jsx
// Component.tsx
import { useState, useCallback } from "react";

import {
  Dialog,
  DialogAction,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogProps,
} from "@ontech7/react-native-dialog";

export default function Component(props: DialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onRequestClose={handleClose} {...props}>
      <DialogHeader>
        <DialogTitle>Attention!</DialogTitle>
        <DialogDescription>
          This is a dialog.{"\n"}Please click one of the buttons below to close
          it.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogAction variant="secondary" onPress={handleClose}>
          Close
        </DialogAction>
        <DialogAction variant="primary" onPress={handleClose}>
          Confirm
        </DialogAction>
      </DialogFooter>
    </Dialog>
  );
}
```

### Closing the dialog

Pass `onRequestClose` and set `open` to `false` in it. It is called when the user taps the backdrop, presses the **Android back button** (the topmost dialog handles it first) or does the iOS accessibility escape gesture. Leave it out for a dialog that can only be closed by its own actions.

While a dialog is open, the Android back button never reaches the screen behind it (like React Native's `Modal`): without `onRequestClose` it simply does nothing.

Taps on the dialog's own content never close it, and taps are ignored while the close animation runs, so an action can't fire twice.

`onPressOut` still works but is deprecated: it's kept as a fallback, called for the backdrop, the back button and the escape gesture only when `onRequestClose` isn't set.

Dialog content renders at the provider that hosts it, so React contexts provided *between* that provider and the `<Dialog>` (e.g. a screen-level theme or i18n provider) aren't available inside the dialog. Put such providers above your root `DialogProvider`, or wrap the dialog's content in them. The library's own contexts (styles, `useDialog`) are passed through for you.

### Long content

Add `scrollable` to `DialogBody` for content that can be taller than the screen (release notes, lists, terms). The body scrolls while the header and footer stay visible: with a scrollable body, the dialog is capped to the window height (minus the keyboard, when it's open). Without one, the dialog grows with its content.

```jsx
<Dialog open={open} onRequestClose={handleClose}>
  <DialogHeader>
    <DialogTitle>What's new</DialogTitle>
  </DialogHeader>
  <DialogBody scrollable>
    {notes.map((note) => (
      <DialogDescription key={note}>• {note}</DialogDescription>
    ))}
  </DialogBody>
  <DialogFooter>
    <DialogAction variant="secondary" onPress={handleClose}>Hide</DialogAction>
    <DialogAction variant="primary" onPress={update}>Update</DialogAction>
  </DialogFooter>
</Dialog>
```

### Action variants

`DialogAction` takes a `variant`: `primary`, `secondary` or `destructive`. Without it, an action uses the plain `action` style, as before. Variant styles come from the theme (`action.variants`); both presets define all three, and a theme without them still gets a sensible fallback (bold primary, dimmed secondary, red destructive).

```jsx
const myStyles = {
  action: {
    button: { borderRadius: 8 },
    text: { color: "#111" },
    variants: {
      primary: { button: { backgroundColor: "#111" }, text: { color: "#fff" } },
      destructive: { text: { color: "#dc2626" } },
    },
  },
};
```

### Imperative dialogs: `useDialog`

For quick confirmations and messages, `useDialog()` gives you a themed, promise-based replacement for `Alert.alert`. Requests are queued and shown one at a time, with the styles of the nearest `DialogProvider`.

```jsx
import { useDialog } from "@ontech7/react-native-dialog";

function DeleteButton({ onDelete }) {
  const dialog = useDialog();

  const handlePress = async () => {
    const confirmed = await dialog.confirm({
      title: "Delete this note?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      destructive: true,
    });

    if (confirmed) {
      onDelete();
      await dialog.alert({ title: "Note deleted" });
    }
  };

  return <Button title="Delete" onPress={handlePress} />;
}
```

`confirm()` resolves `true` on confirm and `false` on cancel, backdrop tap or back button. Pass `dismissible: false` to require an explicit choice, and `dialogProps` to forward any `Dialog` prop (`slideFrom`, `BlurComponent`, …).

### Keyboard

Dialogs move up when the software keyboard opens, so inputs and actions stay visible. For long forms on small phones, make the body `scrollable` so the dialog fits above the keyboard. Disable it with `avoidKeyboard={false}`.

### Testing with Jest

The package ships a CommonJS build next to the ES module one, so Jest can load it with the default React Native preset: no `transformIgnorePatterns` entry needed. Give your dialog a `testID` and its backdrop gets `` `${testID}-backdrop` ``:

```jsx
await fireEvent.press(screen.getByTestId("my-dialog-backdrop"));
```

## Blur Component

It's possible to add blur component to Dialog, such as `expo-blur`, `@react-native-community/blur` or `@sbaiahmed1/react-native-blur`.

By default it has a 25% intensity and a downsample factor of 8. They should be enough and not so much expensive on hardware acceleration.

```jsx
import { BlurView } from "@sbaiahmed1/react-native-blur";

export default function Component(props) {
  return (
    <Dialog BlurComponent={BlurView} {...props}>
      {/* ... code here ... */}
    </Dialog>
  );
}
```

Use `blurProps` to forward (and override) props on your `BlurComponent`. This is how you configure blur per SDK without the library guessing. For example, with `expo-blur` on Expo SDK 56 the Android native blur needs the new `blurMethod` + `blurTarget` API:

```jsx
import { BlurView } from "expo-blur";

<Dialog
  BlurComponent={BlurView}
  blurProps={{ blurMethod: "dimezisBlurView", blurTarget }}
  {...props}
/>;
```

> [!NOTE]
> The library no longer forces `experimentalBlurMethod="dimezisBlurView"`, which was deprecated in SDK 56 and now requires a `blurTarget`. On iOS the default blur works out of the box; for Android blur, opt in via `blurProps`.

![blur](https://github.com/user-attachments/assets/e46fd559-66d2-4f90-9cb3-234058857c9f)

## Props

### DialogProvider

| Name         | Description                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| customStyles | Global styles for all components. A `DialogStyleConfig` (light only) or a `{ light, dark }` theme (e.g. `shadcnStyle`) |
| darkStyles   | Styles applied when the active scheme is dark (when `customStyles` is a single config). Falls back to the light ones   |
| colorScheme  | Active scheme. `"dark"` selects the dark styles, anything else (including `null`) the light ones. Default: `light`     |
| host         | Render the dialogs below this provider here (default: `true`). `false` on a nested provider that only scopes styles. Don't change it at runtime |

### Dialog

Also accepts every `View` prop (`style`, `testID`, …), applied to the dialog container.

| Name           | Description                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| open           | Show/hide dialog (default: `true`)                                                                                                                      |
| onRequestClose | Called on backdrop tap, Android back button and iOS escape gesture. Omit it to make the dialog non-dismissible (back is still blocked while open)       |
| onPressOut     | **Deprecated**, use `onRequestClose`. Fallback used for backdrop, back button and escape gesture when `onRequestClose` isn't set                      |
| onShow         | Called once the open animation has finished                                                                                                             |
| onDismiss      | Called once the close animation has finished and the dialog is unmounted                                                                                |
| avoidKeyboard  | Move the dialog above the software keyboard (default: `true`)                                                                                           |
| tint           | Backdrop background color. Possible values: `light`, `dark` (default: `dark`)                                                                           |
| animation      | Enable or disable animations (default: `true`)                                                                                                          |
| duration       | Duration of the animations (default: `200`)                                                                                                             |
| delay          | Delay when opening the dialog (default: `0`)                                                                                                            |
| slideFrom      | Animation slide-in. Possible values: `none`, `bottom`, `top`, `left`, `right`, `center`. (default: `none`). Only fades when the OS asks to reduce motion |
| BlurComponent  | Possibility to add BlurView such as `expo-blur`, `@react-native-community/blur` or `@sbaiahmed1/react-native-blur`                                      |
| blurProps      | Props forwarded to (and overriding the defaults on) `BlurComponent`, e.g. `{ blurMethod: "dimezisBlurView", blurTarget }` on Expo SDK 56 expo-blur      |
| overlayColor   | Scrim color over the backdrop (and over the blur, if any). Defaults from `tint`; e.g. `rgba(0,0,0,0.5)` for a darker overlay behind a blurred dialog    |

### DialogHeader, DialogFooter

`View` props. The footer lays its actions out in a row, aligned to the end, and wraps them when they don't fit.

### DialogTitle

`Text` props (`style` is applied to the text), plus:

| Name           | Description                       |
| -------------- | --------------------------------- |
| adornmentStart | Element rendered before the title |
| adornmentEnd   | Element rendered after the title  |

### DialogDescription

`Text` props.

### DialogBody

`View` props, plus:

| Name            | Description                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------- |
| scrollable      | Render the content in a `ScrollView` that fits the dialog's max height (default: `false`)           |
| scrollViewProps | Extra props for that `ScrollView` (e.g. `showsVerticalScrollIndicator`)                             |

### DialogAction

`TouchableOpacity` props, plus:

| Name           | Description                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| variant        | `primary`, `secondary` or `destructive`. Omit it for the plain action style      |
| textStyle      | Style of the label                                                               |
| adornmentStart | Element rendered before the label                                                |
| adornmentEnd   | Element rendered after the label                                                 |

A `disabled` action is dimmed and reported as disabled to screen readers.

### DialogInput

`TextInput` props, plus:

| Name         | Description                                         |
| ------------ | --------------------------------------------------- |
| label        | Label shown above the input (and its accessible name) |
| wrapperStyle | Style of the wrapper around label and input         |
| labelStyle   | Style of the label                                  |

### useDialog()

| Method                | Description                                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `confirm(options)`    | Shows a cancel/confirm dialog. Resolves `true` on confirm, `false` otherwise                                                        |
| `alert(options)`      | Shows a single-action dialog. Resolves when it's closed                                                                             |

Options: `title`, `description`, `confirmLabel` (default `"OK"` / `"Confirm"`), `cancelLabel` (default `"Cancel"`, confirm only), `destructive` (confirm only), `dismissible` (default `true`), `dialogProps`.

### DialogStyleConfig

Every slot is optional. Each component merges its slot over its defaults, and its own `style` prop over that.

```ts
type DialogStyleConfig = {
  container?: ViewStyle; // the dialog box
  header?: ViewStyle;
  body?: ViewStyle;
  footer?: ViewStyle;
  title?: TextStyle;
  description?: TextStyle;
  input?: { wrapper?: ViewStyle; label?: TextStyle; textInput?: TextStyle };
  action?: {
    button?: ViewStyle;
    text?: TextStyle;
    variants?: {
      primary?: { button?: ViewStyle; text?: TextStyle };
      secondary?: { button?: ViewStyle; text?: TextStyle };
      destructive?: { button?: ViewStyle; text?: TextStyle };
    };
  };
};
```

---

## Example

Here are simple examples:

- [Expo Snack - Simple example](https://snack.expo.dev/@dontrok1/react-native-dialog-simple-example)
- [Expo Snack - Input example](https://snack.expo.dev/@dontrok1/react-native-dialog-input-example)
- Check [example folder](/example/): it uses the library straight from `src/`, so changes show up with fast refresh (`cd example && yarn && yarn start`)

---

## Credits

Written by [Andrea Losavio](https://linkedin.com/in/andrea-losavio).
