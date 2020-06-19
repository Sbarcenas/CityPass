import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { CardView } from "react-native-credit-card-input";
import Carousel from "react-native-snap-carousel";
import SpinnerButton from "react-native-spinner-button";
import { products, usersCreditCards, paymentProcessData } from "../../feathers";
import CustomFont from "../CustomFont";
import { Navigation } from "react-native-navigation";
import { Toaster } from "../../utils/toaster";
import { pageView } from "../../utils/mixpanel";
import { emitter } from "../../../";
import Base from "../../components/Base";
import MiniOfflineSign from "../MiniOfflineSign";

const { width, height } = Dimensions.get("window");
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

class index extends Base {
  state = {
    cards: [],
    products: []
  };
  componentDidMount() {
    emitter.addListener("reloadMyCards", () => {
      console.log("-----<>> reloadMyCards");
      this.loadInitialData();
    });
    this.loadInitialData();
  }
  loadInitialData = async () => {
    pageView("store points");
    const promises = [
      products.find({ $sort: { points: -1 } }),
      usersCreditCards.find({ query: { active: 1 } })
    ];
    const [{ data }, { data: dataCards }] = await Promise.all(promises);
    const mainCard = dataCards.find(el => el.default == "true");
    const otherCards = dataCards.filter(el => el.default == "false");

    const cards = otherCards;
    if (mainCard) cards.push(mainCard);
    this.setState({
      products: data,
      cards
    });
  };
  shoppingItem = ({ item }) => (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          width: 200,
          height: 141,
          borderRadius: 8,
          backgroundColor: "white"
        }}
      >
        <ImageBackground
          source={{ uri: item.image || "" }}
          style={{ height: "100%", width: "100%" }}
        />
      </View>
    </View>
  );
  card = ({ item }) => {
    if (!item) return null;
    const year = `${item.exp_year}`.substring(0, 2)[0];
    const month = item.exp_month < 10 ? `0${item.exp_month}` : item.exp_month;
    const card = item.masked_number.match(/.{1,4}/g).join(" ");
    return (
      <View style={{ paddingVertical: 5, alignItems: "center" }}>
        <CardView
          number={card}
          name={item.owner_name}
          brand={item.brand}
          expiry={`${month}/${year}`}
          scale={0.8}
        />
      </View>
    );
  };
  submit = async () => {
    this.setState({ defaultLoading: true });
    const { products, cards } = this.state;
    const itemIndex = this.refs.item.currentIndex;
    const cardIndex = this.refs.card.currentIndex;
    try {
      const res = await paymentProcessData.create({
        product_id: products[itemIndex].id,
        user_credit_card_id: cards[cardIndex].id
      });
      console.log("payment request", res);
      if (res.payment_status === "pendiente") {
        Toaster({
          type: "warn",
          title: "Pago pendiente por validar",
          text: "Te notificaremos una vez sea aprobado"
        }); //
      } else {
        Toaster({ type: "success", title: "Compra Completada" });
      }
      Navigation.pop(this.props.componentId);
    } catch (error) {
      if (
        error.message ===
        "Timeout of 5000ms exceeded calling create on process-payment-data"
      ) {
        Toaster({
          type: "warn",
          title: "Procesando tu pago",
          text:
            "Te notificaremos el estado de tu compra en los próximos minutos."
        });
        Navigation.pop(this.props.componentId);
      } else
        Toaster({
          type: "error",
          title: "Error en la compra",
          text: error.message
        });
      console.log("err", error.message);
    } finally {
      this.setState({ defaultLoading: false });
    }
  };
  addCard = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.createCards"
      }
    });
  };
  render() {
    const { products, cards } = this.state;

    return (
      <React.Fragment>
        <LinearGradient
          start={{ x: -0.1, y: 0.25 }}
          end={{ x: 1.5, y: 1.2 }}
          colors={["#473E69", "#249EC7"]}
          style={[
            styles.fill,
            { justifyContent: "space-between", paddingBottom: 16 }
          ]}
        />
        <View
          style={{
            width,
            height: height - HEADER_MIN_HEIGHT,
            paddingBottom: 40
          }}
        >
          <ScrollView>
            <View style={{ justifyContent: "space-between", flex: 1 }}>
              <View>
                <View>
                  <View style={{ marginVertical: 30, alignItems: "center" }}>
                    <CustomFont
                      style={{
                        color: "#473E69",
                        fontSize: 18,
                        fontWeight: "bold"
                      }}
                    >
                      Escoge tu paquete de puntos
                    </CustomFont>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      marginBottom: 30
                    }}
                  >
                    <Carousel
                      ref={"item"}
                      data={products}
                      renderItem={this.shoppingItem}
                      itemWidth={200 + 40}
                      sliderWidth={width}
                      enableMomentum
                    />
                  </View>
                </View>
                {cards[0] ? (
                  <View style={{ marginBottom: 30, alignItems: "center" }}>
                    <CustomFont
                      style={{
                        color: "#473E69",
                        fontSize: 18,
                        fontWeight: "bold"
                      }}
                    >
                      Escoge tu tarjeta
                    </CustomFont>
                  </View>
                ) : (
                  <View style={{ width: "100%", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{ width: "95%" }}
                      onPress={this.addCard}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          width: "100%",
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 6
                        }}
                      >
                        <CustomFont style={{ color: "#473E69", fontSize: 16 }}>
                          Agregar tarjeta
                        </CustomFont>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                <View>
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <Carousel
                      ref={"card"}
                      data={cards}
                      renderItem={this.card}
                      itemWidth={260}
                      sliderWidth={width}
                      enableMomentum
                    />
                  </View>
                </View>
              </View>
              {cards[0] && (
                <View style={{ width: "100%", alignItems: "center" }}>
                  <SpinnerButton
                    buttonStyle={{
                      backgroundColor: "#473E69",
                      width: width * 0.9,
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6
                    }}
                    isLoading={this.state.defaultLoading}
                    onPress={() => {
                      this.submit();
                    }}
                    spinnerType="PulseIndicator"
                    indicatorCount={10}
                  >
                    <CustomFont
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold"
                      }}
                    >
                      COMPRAR
                    </CustomFont>
                  </SpinnerButton>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </React.Fragment>
    );
  }
}

export default index;

const styles = StyleSheet.create({
  fill: {
    width,
    height: HEADER_MIN_HEIGHT
  },
  modal: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10
  }
});
