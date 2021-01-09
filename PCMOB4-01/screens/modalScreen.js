import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function modalScreen( {navigation,route} )
{
  const [text, setText] = useState("");
  const [mode, setMode] = useState("");
  const [noteId, setId] = useState("0");

  useEffect(() => {
    if (route.params.mode === "new")
      { setMode("new") }
    else
      {
        setMode("modify");
        setId(route.params.itemId)
      }
  }, [route.params.itemId]);


  return (
    <View style={styles.modalScreenContainer}>
      <View style={styles.modalScreenInnerContainer}>
       <View style={styles.modalScreenTextContainer}>
          <Text style={styles.modalScreenText}>Task:</Text>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={(input) => setText(input)}
          />
        </View>
        <TouchableOpacity style={styles.modalScreenBtn} onPress = {() =>{navigation.navigate("To Do", {text, mode, noteId})}}>
          <Text style={styles.modalScreenBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalScreenBtn} onPress = {() =>{navigation.goBack()}}>
          <Text style={styles.modalScreenBtnText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

    modalScreenContainer: {
      flex: 1,
      backgroundColor: 'white',
      padding: 50,
      justifyContent: "center"
    },
  
    modalScreenInnerContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  
    modalScreenTextContainer: {
      width: "100%"
    },
  
    modalScreenBtn: {
      backgroundColor: "#eeeeee",
      marginBottom: 10,
      paddingVertical: 10,
      width: 100,
      borderRadius: 20
    },
  
    modalScreenBtnText: {
      fontWeight: "600",
      textAlign: "center"
    },
  
    modalScreenText: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 5
  
    },
  
    textInput: {
      backgroundColor: "#eeeeee",
      height: 30,
      marginBottom: 50
    }
  
    
  });