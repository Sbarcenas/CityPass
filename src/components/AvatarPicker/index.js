import React, { Component, Fragment } from "react";
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
  StyleSheet,
  CameraRoll,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { RNS3 } from "react-native-aws3-anarock";
import { Navigation } from "react-native-navigation";
import CustomFont from "../CustomFont";
import { Toaster } from "../../utils/toaster";
import { users, current } from "../../feathers";
import { pageView } from "../../utils/mixpanel";
import { getAvatarPhoto } from "../../utils/S3Photos";
import { RNCamera } from "react-native-camera";

const { width, height } = Dimensions.get("window");
const file = {
  type: "image/png"
};
const options = {
  bucket: "cityprime-static",
  region: "us-east-1",
  accessKey: "AKIAILXWHXVE6ZHEFWTA",
  secretKey: "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",
  successActionStatus: 201
};
class AvatarPicker extends Component {
  state = {
    showGallery: false,
    images: []
  };

  dismiss = () => Navigation.dismissOverlay(this.props.componentId);
  upload = async uri => {
    const { user, dispatch } = this.props;
    this.setState({ loading: true });
    try {
      const res = await RNS3.put(
        { ...file, name: `avatar-${Date.now()}.png`, uri },
        { ...options, keyPrefix: `users/${user.id}/profilepic/` }
      );
      if (res.status !== 201) {
        Toaster({
          type: "error",
          title: "Error al subir tu foto",
          text: "Intentalo mas tarde"
        });
        console.log("error ----<<>", res.body);
        this.dismiss();
      } else {
        console.log("enter", user);
        const usr = await users.patch(user.id, {
          avatar: res.body.postResponse.key
        });
        dispatch({ type: "UPDATE_USER", user: await current.find() });
        console.log("user patch", usr, res.body);
        Toaster({ type: "success", title: "Foto Actualizada" });
        this.dismiss();
      }
    } catch (error) {
      Toaster({ type: "error", title: error.message });
    }
  };
  // takePicture = async () => {
  //   // const image = await this.camera.capture(true);
  //   // alert(JSON.stringify(image));

  //   Navigation.showOverlay({
  //     component: {
  //       name: 'app.confirmPhoto',
  //       passProps: {
  //         photo: image.uri,
  //         upload: this.upload,
  //       },
  //     }
  //   });
  // }

  render() {
    const { showGallery, loading } = this.state;
    const { user } = this.props;
    console.log("user LOGGER", user);
    if (showGallery) return this.renderGallery();
    return (
      <View style={{ width, height, backgroundColor: "rgba(0, 0, 0, .7)" }}>
        {loading && (
          <View
            style={{
              width,
              height,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              zIndex: 100,
              backgroundColor: "rgba(255, 255, 255, .7)"
            }}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <View style={{ flex: 2.7 }}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={RNCamera.Constants.Type.front}
            permissionDialogTitle={"Permission to use camera"}
            permissionDialogMessage={
              "We need your permission to use your camera phone"
            }
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <TouchableOpacity onPress={this.takePicture}>
            <View
              style={[
                styles.button,
                { backgroundColor: "#473E69", marginBottom: 10 }
              ]}>
              <CustomFont style={[styles.buttonText]}>Tomar foto</CustomFont>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => this.setState({ showGallery: true })}>
            <View style={[styles.button, { backgroundColor: '#473E69', marginBottom: 10 }]}>
              <CustomFont style={[styles.buttonText]}>Galeria</CustomFont>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={this.dismiss}>
            <View style={[styles.button, { backgroundColor: "#473E69" }]}>
              <CustomFont style={[styles.buttonText]}>Cancelar</CustomFont>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync({
        ...options,
        orientation: "portrait",
        fixOrientation: true,
        forceUpOrientation: true
      });
      // alert(data.uri);
      Navigation.showOverlay({
        component: {
          name: "app.confirmPhoto",
          passProps: {
            photo: data.uri,
            upload: this.upload
          }
        }
      });
    }
  };
  renderGallery = () => {
    const { images, loading } = this.state;
    return (
      <Fragment>
        {loading && (
          <View
            style={{
              width,
              height,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              zIndex: 100,
              backgroundColor: "rgba(255, 255, 255, .7)"
            }}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <View
          style={{
            height,
            width,
            padding: 10,
            paddingTop: 30,
            backgroundColor: "white"
          }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}>
            {images.map(uri => (
              <TouchableOpacity onPress={() => this.upload(uri)}>
                <View style={{ padding: 4 }}>
                  <Image source={{ uri }} style={{ height: 80, width: 80 }} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Fragment>
    );
  };
}
const styles = StyleSheet.create({
  button: {
    width: 300,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6
  },
  buttonText: {
    color: "white"
  }
});
const mapState = state => state;
export default connect(mapState)(AvatarPicker);
