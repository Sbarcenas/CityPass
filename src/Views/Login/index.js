import React, { Component, createRef, Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableHighlight,
  AsyncStorage,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Keyboard
} from "react-native";
// import { AccessToken, LoginButton, LoginManager } from "react-native-fbsdk";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LoginButton, AccessToken, LoginManager } from "react-native-fbsdk";
import SpinnerButton from "react-native-spinner-button";
import LinearGradient from "react-native-linear-gradient";
import { login, logout, categories } from "../../feathers";
import { startUp } from "../../../navigation";
import { Toaster } from "../../utils/toaster";
import { Navigation } from "react-native-navigation";
import { loginFB } from "../../feathers/index";
import { app } from "../../feathers/conf";
import FBLogo from "../../assets/facebook-logo.png";
import CustomFont from "../../components/CustomFont/index";
import { Intercom } from "../../../index";
import store from "../../../store";
import { DismissKeyboardView } from "../../components/DismissKeyboardHOC/DismissKeyboardHOC";
const { width, height } = Dimensions.get("window");
class Login extends Component {
  constructor(props) {
    super(props);
    // Crea una referencia para guardar el elemento textInput del DOM
    this.loginRef = React.createRef();
  }

  state = {
    email: "",
    password: "",
    defaultLoading: false
  };
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true,
        elevation: 0,
        background: {
          color: "transparent"
        }
      }
    };
  }
  login = async () => {
    try {
      const { email, password } = this.state;
      await logout();
      const res = await login(email, password);
      store.dispatch({ type: "SET_USER_CITY", city_id: null });
      console.log("token -----><>", res, email, password);
      startUp("home");
    } catch (error) {
      console.log(error);
      Toaster({ type: "error", text: error.message });
    } finally {
      this.setState({ defaultLoading: false });
    }
  };

  /* componentDidUpdate(prevProps, prevState) {
    const { network } = this.props;
    console.log({ network });
    if (!isConnected && prevProps.network.isConnected !== isConnected)
      this.showOffline();
  } */

  async componentDidMount() {
    const loginRef = createRef();
    const { network, hasError } = this.props;
    if (hasError) this.showOffline();
    Intercom.logout();
    LoginManager.logOut();
    store.dispatch({ type: "LOGOUT" });
    console.log("LOGIN STORE STATE", store.getState());
    try {
      LoginManager.logOut();
      const keys = await AsyncStorage.getAllKeys();
      console.log("fine", keys);
    } catch (error) {
      console.log("err", error.message);
    }
  }

  gotoRegister = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.register",
        options: {
          topBar: {
            background: {
              color: "transparent"
            },
            elevation: 0,
            backButton: {
              icon: require("../../assets/iconsX/backArrow.png"),
              color: "white"
            }
          }
        }
      }
    });
  };

  gotoRecovery = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.recoverPassword"
      }
    });
  };

  loginFB = async result => {
    try {
      await logout();
      Toaster({ type: "info", text: "Iniciando sesión...", duration: 3000 });
      if (result.isCancelled) return;
      else {
        const tokenres = await AccessToken.getCurrentAccessToken();
        const token = tokenres.accessToken.toString();
        console.log("le token", token);
        const res = await fetch("https://api.cityprime.club/authentication", {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { accessToken } = await res.json();

        await AsyncStorage.setItem("accessToken", accessToken);
        await app.authenticate({ strategy: "jwt", accessToken: accessToken });
        store.dispatch({ type: "SET_USER_CITY", city_id: null });
        startUp();
        console.log("FB", accessToken);
      }
    } catch (e) {
      console.log(e);
      Toaster({
        type: "error",
        message: "Error en autenticación. Por favor vuelva a intentarlo."
      });
      startUp();
    }
  };

  showOffline = () => {
    Navigation.showModal({
      component: {
        name: "app.offlineView"
      }
    });
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <LinearGradient
            colors={["#473E69", "#249EC7"]}
            style={styles.linearGradient}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
          >
            <TouchableOpacity
              style={{
                top: 0,
                height: 400,
                width: "100%",
                position: "absolute"
              }}
              onPress={Keyboard.dismiss}
            >
              <View />
            </TouchableOpacity>
            <DismissKeyboardView>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../../assets/img/main_logo.png")}
                  style={{ width: 218, height: 79 }}
                />
                <View style={[styles.SectionStyle]}>
                  <Image
                    source={require("../../assets/img/icon-placeholder-user.png")}
                    style={styles.iconPlaceholder}
                  />
                  <TextInput
                    style={{ width: "88%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                    placeholder="Email"
                    placeholderTextColor="white"
                    selectionColor="white"
                    underlineColorAndroid="transparent"
                    maxLength={128}
                    keyboardType={"email-address"}
                    autoCapitalize="none"
                    onChangeText={email => this.setState({ email })}
                  />
                </View>
                <View style={[styles.SectionStyle]}>
                  <Image
                    source={require("../../assets/img/icon-placeholder-password.png")}
                    style={styles.iconPlaceholder}
                  />
                  <TextInput
                    style={{ width: "88%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                    placeholderTextColor="white"
                    selectionColor="white"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    placeholder={`Contraseña`}
                    autoCapitalize="none"
                    onChangeText={password => this.setState({ password })}
                  />
                </View>
                <View style={{ width: "100%", alignItems: "center" }}>
                  <View style={{ width: "80%" }}>
                    <SpinnerButton
                      buttonStyle={styles.button}
                      isLoading={this.state.defaultLoading}
                      onPress={() => {
                        this.setState({ defaultLoading: true });
                        this.login();
                      }}
                      spinnerType="PulseIndicator"
                      indicatorCount={10}
                    >
                      <Text
                        style={[
                          { color: "white", justifyContent: "center" },

                          { fontFamily: "Poppins-Light" }
                        ]}
                      >
                        Ingresar
                      </Text>
                    </SpinnerButton>
                  </View>
                </View>
                {/* <TouchableHighlight
              onPress={this.login}
              style={styles.button}
              underlayColor='transparent'
              accessibilityLabel="Aqui se puede loguear"
            >
              <Text style={[{ color: 'white' }, { fontFamily: 'Poppins-Light'}]}>Enviar</Text>
            </TouchableHighlight> */}
                <TouchableHighlight
                  underlayColor={"transparent"}
                  style={{ backgroundColor: "transparent", marginTop: 20 }}
                  onPress={this.gotoRegister}
                >
                  <Text style={[styles.link, { fontFamily: "Poppins-Light" }]}>
                    Crear cuenta
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={"transparent"}
                  style={{ backgroundColor: "transparent", marginTop: 10 }}
                  onPress={this.gotoRecovery}
                >
                  <Text style={[styles.link, { fontFamily: "Poppins-Light" }]}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableHighlight>
                <View style={{ height: 28 }} />
              </View>
            </DismissKeyboardView>
            <View
              style={{
                alignSelf: "center"
              }}
            >
              <LoginButton
                ref={this.loginRef}
                permissions={[
                  "public_profile",
                  "email"
                  //"user_birthday","user_gender"
                ]}
                onLoginFinished={(error, result) => {
                  this.loginFB(result);
                }}
                onLogoutFinished={() => console.log("logout.")}
              />
            </View>
            {/*<View style={{ marginTop: 12 }}>
                <TouchableOpacity onPress={this.loginFB}>
                  <View
                    style={{
                      width: 200,
                      height: 28,
                      backgroundColor: "#3C5A99",
                      alignItems: "center",
                      flexDirection: "row",
                      paddingHorizontal: 16,
                      justifyContent: "space-between"
                    }}
                  >
                    <Image source={FBLogo} style={{ width: 18, height: 18 }} />
                    <Text style={{ fontSize: 12, color: "white" }}>
                      Continue with Facebook
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>*/}
          </LinearGradient>
        </View>

        {/* <TouchableOpacity onPress={this.facebookLogin} style={{ flex: 0.15 }}>
          <View style={styles.footer}>
            <Image source={require('./../../assets/img/IconoFacebook.png')} style={{ marginRight: 3 }} />
            <Text style={[{ color: 'white', fontWeight: `800`, textAlign: 'center' }, { fontFamily: 'Poppins-Light'}]}>| Iniciar con Facebook</Text>
          </View>
        </TouchableOpacity> */}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column" },
  content: {
    height: height,
    flex: 2,
    backgroundColor: "skyblue",
    justifyContent: "center",
    alignItems: "center"
  },
  footer: {
    flex: 1,
    backgroundColor: "steelblue",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
    padding: 10,
    width: "100%",
    backgroundColor: "transparent"
    // width: '100%',
  },
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    margin: 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    width: "80%"
  },
  SectionStyleError: {
    backgroundColor: "rgba(248, 215, 218,0.9)",
    borderColor: "rgb(248, 215, 218)"
  },
  linearGradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  iconPlaceholder: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontSize: 18,
    textAlign: "left",
    marginBottom: "1%",
    marginTop: "1%",
    width: "80%"
  },
  link: {
    color: "white",
    textDecorationLine: "underline"
  }
});

export default Login;
