import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../constants/config';

type Track = {
  id: number;
  title: string;
  category: 'life' | 'income';
  description: string;
};

type Lesson = {
  id: number;
  title: string;
  thumbnail_url: string;
  youtube_id: string;
  video_url: string;
  completed: boolean;
};

export default function LearningHome() {
  const [category, setCategory] = useState<'all' | 'life' | 'income'>('all');
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [lessons, setLessons] = useState<Record<number, Lesson[]>>({});
  const [expandedTrackId, setExpandedTrackId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/learning-tracks/`, {
        headers: { Authorization: `Token ${token}` }
      });
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error('Unexpected response from /learning-tracks:', data);
        return;
      }

      setTracks(data);
    } catch (err) {
      console.error('Track fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (trackId: number) => {
    // If this track is already expanded, collapse it
    if (expandedTrackId === trackId) {
      setExpandedTrackId(null);
      return;
    }

    // If lessons already loaded, just expand without fetching again
    if (lessons[trackId]) {
      setExpandedTrackId(trackId);
      return;
    }

    // Otherwise, fetch lessons and expand
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/lessons/${trackId}`, {
      headers: { Authorization: `Token ${token}` }
    });
    const data = await res.json();
    setLessons(prev => ({ ...prev, [trackId]: data }));
    setExpandedTrackId(trackId);
    console.log('Fetching lessons for track:', trackId);
    console.log('API response:', data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setCategory('all')}>
          <Text style={category === 'all' ? styles.activeTab : styles.tab}>All Skills</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('life')}>
          <Text style={category === 'life' ? styles.activeTab : styles.tab}>Life Skills</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('income')}>
          <Text style={category === 'income' ? styles.activeTab : styles.tab}>Income Skills</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          tracks
            .filter(t => category === 'all' ? true : t.category === category)
            .map((track: any) => (
              <View key={track.id}>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <TouchableOpacity onPress={() => fetchLessons(track.id)}>
                  <Text style={styles.loadLessons}>
                    {expandedTrackId === track.id ? 'Hide Lessons' : 'Load Lessons'}
                  </Text>
                </TouchableOpacity>

                {expandedTrackId === track.id && Array.isArray(lessons[track.id]) &&
                  lessons[track.id].map((lesson: any) => (
                    <View key={lesson.id} style={styles.card}>
                      <Image source={{ uri: lesson.thumbnail_url }} style={styles.thumbnail} />
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <TouchableOpacity
                        style={styles.watchBtn}
                        onPress={() => router.push(`/learning/watch/${lesson.id}`)}

                      >
                        <Text style={styles.watchText}>🎥 Watch</Text>
                      </TouchableOpacity>
                      {lesson.completed && <Text style={styles.completed}>✅ Completed</Text>}
                    </View>
                  ))
                }
              </View>
            ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: '#555',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontWeight: '700',
    color: '#5c007a',
    borderBottomWidth: 2,
    borderBottomColor: '#5c007a',
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
    color: '#3a0ca3',
  },
  loadLessons: {
    color: '#5c007a',
    marginBottom: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  thumbnail: {
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  lessonTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: '#222',
    marginBottom: 8,
  },
  watchBtn: {
    backgroundColor: '#f06292',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#f06292',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 7,
  },
  watchText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  completed: {
    color: 'green',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 4,
  },
});
