import {useAppSelector} from "configs/store.config";
import {EnumTheme} from "constants/system.constant";
import React, {memo} from "react";
import isEqual from "react-fast-compare";
import { FontSizes } from "ui/sizes.ui";

import {StyleProp, Text, TextProps} from "react-native";

interface Props extends TextProps {
    title?: string | string[];
    style?: StyleProp<any>;
    numberOfLines?: number;
    fontSize?: number;
    fontWeight?: "400" | "normal" | "bold" | "100" | "200" | "300" | "500" | "600" | "700" | "800" | "900" | undefined;
    color?: string;
    textAlign?: "center" | "left" | "right"
}

const TextBase = (props: Props) => {
    const {style, title, children, numberOfLines, fontSize = FontSizes._14, fontWeight = "400", textAlign = "left"} = props;
    const isBold = fontWeight == "600" || fontWeight == "700" || fontWeight == "900" || fontWeight == "bold"
    const theme = useAppSelector(state => state.system.theme)
    const color = props.color || (theme == EnumTheme.Dark ? "#F3F3F3" : "#474747");

    return (
        <Text
            {...props}
            allowFontScaling={false}
            numberOfLines={numberOfLines}
            style={[
                {
                    color,
                    includeFontPadding: false,
                },
                {textAlign},
                {fontWeight: fontWeight},
                {
                    fontFamily: isBold ? "SVN-Outfit-Bold" : "SVN-Outfit-Regular",
                },
                style,
                {
                    fontSize: style?.fontSize ? style?.fontSize : fontSize
                }
            ]}
        >
            {title || ""}
            {children}
        </Text>
    )
}

export default memo(TextBase, isEqual);
