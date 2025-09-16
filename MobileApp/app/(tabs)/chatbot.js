import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import ChatBubble from '../components/ChatBubble'; // Ensure this path is correct
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

// ------------------- IMPORTANT -------------------
// Replace 'localhost' with your computer's local IP address.
// Your computer and your phone MUST be on the same Wi-Fi network.
// Example: const CHATBOT_API_URL = "http://192.168.1.5:3000/chat";
const CHATBOT_API_URL = "http://192.168.84.231:3000/chat";
// ---------------------------------------------------

export default function ChatbotScreen() {
    // The rest of your code is perfect and does not need changes.
    // I am including it here for completeness.
    const theme = useTheme();
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello! Ask me about crop health, fertilizers, or irrigation.', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const flatListRef = useRef();

    useEffect(() => {
        const onSpeechResults = (e) => {
            if (e.value && e.value.length > 0) {
                setInput(e.value[0]);
            }
        };
        const onSpeechEnd = () => setIsListening(false);
        const onSpeechError = (e) => {
            console.error('Speech recognition error', e);
            Alert.alert("Voice Error", "Sorry, I couldn't understand that. Please try again.");
            setIsListening(false);
        };

        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechEnd = onSpeechEnd;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const handleToggleListening = async () => {
        try {
            if (isListening) {
                await Voice.stop();
                setIsListening(false);
            } else {
                setInput('');
                await Voice.start('en-US');
                setIsListening(true);
            }
        } catch (e) {
            console.error("Failed to toggle voice recognition", e);
            Alert.alert("Voice Error", "Could not start the voice service. Check your permissions.");
        }
    };

    const handleSend = async () => {
        const currentInput = input;
        if (currentInput.trim().length === 0) return;

        Speech.stop();
        const userMessage = { id: Date.now().toString(), text: currentInput, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(CHATBOT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: currentInput }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            const botResponseText = data.answer || "Sorry, I couldn't understand that.";

            const botMessage = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
            Speech.speak(botResponseText, { language: 'en-US' });

        } catch (error) {
            console.error("Failed to fetch from chatbot API:", error);
            const errorMessage = { id: (Date.now() + 1).toString(), text: "Sorry, I'm having trouble connecting. Make sure the server is running and you entered the correct IP address.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                ListFooterComponent={isLoading ? <ActivityIndicator style={{ margin: 10 }} animating={true} /> : null}
            />
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
                <TextInput
                    style={[styles.textInput, { color: theme.colors.text }]}
                    placeholder={isListening ? "Listening..." : "Type your question..."}
                    placeholderTextColor="#9E9E9E"
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                    editable={!isLoading && !isListening}
                />
                <IconButton
                    icon={isListening ? "microphone-off" : "microphone"}
                    iconColor={isListening ? theme.colors.error : theme.colors.primary}
                    size={28}
                    onPress={handleToggleListening}
                    disabled={isLoading}
                />
                <IconButton
                    icon="send"
                    iconColor={theme.colors.primary}
                    size={28}
                    onPress={handleSend}
                    disabled={!input.trim() || isLoading || isListening}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    chatArea: { flex: 1 },
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