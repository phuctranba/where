import { useAppSelector } from "configs/store.config";
import { EnumTheme } from "constants/system.constant";
import React, { memo, useCallback, useState } from "react";
import isEqual from "react-fast-compare";

import { StyleProp, Text, TextProps, View } from "react-native";
import { mhs } from "ui/sizes.ui";
import { RootColor } from "ui/theme";

interface Props extends TextProps {
  title?: string | string[];
  style?: StyleProp<any>;
  numberOfLines?: number;
  fontSize?: number;
  fontWeight?: "400" | "normal" | "bold" | "100" | "200" | "300" | "500" | "600" | "700" | "800" | "900" | undefined;
  color?: string;
  textAlign?: "center" | "left" | "right";
}

const TextEllipsisBase = (props: Props) => {
  const { style, title = "", children, numberOfLines = 3, fontSize = 14, fontWeight = "400" } = props;
  const isBold = fontWeight == "600" || fontWeight == "700" || fontWeight == "900" || fontWeight == "bold";
  const theme = useAppSelector(state => state.system.theme);
  const color = props.color || (theme == EnumTheme.Dark ? "#F3F3F3" : "#474747");

  const [isCollapse, setIsCollapse] = useState<boolean>(title.length > (numberOfLines * 80));
  const [isShowLoadMore] = useState<boolean>(title.length > (numberOfLines * 80));
  const [numOfLines, setNumOfLines] = useState<number | undefined>(title.length > (numberOfLines * 80) ? numberOfLines : undefined);

  const onLoadMoreToggle = useCallback(() => {
    setIsCollapse(old => !old);
    setNumOfLines(old => old ? undefined : numberOfLines);
  }, []);

  return (
    <View>
      <Text
        {...props}
        allowFontScaling={false}
        numberOfLines={numOfLines}
        style={[
          {
            color,
            includeFontPadding: false
          },
          { fontWeight: fontWeight },
          {
            fontFamily: isBold ? "SVN-Outfit-Bold" : "SVN-Outfit-Regular"
          },
          style,
          {
            textAlign: "justify",
            fontSize: mhs(style?.fontSize ? style?.fontSize : fontSize)
          }
        ]}
      >
        {title || ""}
        {children}
      </Text>

      {isShowLoadMore ?
        <Text
          onPress={onLoadMoreToggle}
          {...props}
          allowFontScaling={false}
          style={[
            {
              color,
              includeFontPadding: false
            },
            { fontWeight: fontWeight },
            {
              fontFamily: isBold ? "SVN-Outfit-Bold" : "SVN-Outfit-Regular"
            },
            style,
            {
              fontSize: mhs(style?.fontSize ? style?.fontSize : fontSize)
            },
            {
              position: isCollapse ? "absolute" : "relative",
              alignSelf: isCollapse ? undefined : "flex-end",
              right: isCollapse ? 0 : undefined,
              bottom: isCollapse ? 0 : undefined,
              textDecorationLine: "underline",
              color: RootColor.MainColor,
            }
          ]}
        >
          {isCollapse ? " ...Read more" : "Show less"}
        </Text>
        :
        null
      }

    </View>
  );
};

export default memo(TextEllipsisBase, isEqual);
