import React from 'react';
import {
  View, TouchableWithoutFeedback, Text, Dimensions, StyleSheet, ScrollView,
} from 'react-native';
import CustomFont from '../CustomFont';
import { Navigation } from 'react-native-navigation';

const { height, width } = Dimensions.get('window');

const index = ({ componentId, benefit, history }) => {
  const onPress = () => {
    Navigation.dismissOverlay(componentId)
  }
  let nBenefit = benefit;
  if (benefit.user_benefit) {
    nBenefit = JSON.parse(benefit.user_benefit.old_data_benefit);
  }
  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ width, height, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, .5)' }}>
        </View>
      </TouchableWithoutFeedback>
      <View style={[styles.modal, {
        justifyContent: 'space-between', position: 'absolute', zIndex: 100, left: width * .1,
        marginTop: 100, height: history ? 500 : 300
      }]}>
        <ScrollView style={{ flex: 1 }}>
          <CustomFont style={{ fontSize: 18, color: '#473E69', marginBottom: 15 }}>{nBenefit.name}</CustomFont>
          <Text style={{ color: '#473E69', marginTop: 6 }}>Cliente:</Text>
          <Text>{` ${(benefit.user_client || benefit.user || {}).first_name} ${(benefit.user_client || benefit.user || {}).last_name}`}</Text>

          {
            !benefit.user && (
              <React.Fragment>
                {
                  history && (
                    <React.Fragment>
                      <Text style={{ color: '#473E69', marginTop: 6 }}>Leido por:</Text>
                      <Text>{` ${(benefit.user_establishment || {}).first_name} ${(benefit.user_establishment || {}).last_name}`}</Text>
                    </React.Fragment>
                  )
                }

                <Text style={{ color: '#473E69', marginTop: 6 }}>Token</Text>
                <Text>{benefit.token}</Text>

                <Text style={{ color: '#473E69', marginTop: 6 }}>Puntos</Text>
                <Text>{nBenefit.points}</Text>

                <Text style={{ color: '#473E69', marginTop: 10 }}>Detalles</Text>
                <Text>{nBenefit.description}</Text>

                <Text style={{ color: '#473E69', marginTop: 10 }}>Condiciones y Restricciones</Text>
                <Text>{nBenefit.terms}</Text>
              </React.Fragment>
            )
          }
        </ScrollView>
      </View>
    </React.Fragment>
  );
};

export default index;

const styles = StyleSheet.create({
  modal: {
    width: width * .8,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
});