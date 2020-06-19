import React, { useEffect } from "react";
import {
  Image,
  TouchableWithoutFeedback,
  View,
  Dimensions
} from "react-native";
import { Navigation } from "react-native-navigation";
const { width } = Dimensions.get("window");

function BannerCard(props) {
  const { benefits_id, image, height } = props;

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
    <TouchableWithoutFeedback onPress={() => onPress(benefits_id)}>
      <View style={{ overflow: "hidden", borderRadius: 10 }}>
        <Image
          source={{ uri: `https://cityprime-static.s3.amazonaws.com/${image}` }}
          style={{
            borderRadius: 10,
            height: height,
            width: width - 40,
            alignSelf: "center"
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default BannerCard;
