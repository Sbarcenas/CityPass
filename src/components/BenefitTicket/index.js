import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Button,
  Share
} from "react-native";
import { connect } from "react-redux";
import Avatar from "../Avatar";
import { Navigation } from "react-native-navigation";
import { getAvatarPhoto } from "../../utils/S3Photos";
import moment from "moment";
import { link } from "../../modules/firebase";
import { colorNames } from "react-native-svg/lib/extract/extractColor";
const frogg =
  "https://yellow.place/file/image/thumb/0/0/469/fvmssgyczmhyjpyn.jpg";
const { width, height } = Dimensions.get("window");
const TICKET_HEIGHT = height * 0.83;
const TICKET_WIDTH = width * 0.85;
const shareIcon = require("../../assets/icons/share-icon.png");
const membershipVals = {
  "1": 0,
  "2": 200,
  "3": 400
};
const membershipName = {
  "1": "Prime",
  "2": "Silver Prime",
  "3": "Gold Prime"
};

class BenefitTicket extends React.Component {
  state = {
    logo: null
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

  refresh = () => {
    const { benefit, localUser } = this.props;
    localUser.current();
    Navigation.dismissLightBox();
  };

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
      quantity
    } = benefit;
    const userMembership = user.membership == null ? {} : user.membership;
    const membershipIds = membership ? membership.map(el => el.id) : [1];
    const max = Math.max(...membershipIds);
    const membersOnly = membershipVals[max] > user.points;
    const { logo } = this.state;
    const userstate = localUser.user;

    console.log("user store", user);

    console.log("user state ---->", userstate);

    console.log("user --->", getAvatarPhoto(benefit.image));

    console.log("benefit ticket", { benefit });
    console.log("benefit.redeem", benefit.redeem);

    console.log({
      wallet,
      quantity: benefit.quantity,
      userPoints: user.points,
      points
    });

    return (
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 30
        }}
        alwaysBounceVertical={false}
      >
        <View style={styles.container}>
          <View style={styles.avatar}>
            <Avatar image={logo || merchantLogo} />
            <TouchableOpacity style={styles.shareButton} onPress={this.onShare}>
              <Image
                style={{ tintColor: "#473E69", width: 22, height: 22 }}
                tintColor={"#473E69"}
                source={shareIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={{ width: "100%", flexGrow: 0, flexShrink: 0 }}>
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
                  {/* <View style={[styles.row, styles.ticketBriefPart, { alignItems: 'center' }]}>
                  <Image source={require('../../assets/icons/quality-badge.png')} style={[styles.groupIcon, { height: 30, width: 30, resizeMode: 'contain'}]} />
                  <Text
                    style={[styles.groupText, { paddingLeft: 4 }, { fontFamily: 'Poppins-Light' }]}
                  >
                    {points} Puntos
                  </Text>
                </View> */}
                  <View style={styles.ticketBriefPart}>
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
                      {moment(date_end).format("DD[-]MM[-]YYYY h:mm A")}
                    </Text>
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
          <View style={{ width: "100%" }}>
            <Image
              source={require("../../assets/img/ticketBG.png")}
              style={{ width: "100%", height: 30, resizeMode: "cover" }}
            />
          </View>
          <View style={{ width: "100%", flex: 1 }}>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                paddingBottom: 20,
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                flex: 1,
                alignItems: "center"
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
                  { flexDirection: "row", marginTop: 10 }
                ]}
              >
                <Text>Cantidad disponible:</Text>
                <Text style={[{ color: "#473E69", fontWeight: "bold" }]}>
                  {` ${quantity}`}
                </Text>
              </View>
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
                <Text style={{ fontWeight: "bold" }}>¿Cómo Usar?</Text>
                <Text
                  style={[
                    styles.bodyDestailsDesc,
                    { fontFamily: "Poppins-Light" }
                  ]}
                >
                  Obtén este cupón y presenta el código QR en el comercio antes
                  de realizar tu pedido o compra. Pagando con RappiPay recibe
                  más beneficios.
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
                        Tienes {`${user.points} puntos y necesitas ${points}`}
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
              {!wallet &&
                !benefit.redeem &&
                benefit.quantity > 0 &&
                user.points >= points && (
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
                          Tienes {`${user.points} puntos`}
                        </Text>
                      </View>
                    )}
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
                          Obtener
                          {userMembership.id == 2 || points == 0
                            ? " Gratis"
                            : ` por ${points} puntos`}
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
                  // onPress={onClick}
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
      </ScrollView>
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
    marginHorizontal: "auto",
    width: "80%",
    height: 40,
    // backgroundColor: '#F7C36F',
    backgroundColor: "#473E69",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  redeemButtonText: {
    color: "white",
    fontSize: 12
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
  }
});

const mapStateToProps = state => {
  return {
    user: state.user
  };
};
export default connect(mapStateToProps)(BenefitTicket);
