import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import notesStack from "./screens/notesStack";
import modalScreen from "./screens/modalScreen";
  

export default function App() {

  const stack = createStackNavigator();

  return (
    <NavigationContainer>
        <stack.Navigator headerMode="none" mode="modal">
          <stack.Screen name = "notesStack" component = {notesStack}/>
          <stack.Screen name = "modalScreen" component = {modalScreen}/>
        </stack.Navigator>
    </NavigationContainer>
  );
}