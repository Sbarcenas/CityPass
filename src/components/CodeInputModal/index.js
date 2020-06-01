import React from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, TextInput, Dimensions, StyleSheet } from 'react-native';
import CustomFont from '../CustomFont';
import { Navigation } from 'react-native-navigation';

const { height, width } = Dimensions.get('window');

const index = ({ onChange, onSubmit, componentId }) => {
  const onPress = () => {
    Navigation.dismissOverlay(componentId)
  }
  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}></View>
      </TouchableWithoutFeedback>
      <View style={[styles.modal, { justifyContent: 'space-between', position: 'absolute', zIndex: 100, marginLeft: width * .1, marginTop: 100 }]}>
        <View>
          <CustomFont>Ingresa el código</CustomFont>
          <View style={{ marginTop: 10, paddingVertical: 6, paddingHorizontal: 10, borderColor: '#473E69', borderWidth: 1, borderRadius: 6, height: 40 }}>
            <TextInput includeFontPadding={false} textAlignVertical="center" style={{ height: 35 }} placeholder="0UQ95CCK" onChangeText={onChange} autoCorrect={false} />
          </View>
        </View>
        <TouchableOpacity style={{ width: '100%' }} onPress={() => onSubmit(onPress)}>
          <View style={{ backgroundColor: '#473E69', width: '100%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}>
            <CustomFont style={{ color: 'white', fontSize: 16 }}>Ingresar</CustomFont>
          </View>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
};

export default index;

const styles = StyleSheet.create({
  modal: {
    width: width * .8,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
});