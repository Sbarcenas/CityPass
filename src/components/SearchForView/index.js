import React from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";

const SearchForView = ({ dispatch }) => {
  const handleChange = text => dispatch({ type: "UPDATE_SEARCH_TEXT", text });
  return (
    <View style={styles.headerSearch}>
      <TextInput
        autoFocus
        autoCorrect={false}
        style={styles.headerSearchInput}
        placeholderTextColor="white"
        placeholder="Buscar"
        onChangeText={handleChange}
      />
      <Image
        style={{ height: "100%", width: 16, resizeMode: "contain" }}
        source={require("../../assets/iconsX/loupe.png")}
      />
    </View>
  );
};

const mapStateToProps = state => state;
export default connect(mapStateToProps)(SearchForView);

const styles = StyleSheet.create({
  headerSearch: {
    height: 30,
    width: 220,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderColor: "white",
    borderBottomWidth: 1
  },
  headerSearchInput: {
    marginTop: 100,
    fontSize: 16,
    paddingVertical: 0,
    width: "80%",
    height: "100%",
    borderRadius: 4,
    color: "white"
  }
});
