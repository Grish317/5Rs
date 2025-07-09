import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://172.16.50.183:9000/api';

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        Alert.alert('Signup successful! Please login.');
        router.push('/login');  // use router to navigate
      } else {
        const errorData = await response.json();
        Alert.alert('Signup failed', errorData.message || 'Try again');
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
    <View style={{ padding: 20, backgroundColor: 'white', flex: 1    }}>
      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />
      <Button title="Sign up" onPress={handleSignup} />
    </View>
  );
}
