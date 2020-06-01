import React from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
  StyleSheet,
  ImageBackground
} from "react-native";
import CustomFont from "../CustomFont";
import { Navigation } from "react-native-navigation";
import TicketImg from "../../assets/iconsX/cupon.png";

const { height, width } = Dimensions.get("window");

const index = ({ onChange, onSubmit, componentId, dynamic_id }) => {
  const onPress = () => {
    Navigation.dismissOverlay(componentId);
  };
  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            width,
            height,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, .5)"
          }}
        ></View>
      </TouchableWithoutFeedback>
      <ImageBackground
        source={TicketImg}
        style={[
          {
            justifyContent: "space-between",
            position: "absolute",
            zIndex: 100,
            marginLeft: width * 0.1,
            marginTop: 100,
            width: 300,
            height: 256,
            padding: 20,
            paddingTop: 40,
            paddingBottom: 30
          }
        ]}
      >
        <View style={{ alignItems: "center" }}>
          <CustomFont
            style={{ color: "#473E69", fontSize: 16, fontWeight: "bold" }}
          >
            Ingresa el código de tu cupón
          </CustomFont>
        </View>
        <View>
          <View
            style={{
              marginBottom: 10,
              height: 40,
              paddingHorizontal: 10,
              borderColor: "#473E69",
              borderWidth: 1,
              borderRadius: 6,
              paddingVertical: 5
            }}
          >
            <TextInput
              defaultValue={dynamic_id}
              textAlign="center"
              placeholder="Ingresa tu código aquí"
              onChangeText={onChange}
              autoCorrect={false}
              style={{ height: 36 }}
            />
          </View>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => onSubmit(onPress)}
          >
            <View
              style={{
                backgroundColor: "#473E69",
                width: "100%",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 6
              }}
            >
              <CustomFont style={{ color: "white", fontSize: 16 }}>
                Ingresar
              </CustomFont>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </React.Fragment>
  );
};

export default index;

const styles = StyleSheet.create({
  modal: {
    width: width * 0.8,
    height: 150,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10
  }
});
