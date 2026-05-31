import React, { useRef, useState } from "react";

import { CustomDialog } from "@/components/CustomDialog";
import { DefaultDialog } from "@/components/DefaultDialog";
import { Divider } from "@/components/Divider";
import { InputDialog } from "@/components/InputDialog";
import { ShadcnDialog } from "@/components/ShadcnDialog";
import {
  DialogProvider,
  materialStyle,
  shadcnStyle,
} from "@ontech7/react-native-dialog";
import { BlurTargetView, BlurView } from "expo-blur";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function IndexPage() {
  const systemScheme = useColorScheme();
  const [scheme, setScheme] = useState<"light" | "dark">(
    systemScheme === "dark" ? "dark" : "light"
  );
  const isDark = scheme === "dark";

  // On Android the new expo-blur needs a BlurTargetView (the content to blur)
  // and a `blurTarget` ref passed via `blurProps`. iOS blurs natively.
  const blurTarget = useRef<View>(null);

  return (
    <View
      style={{ flex: 1, backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <TouchableOpacity
        onPress={() => setScheme(isDark ? "light" : "dark")}
        style={{
          position: "absolute",
          top: 60,
          right: 20,
          zIndex: 10,
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#262626" : "#ececec",
        }}
      >
        <Text style={{ fontSize: 20 }}>{isDark ? "☀️" : "🌙"}</Text>
      </TouchableOpacity>

      <DialogProvider colorScheme={scheme}>
        <BlurTargetView ref={blurTarget} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
              paddingHorizontal: 20,
            }}
          >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 40,
              color: isDark ? "#fafafa" : "#0a0a0a",
            }}
          >
            react-native-dialog
          </Text>

          <View style={{ gap: 20 }}>
            <DefaultDialog
              buttonLabel="OPEN DEFAULT DIALOG"
              buttonColor="blue"
              slideFrom="none"
            />

            <DefaultDialog
              buttonLabel="OPEN WITH BLUR DIALOG"
              buttonColor="red"
              slideFrom="none"
              tint={scheme}
              overlayColor="rgba(0,0,0,0.5)"
              BlurComponent={BlurView}
              blurProps={{
                intensity: 50,
                blurMethod: "dimezisBlurView",
                blurTarget,
              }}
            />
          </View>

          <Divider />

          <View style={{ gap: 20 }}>
            <DefaultDialog
              buttonLabel="OPEN NO ANIM DIALOG"
              buttonColor="brown"
              slideFrom="none"
              animation={false}
            />

            <DefaultDialog
              buttonLabel="OPEN CENTER DIALOG"
              buttonColor="blue"
              slideFrom="center"
            />
          </View>

          <View
            style={{
              position: "relative",
              height: 200,
              width: 350,
              marginTop: 40,
            }}
          >
            <DefaultDialog
              buttonLabel="OPEN TOP DIALOG"
              buttonColor="royalblue"
              slideFrom="top"
              buttonStyle={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: [{ translateX: "-50%" }],
              }}
            />

            <DefaultDialog
              buttonLabel="OPEN BOTTOM DIALOG"
              buttonColor="royalblue"
              slideFrom="bottom"
              buttonStyle={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: [{ translateX: "-50%" }],
              }}
            />

            <DefaultDialog
              buttonLabel="OPEN LEFT DIALOG"
              buttonColor="royalblue"
              slideFrom="left"
              buttonStyle={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: [{ translateY: "-50%" }],
              }}
            />

            <DefaultDialog
              buttonLabel="OPEN RIGHT DIALOG"
              buttonColor="royalblue"
              slideFrom="right"
              buttonStyle={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: [{ translateY: "-50%" }],
              }}
            />
          </View>

          <Divider />

          <View style={{ gap: 20 }}>
            <DefaultDialog
              buttonLabel="OPEN BOTTOM WITH DURATION DIALOG"
              buttonColor="brown"
              slideFrom="bottom"
              duration={1000}
            />

            <DefaultDialog
              buttonLabel="OPEN BOTTOM WITH DELAY DIALOG"
              buttonColor="midnightblue"
              slideFrom="bottom"
              delay={500}
            />
          </View>

          <Divider />

          <InputDialog
            buttonLabel="OPEN INPUT DIALOG"
            buttonColor="midnightblue"
            slideFrom="none"
          />

          <Divider />

          <DialogProvider
            colorScheme={scheme}
            customStyles={{
              container: {
                borderRadius: 0,
                backgroundColor: "#333",
              },
              footer: {
                gap: 12,
              },
              title: {
                color: "#EED202",
              },
              description: {
                color: "#fff",
              },
              action: {
                button: {
                  borderRadius: 8,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  backgroundColor: "#E0A91B",
                },
                text: {
                  fontSize: 20,
                  fontWeight: "600",
                },
              },
            }}
          >
            <CustomDialog
              buttonLabel="OPEN GLOBAL CUSTOM DIALOG"
              buttonColor="rebeccapurple"
            />
          </DialogProvider>

          {/* Presets ship as { light, dark } themes — toggle the button (top-right) to switch */}
          <DialogProvider colorScheme={scheme} customStyles={shadcnStyle}>
            <ShadcnDialog
              buttonLabel="OPEN SHADCN DIALOG"
              buttonColor="midnightblue"
              buttonStyle={{ marginTop: 20 }}
              slideFrom="center"
            />
          </DialogProvider>

          <DialogProvider colorScheme={scheme} customStyles={materialStyle}>
            <ShadcnDialog
              buttonLabel="OPEN MATERIAL DIALOG"
              buttonColor="#6750a4"
              buttonStyle={{ marginTop: 20 }}
              slideFrom="center"
            />
          </DialogProvider>
          </ScrollView>
        </BlurTargetView>
      </DialogProvider>
    </View>
  );
}
