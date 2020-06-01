import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  ImageBackground,
  StatusBar
} from "react-native";
import { Navigation } from "react-native-navigation";
import {
  connectHits,
  InstantSearch,
  Configure
} from "react-instantsearch-native";
import { favoriteEstablishments, establishments } from "../../feathers";
import { getUser } from "../../utils/sessionUser";
import Base from "../../components/Base";
import Ticket from "../../components/Ticket";
import { connect } from "react-redux";
import { ALGOLIA } from "../../utils/data";
import {
  pageView,
  favoriteUnfollow,
  favoriteFollow,
  viewNow
} from "../../utils/mixpanel";
import MiniOfflineSign from "../../components/MiniOfflineSign";
const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 260;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 10;

const CustomHits = connectHits(({ hits, componentId, logo }) => {
  console.log("establishment hits", hits);
  const onPress = id => {
    Navigation.push(componentId, {
      component: {
        name: "app.establishmentBenefits",
        passProps: {
          id
        },
        options: {
          topBar: {
            backButton: {
              icon: require("../../assets/iconsX/backArrow.png"),
              color: "white"
            },
            elevation: 0
          },
          sideMenu: {
            left: {
              visible: false,
              enabled: false
            }
          }
        }
      }
    });
  };
  return (
    <View style={{ alignItems: "center", width }}>
      {hits.map(({ id, name, date_end, qty }, index) => (
        <Ticket
          key={id}
          id={id}
          image={logo}
          name={name}
          date={date_end}
          qty={qty}
          onClick={() => onPress(id)}
          alt
        />
      ))}
    </View>
  );
});

class Home extends Base {
  static options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: "walletBtn",
            icon: require("../../assets/iconsX/wallet.png"),
            color: "white"
          }
        ],
        title: {
          text: "",
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
        elevation: 0
      },
      sideMenu: {
        left: {
          visible: false,
          enabled: false
        }
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      flatListRef: {},
      mixPanelFirst: true,
      isFavorite: false,
      userId: null,
      id: null,
      establishment: {}
    };
  }

  async componentDidMount() {
    const userJsonString = await getUser();
    let { dynamic_id, merchant } = this.props;
    console.log({ merchant, dynamic_id });
    dynamic_id ? merchant = await establishments.get(dynamic_id) : null;
    const establishmentId = dynamic_id ? dynamic_id : merchant.id;
    this.setState({
      ...this.state,
      establishment: merchant
    });
    const { id } = JSON.parse(userJsonString);
    const { data } = await favoriteEstablishments.find({
      query: { user_id: id, establishment_id: establishmentId }
    });

    const isFavorite = data[0] ? true : false;
    if (data[0]) {
      this.setState({ favID: data[0].id });
    }
    this.setState({ userId: id, id: establishmentId, isFavorite });
    console.log({ userId: id, id: establishmentId, isFavorite });
    const est = await establishments.get(establishmentId);
    pageView("establishment", {
      title: est.name,
      ...est
    });
    viewNow("establishment", est.id);
    this.setState({
      establishment: midi
    });
  }
  toggleFav = async midi => {
    const { userId, id, isFavorite, establishment } = this.state;
    console.log("toggleFav", userId, id, isFavorite, establishment);
    let establishmentPrefix = {};
    Object.keys(establishment).map(key => {
      establishmentPrefix = {
        ...establishmentPrefix,
        [`establishment_${key}`]: establishment[key]
      };
    });
    try {
      if (isFavorite) {
        favoriteUnfollow(establishmentPrefix);
        this.setState({ isFavorite: false });
        await favoriteEstablishments.remove(this.state.favID);
        this.componentDidMount();
      } else {
        favoriteFollow(establishmentPrefix);
        this.setState({ isFavorite: true });
        await favoriteEstablishments.create({
          user_id: userId,
          establishment_id: id
        });
      }
    } catch (error) {
      console.log("ERR: -----<<>", error.message);
    }
  };

  getItemLayout = (data, index) => ({
    length: 235,
    offset: 235 * index,
    index
  });

  renderScrollViewContent() {
    const { establishment } = this.state;
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const timestamp = startOfDay / 1000;
    return (
      <View style={styles.scrollViewContent}>
        <Text style={[styles.title, { fontFamily: "Poppins-Light" }]}>
          {/* Beneficios */}
        </Text>
        <InstantSearch
          appId={ALGOLIA.APP_ID}
          apiKey={ALGOLIA.API_KEY}
          indexName="benefits"
        >
          <Configure
            filters={`active = 1`}
            facets={[`establishment.id`]}
            facetFilters={[`establishment.id:${establishment.id}`]}
            filters={`unix_date_end >= ${timestamp} AND unix_date_start <= ${timestamp} AND active = 1`}
          />
          <CustomHits
            componentId={this.props.componentId}
            logo={establishment.logo}
          />
        </InstantSearch>
      </View>
    );
  }

  render() {
    const { merchant: rawMerchant, toggleFavorite, dynamic_id } = this.props;
    const { isFavorite, establishment } = this.state;
    const merchant = dynamic_id ? establishment : rawMerchant;
    console.log("el comercio", dynamic_id);

    const AnimatedImageBackground = Animated.createAnimatedComponent(
      ImageBackground
    );
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    });
    const imageScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1.3],
      extrapolate: "clamp"
    });
    const logoDimensions = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [85, 0],
      extrapolate: "clamp"
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE - 80],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    const height = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE - 80],
      outputRange: [60, 0],
      extrapolate: "clamp"
    });
    const fontSize = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE - 80],
      outputRange: [24, 14],
      extrapolate: "clamp"
    });
    const backgroundColor = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: ["rgba(0, 0, 0, .5)", "rgba(0, 0, 0, .75)"],
      extrapolate: "clamp"
    });
    const marginTop = this.state.scrollY.interpolate({
      inputRange: [0, 30],
      outputRange: ["rgba(0, 0, 0, .5)", "rgba(0, 0, 0, .75)"],
      extrapolate: "clamp"
    });
    return (
      <View style={[styles.fill, styles.bodyBackground]}>
        <Animated.View
          style={{
            zIndex: 10000,
            position: "absolute",
            top: HEADER_MAX_HEIGHT - 60,
            width,
            height,
            alignItems: "center",
            opacity,
            overflow: "hidden"
          }}
        >
          <TouchableWithoutFeedback onPress={() => this.toggleFav(merchant.id)}>
            <View
              style={{
                marginTop: 10,
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 100,
                paddingVertical: 4,
                paddingHorizontal: 20
              }}
            >
              <Text
                style={[
                  { color: "white", textAlign: "center" },
                  { fontFamily: "Poppins-Light" }
                ]}
              >
                {isFavorite ? "Favorito" : "Agregar a favoritos"}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={[styles.scrollView]}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
        >
          {this.renderScrollViewContent()}
        </ScrollView>
        <View
          style={{
            zIndex: 100,
            position: "absolute",
            top: 150,
            width,
            alignItems: "center"
          }}
        />
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <AnimatedImageBackground
            style={[
              styles.fill,
              { transform: [{ scaleX: imageScale }, { scaleY: imageScale }] }
            ]}
            source={{ uri: merchant.banner || "" }}
          >
            <Animated.View
              style={[{ backgroundColor }, styles.fill, styles.headerContent]}
            >
              <Animated.View
                style={[
                  styles.logo,
                  { height: logoDimensions, width: logoDimensions }
                ]}
              >
                {/* <Image source={{ uri : merchant.logo }} style={[styles.fill, { resizeMode: 'contain' }]} /> */}
              </Animated.View>
              <Animated.View style={{ position: "relative" }}>
                <Animated.Text
                  style={[
                    {
                      color: "white",
                      fontSize,
                      textAlign: "center",
                      fontFamily: "Poppins-Light"
                    }
                  ]}
                >
                  {merchant.name}
                </Animated.Text>
              </Animated.View>
              <Animated.View style={{ opacity }}>
                <Text
                  style={[
                    { color: "white", textAlign: "center" },
                    { fontFamily: "Poppins-Light" }
                  ]}
                >
                  {merchant.schedule}
                </Text>
              </Animated.View>
            </Animated.View>
          </AnimatedImageBackground>
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
    height: 115,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 10,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    overflow: "hidden"
  },
  rowText: {
    color: "white",
    fontSize: 24,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    overflow: "hidden",
    zIndex: 0
  },
  title: {
    color: "#50E0B4",
    fontSize: 18,
    fontFamily: "Poppins-Light",
    width,
    textAlign: "center",
    marginTop: 25,
    marginBottom: 10
  },
  scrollViewContent: {
    marginTop: HEADER_SCROLL_DISTANCE
  },
  scrollView: {
    marginTop: HEADER_MIN_HEIGHT,
    zIndex: 1
  },
  headerContent: {
    paddingTop: 25,
    alignItems: "center"
  },
  logo: {
    borderRadius: 100,
    overflow: "hidden",
    padding: 5
  },
  popularBenefit: {
    width: width * 0.7,
    height: 110,
    backgroundColor: "white",
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 10,
    padding: 15,
    paddingTop: 5
  },
  avalibleBenefits: {
    fontSize: 8,
    fontFamily: "Poppins-Light",
    color: "#50E0B4"
  }
});

export default connect()(Home);
