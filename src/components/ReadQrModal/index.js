import React from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, TextInput, Dimensions, StyleSheet } from 'react-native';
import CustomFont from '../CustomFont';
import { Navigation } from 'react-native-navigation';

const { height, width } = Dimensions.get('window');

const index = ({ onSubmit, componentId }) => {
  const onPress = () => {
    Navigation.dismissOverlay(componentId)
  }
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.modal}>
          <CustomFont>Beneficio Leido</CustomFont>
          <TouchableOpacity onPress={onSubmit}>
            <View>
              <CustomFont>Ok</CustomFont>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default index;

const styles = StyleSheet.create({
  modal: {
    width: width * .8,
    height: width * .8,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
});