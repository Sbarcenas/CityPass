import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from "react-native";
import { connect } from "react-redux";
import SpinnerButton from "react-native-spinner-button";
import LinearGradient from "react-native-linear-gradient";
import { users, login, passwordRecovery } from "../../feathers";
import { startUp } from "../../../navigation";
import { Toaster } from "../../utils/toaster";
import { Navigation } from "react-native-navigation";

const offset = Platform.OS === "android" ? -200 : 0;
class PasswordRecover extends Component {
  state = {
    email: "",
    password: "",
    passwordConf: "",
    enterCode: false,
    defaultLoading: false
  };
  sendEmail = async () => {
    try {
      const { email } = this.state;
      const a = await passwordRecovery.create({ email });
      console.log("aaa", a);
      this.setState({ enterCode: true });
    } catch ({ message }) {
      Toaster({ type: "error", title: message });
    } finally {
      this.setState({ defaultLoading: false });
    }
  };
  reverPassword = async () => {
    const { password, passwordConf, code } = this.state;
    const { dispatch } = this.props;
    if (password != passwordConf) {
      Toaster({ type: "warn", title: "Las constraseñas no son iguales" });
      this.setState({ defaultLoading: false });
      return;
    } else if (password.length < 6) {
      Toaster({
        type: "warn",
        title: "La contraseña debe terner 6 caracteres como minimo"
      });
      this.setState({ defaultLoading: false });
      return;
    }
    try {
      dispatch({ type: "UPDATE_USER", user: {} });
      const res = await passwordRecovery.patch(code, { password });
      console.log("res", res);
      Toaster({ type: "success", title: "Tu contraseña ha sido actualizada" });
      Navigation.pop(this.props.componentId);
    } catch ({ message }) {
      Toaster({ type: "error", title: message });
    } finally {
      this.setState({ defaultLoading: false });
    }
  };
  render() {
    const { enterCode } = this.state;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={offset}
        style={styles.container}
        behavior="padding"
        enabled
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <LinearGradient
            colors={["#473E69", "#249EC7"]}
            style={styles.linearGradient}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
          >
            {enterCode ? (
              <Fragment>
                <Text style={[styles.title, { fontFamily: "Poppins-Light" }]}>
                  Ingresa el codigo de recuperación que enviamos a tu email
                </Text>
                <View style={[styles.SectionStyle]}>
                  <TextInput
                    key={"gg"}
                    style={{ width: "88%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                    placeholder="Codigo"
                    placeholderTextColor="white"
                    selectionColor="white"
                    underlineColorAndroid="transparent"
                    maxLength={128}
                    autoCapitalize="none"
                    onChangeText={code => this.setState({ code })}
                  />
                </View>
                <View style={[styles.SectionStyle]}>
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
                <View style={[styles.SectionStyle]}>
                  <TextInput
                    style={{ width: "88%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                    placeholderTextColor="white"
                    selectionColor="white"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    placeholder={`Confirmar contraseña`}
                    autoCapitalize="none"
                    onChangeText={passwordConf =>
                      this.setState({ passwordConf })
                    }
                  />
                </View>

                {/* <TouchableHighlight
                    onPress={this.reverPassword}
                    style={styles.button}
                    underlayColor='transparent'
                    accessibilityLabel="Aqui se puede loguear"
                  >
                    <Text style={[{ color: 'white' }, { fontFamily: 'Poppins-Light'}]}>ENVIAR</Text>
                  </TouchableHighlight> */}
                <View style={{ width: "100%", alignItems: "center" }}>
                  <View style={{ width: "80%" }}>
                    <SpinnerButton
                      buttonStyle={styles.button}
                      isLoading={this.state.defaultLoading}
                      onPress={() => {
                        this.setState({ defaultLoading: true });
                        this.reverPassword();
                      }}
                      spinnerType="PulseIndicator"
                      indicatorCount={10}
                    >
                      <Text
                        style={[
                          { color: "white" },
                          { fontFamily: "Poppins-Light" }
                        ]}
                      >
                        Enviar
                      </Text>
                    </SpinnerButton>
                  </View>
                </View>
              </Fragment>
            ) : (
              <Fragment>
                <Text style={[styles.title, { fontFamily: "Poppins-Light" }]}>
                  Ingresa tu email
                </Text>
                <View style={[styles.SectionStyle]}>
                  <TextInput
                    key={"gg2"}
                    style={{ width: "88%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                    placeholder="Email"
                    placeholderTextColor="white"
                    selectionColor="white"
                    keyboardType="email-address"
                    underlineColorAndroid="transparent"
                    maxLength={128}
                    autoCapitalize="none"
                    onChangeText={email => this.setState({ email })}
                  />
                </View>

                <View style={{ width: "100%", alignItems: "center" }}>
                  <View style={{ width: "80%" }}>
                    <SpinnerButton
                      buttonStyle={styles.button}
                      isLoading={this.state.defaultLoading}
                      onPress={() => {
                        this.setState({ defaultLoading: true });
                        this.sendEmail();
                      }}
                      spinnerType="PulseIndicator"
                      indicatorCount={10}
                    >
                      <Text
                        style={[
                          { color: "white" },
                          { fontFamily: "Poppins-Light" }
                        ]}
                      >
                        Enviar
                      </Text>
                    </SpinnerButton>
                  </View>
                </View>
              </Fragment>
            )}
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", justifyContent: "center" },
  content: {
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
    paddingTop: 80,
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
export default connect()(PasswordRecover);
