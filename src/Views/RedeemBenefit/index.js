import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Alert
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import NetInfo from "@react-native-community/netinfo";
import Base from "../../components/Base";
import { getStatusBarHeight } from "react-native-status-bar-height";
import RedeemBenefit from "../../components/RedeemBenefit";
import { connect } from "react-redux";
import { usersBenefits, establishments, users } from "../../feathers";
import { pageView } from "../../utils/mixpanel";
import { Toaster } from "../../utils/toaster";
import Realm from "../../modules/realm";

const MARGIN_TOP =
  getStatusBarHeight() > 40 ? 60 : getStatusBarHeight(true) != 0 ? 30 : 20;

class MerchantBenefits extends Base {
  state = {
    data: {},
    loading: true
  };
  static options() {
    return {
      topBar: {
        rightButtons: [],
        title: {
          text: "",
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

  fetchInRealm = async () => {
    const realm = await Realm;
    const { id } = this.props;
    try {
      let benefit = realm.objects("Benefits").filtered("id = $0", id);

      /*   Alert.alert(
        "fetch in realm",
        JSON.stringify({
          nano_id: benefit[0].nanoId,
          logo: benefit[0].logo,
          date_end: benefit[0].dateEnd,
          image: benefit[0].image,
          terms: benefit[0].terms,
          name: benefit[0].name,
          description: benefit[0].description
        })
      );*/

      this.setState({
        data: {
          nano_id: benefit[0].nanoId,
          logo: benefit[0].logo,
          date_end: benefit[0].dateEnd,
          image: benefit[0].image,
          terms: benefit[0].terms,
          name: benefit[0].name,
          description: benefit[0].description
        },
        loading: false
      });
    } catch (e) {
      console.log(e.message);
      // Alert.alert("error", e.message);
    }
  };

  async componentDidMount() {
    const { type, isConnected } = await NetInfo.fetch();

    if (!isConnected) {
      await this.fetchInRealm();
      return;
    }

    try {
      const { id } = this.props;
      const data = await usersBenefits.get(id, {
        query: { $client: { all_establishment: "true" } }
      });

      const user_information = await users.get(data.user_id);

      const { round_logo } = await establishments.get(data.establishment_id);
      const old = JSON.parse(data.old_data_benefit);
      pageView("redeem benefit", {
        ...old,
        category_name: old.categories.name,
        establishment_name: old.establishment.name,
        establishment_city_id: old.establishment.city_id,
        establishment_quantity_favorites: old.establishment.quantity_favorites
      });
      console.log("wallet benefit ->>", data);
      console.log(JSON.parse(data.old_data_benefit));
      this.setState({
        data: {
          ...JSON.parse(data.old_data_benefit),
          nano_id: data.nano_id,
          logo: round_logo,
          first_name: user_information.first_name,
          last_name: user_information.last_name
        },
        loading: false
      });
    } catch (error) {
      this.fetchInRealm();
      // Toaster({ type: "error", title: "Revisa tu conexión de internet" });
      // Toaster({ type: "error", title: error.message });
    }
  }

  render() {
    const { data, loading } = this.state;
    return (
      <View style={[styles.fill]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1.0, y: 1.0 }}
          colors={["#473E69", "#249EC7"]}
          style={[styles.fill, styles.center]}
        >
          <View style={[styles.fill, { marginTop: MARGIN_TOP }]}>
            {loading ? (
              <View style={{ marginTop: 100 }}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <RedeemBenefit qr={data.nano_id} data={data} />
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
  },
  center: {
    paddingTop: 20,
    alignItems: "center"
  }
});

export default connect()(MerchantBenefits);
