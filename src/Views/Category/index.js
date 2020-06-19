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
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  FlatList
} from "react-native";
import {
  IndicatorViewPager,
  PagerTitleIndicator
} from "../../components/RnViewpager";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import LinearGradient from "react-native-linear-gradient";
import {
  InstantSearch,
  Configure,
  connectHits,
  connectStateResults
} from "react-instantsearch-native";
import { top_choices, banners } from "../../feathers";
import Ticket from "../../components/Ticket";
import { ALGOLIA } from "../../utils/data";
import { pageView, viewNow } from "../../utils/mixpanel";
import CustomFont from "../../components/CustomFont/index";
import { getEstablishmentBanner } from "../../utils/S3Photos";
import moment from "moment";
import RenderCarousel from "../../components/Carousel/RenderCarousel";
import TopChoiceCard from "../../components/Cards/TopChoiceCard";
import BannerCard from "../../components/Cards/BannerCard";
import TabBar from "../../components/TabBar/TabBar";
import Base from "../../components/Base";
import WrapperAlgolia, { searchClient } from "../../components/WrapperAlgolia";

const { width, height } = Dimensions.get("window");
const HEADER_MAX_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 60 : 50;
const HEADER_MIN_HEIGHT = 50;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Loading = connectStateResults(({ searching }) =>
  searching ? <ActivityIndicator color="#0000ff" /> : null
);
const NoResults = connectStateResults(({ searchResults, searching, text }) => {
  if (!searching && searchResults && searchResults.nbHits == 0)
    return (
      <View>
        <Text>{text}</Text>
        <Text>¡Vuelve Pronto!</Text>
      </View>
    );
  return null;
});
const CustomHitsBenefits = connectHits(
  ({ hits, onTap, componentId, user = {}, cityName, catName, setHits }) => {
    setHits(hits);

    onPress = hit => {
      alert(JSON.stringify([hit, componentId]));
      Navigation.push(componentId, {
        component: {
          name: "establishmentBenefits",
          passProps: {
            id: hit.id
          }
        }
      });
    };
    return (
      <View>
        <Loading />
        <NoResults text="Pronto encontrarás los mejores beneficios en esta categoría" />
        {hits.map(
          ({
            icon,
            name,
            establishment,
            date_end,
            people_benefit,
            id,
            qty,
            delivery,
            price,
            discount,
            ...rest
          }) => (
            <Ticket
              key={id}
              id={id}
              image={(establishment || {}).logo}
              name={name}
              date={date_end}
              qty={qty}
              delivery={delivery}
              price={price}
              discount={discount}
              onClick={() => onTap(id)}
              alt
            />
          )
        )}
      </View>
    );
  }
);
const CustomHitsEstablishments = connectHits(
  ({ hits, navigator, fetchMerchant, cityName, catName, componentId }) => {
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

    // console.log({ hits });

    return (
      <View style={{ width: "100%", marginTop: 10 }}>
        <Loading />
        <NoResults text="Pronto encontrarás los mejores comercios en esta categoría" />
        {/* {hits.map((hit, index) =>
        <Establishment hit={hit} key={hit.objectID} onPress={onPress} />
      )} */}
        {hits.map(hit => (
          <View key={hit.objectID} style={{ alignItems: "center" }}>
            <TouchableWithoutFeedback onPress={() => onPress(hit)}>
              <View
                style={[
                  {
                    height: 98,
                    width: 340,
                    marginBottom: 12,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    position: "relative"
                  },
                  styles.showN
                ]}
              >
                <View
                  style={[
                    {
                      height: 72,
                      width: 72,
                      position: "absolute",
                      top: 12,
                      left: 18,
                      borderRadius: 100,
                      backgroundColor: "black",
                      zIndex: 20,
                      overflow: "hidden"
                    },
                    styles.showN
                  ]}
                >
                  <Image
                    source={{ uri: hit.round_logo }}
                    style={{ flex: 1, resizeMode: "contain" }}
                  />
                </View>
                <ImageBackground
                  source={{
                    uri: hit.banner ? getEstablishmentBanner(hit.banner) : ""
                  }}
                  style={{
                    height: 98,
                    width: 268,
                    backgroundColor: "white",
                    position: "absolute",
                    right: 18,
                    borderRadius: 9,
                    overflow: "hidden"
                  }}
                >
                  <View
                    style={{
                      height: 98,
                      width: 268,
                      backgroundColor: "rgba(0, 0, 0, .6)",
                      alignItems: "flex-end"
                    }}
                  >
                    <View
                      style={{
                        height: 98,
                        width: 268 - 36,
                        padding: 12,
                        justifyContent: "center"
                      }}
                    >
                      <CustomFont
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontWeight: "bold"
                        }}
                      >
                        {hit.name}
                      </CustomFont>
                      {/*<View
                        style={{
                          width: "100%",
                          height: 54,
                          overflow: "hidden"
                        }}
                      >
                        <CustomFont style={{ color: "white" }}>
                          {hit.schedule}
                        </CustomFont>
                      </View>*/}
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ))}
      </View>
    );
  }
);

class SubCategories extends Base {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      language: "",
      selected: 0,
      filter: "",
      filtered: false,
      sliders: {},
      index: 0
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

  gotoBenefits = id => {
    Navigation.push(this.props.componentId, {
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
  componentDidMount() {
    const { parent_name, parent_id } = this.props;
    pageView("category", {
      title: parent_name
    });
    viewNow("category", parent_id);
    const benefits = searchClient.initIndex("benefits");
    benefits
      .search("", {
        attributeForDistinct: "establishment_id",
        distinct: 1
      })
      .then(res => console.info("res_>", res)).catch(err=>);
  }

  componentWillMount() {
    this.fetch_conex("banners").then(res => {
      this.setState({ sliders: { banners: res, ...this.state.sliders } });
    });

    this.fetch_conex("top-choices").then(res => {
      this.setState({ sliders: { top_choices: res, ...this.state.sliders } });
    });
  }

  fetch_conex = url => {
    return new Promise(async (resolve, reject) => {
      let res;
      const date = moment().format("YYYY[-]MM[-]DD");
      url == "banners" &&
        (res = await banners.find({
          query: {
            active: 1,
            date_exp: {
              $gt: date
            }
          }
        }));
      url == "top-choices" &&
        (res = await top_choices.find({ query: { active: 1 } }));
      console.log(res);
      resolve(res);
    });
  };

  seeMoreTopChoices = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.topChoices",
        passProps: {},
        options: {
          topBar: {
            rightButtons: [],
            drawBehind: true,
            background: {
              color: "transparent"
            },
            backButton: {
              icon: require("../../assets/iconsX/backArrow.png"),
              color: "black"
            }
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

  setHits = hits => {
    const ids = hits.map(el => `id = ${el.establishment_id}`);
    if (!ids[0] || this.state.filtered) return;
    const filter = ids.join(" OR ");
    this.setState({ filter, filtered: true });
  };

  banners_im() {
    return (
      <View style={{ height: 233, marginBottom: 15 }}>
        <RenderCarousel
          pagStyle={{ position: "absolute", bottom: 0, alignSelf: "center" }}
          carouselHeight={233}
          carouselItems={
            this.state.sliders.top_choices
              ? [...this.state.sliders.banners.data]
              : []
          }
          RenderItem={({ item }) => (
            <BannerCard
              {...item}
              componentId={this.props.componentId}
              height={233}
            />
          )}
        />
      </View>
    );
  }

  news() {
    return (
      <WrapperAlgolia
        keys={{
          query: "",
          index: "benefits",
          hitsPerPage: 10,
          attributeForDistinct: "establishment_id",
          distinct: 1
        }}
        index={"benefits"}
        Item={({ hits }) => {
          console.info("news", hits);
          return <View></View>;
        }}
      />
    );
  }

  componentList = {
    1: this.renderBenefits,
    0: this.renderEstablishments
  };

  top_chioces() {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            marginBottom: 15
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color: "#453E6A",
                fontSize: 18,
                fontWeight: "bold",
                marginRight: 5
              }}
            >
              TOP CHOICES
            </Text>
            <Image
              style={{ height: 18, width: 22 }}
              source={require("../../assets/img/crown.png")}
            />
          </View>

          <CustomFont
            onPress={this.seeMoreTopChoices}
            style={{ marginLeft: "auto", color: "#453E6A" }}
          >
            Ver todos >
          </CustomFont>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={
            this.state.sliders.top_choices
              ? [...this.state.sliders.top_choices.data]
              : []
          }
          contentContainerStyle={{ paddingLeft: 10 }}
          keyExtractor={(item, index) => `list-item-${index}`}
          renderItem={({ item }) => (
            <TopChoiceCard {...item} componentId={this.props.componentId} />
          )}
        />
      </View>
    );
  }

  renderEstablishments() {
    const { selected, filter } = this.state;
    const { category = {}, user, parent_id } = this.props;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const timestamp = startOfDay / 1000;
    return (
      <InstantSearch
        appId={ALGOLIA.APP_ID}
        apiKey={ALGOLIA.API_KEY}
        indexName={ALGOLIA.ESTABLISHMENTS}
      >
        <View style={{}}>
          <View
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.clubs}
          >
            <Configure
              facets={["category_id", "city_id"]}
              facetFilters={[`city_id:${user.city_id}`]}
              // filters={`unix_date_end >= ${timestamp} AND unix_date_start <= ${timestamp}`}
              filters={`categories:${parent_id} AND active= ${1}`}
              hitsPerPage={1000}
            />
            <CustomHitsEstablishments
              componentId={this.props.componentId}
              fetchMerchant={{}}
              cityName={"cityName"}
              catName={category.name}
            />
          </View>
        </View>
      </InstantSearch>
    );
  }

  renderBenefits() {
    const { selected, filter } = this.state;
    const { category = {}, user, parent_id } = this.props;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const timestamp = startOfDay / 1000;
    return (
      <InstantSearch
        appId={ALGOLIA.APP_ID}
        apiKey={ALGOLIA.API_KEY}
        indexName={ALGOLIA.BENEFITS}
      >
        <View style={{ height: "100%" }}>
          <View
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={[styles.clubs]}
          >
            <Configure
              hitsPerPage={1000}
              facets={["category_id", "establishment.city_id"]}
              facetFilters={[
                `category_id:${parent_id}`,
                `establishment.city_id:${user.city_id}`
              ]}
              filters={`unix_date_end >= ${timestamp} AND unix_date_start <= ${timestamp} AND active = 1`}
            />
            <CustomHitsBenefits
              onTap={this.gotoBenefits}
              componentId={this.props.componentId}
              user={{}}
              benefits={{}}
              cityName={"cityName"}
              catName={"category"}
              setHits={this.setHits}
            />
          </View>
        </View>
      </InstantSearch>
    );
  }

  renderScrollViewContent() {
    const { selected, filter } = this.state;
    const { category = {}, user, parent_id } = this.props;
    const tabs = [
      { key: "0", title: "COMERCIOS" },
      { key: "1", title: "BENEFICIOS" }
    ];

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const timestamp = startOfDay / 1000;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {this.banners_im()}
        {this.top_chioces()}
        {this.news()}
        <View style={{ marginTop: 20 }}>
          <TabBar
            selected={this.state.index}
            itemStyle={{ width: width / 2, textAlign: "center" }}
            tabs={tabs}
            onSelect={(index, item) => {
              this.setState({ ...this.state, index });
            }}
          />
        </View>

        {this.state.index === 0
          ? this.renderEstablishments()
          : this.renderBenefits()}
      </ScrollView>
    );
  }

  render() {
    const { cities } = this.props;
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
        <View
          style={[styles.scrollView]}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
        >
          {this.renderScrollViewContent()}
        </View>
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <ImageBackground style={{ flex: 1 }}>
            <LinearGradient
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 1.0, y: 0.8 }}
              colors={["#473E69", "#249EC7"]}
              style={styles.headerGradient}
            />
          </ImageBackground>
        </Animated.View>
      </View>
    );
  }
  _renderTabIndicator() {
    const titles = ["Comercios", "Beneficios"];
    return (
      <PagerTitleIndicator
        titles={titles}
        itemStyle={{ width: width / 2 }}
        selectedItemStyle={{ width: width / 2 }}
        color={true}
      />
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
    backgroundColor: "#473E69",
    overflow: "hidden",
    zIndex: 0
  },
  headerGradient: {
    // flex: 1,
    opacity: 0.7
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
    top: 0,
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
    // flex: 1,
    marginTop: HEADER_MAX_HEIGHT - 70,
    width,
    height: "100%",
    flexDirection: "column-reverse"
    // justifyContent: 'space-between',
    // flexWrap: 'wrap',
  },
  scrollView: {
    marginTop:
      getStatusBarHeight() > 40
        ? HEADER_MAX_HEIGHT + 20
        : HEADER_MIN_HEIGHT + 20,
    zIndex: 1
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
    paddingTop: 10,
    flex: 1,
    width,
    paddingHorizontal: 25
  },
  headerButtons: {
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
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
  showN: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  }
});

const mapStateToProps = state => state;
export default connect(mapStateToProps)(SubCategories);
