import React, { Fragment } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ART
} from "react-native";
const { Surface, Group, Shape } = ART;
import { Navigation } from "react-native-navigation";
import moment from "moment";
import "moment/min/locales";
moment.locale("es");

const { width } = Dimensions.get("window");
const path =
  "M102.841,131.681H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0h98.893a11.371,11.371,0,0,0,11.375,10.338A11.373,11.373,0,0,0,125.644,0H357.3a4,4,0,0,1,4,4V127.68a4,4,0,0,1-4,4H125.695a11.427,11.427,0,0,0-22.854,0Z";
export default class extends React.Component {
  static options() {
    return {
      topBar: {
        rightButtons: [],
        backButton: {
          icon: require("../../assets/iconsX/backArrow.png"),
          color: "white"
        },
        drawBehind: true,
        background: {
          color: "transparent"
        }
      }
    };
  }
  componentDidMount() {
    // console.log('cdm', this.props)
  }
  goto = () => {
    // console.log('ditroit', this.props)
    Navigation.push(this.props.componentId, {
      component: { name: "app.home" }
    });
  };
  render() {
    const {
      disable,
      id,
      image = "",
      date,
      qty,
      name,
      onClick,
      onClick2,
      el = {},
      qr,
      done,
      admin,
      alt,
      noButtons,
      noRedeem,
      noDetail
    } = this.props;
    console.log("le HIT", el);
    return (
      <View style={styles.container}>
        <Surface width={width * 0.9} height={132}>
          <Group x={0} y={0}>
            <Shape d={path} fill="#FFF" />
          </Group>
        </Surface>
        <View style={styles.absolute}>
          <View
            style={{
              width: "100%",
              height: "100%",
              paddingHorizontal: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                justifyContent: "center",
                overflow: "hidden",
                marginLeft: 4,
                borderRadius: 100
              }}
            >
              <Image
                source={{ uri: image ? image : "" }}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
            </View>
            <View
              style={{
                height: "70%",
                width: "10%",
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              {[0, 0, 0, 0].map(el => (
                <View
                  style={{ width: 2, height: 10, backgroundColor: "#959595" }}
                />
              ))}
            </View>
            <View style={{ width: "60%", height: "100%" }}>
              <View style={styles.topSide}>
                <Text
                  style={[
                    styles.name,
                    { fontFamily: "Poppins-Light", width: 170 }
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {name}
                </Text>
                <View style={styles.data}>
                  {noRedeem ? (
                    <Text
                      style={[styles.date, { fontFamily: "Poppins-Light" }]}
                    >
                      {el.status}
                    </Text>
                  ) : (
                    <Text
                      style={[styles.date, { fontFamily: "Poppins-Light" }]}
                    >
                      Vence{" "}
                      {moment(date)
                        .locale("es")
                        .format("DD[-]MM[-]YYYY h:mm A")}
                    </Text>
                  )}
                  {/* <Text style={styles.quantity}>{qty}</Text> */}
                </View>
              </View>
              {!admin && (done || alt) ? (
                <View
                  style={[styles.bottomSide, { justifyContent: "flex-start" }]}
                >
                  {alt ? (
                    <TouchableOpacity style={styles.button} onPress={onClick}>
                      <Text
                        style={[
                          styles.buttonText,
                          { fontFamily: "Poppins-Light" }
                        ]}
                      >
                        Ver Beneficio
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableWithoutFeedback style={styles.button}>
                      <Text
                        style={[
                          styles.buttonText,
                          { color: "#6D56DB" },
                          { fontFamily: "Poppins-Light" }
                        ]}
                      >
                        {done}
                      </Text>
                    </TouchableWithoutFeedback>
                  )}
                </View>
              ) : (
                !admin && (
                  <View style={styles.bottomSide}>
                    {!noDetail && (
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => onClick2(el, true)}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            { color: "#B5B5B5" },
                            { fontFamily: "Poppins-Light" }
                          ]}
                        >
                          Detalle
                        </Text>
                      </TouchableOpacity>
                    )}
                    {!noRedeem && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => onClick(id, qr)}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            { fontFamily: "Poppins-Light" }
                          ]}
                        >
                          Canjear
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )
              )}
              {admin && !noButtons && (
                <View style={styles.bottomSide}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => onClick2(el, true)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { color: "#B5B5B5" },
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      Editar
                    </Text>
                  </TouchableOpacity>
                  {el.active < 2 ? (
                    <Fragment>
                      {el.active == 0 ? (
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => disable(id, el.active)}
                        >
                          <Text
                            style={[
                              styles.buttonText,
                              { fontFamily: "Poppins-Light" }
                            ]}
                          >
                            Activar
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.detailsButton}
                          onPress={() => disable(id, el.active)}
                        >
                          <Text
                            style={[
                              styles.buttonText,
                              { color: "#B5B5B5" },
                              { fontFamily: "Poppins-Light" }
                            ]}
                          >
                            Pausar
                          </Text>
                        </TouchableOpacity>
                      )}
                    </Fragment>
                  ) : (
                    <Text
                      style={[
                        styles.buttonText,
                        { color: "#473E69" },
                        { fontFamily: "Poppins-Light" }
                      ]}
                    >
                      En revisión
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: 132,
    flexDirection: "row",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "transparent",
    position: "relative"
  },
  absolute: {
    position: "absolute",
    width: width * 0.9,
    height: 132,
    zIndex: 100
  },
  leftSide: {
    position: "relative",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  rightSide: {
    flex: 3,
    backgroundColor: "white"
  },
  imageContainer: {
    height: 80,
    width: 80,
    overflow: "hidden",
    backgroundColor: "white"
  },
  topSide: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 0
    // backgroundColor: 'red'
  },
  bottomSide: {
    flex: 1.25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
    // backgroundColor: 'red'
  },
  button: {
    backgroundColor: "#473E69",
    borderRadius: 100,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  detailsButton: {
    backgroundColor: "transparent",
    borderRadius: 100,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#B5B5B5"
  },
  buttonText: {
    paddingVertical: 3,
    paddingHorizontal: 15,
    color: "white",
    fontSize: 16
  },
  name: {
    fontSize: 16,
    color: "#727272"
  },
  date: {
    color: "#727272",
    fontSize: 9,
    marginRight: 25
  },
  quantity: {
    color: "#727272",
    fontSize: 9
  },
  data: {
    paddingTop: 5,
    flexDirection: "row"
  }
});
