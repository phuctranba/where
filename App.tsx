import React, {useEffect} from 'react';

import WrapActionSheetView from 'components/ActionSheet/WrapActionSheetView';
import WrapAlertView from 'components/Alert/WrapAlertView';
import {GlobalPopupApp} from 'components/GlobalComponent/popup.globalComponent';
import WrapDropdown from 'components/DropdownAlert/wrapDropdown';
import getStore, {persistor} from 'configs/store.config';
import {setUpNotification,} from 'helpers/firebase.helper';
import {GlobalPopupHelper} from 'helpers/index';
import AppNavigation from 'navigation/index';
import {StyleSheet,} from 'react-native';
import DisconnectNetworkScreen from 'components/Modals/disconectNetwork.modal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {withIAPContext} from 'react-native-iap';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {logEventAnalytics} from "helpers/system.helper";
import CodePush from 'react-native-code-push';
import {checkUpdateFromStore} from "helpers/inAppUpdate.helper";
import {EnumAnalyticEvent} from "constants/analytics.constant";
// import OpenAppAdmob from "components/Admob/OpenAppAdmob";
// import RewardAdmob from "components/Admob/RewardAdmob";
// import OpenAppAds from 'components/OpenAppAds/open.app.ads';
// import { createDB } from 'helpers/sqlite.helper';
import { Settings } from 'react-native-fbsdk-next';
import RewardAdmob from "components/Admob/RewardAdmob";
import AdsRewardComponent from "components/Admob/RewardAdmob";
// import AlertViewAds from 'components/Alert/AlertViewAds';
// import appsFlyer from 'react-native-appsflyer';


/**
 * Cài đặt FB SDK
 */
Settings.setAppID("848898993252602")
Settings.initializeSDK();
Settings.setAdvertiserTrackingEnabled(true)


/**
 * Cài đặt appflyer
 */
// appsFlyer.initSdk(
//     {
//         devKey: "gMpXXJUTaB3u2fqGQ2EAFo",
//         isDebug: false,
//         appId: APP_ID_IOS,
//         onInstallConversionDataListener: true, //Optional
//         onDeepLinkListener: true, //Optional
//         timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
//     },
//     (result) => {
//         console.log(result);
//     },
//     (error) => {
//         console.log("error", error);
//     }
// );

const store = getStore();

const App = () => {
    useEffect(() => {
        /**
         * Log event mới vào app và check update
         */
        logEventAnalytics(EnumAnalyticEvent.Loading)
        checkUpdateFromStore()

        /**
         * App có SQLite
         */
        // createDB().catch((error) => console.log(error, "7nc94nc348"));


        /**
         * App có notification
         */
        setUpNotification().catch(console.log)
    }, [])


    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <AppNavigation/>

                        {/*Loading hoặc progress*/}
                        <GlobalPopupApp ref={GlobalPopupHelper.globalUIRef}/>

                        {/*Toast màu sắc trên top*/}
                        <WrapDropdown ref={GlobalPopupHelper.globalAlertRef}/>

                        {/*Alert option có không*/}
                        <WrapAlertView ref={GlobalPopupHelper.alertRef}/>

                        {/*Option trượt từ dưới lên trên*/}
                        <WrapActionSheetView ref={GlobalPopupHelper.actionSheetRef}/>

                        {/*Modal mất mạng*/}
                        <DisconnectNetworkScreen/>

                        {/*Khi cần sử dụng admob*/}
                        {/*<AlertViewAds ref={GlobalPopupHelper.alertAdsRef}/>*/}
                        {/*<OpenAppAdmob ref={GlobalPopupHelper.admobGlobalRef}/>*/}
                        <AdsRewardComponent ref={GlobalPopupHelper.adsRewardRef}/>
                    </PersistGate>
                </Provider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

let codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_START,
    installMode: CodePush.InstallMode.ON_NEXT_RESTART
}

export default CodePush(codePushOptions)(withIAPContext(App));
