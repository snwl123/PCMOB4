import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function App({navigation, route}) {

  const [arrival,setArrival] = useState(null);

  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=" + route.params.busStopID

  useEffect(() =>
  {
    
    loadBusStopData();

    const interval = setInterval(loadBusStopData,60000);
    return() => clearInterval(interval);
  },
  
    [route.params.bus, route.params.busStopID]
  
  )


  function loadBusStopData()
  { 
    setArrival (null);

    fetch(BUSSTOP_URL)
      .then((response) => response.json())
      .then((responseData) =>
      { 
        const myBus = responseData.services.filter((item) => item.no === route.params.bus)[0];

        if (myBus == undefined)
        { 
            let newArrival =
            {
              arrivalTime: "Bus is unavailable",
              arrivalDuration: "Bus is unavailable"
            }

            setArrival ([newArrival])
        }
        
        else
        {   
            if (myBus.next.duration_ms < 0)
            {   
                let newArrival =
                {
                    arrivalTime: "Arrived",
                    arrivalDuration: "Arrived"
                }

                setArrival ([newArrival])
            }

            else
            {   
                let newArrival =
                {
                    arrivalTime: myBus.next.time,
                    arrivalDuration: String(Math.floor(myBus.next.duration_ms/60000)) + " minutes " + String(Math.floor((myBus.next.duration_ms/1000)%60)) + " seconds"
                }

                setArrival ([newArrival])
            }

        }

      })

  }

  function busNoScreen(oldBus)
  {
      {navigation.navigate("busNo", {oldBus})}
  }

  function busStopNoScreen(oldBusStopID)
  {
      {navigation.navigate("busStopNo", {oldBusStopID})}
  }


  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>{route.params.bus}</Text>
      <Text style={styles.textHeader}>Bus Arrival Time</Text>
      <Text style={styles.textSubheader}>{arrival === null? <ActivityIndicator size="small"/> : arrival[0]["arrivalDuration"]}</Text>
      <TouchableOpacity style={styles.button} onPress = {loadBusStopData}>
            <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
      <View style={styles.innerContainer}>
            <TouchableOpacity style={styles.button2} onPress = {() => busNoScreen(route.params.bus)}>
                <Text style={styles.buttonText}>Bus No.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress = {() => busStopNoScreen(route.params.busStopID)}>
                <Text style={styles.buttonText}>Bus Stop No.</Text>
            </TouchableOpacity>
      </View>
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
    marginBottom: 20,
    marginTop: 5
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

  innerContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: "auto",
    marginTop: 50
  },

  button2: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    margin: 5
  },

});