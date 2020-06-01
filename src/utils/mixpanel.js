import mixpanel from "react-native-mixpanel";
import { getAvatarPhoto } from "./S3Photos";
import { analytics } from "react-native-firebase";

export { mixpanel };
export function initMixpanel() {
  mixpanel.sharedInstanceWithToken("95c3ad11ffeb1a1f5e9cc90922205e4b");
}
export const identify = user => {
  mixpanel.identify(`${user.id}`);
  mixpanel.set({
    $avatar: getAvatarPhoto(user.avatar),
    $distinct_id: `${user.id}`,
    $email: user.email,
    $phone: user.phone,
    $first_name: user.first_name,
    $last_name: user.last_name,
    membership_id: user.membership.id,
    membership_name: user.membership.name
  });
};

export const pageView = (view, rest = {}) => {
  mixpanel.trackWithProperties("PAGE_VIEW", { page_type: view, ...rest });
  analytics().setCurrentScreen(view);
};

export const viewNow = (view, specific_id) => {
  analytics().logEvent("v_" + view, {
    specific_id: "" + specific_id
  });
};

export const benefitObtain = (rest = {}) => {
  console.info("BenefitObtain::::");
  console.info(rest);
  mixpanel.trackWithProperties("BENEFIT_OBTAIN", { ...rest });


  analytics().logEvent("BENEFIT_OBTAIN", {
    id: rest.id,
    benefit_id: rest.benefit_id,
    establishment_city_id: rest.establishment_city_id,
    category_id: rest.category_id,
    points: rest.points
  });
};

export const benefitObtainError = (rest = {}) => {
  mixpanel.trackWithProperties("BENEFIT_OBTAIN_ERROR", { ...rest });
  analytics().logEvent("BENEFIT_OBTAIN_ERROR", {
    id: rest.id,
    benefit_id: rest.benefit_id,
    establishment_city_id: rest.establishment_city_id,
    category_id: rest.category_id,
    points: rest.points,
    reason: rest.reason
  });
};

export const favoriteFollow = (rest = {}) => {
  mixpanel.trackWithProperties("FAVORITE_FOLLOW", { ...rest });
  analytics().logEvent("FAVORITE_FOLLOW", {
    establishment_id: rest.establishment_id,
    establishment_city_id: rest.establishment_city_id
  });
};

export const favoriteUnfollow = (rest = {}) => {
  mixpanel.trackWithProperties("FAVORITE_UNFOLLOW", { ...rest });
  analytics().logEvent("FAVORITE_UNFOLLOW", {
    establishment_id: rest.establishment_id,
    establishment_city_id: rest.establishment_city_id
  });
};

export const creditCardCreated = (rest = {}) => {
  mixpanel.trackWithProperties("CREDIT_CARD_CREATED", { ...rest });
  analytics().logEvent("CREDIT_CARD_CREATED", { ...rest });
  //alert(JSON.stringify(rest));
};

export const couponRedeem = (rest = {}) => {
  console.log("inside", rest);
  mixpanel.trackWithProperties("COUPON_REDEEM", { ...rest });
  analytics().logEvent("COUPON_REDEEM", {
    id: rest.id,
    user_id: rest.user_id,
    token: rest.token,
    type: rest.type
  });
  //alert(JSON.stringify(rest));
};

export const registerToken = token => {
  console.log("token", token);
  mixpanel.addPushDeviceToken(token);
};
