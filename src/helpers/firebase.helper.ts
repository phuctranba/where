import messaging from "@react-native-firebase/messaging";
import getStore from "configs/store.config";
import {AppState} from "react-native";
import {bindActionCreators} from "redux";
import {setTokenFirebase} from "store/reducer/system.reducer.store";
import notifee from '@notifee/react-native';
import {getStorageString, setStorageString} from "helpers/storage.helper";
import {KeyStorage} from "constants/system.constant";

const store = getStore();
const actions = bindActionCreators({setTokenFirebase}, store.dispatch);

async function requestUserPermission() {
    // GlobalPopupHelper.admobGlobalRef.current?.setIgnoreOneTimeAppOpenAd();
    await notifee.requestPermission()
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log("Authorization status:", authStatus);
    }
}

async function getFCMToken() {
    const fcmToken = getStorageString(KeyStorage.FmcToken)
    if (!fcmToken) {
        try {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            if (token) {
                setStorageString(KeyStorage.FmcToken, token)
                return token;
            }
            return "";
        } catch (error) {
            console.log("error fcm token", error);
            return "";
        }
    }
    return fcmToken;
}


async function setUpNotification() {

    // GlobalPopupHelper.admobGlobalRef.current?.setIgnoreOneTimeAppOpenAd();
    await notifee.requestPermission()
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log("Authorization status:", authStatus);
    }

    notifee.createChannel({
        id: 'share_location_id',
        name: 'Default Channel',
    });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log("Notification caused app to open from background state:", remoteMessage.notification);
        const {data = {}} = remoteMessage || {};
        const {type_action = "", router = ""} = data;
        if (type_action == "link") {

        }
    });

    messaging()
        .subscribeToTopic("all")
        .then(() => console.log("Subscribed to topic all!"));

    messaging().onTokenRefresh((newFcmToken: string) => {
        console.log("refreshFCMToken", newFcmToken);

        let isAuth = store.getState()?.user?.isAuthenticated;
        if (isAuth) actions.setTokenFirebase(newFcmToken);
    });

    messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
            if (remoteMessage) {
                console.log("Notification caused app to open from quit state:", remoteMessage.notification);
            }
        });

    messaging().onMessage(async (remoteMessage) => {
        console.log("notification from foreground state....", remoteMessage, AppState.currentState);
        // if (Platform.OS == "android" && remoteMessage.data?.type_action !== "end_video_call" && remoteMessage.data?.type_action !== "end_audio_call" && remoteMessage.data?.type_action !== "video_call" && remoteMessage.data?.type_action !== "audio_call") {

        await notifee.displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body || "",
            android: {
                channelId: "share_location_id",
                // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                // pressAction: {
                //   id: 'default',
                // },
            },
        });
    });
};

export {requestUserPermission, setUpNotification, getFCMToken};

