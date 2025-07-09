import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.16.50.183:9000/api';

export default function KYCStatusScreen() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('You are not logged in');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/kyc-status/`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setStatus(data.status);
        } else {
          Alert.alert('Failed to fetch KYC status');
        }
      } catch (error) {
        Alert.alert('Network error', 'Could not reach the server');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading KYC status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {status === 'approved' && <Text style={styles.approved}>Your KYC is approved ✅</Text>}
      {status === 'pending' && <Text style={styles.pending}>Your KYC is under review ⏳</Text>}
      {status === 'rejected' && <Text style={styles.rejected}>Your KYC was rejected ❌</Text>}
      {status === 'not_submitted' && <Text style={styles.notSubmitted}>You have not submitted KYC yet.</Text>}
      {!['approved', 'pending', 'rejected', 'not_submitted'].includes(status || '') && (
        <Text style={styles.unknown}>Unknown status: {status}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approved: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pending: {
    color: 'orange',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rejected: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notSubmitted: {
    color: 'gray',
    fontSize: 18,
    fontWeight: 'bold',
  },
  unknown: {
    color: 'purple',
    fontSize: 16,
  },
});
