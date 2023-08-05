import React, { useCallback, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import TextBase from "components/Base/text.base";
import { Device } from "ui/device.ui";
import { Shadow1, Shadow2 } from "ui/shadow.ui";
import ItemCarHome from "screens/home/components/itemCar.home";
import { IconLocation, IconSearch } from "assets/svgIcons";
import ImageAvatarBase from "components/Base/image.avatar.base";
import ListBrandHome from "screens/home/components/listBrand.home";
import { useAppSelector } from "configs/store.config";


export default function HomeScreen() {
  const { styles, theme } = useSystem(createStyles);
  const user_avatar = useAppSelector(state => state.user.account.user_avatar);

  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={styles.containerHeaderComponent}>
        {/*location và avatar*/}
        <View style={styles.viewLocationAvatar}>
          <Pressable style={styles.btnLocation}>
            <View style={styles.viewIcLocation}>
              <IconLocation size={FontSizes._22} color={theme.text} />
            </View>
            <View style={styles.viewTxtLocation}>
              <TextBase title={"Your location"} style={styles.txtYourLocation} />
              <TextBase title={"Norvey, USA"} style={styles.txtLocation} />
            </View>
            <ImageAvatarBase
              source={{ uri:user_avatar}}
              style={styles.imgAvatar}
            />
          </Pressable>
        </View>

        {/*search*/}
        <TextBase style={styles.txtSelect} title={"Select or search your"} />
        <TextBase style={styles.txtFavourite} title={"Favourite vehicle"} />
        <View style={styles.viewTextInput}>
          <IconSearch size={FontSizes._22} color={theme.textInactive} />
          <TextBase style={styles.txtPlaceHolder} title={"Search your favourite car"} />
        </View>

        {/*list hãng xe*/}
        <ListBrandHome/>

        <View style={styles.viewAllCars}>
          <TextBase style={styles.txtAllCars} title={"All Cars in Hanoi"}/>
          <TextBase style={styles.txtViewAll} title={"View All"}/>
        </View>

      </View>
    );
  }, []);

  const renderItem = useCallback(({index}) => {
    return <ItemCarHome item index={index} />;
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
      paddingBottom: VS._50
    },
    containerHeaderComponent: {
      // paddingHorizontal: HS._20
    },
    viewIcLocation: {
      backgroundColor: "#ffffff",
      padding: MHS._6,
      borderRadius: MHS._6,
      ...Shadow2
    },
    btnLocation: {
      flexDirection: "row",
      alignItems: "center"
    },
    viewLocationAvatar: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: VS._20,
      paddingHorizontal: HS._16
    },
    txtYourLocation: {
      color: theme.textInactive
    },
    txtLocation: {
      color: theme.text,
      fontWeight: "bold",
      fontSize: FontSizes._18
    },
    viewTxtLocation: {
      marginLeft: HS._12,
      flex: 1
    },
    imgAvatar: {
      width: MHS._40,
      height: MHS._40,
      borderRadius: MHS._40
    },
    viewTextInput: {
      backgroundColor: "#ffffff",
      marginHorizontal: HS._16,
      paddingHorizontal: HS._12,
      paddingVertical: MHS._14,
      borderRadius: MHS._12,
      flexDirection: "row",
      alignItems: 'center',
      ...Shadow1
    },
    txtSelect: {
      fontSize: FontSizes._26,
      fontWeight: "bold",
      color: theme.text,
      marginHorizontal: HS._16
    },
    txtFavourite: {
      marginVertical: VS._12,
      fontSize: FontSizes._26,
      fontWeight: "bold",
      color: RootColor.MainColor,
      marginHorizontal: HS._16
    },
    txtPlaceHolder:{
      color: theme.textInactive,
      marginHorizontal: HS._12,
      fontSize: FontSizes._16
    },
    viewAllCars:{
      // marginVertical: VS._16,
      marginBottom: VS._8,
      marginHorizontal: HS._16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    txtAllCars:{
      color: theme.text,
      fontWeight: 'bold',
      fontSize: FontSizes._18
    },
    txtViewAll:{
      color: RootColor.MainColor,
      fontSize: FontSizes._14
    }
  });
};
