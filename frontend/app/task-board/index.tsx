import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/config';

type Task = {
  id: number;
  title: string;
  description: string;
  points: number;
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      const data = await response.json();

      // Add dummy tasks here after the real fetch
      const dummyTasks: Task[] = [
        {
          id: 1001,
          title: "👵 Elder Care Helper",
          description: "Assist elders with daily activities in your community center.",
          points: 50,
        },
        {
          id: 1002,
          title: "🎉 Event Server/Helper",
          description: "Support logistics and hospitality at the upcoming local events.",
          points: 30,
        },
        {
          id: 1003,
          title: "👩‍🦰 Women's Day Celebration",
          description: "Help organize and manage Women's Day celebration programs.",
          points: 40,
        }
      ];

      const combined = [...dummyTasks, ...data];
      setTasks(combined);
      setFilteredTasks(combined);

    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const applyToTask = async (taskId: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/apply-task/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Applied successfully!");
      } else {
        alert(`❌ Failed: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error("Apply error:", err);
      alert("❌ Could not apply.");
    }
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.card}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDesc}>{item.description}</Text>
      <Text style={styles.points}>Points: {item.points}</Text>
      <TouchableOpacity style={styles.applyBtn} onPress={() => applyToTask(item.id)}>
        <Text style={styles.applyBtnText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="🔍 Search tasks"
          style={styles.searchInput}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#5c007a" />
        ) : (
          <FlatList
            data={filteredTasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.taskList}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f9f9f9' },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#f4b5d3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
  },
  taskList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'pink',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#5c007a',
  },
  taskDesc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  points: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  applyBtn: {
    backgroundColor: '#f06292',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
