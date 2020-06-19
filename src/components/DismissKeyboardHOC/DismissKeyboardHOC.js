import React from "react";
import { Keyboard, View } from "react-native";

const DismissKeyboardHOC = Comp => {
  return ({ children, props }) => (
    <View onPress={Keyboard.dismiss} accessible={true}>
      <Comp {...props}>{children}</Comp>
    </View>
  );
};
export const DismissKeyboardView = DismissKeyboardHOC(View);
