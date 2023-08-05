import SpInAppUpdates, {IAUUpdateKind, StartUpdateOptions} from "sp-react-native-in-app-updates";
import DeviceInfo from "react-native-device-info";
import {Platform} from "react-native";

export function checkUpdateFromStore() {
    const inAppUpdates = new SpInAppUpdates(false);
    // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
    inAppUpdates.checkNeedsUpdate({curVersion: DeviceInfo.getVersion()}).then((result) => {
        if (result.shouldUpdate) {
            const updateOptions = Platform.select({
                ios: {
                    title: 'Update available',
                    message: "There is a new version of the app available on the App Store, do you want to update it?",
                    buttonUpgradeText: 'Update',
                    buttonCancelText: 'Cancel',
                    // country: 'it', // 👈🏻 the country code for the specific version to lookup for (optional)
                },
                android: {
                    updateType: IAUUpdateKind.FLEXIBLE,
                },
            }) as StartUpdateOptions;
            inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
        }
    }).catch((error) => {
        console.log("error checkNeedsUpdate", error);
    });
}
