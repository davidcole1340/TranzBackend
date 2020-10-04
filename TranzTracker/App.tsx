import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { Base } from './navigators'

export default function App() {
  return (
    <NavigationContainer>
      <Base />
    </NavigationContainer>
  );
}