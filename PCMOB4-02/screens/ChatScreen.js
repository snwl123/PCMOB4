import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import { GiftedChat } from "react-native-gifted-chat";
import firebase from "../database/firebaseDB";

const auth = firebase.auth();
const db = firebase.firestore().collection("messages");

export default function ChatScreen({ navigation }) {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <Ionicons
            name="log-out-outline"
            size={25}
            color="black"
            style={{
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {

    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);

    const unsubscribeSnapshot =
      db
        .orderBy("createdAt","desc")
        .onSnapshot((collectionSnapshot) => 
        {
          const serverMessages = collectionSnapshot.docs.map((doc) => {
            const data = doc.data();
            const returnData =
            {
              ...doc.data(),
              createdAt: new Date(data.createdAt.seconds * 1000),
            };
            setMessages(serverMessages);
            return returnData;
          });
        });
    
      const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Chat");
      } else {
        navigation.navigate("Login");
      }
    });

  

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };

  }, []);


  function onSend(newMessages) {
    console.log(newMessages);
    setMessages([...newMessages, ...messages]);
  }


  function logout() {
    auth.signOut();
  }


  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      renderUsernameOnMessage={true}
      listViewProps={{
        style: {
          backgroundColor: "#666",
        },
      }}
      user={{
        _id: 1,
        name: 1,
        avatar: "https://placeimg.com/140/139/any",
      }}
      showUserAvatar={true}
      showAvatarForEveryMessage={true}
    />
  );
}