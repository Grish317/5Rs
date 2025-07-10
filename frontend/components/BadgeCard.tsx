// components/BadgeCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeCardProps {
  name: string;
  description: string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ name, description }) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>🎖️</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
};

export default BadgeCard;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#e0ffe0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#3c763d',
    borderWidth: 1,
  },
  icon: {
    fontSize: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  desc: {
    fontSize: 14,
    color: '#4caf50',
  },
});
