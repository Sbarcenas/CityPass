import React, { Fragment } from 'react';
import { View, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Text, Dimensions } from 'react-native';
import {Navigation} from 'react-native-navigation';
const { width, height } = Dimensions.get('window');

const ConfirmPhoto = ({ photo, upload, componentId }) => {
  const dismiss = () => Navigation.dismissOverlay(componentId);
  return (
    <Fragment>
      <TouchableWithoutFeedback onPress={dismiss}>
        <View style={{ width, height, backgroundColor: 'rgba(0, 0, 0, .7)' }} />
      </TouchableWithoutFeedback>
      <View style={{
        position: 'absolute', top: 100, width: width * .8, left: width * .1, height: 400,
        backgroundColor: 'white', borderRadius: 6, zIndex: 100,
      }}>
        <ImageBackground source={{ uri: photo }} style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ width: '100%', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={dismiss}>
              <View style={{
                width: 130, height: 40, backgroundColor: '#473E69', justifyContent: 'center', alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Salir</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              upload(photo); dismiss();
            }}>
              <View style={{
                width: 130, height: 40, backgroundColor: '#473E69', justifyContent: 'center', alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Aceptar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </Fragment>
  );
}
 
export default ConfirmPhoto;