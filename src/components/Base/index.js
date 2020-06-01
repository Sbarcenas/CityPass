import { Component } from "react";
import { Navigation } from "react-native-navigation";
import openWallet from "../../utils/openWallet";
import switchApp from "../../utils/switchApp";
import { store } from "../../../navigation";

class Base extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    console.log("SIDEMENU ->>", store.getState());
  }
  isSideBarOpen = true;
  navigationButtonPressed = ({ buttonId }) => {
    if (buttonId === "menuBtn") {
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            // visible: this.isSideBarOpen,
            visible: true
          }
        }
      });
      this.isSideBarOpen = !this.isSideBarOpen;
    } else if (buttonId === "walletBtn") {
      openWallet(this.props.componentId);
    } else if (buttonId === "backBtn") {
      Navigation.pop(this.props.componentId);
    } else if (buttonId === "closeEstablishment") {
      store.dispatch({ type: "SET_USER_CITY", city_id: null });
      switchApp(true);
    } else if (buttonId === "benefitForm") {
      Navigation.push(this.props.componentId, {
        component: {
          name: "app.benefitForm",
          options: {
            topBar: {
              title: {
                text: "Crear Beneficio"
              },
              drawBehind: true,
              background: {
                color: "transparent"
              }
            }
          }
        }
      });
    }
  };
}

export default Base;
