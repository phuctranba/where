import React from 'react';

import TextBase from "components/Base/text.base";
import {useSystem} from 'helpers/system.helper';
import {StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle,} from 'react-native';
import {HS, MHS, VS,} from 'ui/sizes.ui';

export interface ButtonActionSheetProps {
    title?: string;
    onPress?: () => void;
    checked?: boolean;
    titleCenter?: boolean;
    titleColor?: string;
    iconCheckColor?: string;
    leftIconName?: string;
    leftIconColor?: string;
    renderRight?: () => void;
    testIDButton?: string;
    accessibilityLabelButton?: string;
    testIDTitle?: string;
    accessibilityLabelTitle?: string;
    titleStyle?: TextStyle;
    iconCheckStyle?: ViewStyle;
    iconCheckSize?: number;
    leftIconComponent?: React.ReactNode;
    autoDismiss?: boolean;
    icon: any;
    loginWith: string
}

export default function Button(props: ButtonActionSheetProps) {
    const {
        title,
        onPress,
        checked,
        leftIconName,
        renderRight,
        testIDButton,
        accessibilityLabelButton,
        testIDTitle,
        accessibilityLabelTitle,
        titleCenter = true,
        titleStyle,
        leftIconComponent,
        icon,
        loginWith
    } = props;
    const textCenter = (checked != null && !leftIconName && !leftIconComponent && !renderRight) || titleCenter;
    const {theme} = useSystem();
    const checkGG = loginWith === 'google'

    return (
        <TouchableOpacity
            testID={testIDButton}
            accessibilityLabel={accessibilityLabelButton}
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.btnLogin, textCenter && {
                justifyContent: 'center',
                backgroundColor: checkGG ? '#E0E0E0' : loginWith ? "black" : theme.btnLight,
                paddingVertical: !loginWith ? VS._2 : VS._14,

            }]}
        >
            <View>
                {icon ?
                    <View style={{flexDirection: 'row'}}>
                        {icon}
                        <>
                            <TextBase
                                testID={testIDTitle}
                                accessibilityLabel={accessibilityLabelTitle}
                                numberOfLines={2}
                                color={checkGG ? theme.textDark : theme.textLight}
                                style={[styles.txtTitle, !textCenter && {flex: 1}, titleStyle]}
                            >
                                {title}
                            </TextBase>
                            {renderRight && renderRight()}
                        </>
                    </View> :
                    <>
                        <TextBase
                            testID={testIDTitle}
                            accessibilityLabel={accessibilityLabelTitle}
                            numberOfLines={2}
                            style={[styles.txtTitle, !textCenter && {flex: 1}, {
                                fontSize: loginWith ? 18 : 15,
                                textDecorationLine: 'underline'
                            }, titleStyle]}
                        >
                            {title}
                        </TextBase>
                        {renderRight && renderRight()}
                    </>}

            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 54,
        alignItems: 'center',
        padding: 12,
        flexDirection: 'row',
    },
    leftIcon: {
        marginRight: 8,
    },
    txtTitle: {
        fontSize: 18,
        lineHeight: 24,
    },
    icon: {
        marginLeft: 8,
    },
    btnLogin: {
        borderRadius: MHS._16,
        paddingHorizontal: HS._16,
        marginHorizontal: HS._16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: VS._6,
    },
});
