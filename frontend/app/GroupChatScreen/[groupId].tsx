// /app/GroupChatScreen/[groupId].tsx

import React from 'react';
import ChatScreen from '../../components/GroupChatScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Screen() {
  const params = useLocalSearchParams();
  const groupId = params.groupId as string; // ✅ assert type here

  return <ChatScreen groupId={groupId} />;
  
}
