import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Chip, Divider, Dialog, Portal } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';
import { colors } from '../theme/theme';

const SubscriptionDetailScreen = ({ route, navigation }) => {
  const { subscription } = route.params;
  const { cancelSubscription } = useSubscription();
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'pending_payment':
        return colors.warning;
      case 'expired':
        return colors.error;
      case 'cancelled':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    const { success, error } = await cancelSubscription(subscription._id);

    if (success) {
      Alert.alert('Success', 'Subscription cancelled successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert('Error', error || 'Failed to cancel subscription');
    }

    setIsLoading(false);
    setCancelDialogVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.title}>{subscription.newspaper?.name}</Text>
            <Chip
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(subscription.status) + '20' },
              ]}
              textStyle={{ color: getStatusColor(subscription.status), fontWeight: 'bold' }}
            >
              {subscription.status}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Subscription Details</Text>

          <View style={styles.detailRow}>
            <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Start Date</Text>
              <Text style={styles.detailValue}>{formatDate(subscription.startDate)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>End Date</Text>
              <Text style={styles.detailValue}>{formatDate(subscription.endDate)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="schedule" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Time</Text>
              <Text style={styles.detailValue}>{subscription.deliveryTime}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={24} color={colors.primary} />
            <View style={styles.addressContent}>
              <Text style={styles.addressText}>{subscription.deliveryAddress?.street}</Text>
              <Text style={styles.addressText}>
                {subscription.deliveryAddress?.city}, {subscription.deliveryAddress?.state}
              </Text>
              <Text style={styles.addressText}>PIN: {subscription.deliveryAddress?.pincode}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {subscription.distributor && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Distributor Details</Text>

            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{subscription.distributor?.name}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="phone" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{subscription.distributor?.phone}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {subscription.status === 'active' && (
        <Button
          mode="outlined"
          onPress={() => setCancelDialogVisible(true)}
          style={styles.cancelButton}
          contentStyle={styles.cancelButtonContent}
          icon="cancel"
          textColor={colors.error}
        >
          Cancel Subscription
        </Button>
      )}

      <Portal>
        <Dialog visible={cancelDialogVisible} onDismiss={() => setCancelDialogVisible(false)}>
          <Dialog.Title>Cancel Subscription</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to cancel this subscription?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelDialogVisible(false)}>No</Button>
            <Button onPress={handleCancelSubscription} loading={isLoading} textColor={colors.error}>
              Yes, Cancel
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
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  statusChip: {
    height: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressContent: {
    marginLeft: 16,
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  cancelButton: {
    margin: 16,
    borderColor: colors.error,
  },
  cancelButtonContent: {
    paddingVertical: 8,
  },
});

export default SubscriptionDetailScreen;
