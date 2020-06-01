import {
  SET_BENEFITS,
  SET_HISTORY_BENEFITS,
  START_LOADING_BENEFITS,
  END_LOADING_BENEFITS
} from "../constants/actionsTypes";
import { usersBenefits } from "../feathers";
import { encode } from "base-64";
import moment from "moment";
import Realm from "../modules/realm";
import { getAvatarPhoto } from "../utils/S3Photos";
import NetInfo from "@react-native-community/netinfo";
import RNFetchBlob from "react-native-fetch-blob";
import { Alert } from "react-native";
import store from "../../store";

export const setBenefits = items => ({
  type: SET_BENEFITS,
  payload: items
});

export const startLoadingBenefits = () => ({
  type: START_LOADING_BENEFITS
});

export const endLoadingBenefits = () => ({
  type: END_LOADING_BENEFITS
});

export const setHistoryBenefits = items => ({
  type: SET_HISTORY_BENEFITS,
  payload: items
});

// recuperar beneficios y guardar en realm para el funcionamiento en offline

// utils
const fetchBenefits = (status = [], targetKey, extra = {}) => {
  return usersBenefits.find({
    query: {
      $limit: 10000,
      status: { $in: status },
      $sort: { date_end: 1 },
      ...extra,
      $client: { all_establishment: "true" }
    }
  });
};

const normalizeBenefits = (data = []) => {
  return data.map(el => ({
    ...JSON.parse(el.old_data_benefit),
    redeem: el.createdAt,
    id: el.id,
    status: el.status,
    benefit_id: el.benefit_id,
    nano_id: el.nano_id
  }));
};

const fetchBase64 = async url => {
  const res = await RNFetchBlob.fetch("GET", url);
  //Alert.alert("base 64", res.base64());
  return res.base64();
};

const refreshBenefitsInRealm = async benefits => {
  const realm = await Realm;
  try {
    realm.write(async () => {
      realm.deleteAll();
      for (let benefit of benefits) {
        //let imageEncoded = await fetchBase64(getAvatarPhoto(benefit.image));
        //let logoEncoded = await fetchBase64(getAvatarPhoto(benefit.logo));

        realm.create("Benefits", {
          id: benefit.id,
          description: benefit.description,
          terms: benefit.terms,
          image: getAvatarPhoto(benefit.image),
          name: benefit.name,
          dateEnd: benefit.date_end,
          benefitId: benefit.benefit_id,
          nanoId: benefit.nano_id,
          status: benefit.status,
          logo: getAvatarPhoto(benefit.logo),
          createAt: benefit.createdAt
        });
      }
    });
  } catch (e) {
    //Alert.alert("Error in realm", e.message);
    console.log("Error in realm", e);
  }
};

export const fetchAndSaveInRealmBenefits = () => {
  return async dispatch => {
    const date = moment().format("YYYY[-]MM[-]DD");
    let currentState = store.getState();

    if (currentState.wallet.loading) {
      return;
    }

    const { type, isConnected } = await NetInfo.fetch();

    if (!isConnected) {
      dispatch(fetchBenefitsInRealm());
      return;
    }

    try {
      console.info("fetch and save benefits in realm...");
      dispatch(startLoadingBenefits());

      let [benefits, historyBenefits] = await Promise.all([
        fetchBenefits(["Obtained"], "benefits", {
          date_end: {
            $gt: date
          }
        }),
        fetchBenefits(["Reclaimed", "Expired", "Canceled"], "historyBenefits")
      ]);
      let normalizedBenefits = normalizeBenefits(benefits.data);
      let normalizedHistoryBenefits = normalizeBenefits(historyBenefits.data);

      await refreshBenefitsInRealm(normalizedBenefits);
      //Alert.alert("benefits", normalizedBenefits);
      dispatch(setBenefits(normalizedBenefits));
      dispatch(setHistoryBenefits(normalizedHistoryBenefits));
    } catch (e) {
      console.info("fetch benefits in realm...");
      fetchBenefitsInRealm();
    } finally {
      dispatch(endLoadingBenefits());
    }
  };
};

export const fetchBenefitsInRealm = () => {
  return async dispatch => {
    const realm = await Realm;
    let allBenefits = realm.objects("Benefits");

    let items = allBenefits.map(benefit => ({
      image: benefit.image,
      redeem: benefit.createAt,
      id: benefit.id,
      name: benefit.name,
      status: benefit.status,
      benefit_id: benefit.benefitId,
      establishment: {
        logo: benefit.logo
      }
    }));

    console.log("benefits", items);
    //Alert.alert("benefits realm", JSON.stringify(items));

    dispatch(setBenefits(items));
  };
};
