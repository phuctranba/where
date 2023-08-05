import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {Device} from 'ui/device.ui';

export const ID_ECOSYSTEM = "com.zipenter.where";

export const DEEP_LINK = "zipenter.where"
export const WEBSITE_FRONTEND = 'https://whiteg.appuni.io/';
export const APP_ID_IOS = "6448503698"
export const WEB_CLIENT_ID_GOOGLE = "243830480141-4nnmbb592d3nompjhlm5vq1qfq0co9lk.apps.googleusercontent.com"
export const IOS_CLIENT_ID_GOOGLE = "243830480141-apkqqvt05ee497snbgi5nqgca8jqqr05.apps.googleusercontent.com"
export const SHARED_SERCET_KEY_APPLE = '5a3dfe0ee6cc41359e52d09dbfe530b3'
export const TERM_URL = "https://ai-lawer.gitbook.io/ai-lawyer/"
export const POLICIES_URL = "https://ai-lawyer-law-help.gitbook.io/untitled/privacy-ai-lawyer-law-help"

export const PERMISSION = {
    permissionVideoCall: Device.isIos ?
        [
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.IOS.MICROPHONE,
        ]
        :
        [
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.RECORD_AUDIO,
        ],
    permissionMedia: Device.isIos ?
        [
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.IOS.MICROPHONE,
            PERMISSIONS.IOS.PHOTO_LIBRARY
        ]
        :
        Number(Platform.Version) >= 33 ? [
                PERMISSIONS.ANDROID.CAMERA,
                PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
                PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
            ] :
            [
                PERMISSIONS.ANDROID.CAMERA,
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
            ],
    permissionRecord: Device.isIos ?
        [
            PERMISSIONS.IOS.MICROPHONE,
        ]
        :
        Number(Platform.Version) >= 33 ? [
                PERMISSIONS.ANDROID.RECORD_AUDIO,
                PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
            ] :
            [
                PERMISSIONS.ANDROID.RECORD_AUDIO,
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
            ],
    permissionLibrary: Device.isIos ?
        [
            PERMISSIONS.IOS.PHOTO_LIBRARY
        ]
        :
        Number(Platform.Version) >= 33 ? [
                PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
            ] :
            [
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
            ],
    permissionCamera: Device.isIos ?
        [
            PERMISSIONS.IOS.CAMERA
        ]
        :
        [
            PERMISSIONS.ANDROID.CAMERA,
        ],
    permissionCall: Device.isIos ?
        []
        :
        [
            PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
            PERMISSIONS.ANDROID.CALL_PHONE
        ],
}


export enum EnumTheme {
    Dark = "Dark",
    Light = "Light"
}

export enum KeyStorage {
    FmcToken = "FmcToken",
    Authorization = "Authorization",
}
