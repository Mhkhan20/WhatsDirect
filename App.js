import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert, Linking, TouchableOpacity, Text, ScrollView, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CountryPicker from 'react-native-country-picker-modal';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For tab icons

const Tab = createBottomTabNavigator();

// Home Screen (WhatsApp functionality with animations)
function HomeScreen({ history, setHistory }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [buttonAnim] = useState(new Animated.Value(1)); // Animation value for button

  // Function to handle WhatsApp opening
  const openWhatsApp = () => {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    const whatsappURL = `https://wa.me/${cleanPhoneNumber}`;

    Keyboard.dismiss();

    Linking.openURL(whatsappURL)
      .then(() => {
        // Add the number to the history after a successful attempt
        setHistory([phoneNumber, ...history]);
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to open the URL');
      });
  };

  // Button press animation
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
        <View style={styles.inputContainer}>
          <CountryPicker
            countryCode={countryCode}
            withFilter
            withFlag
            withCallingCode
            onSelect={onSelect}
            containerButtonStyle={styles.countryPicker}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Animated.View style={[styles.button, { transform: [{ scale: buttonAnim }] }]}>
            <TouchableOpacity
              style={styles.touchableButton}
              onPress={openWhatsApp}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>Open WhatsApp</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.button, { transform: [{ scale: buttonAnim }] }]}>
            <TouchableOpacity
              style={styles.touchableButton}
              onPress={clearInput}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
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
  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>History</Text>
      <ScrollView>
        {history.length > 0 ? (
          history.map((number, index) => (
            <Text key={index} style={styles.historyItem}>
              {number}
            </Text>
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
  const [history, setHistory] = useState([]); // Move the history state here

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
    backgroundColor: '#fff', // Set background color to white
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
    borderColor: 'grey',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    width: '80%',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
  },
  touchableButton: {
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
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
  historyItem: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
