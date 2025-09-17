import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import ChatBubble from '../components/ChatBubble'; // Ensure this path is correct
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

// Your API URL - make sure this is correct
const CHATBOT_API_URL = "http://192.168.84.231:3000/chat";

export default function ChatbotScreen() {
    const theme = useTheme();
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello! Ask me about crop health, fertilizers, or irrigation.', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const flatListRef = useRef();

    // MODIFICATION 1: handleSend is now a parameter-based function
    // This makes it reusable for both text input and voice input.
    const handleSend = async (messageText) => {
        if (!messageText || messageText.trim().length === 0) {
            return; // Don't send empty messages
        }

        Speech.stop(); // Stop any ongoing speech from the bot
        const userMessage = { id: Date.now().toString(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput(''); // Clear the text input regardless of source
        setIsLoading(true);

        try {
            const response = await fetch(CHATBOT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: messageText }),
            });


            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Chatbot API response:", data);
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

    useEffect(() => {
        // MODIFICATION 2: onSpeechResults now directly calls handleSend
        const onSpeechResults = (e) => {
            const recognizedText = e.value?.[0];
            if (recognizedText) {
                // This is the key for automatic sending!
                handleSend(recognizedText);
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
            Speech.stop();
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []); // Empty dependency array ensures this runs only once

    const handleToggleListening = async () => {
        // This function's logic remains the same: it just starts/stops listening.
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
                    // MODIFICATION 3: Pass the text from the input state to handleSend
                    onSubmitEditing={() => handleSend(input)} 
                    editable={!isLoading && !isListening}
                />
                {/* <IconButton
                    icon={isListening ? "microphone-off" : "microphone"}
                    iconColor={isListening ? theme.colors.error : theme.colors.primary}
                    size={28}
                    onPress={handleToggleListening}
                    disabled={isLoading}
                /> */}
                <IconButton
                    icon="send"
                    iconColor={theme.colors.primary}
                    size={28}
                    // MODIFICATION 4: Pass the text from the input state to handleSend
                    onPress={() => handleSend(input)}
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