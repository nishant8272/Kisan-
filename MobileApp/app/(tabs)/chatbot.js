// file: app/(tabs)/chatbot.js
import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import ChatBubble from '../components/ChatBubble';
import { getChatbotResponse } from '../api/mockApi';

export default function ChatbotScreen() {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! Ask me about crop health, fertilizers, or irrigation.', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  const handleSend = async () => {
    if (input.trim().length === 0) return;

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Wait for the mock API response
    const botResponseText = await getChatbotResponse(input);
    const botMessage = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <ChatBubble message={item} />}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <TextInput
          style={[styles.textInput, { color: theme.colors.text }]}
          placeholder="Type your question..."
          placeholderTextColor="#9E9E9E"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend} // Allows sending with keyboard's "return" key
        />
        <IconButton
          icon="send"
          iconColor={theme.colors.primary}
          size={28}
          onPress={handleSend}
          disabled={!input.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatArea: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    paddingHorizontal: 10,
  },
});