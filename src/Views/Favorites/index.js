import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Navigation } from "react-native-navigation";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import CustomFont from "../../components/CustomFont/index";
import Establishment from "../../components/Establishment";
import { getUser } from "../../utils/sessionUser";
import { favoriteEstablishments, establishments } from "../../feathers";
import { pageView } from "../../utils/mixpanel";
import MiniOfflineSign from "../../components/MiniOfflineSign";
const { width } = Dimensions.get("window");
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

class Favorites extends Base {
  state = {
    data: []
  };
  static options() {
    return {
      topBar: {
        rightButtons: [],
        title: {
          text: "Mis favoritos",
          color: "white"
        },
        drawBehind: true,
        background: {
          color: "transparent"
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
  onPress = merchant => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.establishment",
        passProps: {
          merchant
        }
      }
    });
  };
  async componentDidMount() {
    pageView("favorites");
    try {
      const userJson = await getUser();
      const user = JSON.parse(userJson);
      const { data } = await favoriteEstablishments.find({
        query: { user_id: user.id }
      });
      const establishmentIds = data.map(el => el.establishment_id);
      const { data: dataEstablishments } = await establishments.find({
        query: { id: { $in: establishmentIds[0] ? establishmentIds : null } }
      });
      console.log("User Favorites", data);
      this.setState({ data: dataEstablishments });
    } catch ({ message }) {
      console.log("ERR: ----<>", message);
    }
  }
  gotoSearch = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.search"
      }
    });
  };
  render() {
    const { data } = this.state;
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
              <FlatList
                data={data}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Establishment hit={item} onPress={this.onPress} />
                )}
                keyExtractor={(_, key) => `item-${key}`}
              />
              {!data[0] && (
                <View style={{ alignItems: "center" }}>
                  <CustomFont>Aún no tienes comercios favoritos</CustomFont>
                  <TouchableOpacity onPress={this.gotoSearch}>
                    <CustomFont style={{ color: "#473E69" }}>
                      Ver comercios
                    </CustomFont>
                  </TouchableOpacity>
                </View>
              )}
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

export default connect()(Favorites);
