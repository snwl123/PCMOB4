import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function App({navigation, route}) {

  const [bus, setBus] = useState("");

  function setbusNo(newBusNo)
    {
        if (newBusNo === "")
        {
          navigation.navigate("busInfo");
        }

        else
        {
          navigation.navigate("busInfo", {bus});
        }

    }

  return (
    <View style={styles.container}>
      <Text>Bus No</Text>
      <TextInput
            style={styles.textInput}
            value={bus}
            onChangeText={(input) => setBus(input)}
          />
      <TouchableOpacity style={styles.button} onPress = { () => setbusNo(bus) }>
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textInput: {
    backgroundColor: "#eeeeee",
    height: 20,
    marginTop: 10,
    marginBottom: 20,
    width: 100
  },

  button: {
    backgroundColor: "#ebfaff",
    borderRadius: 5
  },

  buttonText: {
    padding: 10,
    fontWeight: "600",
    color: "#333333"
  },

})