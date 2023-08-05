import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import TextBase from "components/Base/text.base";
import ImageLoadBase from "components/Base/image.load.base";
import { Shadow1 } from "ui/shadow.ui";


export default function ListBrandHome() {
  const { styles, theme } = useSystem(createStyles);

  const renderItem = useCallback(() => {
    return (
      <View style={styles.containerItem}>
        <ImageLoadBase source={require("assets/images/brand1.png")}
                       style={styles.imgBrand} />
        <TextBase title={"BMW"} style={styles.txtBrand} />
      </View>
    );
  }, []);

  return (
    <FlatList
      horizontal
      data={[1, 2, 3, 4, 5]}
      style={styles.container}
      renderItem={renderItem}
      contentContainerStyle={styles.contentContainerStyle}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    contentContainerStyle: {
      paddingVertical: VS._4,
      gap: HS._12,
      paddingHorizontal: HS._16,
      marginVertical: VS._20
    },
    imgBrand: {
      width: MHS._34,
      height: MHS._34
    },
    containerItem: {
      justifyContent: "center",
      alignItems: "center",
      width: MHS._90,
      height: MHS._90,
      backgroundColor: "#ffffff",
      borderRadius: MHS._12,
      ...Shadow1
    },
    txtBrand: {
      marginTop: VS._4,
      fontSize: FontSizes._12
    }
  });
};
