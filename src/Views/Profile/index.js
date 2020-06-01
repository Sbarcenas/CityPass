import React, { Component, Fragment } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import CustomFont from "../../components/CustomFont/index";
import { current, users } from "../../feathers";
import { Toaster } from "../../utils/toaster";
import { pageView } from "../../utils/mixpanel";
import { getAvatarPhoto } from "../../utils/S3Photos";
import MiniOfflineSign from "../../components/MiniOfflineSign";
const { width } = Dimensions.get("window");
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

const offset = Platform.OS === "android" ? -200 : 0;
const Input = props => (
  <View
    style={{
      width: "100%",
      borderColor: "dimgray",
      borderBottomWidth: 1,
      borderRadius: 6
    }}
  >
    <TextInput {...props} />
  </View>
);
class Profile extends Base {
  static options() {
    return {
      sideMenu: {
        left: {
          visible: false,
          enabled: false
        }
      },
      topBar: {
        title: {
          text: "Mi cuenta",
          color: "white"
        },
        drawBehind: true,
        background: {
          color: "transparent"
        },
        backButton: {
          icon: require("../../assets/iconsX/backArrow.png"),
          color: "white"
        },
        rightButtons: [
          {
            id: "walletBtn",
            icon: require("../../assets/iconsX/wallet.png"),
            color: "white"
          }
        ]
      }
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      phone: ""
    };
  }

  async componentDidMount() {
    try {
      // pageView('my account');
      console.log("before req");
      const user = await current.find();
      console.log("after req");
      console.log("USER", user);
      this.setState({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone
      });
    } catch (error) {
      console.log("ERROR", error);
      Toaster({ type: "error", message: error.message });
    }
  }

  save = async () => {
    const { id, first_name, last_name, email, phone } = this.state;

    try {
      await users.patch(id, { first_name, last_name, email, phone });
      this.componentDidMount();
      Toaster({ type: "success", text: "Datos Actualizados" });
    } catch (error) {
      Toaster({ type: "error", text: error.message });
    }
  };

  render() {
    console.log("MOUNT");
    const { first_name, last_name, email, phone, avatar } = this.state;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={offset}
        style={[styles.fill, styles.bodyBackground]}
        behavior="padding"
        enabled
      >
        <StatusBar barStyle="light-content" />
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 1.0, y: 0.8 }}
          colors={["#473E69", "#249EC7"]}
          style={styles.headerGradient}
        />
        <View style={styles.fill}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.fill}
          >
            <View style={styles.content}>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  paddingBottom: 20,
                  paddingTop: 20,
                  padding: 10,
                  backgroundColor: "white"
                }}
              >
                <View
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 80,
                    overflow: "hidden",
                    backgroundColor: "#F1F3F4"
                  }}
                >
                  <ImageBackground
                    source={{ uri: getAvatarPhoto(avatar) }}
                    style={{ flex: 1, height: 80, width: 80 }}
                  />
                </View>
                <CustomFont
                  style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}
                >
                  Hola, {first_name}
                </CustomFont>
              </View>

              <View style={{ paddingHorizontal: 26 }}>
                <View style={{ marginTop: 10 }}>
                  <CustomFont>Nombres</CustomFont>
                </View>
                <Input
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    borderRadius: 6,
                    paddingLeft: 20
                  }}
                  value={first_name}
                  onChangeText={text => this.setState({ first_name: text })}
                />

                <View style={{ marginTop: 10 }}>
                  <CustomFont>Apellidos</CustomFont>
                </View>
                <Input
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    borderRadius: 6,
                    paddingLeft: 20
                  }}
                  value={last_name}
                  onChangeText={text => this.setState({ last_name: text })}
                />

                <View style={{ marginTop: 10 }}>
                  <CustomFont>Email</CustomFont>
                </View>
                <Input
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    borderRadius: 6,
                    paddingLeft: 20
                  }}
                  value={email}
                  onChangeText={text => this.setState({ email: text })}
                />

                <View style={{ marginTop: 10 }}>
                  <CustomFont>Celular</CustomFont>
                </View>
                <Input
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    borderRadius: 6,
                    paddingLeft: 20
                  }}
                  value={phone}
                  onChangeText={text => this.setState({ phone: text })}
                />

                <View style={{ width: "100%", alignItems: "center" }}>
                  <TouchableOpacity onPress={this.save}>
                    <View style={styles.saveButton}>
                      <CustomFont
                        style={{ color: "white", fontWeight: "bold" }}
                      >
                        Guardar
                      </CustomFont>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  bodyBackground: {
    backgroundColor: "#F1F3F4"
  },
  fill: {
    flex: 1
  },
  headerGradient: {
    width,
    height: HEADER_MIN_HEIGHT,
    alignItems: "center"
  },
  content: {},
  saveButton: {
    height: 40,
    width: 200,
    borderRadius: 6,
    backgroundColor: "#473E69",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  }
});

export default connect()(Profile);
