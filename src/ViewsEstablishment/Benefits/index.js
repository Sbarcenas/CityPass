import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import "moment/min/locales";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  IndicatorViewPager,
  PagerTitleIndicator
} from "../../components/RnViewpager";
import { Navigation } from "react-native-navigation";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import CustomFont from "../../components/CustomFont/index";
import Ticket from "../../components/Ticket";
import { benefits, current } from "../../feathers";
import { Toaster } from "../../utils/toaster";
import { getAvatarPhoto } from "../../utils/S3Photos";
moment.locale("es");
const { width, height } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

const DAY_MS = 24 * 60 * 60 * 1000;
class Hub extends Base {
  state = {
    activeBenefits: [],
    otherBenefits: []
  };
  static options() {
    return {
      topBar: {
        drawBehind: true,
        background: {
          color: "transparent"
        },
        title: {
          text: "Beneficios",
          color: "white"
        },
        leftButtons: [],
        rightButtons: [
          {
            id: "benefitForm",
            icon: require("../../assets/iconsX/plus.png"),
            color: "white"
          }
        ]
      }
    };
  }
  async componentDidMount() {
    const date = moment().format("YYYY[-]MM[-]DD");
    console.log("-----<<>", date);
    this.fetchBenefits("activeBenefits", {
      date_end: {
        $gt: date
      }
    });
    this.fetchBenefits("otherBenefits", {
      date_end: {
        $lte: date
      }
    });
  }

  fetchBenefits = async (targetKey, extra = {}) => {
    const { data } = await benefits.find({
      query: {
        $limit: 10000,
        $sort: { date_end: 1 },
        ...extra,
        $client: { user_stablishment: "true" }
      }
    });

    this.setState({
      [targetKey]: data
    });
  };
  disableBenefit = async (id, val) => {
    try {
      await benefits.patch(id, { active: val == 0 ? 1 : 0 });
      this.componentDidMount();
    } catch ({ message }) {
      Toaster({ type: "error", text: message });
    }
  };
  editBenefit = async benefit => {
    Navigation.push(this.props.componentId, {
      component: {
        name: "app.benefitForm",
        passProps: {
          id: benefit.id,
          benefit
        },
        options: {
          topBar: {
            title: {
              text: "Editar Beneficio"
            },
            drawBehind: true,
            background: {
              color: "transparent"
            }
          }
        }
      }
    });
  };
  render() {
    const { activeBenefits, otherBenefits } = this.state;
    console.log("BENEFITS", activeBenefits);
    return (
      <View style={[styles.fill, styles.bodyBackground]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 1.0, y: 0.8 }}
          colors={["#473E69", "#249EC7"]}
          style={styles.headerGradient}
        />
        <View style={[styles.fill, { overflow: "hidden" }]}>
          <IndicatorViewPager
            indicator={this._renderTabIndicator()}
            style={styles.scrollViewContent}>
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={activeBenefits}
                keyExtractor={(_, index) => `item-${index}`}
                // onEndReached={() => this.fetchMoreBenefits(myBenefits[0])}
                // onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                  <Ticket
                    id={item.id}
                    benefit_id={item.benefit_id}
                    image={getAvatarPhoto(item.image, true)}
                    name={item.name}
                    date={item.date_end}
                    qty={item.qty_user}
                    onClick={this.goToRedeem}
                    onClick2={this.editBenefit}
                    qr={item.token}
                    el={item}
                    disable={this.disableBenefit}
                    admin
                  />
                )}
              />
            </View>
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ alignItems: "center" }}>
                {otherBenefits.map((el, index) => (
                  <Ticket
                    key={index}
                    id={el.benefit_id}
                    image={el.establishment.logo}
                    name={el.name}
                    date={el.date_end}
                    qty={el.qty_user}
                    done={el.status}
                    qr={el.token}
                    admin
                    noButtons
                  />
                ))}
              </ScrollView>
            </View>
          </IndicatorViewPager>
        </View>
      </View>
    );
  }
  _renderTabIndicator() {
    const titles = ["Activos", "Otros"]; // HACE FALTA EL HISTORIAL
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
    fontSize: 24
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 3
  },
  scrollViewContent: {
    flex: 1,
    marginTop: HEADER_MAX_HEIGHT - 174,
    width,
    minHeight: height - HEADER_MAX_HEIGHT,
    flexDirection: "column-reverse"
    // justifyContent: 'space-between',
    // flexWrap: 'wrap',
    // marginTop: HEADER_MIN_HEIGHT,
  }
});

export default connect()(Hub);
