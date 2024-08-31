import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';
import { doc, getDoc, updateDoc, collection, onSnapshot, query, where } from 'firebase/firestore'; 
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';

const PersonalAccount = () => {
  const route = useRoute();
  const { userID } = route.params || {};

  const [reservationRequests, setReservationRequests] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('to rent');
  const [parkAddress, setParkAddress] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [city, setCity] = useState('');
  const [sizeOfPark, setSizeOfPark] = useState('');
  const [howToOpenPark, setHowToOpenPark] = useState('');
  const [isElectricalCharge, setIsElectricalCharge] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (userID) {
      const unsubscribeUser = onSnapshot(doc(db, 'Users', userID), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setPassword('');
          setUser(data.user || 'to rent');
          setParkAddress(data.parkAddress || '');
          setStreetNumber(data.streetNumber || '');
          setCity(data.city || '');
          setSizeOfPark(data.sizeOfPark || '');
          setHowToOpenPark(data.howToOpenPark || '');
          setIsElectricalCharge(data.isElectricalCharge || false);
          setNote(data.note || '');
        } else {
          console.log('No such document!');
        }
      });

      const unsubscribeRequests = onSnapshot(
        query(
          collection(db, 'ReservationRequests'),
          where('status', '==', 'pending'),
          where('ownerID', '==', userID)
        ),
        async (querySnapshot) => {
          const newRequests = [];
          try {
            for (const docSnap of querySnapshot.docs) {
              const requestData = docSnap.data();
              
              if (requestData.requesterID) {
                const requesterDoc = await getDoc(doc(db, 'Users', requestData.requesterID));
                const requesterData = requesterDoc.data();
                
                newRequests.push({
                  id: docSnap.id,
                  ...requestData,
                  firstName: requesterData?.firstName,
                  lastName: requesterData?.lastName
                });
              } else {
                newRequests.push({
                  id: docSnap.id,
                  ...requestData,
                  firstName: 'Unknown',
                  lastName: 'Unknown'
                });
              }
            }
            setReservationRequests(newRequests);
          } catch (error) {
            console.error('Error retrieving reservation requests or user data:', error);
          }
        }
      );

      const unsubscribePastRequests = onSnapshot(
        query(
          collection(db, 'ReservationRequests'),
          where('status', 'in', ['accepted', 'rejected']),
          where('requesterID', '==', userID)
        ),
        async (querySnapshot) => {
          const pastRequests = [];
          try {
            for (const docSnap of querySnapshot.docs) {
              const requestData = docSnap.data();
              
              if (requestData.requesterID) {
                const requesterDoc = await getDoc(doc(db, 'Users', requestData.requesterID));
                const requesterData = requesterDoc.data();
                
                pastRequests.push({
                  id: docSnap.id,
                  ...requestData,
                  firstName: requesterData?.firstName,
                  lastName: requesterData?.lastName
                });
              } else {
                pastRequests.push({
                  id: docSnap.id,
                  ...requestData,
                  firstName: 'Unknown',
                  lastName: 'Unknown'
                });
              }
            }
            setPastRequests(pastRequests);
          } catch (error) {
            console.error('Error retrieving past reservation requests or user data:', error);
          }
        }
      );

      return () => {
        unsubscribeUser();
        unsubscribeRequests();
        unsubscribePastRequests();
      };
    }
  }, [userID]);

  const handleAccept = async (requestId) => {
    const request = reservationRequests.find(req => req.id === requestId);
    
    if (!request) {
      Alert.alert('Error', 'Request not found.');
      return;
    }
  
    if (request.note === '') {
      Alert.alert('Please enter a note for the client.');
    } else {
      try {
        await updateDoc(doc(db, 'ReservationRequests', requestId), {
          note: request.note,
          status: 'accepted'
        });
  
        const userRef = doc(db, 'Users', userID);
        await updateDoc(userRef, {
          available: false
        });
  
        Alert.alert('Reservation accepted', `Note: ${request.note}`);
        
        setReservationRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === requestId ? { ...req, status: 'accepted' } : req
          )
        );
      } catch (error) {
        console.error('Error updating reservation request or user data:', error);
      }
    }
  };

  const handleReject = async (requestId) => {
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this reservation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Reservation rejected');
            await updateReservationRequestStatus(requestId, 'rejected');
          },
        },
      ]
    );
  };

  const updateReservationRequestStatus = async (requestId, status) => {
    try {
      await updateDoc(doc(db, 'ReservationRequests', requestId), {
        status: status,
      });

      setReservationRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status } : req
        )
      );
    } catch (error) {
      console.error('Error updating reservation request status: ', error);
    }
  };

  const handleSaveChanges = async () => {
    if (userID) {
      const updatedFields = {};
  
      if (firstName !== userData.firstName) updatedFields.firstName = firstName;
      if (lastName !== userData.lastName) updatedFields.lastName = lastName;
      if (password) updatedFields.Password = password; 
      if (user !== userData.userType) updatedFields.userType = user;
      if (parkAddress !== userData.parkAddress) updatedFields.parkAddress = parkAddress;
      if (streetNumber !== userData.streetNumber) updatedFields.streetNumber = streetNumber;
      if (city !== userData.city) updatedFields.city = city;
      if (sizeOfPark !== userData.sizeOfPark) updatedFields.sizeOfPark = sizeOfPark;
      if (howToOpenPark !== userData.howToOpenPark) updatedFields.howToOpenPark = howToOpenPark;
      if (isElectricalCharge !== userData.isElectricalCharge) updatedFields.isElectricalCharge = isElectricalCharge;
      if (note !== userData.note) updatedFields.note = note;
  
      if (Object.keys(updatedFields).length > 0) {
        const docRef = doc(db, 'Users', userID);
        await updateDoc(docRef, updatedFields);
  
        Alert.alert('Changes saved successfully!');
      } else {
        Alert.alert('No changes detected.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Personal Account</Text>
      
      <View style={styles.requestSection}>
        <Text style={styles.sectionTitle}>New Reservation Requests</Text>
        {reservationRequests.length > 0 ? (
          reservationRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <Text>{request.firstName} {request.lastName} wants to rent your parking</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter note for client"
                value={note}
                onChangeText={setNote}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleAccept(request.id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleReject(request.id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No pending requests</Text>
        )}
      </View>
      
      <View style={styles.requestSection}>
        <Text style={styles.sectionTitle}>Past Reservation Requests</Text>
        {pastRequests.length > 0 ? (
          pastRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <Text>{request.firstName} {request.lastName} {request.status === 'accepted' ? 'accepted your reservation' : 'rejected your reservation'}</Text>
              {request.note && <Text>Note: {request.note}</Text>}
            </View>
          ))
        ) : (
          <Text>No past requests</Text>
        )}
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

<View style={styles.radioGroup}>
          <Text style={styles.optionLabel}>User Type:</Text>

          <View style={styles.radioItem}>
            <RadioButton
              value="to rent"
              status={user === 'to rent' ? 'checked' : 'unchecked'}
              onPress={() => setUser('to rent')}
              color="#FFA500"
              uncheckedColor='#FFA500'
            />
            <Text>To rent</Text>
          </View>

          <View style={styles.radioItem}>
            <RadioButton
              value="toRentMyPlace"
              status={user === 'toRentMyPlace' ? 'checked' : 'unchecked'}
              onPress={() => setUser('toRentMyPlace')}
              color="#FFA500"
              uncheckedColor='#FFA500'
            />
            <Text>To rent my place</Text>
          </View>

          <View style={styles.radioItem}>
            <RadioButton
              value="both"
              status={user === 'both' ? 'checked' : 'unchecked'}
              onPress={() => setUser('both')}
              color="#FFA500"
              uncheckedColor='#FFA500'
            />
            <Text>Both</Text>
          </View>
        </View>

        {(user === 'both' || user === 'toRentMyPlace') && (
          <View style={styles.extraFields}>
            <TextInput
              style={styles.input}
              placeholder="Park Address"
              value={parkAddress}
              onChangeText={(text) => setParkAddress(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Street Number"
              value={streetNumber}
              onChangeText={(text) => setStreetNumber(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={(text) => setCity(text)}
            />

            <Text style={styles.optionLabel}>Size of Park:</Text>
            <View style={styles.radioGroup}>
              <View style={styles.radioItem}>
                <RadioButton
                  value="motorcycle"
                  status={sizeOfPark === 'motorcycle' ? 'checked' : 'unchecked'}
                  onPress={() => setSizeOfPark('motorcycle')}
                  color="#FFA500"
                />
                <Text>Motorcycle</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton
                  value="car"
                  status={sizeOfPark === 'car' ? 'checked' : 'unchecked'}
                  onPress={() => setSizeOfPark('car')}
                  color="#FFA500"
                />
                <Text>Car</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton
                  value="truck"
                  status={sizeOfPark === 'truck' ? 'checked' : 'unchecked'}
                  onPress={() => setSizeOfPark('truck')}
                  color="#FFA500"
                />
                <Text>Truck</Text>
              </View>
            </View>

            <Text style={styles.optionLabel}>How to open the Park:</Text>
            <View style={styles.radioGroup}>
              <View style={styles.radioItem}>
                <RadioButton
                  value="remote"
                  status={howToOpenPark === 'remote' ? 'checked' : 'unchecked'}
                  onPress={() => setHowToOpenPark('remote')}
                  color="#FFA500"
                  uncheckedColor='#FFA500'
                />
                <Text>Remote</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton
                  value="phoneCall"
                  status={howToOpenPark === 'phoneCall' ? 'checked' : 'unchecked'}
                  onPress={() => setHowToOpenPark('phoneCall')}
                  color="#FFA500"
                  uncheckedColor='#FFA500'
                />
                <Text>Phone Call</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton
                  value="open"
                  status={howToOpenPark === 'open' ? 'checked' : 'unchecked'}
                  onPress={() => setHowToOpenPark('open')}
                  color="#FFA500"
                  uncheckedColor='#FFA500'
                />
                <Text>Open</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton
                  value="semiOpen"
                  status={howToOpenPark === 'semiOpen' ? 'checked' : 'unchecked'}
                  onPress={() => setHowToOpenPark('semiOpen')}
                  color="#FFA500"
                  uncheckedColor='#FFA500'
                />
                <Text>Semi-Open</Text>
              </View>
            </View>

            <Text style={styles.optionLabel}>Option:</Text>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={isElectricalCharge ? 'checked' : 'unchecked'}
                onPress={() => setIsElectricalCharge(!isElectricalCharge)}
                color="#FFA500"
                uncheckedColor='#FFA500'
              />
              <Text>Electric charge available</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Note"
              value={note}
              onChangeText={(text) => setNote(text)}
            />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFA500',
  },
  requestSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#FFA500',
  },
  requestItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  requestText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#FFA500',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: '#FFA500',
  },
  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  formSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#FFA500',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: '#FFA500',
  },
  radioGroup: {
    marginBottom: 15,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  extraFields: {
    marginTop: 15,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PersonalAccount;
