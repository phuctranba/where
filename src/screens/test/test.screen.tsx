import React, { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { SystemTheme } from "ui/theme";
import BottomSheetTest from "screens/test/components/BottomSheet/bottomSheet.test";
import { FillSizeBottomSheetTest } from "screens/test/components/BottomSheet/fillSize.bottomSheet.test";
import NotifeeTest from "screens/test/components/Notifee/notifee.test";
import ClipBoardTest from "screens/test/components/ClipBoard/clipBoard.test";


export default function TestScreen() {
  const { styles } = useSystem(createStyles);

// @gorhom/bottom-sheet
  const refFillSizeBottomSheetTest = useRef<any>();
  const openBottomSheet = () => refFillSizeBottomSheetTest.current?.show();

  return (
    <View style={styles.container}>
      <ScrollView>
        {/*  @gorhom/bottom-sheet*/}
        <BottomSheetTest openBottomSheet={openBottomSheet} />

        {/*  @invertase/react-native-apple-authentication*/}
        {/*  @notifee/react-native*/}
        <NotifeeTest />

        {/*  @react-native-community/clipboard*/}
        <ClipBoardTest />

        {/*  @react-native-community/hooks*/}
        {/*  @react-native-community/netinfo*/}
        {/*  @react-native-firebase/analytics*/}
        {/*  @react-native-firebase/app*/}
        {/*  @react-native-firebase/crashlytics*/}
        {/*  @react-native-firebase/firestore*/}
        {/*  @react-native-firebase/messaging*/}
        {/*  @react-native-google-signin/google-signin*/}
        {/*  @react-native-masked-view/masked-view*/}
        {/*  @react-navigation/bottom-tabs*/}
        {/*  @react-navigation/native*/}
        {/*  @react-navigation/native-stack*/}
        {/*  @react-navigation/stack*/}
        {/*  @reduxjs/toolkit*/}
        {/*  @shopify/flash-list*/}
        {/*  axios*/}
        {/*  dayjs*/}
        {/*  jwt-encode*/}
        {/*  libphonenumber-js*/}
        {/*  lottie-react-native*/}
        {/*  md5*/}
        {/*  patch-package*/}
        {/*  react*/}
        {/*  react-fast-compare*/}
        {/*  react-native*/}
        {/*  react-native-admob-native-ads*/}
        {/*  react-native-appsflyer*/}
        {/*  react-native-background-timer*/}
        {/*  react-native-blurhash*/}
        {/*  react-native-bootsplash*/}
        {/*  react-native-code-push*/}
        {/*  react-native-config*/}
        {/*  react-native-date-picker*/}
        {/*  react-native-device-country*/}
        {/*  react-native-device-info*/}
        {/*  react-native-error-boundary*/}
        {/*  react-native-fast-image*/}
        {/*  react-native-fs*/}
        {/*  react-native-gesture-handler*/}
        {/*  react-native-get-random-values*/}
        {/*  react-native-google-mobile-ads*/}
        {/*  react-native-hyperlink*/}
        {/*  react-native-iap*/}
        {/*  react-native-image-picker*/}
        {/*  react-native-image-zoom-viewer*/}
        {/*  react-native-in-app-review*/}
        {/*  react-native-keyboard-aware-scroll-view*/}
        {/*  react-native-linear-gradient*/}
        {/*  react-native-localization*/}
        {/*  react-native-markdown-display*/}
        {/*  react-native-mmkv*/}
        {/*  react-native-modal*/}
        {/*  react-native-permissions*/}
        {/*  react-native-reanimated*/}
        {/*  react-native-safe-area-context*/}
        {/*  react-native-safearea-height*/}
        {/*  react-native-screens*/}
        {/*  react-native-sha1*/}
        {/*  react-native-share*/}
        {/*  react-native-simple-toast*/}
        {/*  react-native-sqlite-storage*/}
        {/*  react-native-svg*/}
        {/*  react-native-typewriter*/}
        {/*  react-native-vector-icons*/}
        {/*  react-native-video*/}
        {/*  react-redux*/}
        {/*  redux*/}
        {/*  redux-logger*/}
        {/*  redux-persist*/}
        {/*  sp-react-native-in-app-updates*/}
        {/*  uuid*/}
      </ScrollView>

      {/*  @gorhom/bottom-sheet*/}
      <FillSizeBottomSheetTest ref={refFillSizeBottomSheetTest} />
    </View>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    }
  });
};
