import { Text } from 'react-native';
import React from 'react';

export default ({ children, style, ...props }) => {
  return (
    <Text {...props} style={[style, { fontFamily: 'Poppins-Light'}]}>
      {children}
    </Text>
  );
}