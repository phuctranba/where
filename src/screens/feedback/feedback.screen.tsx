import React, { useCallback, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import { SafeAreaView } from "react-native-safe-area-context";
import TextBase from "components/Base/text.base";
import { Shadow2 } from "ui/shadow.ui";
import TextInputBase from "components/Base/text.input.base";
import ButtonBase from "components/Base/button.base";
import { GlobalPopupHelper } from "helpers/index";
import navigationHelper from "helpers/navigation.helper";
import LottieView from "lottie-react-native";
import { sendFeedback } from "services/feedback.service";


export default function FeedbackScreen() {
  const { styles, theme } = useSystem(createStyles);
  const refTextInputTopic = useRef<any>(null);
  const refTextInputContent = useRef<any>(null);

  const pressSave = useCallback(() => {
    sendFeedback(refTextInputTopic.current?.getValue(), refTextInputContent.current?.getValue());
    navigationHelper.goBack();
    GlobalPopupHelper.alert({
      type: "info",
      title: "Thank you for your feedback, we will take a closer look at them",
      titleProps:{
        numberOfLines:3
      }
    });
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}>
        <View style={styles.containerContent}>
          <LottieView source={require("assets/lotties/feedback.json")}
                      style={{ width: "80%" }}
                      autoPlay />

          <View style={styles.containerForm}>
            <TextBase title={"Topic you want feedback"} style={styles.txtTitle} />
            <View style={styles.viewInput}>
              <TextInputBase style={styles.textInput}
                             ref={refTextInputTopic}
                             placeholder={"Topic"}
                             returnKeyType={"done"}
                             numberOfLines={3} />
            </View>

            <TextBase title={"Your comments about the application"} style={styles.txtTitle} />
            <View style={styles.viewInput}>
              <TextInputBase style={styles.textInput}
                             ref={refTextInputContent}
                             placeholder={"Content"}
                             returnKeyType={"done"}
                             numberOfLines={8} />
            </View>
          </View>
        </View>

        <ButtonBase title={"Send Your Feedback"} style={styles.btnSave} onPress={pressSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: HS._16
    },
    containerContent: {
      alignItems: "center"
    },
    contentContainerStyle: {
      flexGrow: 1,
      justifyContent: "space-between"
    },
    imgAvatar: {
      width: MHS._150,
      height: MHS._150

    },
    btnAvatar: {
      borderRadius: MHS._26,
      overflow: "hidden",
      ...Shadow2
    },
    containerForm: {
      width: "100%"

    },
    txtTitle: {
      fontWeight: "bold",
      color: theme.textDark,
      marginBottom: VS._6,
      marginTop: VS._20
    },
    viewInput: {
      paddingHorizontal: HS._12,
      paddingVertical: MHS._10,
      backgroundColor: theme.backgroundTextInput,
      flexDirection: "row",
      borderRadius: MHS._10,
      alignItems: "center"
    },
    textInput: {
      flex: 1,
      color: theme.text,
      fontSize: FontSizes._14,
      paddingVertical: 0,
      paddingHorizontal: 0,
      marginHorizontal: HS._4
    },
    btnSave: {
      marginBottom: VS._20
    },
    viewIconEdit: {
      padding: MHS._14,
      backgroundColor: `${theme.btnInactive}70`,
      borderTopLeftRadius: MHS._26,
      position: "absolute",
      bottom: 0,
      right: 0
    }
  });
};
