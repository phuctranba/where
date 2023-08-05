import React from "react";

import {
  NAVIGATION_ABOUT_SCREEN,
  NAVIGATION_EDIT_PROFILE_SCREEN,
  NAVIGATION_FEEDBACK_SCREEN,
  NAVIGATION_TAB
} from "constants/router.constant";
import { useSystem } from "helpers/system.helper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigation from "navigation/bottomTab.navigation";
import EditProfileScreen from "screens/editProfile/editProfile.screen";
import FeedbackScreen from "screens/feedback/feedback.screen";
import AboutScreen from "screens/about/about.screen";

const NativeStack = createNativeStackNavigator();

const MainStackNavigation = () => {
  const { theme } = useSystem();

  return (
    <NativeStack.Navigator
      initialRouteName={NAVIGATION_TAB}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background
        },
        headerTitleAlign: "center",
        headerTintColor: theme.text,
        animation: "slide_from_right",
        headerBackTitle: ""
      }}
    >
      <NativeStack.Screen name={NAVIGATION_TAB} component={BottomTabNavigation} options={{ headerShown: false }} />
      <NativeStack.Screen name={NAVIGATION_EDIT_PROFILE_SCREEN} component={EditProfileScreen}
                          options={{ headerTitle: "Edit profile" }} />
      <NativeStack.Screen name={NAVIGATION_FEEDBACK_SCREEN} component={FeedbackScreen}
                          options={{ headerTitle: "Send your feedback" }} />
      <NativeStack.Screen name={NAVIGATION_ABOUT_SCREEN} component={AboutScreen}
                          options={{ headerTitle: "About us" }} />
    </NativeStack.Navigator>
  );
};

export default MainStackNavigation;
