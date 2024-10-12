import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert, Linking, ImageBackground, TouchableOpacity, Text, Image, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

export default function App() { 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US'); // Default country code (US)
  const [callingCode, setCallingCode] = useState('1'); // Default calling code (1 for US)
  const [history, setHistory] = useState([]); // Store the history of phone numbers

  // Function called when the button is pressed
  const openWhatsApp = () => { 
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove any non-digit characters
    const whatsappURL = `https://wa.me/${cleanPhoneNumber}`;

    Keyboard.dismiss(); // Close the keyboard when the button is pressed

    Linking.openURL(whatsappURL)
      .then(() => {
        // Add the number to the history after a successful attempt
        setHistory([phoneNumber, ...history]); // Adds to the beginning of the array
      })
      .catch(() => { 
        Alert.alert('Error', 'Failed to open the URL');
      });
  };

  // Function to handle country selection
  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setPhoneNumber(`+${country.callingCode[0]}`);
  };

  // Function to clear the input field
  const clearInput = () => {
    setPhoneNumber('');
    Keyboard.dismiss(); // Close the keyboard when clearing the input
  };

  return ( 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground 
        source={require('./assets/whatsappBG.jpg')} 
        style={styles.background}
      >
        <View style={styles.container}>

          <TouchableOpacity>
            <Image source={require('./assets/wlogo.png')} style={styles.logo} />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            {/* Country Picker (Flag and Calling Code) */}
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              onSelect={onSelect}
              containerButtonStyle={styles.countryPicker}
            />

            {/* Phone number input */}
            <TextInput 
              style={styles.inputBox}
              placeholder='Enter phone number'
              keyboardType='phone-pad'
              onChangeText={setPhoneNumber}
              value={phoneNumber}
            />
          </View>

          {/* Button container */}
          <View style={styles.buttonContainer}>
            {/* Open WhatsApp Button */}
            <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
              <Text style={styles.buttonText}>Open WhatsApp</Text>
            </TouchableOpacity>

            {/* Clear Button */}
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearInput}>
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Display the history of phone numbers */}
          {history.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>History:</Text>
              <ScrollView>
                {history.map((number, index) => (
                  <Text key={index} style={styles.historyItem}>{number}</Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  logo:{
    width: 100,
    height: 100,
    alignSelf: 'center', 
    marginBottom: 40, 
  },
  background: { 
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    width: '80%'  // Set input width to 80%
  },
  buttonContainer: {
    width: '80%',  // Match the width of the text input
    alignItems: 'center',  // Center the buttons
  },
  button: { 
    backgroundColor: '#14DC5A',  // Green color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',  // Full width of the container
    marginVertical: 5,  // Space between buttons
  },
  buttonText: { 
    color: "#fff",
    fontSize: 16,
    textAlign: 'center',
  },
  historyContainer: {
    width: '80%',
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 14,
    paddingVertical: 5,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  }
});
