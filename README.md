# react-native-dialog

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square&colorB=191A17)
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://snack.expo.io/@dontrok1/react-native-dialog-simple-example)
[![npm](https://img.shields.io/npm/v/@ontech7/react-native-dialog.svg?style=flat-square)](https://www.npmjs.com/package/@ontech7/react-native-dialog)
[![npm](https://img.shields.io/npm/dm/@ontech7/react-native-dialog.svg?style=flat-square&colorB=red)](https://www.npmjs.com/package/@ontech7/react-native-dialog)
[![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@ontech7/react-native-dialog)

Simple and lightweight dialog component for React Native, structure similar to shadcn/ui, with dimezis background blur. Compatible with Android & iOS.

**Features**:

- Compatible with Expo SDK >= 49 and bare projects
- `shadcn/ui` approach, with fully customizable components
- Possibility to change global styles from the `DialogProvider`
- Portalized pupup/dialog
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
<td> <a href="https://ui.shadcn.com/" target="_blank"><b>Shadcn/ui</b></a> <br /><br /> <img src="https://github.com/user-attachments/assets/3540789d-1f61-41cc-825b-a7d5ae9467f7" /> </td>
<td>

```jsx
import { DialogProvider, shadcnStyle } from "@ontech7/react-native-dialog";

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
    <Dialog open={open} {...props}>
      <DialogHeader>
        <DialogTitle>Attention!</DialogTitle>
        <DialogDescription>
          This is a dialog.{"\n"}Please click one of the buttons below to close
          it.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogAction onPress={handleClose}>Close</DialogAction>
        <DialogAction onPress={handleClose}>Confirm</DialogAction>
      </DialogFooter>
    </Dialog>
  );
}
```

## Blur Component

It's possible to add blur component to Dialog, such as `expo-blur`, `@react-native-community/blur` or `@sbaiahmed1/react-native-blur`.

By defalt it has a 25% intensity and a downsample factor of 8. They should be enough and not so much expensive on hardware acceleration.

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

![blur](https://github.com/user-attachments/assets/e46fd559-66d2-4f90-9cb3-234058857c9f)

## Props

### DialogProvider

| Name           | Description                                               |
| -------------- | --------------------------------------------------------- |
| customStyles | Possibility to customize globally all provided components |

### Dialog

| Name            | Description                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| open          | Show/hide dialog (default: `true`)                                                                                 |
| onPressOut    | Add callback when pressing out of the dialog                                                                       |
| tint          | Backdrop background color. Possible values: `light`, `dark` (default: `dark`)                                      |
| animation     | Enable or disable animations (default: `true`)                                                                     |
| duration      | Duration of the animations (default: `200`)                                                                        |
| delay         | Delay when opening the dialog (default: `0`)                                                                       |
| slideFrom     | Animation slide-in. Possible values: `none`, `bottom`, `top`, `left`, `right`, `center`. (default: `none`)         |
| BlurComponent | Possibility to add BlurView such as `expo-blur`, `@react-native-community/blur` or `@sbaiahmed1/react-native-blur` |

---

## Example

Here are simple examples:

- [Expo Snack - Simple example](https://snack.expo.dev/@dontrok1/react-native-dialog-simple-example)
- [Expo Snack - Input example](https://snack.expo.dev/@dontrok1/react-native-dialog-input-example)
- Check [example folder](/example/)

---

## Credits

Written by [Andrea Losavio](https://linkedin.com/in/andrea-losavio).
