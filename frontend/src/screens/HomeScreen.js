import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Searchbar, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { newspaperService } from '../services/newspaperService';
import { colors } from '../theme/theme';

const HomeScreen = ({ navigation }) => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNewspapers = async () => {
    try {
      const response = await newspaperService.getAllNewspapers();
      setNewspapers(response.data.newspapers || []);
    } catch (error) {
      console.error('Error fetching newspapers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNewspapers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNewspapers();
  };

  const filteredNewspapers = newspapers.filter(
    (newspaper) =>
      newspaper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newspaper.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Newspapers</Text>
        <Searchbar
          placeholder="Search newspapers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={filteredNewspapers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('NewspaperDetail', { newspaper: item })}
          >
            <Card style={styles.card}>
              <Card.Cover source={{ uri: item.coverImage }} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>{item.name}</Title>
                <Paragraph style={styles.publisher}>{item.publisher}</Paragraph>
                <View style={styles.priceContainer}>
                  <MaterialIcons name="currency-rupee" size={16} color={colors.primary} />
                  <Text style={styles.price}>{item.price.monthly}/month</Text>
                </View>
                <View style={styles.chipContainer}>
                  {item.languages?.slice(0, 2).map((lang, index) => (
                    <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                      {lang}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="newspaper" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No newspapers available</Text>
          </View>
        }
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
  header: {
    backgroundColor: colors.surface,
    padding: 16,
    paddingTop: 50,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  searchBar: {
    borderRadius: 8,
    elevation: 0,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  cardImage: {
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    paddingTop: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  publisher: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
    height: 28,
  },
  chipText: {
    fontSize: 12,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default HomeScreen;
