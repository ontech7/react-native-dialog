# react-native-dialog

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square&colorB=191A17)
[![npm](https://img.shields.io/npm/v/@ontech7/react-native-dialog.svg?style=flat-square)](https://www.npmjs.com/package/@ontech7/react-native-dialog)
[![npm](https://img.shields.io/npm/dm/@ontech/react-native-dialog.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@ontech7/react-native-dialog)

Dialog component for React Native. Compatible with Android & iOS.

Features:

- Compatible with Expo SDK >= 49 and bare projects
- `shadcn/ui` approach, with fully customizable components
- Possibility to change global styles from the `DialogProvider`
- Portalized pupup/dialog
- Modifiable duration (default: `200`)
- Modifiable tint dark/light (default: `dark`)
- Modifiable slide-in animation (default: `none`)
- Possibility to add blur layer with `BlurComponent` prop

| No Slide                                                                                    | Slide-in                                                                                       |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| ![default](https://github.com/user-attachments/assets/01d5fd43-aad5-42ea-8da1-793e9446b898) | ![slide-from](https://github.com/user-attachments/assets/2e0d3f91-4c7b-4e8c-9f56-621e8f1e79e5) |
| Global Custom styles                                                                        | Input                                                                                          |
| ![custom](https://github.com/user-attachments/assets/27069773-57de-4819-ae84-0088253b8fee)  | ![input](https://github.com/user-attachments/assets/c8bbd400-ff0a-4d42-8589-945c53d9fdf8)      |

---

## Usage

```bash
$ yarn add @ontech7/react-native-dialog react-native-portalize
# or
$ npm install @ontech7/react-native-dialog react-native-portalize
# or
$ pnpm add @ontech7/react-native-dialog react-native-portalize
```

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

// Component.tsx
import { useState, useCallback } from "react";

import {
  Dialog,
  DialogAction,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogProps
} from "@ontech7/react-native-dialog";

export default function Component(props: DialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} {...props}>
      <DialogHeader>
        <DialogTitle>
          Attention!
        </DialogTitle>
        <DialogDescription>
          This is a dialog.{"\n"}Please click one of the buttons below to
          close it.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogAction onPress={handleClose}>Close</DialogAction>
        <DialogAction onPress={handleClose}>Confirm</DialogAction>
      </DialogFooter>
    </Dialog>
  )
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

## Props

### DialogProvider

| Name           | Description                                               |
| -------------- | --------------------------------------------------------- |
| `customStyles` | Possibility to customize globally all provided components |

### Dialog

| Name            | Description                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `open`          | Possibility to customize globally all provided components                                                          |
| `tint`          | Backdrop background color. Possible values: `light`, `dark`                                                        |
| `animation`     | Enable or disable animations (default: `true`)                                                                     |
| `duration`      | Duration of the animations                                                                                         |
| `slideFrom`     | Animation slide-in. Possible values: `none`, `bottom`, `top`, `left`, `right`                                      |
| `BlurComponent` | Possibility to add BlurView such as `expo-blur`, `@react-native-community/blur` or `@sbaiahmed1/react-native-blur` |

## Example

Here are simple examples:

- https://snack.expo.dev/@dontrok1/react-native-dialog-simple-example
- Check [example folder](/example/)

## Credits

Written by [Andrea Losavio](https://linkedin.com/in/andrea-losavio).
