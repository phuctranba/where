import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import TextBase from "components/Base/text.base";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { HS, MHS, VS } from "ui/sizes.ui";
import { Shadow2 } from "ui/shadow.ui";
import notifee from "@notifee/react-native";

function NotifeeTest() {
  const { styles } = useSystem(createStyles);


  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel"
    });

    // Display a notification
    await notifee.displayNotification({
      title: "Notification Title",
      body: "Main body content of the notification",
      android: {
        channelId,
        // smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: "default"
        }
      }
    });
  }

  return (
    <View style={styles.container}>
      <TextBase title={"Notifee"} />

      <Pressable style={styles.btn} onPress={onDisplayNotification}>
        <TextBase title={"Bắn 1 cái noti"} style={styles.txtBtn} />
      </Pressable>
    </View>
  );
}


const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      width: "100%",
      paddingHorizontal: HS._12,
      alignItems: "center",
      paddingVertical: VS._28,
      borderBottomWidth: 1,
      borderBottomColor: theme.textDark
    },
    txtBtn: {
      color: theme.textLight
    },
    btn: {
      marginVertical: VS._12,
      paddingVertical: VS._10,
      backgroundColor: RootColor.MainColor,
      paddingHorizontal: HS._20,
      borderRadius: MHS._12,
      ...Shadow2
    }
  });
};


export default memo(NotifeeTest);
