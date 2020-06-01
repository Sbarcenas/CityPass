import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
  FlatList,
  Alert
} from "react-native";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import {
  IndicatorViewPager,
  PagerTitleIndicator
} from "../../components/RnViewpager";
import moment from "moment";
import "moment/min/locales";
// import { IndicatorViewPager, PagerTitleIndicator } from 'rn-viewpager';
import LinearGradient from "react-native-linear-gradient";
import NetInfo from "@react-native-community/netinfo";
import { ifIphoneX } from "react-native-iphone-x-helper";
import Ticket from "../../components/Ticket";
import { usersBenefits, benefits } from "../../feathers";
import { closeWallet } from "../../utils/openWallet";
import { pageView } from "../../utils/mixpanel";
import { socket } from "../../feathers/conf";
import { Toaster } from "../../utils/toaster";
import Realm from "../../modules/realm";
import {
  fetchAndSaveInRealmBenefits,
  setBenefits
} from "../../actions/wallet.actions";
import WalletChild from "./walletChild";

moment.locale("es");

const { width, height } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const DAY_MS = 24 * 60 * 60 * 1000;
let page = 1;

class SubCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      mounted: false,
      isLoad: false,
    };
  }

  static options() {
    return {
      topBar: {
        rightButtons: [],
        title: {
          text: "Mi Wallet",
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

  async componentDidMount() {
    setTimeout(()=>{
      this.setState({
        isLoad: true,
      })
    },0)
    pageView("wallet");

  }

  //todo remove
  fetchBenefits = async (status = [], targetKey, extra = {}) => {
    const { data } = await usersBenefits.find({
      query: {
        $limit: 10000,
        status: { $in: status },
        $sort: { date_end: 1 },
        ...extra,
        $client: { all_establishment: "true" }
      }
    });

    console.log("user benefits", data);

    this.setState({
      [targetKey]: data.map(el => ({
        ...JSON.parse(el.old_data_benefit),
        redeem: el.createdAt,
        id: el.id,
        status: el.status,
        benefit_id: el.benefit_id
      }))
    });
  };

  //todo remove
  fetchMoreBenefits = (benefit = {}) => {
    const { page, lastPage } = benefit;
    const { mounted } = this.state;
    const { readMyBenefits } = this.props.benefits;
    if (lastPage > page) {
      readMyBenefits(page + 1);
    }
  };

  goToRedeem = (id, qr) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.redeemBenefit",
        passProps: { id, qr },
        options: {
          topBar: {
            backButton: {
              icon: require("../../assets/iconsX/backArrow.png"),
              color: "white"
            },
            rightButtons: [],
            drawBehind: true,
            background: {
              color: "transparent"
            }
          }
        }
      }
    });
  };

  gotoTicket = benefit => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.establishmentBenefits",
        passProps: {
          id: benefit.benefit_id,
          benefit
        },
        options: {
          topBar: {
            rightButtons: [],
            drawBehind: true,
            background: {
              color: "transparent"
            },
            backButton: {
              icon: require("../../assets/iconsX/backArrow.png"),
              color: "white"
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



  dismiss = () => {
    closeWallet(this.props.componentId);
  };

  render() {

    return (
        <LinearGradient
            start={{ x: -0.1, y: 0.25 }}
            end={{ x: 1.5, y: 1.2 }}
            colors={["#473E69", "#249EC7"]}
            style={[styles.fill, styles.bodyBackground]}
        >
          <View
              style={[
                styles.fill,
                {
                  overflow: "hidden",
                  backgroundColor: "rgba(0, 0, 0, .14)",
                  ...ifIphoneX(
                      {
                        paddingTop: 20
                      },
                      { paddingTop: 1 }
                  )
                }
              ]}
          >
            <StatusBar barStyle="light-content" />
            <View style={{ marginTop: 35, marginLeft: 10 }}>
              {/* <TouchableWithoutFeedback onPress={this.dismiss}>
              <Image source={require('../../assets/iconsX/backArrow.png')} />
            </TouchableWithoutFeedback> */}
            </View>
            {this.state.isLoad && <WalletChild componentdi = {this.props.componentId}/>}
          </View>
        </LinearGradient>
    );
  }
  _renderTabIndicator() {
    const titles = ["Beneficios", "Historial"]; // HACE FALTA EL HISTORIAL
    return (
        <PagerTitleIndicator
            titles={titles}
            itemStyle={{ width: width / 2 }}
            selectedItemStyle={{ width: width / 2 }}
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
    backgroundColor: "#03A9F4",
    overflow: "hidden",
    zIndex: 0
  },
  headerGradient: {
    flex: 1,
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
    flex: 1,
    marginTop: HEADER_MAX_HEIGHT - 100,
    width,
    minHeight: height - HEADER_MAX_HEIGHT,
    flexDirection: "column-reverse"
    // justifyContent: 'space-between',
    // flexWrap: 'wrap',
    // marginTop: HEADER_MIN_HEIGHT,
  },
  scrollView: {
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
  myBenefitsTitle: {
    color: "white",
    textAlign: "center",
    width: "100%",
    fontSize: 20,
    marginVertical: 15
  },
  favoriteBenefit: {
    width: width * 0.22,
    height: 120,
    marginVertical: 7,
    justifyContent: "space-between"
  },
  favoriteBenefitLogoCont: {
    width: width * 0.22,
    height: width * 0.22,
    backgroundColor: "white",
    borderRadius: width,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  favoriteBenefitLogo: {
    resizeMode: "contain",
    flex: 1,
    width: width * 0.22,
    height: width * 0.22
  },
  favoriteBenefitText: {
    color: "white",
    width: "100%",
    textAlign: "center"
  },
  loadingBenefitsMessage: {
    backgroundColor: "#fff",
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center"
  }
});



export default SubCategories;
