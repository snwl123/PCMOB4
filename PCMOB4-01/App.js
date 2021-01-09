import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import home from "./screens/home";
import busInfo from "./screens/busInfo";
import busNo from "./screens/busNo";
import busStopNo from "./screens/busStopNo";

export default function App() {

  const stack = createStackNavigator();

  return (
    <NavigationContainer>
        <stack.Navigator headerMode="none" mode="modal">
          <stack.Screen name = "home" component = {home}/>
          <stack.Screen name = "busInfo" component = {busInfo}/>
          <stack.Screen name = "busNo" component = {busNo}/>
          <stack.Screen name = "busStopNo" component = {busStopNo}/>
        </stack.Navigator>
    </NavigationContainer>
  );
}