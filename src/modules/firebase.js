import { messaging, analytics, links } from "react-native-firebase";
import { AsyncStorage } from "react-native";
import { users } from "../feathers";
import { arrToString } from "../utils/text.util";
export const getToken = async user => {
  let fcmToken = await AsyncStorage.getItem("fcmToken");
  if (!fcmToken) {
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem("fcmToken", fcmToken);
    }
  }
  await sendToken(user, fcmToken);
};

export const requestPermission = async user => {
  try {
    await messaging().requestPermission();
    // User has authorised
    this.getToken(user);
  } catch (error) {
    // User has rejected permission
    console.log("permission rejected");
  }
};

export const checkPermission = async user => {
  console.info("check permission firebase");
  const enabled = await messaging().hasPermission();
  if (enabled) {
    await getToken(user);
  } else {
    await requestPermission(user);
    await getToken(user);
  }
};

const sendToken = async (id, device_id_token) => {
  users.patch(id, { device_id_token });
};

export const sendProperties = user => {
  analytics().setUserProperties({ city_gender: "" + user.gender });
  analytics().setUserProperties({ city_points: "" + user.points });
  analytics().setUserProperties({ city_user_id: "" + user.id });
};

export const link = async (prefix, params) => {
  const linkFinal = new links.DynamicLink(
    `https://cityprime.club/?${arrToString(params, "&")}`,
    "https://cityprime.page.link"
  ).android
    .setPackageName("com.cityprimeandroid")
    .ios.setBundleId("co.e-me.cityprime");

  return links().createShortDynamicLink(linkFinal, "SHORT");
};
