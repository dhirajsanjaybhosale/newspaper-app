import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Divider, Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { paymentService } from '../services/paymentService';
import { colors } from '../theme/theme';

const CheckoutScreen = ({ route, navigation }) => {
  const { newspaper, plan, price } = route.params;
  const { user } = useAuth();
  const { createSubscription } = useSubscription();

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [deliveryTime, setDeliveryTime] = useState('Morning (6-8 AM)');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    // Validate address
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      setError('Please fill in all address fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create subscription
      const subscriptionData = {
        newspaperId: newspaper._id,
        subscriptionType: plan,
        deliveryAddress: {
          ...deliveryAddress,
          location: {
            type: 'Point',
            coordinates: [0, 0], // You should get actual coordinates using location service
            address: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`,
          },
        },
        deliveryTime,
      };

      const { success, data, error: subError } = await createSubscription(subscriptionData);

      if (!success) {
        setError(subError);
        setIsLoading(false);
        return;
      }

      // Create payment order
      const orderResponse = await paymentService.createOrder(data._id);
      const { order, key } = orderResponse.data;

      // Here you would integrate Razorpay payment gateway
      // For now, we'll simulate a successful payment
      Alert.alert(
        'Payment',
        'In production, Razorpay payment gateway would be integrated here.',
        [
          {
            text: 'Simulate Success',
            onPress: async () => {
              // Simulate payment verification
              try {
                await paymentService.verifyPayment({
                  razorpay_order_id: order.id,
                  razorpay_payment_id: 'pay_test_' + Date.now(),
                  razorpay_signature: 'sig_test_' + Date.now(),
                });

                Alert.alert('Success', 'Subscription created successfully!', [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Subscriptions'),
                  },
                ]);
              } catch (err) {
                setError('Payment verification failed');
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Newspaper:</Text>
            <Text style={styles.summaryValue}>{newspaper.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan:</Text>
            <Text style={styles.summaryValue}>{plan}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount:</Text>
            <View style={styles.priceContainer}>
              <MaterialIcons name="currency-rupee" size={16} color={colors.primary} />
              <Text style={styles.summaryPrice}>{price}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TextInput
            label="Street Address"
            value={deliveryAddress.street}
            onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, street: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="City"
            value={deliveryAddress.city}
            onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, city: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="State"
            value={deliveryAddress.state}
            onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, state: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Pincode"
            value={deliveryAddress.pincode}
            onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, pincode: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.timeOptions}>
            {['Morning (6-8 AM)', 'Afternoon (12-2 PM)', 'Evening (5-7 PM)'].map((time) => (
              <Button
                key={time}
                mode={deliveryTime === time ? 'contained' : 'outlined'}
                onPress={() => setDeliveryTime(time)}
                style={styles.timeButton}
              >
                {time}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handlePayment}
        loading={isLoading}
        disabled={isLoading}
        style={styles.payButton}
        contentStyle={styles.payButtonContent}
        icon="credit-card"
      >
        Proceed to Payment
      </Button>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setError(''),
        }}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  input: {
    marginBottom: 12,
  },
  timeOptions: {
    gap: 8,
  },
  timeButton: {
    marginBottom: 8,
  },
  payButton: {
    marginVertical: 24,
  },
  payButtonContent: {
    paddingVertical: 8,
  },
});

export default CheckoutScreen;
