import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { getUser } from '../../utils/sessionUser';
import { categories, locationCitiesCategories } from '../../feathers';

const { height, width } = Dimensions.get('window');

class CityPicker extends Component {
  state = {
    categories: [],
  }
  async componentDidMount(parent_id) {
    const jsonUser = await getUser();
    const { establishment } = await JSON.parse(jsonUser);
    
    // FETCH CATEGORIES
    const { data } = await locationCitiesCategories.find({ query: { $limit: 1000, city_id: establishment.city_id } });
    const { data: dataCategories } = await categories.find({ query: { parent_id: parent_id || 0, id: { $in: data.map(el => el.category_id) } } });
    this.setState({ categories: dataCategories });
    // LAS CATEGORIES YA ESTAN EN EL STATE. SE VA A VERIFICAR SI UN CATEGORY TIENE HIJOS
    const ids = dataCategories.map(category => category.id);
    const { data: subCategoriesData } = await categories.find({ query: { parent_id: { $in: ids }, id: { $in: data.map(el => el.category_id) } } });
    const finalCategories = dataCategories.map(el => {
      const hasChild = subCategoriesData.find(sub => sub.parent_id == el.id);
      return ({
        ...el,
        hasChild: hasChild ? true : false,
      })
    });
    console.log('final categories', finalCategories);
    this.setState({ categories: finalCategories });
  }
  render() {
    const { categories } = this.state;
    const { componentId, handlePress, users = {}, must } = this.props;
    const { user = {} } = users;
    const onPress = (el) => {
      console.log(el)
      if (el.hasChild) {
        this.componentDidMount(el.id)
        return;
      }
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
          {/* <Text style={[styles.title, { marginBottom: 18 }, { fontFamily: 'Poppins-Light'}]}>
            ¿Donde quieres obtener beneficios hoy?
          </Text> */}
          <View style={[styles.fill, { marginBottom: 15 }]}>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
              {
                categories.map((el, key) => 
                  <TouchableOpacity style={styles.card} key={el.id} onPress={() => onPress(el)}>
                    <View style={{ flex: 1 }}>
                      <ImageBackground
                        source={{ uri: el.banner ? el.banner : '' }}
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
            </ScrollView>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
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
    height: height * .75,
    width: width * .95,
    marginTop: height * .22,
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