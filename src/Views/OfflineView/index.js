import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  AsyncStorage,
  Alert
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Navigation } from "react-native-navigation";
import { startUp } from "../../../navigation";
import { Toaster } from "../../utils/toaster";
import { app } from "../../feathers/conf";
import NetInfo from "@react-native-community/netinfo";
import { auth } from "react-native-firebase";

class OfflineView extends Component {
  /*  async componentDidUpdate(prevProps) {
    console.log("PREV PROPS HOME", this.props);
    const {
      network: { isConnected }
    } = this.props;
    if (isConnected === true && prevProps.network.isConnected !== isConnected) {
      try {
        await app.authenticate();
        startUp("home");
      } catch (error) {
        startUp("login");
      }
    }
  } */
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  async componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      console.log({ state });
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected) {
        this.connect();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  connect = async () => {
    try {
      this.setState({ loading: true });
      await app.authenticate();
      Navigation.dismissAllModals();
      startUp("home");
    } catch (error) {
      if (!error.message.includes("timed out")) startUp("login");
    } finally {
      this.setState({ loading: false });
    }
  };

  tryAgain = async () => {
    try {
      //await fetch("https://google.com");
      const { type, isConnected } = await NetInfo.fetch();
      if (isConnected) this.connect();
    } catch (error) {
      Toaster({ type: "error", text: error.message });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <View
        style={[
          styles.fill,
          styles.bodyBackground,
          { justifyContent: "center", alignItems: "center" }
        ]}
      >
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#1CB5D8", "#9126D9"]}
          style={styles.linearGradient}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
        >
          <Text style={styles.title}>
            Parece que no tienes conexión a internet
          </Text>
          <Image
            source={require("../../assets/icons/no-wifi.png")}
            style={{ height: 120, resizeMode: "contain", marginTop: 20 }}
          />
          <View style={{ marginTop: 20 }}>
            {loading ? (
              <Text style={{ fontSize: 18, color: "white" }}>
                Reintentando ...
              </Text>
            ) : (
              <TouchableOpacity onPress={this.tryAgain}>
                <Text style={{ fontSize: 18, color: "white" }}>
                  Intentar nuevamente
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bodyBackground: {
    backgroundColor: "#F4F4F4"
  },
  fill: {
    flex: 1
  },
  linearGradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  title: { fontSize: 24, width: "90%", textAlign: "center", color: "white" }
});

export default OfflineView;
