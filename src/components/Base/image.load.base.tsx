import React from 'react';
import {Image, ImageProps, Pressable, StyleSheet} from 'react-native';
import {Blurhash} from "react-native-blurhash";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { HIT_SLOP_EXPAND_20 } from "ui/sizes.ui";

interface Props extends ImageProps {
    width?: number | string
    height?: number | string
    onPress?: () => void
    style?: any
}

const ImageLoad = (props: Props) => {
    const {width, height, style, onLoad, onPress, source, onLoadStart, ...rest} = props;

    const loaded = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(loaded.value, [0, 1], [0, 1], Extrapolate.CLAMP)
        }
    })

    const blurhashStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(loaded.value, [0, 1], [1, 0], Extrapolate.CLAMP)
        }
    })

    return (
        <Pressable style={[style, width ? {width} : {}, height ? {height} : {}, {overflow: "hidden"}]} onPress={() => {
            onPress?.()
        }} hitSlop={HIT_SLOP_EXPAND_20}>
            <Animated.View style={[StyleSheet.absoluteFillObject, blurhashStyle]}>
                <Blurhash
                    blurhash={"LGFFaXYk^6#M@-5c,1J5@|or|Q6."}
                    style={[StyleSheet.absoluteFillObject]}
                />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFillObject, {zIndex: 100}, animatedStyle]}>
                <Image
                    onLoadStart={() => {
                        loaded.value = withTiming(0, {duration: 500})
                        onLoadStart?.()
                    }}
                    onLoad={(evt) => {
                        loaded.value = withTiming(1, {duration: 500})
                        onLoad?.(evt);
                    }}
                    style={styles.image}
                    resizeMode='stretch'
                    source={source}
                    {...rest}
                />
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    image:{ width: "100%", height: "100%" }
})

export default ImageLoad;
