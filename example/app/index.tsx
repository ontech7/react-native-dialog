import React from "react";

import { CustomDialog } from "@/components/CustomDialog";
import { DefaultDialog } from "@/components/DefaultDialog";
import { Divider } from "@/components/Divider";
import { InputDialog } from "@/components/InputDialog";
import { DialogProvider } from "@ontech7/react-native-dialog";
import { BlurView } from "expo-blur";
import { Text, View } from "react-native";

export default function IndexPage() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          position: "absolute",
          top: 120,
          fontSize: 32,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        react-native-dialog
      </Text>

      <DialogProvider>
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
            BlurComponent={BlurView}
          />
          <DefaultDialog
            buttonLabel="OPEN NO ANIM DIALOG"
            buttonColor="brown"
            slideFrom="none"
            animation={false}
          />
          <InputDialog
            buttonLabel="OPEN INPUT DIALOG"
            buttonColor="midnightblue"
            slideFrom="none"
          />
        </View>

        <Divider />

        <View
          style={{
            position: "relative",
            height: 200,
            width: 350,
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

        <DefaultDialog
          buttonLabel="OPEN BOTTOM WITH DURATION DIALOG"
          buttonColor="brown"
          slideFrom="bottom"
          duration={1000}
        />

        <Divider />

        <DialogProvider
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
              borderRadius: 8,
              paddingHorizontal: 15,
              paddingVertical: 5,
              fontSize: 20,
              fontWeight: "600",
              backgroundColor: "#E0A91B",
            },
          }}
        >
          <CustomDialog
            buttonLabel="OPEN GLOBAL CUSTOM DIALOG"
            buttonColor="rebeccapurple"
          />
        </DialogProvider>
      </DialogProvider>
    </View>
  );
}
