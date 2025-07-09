// components/KYCForm.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const API_URL = 'http://172.16.50.183:9000/api'; // ✅ Replace this with your actual backend IP

export default function KYCFormScreen() {
    const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [citizenId, setCitizenId] = useState('');

  const handleSubmit = async () => {
    // ✅ Basic empty field check
    if (!fullName || !dob || !address || !gender || !phone || !email || !citizenId) {
      Alert.alert('Please fill in all fields');
      return;
    }

    // ✅ Email and phone format validation
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{8,15}$/;

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid email format');
      return;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert('Invalid phone number');
      return;
    }

    const kycData = {
      full_name: fullName,
      dob,
      address,
      gender,
      phone,
      email,
      citizen_id: citizenId,
    };

    try {
      const token = await AsyncStorage.getItem('token');

        if (!token) {
        Alert.alert('❌ You are not logged in');
        return;
        }

        const response = await fetch(`${API_URL}/kyc-upload/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // ✅ Required for Django DRF auth
        },
        body: JSON.stringify(kycData),
        });


      if (response.ok) {
        Alert.alert('✅ KYC submitted successfully!');
        // ✅ Reset form
        setFullName('');
        setDob('');
        setAddress('');
        setGender('');
        setPhone('');
        setEmail('');
        setCitizenId('');
        router.push('/');


      } else {
        const err = await response.json();
        console.log("KYC SUBMIT ERROR:", err);
        Alert.alert('❌ Submission failed', JSON.stringify(err));



      }
    } catch (error: unknown) {
          let message = 'Something went wrong';
          if (error instanceof Error) {
            message = error.message;
          }
          Alert.alert('Network error', message);
        }
  };


  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // adjust if header exists
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Full Name</Text>
          <TextInput value={fullName} onChangeText={setFullName} placeholder="Enter full name" style={styles.input} />

          <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
          <TextInput value={dob} onChangeText={setDob} placeholder="1998-12-31" style={styles.input} />

          <Text style={styles.label}>Address</Text>
          <TextInput value={address} onChangeText={setAddress} placeholder="Your address" style={styles.input} />

          <Text style={styles.label}>Gender</Text>
          <TextInput value={gender} onChangeText={setGender} placeholder="Male / Female / Other" style={styles.input} />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="98XXXXXXXX"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={styles.label}>Citizen ID</Text>
          <TextInput
            value={citizenId}
            onChangeText={setCitizenId}
            placeholder="Citizenship Number"
            style={styles.input}
          />

          <View style={{ marginTop: 20 }}>
            <Button title="Submit KYC" onPress={handleSubmit} />
          </View>

          <View style={styles.statusButtonContainer}>
  <Button title="Check KYC Status" onPress={() => router.push('/KYCStatus')} />
</View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9', // Light background
    padding: 20,
    paddingBottom: 60,
    flexGrow: 1,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#000',
  },
  statusButtonContainer: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  backgroundColor: '#fff',
  borderRadius: 10,
  elevation: 5, // Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
},

});

