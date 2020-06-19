import React, { Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Share,
  Linking
} from "react-native";
import { connect } from "react-redux";
import Avatar from "../Avatar";
import { Navigation } from "react-native-navigation";
import { getAvatarPhoto } from "../../utils/S3Photos";
import { link } from "../../modules/firebase";
import numeral from "numeral";
import { usersBenefits } from "../../feathers";
import { Toaster } from "../../utils/toaster";
import CustomFont from "../CustomFont";
const { width, height } = Dimensions.get("window");
const TICKET_WIDTH = width * 0.85;
const shareIcon = require("../../assets/icons/share-icon.png");
const membershipVals = {
  "1": 0,
  "2": 200,
  "3": 400
};

class BenefitTicket extends React.Component {
  state = {
    logo: null,
    isObtained: true
  };

  onShare = async () => {
    const { benefit } = this.props;
    link("fiendCode" + benefit.id, [
      "page_type=establishmentBenefits",
      `dynamic_id=${benefit.id}`
    ]).then(async url => {
      try {
        const result = await Share.share({
          message: `${benefit.name} - \n  ${url}`
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

  sendWp = data => {
    const rgx = /[0-9]{10}/;
    let url = `whatsapp://send?text=Hola mi nombre es ${
      (this.props.user || {}).first_name
    } ${
      (this.props.user || {}).last_name
    }, deseo redimir el beneficio App City Prime "${
      data.name
    }", para canjear mi codigo:${(data.nano_id || "").split("-")[1]}&phone=57${(
      this.props.benefit || {}
    ).terms.match(rgx)[0] || "3003140528"}`;
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

  benefitObtained() {
    return usersBenefits.find({
      query: {
        benefit_id: this.props.benefit.id,
        status: "Obtained",
        $client: { all_establishment: "true" }
      }
    });
  }

  async onClick() {
    console.info("benefit.id:", this.props.benefit.id);
    usersBenefits
      .find({
        query: {
          benefit_id: this.props.benefit.id,
          status: "Obtained",
          $client: { all_establishment: "true" }
        }
      })
      .then(async res => {
        if (res.data.length > 0) {
          this.sendWp(res.data[0]);
        } else {
          const saved = await usersBenefits.create({
            benefit_id: (this.props.benefit || {}).id
          });
          const data = await usersBenefits.get(saved.id, {
            query: { $client: { all_establishment: "true" } }
          });
          this.sendWp(data);
        }
      });
  }

  refresh = () => {
    const { benefit, localUser } = this.props;
    localUser.current();
    Navigation.dismissLightBox();
  };

  componentDidMount() {
    this.benefitObtained().then(res => {
      if (res.data.length > 0) {
        this.setState({ ...this.state, isObtained: true });
      } else {
        this.setState({ ...this.state, isObtained: false });
      }
    });
  }

  render() {
    const {
      benefit,
      merchantLogo,
      onClick,
      user,
      localUser = {},
      noQty,
      wallet,
      loading
    } = this.props;
    const {
      id,
      name,
      icon,
      date_end,
      qty,
      people_benefit,
      description,
      terms,
      points,
      membership,
      quantity,
      delivery,
      price,
      discount,
      nano_id
    } = benefit;
    const userMembership = user.membership == null ? {} : user.membership;
    const membershipIds = membership ? membership.map(el => el.id) : [1];
    const max = Math.max(...membershipIds);
    const membersOnly = membershipVals[max] > user.points;
    const { logo } = this.state;
    const userstate = localUser.user;
    return (
      <Fragment>
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 100,
            flexGrow: 1
          }}
          alwaysBounceVertical={false}
        >
          <View style={styles.container}>
            <View style={styles.avatar}>
              <Avatar image={logo || merchantLogo} />
              <TouchableOpacity
                style={styles.shareButton}
                onPress={this.onShare}
              >
                <Image
                  style={{ tintColor: "#473E69", width: 22, height: 22 }}
                  tintColor={"#473E69"}
                  source={shareIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={{ width: TICKET_WIDTH, flexGrow: 1, flexShrink: 0 }}>
              <View
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  paddingTop: 55,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6
                }}
              >
                <View>
                  <Text
                    style={[
                      styles.ticketNameText,
                      {
                        // height: 68,
                        fontFamily: "Poppins-Light",
                        marginBottom: 10,
                        fontSize: 15
                      }
                    ]}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    textAlignVertical="center"
                  >
                    {name}
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <View style={styles.ticketBrief}>
                    <View style={styles.ticketBriefPart}>
                      <View style={{ flexDirection: "row" }}>
                        {String(price ? price : 0) != "0" && (
                          <Text style={[styles.prices, styles.colorPrice]}>
                            $
                            {numeral(price - price * (discount / 100)).format(
                              "0,000"
                            )}
                          </Text>
                        )}

                        {String(discount ? discount : 0) != "0" && (
                          <Text style={[styles.prices, styles.priceDiscount]}>
                            ${numeral(price * (discount / 100)).format("0,000")}
                          </Text>
                        )}

                        {String(discount ? discount : 0) != "0" && (
                          <Text style={[styles.discountPercentage]}>
                            -{String(discount ? discount : 0)}%
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  {!noQty && (
                    <Text
                      style={[
                        styles.ticketDisponibility,
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      Beneficios disponibles ({qty})
                    </Text>
                  )}
                  {/* <Text style={[styles.ticketDisponibility, { fontFamily: 'Poppins-Light', color: '#727272', fontSize: 11 }]}>{points} Puntos</Text> */}
                </View>
              </View>
            </View>
            <View style={{ width: TICKET_WIDTH, flex: 1 }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  borderBottomLeftRadius: 6,
                  borderBottomRightRadius: 6,
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: TICKET_WIDTH,
                    flex: 1,
                    backgroundColor: "white",
                    paddingTop: 10
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "white",
                      paddingHorizontal: 10,
                      flex: 1
                    }}
                  >
                    {benefit.image && (
                      <Image
                        style={{
                          width: "100%",
                          height: this.state.imageHeight || 1,
                          resizeMode: "contain",
                          borderRadius: 5,
                          overflow: "hidden",
                          marginBottom: 10
                        }}
                        source={{ uri: getAvatarPhoto(benefit.image) || "" }}
                        onLoadEnd={() => this.setState({ imageHeight: 240 })}
                      />
                    )}
                    <View
                      style={[
                        styles.bodyDestails,
                        {
                          flexDirection: "row",
                          marginTop: 10,
                          alignSelf: "center",
                          justifyContent: "center"
                        }
                      ]}
                    >
                      <Text
                        style={{
                          fontWeight: "300",
                          alignSelf: "center",
                          color: "#473E69"
                        }}
                      >
                        Unidades disponibles:
                      </Text>
                      <Text style={[{ color: "#473E69", fontWeight: "300" }]}>
                        {` ${quantity}`}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ width: TICKET_WIDTH }}>
                  <Image
                    source={require("../../assets/img/ticketBG.png")}
                    style={{ width: "100%", height: 30, resizeMode: "cover" }}
                  />
                </View>
                <View
                  style={{
                    width: TICKET_WIDTH,
                    backgroundColor: "white",
                    flexGrow: 1,
                    height: "100%"
                  }}
                >
                  <View style={[styles.bodyDestails]}>
                    {/* <Text style={[styles.bodyDestailsTitle, { fontFamily: 'Poppins-Light'}]}> */}
                    <Text style={{ fontWeight: "bold" }}>Detalles</Text>
                    <Text
                      style={[
                        styles.bodyDestailsDesc,
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      {description}
                    </Text>
                  </View>
                  <View style={styles.bodyDestails}>
                    {/* <Text style={[styles.bodyDestailsTitle, { fontFamily: 'Poppins-Light'}]}> */}
                    <Text style={{ fontWeight: "bold" }}>
                      Condiciones y Restricciones
                    </Text>
                    <Text
                      style={[
                        styles.bodyDestailsDesc,
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      {terms}
                    </Text>
                  </View>
                  <View style={styles.bodyDestails}>
                    <Text style={{ fontWeight: "bold" }}>¿Como Usar?</Text>
                    <Text
                      style={[
                        styles.bodyDestailsDesc,
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      Obtén este cupón y presenta el código QR en el comercio
                      antes de realizar tu pedido o compra.
                    </Text>
                  </View>
                  {/*</ScrollView>*/}
                  {user.points < points && (
                    <React.Fragment>
                      {userMembership.id != 2 && (
                        <View style={{ width: "100%", alignItems: "center" }}>
                          <Text
                            style={[
                              {
                                fontFamily: "Poppins-Light",
                                fontSize: 12,
                                color: "#473E69"
                              }
                            ]}
                          >
                            Tienes{" "}
                            {`${user.points} puntos y necesitas ${points}`}
                          </Text>
                        </View>
                      )}
                      <TouchableHighlight
                        style={[
                          styles.redeemButton,
                          {
                            borderColor: "tomato",
                            borderWidth: 2,
                            backgroundColor: "white"
                          }
                        ]}
                        onPress={() => {
                          Navigation.push(this.props.componentId, {
                            component: {
                              name: "app.shop",
                              passProps: {
                                fromBenefit: true
                              }
                            }
                          });
                        }}
                        underlayColor="#473E69"
                        disabled={loading}
                      >
                        <View>
                          <Text
                            style={[
                              styles.redeemButtonText,
                              { fontFamily: "Poppins-Light", color: "tomato" }
                            ]}
                          >
                            Ir a la tienda
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </React.Fragment>
                  )}

                  {!wallet && benefit.quantity < 1 && (
                    <TouchableHighlight
                      style={[
                        styles.redeemButton,
                        {
                          backgroundColor: "white",
                          borderRadius: 0,
                          borderColor: "#473E69",
                          borderWidth: 1
                        }
                      ]}
                      // onPress={onClick}
                      underlayColor="#473E69"
                    >
                      <Text
                        style={[
                          styles.redeemButtonText,
                          { fontFamily: "Poppins-Light", color: "#473E69" }
                        ]}
                      >
                        Beneficio Agotado
                      </Text>
                    </TouchableHighlight>
                  )}
                  {benefit.redeem && (
                    <TouchableHighlight
                      style={[
                        styles.redeemButton,
                        {
                          backgroundColor: "white",
                          borderRadius: 0,
                          borderColor: "#473E69",
                          borderWidth: 1
                        }
                      ]}
                      underlayColor="#473E69"
                    >
                      <Text
                        style={[
                          styles.redeemButtonText,
                          { fontFamily: "Poppins-Light", color: "#473E69" }
                        ]}
                      >
                        Obtuviste este el {benefit.redeem.split("T")[0]}
                      </Text>
                    </TouchableHighlight>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

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
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            {delivery ? (
              <TouchableOpacity
                style={styles.redeemButtonWp}
                onPress={() => {
                  this.onClick();
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
            ) : (
              <View />
            )}
            {!this.state.isObtained && benefit.quantity > 0 && (
              <React.Fragment>
                <TouchableHighlight
                  style={styles.redeemButton}
                  onPress={onClick}
                  underlayColor="#473E69"
                  disabled={loading}
                >
                  <View>
                    <Text
                      style={[
                        styles.redeemButtonText,
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      Guardar en wallet
                    </Text>
                  </View>
                </TouchableHighlight>
              </React.Fragment>
            )}
          </View>
          {this.state.isObtained && (
            <CustomFont
              style={{
                fontWeight: "200",
                color: "#453E6A",
                marginTop: -10,
                marginBottom: 10,
                alignSelf: "center"
              }}
            >
              Ya has obtenido este beneficio!
            </CustomFont>
          )}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  shareButton: {
    alignSelf: "flex-end",
    position: "absolute",
    right: 20,
    top: 60
  },
  container: {
    width: TICKET_WIDTH,
    //height: TICKET_HEIGHT,
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, .1)',
    position: "relative",
    paddingTop: 47,
    backgroundColor: "transparent"
  },
  row: {
    flexDirection: "row"
  },
  avatar: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
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
    flex: 1.8,
    backgroundColor: "white",
    borderRadius: 6,
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 30
  },
  ticketName: {
    width: "70%"
  },
  ticketNameText: {
    color: "#473E69",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold"
  },
  ticketBrief: {
    width: "100%",
    flexDirection: "row"
  },
  ticketBriefPart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  groupIcon: {
    tintColor: "#F8C270"
  },
  groupText: {
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
    backgroundColor: "white"
  },
  redeemButton: {
    marginBottom: 20,
    marginHorizontal: "auto",
    height: 40,
    width: TICKET_WIDTH / 2 - 20,
    // backgroundColor: '#F7C36F',
    backgroundColor: "#453E6A",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: "auto",
    marginLeft: "auto",
    flexDirection: "row"
  },
  redeemButtonWp: {
    marginBottom: 20,
    marginHorizontal: "auto",
    height: 40,
    width: TICKET_WIDTH / 2 - 20,
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
    fontWeight: "bold",
    color: "white",
    fontSize: 12
  },
  bodyDestails: {
    backgroundColor: "white",
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
  }
});

const mapStateToProps = state => {
  return {
    user: state.user
  };
};
export default connect(mapStateToProps)(BenefitTicket);
