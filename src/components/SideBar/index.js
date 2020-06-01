import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  AsyncStorage,
  TouchableWithoutFeedback,
  ScrollView,
  AppState
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
const { width, height } = Dimensions.get("window");
import timer from "react-native-timer";
import { current } from "../../feathers";
import { startUp } from "../../../navigation";
import { emitter } from "../../../";
import { pageView } from "../../utils/mixpanel";
import { getAvatarPhoto } from "../../utils/S3Photos";
import { app } from "../../feathers/conf";
import { Intercom } from "../../../index";

class Drawer extends Component {
  state = {
    user: {}
  };
  async componentDidMount() {
    try {
      AppState.addEventListener("change", this.handleAppStateChange);
      const user = await current.find();
      const keys = await AsyncStorage.getAllKeys();
      const u = await AsyncStorage.getItem("current_user");
      Intercom.registerIdentifiedUser({ userId: `${user.id}` });
      Intercom.updateUser({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone
      });
      console.log("user sidebar", user);
      this.setState({ user });
    } catch ({ message }) {
      console.log("ERR: ----<<>", message);
    }
  }
  handleAppStateChange = async nextAppState => {
    console.log("foreground!", nextAppState, AppState.currentState);
    if (nextAppState === "active") {
      this.componentDidMount();
    }
  };
  logout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    app.logout();
    timer.clearInterval("token-verifier");
    startUp("login");
  };
  showIntercom = () => {
    pageView("support chat");
    Intercom.displayMessageComposer();
  };
  openWallet = () => {
    emitter.emit("openWallet");
  };
  openProfile = () => {
    emitter.emit("openProfile");
  };
  gotoCards = () => {
    emitter.emit("gotoCards");
  };
  gotoShop = () => {
    emitter.emit("gotoShop");
  };
  openFavs = () => {
    emitter.emit("openFavs");
  };
  openInfo = () => {
    emitter.emit("openInfo");
  };
  openFriendCode = () => {
    pageView("Friend Code");
    emitter.emit("openFriendCode");
  };
  openQr = () => {
    pageView("user qr");
    emitter.emit("openQr");
  };
  openCoupon = () => {
    emitter.emit("redeemCoupon");
  };
  switchApp = () => {
    startUp("admin");
  };
  uploadAvatar = () => emitter.emit("avatarPicker");
  render(onPress = this.openFriendCode) {
    const { user = {} } = this.props;
    console.log("drawer user", user);
    const membership = user.membership == null ? {} : user.membership;
    console.log("drawer user", membership);
    const isPrime = membership.id == 2;
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#473E69", "#249EC7"]} style={styles.gradient}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            <View
              style={{
                marginTop: 25,
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback onPress={this.uploadAvatar}>
                <Image
                  source={
                    user.avatar
                      ? { uri: getAvatarPhoto(user.avatar) }
                      : require("../../assets/img/user.png")
                  }
                  style={{
                    zIndex: 0,
                    borderRadius: 48,
                    width: 96,
                    height: 96
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.profile_info}>
              <TouchableWithoutFeedback>
                <Text
                  style={[
                    styles.profile_info_name,
                    { fontFamily: "Poppins-Light" }
                  ]}
                >
                  {user.first_name} {user.last_name}
                </Text>
              </TouchableWithoutFeedback>
              {/* <Progress.Bar progress={0.5} width={80} color='#fff' style={{marginLeft:'auto', marginTop:'1%', marginBottom:'1%', marginRight:'auto'}} unfilledColor='rgba(255, 255, 255, 0.5)'/> */}
              {!isPrime && (
                <Text
                  style={[
                    styles.profile_info_puntos,
                    { fontFamily: "Poppins-Light" }
                  ]}
                >
                  {user.points} puntos
                </Text>
              )}
              <TouchableWithoutFeedback
                underlayColor="transparent"
                onPress={this.openQr}
              >
                <View style={styles.btn_codigo}>
                  <Text
                    style={[
                      {
                        fontWeight: "300",
                        fontSize: 17,
                        color: "white",
                        textAlign: "center"
                      },
                      { fontFamily: "Poppins-Light" }
                    ]}
                  >
                    Mi código
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.menu}>
              {!isPrime && (
                <View style={styles.menu_item}>
                  <Image
                    style={styles.menu_icon}
                    source={require("../../assets/iconsX/shopping-basket.png")}
                  />
                  <TouchableWithoutFeedback
                    underlayColor="transparent"
                    onPress={this.gotoShop}
                  >
                    <Text
                      style={[
                        styles.menu_text,
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      Tienda de puntos
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              )}

              <View style={styles.menu_item}>
                <Image
                  style={styles.menu_icon}
                  source={require("../../assets/iconsX/discount.png")}
                />
                <TouchableWithoutFeedback
                  underlayColor="transparent"
                  onPress={this.openCoupon}
                >
                  <Text
                    style={[styles.menu_text, { fontFamily: "Poppins-Light" }]}
                  >
                    Ingresar código
                  </Text>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.menu_item}>
                <Image
                  style={styles.menu_icon}
                  source={require("../../assets/iconsX/favorites.png")}
                />
                <TouchableWithoutFeedback
                  underlayColor="transparent"
                  onPress={this.openFavs}
                >
                  <Text
                    style={[styles.menu_text, { fontFamily: "Poppins-Light" }]}
                  >
                    Mis Favoritos
                  </Text>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.menu_item}>
                <Image
                  style={styles.menu_icon}
                  source={require("../../assets/iconsX/credit-card.png")}
                />
                <TouchableWithoutFeedback
                  underlayColor="transparent"
                  onPress={this.gotoCards}
                >
                  <Text
                    style={[styles.menu_text, { fontFamily: "Poppins-Light" }]}
                  >
                    Mis tarjetas
                  </Text>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.menu_item}>
                <Image
                  style={styles.menu_icon}
                  source={require("../../assets/iconsX/settings.png")}
                />
                <TouchableWithoutFeedback
                  underlayColor="transparent"
                  onPress={this.openProfile}
                >
                  <Text
                    style={[styles.menu_text, { fontFamily: "Poppins-Light" }]}
                  >
                    Mi cuenta
                  </Text>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.menu_item}>
                <Image
                  style={styles.menu_icon}
                  source={require("../../assets/iconsX/support.png")}
                />
                <TouchableWithoutFeedback
                  underlayColor="transparent"
                  onPress={this.showIntercom}
                >
                  <Text
                    style={[styles.menu_text, { fontFamily: "Poppins-Light" }]}
                  >
                    Escribir a soporte
                  </Text>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.menu_item}>
                <Image
                  style={styles.menu_icon}
                  source={require("../../assets/iconsX/info.png")}
                />
                <TouchableWithoutFeedback
                  underlayColor="transparent"
                  onPress={this.openInfo}
                >
                  <Text
                    style={[styles.menu_text, { fontFamily: "Poppins-Light" }]}
                  >
                    Preguntas Frecuentes
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.menu_item}>
                <Image
                  style={styles.menu_icon}
                  source={require("../../assets/icons/friendCode.png")}
                />

                <TouchableWithoutFeedback
                  underlayColor="transparent"
                  onPress={this.openFriendCode}
                >
                  <Text
                    style={[styles.menu_text, { fontFamily: "Poppins-Light" }]}
                  >
                    Invitar amigos
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.menu_item}>
                <Image
                  style={styles.menu_icon}
                  source={require("../../assets/iconsX/turn-off.png")}
                />

                <TouchableWithoutFeedback
                  underlayColor="transparent"
                  onPress={() => {
                    this.props.dispatch({
                      type: "SET_USER_CITY",
                      city_id: undefined
                    });
                    this.props.dispatch({ type: "WIPE" });
                    this.logout();
                  }}
                >
                  <Text
                    style={[styles.menu_text, { fontFamily: "Poppins-Light" }]}
                  >
                    Cerrar Sesión
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              {user.establishment && (
                <View style={styles.menu_item}>
                  <Image
                    style={styles.menu_icon}
                    source={require("../../assets/iconsX/shop.png")}
                  />
                  <TouchableWithoutFeedback
                    underlayColor="transparent"
                    onPress={() => this.switchApp()}
                  >
                    <Text
                      style={[
                        styles.menu_text,
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      Comercio
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

const mapState = state => state;
export default connect(mapState)(Drawer);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 300,
    justifyContent: "center",
    alignItems: "center"
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative"
  },
  title: {
    color: "dimgrey",
    fontWeight: "900"
  },
  profile_info: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15
  },
  profile_info_name: {
    fontWeight: "400",
    fontSize: 23,
    color: "white",
    textAlign: "center"
  },
  profile_info_puntos: {
    fontWeight: "400",
    fontSize: 12,
    color: "white",
    textAlign: "center",
    marginVertical: 10
  },
  btn_codigo: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 100,
    width: width * 0.4,
    paddingVertical: 5
  },
  menu: {
    flex: 2,
    paddingLeft: "10%"
  },
  menu_item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 3
  },
  menu_text: {
    padding: 9,
    color: "white",
    fontSize: 16,
    width: 23,
    flex: 4,
    marginLeft: 20
  },
  menu_icon: {
    maxWidth: 23,
    maxHeight: 23,
    flex: 1,
    resizeMode: "contain"
  }
});
