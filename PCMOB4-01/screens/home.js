import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; 
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

import firebase from "../database/firebaseDB"

const db = SQLite.openDatabase("notes.db");
console.log(FileSystem.documentDirectory);


export default function homeScreen( {navigation, route} )
{
  firebase.firestore().collection("todos").add
  ({
    testing: "Hello"
  })

  const [notes, setNotes] = useState([]);

  function refreshNotes() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes",
        null,
        (txObj, { rows: { _array } }) => setNotes(_array),
        (txObj, error) => console.log(`Error: ${error}`)
      );
    });
  }

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS notes
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          done INT)
        `
        );
      },
      null,
      refreshNotes
    );
  }, []);

  useEffect(() => {
    if (route.params?.text && route.params?.mode === "new")
    {
      db.transaction(
        (tx) => {
          tx.executeSql("INSERT INTO notes (id, done, title) VALUES (?, 0, ?)", [
            getLastValue(route.params.noteId), route.params.text
          ]);
        },
        null,
        refreshNotes
      );
    }
    else if (route.params?.text && route.params?.mode === "modify")
    {
      db.transaction(
        (tx) => {
          tx.executeSql("UPDATE notes SET title = ? WHERE id = ?", [
            route.params.text, route.params.noteId
          ]);
        },
        null,
        refreshNotes
      );
    }
  }, [route.params?.text, route.params?.mode, route.params?.noteId]);


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => 
        (
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

  function addNote(mode,itemId)
  {
      {navigation.navigate("modalScreen",{mode,itemId})}
  }

  function deleteNote(itemId)
  {
    db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM notes WHERE id = ?", [itemId]
        );
    },
    null,
    refreshNotes
    );
  }

  function checkItem(itemId)
  {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE notes SET done = 1 WHERE id = ?", [itemId]
      );
    },
    null,
    refreshNotes
    );
    getLastValue(itemId)
  }

  function uncheckItem(itemId)
  {
    db.transaction((tx) => {
        tx.executeSql(
          "UPDATE notes SET done = 0 WHERE id = ?", [itemId]
        );
    },
    null,
    refreshNotes
    );
  }

  function getLastValue(itemId)
  {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT MAX(id) FROM NOTES",
        null,
        (txObj, { rows: { _array }}) => updateItemId( _array[0]["MAX(id)"], itemId ),
        (txObj, error) => console.log(`Error: ${error}`)
      ),
      null,
      refreshNotes
    });
  }

  function updateItemId(lastValue,itemId)
  {
    db.transaction((tx) => {
        tx.executeSql(
          "UPDATE notes SET id = ? WHERE id = ?", [ (parseInt(lastValue) + 1).toString(), itemId ]
        )
      },
      null,
      refreshNotes
    );
  }


  function toDoList( {item} )
  {
    return (
        <View style={styles.toDoListItemContainer}>
            <TouchableOpacity onPress= {() => addNote("modify", item.id.toString())}>
              <Text style={ item.done === 0 ? styles.toDoListItemUnchecked : styles.toDoListItemChecked}>{item.title}</Text>
            </TouchableOpacity>
            <View style={styles.toDoListIconsContainer}>
              { item.done === 0 ? 
              <TouchableOpacity onPress= {() => checkItem(item.id.toString())}>
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
              { item.done === 1 ? 
              <TouchableOpacity onPress= {() =>uncheckItem(item.id.toString())}>
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
      <FlatList style = {styles.toDoList} data = {notes} renderItem = {toDoList} keyExtractor={(item) => item.id.toString()}/>
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
  