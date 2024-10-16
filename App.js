import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Alert, Linking, TouchableOpacity, Text, ScrollView, Keyboard, TouchableWithoutFeedback, Animated, Clipboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CountryPicker from 'react-native-country-picker-modal';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import * as Location from 'expo-location'; // Use expo-location for location
import moment from 'moment'; // For date formatting

const Tab = createBottomTabNavigator();

// Set Colombia as the default country
const defaultCountry = {
  countryCode: 'US',
  callingCode: '1',
};

const regions = {
  'NA': ['US', 'CA', 'MX'], // North America
  'AS': ['CN', 'JP', 'IN', 'SG', 'PH', 'TH', 'VN'], // Asia
  'ME': ['AE', 'SA', 'KW', 'QA', 'OM', 'BH', 'JO', 'LB', 'EG', 'IQ'] // Middle East
};

// Function to check if a country is part of the selected regions (North America, Asia, Middle East)
const isValidRegion = (countryCode) => {
  return Object.values(regions).flat().includes(countryCode);
};

// Home Screen (WhatsApp functionality with animations)
function HomeScreen({ history, setHistory }) {
  const [phoneNumber, setPhoneNumber] = useState(`+${defaultCountry.callingCode}`);
  const [countryCode, setCountryCode] = useState(defaultCountry.countryCode);
  const [callingCode, setCallingCode] = useState(defaultCountry.callingCode);
  const [buttonAnim] = useState(new Animated.Value(1)); // Button animation
  const [inputAnim] = useState(new Animated.Value(1)); // Input animation for scaling
  const [borderAnim] = useState(new Animated.Value(0)); // Border color animation

  // Fetch user's location and set country code
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access location was denied. Defaulting to USA.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch country information using the OpenCage API
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=93171f9dee694929bf2199016da69941`)
        .then(response => response.json())
        .then(data => {
          if (data && data.results && data.results.length > 0) {
            const fetchedCountryCode = data.results[0].components['ISO_3166-1_alpha-2'];

            if (isValidRegion(fetchedCountryCode)) {
              // Set the country code and calling code from the fetched data
              setCountryCode(fetchedCountryCode);
              const fetchedCallingCode = data.results[0].annotations.callingcode || defaultCountry.callingCode;
              setCallingCode(fetchedCallingCode);
              setPhoneNumber(`+${fetchedCallingCode}`);
            } else {
              Alert.alert('Notice', 'Your location is outside of the supported regions. Defaulting to USA.');
              setPhoneNumber(`+${defaultCountry.callingCode}`);
              setCountryCode(defaultCountry.countryCode);
              setCallingCode(defaultCountry.callingCode);
            }
          } else {
            Alert.alert('Error', 'Unable to fetch country information. Defaulting to USA.');
            setPhoneNumber(`+${defaultCountry.callingCode}`);
            setCountryCode(defaultCountry.countryCode);
            setCallingCode(defaultCountry.callingCode);
          }
        })
        .catch(() => {
          Alert.alert('Error', 'Unable to fetch location data. Defaulting to USA.');
          setPhoneNumber(`+${defaultCountry.callingCode}`);
          setCountryCode(defaultCountry.countryCode);
          setCallingCode(defaultCountry.callingCode);
        });
    })();
  }, []);

  // Function to handle WhatsApp opening
  const openWhatsApp = () => {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    const whatsappURL = `https://wa.me/${cleanPhoneNumber}`;

    Keyboard.dismiss();

    Linking.openURL(whatsappURL)
      .then(() => {
        const newEntry = {
          phoneNumber,
          date: moment().format('YYYY-MM-DD'), // Store the date
        };
        setHistory([newEntry, ...history]);
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to open the URL');
      });
  };

  const handlePressIn = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Animations for TextInput focus
  const handleInputFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.spring(inputAnim, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.spring(inputAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const inputBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['grey', 'green'], // Animate between grey and green
  });

  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setPhoneNumber(`+${country.callingCode[0]}`);
  };

  const clearInput = () => {
    setPhoneNumber('');
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputAnim }] }]}>
          <CountryPicker
            countryCode={countryCode}
            withFilter
            withFlag
            withCallingCode
            onSelect={onSelect}
            containerButtonStyle={styles.countryPicker}
          />
          <Animated.View style={{ flex: 1, borderColor: inputBorderColor, borderWidth: 1 }}>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </Animated.View>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Animated.View style={[styles.button, { transform: [{ scale: buttonAnim }] }]}>
            <TouchableOpacity
              style={styles.touchableButton}
              onPress={openWhatsApp}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Start Chat</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.button, { transform: [{ scale: buttonAnim }] }]}>
            <TouchableOpacity
              style={styles.touchableButton}
              onPress={clearInput}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Ionicons name="close-circle" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// History Screen
function HistoryScreen({ history }) {
  // Function to copy a phone number to clipboard
  const copyToClipboard = (phoneNumber) => {
    Clipboard.setString(phoneNumber);
    Alert.alert('Copied to Clipboard', `Phone number ${phoneNumber} copied!`);
  };

  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Chat History</Text>
      <ScrollView>
        {history.length > 0 ? (
          history.map((entry, index) => (
            <TouchableOpacity key={index} onPress={() => copyToClipboard(entry.phoneNumber)}>
              <View style={styles.historyItemContainer}>
                <Ionicons name="chatbubble-ellipses" size={20} color="green" />
                <Text style={styles.historyItem}>{entry.phoneNumber}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.historyItem}>No history available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

// Main App with Bottom Tab Navigation
export default function App() {
  const [history, setHistory] = useState([]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home">
          {(props) => <HomeScreen {...props} history={history} setHistory={setHistory} />}
        </Tab.Screen>
        <Tab.Screen name="History">
          {(props) => <HistoryScreen {...props} history={history} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  countryPicker: {
    marginRight: 10,
  },
  inputBox: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    width: '80%',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    marginVertical: 5,
  },
  touchableButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
  historyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});
