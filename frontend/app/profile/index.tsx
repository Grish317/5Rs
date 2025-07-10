import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../constants/config";

type UserProfile = {
  username: string;
  email: string;
  bio: string;
  profile_picture?: string;
  care_points: number;
};

type UserProgress = {
  lessons_completed: number;
  tracks_completed: number;
  streak_badge: string;
};


export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null); // Moved up here
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/my-progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProgress(data);
  };

  if (!profile) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {profile.profile_picture && (
        <Image
          source={{ uri: `${BASE_URL}${profile.profile_picture}` }}
          style={styles.avatar}
        />
      )}
      <Text style={styles.name}>{profile.username}</Text>
      <Text>{profile.email}</Text>
      <Text>{profile.bio}</Text>
      <Text>💚 CarePoints: {profile.care_points}</Text>
      <Button title="Edit Profile" onPress={() => router.push('/profile/edit')} />

      {progress && (
        <View style={{ marginTop: 20 }}>
          <Text>📚 Lessons Completed: {progress.lessons_completed}</Text>
          <Text>🛤️ Tracks Completed: {progress.tracks_completed}</Text>
          <Text>🔥 Streak: {progress.streak_badge}</Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 22, fontWeight: 'bold' },
});


