import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  BackHandler
} from "react-native";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Navigation } from "react-native-navigation";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import CustomFont from "../../components/CustomFont/index";
import { current } from "../../feathers";
const { width } = Dimensions.get("window");
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

const OPTIONS = [
  {
    name: "Escanear",
    view: "qrReader",
    uri: "https://static.cityprime.club/assets-establishments/home/scan.jpg"
  },
  {
    name: "Beneficios",
    view: "benefits",
    uri: "https://static.cityprime.club/assets-establishments/home/benefits.jpg"
  },
  {
    name: "Beneficios Escaneados",
    view: "benefitHistory",
    uri:
      "https://static.cityprime.club/assets-establishments/home/history-benefits.jpg"
  },
  {
    name: "Usuarios Escaneados",
    view: "userHistory",
    uri:
      "https://static.cityprime.club/assets-establishments/home/history-users.jpg"
  }
];

class Hub extends Base {
  state = {
    establishment: {}
  };
  gotoView = view => {
    Navigation.push(this.props.componentId, {
      component: {
        name: `app.${view}`,
        options: {
          topBar: {
            backButton: {
              icon: require("../../assets/iconsX/backArrow.png"),
              color: "white"
            },
            elevation: 0,
            drawBehind: true,
            background: {
              color: "transparent"
            }
          }
        }
      }
    });
  };
  static options() {
    return {
      topBar: {
        drawBehind: true,
        background: {
          color: "transparent"
        },
        title: {
          text: "Comercios",
          color: "white"
        },
        leftButtons: [
          {
            id: "closeEstablishment",
            icon: require("../../assets/iconsX/turn-off.png"),
            color: "white"
          }
        ],
        rightButtons: []
      }
    };
  }
  async componentDidMount() {
    const { establishment } = await current.find();
    this.setState({ establishment });
    BackHandler.addEventListener("hardwareBackPress", () => {
      try {
        Navigation.pop(this.props.componentId);
      } catch (error) {
        console.log("");
      }
    });
  }
  render() {
    return (
      <View style={[styles.fill, styles.bodyBackground]}>
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
            style={styles.fill}>
            <View style={styles.content}>
              {OPTIONS.map(option => (
                <TouchableWithoutFeedback
                  key={option.name}
                  onPress={() => this.gotoView(option.view)}>
                  <View>
                    <ImageBackground
                      style={styles.row}
                      source={{ uri: option.uri }}>
                      <CustomFont style={styles.rowText}>
                        {option.name.toLocaleUpperCase()}
                      </CustomFont>
                    </ImageBackground>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
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
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
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
    overflow: "hidden",
    padding: 10
  },
  rowText: {
    color: "white",
    fontSize: 22
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 3
  }
});

export default connect()(Hub);
