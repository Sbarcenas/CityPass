import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { login } from '../feathers';

export default class extends Component {
  async componentDidMount() {
    try {
      const res = await login('user@user.com', 'secret');
      //alert(JSON.stringify(res));
    } catch (error) {
      alert(error.message)
    }
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray' }}>
        <Text>TESTING VIEW</Text>
      </View>
    );
  }
}
