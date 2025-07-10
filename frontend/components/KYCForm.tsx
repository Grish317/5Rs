import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BASE_URL } from "../constants/config";
import type { KeyboardTypeOptions } from 'react-native';

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const API_URL = `${BASE_URL}/api`;

export default function KYCFormScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [citizenId, setCitizenId] = useState('');

  // Define input fields with proper keyboardType typing
  const inputs: {
    label: string;
    value: string;
    setter: (val: string) => void;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
  }[] = [
    { label: 'Full Name', value: fullName, setter: setFullName, placeholder: 'Enter full name' },
    { label: 'Date of Birth (YYYY-MM-DD)', value: dob, setter: setDob, placeholder: '1998-12-31' },
    { label: 'Address', value: address, setter: setAddress, placeholder: 'Your address' },
    { label: 'Gender', value: gender, setter: setGender, placeholder: 'Male / Female / Other' },
    { label: 'Phone Number', value: phone, setter: setPhone, placeholder: '98XXXXXXXX', keyboardType: 'phone-pad' },
    { label: 'Email', value: email, setter: setEmail, placeholder: 'example@email.com', keyboardType: 'email-address' },
    { label: 'Citizen ID', value: citizenId, setter: setCitizenId, placeholder: 'Citizenship Number' },
  ];

  const handleSubmit = async () => {
    if (!fullName || !dob || !address || !gender || !phone || !email || !citizenId) {
      Alert.alert('Please fill in all fields');
      return;
    }

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

    const kycData = { full_name: fullName, dob, address, gender, phone, email, citizen_id: citizenId };

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
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(kycData),
      });

      if (response.ok) {
        Alert.alert('✅ KYC submitted successfully!');
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
      if (error instanceof Error) message = error.message;
      Alert.alert('Network error', message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>KYC Form</Text>

            {inputs.map(({ label, value, setter, placeholder, keyboardType }, i) => (
              <View key={i} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={setter}
                  placeholder={placeholder}
                  style={styles.input}
                  keyboardType={keyboardType}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit KYC</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => router.push('/KYCStatus')}
          >
            <Text style={styles.statusButtonText}>Check KYC Status</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  flex: { flex: 1 },
  container: {
    padding: 20,
    paddingBottom: 80,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5c007a',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#555',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#f4b5d3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#f06292',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#f06292',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  statusButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  statusButtonText: {
    color: '#5c007a',
    fontWeight: '600',
    fontSize: 16,
  },
});
