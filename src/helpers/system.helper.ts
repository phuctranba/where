import { useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "configs/store.config";
import { EnumTheme } from "constants/system.constant";
import { languages } from "languages";
import { parsePhoneNumber } from "libphonenumber-js";
import { Dimensions, ImageStyle, Linking, Platform, TextStyle, ToastAndroid, ViewStyle } from "react-native";
import DeviceCountry, { TYPE_CONFIGURATION } from "react-native-device-country";
import Toast from "react-native-simple-toast";
import { SystemTheme } from "ui/theme";
import DarkTheme from "ui/theme/dark.theme";
import LightTheme from "ui/theme/light.theme";
import { v4 as uuidv4 } from "uuid";
import analytics from "@react-native-firebase/analytics";
import firestore from "@react-native-firebase/firestore";
import appsFlyer from "react-native-appsflyer";

import { TypedEcosystem } from "models/ecosystem.model";
import Config from "react-native-config";
import { GlobalPopupHelper } from "./";
import { Device } from "ui/device.ui";

const { width, height } = Dimensions.get("window");
export const LANGUAGE_SYSTEM = languages.getInterfaceLanguage();

/**
 * Các gói sub, product cho từng platform
 */
export const SUBSCRIPTIONS = Device.isIos ? ["com.iceo.law.ai.subscription.1month", "com.iceo.law.ai.subscription.6month"] : ["com.iceo.law.ai.subscription.1month", "com.iceo.law.ai.subscription.6month"];
export const PRODUCTS = Device.isIos ? ["com.iceo.law.ai.donate.1usd", "com.iceo.law.ai.donate.10usd"] : ["com.iceo.law.ai.donate.1usd", "com.iceo.law.ai.donate.10usd"];
export const SUBSCRIPTIONS_DETAIL = [{
  productId: SUBSCRIPTIONS[0],
  description: Device.isAndroid ? "$21.99/Month" : "$24.99/Month",
  price: Device.isAndroid ? 21.99 : 24.99
}, {
  productId: SUBSCRIPTIONS[1],
  description: "$199.99/Year",
  price: 199.99
}, {
  productId: SUBSCRIPTIONS[2],
  description: "$139.99/Year",
  price: 139.99
}, {
  productId: SUBSCRIPTIONS[3],
  description: "$99.99/Year",
  price: 99.99
}];


const [short, long] = width > height ? [height, width] : [width, height];

export const horizontalScale = (size = 0) => size * short / 375;
export const verticalScale = (size = 0) => size * long / 812;
/**
 * moderateHorizontalScale
 * @param size
 * @param factor
 * Scale by screen horizontal ratio with factor for size compensation. Default factor is 0.5.
 */
export const mhs = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

/**
 * moderateVerticalScale
 * @param size
 * @param factor
 * Scale by screen vertical ratio with factor for size compensation. Default factor is 0.5.
 */
export const mvs = (size, factor = 0.5) => size + (verticalScale(size) - size) * factor;

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useSystem<T extends NamedStyles<T> | NamedStyles<any>>(createStyle?: (theme: SystemTheme) => T): {
  theme: SystemTheme
  themeKey: EnumTheme
  styles: T
  isConnected: boolean
} {
  const themeKey = useAppSelector((state) => state.system.theme);
  const isConnected = useAppSelector((state) => state.system.isConnectedInternet);

  const theme = themeKey === EnumTheme.Dark ? DarkTheme : LightTheme;
  const styles = useMemo(() => {
    return createStyle?.(theme) || {} as T;
  }, [theme]);

  return { theme, themeKey, styles, isConnected };
}

export const sendEventToLogTime = async ({
                                           device_id = "",
                                           user_id = "",
                                           session_id = "",
                                           screen = "",
                                           time_start = 0,
                                           time_end = 0,
                                           time_active = 0,
                                           type_action = "",
                                           version = "",
                                           params = {}
                                         }: { device_id: string, version: string, user_id: string, session_id: string, screen: string, time_start: number, time_end: number, time_active: number, type_action: string, params?: any }) => {

  if (time_active <= 0)
    return;

  try {
    const channelDoc = await firestore().collection("LogTime").doc(uuidv4());
    await channelDoc.set({
      user_id: user_id,
      session_id: session_id,
      device_id: device_id,
      screen: screen,
      time_start: time_start,
      time_end: time_end,
      time_active: time_active,
      type_action: type_action,
      version: version,
      ...params
    });
  } catch (error) {
  }
};

export const openURLWebView = async (url: string) => {
  if (!url) {
    return;
  }
  try {
    // if (await InAppBrowser.isAvailable()) {
    //   const result = await InAppBrowser.open(url, {
    //     // iOS Properties
    //     dismissButtonStyle: 'cancel',
    //     preferredBarTintColor: "#46B18F",
    //     preferredControlTintColor: 'white',
    //     readerMode: false,
    //     animated: true,
    //     modalPresentationStyle: 'fullScreen',
    //     modalTransitionStyle: 'coverVertical',
    //     modalEnabled: true,
    //     enableBarCollapsing: false,
    //     // Android Properties
    //     showTitle: true,
    //     toolbarColor: "#46B18F",
    //     secondaryToolbarColor: 'black',
    //     navigationBarColor: 'black',
    //     navigationBarDividerColor: 'white',
    //     enableUrlBarHiding: true,
    //     enableDefaultShare: true,
    //     forceCloseOnRedirection: false,
    //     // Specify full animation resource identifier(package:anim/name)
    //     // or only resource name(in case of animation bundled with app).
    //     animations: {
    //       startEnter: 'slide_in_right',
    //       startExit: 'slide_out_left',
    //       endEnter: 'slide_in_left',
    //       endExit: 'slide_out_right'
    //     },
    //     headers: {

    //     }
    //   })
    //   await sleep(800);
    //   console.log("result", result);
    //   return;
    // }
    Linking.openURL(url);
  } catch (error) {
    Linking.openURL(url);
  }

};

export const validPhoneNumber = (phoneNumber?: string, countryCode?: string) => {
  if (!phoneNumber || !countryCode) {
    return false;
  }
  try {
    //@ts-ignore
    const phoneNumber1 = parsePhoneNumber(phoneNumber, countryCode);
    if (phoneNumber1.isValid()) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const useDisplayAds = () => {
  const config = useAppSelector(state => state.system.config);
  const nativeAdsId = useAppSelector(state => state.system.nativeAdsId);
  const rewardAdsId = useAppSelector(state => state.system.rewardAdsId);
  const openAdsId = useAppSelector(state => state.system.openAdsId);
  const getConfigDone = useAppSelector(state => state.system.getConfigDone);

  const {
    native_ads_pre,
    native_ads_after,
    use_reward_ads
  } = config;


  const displayAlertAds = ({
                             title,
                             message,
                             callback,
                             notGoPremium = false,
                             useReward = true,
                             textConfirm = ""
                           }: { title: string, message: string, callback?: Function, notGoPremium?: boolean, useReward?: boolean, textConfirm?: string }) => {
    const alertPre = native_ads_pre ? GlobalPopupHelper.alertAdsRef.current : GlobalPopupHelper.alertRef.current;
    const alertAfter = native_ads_after ? GlobalPopupHelper.alertAdsRef.current : GlobalPopupHelper.alertRef.current;

    alertPre?.alert({
      title,
      message,
      actions: [{
        text: textConfirm || languages.confirm,
        active: true,
        onPress: () => {
          if (use_reward_ads && useReward) {
            GlobalPopupHelper.adsRewardRef.current?.showAds(() => {
              setTimeout(() => {
                alertAfter?.alert({
                  title: languages.unlockPremiumFeature,
                  message: languages.successfulAward,
                  onClose: () => {
                    callback?.();
                  }
                });
              }, 500);
            });
          } else {
            callback?.();
          }
        }
      }]
    });
  };

  return { displayAlertAds, ...config, nativeAdsId, rewardAdsId, openAdsId, getConfigDone };
};

export const useNativeAds = () => {
  const config = useAppSelector(state => state.system.config);
  const listNativeAdsId = useAppSelector(state => state.system.listNativeAdsId);

  const [nativeAdsId, setNativeAdsId] = useState<any>(listNativeAdsId?.[0]);
  const refNativeAdsId = useRef<any>(listNativeAdsId?.[0]);

  useEffect(() => {
    if (refNativeAdsId.current !== listNativeAdsId?.[0]) {
      setNativeAdsId(listNativeAdsId?.[0]);
      refNativeAdsId.current = listNativeAdsId?.[0];
    }
  }, [listNativeAdsId]);


  const switchAdsId = () => {
    let newAdsId;
    let indexOfCurrentKey = listNativeAdsId.indexOf(refNativeAdsId.current);
    if (indexOfCurrentKey === -1) {
      newAdsId = listNativeAdsId?.[0];
    } else {
      if (indexOfCurrentKey === listNativeAdsId.length - 1) {
        refNativeAdsId.current = undefined;
        setNativeAdsId(undefined);
        return;
      }

      if (listNativeAdsId.length >= indexOfCurrentKey + 2) {
        newAdsId = listNativeAdsId?.[indexOfCurrentKey + 1];
      } else {
        newAdsId = listNativeAdsId?.[0];
      }
    }

    refNativeAdsId.current = newAdsId;
    setNativeAdsId(newAdsId);
  };

  return { ...config, nativeAdsId, switchAdsId };
};

export const sendEventToFirestore = async ({
                                             eventName,
                                             user_id = "",
                                             user_email = "",
                                             fullname = "",
                                             params = {}
                                           }: { eventName: string, user_id?: string, user_email?: string, fullname?: string, params?: any }) => {
  if (!user_id) {
    return;
  }
  let countryCode;
  try {
    countryCode = await DeviceCountry.getCountryCode(TYPE_CONFIGURATION);
  } catch (error) {

  }
  try {
    const channelDoc = await firestore().collection("Users").doc(uuidv4());
    await channelDoc.set({
      event_name: `law_${eventName}`,
      email: user_email,
      user_id: user_id,
      fullname: fullname,
      country: countryCode?.code || "",
      ...params
    });
  } catch (error) {
  }
};

export const NAME_CHAT_GPT = Config.APP_NAME;

export const showToast = (text: string) => {
  if (Platform.OS == "android") {
    ToastAndroid.show(text, ToastAndroid.BOTTOM);
  } else {
    Toast.showWithGravity(text, Toast.SHORT, Toast.BOTTOM);
  }
};

export const logEventAnalytics = async (event: string, dataObj = {}) => {
  try {
    if (__DEV__) {
      return;
    }
    return await analytics().logEvent(event, dataObj);
  } catch (error) {

  }
  return;
};

export const DEFAULT_ECOSYSTEM: TypedEcosystem = {
  id: "default-ecosystem",
  color: "#46B18F",
  name: "AI LAW",
  des: {},
  feature: [
    "Your legal questions answered instantly with our Law Q&A app.",
    "Legal advice at your fingertips - download our Law Q&A app today.",
    "Get quick and reliable legal answers with our Law Q&A app.",
    "Simplify legal jargon with our easy-to-use Law Q&A app."
  ],
  logo: "https://media.whiteg.app/lgbtapp.s3.ap-southeast-1.amazonaws.com/2023/05/11_1683775790170/640840ad76d23263d0cc7b4b/logo%20law.png",
  link: {
    android: "https://play.google.com/store/apps/details?id=com.iceo.law.ai",
    ios: "https://apps.apple.com/vn/app/ai-lawyer-law-help/id6448503698"
  },
  deeplink: "iceo.law",
  video: "https://media.whiteg.app/lgbtapp.s3.ap-southeast-1.amazonaws.com/2023/06/05_1685935121336/642a49eb18acaeada350130e/ailaw.mp4",
  public_album: [{
    _id: "public-1",
    media_url: "https://media.whiteg.app/lgbtapp.s3.ap-southeast-1.amazonaws.com/2023/06/05_1685935303094/642a49eb18acaeada350130e/law1.jpeg"
  }, {
    _id: "public-2",
    media_url: "https://media.whiteg.app/lgbtapp.s3.ap-southeast-1.amazonaws.com/2023/06/05_1685935312213/642a49eb18acaeada350130e/law2.jpeg"
  }, {
    _id: "public-3",
    media_url: "https://media.whiteg.app/lgbtapp.s3.ap-southeast-1.amazonaws.com/2023/06/05_1685935321302/642a49eb18acaeada350130e/law3.jpeg"
  }]
};

export const useRandomApp = () => {
  const ecosystem = useAppSelector(state => state.system.ecosystem);

  const randomAppAds = () => {
    return ecosystem?.[Math.floor(Math.random() * ecosystem.length)] || DEFAULT_ECOSYSTEM;
  };

  return { randomAppAds };
};

export const sendEventToAppsflyer = (title, content) => {
  console.log("logEventToAppsflyer", title, content);

  appsFlyer.logEvent(
    title,
    content,
    (res) => {
      console.log("send Appsflyer success", res);
    },
    (err) => {
      console.log("send Appsflyer failed", err);
    }
  );
};
