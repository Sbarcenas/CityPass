import { combineReducers } from "redux";
import UserReducer from "./user.reducer";
import SearchReducer from "./search.reducer";
import WalletReducer from "./wallet.reducer";
import Establishment from "./stablishment.reducer";
import { reducer as network } from "react-native-offline";

export default combineReducers({
  user: UserReducer,
  search: SearchReducer,
  wallet: WalletReducer,
  establishment: Establishment,
  network
});
