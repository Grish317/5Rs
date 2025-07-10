import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ImageSourcePropType } from 'react-native';

type Product = {
  id: number;
  title: string;
  price: string;
  description: string;
  image: ImageSourcePropType;
};

const dummyProducts: Product[] = [
  {
    id: 1,
    title: 'Homemade Mango Pickle',
    price: 'Rs 250',
    description: 'Tangy and spicy mango pickle made with organic ingredients.',
    image: require('../../assets/images/Mango_Pickle.jpeg'),
  },
  {
    id: 2,
    title: 'Natural Soap Bar',
    price: 'Rs 180',
    description: 'Handmade soap with natural herbs for glowing skin.',
    image: require('../../assets/images/Homemade_Soap.jpeg'),
  },
  {
    id: 3,
    title: 'Woven Straw Bag',
    price: 'Rs 1200',
    description: 'Eco-friendly handwoven bag made by local artisans.',
    image: require('../../assets/images/Woven_Straw_Bag.jpeg'),
  },
];

export default function CareCommerce() {
  const [cart, setCart] = useState<number[]>([]);

  const addToCart = (productId: number) => {
    setCart(prev => [...prev, productId]);
    Alert.alert('Added to Cart', 'Product added to your cart!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛍️ CareCommerce Marketplace</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {dummyProducts.map(product => (
          <View key={product.id} style={styles.card}>
            <Image
              source={
                typeof product.image === 'string'
                  ? { uri: product.image }
                  : product.image
              }
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.price}>{product.price}</Text>
              <Text style={styles.description}>{product.description}</Text>
              <TouchableOpacity style={styles.button} onPress={() => addToCart(product.id)}>
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5c007a',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  textContainer: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#009688',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#f06292',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#f06292',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
