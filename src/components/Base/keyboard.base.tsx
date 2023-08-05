import {IconSend} from 'assets/svgIcons';
import {useSystem} from 'helpers/system.helper';
import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {Pressable, PressableProps, StyleSheet, TextInput, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Device} from 'ui/device.ui';
import { FontWeights, HIT_SLOP_EXPAND_10, HS, MHS, VS } from "ui/sizes.ui";
import {SystemTheme} from 'ui/theme';

const AniPressable = Animatable.createAnimatableComponent<PressableProps>(Pressable);

const KeyboardInput = ({onUserSendText, ...textInputProps}, ref) => {
    const {styles, theme} = useSystem(createStyles);
    const refInput = useRef<TextInput>(null);
    const valueInputRef = useRef("")

    const onChangeText = useCallback((text: string) => {
        valueInputRef.current = text
    }, [])

    useImperativeHandle(ref, () => ({
        focus: () => {
            refInput.current?.focus()
        }
    }))

    const onSendText = () => {
        /**
         * Xóa dấu cách và xuống dòng
         */
        if (valueInputRef.current.trim() !== "") {
            onUserSendText(valueInputRef.current.trim());
            valueInputRef.current = ""
            refInput.current?.setNativeProps({
                text: ""
            })
        }
    }


    return (
        <View style={[styles.container]}>
            <View style={styles.viewInput}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={styles.viewTextInput}>
                        <TextInput
                            ref={refInput}
                            autoFocus={false}
                            multiline
                            maxLength={1000}
                            style={[styles.textInput, {color: theme.textDark}]}
                            placeholder={"Type a message..."}
                            placeholderTextColor={theme.textInactive}
                            onChangeText={onChangeText}
                            {...textInputProps}
                        />
                        <AniPressable
                            duration={300}
                            animation={"zoomIn"}
                            hitSlop={HIT_SLOP_EXPAND_10}
                            onPress={onSendText}
                        >
                            <IconSend size={HS._32} color={theme.btnActive}/>
                        </AniPressable>
                    </View>
                </View>
            </View>
        </View>
    )
}

const createStyles = (theme: SystemTheme) => {
    return StyleSheet.create({
        container: {
            paddingBottom: Device.isX ? Device.safeAreaInsetX.bottom / 2 : VS._10,
            paddingHorizontal: HS._16
        },
        viewInput: {
            width: Device.width - HS._32,
            alignItems: 'center',
            paddingTop: VS._8,
        },
        btnIconInput: {
            paddingHorizontal: HS._6,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            paddingVertical: VS._8,
        },
        textInput: {
            paddingVertical: VS._6,
            fontSize: HS._14,
            flex: 1,
            maxHeight: VS._80,
            color: "#545454",
            ...FontWeights.Bold_400_SVN
        },
        btnIconInputSend: {
            justifyContent: "center",
            alignItems: "flex-end",
            borderRadius: MHS._40,
        },
        viewTextInput: {
            flex: 1,
            flexDirection: 'row',
            borderRadius: MHS._16,
            alignItems: 'center',
            paddingHorizontal: HS._16,
            backgroundColor: "#EAEAEA",
            justifyContent: "center"
        }
    })
}

export default forwardRef(KeyboardInput);
