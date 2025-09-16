// file: app/(tabs)/settings.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, Divider, useTheme } from 'react-native-paper';

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Profile"
          description="Manage your farm and personal details"
          left={() => <List.Icon icon="account" />}
        />
        <List.Item
          title="My Farm Location"
          description="Not set"
          left={() => <List.Icon icon="map-marker" />}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          left={() => <List.Icon icon="bell" />}
        />
        <List.Item
          title="Language"
          description="English"
          left={() => <List.Icon icon="translate" />}
        />
      </List.Section>
       <Divider />
        <Text style={styles.versionText}>App Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#757575',
  }
});