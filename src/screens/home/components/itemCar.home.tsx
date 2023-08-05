import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import ImageLoadBase from "components/Base/image.load.base";
import { Shadow1 } from "ui/shadow.ui";
import TextBase from "components/Base/text.base";
import { IconHeart, IconHeartFill, IconStar } from "assets/svgIcons";


export default function ItemCarHome({ item, index }) {
  const { styles, theme } = useSystem(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.containerItem}>
        <ImageLoadBase source={require("assets/images/model1.png")}
                       style={styles.imgModel}
                       resizeMode={"contain"} />

        <View style={styles.containerInfo}>
          <View style={styles.viewInfo}>
            <TextBase title={"Maserati 867"} style={styles.txtName} />
            <TextBase title={"Automatic"} style={styles.txtType} />
          </View>
          <View style={styles.viewInfo}>
            <IconStar color={RootColor.PremiumColor} size={FontSizes._20} />
            <TextBase title={"4.8"} style={styles.txtStar} />
            <TextBase style={styles.txtPrice}><TextBase title={"$540"} style={styles.txtPriceNumber} />/day</TextBase>
          </View>
        </View>

        <Pressable style={styles.btnLike}>
          {index % 2 ?
            <IconHeartFill color={RootColor.MainColor} size={FontSizes._20} />
            :
            <IconHeart color={theme.textInactive} size={FontSizes._20} />
          }

        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: HS._16,
      marginVertical: VS._8
    },
    containerItem: {
      backgroundColor: "#ffffff",
      borderRadius: MHS._16,
      paddingHorizontal: HS._8,
      ...Shadow1
    },
    imgModel: {
      width: "100%",
      height: MHS._170
    },
    viewInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: VS._2
    },
    containerInfo: {
      paddingHorizontal: HS._8,
      marginBottom: MHS._8
    },
    txtName: {
      flex: 1,
      fontWeight: "bold",
      fontSize: FontSizes._18,
      color: theme.text
    },
    txtType: {
      color: theme.textInactive,
      fontSize: FontSizes._14

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
