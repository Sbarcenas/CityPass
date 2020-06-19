import { AsyncStorage } from "react-native";
import { startUp } from "../../navigation";

export default async bool => {
  startUp("home", bool);
};
