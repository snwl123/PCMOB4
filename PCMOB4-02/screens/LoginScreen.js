import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import firebase from "../database/firebaseDB";

const auth = firebase.auth();

export default function LoginScreen({ navigation }) {

  const [status, setStatus] = useState("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function login() {
    Keyboard.dismiss();
    setLoading(true);
    setError("");
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Signed in!");
        setLoading(false);
        setStatus("Login")
      })
      .catch((error) => {
        setError("Invalid Credentials")
        console.log("Error!");
        setLoading(false);
      });
  }

  function signup() {
    Keyboard.dismiss();
    setLoading(true);
    setError("");
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Registration Successful!");
        console.log("Signed in!");
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message)
        console.log(error.message);
        setLoading(false);
      });
  }

  function statusAction()
  {
    if (status === "Login")
    {
      login();
    }
    else
    {
      signup();
    }
  }

  function changeStatus()
  {
    if (status === "Login")
    {
      setStatus("Register")
    }
    else
    {
      setStatus("Login")
    }
  }

  return (
    <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
      <View style = {styles.container}>
        <Text style = {styles.title}>Chat App</Text>
        <Text style = {styles.fieldTitle}>Email</Text>
        <TextInput
          style = {styles.input}
          placeholder = "Enter Email"
          value = {email}
          onChangeText = {(text) => setEmail(text)}
        />
        <Text style = {styles.fieldTitle}>Password</Text>
        <TextInput
          style = {styles.input}
          placeholder = "Enter Password"
          value = {password}
          onChangeText = {(text) => setPassword(text)}
          secureTextEntry = {true}
        />
        <View style = {styles.innerContainer}>
          <TouchableOpacity style = {styles.loginButton} onPress = {statusAction}>
            <Text style = {styles.loginButtonText}>{status}</Text>
          </TouchableOpacity>
          <Text>{loading === false? null : <ActivityIndicator style = {styles.activityIndicator} size="small"/>}</Text>
        </View>
        <View style = {styles.innerContainer2}>
          <Text style = {styles.registerText}>{status === "Login"? "Need an account?": "Already registered?"}</Text>
          <TouchableOpacity style = {styles.registerButton} onPress = {changeStatus}>
              <Text style = {styles.registerButtonText}>{status === "Login"? "Register": "Login"}</Text>
          </TouchableOpacity>
        </View>
        <Text style = {styles.errorText}>{error}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create
({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
    alignItems: "center",
    justifyContent:"center"
  },

  title: {
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 25,
    width: 200,
  },

  fieldTitle: {
    fontSize: 14,
    marginBottom: 5,
    width: 200
  },

  input: {
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: "#ddd",
    width: 200,
    padding: 2
  },

  innerContainer: {
    width: 200,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },

  loginButton: {
    paddingVertical: 10,
    width: 80,
    marginVertical: 10,
    backgroundColor: "#dbe9ff"
  },

  loginButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
    textAlign: "center"
  },

  innerContainer2: {
    width: 200,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30
  },


  registerText: {
    fontSize: 13,
    color: "#777"
  },
  registerButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777",
    marginLeft: 5
  },
  
  
  activityIndicator: {
    marginLeft: 30
  },

  errorText: {
    fontSize: 12,
    color: "#ff977a",
    marginTop: 15,
    width: 200
  },

 
})
