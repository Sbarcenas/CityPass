import React, { PureComponent } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const { width } = Dimensions.get("window");

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>NO INTERNET CONNECTION - ACCEDE A TU WALLET</Text>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  unsubscribe = null;
  state = {
    isConnected: true
  };

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      this.setState({ isConnected });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    console.log({ isConnected: this.state.isConnected });
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: "#b52424",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width,
    top: 30
  },
  offlineText: { color: "#fff" }
});

export default OfflineNotice;
