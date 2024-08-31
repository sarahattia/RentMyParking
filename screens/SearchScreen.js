import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { RadioButton, Checkbox } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const GOOGLE_MAPS_API_KEY = 'AIzaSyATIT0OmRrgvC5iKf_2UP-HqN1Qb6SbwVE';

const SearchScreen = ({ route }) => {
    const { userID } = route.params;
    
    const [city, setCity] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedParkingSize, setSelectedParkingSize] = useState('car');
    const [isElectricalCharge, setIsElectricalCharge] = useState(false);
    const [mapRegion, setMapRegion] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null); 
    const navigation = useNavigation();

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

    const geocodeAddress = async (address) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address: address,
                    key: GOOGLE_MAPS_API_KEY,
                },
            });
            if (response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry.location;
                return { latitude: lat, longitude: lng };
            } else {
                throw new Error('City not found');
            }
        } catch (error) {
            Alert.alert('Geocoding Error', 'Could not find the city. Please try again.');
            return null;
        }
    };

    const handleSearch = async () => {
        if (!city.trim()) {
            Alert.alert('City Required', 'Please enter a city to search for parking spots.');
            return;
        }

        try {
            const cityCoordinates = await geocodeAddress(city);
            if (cityCoordinates) {
                setMapRegion({
                    ...cityCoordinates,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });

                const querySnapshot = await getDocs(collection(db, 'Users'));
                const results = [];

                for (const doc of querySnapshot.docs) {
                    const data = doc.data();
                    console.log(`Checking parking spot ID: ${doc.id}`);
                    console.log(`Data: ${JSON.stringify(data)}`);

                    const matchesCity = data.city === city;
                    const matchesSize = data.sizeOfPark === selectedParkingSize;
                    const matchesAvailability = data.available === true;
                    const matchesElectricalCharge = !isElectricalCharge || (isElectricalCharge && data.isElectricalCharge === 'true');

                    console.log(`Matches city: ${matchesCity}`);
                    console.log(`Matches size: ${matchesSize}`);
                    console.log(`Matches availability: ${matchesAvailability}`);
                    console.log(`Matches electrical charge: ${matchesElectricalCharge}`);

                    if (matchesCity && matchesSize && matchesAvailability && matchesElectricalCharge) {
                        console.log('Parking spot matched!');
                        const fullAddress = `${data.streetNumber} ${data.parkAddress}, ${data.city}`;

                        const coordinates = await geocodeAddress(fullAddress);
                        if (coordinates) {
                            results.push({
                                id: doc.id,
                                name: fullAddress,
                                coordinate: coordinates,
                                available: data.available,
                                size: data.sizeOfPark,
                                isElectricalCharge: data.isElectricalCharge,
                            });
                        } else {
                            console.log('Failed to geocode address:', fullAddress);
                        }
                    }
                }

                setSearchResults(results);

                if (results.length === 0) {
                    Alert.alert('No Results', 'No parking spots match your criteria.');
                }
            }
        } catch (error) {
            console.error('Error during search:', error);
            Alert.alert('Error', 'Could not find the city. Please try again.');
        }
    };

    const handleSelectLocation = (location) => {
        setSelectedAddress(location); 
    };
  
    const handleReserve = () => {
        if (!selectedAddress) {
            Alert.alert('No selection', 'Please select a parking spot to reserve.');
            return;
        }

        navigation.navigate('Payment', { selectedAddress, userID});
        console.log (selectedAddress, userID, selectedAddress.id);
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
                {searchResults.map((address) => (
                    <Marker
                        key={address.id}
                        coordinate={address.coordinate}
                        title={address.name}
                        onPress={() => handleSelectLocation(address)}
                        pinColor={address.available ? "red" : "gray"}
                    />
                ))}
            </MapView>
            <ScrollView style={styles.filters}>
                <Text style={styles.filterTitle}>Where do you want to park?</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="City"
                    value={city}
                    onChangeText={(text) => setCity(text)}
                />
                <RadioButton.Group
                    value={selectedParkingSize}
                    onValueChange={(value) => setSelectedParkingSize(value)}
                >
                    <RadioButton.Item label="Car" value="car" />
                    <RadioButton.Item label="Motorcycle" value="motorcycle" />
                    <RadioButton.Item label="Truck" value="truck" />
                </RadioButton.Group>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={isElectricalCharge ? 'checked' : 'unchecked'}
                        onPress={() => setIsElectricalCharge(!isElectricalCharge)}
                    />
                    <Text style={styles.checkboxLabel}>Electrical Charge available</Text>
                </View>
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
                <Text style={styles.filterTitle}>Choose your park</Text>
                <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
                    <Text style={styles.reserveButtonText}>Reserve</Text>
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
    filters: {
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
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    searchButton: {
        backgroundColor: '#FFA500',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxLabel: {
        marginLeft: 10,
    },
    reserveButton: {
        backgroundColor: '#FFA500',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    reserveButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default SearchScreen;
