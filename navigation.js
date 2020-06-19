import React, { Component } from "react";
import { View, Dimensions, Platform } from "react-native";
import { Navigation } from "react-native-navigation";
import { ReduxNetworkProvider } from "react-native-offline";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";

import Login from "./src/Views/Login";
import Register from "./src/Views/Register";
import Home from "./src/Views/Home";
import SubCategories from "./src/Views/SubCategories";
import Category from "./src/Views/Category";
import Search from "./src/Views/Search";
import Wallet from "./src/Views/Wallet";
import EstablismentBenefits from "./src/Views/EstablismentBenefits";
import RedeemBenefit from "./src/Views/RedeemBenefit";
import Establishment from "./src/Views/Establishment";
import Profile from "./src/Views/Profile";
import CMS from "./src/Views/CMS";
import Favorites from "./src/Views/Favorites";
import MyCards from "./src/Views/MyCards";
import CreateCards from "./src/Views/MyCards/Create";
import IntroShow from "./src/Views/IntroShow";
import RecoverPassword from "./src/Views/RecoverPassword";
import OfflineView from "./src/Views/OfflineView";

import Admin from "./src/ViewsEstablishment/Hub";
import QrReader from "./src/ViewsEstablishment/QrReader";
import Benefits from "./src/ViewsEstablishment/Benefits";
import BenefitForm from "./src/ViewsEstablishment/BenefitForm";
import UserHistory from "./src/ViewsEstablishment/UserHistory";
import BenefitHistory from "./src/ViewsEstablishment/benefitHistory";

import BASE from "./src/components/Base";
import HomeHeader from "./src/components/HomeHeader";
import CityPicker from "./src/components/CityPicker";
import CategoryPicker from "./src/components/CategoryPicker";
import SideBar from "./src/components/SideBar";
import Ticket from "./src/components/Ticket";
import SearchInput from "./src/components/SearchInput";
import UserQr from "./src/components/UserQr";
import CodeInputModal from "./src/components/CodeInputModal";
import SearchForView from "./src/components/SearchForView";
import ReadQrModal from "./src/components/ReadQrModal";
import SopModal from "./src/components/SopModal";
import RedeemCoupon from "./src/components/RedeemCoupon";
import BenefitDescription from "./src/components/BenefitDescription";
import AvatarPicker from "./src/components/AvatarPicker";
import ConfirmPhoto from "./src/components/ConfirmPhoto";
import Gallery from "./src/components/Gallery";
import TEST from "./src/Views/TEST";
import TopChoices from "./src/Views/TopChoices";
import store from "./store";
import FriendCode from "./src/components/FriendCode/FriendCode";
import ModalActivityIndicator from "./src/components/ModalActivityIndicator/ModalActivityIndicator";
export { store };
const { width } = Dimensions.get("window");
class Toast extends Component {
  componentDidMount() {
    const {
      title = "",
      text = "",
      type,
      duration = 5000,
      componentId
    } = this.props;
    // if (Platform.OS === 'ios')
    this.dropdown.alertWithType(type, title, text);
    // else Alert.alert(
    //   title, '',
    // )
    setTimeout(() => {
      Navigation.dismissOverlay(componentId);
    }, duration);
  }
  render() {
    const { duration = 5000 } = this.props;
    return (
      <View style={{ width }}>
        <DropdownAlert
          elevation={4}
          translucent={Platform.OS === "ios"}
          ref={ref => (this.dropdown = ref)}
          closeInterval={duration}
        />
      </View>
    );
  }
}

const Prov = ({ children, store }) => (
  <Provider store={store}>
    <ReduxNetworkProvider
      pingTimeout={10000}
      pingServerUrl="https://www.google.com/"
      shouldPing
      pingInterval={10000}
    >
      {children}
    </ReduxNetworkProvider>
  </Provider>
);
// USER APP VIEWS
Navigation.registerComponentWithRedux(
  `app.login`,
  () => Login,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.register`,
  () => Register,
  Provider,
  store
);
Navigation.registerComponentWithRedux(`app.home`, () => Home, Prov, store);
Navigation.registerComponentWithRedux(
  `app.subCategories`,
  () => SubCategories,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.category`,
  () => Category,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.search`,
  () => Search,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.wallet`,
  () => Wallet,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.establishmentBenefits`,
  () => EstablismentBenefits,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.redeemBenefit`,
  () => RedeemBenefit,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.establishment`,
  () => Establishment,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.profile`,
  () => Profile,
  Provider,
  store
);
Navigation.registerComponentWithRedux(`app.cms`, () => CMS, Provider, store);
Navigation.registerComponentWithRedux(
  `app.favorites`,
  () => Favorites,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.gotoCards`,
  () => MyCards,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.createCards`,
  () => CreateCards,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.introShow`,
  () => IntroShow,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.recoverPassword`,
  () => RecoverPassword,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.offlineView`,
  () => OfflineView,
  Prov,
  store
);
// USER APP VIEWS END

// ADMIN APP VIEWS
Navigation.registerComponentWithRedux(
  `app.admin`,
  () => Admin,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.qrReader`,
  () => QrReader,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.benefits`,
  () => Benefits,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.benefitForm`,
  () => BenefitForm,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.userHistory`,
  () => UserHistory,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.benefitHistory`,
  () => BenefitHistory,
  Provider,
  store
);
// ADMIN APP VIEWS END

//COMPONENTS
Navigation.registerComponentWithRedux(`BASE`, () => BASE, Provider, store);
Navigation.registerComponentWithRedux(
  `app.sideBar`,
  () => SideBar,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.homeHeader`,
  () => HomeHeader,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.cityPicker`,
  () => CityPicker,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.categoryPicker`,
  () => CategoryPicker,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.ticket`,
  () => Ticket,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.searchInput`,
  () => SearchInput,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.userQr`,
  () => UserQr,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.codeInputModal`,
  () => CodeInputModal,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.searchForView`,
  () => SearchForView,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.readQrModal`,
  () => ReadQrModal,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.shop`,
  () => SopModal,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.redeemCoupon`,
  () => RedeemCoupon,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.toast`,
  () => Toast,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.benefitDescription`,
  () => BenefitDescription,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.avatarPicker`,
  () => AvatarPicker,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.confirmPhoto`,
  () => ConfirmPhoto,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.gallery`,
  () => Gallery,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  `app.friendCode`,
  () => FriendCode,
  Provider,
  store
);

Navigation.registerComponentWithRedux(
  `app.modalActivityIndicator`,
  () => ModalActivityIndicator,
  Provider,
  store
);

Navigation.registerComponentWithRedux(
  `app.topChoices`,
  () => TopChoices,
  Provider,
  store
);

Navigation.registerComponentWithRedux(`app.TEST`, () => TEST, Provider, store);

const startSingle = view => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: `app.${view}` /*
              options: {
                topBar: {
                  elevation: 0,
                  drawBehind: true
                }
              } */
            }
          }
        ]
      }
    }
  });
};
const startStack = ignoreDynamicLink => {
  Navigation.setRoot({
    root: {
      sideMenu: {
        id: "sideMenu",
        left: {
          component: {
            name: "app.sideBar"
          }
        },
        center: {
          stack: {
            children: [
              {
                component: {
                  name: `app.home`,
                  passProps: { ignoreDynamicLink },
                  options: {
                    topBar: {
                      elevation: 0,
                      drawBehind: true,
                      background: {
                        color: "transparent"
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  });
};

export const startUp = (view = "home", ignoreDynamicLink) => {
  console.log("view");
  Navigation.setDefaultOptions({
    topBar: {
      elevation: 0,
      backButton: {
        icon: require("./src/assets/iconsX/backArrow.png"),
        color: "white"
      },
      // drawBehind: true,
      background: {
        color: "transparent"
      },
      rightButtons: [
        {
          id: "walletBtn",
          icon: require("./src/assets/iconsX/wallet.png"),
          color: "white"
        }
      ]
    }
  });
  console.log("START UP VIEW", view);
  if (view === "home") startStack(view, ignoreDynamicLink);
  else startSingle(view);
  // startSingle('TEST');
};

export function pushLoginScreen(passProps) {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: "app.login",
              passProps
            }
          }
        ]
      }
    }
  });
}

export function pushHomeScreen(passProps) {
  Navigation.setRoot({
    root: {
      sideMenu: {
        id: "sideMenu",
        left: {
          component: {
            name: "app.sideBar"
          }
        },
        center: {
          stack: {
            children: [
              {
                component: {
                  name: `app.home`,
                  passProps,
                  options: {
                    topBar: {
                      elevation: 0,
                      drawBehind: true,
                      background: {
                        color: "transparent"
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  });
}

export const showModal = (toShow, props) => {
  Navigation.showModal({
    component: {
      name: toShow,
      passProps: props,
      options: {
        screenBackgroundColor: "transparent",
        modalPresentationStyle: "overCurrentContext",
        topBar: {
          visible: false,
          animate: true
        }
      }
    }
  });
};
