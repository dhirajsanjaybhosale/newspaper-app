import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card, Chip, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

const NewspaperDetailScreen = ({ route, navigation }) => {
  const { newspaper } = route.params;
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = [
    { id: 'monthly', label: 'Monthly', price: newspaper.price.monthly, duration: '1 Month' },
    { id: 'quarterly', label: 'Quarterly', price: newspaper.price.quarterly, duration: '3 Months' },
    { id: 'yearly', label: 'Yearly', price: newspaper.price.yearly, duration: '12 Months' },
  ];

  const handleSubscribe = () => {
    navigation.navigate('Checkout', {
      newspaper,
      plan: selectedPlan,
      price: newspaper.price[selectedPlan],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: newspaper.coverImage }} style={styles.coverImage} />

      <View style={styles.content}>
        <Text style={styles.title}>{newspaper.name}</Text>
        <Text style={styles.publisher}>{newspaper.publisher}</Text>

        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={20} color="#FFC107" />
          <Text style={styles.rating}>{newspaper.ratingsAverage || 4.5}</Text>
          <Text style={styles.ratingCount}>({newspaper.ratingsQuantity || 0} reviews)</Text>
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{newspaper.description}</Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Languages</Text>
        <View style={styles.chipContainer}>
          {newspaper.languages?.map((lang, index) => (
            <Chip key={index} style={styles.chip}>
              {lang}
            </Chip>
          ))}
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.chipContainer}>
          {newspaper.categories?.map((category, index) => (
            <Chip key={index} style={styles.chip} icon="tag">
              {category}
            </Chip>
          ))}
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlanCard,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <Card.Content>
                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planDuration}>{plan.duration}</Text>
                <View style={styles.planPriceContainer}>
                  <MaterialIcons name="currency-rupee" size={20} color={colors.primary} />
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleSubscribe}
          style={styles.subscribeButton}
          contentStyle={styles.subscribeButtonContent}
          icon="newspaper"
        >
          Subscribe Now
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  coverImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  publisher: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
    color: colors.text,
  },
  ratingCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedPlanCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  planLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  planDuration: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 4,
  },
  planPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subscribeButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  subscribeButtonContent: {
    paddingVertical: 8,
  },
});

export default NewspaperDetailScreen;
