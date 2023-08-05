// import { Platform, ToastAndroid } from "react-native";
// import SimpleToast from 'react-native-simple-toast';
// import Share from "react-native-share";
//
// export const downloadVideoOrImage = async (url = "", pathAndroid: string, pathIos: string) => {
//   if (!url) {
//     return;
//   }
//   RNFetchBlob.config({
//     fileCache: true,
//     addAndroidDownloads: {
//       useDownloadManager: true,
//       notification: true,
//       path: pathAndroid,
//       description: 'video'
//     },
//     path: pathIos
//   })
//     .fetch('GET', url)
//     .progress((received, total) => {
//     })
//     .then(async res => {
//       if (Platform.OS === "ios") {
//         Share.open({
//           url: `file://${res.path()}`,
//           excludedActivityTypes: ["saveToCameraRoll"]
//         })
//       } else {
//         if (Platform.OS == "android") {
//           ToastAndroid.show("Saved", ToastAndroid.BOTTOM)
//         } else {
//           SimpleToast.showWithGravity("Saved", SimpleToast.SHORT, SimpleToast.BOTTOM);
//         }
//       }
//     })
//     .catch((e) => {
//       console.log("error", e);
//     })
// }
