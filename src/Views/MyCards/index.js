import React, { Component, Fragment } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Navigation } from "react-native-navigation";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import CustomFont from "../../components/CustomFont/index";
import { usersCreditCards } from "../../feathers";
import { emitter } from "../../../";
import { pageView } from "../../utils/mixpanel";
const { width, height } = Dimensions.get("window");
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

const getImg = brand =>
  `https://d107sp3fyz1ulb.cloudfront.net/assets/cards/${brand}.png`;
const Card = ({ card = {}, main, onRemove }) => (
  <View
    style={{
      width: "100%",
      borderRadius: 6,
      backgroundColor: "#FEFEFE",
      padding: 6,
      paddingHorizontal: 10,
      marginBottom: 6,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ height: 20, width: 30, marginRight: 10 }}>
          <Image
            source={{ uri: getImg(card.brand) }}
            style={{ flex: 1, resizeMode: "contain" }}
          />
        </View>
        <CustomFont>{card.owner_name}</CustomFont>
      </View>
      <View>
        <CustomFont>{card.masked_number}</CustomFont>
      </View>
    </View>
    {!main && (
      <TouchableOpacity onPress={() => onRemove(card)}>
        <Image
          style={{
            height: 24,
            width: 24,
            resizeMode: "contain",
            tintColor: "#473E69"
          }}
          source={require("../../assets/iconsX/garbage.png")}
        />
      </TouchableOpacity>
    )}
  </View>
);
class Profile extends Base {
  static options() {
    return {
      sideMenu: {
        left: {
          visible: false,
          enabled: false
        }
      },
      topBar: {
        title: {
          text: "Mis Tarjetas",
          color: "white"
        },
        drawBehind: true,
        background: {
          color: "transparent"
        },
        backButton: {
          icon: require("../../assets/iconsX/backArrow.png"),
          color: "white"
        },
        rightButtons: [
          {
            id: "walletBtn",
            icon: require("../../assets/iconsX/wallet.png"),
            color: "white"
          }
        ]
      }
    };
  }

  state = {
    cards: []
  };

  gotoCreate = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.createCards"
      }
    });
  };

  loadInitialData = async () => {
    const { data } = await usersCreditCards.find({
      query: { active: 1, $sort: { createdAt: -1 } }
    });
    console.log("data", data);
    this.setState({ cards: data });
  };

  componentDidMount() {
    pageView("My Cards");
    this.loadInitialData();

    emitter.addListener("reloadMyCards", () => {
      console.log("-----<>> reloadMyCards");
      this.loadInitialData();
    });
  }

  removeCard = async card => {
    onPress = () => this.remove(card);
    Alert.alert(
      "¿Borrar tarjeta de credito?",
      "",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "SI", onPress }
      ],
      { cancelable: false }
    );
  };

  remove = async card => {
    await usersCreditCards.patch(card.id, { active: 0 });
    this.loadInitialData();
  };

  render() {
    const { cards } = this.state;
    const defaultCard = cards.find(el => JSON.parse(el.default));
    const otherCards = cards.filter(el => !JSON.parse(el.default));
    console.log("default", defaultCard, otherCards);
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
              <View>
                {defaultCard ? (
                  <Fragment>
                    <CustomFont style={{ fontSize: 18 }}>
                      Tarjeta principal
                    </CustomFont>
                    <Card card={defaultCard} onRemove={this.removeCard} />
                  </Fragment>
                ) : (
                  <CustomFont>
                    No tienes tarjetas de credito registradas
                  </CustomFont>
                )}
                {otherCards[0] && (
                  <CustomFont style={{ fontSize: 18, marginTop: 20 }}>
                    Otras tarjetas
                  </CustomFont>
                )}
                {otherCards.map(el => (
                  <Card card={el} onRemove={this.removeCard} />
                ))}
              </View>
              <TouchableOpacity
                style={{ marginTop: "auto" }}
                onPress={() => this.gotoCreate()}>
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#473E69",
                    borderRadius: 6,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <CustomFont style={{ color: "white" }}>Agregar</CustomFont>
                </View>
              </TouchableOpacity>
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
    justifyContent: "space-between",
    height: height - (HEADER_MIN_HEIGHT + 20)
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

export default connect()(Profile);
