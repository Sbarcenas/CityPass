import React, { Component, Fragment } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import HTML from "react-native-render-html";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import CustomFont from "../../components/CustomFont/index";
import { cms } from "../../feathers";
import { pageView } from "../../utils/mixpanel";
import MiniOfflineSign from "../../components/MiniOfflineSign";
const { width } = Dimensions.get("window");
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

class CMS extends Base {
  static options() {
    return {
      topBar: {
        rightButtons: [],
        drawBehind: true,
        background: {
          color: "transparent"
        },
        title: {
          text: "",
          color: "white"
        }
      },
      sideMenu: {
        left: {
          visible: false,
          enabled: false
        }
      }
    };
  }
  state = {
    html: ""
  };
  async componentDidMount() {
    pageView("cms_information");
    const { id } = this.props;
    const res = await cms.get(id);

    this.setState({ html: res.content });
    console.log("CMS ---<<>", res);
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
            style={styles.fill}
          >
            <View style={styles.content}>
              <HTML html={this.state.html} imagesMaxWidth={width} />
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
  }
});

export default connect()(CMS);
