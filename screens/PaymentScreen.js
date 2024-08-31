import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { RadioButton } from 'react-native-paper';
import { collection, addDoc,updateDoc,doc } from 'firebase/firestore'; 
import { db } from '../firebaseConfig';

const PaymentScreen = ({ route, navigation }) => {
  const {selectedAddress, userID } = route.params;
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [errorMsg, setErrorMsg] = useState(null);
  
  console.log(selectedAddress);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);


  const updateParkingAvailability = async () => {
    if (selectedAddress.id) {
      try {
        await updateDoc(doc(db, 'Users', selectedAddress.id), {
          available: false
        });
      } catch (e) {
        console.error('Error updating parking availability:', e);
      }
    }
  };


  const handleConfirm = async () => {

    if (paymentMethod === 'bit' || paymentMethod === 'paybox') {
      await updateParkingAvailability();
    if (paymentMethod === 'bit') {
      const bitPayUrl = 'https://www.bitpay.co.il/he';
      Linking.openURL(bitPayUrl).catch((err) => {
        console.error('Failed to open BIT:', err);
      });
    } else if (paymentMethod === 'paybox') {
      const payboxUrl = 'https://www.payboxapp.com/';
      Linking.openURL(payboxUrl).catch((err) => {
        console.error('Failed to open Paybox:', err);
      });

      
    } else {
      if (selectedAddress.id) {
        try {
          await addDoc(collection(db, 'ReservationRequests'), {
            requesterID: userID,
            ownerID: selectedAddress.id,
            parkAddress: selectedAddress.name,
            status: 'pending',
            timestamp: new Date(),
          });

          Alert.alert('Reservation Request Sent', 'The owner will be notified.');
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      } else {
        Alert.alert('Error', 'No owner ID provided.');
      }
    }}
  };

  const handleGoToPark = () => {
    if (location && selectedAddress) {
      const { latitude, longitude } = location.coords;
      const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes&to=${encodeURIComponent(selectedAddress.name)}`;
      Linking.openURL(wazeUrl).catch((err) => {
        console.error('Failed to open Waze:', err);
      });
    } else {
      Alert.alert('Error', 'Location or address not available');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion || {
          latitude: location?.coords.latitude || 31.8044,
          longitude: location?.coords.longitude || 34.6553,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Current Location"
            description="This is where you are"
            pinColor="blue"
          />
        )}
        {selectedAddress && (
          <Marker
            coordinate={selectedAddress.coordinate}
            title={selectedAddress.name}
            pinColor="red"
          />
        )}
      </MapView>
      <ScrollView style={styles.details}>
        <Text style={styles.header}>You want to reserve this park:</Text>
        <Text style={styles.address}>{selectedAddress?.name}</Text>
        {selectedAddress?.option === 'true' && (
          <Text style={styles.option}>Electrical charge available</Text>
        )}
        <Text style={styles.header}>How do you want to pay?</Text>
        <RadioButton.Group
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value)}
        >
          <RadioButton.Item label="Pay with BIT" value="bit" />
          <RadioButton.Item label="Pay with Paybox" value="paybox" />
          <RadioButton.Item label="Pay with Cash to the Owner" value="cash" />
        </RadioButton.Group>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goToParkButton} onPress={handleGoToPark}>
          <Text style={styles.goToParkButtonText}>Go to the Park</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 0.6,
    width: '100%',
  },
  details: {
    flex: 0.4,
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    marginTop: 20,
  },
  option: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  goToParkButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  goToParkButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PaymentScreen;
