import { Navigation } from "react-native-navigation";
export default (compID, passProps) => {
  Navigation.push(compID, {
    component: {
      name: "app.wallet",
      passProps,
      options: {
        topBar: {
          rightButtons: [],
          backButton: {
            icon: require("../assets/iconsX/backArrow.png"),
            color: "white"
          }
        },
        drawBehind: true,
        background: {
          color: "transparent"
        },
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

export const closeWallet = compID => {
  Navigation.pop(compID);
};
