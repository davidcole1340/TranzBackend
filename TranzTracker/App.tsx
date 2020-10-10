import 'react-native-gesture-handler'
import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { Base } from './navigators'
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

export default function App() {
  const scheme = useColorScheme()

  return (
    <AppearanceProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar barStyle="default" />
        <Base />
      </NavigationContainer>
    </AppearanceProvider>
  );
}