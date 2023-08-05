import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import TextBase from "components/Base/text.base";
import { showToast, useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { HS, MHS, VS } from "ui/sizes.ui";
import { Shadow2 } from "ui/shadow.ui";
import Clipboard from "@react-native-community/clipboard";

function ClipBoardTest() {
  const { styles } = useSystem(createStyles);

  const onCopy = () => {
    Clipboard.setString("Hello đồ con bò 😂");
    showToast("Đã copy nội dung, paste đâu đó để đọc");
  };

  return (
    <View style={styles.container}>
      <TextBase title={"ClipBoard"} />

      <Pressable style={styles.btn} onPress={onCopy}>
        <TextBase title={"Ấn để sao chép nội dung"} style={styles.txtBtn} />
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


export default memo(ClipBoardTest);
