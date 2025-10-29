import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Chip, ActivityIndicator, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';
import { colors } from '../theme/theme';

const SubscriptionsScreen = ({ navigation }) => {
  const { subscriptions, loading, fetchSubscriptions } = useSubscription();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubscriptions();
    setRefreshing(false);
  };

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
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SubscriptionDetail', { subscription: item })
            }
          >
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={styles.cardTitle}>{item.newspaper?.name}</Title>
                  <Chip
                    style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
                    textStyle={{ color: getStatusColor(item.status) }}
                  >
                    {item.status}
                  </Chip>
                </View>

                <View style={styles.infoRow}>
                  <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
                  <Paragraph style={styles.infoText}>
                    {item.deliveryAddress?.city}, {item.deliveryAddress?.state}
                  </Paragraph>
                </View>

                <View style={styles.infoRow}>
                  <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
                  <Paragraph style={styles.infoText}>{item.deliveryTime}</Paragraph>
                </View>

                <View style={styles.dateContainer}>
                  <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Start Date</Text>
                    <Text style={styles.dateValue}>{formatDate(item.startDate)}</Text>
                  </View>
                  <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>End Date</Text>
                    <Text style={styles.dateValue}>{formatDate(item.endDate)}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="subscriptions" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No subscriptions yet</Text>
            <Text style={styles.emptySubtext}>Start by subscribing to a newspaper</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Home')}
        label="New Subscription"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default SubscriptionsScreen;
