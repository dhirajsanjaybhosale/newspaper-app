import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SubscriptionProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SubscriptionProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
