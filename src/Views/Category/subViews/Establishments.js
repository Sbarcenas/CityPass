import React from "react";
import { ALGOLIA } from "../../../utils/data";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { InstantSearch } from "react-instantsearch-native";
import { Navigation } from "react-native-navigation";
import { getEstablishmentBanner } from "../../../utils/S3Photos";
import CustomFont from "../../../components/CustomFont";

const Loading = connectStateResults(({ searching }) =>
  searching ? <ActivityIndicator color="#0000ff" /> : null
);
const NoResults = connectStateResults(({ searchResults, searching, text }) => {
  if (!searching && searchResults && searchResults.nbHits == 0)
    return (
      <View>
        <Text>{text}</Text>
        <Text>¡Vuelve Pronto!</Text>
      </View>
    );
  return null;
});

const CustomHitsEstablishments = connectHits(
  ({ hits, navigator, fetchMerchant, cityName, catName, componentId }) => {
    const onPress = merchant => {
      Navigation.push(componentId, {
        component: {
          name: "app.establishment",
          passProps: {
            merchant
          }
        }
      });
    };
    console.log({ hits });
    return (
      <View style={{ width: "100%", marginTop: 10 }}>
        <Loading />
        <NoResults text="Pronto encontrarás los mejores comercios en esta categoría" />
        {/* {hits.map((hit, index) =>
        <Establishment hit={hit} key={hit.objectID} onPress={onPress} />
      )} */}
        {hits.map(hit => (
          <View key={hit.objectID} style={{ alignItems: "center" }}>
            <TouchableWithoutFeedback onPress={() => onPress(hit)}>
              <View
                style={[
                  {
                    height: 98,
                    width: 340,
                    marginBottom: 12,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    position: "relative"
                  },
                  styles.showN
                ]}
              >
                <View
                  style={[
                    {
                      height: 72,
                      width: 72,
                      position: "absolute",
                      top: 12,
                      left: 18,
                      borderRadius: 100,
                      backgroundColor: "black",
                      zIndex: 20,
                      overflow: "hidden"
                    },
                    styles.showN
                  ]}
                >
                  <Image
                    source={{ uri: hit.round_logo }}
                    style={{ flex: 1, resizeMode: "contain" }}
                  />
                </View>
                <ImageBackground
                  source={{
                    uri: hit.banner ? getEstablishmentBanner(hit.banner) : ""
                  }}
                  style={{
                    height: 98,
                    width: 268,
                    backgroundColor: "white",
                    position: "absolute",
                    right: 18,
                    borderRadius: 9,
                    overflow: "hidden"
                  }}
                >
                  <View
                    style={{
                      height: 98,
                      width: 268,
                      backgroundColor: "rgba(0, 0, 0, .6)",
                      alignItems: "flex-end"
                    }}
                  >
                    <View style={{ height: 98, width: 268 - 36, padding: 12 }}>
                      <CustomFont
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontWeight: "bold"
                        }}
                      >
                        {hit.name}
                      </CustomFont>
                      <View
                        style={{
                          width: "100%",
                          height: 54,
                          overflow: "hidden"
                        }}
                      >
                        <CustomFont style={{ color: "white" }}>
                          {hit.schedule}
                        </CustomFont>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ))}
      </View>
    );
  }
);

function Establishments(props) {
  return (
    <InstantSearch
      appId={ALGOLIA.APP_ID}
      apiKey={ALGOLIA.API_KEY}
      indexName={ALGOLIA.ESTABLISHMENTS}
    >
      <View style={{ height: height - 150 }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={styles.clubs}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <Configure
            facets={["category_id", "city_id"]}
            facetFilters={[`city_id:${user.city_id}`]}
            // filters={`unix_date_end >= ${timestamp} AND unix_date_start <= ${timestamp}`}
            filters={`categories:${parent_id} AND active= ${1}`}
            hitsPerPage={1000}
          />
          <CustomHitsEstablishments
            componentId={this.props.componentId}
            fetchMerchant={{}}
            cityName={"cityName"}
            catName={category.name}
          />
        </ScrollView>
      </View>
    </InstantSearch>
  );
}

export default Establishments;
