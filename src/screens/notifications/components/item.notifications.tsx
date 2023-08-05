import React from "react";
import { StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import ImageLoadBase from "components/Base/image.load.base";
import TextBase from "components/Base/text.base";
import { IconStar } from "assets/svgIcons";
import dayjs from "dayjs";


export default function ItemNotifications({ item, index }) {
  const { styles, theme } = useSystem(createStyles);

  return (
    <View style={styles.container}>
      <ImageLoadBase source={require("assets/images/car1.png")}
                     style={styles.imgTitleNotification}
                     resizeMode={"contain"} />

      <View style={styles.containerInfo}>
        <TextBase title={"Car has been delivered"} style={styles.txtTitleNotification} />
        <TextBase style={styles.txtDescriptionNotification}>
          <TextBase style={styles.txtDescriptionNotificationSpecial} title={"Maybach 450 "}/>
          <TextBase title={"car has been delivered to"}/>
          <TextBase style={styles.txtDescriptionNotificationSpecial} title={" 123 Nguyen Trai, Ha Dong "}/>
          <TextBase title={"according to order number"}/>
          <TextBase style={styles.txtDescriptionNotificationSpecial} title={" 8723VN8NB"}/>
        </TextBase>
        <TextBase title={dayjs().format("HH:ss MMM DD, YYYY")} style={styles.txtTimeNotification} />
      </View>
    </View>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      marginVertical: VS._8,
      flexDirection: "row"
    },
    imgTitleNotification: {
      width: MHS._50,
      height: MHS._50,
      borderRadius: MHS._6
    },
    viewInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: VS._2
    },
    containerInfo: {
      flex: 1,
      paddingHorizontal: HS._8,
      marginBottom: MHS._8
    },
    txtTitleNotification: {
      flex: 1,
      fontWeight: "bold",
      fontSize: FontSizes._16,
      color: theme.text
    },
    txtDescriptionNotification: {
      fontSize: FontSizes._14,
      color: theme.text,
      marginVertical: VS._4,
    },
    txtDescriptionNotificationSpecial:{
      color: RootColor.MainColor,
      fontWeight: 'bold'
    },
    txtTimeNotification: {
      fontSize: FontSizes._12,
      color: theme.textInactive
    },
    txtPrice: {
      textAlign: "right",
      flex: 1
    },
    txtStar: {
      fontSize: FontSizes._14,
      color: theme.text,
      marginLeft: HS._8
    },
    txtPriceNumber: {
      fontWeight: "bold",
      color: RootColor.MainColor,
      fontSize: FontSizes._18
    },
    btnLike: {
      position: "absolute",
      right: MHS._12,
      top: MHS._12,
      padding: MHS._8,
      borderRadius: MHS._100,
      backgroundColor: `${theme.textInactive}10`
    }
  });
};
