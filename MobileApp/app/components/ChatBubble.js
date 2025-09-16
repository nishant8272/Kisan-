// file: app/components/ChatBubble.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const ChatBubble = ({ message }) => {
  const theme = useTheme();
  const isUser = message.sender === 'user';

  const bubbleStyle = {
    backgroundColor: isUser ? theme.colors.primaryContainer : theme.colors.surface,
    alignSelf: isUser ? 'flex-end' : 'flex-start',
  };

  const textStyle = {
    color: theme.colors.onSurface,
  };

  return (
    <View style={[styles.bubble, bubbleStyle]}>
      <Text style={textStyle}>{message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    marginHorizontal: 10,
    elevation: 1,
  },
});

export default ChatBubble;