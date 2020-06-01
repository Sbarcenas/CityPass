import React, { Component, Fragment } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import CheckBox from "react-native-check-box";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Base from "../../components/Base";
import CustomFont from "../../components/CustomFont/index";
import { CreditCardInput } from "react-native-credit-card-input";
import { current, usersCreditCards } from "../../feathers";
import { getUser } from "../../utils/sessionUser";
import { Navigation } from "react-native-navigation";
import { emitter } from "../../../";
import { Toaster } from "../../utils/toaster";
import { creditCardCreated } from "../../utils/mixpanel";
const { width, height } = Dimensions.get("window");
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;

const Input = props => (
  <View
    style={{
      width: "100%",
      borderColor: "black",
      borderBottomWidth: 0.5,
      padding: 6
    }}
  >
    <TextInput {...props} style={{ height: 40 }} />
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
          text: "Registrar tarjeta",
          color: "white"
        },
        drawBehind: true
      }
    };
  }

  state = {
    form: {}
  };

  onChange = form => this.setState({ form });
  create = async () => {
    const {
      form: { values },
      type_document,
      identification_number
    } = this.state;

    const [month, year] = values.expiry.split("/");
    console.log(month, year);
    const { id } = await current.find();
    try {
      const response = await usersCreditCards.create({
        owner_name: values.name,
        payer_id: id,
        type_document,
        identification_number,
        masked_number: values.number.replace(/ /g, ""),
        default: "false",
        exp_year: "20" + year,
        exp_month: month,
        cvv: values.cvc,
        brand: values.type
      });
      creditCardCreated({
        card_brand: values.type,
        owner_name: values.name,
        owner_document_number: identification_number,
        owner_document_type: type_document
      });
      Navigation.pop(this.props.componentId);
      emitter.emit("reloadMyCards");
    } catch (error) {
      Toaster({ type: "error", text: error.message });
    }
  };
  render() {
    const { form, type_document, identification_number } = this.state;
    console.log("form ----<<>", form);
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
            style={styles.fill}
          >
            <View style={styles.content}>
              <CreditCardInput
                labels={{
                  number: "Numero de tarjeta",
                  expiry: "Fecha",
                  cvc: "CVV",
                  name: "Nombre en la tarjeta"
                }}
                placeholders={{
                  name: ""
                }}
                requiresName
                onChange={this.onChange}
              />
              <View style={{ paddingHorizontal: 20 }}>
                <Input
                  placeholder="No. de identificación"
                  keyboardType="number-pad"
                  onChangeText={text =>
                    this.setState({ identification_number: text })
                  }
                />
              </View>
              <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={["CC", "CE", "NIT"]}
                  keyExtractor={item => item}
                  horizontal
                  renderItem={({ item }) => (
                    <CheckBox
                      onClick={() => this.setState({ type_document: item })}
                      isChecked={this.state.type_document == item}
                      leftText={item}
                      style={{ marginRight: 10 }}
                    />
                  )}
                />
              </View>
              <TouchableOpacity
                style={{ marginTop: "auto" }}
                onPress={this.create}
                disabled={!form.valid && type_document && identification_number}
              >
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#473E69",
                    borderRadius: 6,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: form.valid ? 1 : 0.2,
                    paddingHorizontal: 20
                  }}
                >
                  <CustomFont style={{ color: "white" }}>
                    Agregar Tarjeta
                  </CustomFont>
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
