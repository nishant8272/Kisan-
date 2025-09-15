// file: app/components/FeatureButton.js
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const FeatureButton = ({ title, iconName, description, href }) => {
  const theme = useTheme();

  return (
    // Link from expo-router wraps the button to handle navigation
    <Link href={href} asChild>
      <TouchableOpacity style={styles.touchable}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.content}>
            <MaterialCommunityIcons name={iconName} size={48} color={theme.colors.primary} />
            <Text variant="titleLarge" style={[styles.title, { color: theme.colors.primary }]}>
              {title}
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {description}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    marginBottom: 20,
  },
  card: {
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    textAlign: 'center',
    color: '#616161',
  },
});

export default FeatureButton;