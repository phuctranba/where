import React, { useCallback, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import TextBase from "components/Base/text.base";
import { Device } from "ui/device.ui";
import { Shadow2 } from "ui/shadow.ui";
import ItemNotifications from "screens/notifications/components/item.notifications";
import { IconDelete } from "assets/svgIcons";


export default function NotificationsScreen() {
  const { styles, theme } = useSystem(createStyles);

  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={styles.containerHeaderComponent}>
        <TextBase style={styles.txtSelect} title={"Notifications"} />

        <Pressable style={styles.btnDelete}>
          <IconDelete size={FontSizes._20} color={RootColor.RedNegative} />
        </Pressable>
      </View>
    );
  }, []);

  const renderItem = useCallback(({ index }) => {
    return <ItemNotifications item index={index} />;
  }, []);

  return (
    <FlatList
      data={[1, 2, 3, 4, 5]}
      style={styles.container}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.contentContainerStyle}
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
      paddingTop: Device.heightStatusBar,
      paddingBottom: VS._50,
      paddingHorizontal: HS._16
    },
    containerHeaderComponent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: VS._18
    },
    viewTxtLocation: {
      marginLeft: HS._12,
      flex: 1
    },
    txtSelect: {
      fontSize: FontSizes._26,
      fontWeight: "bold",
      color: theme.text
    },
    btnDelete: {
      backgroundColor: theme.backgroundTextInput,
      padding: MHS._8,
      borderRadius: MHS._8,
      ...Shadow2
    },
    stroke: {
      backgroundColor: theme.textInactive,
      height: 0.5,
      width: "100%"
    },
  });
};
