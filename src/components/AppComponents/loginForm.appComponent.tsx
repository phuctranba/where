import React, { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HIT_SLOP_EXPAND_10, HS, MHS, VS } from "ui/sizes.ui";
import TextBase from "components/Base/text.base";
import { IconEye, IconMail, IconPassword } from "assets/svgIcons";
import { GlobalPopupHelper } from "helpers/index";

interface TypedLoginFormAppComponentProps {
  container?: ViewStyle,
  titleStyle?: TextStyle,
  inputStyle?: TextStyle,
  containerInputStyle?: ViewStyle,
  showTitle?: boolean
  showButtonShowPassword?: boolean
  titleTypeInput?: string
  titlePasswordInput?: string
  onPressLogin: (valueType: string, password: string) => void
  onPressForgotPassword?: () => void
}

export default function LoginFormAppComponent({
                                                container,
                                                inputStyle,
                                                containerInputStyle,
                                                showTitle = false,
                                                titleTypeInput,
                                                titlePasswordInput,
                                                showButtonShowPassword = true,
                                                onPressLogin,
                                                onPressForgotPassword,
                                                titleStyle
                                              }: TypedLoginFormAppComponentProps) {
  const { styles, theme } = useSystem(createStyles);
  const refTypeValue = useRef("");
  const refTextInputPassword = useRef<TextInput>(null);
  const refPasswordValue = useRef("");
  const [isHidePassword, setIsHidePassword] = useState(true);

  const showPassword = useCallback(() => setIsHidePassword(false), []);
  const hidePassword = useCallback(() => setIsHidePassword(true), []);

  const pressLogin = useCallback(() => {
    if(refTypeValue.current && refPasswordValue.current) {
      onPressLogin(refTypeValue.current, refPasswordValue.current);
    }else {
      GlobalPopupHelper.alert({
        type: 'warning',
        title:"Please enter full information"
      })
    }
  }, []);

  const pressForgotPassword = useCallback(() => {
    onPressForgotPassword?.();
  }, []);

  const onChangeTextType = useCallback((text: string) => refTypeValue.current = text.trim(), []);
  const onChangeTextPassword = useCallback((text: string) => refPasswordValue.current = text.trim(), []);

  return (
    <View style={[styles.container, container]}>

      {showTitle ?
        <TextBase title={titleTypeInput ? titleTypeInput : "Email"} style={[styles.txtTitle, titleStyle]} /> : null}
      <View style={[styles.viewInput, containerInputStyle]}>
        <IconMail color={theme.textInactive} size={FontSizes._22} />
        <TextInput style={[styles.textInput, inputStyle]}
                   keyboardType={"email-address"}
                   onChangeText={onChangeTextType}
                   placeholder={"Email"}
                   returnKeyType={"done"}
                   blurOnSubmit={false}
                   onSubmitEditing={() => refTextInputPassword.current?.focus()}
                   numberOfLines={1} />
      </View>

      {showTitle ?
        <TextBase title={titlePasswordInput ? titlePasswordInput : "Password"}
                  style={[styles.txtTitle, titleStyle]} /> : null}
      <View style={[styles.viewInput, containerInputStyle]}>
        <IconPassword color={theme.textInactive} size={FontSizes._22} />
        <TextInput ref={refTextInputPassword}
                   style={[styles.textInput, inputStyle]}
                   placeholder={"Password"}
                   returnKeyType={"send"}
                   onChangeText={onChangeTextPassword}
                   secureTextEntry={isHidePassword}
                   numberOfLines={1} />
        {showButtonShowPassword ?
          <Pressable hitSlop={HIT_SLOP_EXPAND_10} onPressIn={showPassword} onPressOut={hidePassword}>
            <IconEye color={theme.textInactive} size={FontSizes._22} />
          </Pressable> : null}
      </View>

      <TextBase title={"Forgot Password?"} style={styles.txtForgot} onPress={pressForgotPassword} />

      <Pressable style={styles.btnLogin} onPress={pressLogin}>
        <TextBase title={"Log In"} style={styles.txtLogin} />
      </Pressable>
    </View>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      paddingHorizontal: HS._12,
      width: "100%"
    },
    imgLogo: {
      width: MHS._120,
      height: MHS._120
    },
    txtTitle: {
      fontWeight: "bold",
      color: theme.textDark,
      marginBottom: MHS._4
    },
    txtAppName: {
      color: RootColor.MainColor,
      fontWeight: "bold",
      fontSize: FontSizes._16
    },
    viewInput: {
      paddingHorizontal: HS._12,
      paddingVertical: MHS._10,
      backgroundColor: theme.backgroundTextInput,
      flexDirection: "row",
      borderRadius: MHS._10,
      alignItems: "center",
      marginBottom: VS._12
    },
    textInput: {
      flex: 1,
      color: theme.text,
      fontSize: FontSizes._14,
      paddingVertical: 0,
      paddingHorizontal: 0,
      marginHorizontal: HS._8
    },
    txtForgot: {
      marginTop: VS._4,
      alignSelf: "flex-end",
      color: RootColor.MainColor
    },
    txtLogin: {
      color: theme.textLight,
      fontSize: FontSizes._16
    },
    btnLogin: {
      marginTop: VS._32,
      backgroundColor: RootColor.MainColor,
      width: "100%",
      borderRadius: MHS._12,
      paddingVertical: MHS._14,
      alignItems: "center"
    }

  });
};
