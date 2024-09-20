import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Linking, ImageBackground, TouchableOpacity, Text, Image } from 'react-native';

export default function App() { 
  // Initializing the variable holding the phone number
  const [phoneNumber, setPhoneNumber] = useState('');

  // The function called when the button is pressed
  const openWhatsApp = () => { 
    const whatsappURL = `https://wa.me/${phoneNumber}`;  // These are `` backticks
    
    Linking.openURL(whatsappURL)
      .catch(() => { 
        Alert.alert('Error', 'Failed to open the URL');
      });
  };

  return ( 
    <ImageBackground 
      source={require('./assets/whatsappBG.jpg')} // Use forward slashes for the file path
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('./assets/wlogo.png')} style={styles.logo} />
        <TextInput 
          style={styles.inputBox}
          placeholder='Enter number with the country code (Do not include +)'
          keyboardType='phone-pad'
          // Updating the state when the text changes
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
        <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
          <Text style={styles.buttonText}> Open WhatsApp</Text>
        </TouchableOpacity>


      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center'
  },
  logo:{
    width: 100,
    height: 100,
    alignSelf: 'center', // Center the logo horizontally
    marginBottom: 40, // Add some margin below the logo
  },
  background: { 
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  inputBox: { 
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background to make the text input readable
    width: '80%'
  },
  button: { 
    backgroundColor: '#14DC5A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '60%', // Set the button width
    alignSelf: 'center', // Center the button horizontally
  },
  buttonText: { 
    color: "#fff",
    fontSize: 16
  }
});
