// components/CarePoints.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CarePointsProps {
  points: number;
}

const CarePoints: React.FC<CarePointsProps> = ({ points }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>💚 CarePoints</Text>
      <Text style={styles.points}>{points}</Text>
    </View>
  );
};

export default CarePoints;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  points: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});
