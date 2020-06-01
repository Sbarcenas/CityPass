import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Share
} from "react-native";
import { connect } from "react-redux";
import { QRCode } from "react-native-custom-qr-codes";
import * as Progress from "react-native-progress";
import Avatar from "../../components/Avatar";
import { Navigation } from "react-native-navigation";
import { getAvatarPhoto } from "../../utils/S3Photos";
import { link } from "../../modules/firebase";

const { width, height } = Dimensions.get("window");
const TICKET_HEIGHT = height * 0.9;
const TICKET_WIDTH = width * 0.85;

const FriendCode = ({ user = {}, componentId }) => {
  console.log("USER_CODEP");
  console.log(user);
  console.log("QR CODE USER", user);
  const { membership = {} } = user;
  const avatar = user.avatar == null ? "" : user.avatar;
  const isPrime = membership.id == 2;
  const dismiss = () => {
    Navigation.dismissOverlay(componentId);
  };

  const onShare = async () => {
    link("benefit" + user.coupon_code, [
      "page_type=redeemCoupon",
      `dynamic_id=${user.coupon_code}`
    ]).then(async url => {
      try {
        const result = await Share.share({
          message: `${user.first_name} ${
            user.last_name
          } te envio este codigo para que reclames 200 puntos en city prime: ${user.coupon_code.toUpperCase()} - \n  ${url}`
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

  return (
    <TouchableWithoutFeedback style={[styles.fill]} onPress={dismiss}>
      <View
        colors={["#473E69", "#249EC7"]}
        style={[
          styles.fill,
          styles.center,
          { backgroundColor: "rgba(0, 0, 0, .5)" }
        ]}
      >
        <View style={styles.container}>
          <View
            style={[
              styles.ticketBottom,
              {
                paddingBottom: 10,
                paddingTop: TICKET_HEIGHT * 0.17,
                paddingHorizontal: 20,
                justifyContent: "center",
                borderRadius: 10,
                alignItems: "center"
              }
            ]}
          >
            <Image
              source={require("../../assets/img/friends_banner.png")}
              style={{}}
            />

            <Text
              style={[
                {
                  textAlign: "center",
                  marginTop: TICKET_HEIGHT * 0.035,
                  fontSize: 17,
                  color: "#727272",
                  alignSelf: "center"
                },
                { fontFamily: "Poppins-Light" }
              ]}
            >
              Comparte tu código con tus amigos y obten
              <Text
                style={[
                  {
                    marginTop: TICKET_HEIGHT * 0.05,
                    fontSize: 17,
                    color: "#727272",
                    alignSelf: "center",
                    fontWeight: "bold"
                  },
                  { fontFamily: "Poppins-ExtraBold" }
                ]}
              >
                {" 200 puntos"}
              </Text>
              <Text
                style={[
                  {
                    marginTop: 30,
                    fontSize: 17,
                    color: "#727272",
                    alignSelf: "center"
                  },
                  { fontFamily: "Poppins-Light" }
                ]}
              >
                {" cuando sea canjeado"}
              </Text>
            </Text>
            <View>
              <View style={{ flex: 0.3 }}></View>

              <Text
                style={[
                  {
                    marginTop: 30,
                    fontSize: 17,
                    color: "#727272",
                    alignSelf: "center"
                  },
                  { fontFamily: "Poppins-Light" }
                ]}
              >
                {" Código"}
              </Text>
              <Text
                style={[
                  {
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#727272",
                    marginTop: 5,
                    textAlign: "center"
                  },
                  { fontFamily: "Poppins-Light" }
                ]}
              >
                {user.coupon_code}
              </Text>
              {isPrime ? (
                <View
                  style={{
                    flexDirection: "row",
                    width: width * 0.75,
                    justifyContent: "space-around",
                    marginTop: 30
                  }}
                >
                  <View>
                    <Text
                      style={[
                        { fontSize: 12, color: "#727272" },
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      Eres usuario {` ${membership.name}`}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    width: width * 0.75,
                    justifyContent: "center",
                    marginTop: 30
                  }}
                >
                  <TouchableHighlight
                    style={styles.redeemButton}
                    underlayColor="#473E69"
                    disable={false}
                    onPress={onShare}
                  >
                    <View>
                      <Text
                        style={[
                          styles.redeemButtonText,
                          { fontFamily: "Poppins-Light" }
                        ]}
                      >
                        Compartir
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.03
  },
  container: {
    width: TICKET_WIDTH,
    height: TICKET_HEIGHT,
    // backgroundColor: 'rgba(0, 0, 0, .1)',
    position: "relative"
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
    paddingTop: 100,
    flex: 1.7,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center"
  },
  ticketBottom: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 20
  },
  ticketName: {
    width: "100%",
    paddingHorizontal: 30
  },
  ticketNameText: {
    width: "80%",
    color: "#7C7C7C",
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 20
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
    //---
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "white",
    tintColor: "#8E2EDA"
  },
  redeemButtonText: {
    color: "white",
    fontSize: 18
    //---
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
  },
  redeemButton: {
    marginBottom: 50,
    marginHorizontal: "auto",
    width: "80%",
    height: 40,
    // backgroundColor: '#F7C36F',
    backgroundColor: "#473E69",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapState = state => state;
export default connect(mapState)(FriendCode);
