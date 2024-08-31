import React from 'react';
import { View, Text, Button,Image, StyleSheet, Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
    <Image
        source={require('./Home.jpg')}
        style={styles.image}/>
      <Text style={styles.title}> Welcome</Text>
  
      <Button
        title="Sign up"
        onPress={() => navigation.navigate('SignUp')}
      />

      <Button
        title="Log in to start !"
        onPress={() => navigation.navigate('SignIn')}
      />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DA9412'
  },
  title: {
    fontSize: 20,
    fontFamily:'Calibri-BoldItalic.fft',
    fontStyle:'italic',
    fontWeight:'bold',
    marginBottom: 20,
  },

  buttonText:{
    fontSize:18,
    fontFamily:'Calibri-Regular.fft',
    color:'#258EBE',
  },

  image:{
    width: width *0.9,
    height: undefined,
    aspectRatio: 700/600,
    resizeMode:'contain',
    marginBottom:20
  
  }
});
