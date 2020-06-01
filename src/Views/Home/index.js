import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  ImageBackground,
  StatusBar,
  AsyncStorage,
  PushNotificationIOS,
  Alert,
  Platform,
  Button,
  ActivityIndicator,
  Text
} from "react-native";
import firebase, { notifications, messaging, iid } from "react-native-firebase";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Base from "../../components/Base";
import Spinner from "react-native-loading-spinner-overlay";
import CustomFont from "../../components/CustomFont";
import {
  categories,
  locationCitiesCategories,
  current,
  claimCoupon,
  cities
} from "../../feathers";
import { emitter } from "../../../";
import { Toaster } from "../../utils/toaster";
import {
  identify,
  pageView,
  couponRedeem,
  registerToken,
  mixpanel
} from "../../utils/mixpanel";
import { startUp } from "../../../navigation";
import NetInfo from "@react-native-community/netinfo";
const { width, height } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 180;
const HEADER_MIN_HEIGHT =
  getStatusBarHeight() > 40 ? 100 : getStatusBarHeight(true) != 0 ? 70 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
import { checkPermission } from "../../modules/firebase";
import { fetchAndSaveInRealmBenefits } from "../../actions/wallet.actions";
import MiniOfflineSign from "../../components/MiniOfflineSign";
import { app } from "../../feathers/conf";

class Home extends Base {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      scrollY: new Animated.Value(0),
      language: "",
      picture: "",
      loading: false,
      desc: "",
      categories: [],
      isOffline: false,
      loadingFetchCategories: false
    };
  }
  static options() {
    return {
      topBar: {
        elevation: 0,
        title: {
          color: "transparent",
          component: {
            name: "app.homeHeader",
            alignment: "center"
          }
        },
        drawBehind: true,
        background: {
          color: "transparent"
        },
        leftButtons: [
          {
            id: "menuBtn",
            icon: require("../../assets/iconsX/burgerButton.png"),
            color: "white"
          }
        ],
        rightButtons: [
          {
            id: "walletBtn",
            icon: require("../../assets/iconsX/wallet.png"),
            color: "white"
          }
        ]
      }
    };
  }

  urlIsValid = view => {
    if (!view) return;
    const views = [
      "home",
      "subCategories",
      "category",
      "search",
      "wallet",
      "establishmentBenefits",
      "redeemBenefit",
      "establishment",
      "profile",
      "cms",
      "favorites",
      "gotoCards",
      "redeemCoupon"
    ];
    return views.find(el => el == view);
  };

  parseUrl = url => {
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    let params = {};
    let match;
    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
    }
    return params;
  };

  handleDynamicLinks = async () => {
    const links = firebase.links();
    const initialLInk = await links.getInitialLink();
    this.handleUrl(initialLInk);
    links.onLink(link => {
      try {
        this.handleUrl(link);
      } catch (e) {
        alert(e, "Error");
      }
    });
  };

  handleUrl = url => {
    const overlayScreens = ["redeemCoupon"];
    if (url) {
      const params = this.parseUrl(url);

      if (!this.urlIsValid(params.page_type)) {
        Toaster({ type: "error", title: "invalid screen" });
        return;
      }

      try {
        if (overlayScreens.includes(params.page_type)) {
          emitter.emit(params.page_type, params.dynamic_id);
        } else {
          Navigation.push(this.props.componentId, {
            component: {
              name: `app.${params.page_type}`,
              passProps: {
                dynamic_id: params.dynamic_id
              }
            }
          });
        }
      } catch (e) {
        alert(e, "aaaaa");
      }
    } else {
      console.log("<>-----NOT DYNAMIC LINK-----<>");
    }
  };

  handleDeep = (page_type, dynamic_id) => {
    if (page_type) {
      if (!this.urlIsValid(page_type)) {
        Toaster({ type: "error", title: "invalid screen" });
        return;
      }

      try {
        Navigation.push(this.props.componentId, {
          component: {
            name: `app.${page_type}`,
            passProps: {
              dynamic_id: dynamic_id
            }
          }
        });
      } catch (e) {
        alert(e, "aaaaa");
      }
    } else {
      console.log("<>-----NOT DYNAMIC LINK-----<>");
    }
  };
  /*handleFirabase = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.messageListener = firebase.messaging().onMessage(({ _data }) => {});
    }
  };*/

  // Give up, firebase push notification permissions
  requestFirebasePermissions = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.handleFirabase();
    } catch (error) {
      // User has rejected permissions
    }
  };

  //Send firebase push notification TOkEN
  sendToken = async () => {
    try {
      const {
        coords: { latitude, longitude }
      } = await this.getLocation();
      const token = await firebase.messaging().getToken();
      await instance.post("myprofile/devices", { token, latitude, longitude });
    } catch (error) {
      Toaster({ type: "error", message: error.message });
    }
  };

  // Check Firebase Permission
  checkPermissions = async () => {
    try {
      const status = await Permissions.check("location");
      if (status === "authorized") {
        this.setState({ authorized: true });
      } else {
        PermissionRequest(status, async () => {
          const response = await Permissions.request("location");
          if (response === "authorized") {
            this.setState({ authorized: true });
          }
        });
      }
    } catch (error) {
      Toaster({ type: "error", message: error.message });
    }
  };

  componentDidMount = async () => {
    const { ignoreDynamicLink, fetchAndSaveInRealmBenefits } = this.props;
    const { isOffline } = this.state;
    this.handleDynamicLinks();
    const { type, isConnected } = await NetInfo.fetch();
    this.createNotificationListeners();

    if (!isConnected) {
      this.setState({ isOffline: true });
    }

    await app.authenticate();

    this.fetchCategories();

    fetchAndSaveInRealmBenefits();

    pageView("home");
    this.openWallet();
    this.openProfile();
    this.openInfo();
    this.openFavs();
    this.openQr();
    this.openFriendCode();
    // this.gotoSearch();

    try {
      const user = await current.find();
      await checkPermission(user.id);
      this.messageListener = firebase
        .messaging()
        .onMessage((message: RemoteMessage) => {
          // Process your message as required
        });
    } catch (e) {
      alert(e);
    }

    await this.setState({ user });
    identify(user);

    const keys = await AsyncStorage.getAllKeys();
    keys.map(async key => {
      const res = await AsyncStorage.getItem(key);
      console.log("HOME USER", key, res);
    });

    /*if (Platform.OS === "ios") {
      await checkPermission();
      PushNotificationIOS.addEventListener(
        "registrationError",
        registrationError => {
          alert(JSON.stringify(registrationError));
        }
      );
      //await PushNotificationIOS.requestPermissions();
      PushNotificationIOS.addEventListener("register", token => {
        registerToken(token);
      });
      PushNotificationIOS.addEventListener(
        "registrationError",
        registrationError => {
          alert(JSON.stringify(registrationError));
        }
      );

      PushNotificationIOS.addEventListener("notification", function(
        notification
      ) {
        if (!notification) {
          return;
        }
        const data = notification.getData();
        Alert.alert(JSON.stringify({ data, source: 'CollapsedApp' }))
      });

      PushNotificationIOS.getInitialNotification().then(notification => {
        if (!notification) {
          return;
        }
        const data = notification.getData();
        // Alert.alert(JSON.stringify({ data, source: 'ClosedApp' }))
      });
    } else {
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        mixpanel.initPushHandling("121840301814");
        mixpanel.setPushRegistrationId(fcmToken);
      }
    }*/
    console.info("IID");
    console.info(iid().get());
  };

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = notifications().onNotification(notification => {
      const { data, body, title } = notification;
      console.info(data);
      this.showAlert(title, body, [
        {
          text: "Continuar",
          onPress: () => console.log("¡Gracias!")
        }
      ]);
    });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = notifications().onNotificationOpened(
      notificationOpen => {
        const { notification } = notificationOpen;
        this.handleDeep(
          notification.data.page_type,
          notification.data.dynamic_id
        );
      }
    );

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await notifications().getInitialNotification();
    if (notificationOpen) {
      console.info("prevData");
      const { notification } = notificationOpen;
      console.info(notificationOpen);
      this.handleDeep(
        notification.data.page_type,
        notification.data.dynamic_id
      );
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = messaging().onMessage(message => {
      //process data message
      const { notification } = message;
      this.handleDeep(
        notification.data.page_type,
        notification.data.dynamic_id
      );
      //console.log(message);
    });
  }

  showAlert(title, body, buttons = null) {
    Alert.alert(title, body, buttons);
  }

  async componentWillUnmount() {
    this.messageListener();
    //this.messageListener();
    this.notificationListener();
    this.notificationOpenedListener();

    //emitter.removeAllListeners();
  }

  openInfo = () => {
    emitter.addListener("openInfo", () => {
      console.log("-----<>>");
      this.toggleSideBar();
      Navigation.push(this.props.componentId, {
        component: {
          options: {
            topBar: {
              drawBehind: true,
              background: {
                color: "transparent"
              },
              visible: true,
              title: {
                color: "white",
                text: "Información"
              },
              backButton: {
                icon: require("../../assets/iconsX/backArrow.png"),
                color: "white"
              }
            }
          },
          name: "app.cms",
          passProps: { id: 1 }
        }
      });
    });
  };

  openProfile = () => {
    emitter.addListener("gotoShop", () => {
      console.log("-----<>> gotoShop");
      this.toggleSideBar();
      Navigation.push(this.props.componentId, {
        component: {
          name: "app.shop",
          options: {
            topBar: {
              drawBehind: true,
              background: {
                color: "transparent"
              },
              visible: true,
              title: { text: "Tienda de puntos", color: "white" },
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
            }
          }
        }
      });
    });

    emitter.addListener("redeemCoupon", (data = "") => {
      this.setState({ codeText: data.toUpperCase() });
      console.log("-----<>> openCoupon");
      this.toggleSideBar();
      Navigation.showOverlay({
        component: {
          name: "app.redeemCoupon",
          passProps: {
            onChange: val => {
              this.setState({ codeText: val.toUpperCase() });
            },
            onSubmit: async dismiss => {
              const { codeText } = this.state;
              try {
                const { coupon } = await claimCoupon.create({
                  token: codeText
                });
                couponRedeem(coupon);
                console.log("cupón redimido", coupon);
                Toaster({ type: "success", text: "Cupón Redimido" });
                dismiss();
              } catch (error) {
                Toaster({ type: "error", text: error.message });
              }
              this.setState({ codeText: "" });
            },
            dynamic_id: data.toUpperCase()
          }
        }
      });
    });

    emitter.addListener("avatarPicker", () => {
      console.log("-----<>> avatarPicker");
      this.toggleSideBar();
      Navigation.showOverlay({
        component: {
          name: "app.avatarPicker"
        }
      });
    });

    emitter.addListener("gotoCards", () => {
      console.log("-----<>> gotoCards");
      this.toggleSideBar();
      Navigation.push(this.props.componentId, {
        component: {
          name: "app.gotoCards"
        }
      });
    });

    emitter.addListener("gotoSearch", () => {
      console.log("-----<>> gotosearch");
      this.toggleSideBar();
      Navigation.push(this.props.componentId, {
        component: {
          name: "app.search"
        }
      });
    });

    emitter.addListener("openProfile", () => {
      console.log("-----<>>");
      this.toggleSideBar();
      Navigation.push(this.props.componentId, {
        component: {
          name: "app.profile"
        }
      });
    });
  };

  openQr = () => {
    emitter.addListener("openQr", () => {
      const { user } = this.state;
      console.log("-----<>>", user);
      this.toggleSideBar();
      Navigation.showOverlay({
        component: {
          name: "app.userQr"
        }
      });
    });
  };

  openFriendCode = () => {
    emitter.addListener("openFriendCode", () => {
      this.toggleSideBar();
      Navigation.showOverlay({
        component: {
          name: "app.friendCode"
        }
      });
    });
  };

  openFavs = () => {
    emitter.addListener("openFavs", () => {
      console.log("-----<>>");
      this.toggleSideBar();
      Navigation.push(this.props.componentId, {
        component: {
          options: {
            topBar: {
              drawBehind: true,
              background: {
                color: "transparent"
              },
              visible: true,
              title: {
                color: "white",
                text: "Mis Favoritos"
              },
              backButton: {
                icon: require("../../assets/iconsX/backArrow.png"),
                color: "white"
              }
            }
          },
          name: "app.favorites"
        }
      });
    });
  };

  openWallet = () => {
    emitter.addListener("openWallet", () => {
      console.log("-----<>>");
      this.toggleSideBar();
      Navigation.push(this.props.componentId, {
        component: {
          name: "app.wallet"
        }
      });
    });
  };

  toggleSideBar = () => {
    console.log("<<<<>>>>>--<>");
    if (Platform.OS === "android") {
      /*disable swipe gesture*/
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            // enabled: false,
            visible: false
          }
        }
      });
      /*enable swipe gesture*/
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            enabled: true
          }
        }
      });
    } else {
      /*for iOs devices*/
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: false
          }
        }
      });
    }
  };

  gotoSearch = () => {
    Navigation.push(this.props.componentId, {
      component: { name: "app.search" }
    });
  };

  gotoCategory = category => {
    const view = category.hasChild ? "subCategories" : "category";
    Navigation.push(this.props.componentId, {
      component: {
        name: `app.${view}`,
        options: {
          topBar: {
            drawBehind: true,
            background: {
              color: "transparent"
            },
            backButton: {
              icon: require("../../assets/iconsX/backArrow.png"),
              color: "white"
            }
          }
        },
        passProps: {
          parent_id: category.id,
          parent_name: category.name
        }
      }
    });
  };

  renderScrollViewContent() {
    const { categories, isOffline, loadingFetchCategories } = this.state;
    console.log("HOME categories ------<<>", categories);

    return (
      <View style={styles.scrollViewContent}>
        <View style={{ marginBottom: 20 }}>
          <MiniOfflineSign />
        </View>
        {loadingFetchCategories && (
          <ActivityIndicator style={{ marginTop: 60 }} />
        )}
        {isOffline ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Image
              source={require("../../assets/img/server-down.png")}
              style={{ marginBottom: 20 }}
            />
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 10
              }}
            >
              Oops, estás sin conexión.
            </Text>
            <Text
              style={{ textAlign: "center", fontSize: 18, marginBottom: 20 }}
            >
              Canjea tus beneficios en Mi Wallet.
            </Text>
            <TouchableWithoutFeedback
              onPress={async () => {
                await app.authenticate();
                this.fetchCategories();
              }}
            >
              <View style={styles.saveButton}>
                <CustomFont style={{ color: "white", fontWeight: "bold" }}>
                  Reintentar
                </CustomFont>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                Navigation.push(this.props.componentId, {
                  component: {
                    name: "app.wallet",
                    options: {
                      topBar: {
                        backButton: {
                          icon: require("../../assets/iconsX/backArrow.png"),
                          color: "white"
                        }
                      }
                    }
                  }
                });
              }}
            >
              <View style={[styles.saveButton, styles.walletButton]}>
                <CustomFont style={{ color: "#473E69", fontWeight: "bold" }}>
                  Ir a Mi Wallet
                </CustomFont>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <React.Fragment>
            {categories.map(el => (
              <TouchableWithoutFeedback
                onPress={() => this.gotoCategory(el)}
                key={el.id}
              >
                <View>
                  <ImageBackground
                    style={styles.row}
                    source={{ uri: el.banner || "" }}
                  >
                    <CustomFont style={styles.rowText}>
                      {(el.name || "").toLocaleUpperCase()}
                    </CustomFont>
                  </ImageBackground>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </React.Fragment>
        )}
      </View>
    );
  }

  async componentDidUpdate(prevProps) {
    console.log("PREV PROPS HOME", this.props.user);
    const { user, dispatch } = this.props;

    console.log(
      "condition",
      prevProps.user.city_id != user.city_id,
      prevProps.user.city_id,
      user.city_id,
      user
    );

    if (user.showIntro) {
      dispatch({ type: "UPDATE_USER", user: { showIntro: false } });
      Navigation.push(this.props.componentId, {
        component: {
          name: "app.introShow"
        }
      });
    }
    if (prevProps.user.city_id != user.city_id) {
      this.fetchCategories();
    }
  }

  fetchCategories = async () => {
    const { user, setUserCity } = this.props;
    try {
      this.setState({ loadingFetchCategories: true });
      const { data } = await locationCitiesCategories.find({
        query: { $limit: 1000, city_id: user.city_id }
      });
      const { data: dataCategories } = await categories.find({
        query: {
          $sort: { position: -1 },
          active: 1,
          parent_id: 0,
          id: { $in: data.map(el => el.category_id) }
        }
      });
      this.setState({ categories: dataCategories });
      // LAS CATEGORIES YA ESTAN EN EL STATE. SE VA A VERIFICAR SI UN CATEGORY TIENE HIJOS
      const ids = dataCategories.map(category => category.id);
      const { data: subCategoriesData } = await categories.find({
        query: {
          active: 1,
          parent_id: { $in: ids },
          id: { $in: data.map(el => el.category_id) }
        }
      });
      const finalCategories = dataCategories.map(el => {
        const hasChild = subCategoriesData.find(sub => sub.parent_id == el.id);
        return {
          ...el,
          hasChild: hasChild ? true : false
        };
      });
      this.setState({ categories: finalCategories, isOffline: false });
    } catch (error) {
      if (
        error.message.includes("Timeout") ||
        error.message.includes("timed out")
      ) {
        this.setState({ isOffline: true });
      }
    } finally {
      this.setState({ loadingFetchCategories: false });
    }
  };

  render() {
    const { cities, user = {} } = this.props;
    const { loading, isOffline } = this.state;
    const { user: profile = {} } = user;
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 3],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });

    return (
      <View style={[styles.fill, styles.bodyBackground, { height: height }]}>
        <Spinner visible={loading} />
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={[styles.scrollView]}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
        >
          {this.renderScrollViewContent()}
        </ScrollView>
        <Animated.View style={[styles.headerSearchContainer, { opacity }]}>
          <TouchableWithoutFeedback onPress={this.gotoSearch}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <View style={styles.headerSearch}>
                <CustomFont style={styles.headerSearchInput}>Buscar</CustomFont>
              </View>
              <Image source={require("../../assets/iconsX/loupe.png")} />
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <LinearGradient
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 1.0, y: 0.8 }}
            colors={["#473E69", "#249EC7"]}
            style={styles.headerGradient}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    justifyContent: "flex-end",
    alignItems: "center",
    height
  },
  cameraBody: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    width
  },
  cameraButtonCont: {
    height: 80,
    width: 80,
    borderRadius: 100,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    marginBottom: 20
  },
  cameraButton: {
    height: 70,
    width: 70,
    borderRadius: 100,
    backgroundColor: "white"
  },
  bodyBackground: {
    backgroundColor: "#F4F4F4"
  },
  fill: {
    flex: 1
  },
  row: {
    height: 115,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 10,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    overflow: "hidden"
  },
  rowText: {
    color: "white",
    fontSize: 24
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 3
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#03A9F4",
    overflow: "hidden",
    zIndex: 0
  },
  headerGradient: {
    flex: 1
  },
  headerNavBar: {
    height: 80,
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative"
  },
  headerSearchContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "absolute",
    width: width * 0.7,
    left: width * 0.15,
    top:
      getStatusBarHeight() > 40 ? 90 : getStatusBarHeight(true) != 0 ? 60 : 50,
    zIndex: 100
  },
  headerSearch: {
    height: 40,
    width: "85%",
    marginRight: width * 0.02,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderColor: "white",
    paddingBottom: 5,
    paddingLeft: 5,
    borderBottomWidth: 1
  },
  headerSearchInput: {
    color: "white",
    fontSize: 16,
    paddingVertical: 0,
    width: "100%"
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 18
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT - 130
  },
  scrollView: {
    marginTop: HEADER_MIN_HEIGHT,
    zIndex: 1
    // backgroundColor: 'red'
  },
  cityPicker: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  cityName: {
    color: "white"
  },
  arrowDown: {
    height: 12,
    width: 12,
    resizeMode: "contain",
    marginLeft: 15
  },
  saveButton: {
    height: 40,
    maxWidth: 200,
    width: "100%",
    borderRadius: 6,
    backgroundColor: "#473E69",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  walletButton: {
    backgroundColor: "#fff",
    borderColor: "#473E69",
    borderWidth: 2,
    color: "#000"
  }
});

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    fetchAndSaveInRealmBenefits: () => dispatch(fetchAndSaveInRealmBenefits()),
    setUserCity: id => dispatch({ type: "SET_USER_CITY", city_id: id })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
