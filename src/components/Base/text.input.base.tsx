import { useSystem } from "helpers/system.helper";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { RootColor, SystemTheme } from "ui/theme";
import { TypedRegexProps } from "models/system.model";
import { FontSizes, HS } from "ui/sizes.ui";
import TextBase from "components/Base/text.base";

interface TypedTextInputBaseProps extends TextInputProps {
  validations?: TypedRegexProps[];
  initValue?:string
}

const TextInputBase = ({ style, initValue, validations = [], ...props }: TypedTextInputBaseProps, ref) => {
  const { styles } = useSystem(createStyles);

  const refTextInputValue = useRef("");
  const refTextInput = useRef<any>(null);

  const [errorMessage, setErrorMessage] = useState("");

  useImperativeHandle(
    ref,
    () => ({
      validate() {
        let resultValidate = validations.find((item) => {
          return !item.validation.test(refTextInputValue.current.trim());
        });

        if (resultValidate) {
          setErrorMessage(resultValidate.error || "");
          return false;
        } else {
          setErrorMessage("");
          return true;
        }
      },
      getValue() {
        return refTextInputValue.current.trim();
      },
      showError(error: string) {
        setErrorMessage(error);
      },
      setValue(text: string) {
        refTextInput.current?.setNativeProps({ text: text });
        refTextInputValue.current = text;
      },
      ...refTextInput.current
    })
  );

  useEffect(()=>{
    if(initValue){
      refTextInput.current?.setNativeProps({ text: initValue });
      refTextInputValue.current = initValue;
    }
  },[])

  const onChangeText = useCallback((text:string)=>refTextInputValue.current = text,[])

  return (
    <>
      <TextInput
        ref={refTextInput}
        style={[styles.textInput, {textAlignVertical: props.numberOfLines && props.numberOfLines>1?'top':'auto'},style]}
        onChangeText={props.onChangeText || onChangeText}
        {...props}
      />
      {!!errorMessage ? <TextBase title={errorMessage} style={styles.error} /> : null}
    </>
  );
};

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container:{
      flex:1
    },
    textInput: {
      // fontFamily
    },
    error: {
      fontSize: FontSizes._12,
      color: RootColor.RedNegative,
      marginHorizontal: HS._18
    }
  });
};

export default forwardRef(TextInputBase);
