import React, { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { SystemTheme } from "ui/theme";
import ImageAvatarBase from "components/Base/image.avatar.base";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import { SafeAreaView } from "react-native-safe-area-context";
import TextBase from "components/Base/text.base";
import { IconEdit, IconMail, IconSmartPhone, IconUser } from "assets/svgIcons";
import { Shadow2 } from "ui/shadow.ui";
import TextInputBase from "components/Base/text.input.base";
import ButtonBase from "components/Base/button.base";
import { useAppDispatch, useAppSelector } from "configs/store.config";
import { updateProfileUser } from "store/reducer/user.reducer.store";
import { GlobalPopupHelper } from "helpers/index";
import navigationHelper from "helpers/navigation.helper";
import { requestPermission } from "helpers/permisison.helper";
import { PERMISSION } from "constants/system.constant";
import { launchImageLibrary } from "react-native-image-picker";
import { Device } from "ui/device.ui";
import { uploadSingleMedia } from "services/file.service";
import { getMediaLink } from "helpers/file.helper";


export default function EditProfileScreen() {
  const { styles, theme } = useSystem(createStyles);
  const { display_name, user_email, user_numberphone, user_avatar } = useAppSelector(state => state.user.account);
  const dispatch = useAppDispatch();

  const [avatarUrl, setAvatarUrl] = useState(user_avatar);
  const refAvatarValue = useRef<string | undefined>(user_avatar);
  const refTextInputDisplayName = useRef<any>(null);
  const refTextInputEmail = useRef<any>(null);
  const refTextInputPhoneNumber = useRef<any>(null);

  const pressSave = useCallback(async () => {
    try {
      GlobalPopupHelper.showLoading(true);
      let response = await dispatch(updateProfileUser({
        display_name: refTextInputDisplayName.current?.getValue() || undefined,
        user_email: refTextInputEmail.current?.getValue() || undefined,
        user_numberphone: refTextInputPhoneNumber.current?.getValue() || undefined,
        user_avatar: refAvatarValue.current || undefined
      }));
      if (response.payload === undefined) {
        // @ts-ignore
        throw response?.error;
      }

      GlobalPopupHelper.alert({
        type: "success",
        title: "Profile update successful"
      });
      navigationHelper.goBack();
    } catch (error: any) {
      console.log(error, "skjfjbf");
      GlobalPopupHelper.alert({
        type: "error",
        title: "Profile update failed, try again"
      });
    } finally {
      GlobalPopupHelper.hideLoading();
    }
  }, []);

  const onPressSelectAvatar = async () => {
    // GlobalPopupHelper.admobGlobalRef.current?.setIgnoreOneTimeAppOpenAd();
    const permission = await requestPermission(PERMISSION.permissionLibrary).catch(console.log);
    if (permission) {
      try {
        GlobalPopupHelper.admobGlobalRef.current?.setIgnoreOneTimeAppOpenAd();
        const res = await launchImageLibrary({
          mediaType: "photo",
          selectionLimit: 1,
          maxWidth: 2048,
          maxHeight: 2048,
          quality: 0.8,
          includeExtra: true
        });

        if (res?.assets && Array.isArray(res?.assets) && res?.assets.length > 0) {
          setAvatarUrl(res?.assets?.[0].uri);
          const imageNameLink = await uploadSingleMedia({
            name: res?.assets?.[0]?.fileName || res?.assets?.[0].uri?.split("/")?.reverse()?.[0] || "",
            uri: Device.isIos ? res?.assets?.[0].uri?.replace("file://", "") : res?.assets?.[0]?.uri,
            type: res?.assets?.[0]?.type,
            path: res?.assets?.[0]?.uri
          });

          if (refAvatarValue.current) {
            refAvatarValue.current = getMediaLink(imageNameLink);
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}>
        <View style={styles.containerContent}>
          <Pressable style={styles.btnAvatar} onPress={onPressSelectAvatar}>
            <ImageAvatarBase source={{ uri: avatarUrl }} style={styles.imgAvatar} />
            <View style={styles.viewIconEdit}>
              <IconEdit color={theme.textLight} size={FontSizes._18} />
            </View>
          </Pressable>

          <View style={styles.containerForm}>
            <TextBase title={"Display name"} style={styles.txtTitle} />
            <View style={styles.viewInput}>
              <IconUser color={theme.textInactive} size={FontSizes._22} />
              <TextInputBase style={styles.textInput}
                             ref={refTextInputDisplayName}
                             placeholder={"Display name"}
                             returnKeyType={"done"}
                             initValue={display_name}
                             numberOfLines={1} />
            </View>

            <TextBase title={"Email"} style={styles.txtTitle} />
            <View style={styles.viewInput}>
              <IconMail color={theme.textInactive} size={FontSizes._22} />
              <TextInputBase style={styles.textInput}
                             ref={refTextInputEmail}
                             keyboardType={"email-address"}
                             placeholder={"Email"}
                             returnKeyType={"done"}
                             initValue={user_email}
                             numberOfLines={1} />
            </View>

            <TextBase title={"Phone number"} style={styles.txtTitle} />
            <View style={styles.viewInput}>
              <IconSmartPhone color={theme.textInactive} size={FontSizes._22} />
              <TextInputBase style={styles.textInput}
                             keyboardType={"number-pad"}
                             ref={refTextInputPhoneNumber}
                             placeholder={"Phone number"}
                             returnKeyType={"done"}
                             initValue={user_numberphone}
                             numberOfLines={1} />
            </View>
          </View>
        </View>

        <ButtonBase title={"Save"} style={styles.btnSave} onPress={pressSave} />
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
      width: MHS._150,
      height: MHS._150

    },
    btnAvatar: {
      borderRadius: MHS._26,
      overflow: "hidden",
      ...Shadow2
    },
    containerForm: {
      width: "100%"

    },
    txtTitle: {
      fontWeight: "bold",
      color: theme.textDark,
      marginBottom: VS._6,
      marginTop: VS._20
    },
    viewInput: {
      paddingHorizontal: HS._12,
      paddingVertical: MHS._10,
      backgroundColor: theme.backgroundTextInput,
      flexDirection: "row",
      borderRadius: MHS._10,
      alignItems: "center"
    },
    textInput: {
      flex: 1,
      color: theme.text,
      fontSize: FontSizes._14,
      paddingVertical: 0,
      paddingHorizontal: 0,
      marginHorizontal: HS._8
    },
    btnSave: {
      marginBottom: VS._20
    },
    viewIconEdit: {
      padding: MHS._14,
      backgroundColor: `${theme.btnInactive}70`,
      borderTopLeftRadius: MHS._26,
      position: "absolute",
      bottom: 0,
      right: 0
    }
  });
};
