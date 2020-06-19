import React from "react";
import { View, Image, StyleSheet } from "react-native";

const AVATAR_DIMENSIONS = 94;

export default ({ image }) => {
  const isUri = typeof image === "string";
  const source = isUri ? { uri: image } : image;
  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: AVATAR_DIMENSIONS,
    height: AVATAR_DIMENSIONS,
    borderRadius: AVATAR_DIMENSIONS,
    backgroundColor: "white",
    overflow: "hidden",
    padding: 5,
    borderColor: "rgba(0, 0, 0, .1)",
    borderWidth: 1
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover"
  }
});
