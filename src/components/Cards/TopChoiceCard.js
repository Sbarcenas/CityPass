import React, { useEffect } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Navigation } from "react-native-navigation";
const { width } = Dimensions.get("window");

function TopChoiceCard(props) {
  const { image, benefits_id, width, height, style, containerStyle } = props;

  const onPress = id => {
    Navigation.push(props.componentId, {
      component: {
        name: "app.establishmentBenefits",
        passProps: {
          id
        },
        options: {
          sideMenu: {
            left: {
              visible: false,
              enabled: false
            }
          }
        }
      }
    });
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(benefits_id)}
      style={[
        { overflow: "hidden", borderRadius: 10, marginRight: 10 },
        containerStyle
      ]}
    >
      <Image
        source={{ uri: `https://cityprime-static.s3.amazonaws.com/${image}` }}
        style={[{ height: height || 138, width: width || 243 }, style]}
      />
    </TouchableOpacity>
  );
}

export default TopChoiceCard;
