import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView
} from "react-native";
import moment from "moment";
import "moment/min/locales";
import { QRCode } from "react-native-custom-qr-codes";
import { connect } from "react-redux";
import Avatar from "../../components/Avatar";
import CustomFont from "../CustomFont/index";
import ImageH from "react-native-scalable-image";
import { getAvatarPhoto } from "../../utils/S3Photos";
moment.locale("es");

const { width, height } = Dimensions.get("window");
const TICKET_HEIGHT = height * 0.8;
const TICKET_WIDTH = width * 0.85;

class RedeemBenefit extends React.Component {
  state = {};
  render() {
    const { benefits = {}, qr, data } = this.props;
    const { benefit = {} } = benefits;
    return (
      <ScrollView
        style={{ flex: 1 }}
        horizontal={false}
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={{ width: "100%", flex: 1 }}>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                paddingTop: 64,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={[
                  styles.ticketNameText,
                  {
                    fontFamily: "Poppins-Light",
                    marginBottom: 10,
                    fontSize: 15
                  }
                ]}
              >
                {data.name}
              </Text>
              {data.nano_id && (
                <QRCode content={data.nano_id} size={height * 0.15} />
              )}
              <CustomFont>{(data.nano_id || "").split("-")[1]}</CustomFont>
            </View>
          </View>
          <View style={{ width: "100%", height: 30 }}>
            <Image
              source={require("../../assets/img/ticketBG.png")}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          </View>
          <View style={{ width: "100%", flex: 1 }}>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                paddingBottom: 0,
                flex: 1,
                alignItems: "center"
              }}
            >
              <View style={styles.ticketBrief}>
                <View style={styles.ticketBriefPart}>
                  <Text
                    style={[styles.expiresIn, { fontFamily: "Poppins-Light" }]}
                  >
                    Vence
                  </Text>
                  <Text
                    style={[styles.expiresIn, { fontFamily: "Poppins-Light" }]}
                  >
                    {moment(data.date_end).format("DD[-]MM[-]YYYY h:mm A")}
                  </Text>
                </View>
              </View>
              {data.image && (
                <Image
                  style={{
                    width: "100%",
                    height: 240,
                    marginBottom: 10,
                    resizeMode: "contain"
                  }}
                  source={{ uri: getAvatarPhoto(data.image) || "" }}
                />
              )}
              <View style={[styles.bodyDestails]}>
                <Text
                  style={[
                    styles.bodyDestailsTitle,
                    { fontFamily: "Poppins-Light", fontWeight: "bold" }
                  ]}
                >
                  Detalles
                </Text>
                <Text
                  style={[
                    styles.bodyDestailsDesc,
                    { fontFamily: "Poppins-Light" }
                  ]}
                >
                  {data.description}
                </Text>
              </View>
              <View style={styles.bodyDestails}>
                <Text
                  style={[
                    styles.bodyDestailsTitle,
                    { fontFamily: "Poppins-Light", fontWeight: "bold" }
                  ]}
                >
                  Condiciones y Restricciones
                </Text>
                <Text
                  style={[
                    styles.bodyDestailsDesc,
                    { fontFamily: "Poppins-Light" }
                  ]}
                >
                  {data.terms}
                </Text>
              </View>
              <View style={styles.bodyDestails}>
                <Text
                  style={[
                    styles.bodyDestailsTitle,
                    { fontFamily: "Poppins-Light", fontWeight: "bold" }
                  ]}
                >
                  ¿Cómo Usar?
                </Text>
                <Text
                  style={[
                    styles.bodyDestailsDesc,
                    { fontFamily: "Poppins-Light" }
                  ]}
                >
                  Presenta el código QR en el comercio antes de realizar tu
                  pedido o compra. Pagando con RappiPay recibe más beneficios.
                </Text>
              </View>
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <Image
              source={require("../../assets/img/ticketBottom.png")}
              style={{
                width: "100%",
                height: 50,
                resizeMode: "contain",
                transform: [{ translateY: -10 }]
              }}
            />
          </View>
          <View style={styles.avatar}>
            <Avatar image={data.logo} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: TICKET_WIDTH,
    flex: 1,
    position: "relative",
    paddingTop: 47
  },
  row: {
    flexDirection: "row"
  },
  avatar: {
    position: "absolute",
    width: TICKET_WIDTH,
    alignItems: "center",
    zIndex: 10
  },
  ticketTop: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 6,
    paddingTop: 50,
    alignItems: "center"
  },
  ticketBottom: {
    flex: 1.2,
    backgroundColor: "white",
    borderRadius: 6,
    alignItems: "center",
    paddingVertical: 20
  },
  ticketName: {
    width: "100%",
    paddingHorizontal: 30
  },
  ticketNameText: {
    color: "#473E69",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold"
  },
  ticketBrief: {
    marginVertical: 20,
    width: "100%",
    flexDirection: "row"
  },
  ticketBriefPart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  groupIcon: {
    tintColor: "#F8C270",
    marginRight: 5
  },
  groupText: {
    width: 80,
    fontSize: 11,
    color: "#727272"
  },
  expiresIn: {
    fontSize: 11,
    color: "#727272"
  },
  ticketDisponibility: {
    color: "#F8C270"
  },
  dividerCont: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "white"
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "white",
    tintColor: "#8E2EDA"
  },
  redeemButton: {
    marginHorizontal: "auto",
    width: "80%",
    height: 40,
    backgroundColor: "#F7C36F",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  redeemButtonText: {
    color: "white",
    fontSize: 18
  },
  bodyDestails: {
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 20,
    alignItems: "flex-start"
  },
  bodyDestailsTitle: {
    color: "dimgrey",
    marginBottom: 6,
    fontSize: 15
  },
  bodyDestailsDesc: {
    color: "#7C7C7C"
  },
  alignCenter: {
    alignItems: "center"
  },
  benefitIcon: {
    height: 60,
    width: 60,
    resizeMode: "contain"
  }
});

export default connect()(RedeemBenefit);
