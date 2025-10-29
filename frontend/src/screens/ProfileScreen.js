import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, List, Divider, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

const ProfileScreen = ({ navigation }) => {
  const { user, signOut, updateUser } = useAuth();
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    const { success, error } = await updateUser({ name, phone });

    if (success) {
      Alert.alert('Success', 'Profile updated successfully');
      setEditDialogVisible(false);
    } else {
      Alert.alert('Error', error || 'Failed to update profile');
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    setLogoutDialogVisible(false);
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={getInitials(user?.name)} style={styles.avatar} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      <View style={styles.section}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            onPress={() => setEditDialogVisible(true)}
          />
          <Divider />
          <List.Item
            title="Change Password"
            description="Update your password"
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            onPress={() => Alert.alert('Info', 'Password change feature coming soon')}
          />
          <Divider />
          <List.Item
            title="Notifications"
            description="Manage notification preferences"
            left={(props) => <List.Icon {...props} icon="bell" />}
            onPress={() => Alert.alert('Info', 'Notification settings coming soon')}
          />
        </List.Section>
      </View>

      <View style={styles.section}>
        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help & Support"
            description="Get help with your account"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={() => Alert.alert('Support', 'Contact us at support@newspaperapp.com')}
          />
          <Divider />
          <List.Item
            title="About"
            description="App version and information"
            left={(props) => <List.Icon {...props} icon="information" />}
            onPress={() => Alert.alert('About', 'Newspaper App v1.0.0')}
          />
        </List.Section>
      </View>

      <Button
        mode="contained"
        onPress={() => setLogoutDialogVisible(true)}
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
        icon="logout"
        buttonColor={colors.error}
      >
        Logout
      </Button>

      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateProfile} loading={isLoading}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleLogout} textColor={colors.error}>
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 32,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.9,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 8,
    backgroundColor: colors.surface,
  },
  input: {
    marginBottom: 12,
  },
  logoutButton: {
    margin: 16,
    marginTop: 24,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;
