import React, { forwardRef, memo, useCallback, useImperativeHandle, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import { Shadow2 } from "ui/shadow.ui";
import { TypedRefModal } from "models/system.model";
import FillSizeBottomSheet from "components/BottomSheet/fillSize.bottomsheet";

export const FillSizeBottomSheetTest = forwardRef((_, ref: React.Ref<TypedRefModal>) => {
  const { styles } = useSystem(createStyles);

  const refModalContainer = useRef<any>();

  useImperativeHandle(
    ref,
    () => ({
      show() {
        if (refModalContainer.current) {
          refModalContainer.current.show();
        }
      },
      hide() {
        if (refModalContainer.current)
          refModalContainer.current.hide();
      }
    })
  );

  const close = useCallback(() => {
    if (refModalContainer.current)
      refModalContainer.current.hide();
  }, []);

  return (
    <FillSizeBottomSheet ref={refModalContainer} handleIndicatorStyle={styles.handleIndicatorStyle}
                         backgroundStyle={styles.backgroundStyle}>

      <View style={styles.containerModal}>
        <Text
          style={styles.txtSuggest}>{"Dung dịch súc miệng Kin Gingival có công thức chứa hoạt chất sát khuẩn cao, giúp ngăn ngừa mảng bám vi khuẩn quá mức, các vấn đề viêm nhiễm răng nướu từ đó hỗ trợ giải quyết vấn đề hôi miệng hiệu quả. Đặc biệt, sản phẩm có thể sử dụng trước và sau phẫu thuật vùng miệng, có khả năng ngăn ngừa các bệnh cúm do virus. Sản phẩm nước súc miệng Kin Gingival không chứa cồn nên không bị khô rát miệng và an toàn cho sức khỏe người dùng."}</Text>


        <TouchableOpacity style={styles.btnGotIt} onPress={close}>
          <Text style={styles.txtGotIt}>{"Got it"}</Text>
        </TouchableOpacity>
      </View>


    </FillSizeBottomSheet>
  );
});

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
    },
    containerModal: {
      alignItems: "center",
      borderTopLeftRadius: MHS._18,
      borderTopRightRadius: MHS._18,
      width: "100%"
      // paddingHorizontal: "5%",
      // paddingBottom: VS._,
      // paddingTop: VS._24
      // backgroundColor: RootColor.Color4,
    },
    handleIndicatorStyle: {
      backgroundColor: theme.text
    },
    backgroundStyle: {
      // backgroundColor: RootColor.Color4
    },
    txtSuggest: {
      color: theme.text,
      fontSize: FontSizes._16,
      textAlign: "center",
      marginHorizontal: HS._12
    },
    txtTip: {
      width: "60%",
      color: theme.text,
      fontSize: FontSizes._12,
      textAlign: "justify"
    },
    lottieSleep: {
      width: "40%"
    },
    viewRow: {
      flexDirection: "row",
      alignItems: "center"
    },
    btnGotIt: {
      marginVertical: VS._18,
      width: "70%",
      backgroundColor: RootColor.MainColor,
      borderRadius: MHS._50,
      paddingVertical: VS._16,
      alignItems: "center",
      ...Shadow2
    },
    txtGotIt: {
      color: theme.textLight,
      fontSize: FontSizes._16
    }
  });
};


export default memo(FillSizeBottomSheetTest);
