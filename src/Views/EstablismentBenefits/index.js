import React, { Component } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Navigation } from "react-native-navigation";
import Base from "../../components/Base";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BenefitPager from "../../components/BenefitPager";
import BenefitTicket from "../../components/BenefitTicket";
import {
  benefits,
  usersBenefits,
  establishments,
  current
} from "../../feathers";
import openWallet from "../../utils/openWallet";
import { Toaster } from "../../utils/toaster";
import {
  pageView,
  benefitObtain,
  benefitObtainError,
  viewNow
} from "../../utils/mixpanel";

let params;
const MARGIN_TOP =
  getStatusBarHeight() > 40 ? 80 : getStatusBarHeight(true) != 0 ? 60 : 50;
class MerchantBenefits extends Base {
  static options() {
    return {
      topBar: {
        title: {
          text: "",
          color: "white"
        },
        elevation: 0,
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
      benefit: {
        establishment: {},
        loading: false
      }
    };
  }

  gotoRedeem = id => {
    const { obteinBenefit } = this.props.benefitsM;
    obteinBenefit(id, this.props);
  };

  gotoPay = () => {
    this.props.navigator.push({
      screen: "app.becomePrime"
    });
  };

  async componentDidMount() {
    const { id, benefit, dynamic_id } = this.props;
    this.user = current.find();
    try {
      this.setState({ loading: true });
      if (benefit && !dynamic_id) {
        const s = await establishments.get(benefit.establishment.id);
        params = {
          ...benefit,
          category_name: benefit.categories.name,
          establishment_name: benefit.establishment.name,
          establishment_city_id: benefit.establishment.city_id,
          establishment_quantity_favorites:
            benefit.establishment.quantity_favorites
        };
        pageView("benefit details wallet", params);
        this.setState({
          benefit: {
            ...benefit,
            establishment: s
          },
          wallet: false,
          loading: false
        });
      } else {
        const bn = await benefits.get(id || dynamic_id);
        const s = await establishments.get(bn.establishment_id);
        params = {
          ...bn,

          category_name: bn.categories.name,
          establishment_name: bn.establishment.name,
          establishment_city_id: bn.establishment.city_id,
          establishment_quantity_favorites: bn.establishment.quantity_favorites
        };
        pageView("benefit details", params);
        viewNow("benefit_details", bn.id);
        this.setState({ benefit: bn, loading: false });
      }
    } catch (error) {
      console.log({ error });
      Navigation.pop(this.props.componentId);
      Toaster({
        type: "info",
        title: "No pudimos cargar la vista",
        text: "Tu conexión de internet esta lenta o nula"
      });
    }
  }

  buyBenefit = async () => {
    const { id } = this.props;
    console.log("benefit_id", id);
    this.setState({ loading: true });
    try {
      const res = await usersBenefits.create({ benefit_id: id });
      console.log("benefit response", res);
      Toaster({ type: "success", title: "Beneficio Obtenido" });
      benefitObtain(params);
      openWallet(this.props.componentId, { benefitID: res.id });
    } catch ({ message }) {
      benefitObtainError({ ...params, reason: message });
      Toaster({ type: "error", text: message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { benefit = { establishment: {} }, wallet, loading } = this.state;
    console.log("Le benefit ->>", benefit);
    return (
      <View style={[styles.fill]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1.0, y: 1.0 }}
          colors={["#473E69", "#249EC7"]}
          // colors={['#F8C270', '#FBAC7D']}
          style={styles.fill}
        >
          <View
            style={[
              styles.fill,
              { paddingTop: MARGIN_TOP, alignItems: "center" }
            ]}
          >
            {loading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ActivityIndicator />
              </View>
            ) : (
              <BenefitTicket
                gotoRedeem={this.props.gotoRedeem}
                gotoPay={this.props.gotoPay}
                user={{}}
                benefit={benefit}
                noQty={{}}
                merchantLogo={benefit.establishment.round_logo}
                onClick={this.buyBenefit}
                wallet={wallet}
                loading={loading}
                componentId={this.props.componentId}
              />
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },
  orangeBG: {
    backgroundColor: "orange"
  }
});

export default MerchantBenefits;
