// components/LogCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LogCardProps {
  description: string;
  createdAt: string;
}

const LogCard: React.FC<LogCardProps> = ({ description, createdAt }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.desc}>{description}</Text>
      <Text style={styles.date}>{new Date(createdAt).toLocaleString()}</Text>
    </View>
  );
};

export default LogCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  desc: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
  },
});
