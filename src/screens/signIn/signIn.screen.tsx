import React, { memo } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import TextBase from "components/Base/text.base";
import { Device } from "ui/device.ui";
import { IconApple, IconFacebook, IconGoogleSingleColor } from "assets/svgIcons";
import { Shadow2 } from "ui/shadow.ui";
import { useLogin } from "helpers/authentication.helper";
import { languages } from "../../languages";


function SignInScreen() {
  const { styles, theme } = useSystem(createStyles);
  const { loginApple, loginGoogle, loginFacebook } = useLogin();

  return (
    <View style={styles.container}>

      <Image source={require("assets/images/logo.png")}
             style={styles.imgLogo} />
      <TextBase title={"WHERE?"} style={styles.txtAppName} />
      <TextBase title={languages.signIn.description} style={styles.txtDesLogin} />


      <View style={styles.viewBtnLoginSSO}>
        <Pressable style={[styles.btnLoginSSO, { backgroundColor: "#4460A0" }]} onPress={() => loginFacebook()}>
          <IconFacebook size={FontSizes._22} />
          <TextBase title={languages.signIn.loginFB} style={styles.txtLoginSSO} />
        </Pressable>

        <Pressable style={[styles.btnLoginSSO, { backgroundColor: "#EA4335" }]} onPress={() => loginGoogle()}>
          <IconGoogleSingleColor size={FontSizes._22} />
          <TextBase title={languages.signIn.loginGG} style={styles.txtLoginSSO} />
        </Pressable>

        {Device.isIos &&
          <Pressable style={[styles.btnLoginSSO, { backgroundColor: "#000" }]} onPress={() => loginApple()}>
            <IconApple size={FontSizes._22} />
            <TextBase title={languages.signIn.loginApple} style={styles.txtLoginSSO} />
          </Pressable>}
      </View>

    </View>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      height: Device.heightSafeWithStatus,
      // backgroundColor: theme.background,
      width: Device.width,
      // backgroundColor: theme.background,
      paddingHorizontal: HS._12,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: VS._28,
    },
    imgLogo: {
      marginTop: Device.heightStatusBar,
      width: MHS._170,
      height: MHS._170
    },
    txtAppName: {
      color: RootColor.MainColor,
      fontWeight: "bold",
      marginVertical: VS._20,
      fontSize: FontSizes._48
    },
    txtDesLogin: {
      color: theme.textInactive,
      fontSize: FontSizes._16,
      textAlign: "center",
      marginHorizontal: HS._24,
      marginBottom: VS._48
    },
    txtFirstTime: {
      marginVertical: VS._18,
      color: theme.text,
      fontSize: FontSizes._16,
      textAlign: "center"
    },
    txtSignUp: {
      color: RootColor.MainColor
    },
    viewOrSignIn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: HS._20,
      marginVertical: VS._6
    },
    txtOrSignIn: {
      marginHorizontal: HS._18,
      color: theme.text,
      fontSize: FontSizes._12
    },
    strokeOrSignIn: {
      flex: 1,
      height: 0.5,
      backgroundColor: theme.textInactive
    },
    viewBtnLoginSSO: {
      width: "100%",
      paddingHorizontal: HS._12
    },
    btnLoginSSO: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: MHS._12,
      marginVertical: VS._12,
      paddingHorizontal: HS._24,
      paddingVertical: MHS._16,
      ...Shadow2
    },
    txtLoginSSO: {
      fontSize: FontSizes._15,
      color: theme.textLight,
      flex: 1,
      textAlign: "center",
      fontWeight: "bold"
    }

  });
};

export default memo(SignInScreen)
