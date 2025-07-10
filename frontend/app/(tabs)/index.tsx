import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/custombutton';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

export default function HomeScreen() {
  const router = useRouter();
  const groupId = '1';

  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current; // offscreen to left

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  return (
    <View style={styles.container}>
      {/* Main content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Hamburger icon */}
        <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.hamburger}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>

        <Image
          source={require('@/assets/images/dakini.jpeg')}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to the App!</Text>

        {/* Your main buttons could be here or in the drawer */}
      </ScrollView>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Sliding drawer */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Menu</Text>
          <TouchableOpacity onPress={() => setMenuOpen(false)}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.drawerButtons}>
      <CustomButton title="Signup" onPress={() => { setMenuOpen(false); router.push('/signup'); }} />
      <CustomButton title="Login" onPress={() => { setMenuOpen(false); router.push('/login'); }} />
      <CustomButton title="KYC" onPress={() => { setMenuOpen(false); router.push('/KYCForm'); }} />
      <CustomButton title="Group Chat" onPress={() => { setMenuOpen(false); router.push(`/GroupChatScreen/${groupId}`); }} />
      <CustomButton title="Feed" onPress={() => { setMenuOpen(false); router.push('/feed'); }} />
      {/* <CustomButton title="Profile" onPress={() => { setMenuOpen(false); router.push('/profile'); }} /> */}
      <CustomButton title="Task Board" onPress={() => { setMenuOpen(false); router.push('../task-board'); }} />
      <CustomButton title="Learn Skills" onPress={() => { setMenuOpen(false); router.push('/learning'); }} />
        <CustomButton title="Commerce Platform" onPress={() => { setMenuOpen(false); router.push('/commerce'); }} />
    </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: 'pink',
    justifyContent: 'center',
  },
  hamburger: {
    position: 'absolute',
    
    top: 40,
    left: 20,
    padding: 10,
    paddingRight: 270,
    paddingLeft: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
    zIndex: 10,
  },
  hamburgerText: {
    fontSize: 30,
    color: 'white',
  },
  logo: {
  width: 650,
  height: 550,
  resizeMode: 'contain',
  marginTop: 20,
  marginBottom: 20,
}
,
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  drawer: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: DRAWER_WIDTH,
  height: '100%',
  backgroundColor: 'pink', // soft pink-lavender base
  paddingTop: 60,
  paddingHorizontal: 20,
  elevation: 5,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 10,
  zIndex: 20,
  borderRightWidth: 2,
  borderRightColor: '#d4b0dd',
},

drawerHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},

drawerTitle: {
  fontSize: 26,
  fontWeight: 'bold',
  color: 'black', // deep purple for contrast
},

closeButton: {
  fontSize: 28,
  fontWeight: 'bold',
  color: 'black',
},

drawerButtons: {
  gap: 15,
},

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 15,
  },
});
