import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const groupId = '1';

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to the App!</Text>

      <View style={styles.buttonContainer}>
        <Button title="Signup" onPress={() => router.push('/signup')} />
        <Button title="Login" onPress={() => router.push('/login')} />
          
        <Button title="Group Chat" onPress={() => router.push(`/GroupChatScreen/${groupId}`)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 10,
    width: '100%',
  },
});
