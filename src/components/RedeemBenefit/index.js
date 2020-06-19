import React, { Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Share
} from "react-native";
import moment from "moment";
import "moment/min/locales";
import { QRCode } from "react-native-custom-qr-codes";
import { connect } from "react-redux";
import Avatar from "../../components/Avatar";
import CustomFont from "../CustomFont/index";
import ImageH from "react-native-scalable-image";
import { getAvatarPhoto } from "../../utils/S3Photos";
import numeral from "numeral";
import { Toaster } from "../../utils/toaster";
import { link } from "../../modules/firebase";
moment.locale("es");

const { width, height } = Dimensions.get("window");
const TICKET_HEIGHT = height * 0.8;
const TICKET_WIDTH = width * 0.85;
const shareIcon = require("../../assets/icons/share-icon.png");

class RedeemBenefit extends React.Component {
  onClick = data => {
    console.info(data);
    let url = `whatsapp://send?text=hola mi nombre es ${data.first_name} ${
      data.last_name
    }, deseo redimir el beneficio App City Prime "${
      data.name
    }", para canjear mi codigo:${(data.nano_id || "").split("-")[1]}&phone=57${
      data.terms
    }`;
    Linking.openURL(url)
      .then(data => {})
      .catch(err =>
        Toaster({
          type: "info",
          title: "Error al acceder a WhatsApp",
          text:
            "Por favor verifique, que su dispositivo cuente con esta aplicación"
        })
      );
  };
  state = {};
  componentDidMount() {
    console.info(this.props.data);
  }

  onShare = async () => {
    const { data } = this.props;
    const { id, name } = data;
    link("fiendCode" + id, [
      "page_type=establishmentBenefits",
      `dynamic_id=${id}`
    ]).then(async url => {
      try {
        const result = await Share.share({
          message: `${name} - \n  ${url}`
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    });
  };

  render() {
    const { benefits = {}, qr, data } = this.props;

    return (
      <Fragment>
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          horizontal={false}
          alwaysBounceHorizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <TouchableOpacity onPress={this.onShare} style={styles.shareButton}>
              <Image
                style={{ tintColor: "#473E69", width: 22, height: 22 }}
                tintColor={"#473E69"}
                source={shareIcon}
              />
            </TouchableOpacity>
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

                      fontSize: 15
                    }
                  ]}
                >
                  {data.name}
                </Text>

                <View style={[styles.ticketBrief, { marginVertical: 5 }]}>
                  <View style={styles.ticketBriefPart}>
                    <View style={{ flexDirection: "row" }}>
                      {data.price != 0 && (
                        <Text style={[styles.prices, styles.colorPrice]}>
                          $
                          {numeral(
                            data.price - data.price * (data.discount / 100)
                          ).format("0,000")}
                        </Text>
                      )}

                      {data.discount != 0 && (
                        <Text style={[styles.prices, styles.priceDiscount]}>
                          $
                          {numeral(data.price * (data.discount / 100)).format(
                            "0,000"
                          )}
                        </Text>
                      )}

                      {data.discount != 0 && (
                        <Text style={[styles.discountPercentage]}>
                          -{String(data.discount ? data.discount : 0)}%
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {data.nano_id && (
                  <View style={{ marginTop: 10 }}>
                    <QRCode content={data.nano_id} size={height * 0.15} />
                  </View>
                )}
              </View>
            </View>
            <View style={{ width: "100%", height: 30 }}>
              <Image
                source={require("../../assets/img/ticketBG.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover"
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                paddingBottom: 0,
                alignItems: "center"
              }}
            >
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
                <View style={[styles.bodyDestails]}>
                  <Text style={{ color: "#707070", fontSize: 10 }}>Código</Text>
                  <CustomFont
                    style={{
                      color: "#34476D",
                      fontSize: 35,
                      fontWeight: "bold"
                    }}
                  >
                    {(data.nano_id || "").split("-")[1]}
                  </CustomFont>
                  <View style={[styles.ticketBrief, { marginTop: 0 }]}>
                    <View style={[styles.ticketBriefPart]}>
                      <Text
                        style={[
                          styles.expiresIn,
                          { fontFamily: "Poppins-Light" }
                        ]}
                      >
                        Vence
                      </Text>
                      <Text
                        style={[
                          styles.expiresIn,
                          { fontFamily: "Poppins-Light" }
                        ]}
                      >
                        {moment(data.date_end).format("DD[-]MM[-]YYYY h:mm A")}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.bodyDestailsTitle,
                      {
                        fontFamily: "Poppins-Light",
                        fontWeight: "bold",
                        alignSelf: "flex-start"
                      }
                    ]}
                  >
                    Detalles
                  </Text>
                  <Text
                    style={[
                      styles.bodyDestailsDesc,
                      { fontFamily: "Poppins-Light", alignSelf: "flex-start" }
                    ]}
                  >
                    {data.description}
                  </Text>
                </View>
                <View style={styles.bodyDestails}>
                  <Text
                    style={[
                      styles.bodyDestailsTitle,
                      {
                        fontFamily: "Poppins-Light",
                        fontWeight: "bold",
                        alignSelf: "flex-start"
                      }
                    ]}
                  >
                    Condiciones y Restricciones
                  </Text>
                  <Text
                    style={[
                      styles.bodyDestailsDesc,
                      { fontFamily: "Poppins-Light", alignSelf: "flex-start" }
                    ]}
                  >
                    {data.terms}
                  </Text>
                </View>
                <View
                  style={[
                    styles.bodyDestails,
                    { marginBottom: data.delivery ? 60 : 10 }
                  ]}
                >
                  <Text
                    style={[
                      styles.bodyDestailsTitle,
                      {
                        fontFamily: "Poppins-Light",
                        fontWeight: "bold",
                        alignSelf: "flex-start"
                      }
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
            {!data.delivery && (
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
            )}
            <View style={styles.avatar}>
              <Avatar image={data.logo} />
            </View>
          </View>
        </ScrollView>
        {data.delivery ? (
          <View
            style={{
              width: TICKET_WIDTH,
              backgroundColor: "white",
              position: "absolute",
              bottom: 0,
              alignSelf: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5
            }}
          >
            <TouchableOpacity
              style={styles.redeemButton}
              onPress={() => {
                this.onClick(data);
              }}
            >
              <Image
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 5,
                  resizeMode: "contain"
                }}
                source={require("../../assets/img/whatsapp.png")}
              />
              <Text
                style={[
                  styles.redeemButtonText,
                  { fontFamily: "Poppins-Light" }
                ]}
              >
                Utilizar cupón
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: TICKET_WIDTH,
    flex: 1,
    position: "relative",
    paddingTop: 47,
    paddingBottom: 20
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
    marginBottom: 20,
    marginHorizontal: "auto",
    width: "80%",
    height: 40,
    // backgroundColor: '#F7C36F',
    backgroundColor: "#0EB700",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: "auto",
    marginLeft: "auto",
    flexDirection: "row"
  },
  redeemButtonText: {
    color: "white",
    fontSize: 18
  },
  bodyDestails: {
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 20,
    alignItems: "center"
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
  },
  data: {
    paddingTop: 5,
    flexDirection: "row"
  },
  colorPrice: {
    color: "#453E6A"
  },
  prices: {
    marginBottom: "auto",
    marginTop: "auto",
    fontSize: 13
  },
  priceDiscount: {
    color: "#AFAFAF",
    marginLeft: 5,
    marginRight: 5,
    textDecorationLine: "line-through"
  },
  discountPercentage: {
    fontSize: 12,
    borderRadius: 18,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 7,
    backgroundColor: "#453E6A",
    color: "#ffffff"
  },
  shareButton: {
    position: "absolute",
    right: 15,
    top: 60,
    zIndex: 99999,
    elevation: 10
  }
});

export default connect()(RedeemBenefit);
