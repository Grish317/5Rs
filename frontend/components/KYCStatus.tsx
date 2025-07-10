import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../constants/config";
import { useRouter } from 'expo-router';

const API_URL = `${BASE_URL}/api`;

export default function KYCStatusScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    Alert.alert('❌ You are not logged in');
    setLoading(false);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/kyc-status/`, {
      headers: { Authorization: `Token ${token}` },
    });

    const text = await res.text();
    console.log('KYC status raw response:', text);
    console.log('Response status:', res.status);

    if (res.ok) {
      const data = JSON.parse(text);
      setStatus(data.status);
    } else {
      Alert.alert('⚠️ Failed to fetch KYC status');
    }
  } catch (error) {
    console.error('KYC fetch error:', error);
    Alert.alert('Network error', 'Could not reach the server');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchStatus();
  }, []);

  const renderStatusMessage = () => {
    switch (status) {
      case 'approved':
        return <Text style={[styles.statusText, styles.approved]}>Your KYC is approved ✅</Text>;
      case 'pending':
        return <Text style={[styles.statusText, styles.pending]}>Your KYC is under review ⏳</Text>;
      case 'rejected':
        return <Text style={[styles.statusText, styles.rejected]}>Your KYC was rejected ❌</Text>;
      case 'not_submitted':
        return <Text style={[styles.statusText, styles.notSubmitted]}>You have not submitted KYC yet.</Text>;
      default:
        return <Text style={[styles.statusText, styles.unknown]}>Unknown status: {status}</Text>;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5c007a" />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#555' }}>Loading KYC status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>KYC Status</Text>
          {renderStatusMessage()}
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchStatus}>
            <Text style={styles.refreshBtnText}>Refresh Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push('/')}
          >
            <Text style={styles.backBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
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
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#5c007a',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  approved: {
    color: 'green',
  },
  pending: {
    color: 'orange',
  },
  rejected: {
    color: 'red',
  },
  notSubmitted: {
    color: 'gray',
  },
  unknown: {
    color: 'purple',
  },
  refreshBtn: {
    backgroundColor: '#f06292',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    shadowColor: '#f06292',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  refreshBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  backBtn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  backBtnText: {
    color: '#5c007a',
    fontWeight: '600',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
