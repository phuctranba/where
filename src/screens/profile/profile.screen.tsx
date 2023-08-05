import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import ImageAvatarBase from "components/Base/image.avatar.base";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import { SafeAreaView } from "react-native-safe-area-context";
import TextBase from "components/Base/text.base";
import {
  IconAbout,
  IconArrowRightSimple, IconDiscount,
  IconEdit, IconFeedback,
  IconHeart,
  IconLocation,
  IconLogout,
  IconQuestion, IconRating,
  IconSetting,
  IconSupport,
  IconTerm,
  IconUser
} from "assets/svgIcons";
import navigationHelper from "helpers/navigation.helper";
import {
  NAVIGATION_ABOUT_SCREEN,
  NAVIGATION_EDIT_PROFILE_SCREEN,
  NAVIGATION_FEEDBACK_SCREEN
} from "constants/router.constant";
import { useAppSelector } from "configs/store.config";



export default function ProfileScreen() {
  const { styles, theme } = useSystem(createStyles);
  const user_avatar = useAppSelector(state => state.user.account.user_avatar);

  const [DATA_OPTIONS] = useState([
    {
      title:"My Profile",
      icon: <IconUser size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN),
      isHasArrow: true
    },
    {
      title:"Favourite Cars",
      icon: <IconHeart size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN),
      isHasArrow: true
    },
    {
      title:"Discount",
      icon: <IconDiscount size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN),
      isHasArrow: true
    },
    {
      title:"FAQ",
      icon: <IconQuestion size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN),
      isHasArrow: true
    },
    {
      title:"Support Center",
      icon: <IconSupport size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN),
      isHasArrow: true
    },
    {
      title:"Term & Conditions",
      icon: <IconTerm size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN),
      isHasArrow: false
    },
    {
      title:"Feedback",
      icon: <IconFeedback size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_FEEDBACK_SCREEN),
      isHasArrow: true
    },
    {
      title:"Settings",
      icon: <IconSetting size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN),
      isHasArrow: true
    },
    {
      title:"About",
      icon: <IconAbout size={FontSizes._26} color={theme.text} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_ABOUT_SCREEN),
      isHasArrow: true
    },
    {
      title:"Logout",
      icon: <IconLogout size={FontSizes._26} color={RootColor.RedNegative} />,
      onPress: ()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN),
      isHasArrow: false
    }
  ])

  const renderOption = useCallback((item)=>{
      return(
        <Pressable onPress={item.onPress} style={styles.containerOption} key={item.title}>
          <View style={styles.viewIconOptions}>
            {item.icon}
          </View>
          <TextBase title={item.title} style={styles.txtOption} />
          {item.isHasArrow?<IconArrowRightSimple size={FontSizes._18} color={theme.textInactive} />:null}
        </Pressable>
      )
    },[])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable style={styles.viewProfile} onPress={()=>navigationHelper.navigate(NAVIGATION_EDIT_PROFILE_SCREEN)}>
          <ImageAvatarBase source={{ uri: user_avatar}} style={styles.imgAvatar} />
          <View style={styles.viewName}>
            <TextBase title={"William Mike"} style={styles.txtName} />
            <View style={styles.viewEdit}>
              <TextBase title={"Edit Profile"} style={styles.txtEdit} />
              <IconEdit color={RootColor.MainColor} size={FontSizes._18} />
            </View>
          </View>
        </Pressable>

        <View style={styles.stroke} />

        <View style={styles.containerOptions}>
          {DATA_OPTIONS.map(renderOption)}
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
      paddingBottom: VS._50,
      paddingHorizontal: HS._16
    },
    imgAvatar: {
      width: MHS._60,
      height: MHS._60,
      borderRadius: MHS._12
    },
    viewProfile: {
      flexDirection: "row",
      marginVertical: MHS._26
    },
    viewName: {
      marginHorizontal: HS._12,
      justifyContent: "center",
      flex: 1
    },
    viewEdit: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    txtName: {
      fontWeight: "bold",
      color: theme.text,
      fontSize: FontSizes._20,
      marginBottom: VS._4
    },
    txtEdit: {
      color: RootColor.MainColor,
      fontSize: FontSizes._14
    },
    stroke: {
      backgroundColor: theme.textInactive,
      height: 0.5,
      width: "100%"
    },
    containerOptions: {
      flex: 1
    },
    containerOption: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: VS._12
    },
    viewIconOptions: {
      backgroundColor: theme.backgroundTextInput,
      borderRadius: MHS._6,
      padding: MHS._8
    },
    txtOption: {
      marginHorizontal: HS._12,
      color: theme.text,
      fontSize: FontSizes._16,
      flex: 1
    }
  });
};
