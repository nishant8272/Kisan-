import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function ChatBubble({ message }) {
    const theme = useTheme();
    const isUser = message.sender === 'user';

    const bubbleStyle = {
        backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
    };

    const textStyle = {
        color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
    };

    return (
        <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
            <View style={[styles.bubble, bubbleStyle]}>
                <Text style={[styles.text, textStyle]}>{message.text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        maxWidth: '80%',
    },
    userContainer: {
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    botContainer: {
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    bubble: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    text: {
        fontSize: 16,
    },
});