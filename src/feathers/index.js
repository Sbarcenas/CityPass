import { AsyncStorage } from "react-native";
import { app, rest } from "./conf";

export const login = async (email, password) => {
  await AsyncStorage.setItem("username", email);
  await AsyncStorage.setItem("password", password);
  return app.authenticate({ strategy: "local", email, password });
};
export const logout = async () => {
  await app.logout();
};

export const users = app.service("users");
export const current = app.service("current");
export const passwordRecovery = app.service("recovery-password");
export const benefitHistory = app.service("download-benefits-list");
export const userHistory = app.service("download-scanned-users");

export const establishments = app.service("establishments");
export const favoriteEstablishments = app.service(
  "users-favorite-establishments"
);

export const benefits = app.service("benefits");
export const usersBenefits = app.service("users-benefits");
usersBenefits.timeout = 10000;

export const categories = app.service("categories");
export const locationCitiesCategories = app.service(
  "locations-cities-categories"
);

export const cities = app.service("locations-cities");
export const cms = app.service("cms");

export const claimBenefit = app.service("claim-benefit");

export const usersCreditCards = app.service("users-credit-cards");
export const products = app.service("products");
export const paymentProcessData = app.service("process-payment-data");
paymentProcessData.timeout = 80000;
export const memberships = app.service("memberships");
export const claimCoupon = app.service("claim-coupon");
export const readUser = app.service("read-user-token");
export const readUserTokenHistory = app.service("read-user-token-history");
export const banners = app.service("banners");
export const top_choices = app.service("top-choices");
