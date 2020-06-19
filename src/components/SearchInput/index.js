import React from 'react';
import { TouchableWithoutFeedback, View, Image, StyleSheet, Dimensions } from 'react-native';
import CustomFont from '../../components/CustomFont';
import { emitter } from '../../../'

const SearchInput = ({ style, componentId }) => {
  const onClick = () => {
    emitter.emit('gotoSearch');
  }
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={[styles.headerSearch, style]}>
        <CustomFont style={styles.headerSearchInput}>Buscar</CustomFont>
        <Image
          style={{ height: 16, resizeMode: 'contain' }}
          source={require('../../assets/iconsX/loupe.png')}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  headerSearch: {
    height: 26,
    width: 200,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderColor: 'white',
    paddingBottom: 5,
    paddingLeft: 5,
    borderBottomWidth: 1,
  },
  headerSearchInput: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 0,
    // width: '100%',
  },
})