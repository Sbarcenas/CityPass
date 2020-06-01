import React, { Component, Fragment } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";
import { cities, users, current } from "../../feathers";
import arrowDown from "../../assets/icons/arrowDown.png";
import { socket } from "../../feathers/conf";
import { setUser, getUser } from "../../utils/sessionUser";
import { emitter } from "../../../";
import { Toaster } from "../../utils/toaster";

const { width, height } = Dimensions.get("window");
class HomeHeader extends Component {
  state = {
    cities: [{ name: "Barranquilla", id: 1 }]
  };
  async componentDidMount() {
    const { dispatch, user: u } = this.props;
    dispatch({ type: "UPDATE_USER", user: {} });

    const promises = [cities.find(), current.find()];

    const [{ data }, user] = await Promise.all(promises);

    this.setState({ cities: data });

    //setUser(user);
    dispatch({ type: "UPDATE_USER", user });
    dispatch({ type: "SET_USER_CITY", city_id: user.city_id });

    console.log("header user", user);

    if (user.is_new === "true") {
      dispatch({ type: "UPDATE_USER", user: { showIntro: true } });
      // this.chooseCity(true);
    }

    socket.on("users patched", user => {
      console.log("patch socket");
      dispatch({ type: "UPDATE_USER", user });
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "UPDATE_USER", user: { city_id: null } });
  }
  chooseCity = must => {
    const { cities } = this.state;

    Navigation.showOverlay({
      component: {
        name: "app.cityPicker",
        passProps: {
          list: cities,
          handlePress: this.handlePickCity,
          must
        }
      }
    });
  };
  handlePickCity = async city => {
    const { dispatch } = this.props;
    dispatch({ type: "SET_USER_CITY", city_id: city.id });
    try {
      const userJSON = await getUser();
      const { id } = JSON.parse(userJSON);
      users.patch(id, { city_id: city.id });
    } catch (error) {
      Toaster({ type: "error", text: error.message });
    }
    // cities.setCity(city);
    // categories.readCategories(undefined, city.id);
  };
  render() {
    const { cities } = this.state;
    const {
      user: { city_id }
    } = this.props;
    const city = cities.find(city => city.id == city_id) || {};

    return (
      <Fragment>
        <View style={{ width: 200, height: 40, paddingTop: 12 }}>
          {city && (
            <TouchableOpacity
              style={{ height: "100%" }}
              onPress={() => this.chooseCity()}>
              <View style={styles.cityPicker}>
                <Text
                  style={[styles.cityName, { fontFamily: "Poppins-Light" }]}>
                  {city.name}
                </Text>
                <Image source={arrowDown || ""} style={styles.arrowDown} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  cityPicker: {
    flexDirection: "row",
    alignItems: "center",
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
export default connect(mapStateToProps)(HomeHeader);
