import React, { Component } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  ImageBackground,
  StatusBar
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import CF from "../../components/CustomFont";
import { categories, locationCitiesCategories } from "../../feathers";
import { pageView } from "../../utils/mixpanel";
const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class SubCategories extends Base {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      language: "",
      categories: []
    };
  }

  static options() {
    return {
      sideMenu: {
        left: {
          visible: false,
          enabled: false
        }
      },
      topBar: {
        drawBehind: true,
        background: {
          color: "transparent"
        },
        title: {
          color: "transparent",
          component: {
            name: "app.searchInput",
            alignment: "center"
          }
        }
      }
    };
  }

  componentDidMount = async () => {
    const { parent_id, parent_name, user } = this.props;
    pageView("sub categories", {
      parent_category: parent_name
    });
    try {
      const { data } = await locationCitiesCategories.find({
        query: { $limit: 1000, city_id: user.city_id }
      });
      const { data: dataCategories } = await categories.find({
        query: {
          $sort: { position: -1 },
          $limit: 1000,
          active: 1,
          parent_id,
          id: { $in: data.map(el => el.category_id) }
        }
      });
      console.log("CDM", data.map(el => el.category_id));
      this.setState({ categories: dataCategories });
      // LAS CATEGORIES YA ESTAN EN EL STATE. SE VA A VERIFICAR SI UN CATEGORY TIENE HIJOS
      const ids = dataCategories.map(category => category.id);
      const { data: subCategoriesData } = await categories.find({
        query: { $limit: 1000, active: 1, parent_id: { $in: ids } }
      });
      const finalCategories = dataCategories.map(el => {
        const hasChild = subCategoriesData.find(sub => sub.parent_id == el.id);
        return {
          ...el,
          hasChild: hasChild ? true : false
        };
      });
      console.log("final categories", finalCategories);
      this.setState({ categories: finalCategories });
    } catch (error) {
      console.log("err: ", error.message);
    }
  };

  gotoCategory = category => {
    const view = category.hasChild ? "subCategories" : "category";
    Navigation.push(this.props.componentId, {
      component: {
        name: `app.${view}`,
        passProps: {
          parent_id: category.id
        }
      }
    });
  };

  renderScrollViewContent() {
    const { categories } = this.state;
    return (
      <View style={styles.scrollViewContent}>
        {categories.map(el => (
          <TouchableWithoutFeedback
            onPress={() => this.gotoCategory(el)}
            key={el.id}>
            <View>
              <ImageBackground
                style={styles.row}
                source={{ uri: el.banner || "" }}>
                <CF style={styles.rowText}>
                  {(el.name || "").toLocaleUpperCase()}
                </CF>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  }

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 3],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    return (
      <View style={[styles.fill, styles.bodyBackground]}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={[styles.scrollView]}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}>
          {this.renderScrollViewContent()}
        </ScrollView>
        <Animated.View style={[styles.headerSearchContainer, { opacity }]} />
        <Animated.View
          style={[
            styles.header,
            {
              height:
                getStatusBarHeight() > 40
                  ? 100
                  : getStatusBarHeight(true) != 0
                  ? 70
                  : 60
            }
          ]}>
          <LinearGradient
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 1.0, y: 0.8 }}
            colors={["#473E69", "#249EC7"]}
            style={styles.headerGradient}
          />
        </Animated.View>
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
    fontSize: 24
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 3
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#03A9F4",
    overflow: "hidden",
    zIndex: 0
  },
  headerGradient: {
    flex: 1
  },
  headerNavBar: {
    height: 80,
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative"
  },
  headerSearchContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "absolute",
    width: width * 0.7,
    left: width * 0.15,
    top: 70,
    zIndex: 100
  },
  headerSearch: {
    height: 40,
    width: "85%",
    marginRight: width * 0.02,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderColor: "white",
    paddingBottom: 5,
    paddingLeft: 5,
    borderBottomWidth: 1
  },
  headerSearchInput: {
    color: "white",
    fontSize: 16,
    paddingVertical: 0,
    width: "100%"
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 18
  },
  scrollViewContent: {
    // marginTop: HEADER_MAX_HEIGHT - 60,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  scrollView: {
    marginTop:
      getStatusBarHeight() > 40 ? 110 : getStatusBarHeight(true) != 0 ? 80 : 70,
    zIndex: 1,
    paddingHorizontal: 16
    // backgroundColor: 'red'
  },
  cityPicker: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  cityName: {
    color: "white"
  },
  arrowDown: {
    height: 12,
    width: 12,
    resizeMode: "contain",
    marginLeft: 15
  }
});

const mapStateToProps = state => state;
export default connect(mapStateToProps)(SubCategories);
