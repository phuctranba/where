import React, { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import TextBase from "components/Base/text.base";
import { Shadow2 } from "ui/shadow.ui";
import { useLogin } from "helpers/authentication.helper";
import SignUpFormAppComponent from "components/AppComponents/signUpForm.appComponent";
import navigationHelper from "helpers/navigation.helper";
import { IconApple, IconFacebook, IconGoogleSingleColor } from "assets/svgIcons";
import { Device } from "ui/device.ui";
import { useAppDispatch } from "configs/store.config";
import { signUpWithEmailPassword } from "store/reducer/user.reducer.store";


export default function SignUpScreen() {
  const { styles, theme } = useSystem(createStyles);
  const { loginApple, loginGoogle, loginFacebook } = useLogin();
  const dispatch = useAppDispatch();

  const pressSignUp = useCallback((email: string, password: string, userName: string)=>{
    dispatch(signUpWithEmailPassword({
      user_email: email,
      password: password,
      display_name: userName
    }))
  },[])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>

      <TextBase title={"Create New Account"} style={styles.txtAppName} />
      <TextBase title={"Set up your username and password.\nYou can always change it later."}
                style={styles.txtDesLogin} />


      <SignUpFormAppComponent
        hasName
        onPressSignUp={pressSignUp} />

      <Pressable onPress={()=>navigationHelper.goBack()}>
        <TextBase title={"Already have an account? "} style={styles.txtFirstTime}><TextBase
          style={styles.txtSignUp}>{"Log in"}</TextBase></TextBase>
      </Pressable>
      <View style={styles.viewOrSignIn}>
        <View style={styles.strokeOrSignIn} />
        <TextBase title={"Or sign in with"} style={styles.txtOrSignIn} />
        <View style={styles.strokeOrSignIn} />
      </View>


      <View style={styles.viewBtnLoginSSO}>
        <Pressable style={[styles.btnLoginSSO, { backgroundColor: "#4460A0" }]} onPress={()=>loginFacebook()}>
          <IconFacebook size={FontSizes._22} />
          <TextBase title={"Login with Facebook"} style={styles.txtLoginSSO} />
        </Pressable>

        <Pressable style={[styles.btnLoginSSO, { backgroundColor: "#EA4335" }]} onPress={()=>loginGoogle()}>
          <IconGoogleSingleColor size={FontSizes._22} />
          <TextBase title={"Login with Google"} style={styles.txtLoginSSO} />
        </Pressable>

        {Device.isIos &&
          <Pressable style={[styles.btnLoginSSO, { backgroundColor: "#000" }]} onPress={()=>loginApple()}>
            <IconApple size={FontSizes._22} />
            <TextBase title={"Login with Apple"} style={styles.txtLoginSSO} />
          </Pressable>}
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    contentContainerStyle: {
      backgroundColor: theme.background,
      paddingHorizontal: HS._12,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: VS._28,
      flexGrow: 1
    },
    imgLogo: {
      width: MHS._120,
      height: MHS._120
    },
    txtAppName: {
      color: RootColor.MainColor,
      fontWeight: "bold",
      fontSize: FontSizes._20
    },
    txtDesLogin: {
      color: theme.textInactive,
      fontSize: FontSizes._14,
      textAlign: "center",
      marginHorizontal: HS._24,
      marginVertical: VS._12
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
      marginVertical: VS._8,
      paddingHorizontal: HS._24,
      paddingVertical: MHS._12,
      ...Shadow2
    },
    txtLoginSSO: {
      fontSize: FontSizes._13,
      color: theme.textLight,
      flex: 1,
      textAlign: "center",
      fontWeight: "bold"
    }

  });
};
