import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function App() {

  const [arrival,setArrival] = useState([]);
  const [busNo,setBusNo] = useState(0);


  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=83139"

  function resetBusStopData()
  {
    setArrival("");
    loadBusStopData();
  }

  function loadBusStopData()
  {
    fetch(BUSSTOP_URL)
      .then((response) =>
      {
        return response.json();
      })
      .then((responseData) =>
      {
        const myBus = responseData.services.filter
        ((item) => item.no === "155")[0];

        let newArrival =
        {
          arrivalTime: myBus.next.time,
          arrivalSeconds: myBus.next.duration_ms
        }

        setArrival
        ([
          ... arrival,newArrival
        ])

        console.log(myBus.next.duration_ms)
        setBusNo(myBus.no)
      })
  }

  useEffect(() => {
    // const interval = setInterval(loadBusStopData,1000);
    // return() => clearInterval(interval);
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>{busNo}</Text>
      <Text style={styles.textHeader}>Bus Arrival Time</Text>
      <Text style={styles.textSubheader}>{arrival === [] ? <ActivityIndicator size="small"/> : arrival[0]}</Text>
      <TouchableOpacity style={styles.button} onPress = {resetBusStopData}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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

  textHeader: {
    fontSize: 20,
    marginBottom:10
  },

  textSubheader: {
    fontSize: 15,
    marginBottom: 20
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

});