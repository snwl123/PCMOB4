import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import firebase from "../database/firebaseDB";



const db = firebase.firestore().collection("todos");



export default function NotesScreen({ navigation, route }) {


  const [notes, setNotes] = useState([]);



  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => addNote("new", "")}>
          <Ionicons
            name="ios-create-outline"
            size={30}
            color="black"
            style={{
              color: "#f55",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });




  useEffect(() =>
  {
    const unsubscribe = db.orderBy("done").orderBy("created").onSnapshot((collection) => 
    {
      const updatedNotes = collection.docs.map((doc) =>
      {
        const noteObject = {
          ...doc.data(),
          id: doc.id,
        };
        return noteObject;
      });
      setNotes(updatedNotes);
    });
    
    return () => { unsubscribe(); };
  },[]);
  



  // Monitor route.params for changes and add items to the database
  useEffect(() => {

    if (route.params?.noteId !== "")
    { 
      if (route.params?.text) {
        db.doc(route.params.noteId).update
        ({
          title: route.params.text,
          created: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    }
    else
    { 
      if (route.params?.text) {
        const newNote = {
          title: route.params.text,
          done: false,
          id: notes.length.toString(),
          created: firebase.firestore.FieldValue.serverTimestamp(),
        };
        db.add(newNote);
        setNotes([...notes, newNote]);
      }
    }

  }, [route.params?.text]);



  // This add a new note
  function addNote(mode, noteId) {
    navigation.navigate("Add Screen",{mode, noteId});
  }



  // This deletes an individual note
  function deleteNote(id) {

    db.doc(id).delete();
    setNotes(notes.filter((item) => item.id !== id));
  }


  // This checks note as done
  function checkNote(id) {

    db.doc(id).update({ 
      done: true,
      created: firebase.firestore.FieldValue.serverTimestamp()
    });

  }

  // This checks note as not yet done
  function uncheckNote(id) {

    db.doc(id).update({ 
      done: false,
      created: firebase.firestore.FieldValue.serverTimestamp()
    });

  }

  

  // The function to render each row in our FlatList
  function renderItem( {item} )
  {
    return (
        <View style={styles.toDoListItemContainer}>
            <TouchableOpacity onPress= {() => addNote("update", item.id.toString())}>
              <Text style={ item.done === false ? styles.toDoListItemUnchecked : styles.toDoListItemChecked}>{item.title}</Text>
            </TouchableOpacity>
            <View style={styles.toDoListIconsContainer}>
              { item.done === false ? 
              <TouchableOpacity onPress= {() => checkNote(item.id.toString())}>
                  <Ionicons
                      name="ios-checkmark"
                      size={20}
                      color="#333333"
                      style={{
                          marginRight: 10,
                      }}
                      />
              </TouchableOpacity>
              : null }
              { item.done === true ? 
              <TouchableOpacity onPress= {() =>uncheckNote(item.id.toString())}>
                  <Ionicons
                      name="arrow-undo-outline"
                      size={20}
                      color="#333333"
                      style={{
                          marginRight: 10,
                      }}
                      />
              </TouchableOpacity>
              : null }
              <TouchableOpacity onPress= {() => deleteNote(item.id.toString())}>
                  <Ionicons
                      name="ios-trash-outline"
                      size={20}
                      color="#333333"
                      style={{
                          marginRight: 5,
                      }}
                      />
              </TouchableOpacity>
            </View>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7e4',
    justifyContent: "center"
  },

  toDoListItemContainer: {
    padding: 20,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.2,
    display: "flex",
    justifyContent:"space-between",
    flexDirection: "row",
    alignItems:"center"
  },

  toDoListIconsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems:"center",
  },

  toDoListItemChecked: {
    fontSize: 15,
    textAlign: "left",
    color: "#999999",
    textDecorationLine: "line-through"
  },

  toDoListItemUnchecked: {
    fontSize: 15,
    textAlign: "left"
  },

  
});
