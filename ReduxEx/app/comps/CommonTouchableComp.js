import React from 'react';
import { TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native';

function TouchableIOS(props) {
  return (
    <TouchableHighlight
      accessibilityTraits="button"
      underlayColor='rgba(255, 80, 0, 0.1)'
      {...props}
    />
  );
}

const CommonTouchableComp = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableIOS;

export default CommonTouchableComp;