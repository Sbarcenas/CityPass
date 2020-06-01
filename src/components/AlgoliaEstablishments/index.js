import React from 'react';
import { View, ImageBackground, Text, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
export default ({ logo = '', name }) => {
  return (
    <ImageBackground style={styles.container} source={{ uri: logo || '' }} />
  );
}

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    padding: 5,
    overflow: 'hidden',
    borderRadius: 100,
    backgroundColor: 'white',
  },
  imageContainer: {
    width: 50,
    height: 50,
    padding: 5,
    overflow: 'hidden',
    borderRadius: 100,
    backgroundColor: 'white',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  text: {
    width: width * .26,
    fontSize: 13,
    color: '#959595',
    marginTop: 5,
    textAlign: 'center',
  }
})