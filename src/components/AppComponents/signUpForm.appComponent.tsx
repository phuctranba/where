import React, { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HIT_SLOP_EXPAND_10, HS, MHS, VS } from "ui/sizes.ui";
import TextBase from "components/Base/text.base";
import { IconEye, IconMail, IconPassword, IconUser } from "assets/svgIcons";
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
  onPressSignUp: (valueType: string, password: string, userName: string) => void
  hasName?: boolean
}

export default function SignUpFormAppComponent({
                                                 container,
                                                 inputStyle,
                                                 containerInputStyle,
                                                 showTitle = false,
                                                 titleTypeInput,
                                                 titlePasswordInput,
                                                 showButtonShowPassword = true,
                                                 onPressSignUp,
                                                 titleStyle,
                                                 hasName
                                               }: TypedLoginFormAppComponentProps) {
  const { styles, theme } = useSystem(createStyles);
  const refUserNameValue = useRef("");
  const refTypeValue = useRef("");
  const refPasswordValue = useRef("");
  const refRePasswordValue = useRef("");

  const refTextInputType = useRef<TextInput>(null);
  const refTextInputPassword = useRef<TextInput>(null);
  const refTextInputRePassword = useRef<TextInput>(null);

  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isHideRePassword, setIsHideRePassword] = useState(true);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(true);

  const showPassword = useCallback(() => setIsHidePassword(false), []);
  const hidePassword = useCallback(() => setIsHidePassword(true), []);
  const showRePassword = useCallback(() => setIsHideRePassword(false), []);
  const hideRePassword = useCallback(() => setIsHideRePassword(true), []);

  const pressSignUp = useCallback(() => {
    let passUserName = hasName?!!refUserNameValue.current:true
    if(passUserName && refTypeValue.current && refPasswordValue.current && refRePasswordValue.current) {
      if(refPasswordValue.current !== refRePasswordValue.current){
        GlobalPopupHelper.alert({
          type: 'warning',
          title:"Two passwords do not match"
        })
      }else {
        onPressSignUp(refTypeValue.current, refPasswordValue.current, refUserNameValue.current);
      }
    }else {
      GlobalPopupHelper.alert({
        type: 'warning',
        title:"Please enter full information"
      })
    }
  }, [hasName]);


  const onChangeTextUserName = useCallback((text: string) => refUserNameValue.current = text.trim(), []);
  const onChangeTextType = useCallback((text: string) => refTypeValue.current = text.trim(), []);
  const onChangeTextPassword = useCallback((text: string) => {
    refPasswordValue.current = text.trim();
    if (refPasswordValue.current && refRePasswordValue.current) {
      if (refPasswordValue.current !== refRePasswordValue.current) {
        if (isPasswordConfirm) {
          setIsPasswordConfirm(false);
        }
      }else {
        if (!isPasswordConfirm) {
          setIsPasswordConfirm(true);
        }
      }
    } else {
      if (!isPasswordConfirm) {
        setIsPasswordConfirm(true);
      }
    }
  }, [isPasswordConfirm]);

  const onChangeTextRePassword = useCallback((text: string) => {
    refRePasswordValue.current = text.trim();
    if (refPasswordValue.current && refRePasswordValue.current) {
      if (refPasswordValue.current !== refRePasswordValue.current) {
        if (isPasswordConfirm) {
          setIsPasswordConfirm(false);
        }
      }else {
        if (!isPasswordConfirm) {
          setIsPasswordConfirm(true);
        }
      }
    } else {
      if (!isPasswordConfirm) {
        setIsPasswordConfirm(true);
      }
    }
  }, [isPasswordConfirm]);

  return (
    <View style={[styles.container, container]}>

      {hasName ?
        <>
          {
            showTitle ?
              <TextBase title={"User name"}
                        style={[styles.txtTitle, titleStyle]} /> : null
          }
          <View style={[styles.viewInput, containerInputStyle]}>
            <IconUser color={theme.textInactive} size={FontSizes._22} />
            <TextInput style={[styles.textInput, inputStyle]}
                       onChangeText={onChangeTextUserName}
                       placeholder={"User name"}
                       returnKeyType={"done"}
                       blurOnSubmit={false}
                       onSubmitEditing={() => refTextInputType.current?.focus()}
                       numberOfLines={1} />
          </View>
        </>
        : null
      }

      {showTitle ?
        <TextBase title={titleTypeInput ? titleTypeInput : "Email"} style={[styles.txtTitle, titleStyle]} /> : null}
      <View style={[styles.viewInput, containerInputStyle]}>
        <IconMail color={theme.textInactive} size={FontSizes._22} />
        <TextInput style={[styles.textInput, inputStyle]}
                   keyboardType={"email-address"}
                   ref={refTextInputType}
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
        <IconPassword color={isPasswordConfirm ? theme.textInactive : RootColor.RedNegative} size={FontSizes._22} />
        <TextInput ref={refTextInputPassword}
                   style={[styles.textInput, inputStyle]}
                   placeholder={"Password"}
                   returnKeyType={"done"}
                   blurOnSubmit={false}
                   onChangeText={onChangeTextPassword}
                   onSubmitEditing={() => refTextInputRePassword.current?.focus()}
                   secureTextEntry={isHidePassword}
                   numberOfLines={1} />

        {showButtonShowPassword ?
          <Pressable hitSlop={HIT_SLOP_EXPAND_10} onPressIn={showPassword} onPressOut={hidePassword}>
            <IconEye color={theme.textInactive} size={FontSizes._22} />
          </Pressable> : null}
      </View>

      {showTitle ?
        <TextBase title={titlePasswordInput ? titlePasswordInput : "Confirm"}
                  style={[styles.txtTitle, titleStyle]} /> : null}
      <View style={[styles.viewInput, containerInputStyle]}>
        <IconPassword color={isPasswordConfirm ? theme.textInactive : RootColor.RedNegative} size={FontSizes._22} />
        <TextInput ref={refTextInputRePassword}
                   style={[styles.textInput, inputStyle]}
                   placeholder={"Confirm the password"}
                   returnKeyType={"send"}
                   onChangeText={onChangeTextRePassword}
                   secureTextEntry={isHideRePassword}
                   numberOfLines={1} />

        {showButtonShowPassword ?
          <Pressable hitSlop={HIT_SLOP_EXPAND_10} onPressIn={showRePassword} onPressOut={hideRePassword}>
            <IconEye color={theme.textInactive} size={FontSizes._22} />
          </Pressable> : null}
      </View>


      <Pressable style={styles.btnLogin} onPress={pressSignUp}>
        <TextBase title={"Sign Up"} style={styles.txtLogin} />
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
