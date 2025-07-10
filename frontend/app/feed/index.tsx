import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import LogCard from '../../components/LogCard';
import BadgeCard from '../../components/BadgeCard';
import CarePoints from '../../components/CarePoints';

export default function FeedScreen() {
  // Mock data for now
  const logs = [
    { description: 'Learned potey making', createdAt: new Date().toISOString() },
    { description: 'Learned about fundamentals of running a business', createdAt: new Date().toISOString() },
  ];

  const badges = [
    { name: 'Helper Level 1', description: 'Logged 2 tasks!' },
  ];

  const carePoints = 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Your Activity Feed</Text>

          <CarePoints points={carePoints} />

          <Text style={styles.sectionTitle}>🎖️ Badges Earned</Text>
          {badges.map((badge, i) => (
            <BadgeCard key={i} name={badge.name} description={badge.description} />
          ))}

          <Text style={styles.sectionTitle}>📝 Recent Logs</Text>
          {logs.map((log, i) => (
            <LogCard key={i} description={log.description} createdAt={log.createdAt} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'pink',
  },
  container: {
    padding: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'pink',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
});
