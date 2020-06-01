import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";
import { RNCamera } from "react-native-camera";
import Base from "../../components/Base";
import { claimBenefit, readUser } from "../../feathers";
import { Toaster } from "../../utils/toaster";
const { width } = Dimensions.get("window");

class QrReader extends Base {
  state = {
    reading: false,
    codeText: ""
  };
  static options() {
    return {
      topBar: {
        rightButtons: [],
        drawBehind: true,
        background: {
          color: "transparent"
        }
      }
    };
  }
  onBottomButtonPressed = ({ type }) => {
    if (type === "left") this.openModal();
  };
  onRead = event => {
    console.log("aa", event);
    const { reading } = this.state;
    if (reading) return;
    console.log("aa", event);
    this.setState({ reading: true });
    this.processToken(event.data);
  };
  processToken = code => {
    const [prefix, token] = code.split("-");
    // alert(prefix)
    if (prefix === "US") this.readUser(token);
    else if (prefix === "BN") this.claimBenefit(token);
    else {
      Toaster({ type: "error", title: "No es un QR valido" });
      setTimeout(() => {
        this.setState({ reading: false });
      }, 5000);
    }
    // this.claimBenefit(code)
  };
  claimBenefit = async Rawtoken => {
    const token = Rawtoken.toUpperCase();
    try {
      const res = await claimBenefit.create({ token });
      console.log("redeem response", res);
      Toaster({ type: "success", title: "Beneficio Canjeado" });
      Navigation.showOverlay({
        component: {
          name: "app.benefitDescription",
          passProps: { benefit: res }
        }
      });
    } catch (error) {
      Toaster({ type: "error", text: error.message });
    } finally {
      setTimeout(() => {
        this.setState({ reading: false });
      }, 5000);
    }
  };
  readUser = async Rawtoken => {
    const token = Rawtoken.toUpperCase();
    try {
      const res = await readUser.create({ token });
      console.log("redeem user", res);
      Toaster({ type: "success", title: "Usuario Escaneado" });
      Navigation.showOverlay({
        component: {
          name: "app.benefitDescription",
          passProps: { benefit: res }
        }
      });
    } catch (error) {
      Toaster({ type: "error", text: error.message });
    } finally {
      setTimeout(() => {
        this.setState({ reading: false });
      }, 5000);
    }
  };

  openModal = () => {
    Navigation.showOverlay({
      component: {
        name: "app.codeInputModal",
        passProps: {
          onChange: val => {
            this.setState({ codeText: val.toUpperCase() });
          },
          onSubmit: dissmiss => {
            const { codeText } = this.state;
            this.claimBenefit(codeText);
            this.setState({ codeText: "" });
            dissmiss();
          }
        }
      }
    });
  };
  render() {
    return (
      <View style={[styles.fill, styles.bodyBackground]}>
        <RNCamera
          style={{ flex: 1 }}
          type={RNCamera.Constants.Type.back}
          permissionDialogTitle={"Permission to use camera"}
          permissionDialogMessage={
            "We need your permission to use your camera phone"
          }
          onBarCodeRead={e => {
            console.log("ee", e);
            this.onRead(e);
          }}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingLeft: 30,
              paddingBottom: 30
            }}>
            <TouchableOpacity onPress={this.openModal}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                Digitar Código
              </Text>
            </TouchableOpacity>
          </View>
        </RNCamera>
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
  headerGradient: {
    width,
    height: 100,
    alignItems: "center"
  },
  content: {
    padding: 10
  },
  saveButton: {
    height: 40,
    width: 200,
    borderRadius: 6,
    backgroundColor: "#53D1FB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  row: {
    height: width * 0.44,
    width: width * 0.44,
    marginVertical: 8,
    elevation: 10,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    overflow: "hidden"
  },
  rowText: {
    color: "white",
    fontSize: 24
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 3
  }
});

export default connect()(QrReader);
