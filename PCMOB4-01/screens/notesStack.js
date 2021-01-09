import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import homeScreen from "./home";



export default function notesStack()
{
  const innerStack = createStackNavigator();

  return (
    <innerStack.Navigator>
      <innerStack.Screen
        name="To Do"
        component={homeScreen}
      />
    </innerStack.Navigator>
  );
}