/**
 * @format
 */

import 'react-native-gesture-handler';
import "react-native-get-random-values";
import {AppRegistry, LogBox, Pressable, TextInput, TouchableOpacity, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {TouchableOpacity as TouchableOpacityGesture} from 'react-native-gesture-handler';
// import messaging from "@react-native-firebase/messaging";


Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
};
TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false,
};
TouchableOpacity.defaultProps = {
    ...(TouchableOpacity.defaultProps || {}),
    activeOpacity: 0.8,
};
Pressable.defaultProps = {
    ...(Pressable.defaultProps || {}),
};
TouchableOpacityGesture.defaultProps = {
    ...(TouchableOpacityGesture.defaultProps || {}),
    activeOpacity: 0.8,
};


/**
 * Xử ký notification khi app không mở
 */
// messaging().setBackgroundMessageHandler(async (notification) => {
//     try {
//         // await notifee
//         //   .incrementBadgeCount()
//         //   .then(() => notifee.getBadgeCount())
//         //   .then(count => console.log('Badge count incremented by 1 to: ', count));
//
//         // badgeCount += 1;
//         console.log("-----setBackgroundMessageHandler", notification);
//         /**
//          * Lưu thông báo nhận khi app được khởi chạy ngầm
//          */
//         // SqLiteHelper.insertNotification({
//         //     notification_message_id: notification.messageId,
//         //     notification_title: notification?.notification?.title,
//         //     notification_content: notification?.notification?.body,
//         //     notification_data: notification.data,
//         //     createAt: notification.sentTime,
//         //     isRead: false
//         // }).then((result) => console.log(result, "9-1v19mvv1"))
//
//         return Promise.resolve()
//     } catch (error) {
//         console.log(error, "error ljdfjldsbfjl")
//     }
//
// });

function HeadlessCheck({isHeadless}) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }

    return <Application/>;
}

LogBox.ignoreLogs([
    'Warning: Ended a touch event which was not counted in `trackedTouchCount`.',
    'ImmutableStateInvariantMiddleware'
])

function Application() {
    return <App/>
}

AppRegistry.registerComponent(appName, () => Application);
