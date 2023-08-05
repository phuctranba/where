import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NAVIGATION_HOME_SCREEN,
  NAVIGATION_NOTIFICATIONS_SCREEN,
  NAVIGATION_ORDER_SCREEN,
  NAVIGATION_PROFILE_SCREEN
} from "constants/router.constant";
import React from "react";
import { useSystem } from "helpers/system.helper";
import { Device } from "ui/device.ui";
import { FontSizes, MHS, VS } from "ui/sizes.ui";
import { Shadow2 } from "ui/shadow.ui";
import HomeScreen from "screens/home/home.screen";
import { IconHome, IconNotification, IconOrder, IconUser } from "assets/svgIcons";
import { View } from "react-native";
import ProfileScreen from "screens/profile/profile.screen";
import NotificationsScreen from "screens/notifications/notifications.screen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  const { theme } = useSystem();


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.btnActive,
        tabBarInactiveTintColor: `${theme.text}60`,
        tabBarLabelStyle: {
          marginBottom: Device.isIos ? "auto" : VS._10,
          fontSize: FontSizes._11,
          fontWeight: "bold"
        },
        headerStyle: {
          backgroundColor: theme.background
        },
        headerTitleAlign: "center",
        headerTintColor: theme.text,
        gestureEnabled: false,
        animation: "slide_from_right",
        headerBackTitle: "",
        tabBarShowLabel: false,
        tabBarStyle: {
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
          backgroundColor: 'rgba(255,255,255,0.95)',
          // borderTopLeftRadius: MHS._20,
          // borderTopRightRadius: MHS._20,
          alignItems: "center",
          // paddingVertical: MHS._6,
          height: VS._50,
          ...Shadow2
        },
        tabBarIcon: ({ focused, color }) => {
          let Icon: any;

          switch (route.name) {
            case NAVIGATION_HOME_SCREEN: {
              Icon = <IconHome size={FontSizes._24} color={color} />;
              break;
            }
            case NAVIGATION_ORDER_SCREEN: {
              Icon = <IconOrder size={FontSizes._24} color={color} />;
              break;
            }
            case NAVIGATION_NOTIFICATIONS_SCREEN: {
              Icon = <IconNotification size={FontSizes._24} color={color} />;
              break;
            }
            default: {
              Icon = <IconUser size={FontSizes._24} color={color} />;
              break;
            }
          }
          return (
            <View>
              {Icon}
            </View>
          );
        }
      })}
      initialRouteName={NAVIGATION_HOME_SCREEN}
    >
      <Tab.Screen name={NAVIGATION_HOME_SCREEN} component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name={NAVIGATION_ORDER_SCREEN} component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name={NAVIGATION_NOTIFICATIONS_SCREEN} component={NotificationsScreen} options={{ headerShown: false }} />
      <Tab.Screen name={NAVIGATION_PROFILE_SCREEN} component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
