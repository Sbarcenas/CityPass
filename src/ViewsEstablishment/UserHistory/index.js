import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  Alert
} from "react-native";
import moment from "moment";
import "moment/min/locales";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import { readUserTokenHistory } from "../../feathers";
import CustomFont from "../../components/CustomFont/index";
import { Navigation } from "react-native-navigation";
import { showModal } from "../../../navigation";
import { GET_USERS_HISTORY } from "../../actions/stablishment.actions";
import RNFetchBlob from "react-native-fetch-blob";
moment.locale("es");
const { width, height } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

class Hub extends Base {
  state = {
    benefits: []
  };
  static options() {
    return {
      topBar: {
        rightButtons: [],
        title: {
          text: "Historial de Usuarios",
          color: "white"
        },
        drawBehind: true,
        background: {
          color: "transparent"
        }
      }
    };
  }

  async download(url) {
    if (Platform.OS === "ios") {
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
    }

    let ext = this.extention(url);
    let date = new Date();
    ext = "." + ext[0];
    const { config, fs } = RNFetchBlob;
    let DownloadDir = fs.dirs.DocumentDir; // this is the pictures directory. You can check the available directories in the wiki
    let options = {
      fileCache: false,
      path:
        DownloadDir +
        "/me_" +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: true,
        path: fs.dirs.DownloadDir + "/me_" + ext,
        description: "Downloading image."
      }
    };
    config(options)
      .fetch("GET", url)
      .then(res => {
        // do some magic here

        if (Platform.OS === "ios") {
          RNFetchBlob.ios.previewDocument(res.data);
        }
      })
      .catch(e => Alert.alert("error", JSON.stringify(e)));
  }
  extention(filename) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  }

  async componentDidMount() {
    const { data } = await readUserTokenHistory.find({
      query: { $limit: 1000, $sort: { id: -1 } }
    });
    console.log("user history", data);
    this.setState({ benefits: data });
  }
  showMore = benefit => {
    Navigation.showOverlay({
      component: {
        name: "app.benefitDescription",
        passProps: {
          benefit,
          history: true
        }
      }
    });
  };
  render() {
    const { benefits } = this.state;
    console.log("BENEFITS", benefits);
    return (
      <View style={[styles.fill, styles.bodyBackground]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 1.0, y: 0.8 }}
          colors={["#473E69", "#249EC7"]}
          style={styles.headerGradient}
        />
        <View style={[styles.fill, { padding: 15 }]}>
          <View
            style={{
              flexDirection: "row",
              width: width * 0.75,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginVertical: 20
            }}
          >
            <TouchableHighlight
              style={styles.redeemButton}
              underlayColor="#473E69"
              disable={false}
              onPress={() => {
                Navigation.showOverlay({
                  component: {
                    name: "app.modalActivityIndicator",
                    passProps: {}
                  }
                });
                this.props.historyLoaded().then(res => this.download(res.link));
              }}
            >
              <View>
                <Text
                  style={[
                    styles.redeemButtonText,
                    { fontFamily: "Poppins-Light", color: "white" }
                  ]}
                >
                  Exportar a excel
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <ScrollView>
            {benefits.map(el => (
              // <TouchableOpacity onPress={() => this.showMore(el)}>
              <View
                style={{
                  width: "100%",
                  height: 60,
                  borderRadius: 6,
                  backgroundColor: "white",
                  marginBottom: 15,
                  padding: 8,
                  flexDirection: "row"
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row" }}>
                    {/* <CustomFont style={{ fontSize: 16 }}>Cliente:</CustomFont> */}
                    <CustomFont
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{ color: "#473E69", fontSize: 16, width: "100%" }}
                    >
                      {` ${(el.user || {}).first_name} ${
                        (el.user || {}).last_name
                      }`}
                    </CustomFont>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <CustomFont style={{ fontSize: 16 }}>Leido por:</CustomFont>
                    <CustomFont
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{ color: "#473E69", fontSize: 16, width: "100%" }}
                    >
                      {` ${(el.user_establishment || {}).first_name} ${
                        (el.user_establishment || {}).last_name
                      }`}
                    </CustomFont>
                  </View>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <CustomFont style={{ fontSize: 12 }}>
                    {moment(el.redeem).format("h:mm:ss a DD-MM-YY")}
                  </CustomFont>
                </View>
              </View>
              // </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
    height: HEADER_MIN_HEIGHT,
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
  },
  scrollViewContent: {
    flex: 1,
    marginTop: HEADER_MAX_HEIGHT - 174,
    width,
    minHeight: height - HEADER_MAX_HEIGHT,
    flexDirection: "column-reverse"
  },
  redeemButton: {
    marginHorizontal: "auto",
    width: "80%",
    height: 40,
    // backgroundColor: '#F7C36F',
    backgroundColor: "#473E69",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",

    marginTop: 10
  }
});
const mapStateToProps = state => ({
  isLoading: state.establishment.isLoading
});

function mapDispatchToProps(dispatch) {
  return {
    historyLoaded: () => dispatch(GET_USERS_HISTORY())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hub);
