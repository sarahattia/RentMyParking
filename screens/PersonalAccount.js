import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';

const PersonalAccount = () => {
  const [reservationRequests, setReservationRequests] = useState([
    { id: 1, name: 'Reservation 1', note: '' },
    { id: 2, name: 'Reservation 2', note: '' },
  ]);

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

  const handleAccept = (requestId) => {
    const note = reservationRequests.find(req => req.id === requestId).note;
    if (note === '') {
      Alert.alert('Please enter a note for the client.');
    } else {
      Alert.alert('Reservation accepted', `Note: ${note}`);
    }
  };

  const handleReject = (requestId) => {
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this reservation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => Alert.alert('Reservation rejected'),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Personal Account</Text>

      <View style={styles.requestSection}>
        <Text style={styles.sectionTitle}>Reservation Requests</Text>
        {reservationRequests.map((request) => (
          <View key={request.id} style={styles.requestItem}>
            <Text style={styles.requestText}>{request.name}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a note for the client"
              value={request.note}
              onChangeText={(text) =>
                setReservationRequests((prevRequests) =>
                  prevRequests.map((req) =>
                    req.id === request.id ? { ...req, note: text } : req
                  )
                )
              }
            />
            <View style={styles.requestButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccept(request.id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleReject(request.id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Modify Personal Information</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <View style={styles.radioGroup}>
          <Text style={styles.optionLabel}>User:</Text>

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

        <TouchableOpacity style={styles.button}>
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
  },
  requestSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
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
});

export default PersonalAccount;

