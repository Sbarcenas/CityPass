import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";
import { GET_BENEFITS_HISTORY } from "../../actions/stablishment.actions";

const FriendCode = props => {
  const dismiss = () => {
    Navigation.dismissOverlay(props.componentId);
  };

  useEffect(() => {
    // Actualiza el título del documento usando la API del navegador
    props.isLoading ? null : dismiss();
  }, [props.isLoading]);

  return (
    <View
      colors={["#473E69", "#249EC7"]}
      style={[
        styles.fill,
        styles.center,
        {
          backgroundColor: "rgba(0, 0, 0, .5)",
          justifyContent: "center",
          alignItems: "center"
        }
      ]}
    >
      <View
        style={{
          backgroundColor: "rgba(255,255,255,1)",
          padding: 20,
          borderRadius: 10
        }}
      >
        <Text>Descargando...</Text>
        <ActivityIndicator />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80
  }
});

const mapStateToProps = state => ({
  isLoading: state.establishment.isLoading
});

function mapDispatchToProps(dispatch) {
  return {
    historyLoaded: () => dispatch(GET_BENEFITS_HISTORY())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendCode);
