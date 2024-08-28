import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';
import { db } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';


const isNumeric = (str) => {
  for (let i = 0; i < str.length; i++) {
    if (str[i] < '0' || str[i] > '9') {
      return false;
    }
  }
  return true;
};

export default function SignUpPage({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [user, setUser] = useState('to rent');
  const [parkAddress, setParkAddress] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [city, setCity] = useState('');
  const [sizeOfPark, setSizeOfPark] = useState('');
  const [howToOpenPark, setHowToOpenPark] = useState('');
  const [isElectricalCharge, setIsElectricalCharge] = useState(false);
  const [note, setNote] = useState('');

  const handleSignUp = async () => {
    if (firstName.length < 3) {
      Alert.alert('First name needs at least 3 characters!');
      return;
    }

    if (lastName.length < 3) {
      Alert.alert('Last name needs at least 3 characters!');
      return;
    }

    if (id.length !== 9 || !isNumeric(id)) {
      Alert.alert('ID needs 9 numbers!');
      return;
    }

    if (phone.length !== 10 || !isNumeric(phone)) {
      Alert.alert('Phone number needs 10 numbers!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      Alert.alert('Email is not valid');
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    if (!passwordRegex.test(Password)) {
      Alert.alert(
        'Password needs to be between 8 and 16 characters and contain at least a number, an uppercase letter, a lowercase letter.'
      );
      return;
    }

    if (user === 'both' || user === 'toRentMyPlace') {
      if (parkAddress.length < 3) {
        Alert.alert('Park Address is required!');
        return;
      }
  
      if (!streetNumber ) {
        Alert.alert('Street Number is required!');
        return;
      }
  
      if (city.length < 3) {
        Alert.alert('City needs at least 3 characters!');
        return;
      }
  
      if (!sizeOfPark) {
        Alert.alert('Please select a Size of Park!');
        return;
      }
  
      if (!howToOpenPark) {
        Alert.alert('Please select an option for How to Open the Park!');
        return;
      }
    }

    try {
     
      const docRef = await addDoc(collection(db, 'Users'), {
        firstName,
        lastName,
        id,
        phone,
        Email,
        Password,
        user,
        parkAddress,
        streetNumber,
        city,
        sizeOfPark,
        howToOpenPark,
        isElectricalCharge,
        note,
      });
      
      console.log('User added with ID: ', docRef.id);
      Alert.alert('Sign up successful!');
      navigation.navigate('SignIn'); 

    } catch (e) {
      console.error('Error adding document: ', e);
      Alert.alert('Error signing up:', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

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
        placeholder="ID"
        value={id}
        onChangeText={(text) => setId(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={Email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={Password}
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

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFA500',
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
    flexDirection: 'column',
    width: '80%',
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  extraFields: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 3,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
