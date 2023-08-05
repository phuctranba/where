import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import FastImage, { FastImageProps } from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { Shadow3 } from "ui/shadow.ui";
import { HIT_SLOP_EXPAND_20 } from "ui/sizes.ui";

interface Props extends FastImageProps {
  width?: number | string;
  height?: number | string;
  onPress?: () => void;
  style?: any;
}

const NO_AVATAR = require("assets/images/no_avatar.jpg");

const ImageAvatarBase = (props: Props) => {
  const { width, height, style, onLoad, onPress, source, onLoadStart, ...rest } = props;


  return (
    <Pressable style={[style, width ? { width } : {}, height ? { height } : {}, { overflow: "hidden", ...Shadow3 }]}
               onPress={() => {
                 onPress?.();
               }} hitSlop={HIT_SLOP_EXPAND_20}>

      <Image source={NO_AVATAR} style={[style, { zIndex: 90, backgroundColor: "white", position: "absolute" }]}
             resizeMode={"contain"} />

      <Animated.View style={{ zIndex: 100, backgroundColor: "transparent" }}>
        <FastImage
          style={styles.image}
          resizeMode={"stretch"}
          source={source}
          {...rest}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image:{ width: "100%", height: "100%" }
})

export default ImageAvatarBase;
