import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import TextBase from "components/Base/text.base";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { HS, MHS, VS } from "ui/sizes.ui";
import { Shadow2 } from "ui/shadow.ui";

function BottomSheetTest({ openBottomSheet }) {
  const { styles } = useSystem(createStyles);
  return (
    <View style={styles.container}>
      <TextBase title={"Botttom sheet"} />

      <Pressable style={styles.btn} onPress={openBottomSheet}>
        <TextBase title={"Mở một bottom sheet fill height"} style={styles.txtBtn} />
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


export default memo(BottomSheetTest);
