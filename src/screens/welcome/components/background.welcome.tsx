import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { Extrapolate, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Device } from "ui/device.ui";
import { SystemTheme } from "ui/theme";
import { useSystem } from "helpers/system.helper";


function BackgroundWelcome({
                             translationX,
                             sizeStep
                           }: { translationX: SharedValue<number>, sizeStep: number }) {
  const { styles } = useSystem(createStyles);

  const animatedTranslateX = useAnimatedStyle(() => {

    const translateX = interpolate(
      translationX.value,
      [0, Device.width * (sizeStep - 1)],
      [-Device.width * 0.1, -Device.width * 1.15],
      Extrapolate.CLAMP
    );

    return { transform: [{ translateX }] };
  });

  return (
    <Animated.View style={[styles.container, animatedTranslateX]}>
      <Image source={require("assets/images/world.png")}
             style={styles.image} />
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />
    </Animated.View>
  );
};

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      width: Device.width * 2,
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: -1,
      justifyContent: "center"
    },
    image: {
      width: Device.width * 2.25,
      height: Device.width * 1.5,
      opacity: 0.1
    },
    circle1: {
      width: Device.width * 1.1,
      height: Device.width * 1.1,
      borderRadius: Device.width * 1.1,
      backgroundColor: "rgba(36,168,175,0.1)",
      position: "absolute",
      top: "-10%",
      left: -Device.width * 0.2
    },
    circle2: {
      width: Device.width * 1.5,
      height: Device.width * 1.5,
      borderRadius: Device.width * 1.5,
      backgroundColor: "rgba(36,168,175,0.05)",
      position: "absolute",
      bottom: "-5%",
      left: Device.width * 0.4
    },
    circle3: {
      width: Device.width * 0.9,
      height: Device.width * 0.9,
      borderRadius: Device.width * 0.9,
      backgroundColor: "rgba(36,168,175,0.1)",
      position: "absolute",
      top: "5%",
      right: -Device.width * 0.5
    }
  });
};

export default memo(BackgroundWelcome);
