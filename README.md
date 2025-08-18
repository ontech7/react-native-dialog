# expo-dialog

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square&colorB=191A17)
[![npm](https://img.shields.io/npm/v/@ontech7/expo-dialog.svg?style=flat-square)](https://www.npmjs.com/package/@ontech7/expo-dialog)
[![npm](https://img.shields.io/npm/dm/@ontech/expo-dialog.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@ontech7/expo-dialog)

Dialog component for Expo SDK (React Native). Compatible with Android & iOS.

Features:

- `shadcn/ui` approach, with fully customizable components
- Possibility to change global styles from the `DialogProvider`
- Portalized pupup/dialog
- Modifiable duration (default: `200`)
- Modifiable tint dark/light (default: `dark`)
- Modifiable slide-in animation (default: `none`)

---

## Usage

```bash
$ yarn add @ontech7/expo-dialog @gorhom/portal expo-blur
# or
$ npm install @ontech7/expo-dialog @gorhom/portal expo-blur
# or
$ pnpm add @ontech7/expo-dialog @gorhom/portal expo-blur
```

```jsx
// _layout.tsx
import { DialogProvider } from "@ontech7/expo-dialog";

export default function RootLayout() {
  return (
    <DialogProvider>
      {/* ... rest of the code here ... */}
    </DialogProvider>
  )
}

// Component.jsx
import { useState, useCallback } from "react";

import {
  Dialog,
  DialogAction,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@ontech7/expo-dialog";

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

## Example

Here are simple examples:

- https://snack.expo.dev/@dontrok1/expo-dialog-simple-example
- [/example folder](/example/)

## Credits

Written by [Andrea Losavio](https://linkedin.com/in/andrea-losavio).
