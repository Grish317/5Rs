    import React, { useState } from 'react';
    import { View, TextInput, Button, StyleSheet } from 'react-native';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { useRouter } from 'expo-router';
    import { BASE_URL } from "../../constants/config";


    export default function EditProfile() {
    const [bio, setBio] = useState('');
    const router = useRouter();

    const updateProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        await fetch(`${BASE_URL}/me/update`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bio })
        });
        router.back();
    };

    return (
        <View style={styles.container}>
        <TextInput
            placeholder="Enter bio"
            value={bio}
            onChangeText={setBio}
            style={styles.input}
        />
        <Button title="Save" onPress={updateProfile} />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { padding: 16 },
    input: { borderWidth: 1, padding: 8, marginBottom: 12 },
    });
