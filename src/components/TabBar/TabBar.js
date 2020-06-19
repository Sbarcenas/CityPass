import React from "react";
import ScrollingMenu from "../../components/react-native-scrolling-menu";
import { StyleSheet } from "react-native";

function TabBar(props) {
  const { tabs, onSelect, itemStyle, selected } = props;

  return (
    <ScrollingMenu
      defaultIndex={selected}
      selectedItemStyle={[itemStyle, styles.selectedItemStyle]}
      containerStyle={[{ height: 30, marginTop: 10, marginBottom: 25 }]}
      itemStyle={[itemStyle, styles.itemStyle]}
      items={tabs}
      bottomStyle={{
        width: "100%",
        height: 2,
        backgroundColor: "#473E69",
        zIndex: 999,
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        borderRadius: 100
      }}
      onSelect={onSelect}
    />
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    fontSize: 15,
    color: "gray",
    height: "100%",
    paddingHorizontal: 16
  },
  selectedItemStyle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#473E69",
    height: "100%",
    opacity: 1,
    paddingHorizontal: 16
  }
});
export default TabBar;
