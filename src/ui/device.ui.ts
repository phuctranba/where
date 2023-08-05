import {Dimensions, NativeModules, Platform, StatusBar} from "react-native";
import {VS} from "./sizes.ui";
import {getStatusBarHeight} from "react-native-safearea-height";
import {initialWindowMetrics} from "react-native-safe-area-context";
import DeviceInfo from "react-native-device-info";
import {EnumTheme} from "constants/system.constant";
import {RootColor} from "ui/theme";

const {CustomModule} = NativeModules;

const {width, height} = Dimensions.get("window");
const heightScreen = Dimensions.get("screen").height;
const {frame} = initialWindowMetrics || {frame: {height: height}};

const isIphoneX = Platform.OS === 'ios'
    && !Platform.isTV
    && !Platform.isTV
    && (height === 812 || width === 812);
const isIphoneXR = Platform.OS === 'ios'
    && !Platform.isTV
    && !Platform.isTV
    && (height === 896 || width === 896)

const isIphone12 = Platform.OS === 'ios'
    && !Platform.isTV
    && !Platform.isTV
    && (height === 844 || width === 844)
const isIphone12PM = Platform.OS === 'ios'
    && !Platform.isTV
    && !Platform.isTV
    && (height === 926 || width === 926)
const isIphone14 = Platform.OS === 'ios'
    && !Platform.isTV
    && !Platform.isTV
    && (height === 852 || width === 852)
const isIphone14PM = Platform.OS === 'ios'
    && !Platform.isTV
    && !Platform.isTV
    && (height === 932 || width === 932)
const tabBarHeight = 50
const isX = isIphoneX || isIphoneXR || isIphone12 || isIphone12PM || isIphone14 || isIphone14PM
const safeAreaInsetX = {top: 44, bottom: 34}


export const Device = {
    // isHasSoftMenuBar: Platform.OS === "android" ? NativeModules.SoftMenuBarModule.checkIsSoftMenuBarDisplay() : false,
    ratio: width / heightScreen,
    width,
    height,
    isWeb: Platform.OS === "web",
    isIos: Platform.OS === "ios",
    isAndroid: Platform.OS === "android",
    isX,
    safeAreaInsetX,
    tabBarHeightContain: tabBarHeight + (isX ? safeAreaInsetX.bottom : 0),
    heightScreen,
    isTablet: DeviceInfo.isTablet(),
    heightStatusBar: Platform.OS === 'ios' ? safeAreaInsetX.top : (StatusBar.currentHeight || 0),
    heightPaddingStatusBar: Platform.OS === "ios" ? isX ? safeAreaInsetX.top : 20 : (StatusBar.currentHeight || 0),
    heightSafeWithStatus: frame.height + (Platform.OS === "ios" ? getStatusBarHeight() : (StatusBar.currentHeight || 0)),
    paddingBottom: isX ? safeAreaInsetX.bottom / 2 : VS._20
};

export function setupColorForSoftMenuBar(theme: EnumTheme) {
    if (Device.isIos) {
        return;
    }
    if (theme == EnumTheme.Dark) {
        CustomModule.setColor(RootColor.DarkBackground);
    } else {
        CustomModule.setColor(RootColor.LightBackground);
    }
}
