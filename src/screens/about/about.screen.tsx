import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { SystemTheme } from "ui/theme";
import { HS, MHS } from "ui/sizes.ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow2 } from "ui/shadow.ui";


export default function AboutScreen() {
  const { styles, theme } = useSystem(createStyles);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}>
        <View style={styles.containerContent}>
          <Image source={require("assets/images/logo.png")}
                 style={styles.imgAvatar} />

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: HS._16
    },
    containerContent: {
      alignItems: "center"
    },
    contentContainerStyle: {
      flexGrow: 1,
      justifyContent: "space-between"
    },
    imgAvatar: {
      width: "60%"
    },
    btnAvatar: {
      borderRadius: MHS._26,
      overflow: "hidden",
      ...Shadow2
    }
  });
};
