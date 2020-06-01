import React, { Fragment } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import CustomFont from "../../components/CustomFont";
import Carousel from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import {
  InstantSearch,
  Configure,
  connectHits,
  connectStateResults
} from "react-instantsearch-native";
import Base from "../../components/Base";
import Ticket from "../../components/Ticket";
import AlgoliaEstablishments from "../../components/AlgoliaEstablishments";
import { ALGOLIA } from "../../utils/data";
import { pageView } from "../../utils/mixpanel";

const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 175;
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Loading = connectStateResults(({ searching }) =>
  searching ? <ActivityIndicator color="#0000ff" /> : null
);

const NoResults = connectStateResults(({ searchResults, searching }) => {
  if (!searching && searchResults && searchResults.nbHits == 0)
    return <Text>No hay resultados</Text>;
  return null;
});

const CustomHitsBenefits = connectHits(({ hits, componentId }) => {
  const onPress = id => {
    Navigation.push(componentId, {
      component: {
        name: "app.establishmentBenefits",
        passProps: {
          id
        },
        options: {
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
    <Fragment>
      <Text
        style={[
          {
            width: "100%",
            color: "#473E69",
            fontSize: 18,
            paddingVertical: 15
          },
          { fontFamily: "Poppins-Light" }
        ]}
      >
        Beneficios
      </Text>
      <Loading />
      <NoResults />
      <View>
        {hits.map(benefit => {
          const { name, date_end, id, qty } = benefit;
          return (
            <Ticket
              key={id}
              id={id}
              image={benefit.establishment.logo || ""}
              name={name}
              date={date_end}
              qty={qty}
              onClick={() => onPress(id)}
              alt
            />
          );
        })}
      </View>
    </Fragment>
  );
});

const CustomHitsEstablishments = connectHits(({ hits, componentId }) => {
  const onPress = merchant => {
    Navigation.push(componentId, {
      component: {
        name: "app.establishment",
        passProps: {
          merchant
        }
      }
    });
  };
  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        key={index}
        style={{ paddingHorizontal: 7 }}
      >
        <AlgoliaEstablishments name={item.name} logo={item.round_logo} />
      </TouchableOpacity>
    );
  };
  let hitIndex = 0;
  if (hits.length > 4) hitIndex = 2;
  else if (hits.length > 2) hitIndex = 1;
  return (
    <Fragment>
      <Text
        style={[
          {
            width: "100%",
            color: "#473E69",
            fontSize: 18,
            paddingVertical: 15,
            fontFamily: "Poppins-Light"
          }
        ]}
      >
        Comercios
      </Text>
      <Loading />
      <NoResults />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%"
        }}
      >
        {hits[0] && (
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={hits}
            renderItem={_renderItem}
            itemWidth={78}
            sliderWidth={width - 50}
            enableMomentum
            firstItem={hitIndex}
          />
        )}
      </View>
    </Fragment>
  );
});
class SubCategories extends Base {
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
          color: "transparent",
          component: {
            name: "app.searchForView",
            alignment: "center"
          }
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
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      language: "",
      selected: 0,
      query: "",
      searchFocussearchFocus: true,
      algoliaBenefits: true,
      algoliaEstablishments: true,
      first: true
    };
  }

  renderScrollViewContent() {
    const { search, user } = this.props;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const timestamp = startOfDay / 1000;
    console.log("le timestamp", timestamp);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <InstantSearch
            appId={ALGOLIA.APP_ID}
            apiKey={ALGOLIA.API_KEY}
            indexName={ALGOLIA.ESTABLISHMENTS}
          >
            <Configure
              query={search.text}
              facets={["city_id"]}
              hitsPerPage={1000}
              facetFilters={[`city_id:${user.city_id}`]}
            />
            <View style={[{ width }]}>
              <View style={[styles.clubs]}>
                <CustomHitsEstablishments
                  first={this.state.first}
                  componentId={this.props.componentId}
                  cityName={"cityName"}
                />
              </View>
            </View>
          </InstantSearch>
          <InstantSearch
            appId={ALGOLIA.APP_ID}
            apiKey={ALGOLIA.API_KEY}
            indexName={ALGOLIA.BENEFITS}
          >
            <Configure
              query={search.text}
              hitsPerPage={1000}
              facets={["establishment.city_id"]}
              facetFilters={[`establishment.city_id:${user.city_id}`]}
              filters={`unix_date_end >= ${timestamp} AND unix_date_start <= ${timestamp}`}
            />
            <View style={[styles.clubs]}>
              <CustomHitsBenefits
                componentId={this.props.componentId}
                cityName={"cityName"}
              />
            </View>
          </InstantSearch>
        </ScrollView>
      </View>
    );
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "UPDATE_SEARCH_TEXT", text: "" });
    pageView("search");
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
        {this.renderScrollViewContent()}
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
    backgroundColor: "#03A9F4",
    overflow: "hidden",
    zIndex: 0
  },
  headerGradient: {
    width,
    height: HEADER_MIN_HEIGHT,
    alignItems: "center"
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
    flexWrap: "wrap",
    position: "absolute",
    width: width * 0.7,
    left: width * 0.15,
    top: 60,
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
    marginTop: 100,
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
    // flex: 1,
    marginTop: HEADER_MAX_HEIGHT - 50,
    width,
    // height,
    flex: 1,
    flexDirection: "column-reverse",
    zIndex: 100
    // backgroundColor: 'red',
    // justifyContent: 'space-between',
    // flexWrap: 'wrap',
  },
  scrollView: {
    marginTop: HEADER_MIN_HEIGHT,
    zIndex: 1
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
  },
  clubs: {
    width,
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  headerButtons: {
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    justifyContent: "space-around",
    alignItems: "center"
  },
  headerButton: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 1
  },
  headerButtonSelected: {
    backgroundColor: "rgba(255, 255, 255, .5)",
    borderWidth: 0
  },
  headerButtonText: {
    fontSize: 18,
    color: "white"
  },
  headerSearch: {
    height: 26,
    width: "100%",
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
    paddingVertical: 0
    // width: '100%',
  }
});
const mapStateToProps = state => state;
export default connect(mapStateToProps)(SubCategories);
