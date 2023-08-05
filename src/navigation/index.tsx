import React, { useEffect, useRef } from "react";

import setupAxiosInterceptors from "configs/axios.config";
import { useAppSelector } from "configs/store.config";
import { DEEP_LINK, EnumTheme } from "constants/system.constant";
import { navigationRef } from "helpers/navigation.helper";
import { usePurchase } from "helpers/purchase.helper";
import { PRODUCTS, SUBSCRIPTIONS, useSystem } from "helpers/system.helper";
import { languages } from "languages";
import { StatusBar, StyleSheet, View } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import { setupColorForSoftMenuBar } from "ui/device.ui";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RNBootSplash from "react-native-bootsplash";
import { logScreenToFirebase } from "helpers/analytics.helper";
import { NAVIGATION_AUTH_STACK, NAVIGATION_MAIN_STACK } from "constants/router.constant";
import MainStackNavigation from "navigation/mainStack.navigation";
import AuthStackNavigation from "navigation/authStack.navigation";

setupAxiosInterceptors((status: number) => {
  switch (status) {
    case 401:
      // GlobalPopupHelper.showPopupRequestLogin()
      break;
    case 403:
      // GlobalPopupHelper.showPopupNoPermission()
      break;
  }
});


const NativeStack = createNativeStackNavigator();


function AppNavigation() {
  const language = useAppSelector(state => state.system.language);
  const themeSet = useAppSelector(state => state.system.theme);
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
  const routeNameRef = useRef<any>();
  const { theme } = useSystem();

  const { initIAP } = usePurchase(false);

  useEffect(() => {
    setupColorForSoftMenuBar(themeSet);
  }, [themeSet]);

  useEffect(() => {
    /**
     * Gọi lấy config
     */
    // getConfig();


    /**
     * Load trước các gói purchase
     */
    initIAP({ subscriptionIds: SUBSCRIPTIONS, productIds: PRODUCTS });
  }, []);


  useEffect(() => {
    languages.setLanguage(language);
  }, [language]);

  return (
    <View style={styles.container}>
      <NavigationContainer ref={navigationRef}
                           linking={{
                             prefixes: [`${DEEP_LINK}://`]
                           }}
                           onReady={() => {
                             /**
                              * Đăng ký check state, logtime
                              */
                             // pointTime.current = new Date().getTime();
                             routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;

                             logScreenToFirebase(routeNameRef.current, routeNameRef.current);
                             RNBootSplash.hide({ fade: false });
                           }}
                           onStateChange={async () => {
                             const previousRouteName = routeNameRef.current;
                             const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;


                             if (previousRouteName !== currentRouteName && !__DEV__) {
                               logScreenToFirebase(currentRouteName || "", currentRouteName || "");
                             }
                             routeNameRef.current = currentRouteName;
                           }}>
        <StatusBar barStyle={themeSet == EnumTheme.Dark ? "light-content" : "dark-content"} translucent={true}
                   backgroundColor={theme.background} />
        <ErrorBoundary>
          <NativeStack.Navigator
            screenOptions={{
              animation: "slide_from_right"
            }}>
            {isAuthenticated ?
              <NativeStack.Screen
                name={NAVIGATION_MAIN_STACK}
                component={MainStackNavigation}
                options={{
                  headerShown: false
                }}
              /> :
              <NativeStack.Screen
                name={NAVIGATION_AUTH_STACK}
                component={AuthStackNavigation}
                options={{
                  headerShown: false
                }}
              />
            }
          </NativeStack.Navigator>
        </ErrorBoundary>
      </NavigationContainer>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AppNavigation;
