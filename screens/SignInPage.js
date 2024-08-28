import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function SignInPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (email.length === 0) {
      Alert.alert('Email is required!');
      return;
    }

    if (password.length === 0) {
      Alert.alert('Password is required!');
      return;
    }

    try {
      const q = query(collection(db, 'Users'), where('Email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('User not found!');
        return;
      }

      const userDoc = querySnapshot.docs[0].data();
      const storedPassword = userDoc.Password; 

      if (password === storedPassword) {
        Alert.alert('Sign in successful!');
        navigation.navigate('Main');
      } else {
        Alert.alert('Invalid password!');
      }
    } catch (e) {
      console.error('Error signing in:', e);
      Alert.alert('Error signing in:', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight:'bold',
  },
  linkText: {
    color: '#FFA500',
    textDecorationLine: 'underline',
  },

});
