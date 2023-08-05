import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewProps, ViewStyle
} from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import TextBase from "components/Base/text.base";
import { FontSizes, MHS, VS } from "ui/sizes.ui";
import { Shadow2 } from "ui/shadow.ui";

interface TypedButtonBaseProps extends PressableProps {
  // @ts-ignore
  title?: string
  titleStyle?: TextStyle
  style?: ViewStyle
}

export default function ButtonBase({
                                     title,
                                     titleStyle,
                                     style,
                                     ...props
                                   }: TypedButtonBaseProps) {
  const { styles, theme } = useSystem(createStyles);

  return (
    <Pressable style={[styles.btn, style]} {...props}>
      {title ? <TextBase title={title} style={[styles.txt, titleStyle]} /> : null}
    </Pressable>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    btn: {
      backgroundColor: RootColor.MainColor,
      width: "100%",
      borderRadius: MHS._12,
      paddingVertical: MHS._14,
      alignItems: "center",
      ...Shadow2
    },
    txt: {
      color: theme.textLight,
      fontSize: FontSizes._16
    }

  });
};
