import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.75:9000/api';

export default function ChatScreen({ groupId }: { groupId: string }) {
    
  console.log('groupId in ChatScreen:', groupId); // Should log '1' or actual ID

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/messages/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        scrollToBottom();
      } else {
        console.log('Failed fetching messages:', await res.text());
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const sendMessage = async () => {
    console.log("🟢 Send button clicked");
    if (!newMessage.trim()) return;

    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          group: groupId,
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(); // refresh messages
      } else {
        console.log('Failed sending message:', await res.text());
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    if (!groupId) {
      console.warn('No groupId provided');
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [groupId]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.sender}>{item.sender_username}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

// styles remain unchanged


    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    messageContainer: {
        marginBottom: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        elevation: 2,
    },
    sender: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    content: {
        fontSize: 16,
        color: '#000',
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
        marginTop: 6,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginRight: 8,
    },
    });
