## v1.4.0

### Fixes

- `DialogTitle` and `DialogDescription` now apply their `style` prop (it was ignored); on `DialogTitle` it goes to the text
- Tapping non-touchable content inside the dialog (title, description, text in the body) no longer triggers `onPressOut`: the backdrop is now a separate layer behind the dialog
- Backdrop taps and action presses are ignored while the close animation runs, so a double tap can't fire an action (or close) twice
- Long content no longer has to push the footer off screen: the dialog is capped to the window height, and `<DialogBody scrollable>` (see below) scrolls inside it
- Nested `DialogProvider`s inside a sized or scrolling view (e.g. a `ScrollView`) drew the overlay relative to that view instead of the screen: pass the new `host={false}` to make them only scope styles, their dialogs then render at the parent provider. Without it, nested providers keep hosting their own dialogs as before (needed inside a `Modal`)
- `useDialog()` and the styles of the declaring provider are available to components rendered inside a `Dialog`
- A `Dialog` rendered outside a `DialogProvider` now logs a warning in development instead of silently rendering nothing
- `colorScheme` accepts `null` / `"unspecified"` (what `useColorScheme()` can return) and falls back to light
- `DialogAction` `style`, `textStyle`, and `DialogInput` `wrapperStyle` / `labelStyle` accept style arrays (`StyleProp`)
- `DialogFooter` wraps its actions when they don't fit on one line, and long labels wrap inside their button

### New

- `onRequestClose` on `Dialog`: called on backdrop tap, the Android back button (topmost dialog first) and the iOS accessibility escape gesture. `onPressOut` is deprecated in its favour
- `host` on `DialogProvider` (default `true`): `false` makes a nested provider only scope styles
- `<DialogBody scrollable>`: the body scrolls while the header and footer stay visible (`scrollViewProps` to configure the `ScrollView`)
- `variant` on `DialogAction`: `primary`, `secondary`, `destructive`, themed through `action.variants` in the provider styles, with a built-in fallback for themes that don't define them. Both presets define all three
- `useDialog()`: promise-based, themed `confirm()` / `alert()` dialogs, queued per provider
- `extendDialogTheme(base, overrides)`: deep-merge overrides into a preset (or your own styles), for both schemes or per scheme
- `onShow` / `onDismiss` on `Dialog`, called when the open / close animation finishes
- Dialogs move above the software keyboard (`avoidKeyboard`, default `true`)
- Accessibility: the topmost open dialog is modal for screen readers, `DialogTitle` has the header role, `DialogAction` the button role (disabled actions are dimmed and reported as disabled), `DialogInput` uses its `label` as accessible name, and slide/scale animations become a plain fade when the OS asks to reduce motion
- `` `${testID}-backdrop` `` test ID on the backdrop when the dialog has a `testID`
- New exported types: `DialogActionVariant`, `DialogActionStyle`, `DialogController`, `DialogAlertOptions`, `DialogConfirmOptions`

### Behavior changes

- While a dialog is open, the Android back button no longer reaches the screen behind it (it used to navigate back, or close the app, leaving the dialog open). With `onRequestClose` it closes the dialog; without it, it does nothing, like React Native's `Modal`
- The dialog is capped to the window height (64pt margins, 16pt while the keyboard is up). Content taller than that needs `<DialogBody scrollable>`: a plain body doesn't shrink, so it overflows the dialog's box (in 1.3.0 it ran off screen)

### Presets

- `shadcnStyle`: buttons are now `h-9 px-4` (36pt high) like shadcn/ui; new `primary` (filled), `secondary` (outline) and `destructive` variants; sections are 16pt apart in every combination: header + footer dialogs (e.g. a confirm) are no longer cramped, and dialogs without a header or a footer keep their spacing
- `materialStyle`: buttons are 40dp high; new `primary` (filled), `secondary` (outlined) and `destructive` (filled, error color) variants

### Package

- Ships a CommonJS build (`build/commonjs`, used as `main`) next to the ES module build (`build/module`, used as `module`), so Jest loads it with the default React Native preset, without `transformIgnorePatterns`. Types are in `build/module`. If you deep-imported files from `build/`, update the paths
- Added a test suite (Jest + React Native Testing Library) and CI

## v1.3.0

- Add dark-mode support to `DialogProvider`: `customStyles` now also accepts a `{ light, dark }` theme, plus new `darkStyles` and `colorScheme` props. `colorScheme` defaults to `light` — drive it from `useColorScheme()` or your in-app theme toggle to enable dark
- Fix the expo-blur `blurReductionFactor` prop name (was misspelled `blurReducedFactor`)
- Add the `DialogStyleTheme` type
- Rework `shadcnStyle` to match the shadcn/ui `Dialog` (default neutral tokens, `p-6`/`gap-4` spacing, `tracking-tight` title, `rounded-lg`/`rounded-md` radii, `shadow-lg`/`shadow-sm`), shipped as a light + dark theme
- Add a `materialStyle` preset (Material Design 3), also with a dark variant
- The backdrop (blur + dim) now fades in/out with the open animation instead of appearing instantly
- Add an `overlayColor` prop to set the scrim over the backdrop; the default scrim behind a blurred dialog is now a bit darker so the dialog stands out
- `DialogInput` now defaults its `cursorColor` to the themed text color, so the caret stays visible in dark mode

## v1.2.2

- Stop hardcoding the deprecated expo-blur `experimentalBlurMethod="dimezisBlurView"` on `BlurComponent`, which triggered warnings on Expo SDK 56 (deprecated prop + `dimezisBlurView` now requires `blurTarget`, otherwise it falls back to no blur)
- Add a `blurProps` prop on `Dialog` to forward/override props on `BlurComponent`, so the blur can be configured per SDK (e.g. SDK 56's `blurMethod` + `blurTarget`)

## v1.2.1

- Fix backdrop/overlay disappearing on React Native's New Architecture (RN 0.85+ / Expo SDK 56): the overlay is now sized to the window dimensions instead of `StyleSheet.absoluteFill` / `"100%"`, which relied on the Portal host's parent having a resolved size
- Bump dev dependencies to Expo SDK 56 (React 19.2, React Native 0.85)

## v1.2.0

- Add `center` animation
- Add some default styles like `shadcnStyle`
- Move `DialogAction` style to TouchableOpacity `style` and Text `textStyle`
- Change `open` to optional (by default it's `true`)
- Fix `DialogInput` structure and style

## v1.1.2

- Add `delay` prop on `Dialog` component
- Fix `DialogInput` cursor, placeholder and text color

## v1.1.1

- Fix overlay when `animation` is set to false

## v1.1.0

- Add `onPressOut` event on `Dialog` component
- Add `animation` prop on `Dialog` component
- Remove blur library (the user can import whatever blur library), no Expo necessary
- Change portal library
- Remove `react-native-reanimated` and used `react-native` library for animations
- Move from `dist` to `build`

## v1.0.0

- Add `Dialog` components
- Add `/example`
