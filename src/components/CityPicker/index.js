import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';

const { height, width } = Dimensions.get('window');

const CityPicker = ({ componentId, list, handlePress, users = {}, must }) => {
  const { user = {} } = users;
  const onPress = (el) => {
    handlePress(el);
    Navigation.dismissOverlay(componentId);
  }
  const dismiss = () => {
    if (must) return;
    Navigation.dismissOverlay(componentId);
  } 
  return (
    <TouchableOpacity style={styles.tap} onPress={dismiss} underlayColor="transparent">
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: 'Poppins-Light'}]}>
          Hola {user.firstname},
        </Text>
        <Text style={[styles.title, { marginBottom: 18 }, { fontFamily: 'Poppins-Light'}]}>
          ¿Donde quieres obtener beneficios hoy?
        </Text>
        <View style={[styles.fill, { marginBottom: 15 }]}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            {
              list.map((el, key) => 
                <TouchableOpacity style={styles.card} key={el.id} onPress={() => onPress(el)}>
                  <View style={{ flex: 1 }}>
                    <ImageBackground
                      source={{ uri: el.img_cover || '' }}
                      style={{ flex: 1 }}
                    >
                      <LinearGradient
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        colors={['rgba(0, 0, 0, .6)', 'transparent']}
                      >
                        <Text style={[{ color: 'white', fontSize: 16, fontWeight: 'bold' }, { fontFamily: 'Poppins-Light'}]}>{el.name}</Text>
                      </LinearGradient>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
              )
            }
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 14 }}>Pronto más ciudades</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </TouchableOpacity>
  ); 
}

export default CityPicker

const styles = StyleSheet.create({
  tap: {
    height,
    width,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)'
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    height: height * .55,
    width: width * .95,
    marginTop: height * .42,
    borderRadius: 10,
    padding: 25,
    zIndex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    color: 'white',
  },
  fill: {
    flex: 1,
  },
  card: {
    height: 60,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    // borderColor: 'lightgray',
    // borderBottomWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 15,
  }
});