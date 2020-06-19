import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import CustomFont from "../../components/CustomFont/index";
import { Navigation } from "react-native-navigation";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { top_choices } from "../../feathers";
import { Toaster } from "../../utils/toaster";
import TopChoiceCard from "../../components/Cards/TopChoiceCard";
const { width } = Dimensions.get("window");
function Index(props) {
  Navigation.mergeOptions(props.componentId, {
    topBar: {
      rightButtons: [],
      drawBehind: true,
      background: {
        color: "transparent"
      }
    },
    sideMenu: {
      left: {
        visible: false,
        enabled: false
      }
    }
  });
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = () => {
    setLoading(true);
    top_choices
      .find({ query: { active: 1 } })
      .then(res => {
        //alert(JSON.stringify(res.data));
        setLoading(false);
        setChoices(res.data);
      })
      .catch(err => Toaster({ type: "info", text: err.message }));
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <View>
      <View style={styles.headerSearchContainer}>
        <CustomFont style={[styles.title]}>TOP CHOICES</CustomFont>
        <Image
          style={{ height: 18, width: 22, marginTop: -5 }}
          source={require("../../assets/img/crown.png")}
        />
      </View>
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator color="#0000ff" style={{ marginTop: 20 }} />
        )}
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={choices}
          keyExtractor={(item, index) => `list-item-${index}`}
          renderItem={({ item }) => (
            <TopChoiceCard
              {...item}
              containerStyle={{ marginRight: 0 }}
              componentId={props.componentId}
              width={"95%"}
              style={{ alignSelf: "center", borderRadius: 10, height: 138 }}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    marginRight: 5,
    color: "#453E6A",
    fontWeight: "bold",
    fontSize: 20
  },
  headerSearchContainer: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    width: width * 0.7,
    left: width * 0.15,
    top:
      getStatusBarHeight() > 40 ? 55 : getStatusBarHeight(true) != 0 ? 30 : 15,
    zIndex: 100
  },
  content: {
    marginTop:
      getStatusBarHeight() > 40 ? 95 : getStatusBarHeight(true) != 0 ? 75 : 65
  }
});
export default Index;
