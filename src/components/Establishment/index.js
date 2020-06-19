import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';

const Establishment = ({ hit, onPress }) => (
  <TouchableOpacity style={{ width: '100%', marginBottom: 12 }}>
    <View style={{ width: '100%', height: 100, flexDirection: 'row', backgroundColor: 'white', borderRadius: 4, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: 100, backgroundColor: '#FAFAFA', borderRadius: 100, overflow: 'hidden' }}>
        <Image source={{ uri: hit.logo || '' }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
      </View>
      <View style={{ marginLeft: 10, width: 190 }}>
        <Text numberOfLines={1} style={{ fontWeight: 'bold' }}>{hit.name}</Text>
        <Text>{hit.schedule}</Text>
        <TouchableOpacity
          onPress={() => onPress(hit)}
        >
          <View
            style={{
              backgroundColor: '#473E69', borderRadius: 100, marginTop: 16,
              overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
            }}
          >
            <Text style={[{ fontFamily: 'Poppins-Light', paddingVertical: 3, paddingHorizontal: 15, color: 'white', fontSize: 16, }]}>
              Ver Comercio
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

export default Establishment;
