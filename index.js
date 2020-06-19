/**
 * @format
 */

import {
  AppRegistry,
  YellowBox,
  AsyncStorage,
  AppState,
  Alert
} from "react-native";
import { Navigation } from "react-native-navigation";
import EventEmitter from "events";
import Intercom from "react-native-intercom";
import timer from "react-native-timer";
import { app } from "./src/feathers/conf";
import { name as appName } from "./app.json";
import { startUp, pushLoginScreen, pushHomeScreen } from "./navigation";
import { initMixpanel } from "./src/utils/mixpanel";
import { Toaster } from "./src/utils/toaster";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import firebase from "react-native-firebase";
import bgMessaging from "./src/bgMessaging";

YellowBox.ignoreWarnings(["Remote debugger"]);
AppRegistry.registerComponent(appName, () => App);
export const emitter = new EventEmitter();
export { Intercom };

Navigation.events().registerAppLaunchedListener(async () => {
  tokenValidation();
  AppState.addEventListener("change", handleAppStateChange);
  const token = await AsyncStorage.getItem("feathers-jwt");
  const accessToken = await AsyncStorage.getItem("accessToken");
  const { isConnected } = await NetInfo.fetch();

  if (isConnected) {
    try {
      await app.authenticate();
      startUp("home");
    } catch ({ message }) {
      console.log("APP AUTHENTICATE ERROR.", message);
      if (!message.includes("timed out")) {
        errorHandler();
      } else {
        startUp("home");
      }
    }
  } else {
    if (token || accessToken) {
      startUp("home");
    } else {
      pushLoginScreen();
    }
  }
});

// Current main application
AppRegistry.registerComponent("ReactNativeFirebaseDemo", () => bootstrap);
// New task registration
AppRegistry.registerHeadlessTask(
  "RNFirebaseBackgroundMessage",
  () => bgMessaging
); // <-- Add this line
initMixpanel();

const errorHandler = async error => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    if (accessToken) {
      await app.authenticate({ strategy: "jwt", accessToken: accessToken });
    } else {
      const email = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");
      await app.authenticate({ strategy: "local", email, password });
    }

    Toaster({ type: "info", title: "Reconectando..." });
    // await app.authenticate();
    console.log("APP AUTHENTICATE GOES FINE.");
    startUp("home");
  } catch (error) {
    console.log("APP AUTHENTICATE ERROR.", error.message);
    if (error.message.includes("timed out")) {
      Navigation.showModal({
        component: {
          name: "app.offlineView"
        }
      });
    } else {
      pushLoginScreen();
    }
  }
};

app.on("reauthentication-error", errorHandler);

const tokenValidation = async () => {
  timer.clearInterval("token-verifier");
  timer.setInterval(
    "token-verifier",
    async () => {
      tokenVerifier();
    },
    1000 * 10
  );
};

const handleAppStateChange = nextAppState => {
  /*console.log("foreground!", nextAppState, AppState.currentState);
  if (nextAppState === "active") {
    tokenVerifier();
  }*/
};

const tokenVerifier = async () => {
  try {
    const token = await AsyncStorage.getItem("feathers-jwt");

    if (!token) {
      timer.clearInterval("token-verifier");
      return;
    }
    const jwt = await app.passport.verifyJWT(token);
    const { exp } = jwt;
    const res = moment(parseInt(`${exp}000`, 10)).diff(Date.now(), "hours");
    console.log("le feathers-jwt", res, token);
    if (res <= 2400) await app.authenticate();
  } catch (error) {
    errorHandler();
  }
};
// fetch('https://jsonplaceholder.typicode.com/todos/1')
//   .then(response => response.json())
//   .then(json => console.log(json))
//   .catch(({ message }) => console.log('-----<<>', message))

(async () => {
  const token = await firebase.messaging().getToken();
  console.info("token firebase => ", { token });
})();
