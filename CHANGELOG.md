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
