import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function App({navigation, route}) {

  const [arrival,setArrival] = useState(null);
  const [arrival2,setArrival2] = useState(null);

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
    setArrival2 (null);

    fetch(BUSSTOP_URL)
      .then((response) => response.json())
      .then((responseData) =>
      { 
        const myBus = responseData.services.filter((item) => item.no === route.params.bus)[0];

        if (myBus == undefined)
        { 
            let newArrival =
            {
              arrivalTime: "",
              arrivalDuration: "Bus is unavailable"
            }

            setArrival ([newArrival])
            setArrival2 ([newArrival])
        }
        
        else
        {   
            if (myBus.next.duration_ms < 0)
            {   
                let newArrival =
                {
                    arrivalTime: "",
                    arrivalDuration: "Arrived"
                }

                setArrival ([newArrival])
            }

            else
            {   
                let newArrival =
                {
                    arrivalTime: (new Date(myBus.next.time)).toLocaleTimeString(),
                    arrivalDuration: String(Math.floor(myBus.next.duration_ms/60000)) + " min " + String(Math.floor((myBus.next.duration_ms/1000)%60)) + " sec"
                }

                setArrival ([newArrival])
            }


            if (myBus.next2.duration_ms === null)
            {   
                let newArrival2 =
                {
                    arrivalTime: "",
                    arrivalDuration: "Arrived"
                }

                setArrival2 ([newArrival2])
            }

            else
            {   
                let newArrival2 =
                {
                    arrivalTime: (new Date(myBus.next2.time)).toLocaleTimeString(),
                    arrivalDuration: String(Math.floor(myBus.next2.duration_ms/60000)) + " min " + String(Math.floor((myBus.next2.duration_ms/1000)%60)) + " sec"
                }

                setArrival2 ([newArrival2])
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
      <Text style={styles.textHeader2}>Bus Arrival Time</Text>
      <View style={styles.innerContainer}>
        <Text style={styles.textSubheaderStrong}>{arrival === null? null : arrival[0]["arrivalTime"] }</Text>
        <Text style={styles.textSubheader}>{arrival === null? <ActivityIndicator size="small"/> : arrival[0]["arrivalDuration"]}</Text>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.textSubheader2Strong}>{arrival2 === null? null : arrival2[0]["arrivalTime"] }</Text>
        <Text style={styles.textSubheader2}>{arrival2 === null? <ActivityIndicator size="small"/> : arrival2[0]["arrivalDuration"]}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress = {loadBusStopData}>
            <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
      <View style={styles.innerContainer2}>
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
    marginBottom: 35
  },

  textHeader2: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "600"
  },

  textSubheader: {
    fontSize: 15
  },

  textSubheaderStrong: {
    fontSize: 15,
    fontWeight: "600"
  },

  textSubheader2: {
    fontSize: 12,
  },

  textSubheader2Strong: {
    fontSize: 12,
    fontWeight: "600"
  },

  button: {
    backgroundColor: "#ebfaff",
    borderRadius: 5,
    marginTop: 20
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
    marginBottom: 15
  },

  innerContainer2: {
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