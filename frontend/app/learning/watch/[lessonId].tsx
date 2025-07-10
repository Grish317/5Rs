import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/config';

type Lesson = {
  id: number;
  title: string;
  thumbnail_url: string;
  video_url: string; // <-- note no youtube_id here
  completed: boolean;
};

function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function LessonWatch() {
  const { lessonId } = useLocalSearchParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      alert('You must be logged in!');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/lessons/${lessonId}`, {
        headers: { Authorization: `Token ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Fetch lesson error:', errorData);
        alert('Failed to fetch lesson: ' + (errorData.detail || res.statusText));
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLesson(data);
    } catch (error) {
      console.error('Network or server error:', error);
      alert('Network error, please try again later');
    }
    setLoading(false);
  };

  const markAsLearned = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/log-lesson`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lesson_id: lessonId })
    });
    if (res.ok) {
      alert('✅ Marked as learned!');
      router.back();
    } else {
      alert('❌ Failed to log');
    }
  };

  if (loading || !lesson) return <ActivityIndicator size="large" />;

  // Extract youtube id from video_url
  const youtubeId = getYoutubeId(lesson.video_url);
  if (!youtubeId) return <Text>Invalid YouTube video URL</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lesson.title}</Text>
      <WebView
        style={styles.video}
        source={{ uri: `https://www.youtube.com/embed/${youtubeId}` }}
      />
      <Button title="Mark as Learned" onPress={markAsLearned} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  video: { height: 240, marginBottom: 20 },
});
