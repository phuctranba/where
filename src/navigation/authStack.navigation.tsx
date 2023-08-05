import React from "react";

import {
  NAVIGATION_SIGN_IN_SCREEN,
  NAVIGATION_SIGN_UP_SCREEN,
  NAVIGATION_WELCOME_SCREEN
} from "constants/router.constant";
import { useSystem } from "helpers/system.helper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "configs/store.config";

import WelcomeScreen from "screens/welcome/welcome.screen";
import SignInScreen from "screens/signIn/signIn.screen";
import SignUpScreen from "screens/signUp/signUp.screen";
import { RootColor } from "ui/theme";

const NativeStack = createNativeStackNavigator();

const AuthStackNavigation = () => {
  const { theme } = useSystem();
  const isFirstOpen = useAppSelector(state => state.system.isFirstOpen);

  return (
    <NativeStack.Navigator
      initialRouteName={isFirstOpen ? NAVIGATION_WELCOME_SCREEN : NAVIGATION_SIGN_IN_SCREEN}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible:false,
        headerTitleAlign: "center",
        headerTintColor: theme.text,
        animation: "slide_from_right",
        headerBackTitle: ""
      }}
    >
      <NativeStack.Screen name={NAVIGATION_WELCOME_SCREEN} component={WelcomeScreen} options={{ headerShown: false }} />
      <NativeStack.Screen name={NAVIGATION_SIGN_IN_SCREEN} component={SignInScreen} options={{ headerShown: false }} />
      <NativeStack.Screen name={NAVIGATION_SIGN_UP_SCREEN} component={SignUpScreen} options={{ headerTitle:'' }} />

    </NativeStack.Navigator>
  );
};

export default AuthStackNavigation;
