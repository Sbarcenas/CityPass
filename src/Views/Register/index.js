import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform,
  AsyncStorage,
  StatusBar,
  Dimensions,
  ScrollView,
  Picker
} from "react-native";
import DatePicker from "react-native-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SpinnerButton from "react-native-spinner-button";
import LinearGradient from "react-native-linear-gradient";
import { users, login } from "../../feathers";
import { startUp } from "../../../navigation";
import { Toaster } from "../../utils/toaster";
import { app } from "../../feathers/conf";
import KeyboardShift from "../../components/KeyboardShift.js";
import store from "../../../store";
import Calendar from "react-native-calendar-datepicker";
import Moment, { now } from "moment";
import { colorNames } from "react-native-svg/lib/extract/extractColor";
import RNPickerSelect from "react-native-picker-select";
import { DismissKeyboardView } from "../../components/DismissKeyboardHOC/DismissKeyboardHOC";

const { height, width } = Dimensions.get("window");
const offset = Platform.OS === "android" ? -200 : 0;
function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
class Login extends Component {
  // static options(passProps) {
  //   return {
  //     statusBar: {
  //       visible: false,
  //     },
  //     topBar: {
  //       visible: false,
  //     }
  //   };
  // }
  state = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    passwordConf: "",
    gender: null,
    birth_date: ""
  };

  static options() {
    return {
      topBar: {
        drawBehind: true,
        background: {
          color: "transparent"
        },
        backButton: {
          icon: require("../../assets/iconsX/backArrow.png"),
          color: "white"
        }
      }
    };
  }

  years = function(startYear) {
    let currentYear = new Date().getFullYear(),
      years = [];
    startYear = startYear || 1980;
    while (startYear <= currentYear) {
      years.push(startYear++);
    }
    return years;
  };

  register = async () => {
    const {
      first_name,
      last_name,
      email,
      password,
      passwordConf,
      gender,
      phone,
      birth_date
    } = this.state;

    if (first_name.length < 1) {
      Toaster({ type: "warn", title: "Debes ingresar tu nombre" });
      this.setState({ defaultLoading: false });
      return;
    } else if (last_name.length < 1) {
      Toaster({ type: "warn", title: "Debes ingresar tu apellido" });
      this.setState({ defaultLoading: false });
      return;
    } else if (email.length < 1) {
      Toaster({ type: "warn", title: "Debes ingresar un email valido" });
      this.setState({ defaultLoading: false });
      return;
    } else if (gender === null) {
      Toaster({ type: "warn", title: "Debes seleccionar tu genero" });
      this.setState({ defaultLoading: false });
      return;
    } else if (birth_date === "") {
      Toaster({ type: "warn", title: "Fecha de nacimiento invalida" });
      this.setState({ defaultLoading: false });
      return;
    } else if (phone >= 10 && phone < 11) {
      Toaster({
        type: "warn",
        title: "Debes ingresar un número celular valido"
      });
      this.setState({ defaultLoading: false });
      return;
    } else if (password != passwordConf) {
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
      console.log("keys before create", await AsyncStorage.getAllKeys());
      await users.create({
        first_name,
        last_name,
        email,
        password,
        phone,
        gender,
        birth_date
      });
      await login(email, password);
      store.dispatch({ type: "SET_USER_CITY", city_id: null });
      startUp();
      Toaster({ type: "success", title: "Ya eres usuario City" });
    } catch ({ message }) {
      if (message.includes("5000ms")) {
        startUp();
      }
      Toaster({ type: "error", text: message });
    } finally {
      this.setState({ defaultLoading: false });
    }
  };

  async componentDidMount() {
    app.logout();
    const keys = await AsyncStorage.getAllKeys();
    if (keys[0]) await AsyncStorage.multiRemove(keys);
  }
  range = (start, end) => {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
  };
  render() {
    return (
      <LinearGradient
        colors={["#473E69", "#249EC7"]}
        style={[styles.linearGradient, { height, width }]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
      >
        <ScrollView style={styles.content}>
          <ScrollView Horizontal>
            <StatusBar barStyle="light-content" />
            <View style={[styles.content, styles.form]}>
              <Text style={[styles.title, { fontFamily: "Poppins-Light" }]}>
                REGISTRATE
              </Text>

              <View style={[styles.SectionStyle]}>
                <TextInput
                  multiline={false}
                  onScroll={e => e.preventDefault()}
                  style={{ width: "70%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                  placeholder="Nombres"
                  placeholderTextColor="white"
                  selectionColor="white"
                  underlineColorAndroid="transparent"
                  maxLength={128}
                  autoCapitalize="none"
                  onChangeText={first_name => this.setState({ first_name })}
                />
              </View>
              <View style={[styles.SectionStyle]}>
                <TextInput
                  style={{ width: "70%", color: "white", textAlign: "left" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                  placeholder="Apellidos"
                  placeholderTextColor="white"
                  selectionColor="white"
                  underlineColorAndroid="transparent"
                  maxLength={128}
                  autoCapitalize="none"
                  onChangeText={last_name => this.setState({ last_name })}
                />
              </View>
              <View style={[styles.SectionStyle]}>
                <TextInput
                  style={{ width: "70%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
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
                {Platform.OS !== "ios" && (
                  <Picker
                    selectedValue={this.state.gender}
                    style={{
                      width: "100%",
                      color: colorNames.white,
                      height: 200
                    }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ gender: itemValue })
                    }
                  >
                    <Picker.Item label="Género" value={null} />
                    <Picker.Item label="Hombre" value="man" />
                    <Picker.Item label="Mujer" value="woman" />
                  </Picker>
                )}

                {Platform.OS === "ios" && (
                  <RNPickerSelect
                    style={pickerSelectStyles}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ gender: itemValue })
                    }
                    placeholder={{ label: "Genero", value: null }}
                    items={[
                      { label: "Hombre", value: "man" },
                      { label: "mujer", value: "woman" }
                    ]}
                  />
                )}
              </View>

              <View style={[styles.SectionStyle]}>
                <DatePicker
                  style={{ width: "100%", color: colorNames.white }}
                  date={this.state.birth_date}
                  mode="date"
                  androidMode="spinner"
                  placeholder="Fecha de nacimiento"
                  format="YYYY-MM-DD"
                  minDate="1970-01-01"
                  maxDate="2050-01-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      marginLeft: 0,
                      opacity: 0
                    },
                    dateInput: {
                      marginLeft: 36,
                      borderWidth: 0
                    },
                    dateText: {
                      color: colorNames.white
                    },
                    placeholderText: {
                      color: colorNames.white
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={birth_date => {
                    this.setState({ birth_date: birth_date });
                  }}
                />
              </View>
              <View style={[styles.SectionStyle]}>
                <TextInput
                  style={{ color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                  placeholder="Número celular"
                  placeholderTextColor="white"
                  selectionColor="white"
                  underlineColorAndroid="transparent"
                  maxLength={128}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  onChangeText={phone => this.setState({ phone })}
                />
              </View>
              <View style={[styles.SectionStyle]}>
                <TextInput
                  style={{ width: "70%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
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
                  style={{ width: "70%", color: "white" }} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                  placeholderTextColor="white"
                  selectionColor="white"
                  secureTextEntry={true}
                  underlineColorAndroid="transparent"
                  placeholder={`Confirmar contraseña`}
                  autoCapitalize="none"
                  onChangeText={passwordConf => this.setState({ passwordConf })}
                />
              </View>

              <View style={{ width: "100%", alignItems: "center" }}>
                <View style={{ width: "80%" }}>
                  <SpinnerButton
                    buttonStyle={styles.button}
                    isLoading={this.state.defaultLoading}
                    onPress={() => {
                      this.setState({ defaultLoading: true });
                      this.register();
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
                      Registro
                    </Text>
                  </SpinnerButton>
                </View>
              </View>

              {/* <TouchableHighlight
                  onPress={this.register}
                  style={styles.button}
                  underlayColor='transparent'
                  accessibilityLabel="Aqui se puede loguear"
                >
                  <Text style={[{ color: 'white' }, { fontFamily: 'Poppins-Light'}]}>Registro</Text>
                </TouchableHighlight> */}
            </View>
          </ScrollView>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingBottom: 30 },
  footer: {
    flex: 1,
    // backgroundColor: 'steelblue',
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    margin: Platform.OS === "ios" ? 10 : 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    width: width * 0.8,
    marginLeft: width * 0.1
  },
  SectionStyle2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    margin: Platform.OS === "ios" ? 10 : 10,
    borderBottomColor: "white",
    width: width * 0.8,
    marginLeft: width * 0.1
  },

  SectionStyleError: {
    backgroundColor: "rgba(248, 215, 218,0.9)",
    borderColor: "rgb(248, 215, 218)"
  },
  linearGradient: {
    flex: 1
    // paddingHorizontal: 12
    // alignItems: 'center'
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
    width: width * 0.8,
    marginLeft: width * 0.1
  },
  link: {
    color: "white",
    textDecorationLine: "underline"
  },
  form: {
    paddingTop: 60
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: width * 0.8,
    fontSize: 14,
    paddingVertical: 12,
    //paddingHorizontal: 10,
    borderColor: "gray",
    borderRadius: 4,
    color: "white"
    // paddingRight: 30 // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30 // to ensure the text is never behind the icon
  }
});

export default Login;
