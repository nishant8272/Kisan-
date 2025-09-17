import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Sprout, Search, TrendingUp, Leaf } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// --- (FIX #1) THE HEADER IS NOW A SEPARATE, STABLE COMPONENT ---
// It receives all the data and functions it needs as props.
const InternalMarketHeader = ({
  ListHeaderComponent,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isLoading,
  error,
}) => (
  <>
    {/* This renders the header passed in from HomeScreen */}
    {ListHeaderComponent}

    {/* This is the original header content from Market.js */}
    <View style={styles.header}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>🌾 Current Updates</Text>
      </View>
      <Text style={styles.title}>Agricultural Market Prices</Text>
      <Text style={styles.subtitle}>
        Search for your crop to explore the latest mandi prices.
      </Text>
    </View>
    <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
        <Sprout color="#9CA3AF" size={20} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="e.g., Wheat, Rice"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <TouchableOpacity
        onPress={handleSearch}
        disabled={isLoading}
        style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
      >
        {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Search color="#FFFFFF" size={20} />}
      </TouchableOpacity>
    </View>
    {error && (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    )}
  </>
);

// This component is also stable and can be outside
const MarketCard = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardMarket}>{item.id = item.market}</Text>
    <Text style={styles.cardState}>{item.state}</Text>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>
        <TrendingUp size={14} color="#6B7280" /> Min Price:
      </Text>
      <Text style={styles.priceValue}>₹ {item.minPrice} / Quintal</Text>
    </View>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>
        <TrendingUp size={14} color="#6B7280" /> Max Price:
      </Text>
      <Text style={styles.priceValue}>₹ {item.maxPrice} / Quintal</Text>
    </View>
    <View style={[styles.priceRow, { marginTop: 8 }]}>
      <Text style={styles.modalPriceLabel}>
        <Leaf size={16} color="#15803d" /> Avg Price:
      </Text>
      <Text style={styles.modalPriceValue}>₹ {item.modalPrice} / Quintal</Text>
    </View>
  </View>
);


export default function Market({ ListHeaderComponent, ...props }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [marketData, setMarketData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    setError(null);
    setMarketData([]);
    try {
      const data = await getMockMarketData(searchQuery);
      setMarketData(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>🔍 Search for a crop above to see current mandi prices.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        // --- (FIX #2) RENDER THE STABLE HEADER COMPONENT ---
        // Pass all the necessary props to it.
        ListHeaderComponent={
          <InternalMarketHeader
            ListHeaderComponent={ListHeaderComponent}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isLoading={isLoading}
            error={error}
          />
        }
        data={marketData}
        renderItem={({ item }) => <MarketCard item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!isLoading && !error && marketData.length === 0 ? renderEmptyState : null}
        numColumns={Dimensions.get('window').width > 600 ? 2 : 1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 20 }} /> : null}
        // This ensures the keyboard closes when you tap outside the text input on the list
        keyboardShouldPersistTaps="handled"
        {...props}
      />
    </SafeAreaView>
  );
}

// --- Your mock data and styles remain unchanged below ---

const getMockMarketData = (cropName) => {
  return new Promise((resolve) => {
    const mockData = {
      wheat: [
        { id: 'wh1', market: 'Meerut Mandi', state: 'Uttar Pradesh', minPrice: 2100, maxPrice: 2250, modalPrice: 2180 },
        { id: 'wh2', market: 'Saharanpur Mandi', state: 'Uttar Pradesh', minPrice: 2080, maxPrice: 2200, modalPrice: 2150 },
        { id: 'wh3', market: 'Ludhiana Mandi', state: 'Punjab', minPrice: 2150, maxPrice: 2300, modalPrice: 2220 },
        { id: 'wh4', market: 'Amritsar Mandi', state: 'Punjab', minPrice: 2120, maxPrice: 2280, modalPrice: 2200 },
      ],
      rice: [
        { id: 'ri1', market: 'Gorakhpur Mandi', state: 'Uttar Pradesh', minPrice: 3100, maxPrice: 3300, modalPrice: 3220 },
        { id: 'ri2', market: 'Varanasi Mandi', state: 'Uttar Pradesh', minPrice: 3050, maxPrice: 3250, modalPrice: 3150 },
        { id: 'ri3', market: 'Patiala Mandi', state: 'Punjab', minPrice: 3180, maxPrice: 3380, modalPrice: 3270 },
        { id: 'ri4', market: 'Amritsar Mandi', state: 'Punjab', minPrice: 3200, maxPrice: 3400, modalPrice: 3300 },
      ],
      sugarcane: [
        { id: 'su1', market: 'Muzaffarnagar Mandi', state: 'Uttar Pradesh', minPrice: 340, maxPrice: 360, modalPrice: 350 },
        { id: 'su2', market: 'Lucknow Mandi', state: 'Uttar Pradesh', minPrice: 330, maxPrice: 345, modalPrice: 338 },
        { id: 'su3', market: 'Gurdaspur Mandi', state: 'Punjab', minPrice: 325, maxPrice: 340, modalPrice: 333 },
      ],
      maize: [
        { id: 'ma1', market: 'Varanasi Mandi', state: 'Uttar Pradesh', minPrice: 1700, maxPrice: 1850, modalPrice: 1780 },
        { id: 'ma2', market: 'Gorakhpur Mandi', state: 'Uttar Pradesh', minPrice: 1650, maxPrice: 1800, modalPrice: 1725 },
        { id: 'ma3', market: 'Amritsar Mandi', state: 'Punjab', minPrice: 1680, maxPrice: 1820, modalPrice: 1750 },
      ],
      chana: [
        { id: 'ch1', market: 'Kanpur Mandi', state: 'Uttar Pradesh', minPrice: 5200, maxPrice: 5500, modalPrice: 5350 },
        { id: 'ch2', market: 'Lucknow Mandi', state: 'Uttar Pradesh', minPrice: 5250, maxPrice: 5550, modalPrice: 5400 },
        { id: 'ch3', market: 'Amritsar Mandi', state: 'Punjab', minPrice: 5300, maxPrice: 5600, modalPrice: 5450 },
      ],
      masoor: [
        { id: 'ms1', market: 'Varanasi Mandi', state: 'Uttar Pradesh', minPrice: 5600, maxPrice: 5850, modalPrice: 5720 },
        { id: 'ms2', market: 'Ludhiana Mandi', state: 'Punjab', minPrice: 5550, maxPrice: 5800, modalPrice: 5675 },
      ],
      arhar: [
        { id: 'ar1', market: 'Gorakhpur Mandi', state: 'Uttar Pradesh', minPrice: 6500, maxPrice: 6800, modalPrice: 6650 },
        { id: 'ar2', market: 'Amritsar Mandi', state: 'Punjab', minPrice: 6400, maxPrice: 6700, modalPrice: 6550 },
      ],
      moong: [
        { id: 'mo1', market: 'Lucknow Mandi', state: 'Uttar Pradesh', minPrice: 7200, maxPrice: 7500, modalPrice: 7350 },
        { id: 'mo2', market: 'Jalandhar Mandi', state: 'Punjab', minPrice: 7100, maxPrice: 7400, modalPrice: 7250 },
      ],
      urad: [
        { id: 'ur1', market: 'Kanpur Mandi', state: 'Uttar Pradesh', minPrice: 6800, maxPrice: 7100, modalPrice: 6950 },
        { id: 'ur2', market: 'Amritsar Mandi', state: 'Punjab', minPrice: 6700, maxPrice: 7000, modalPrice: 6850 },
      ],
    };
    resolve(mockData[cropName.toLowerCase()] || []);
  });
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { alignItems: 'center', marginVertical: 24, },
  pill: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginBottom: 16, },
  pillText: { color: '#166534', fontWeight: '600', fontSize: 12, },
  title: { fontSize: 28, fontWeight: '800', color: '#14532d', textAlign: 'center', },
  subtitle: { fontSize: 16, color: '#4B5563', textAlign: 'center', marginTop: 8, },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingBottom: 20, },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 999, borderWidth: 1, borderColor: '#D1D5DB', },
  input: { flex: 1, height: 50, paddingLeft: 10, paddingRight: 20, fontSize: 16, color: '#111827', },
  inputIcon: { marginLeft: 15, },
  searchButton: { marginLeft: 8, backgroundColor: '#16a34a', padding: 13, borderRadius: 999, },
  searchButtonDisabled: { backgroundColor: '#9CA3AF' },
  errorContainer: { marginVertical: 20, backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, alignItems: 'center', },
  errorText: { color: '#B91C1C', fontWeight: '500', },
  emptyContainer: { marginTop: 60, alignItems: 'center', },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center', },
  card: { flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 12, margin: 6, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5, },
  cardMarket: { fontSize: 20, fontWeight: 'bold', color: '#14532d', },
  cardState: { fontSize: 14, color: '#6B7280', marginBottom: 12, },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4, },
  priceLabel: { fontSize: 14, color: '#374151', flexDirection: 'row', alignItems: 'center', },
  priceValue: { fontSize: 14, fontWeight: '600', color: '#1F2937', },
  modalPriceLabel: { fontSize: 16, fontWeight: 'bold', color: '#15803d', flexDirection: 'row', alignItems: 'center', },
  modalPriceValue: { fontSize: 18, fontWeight: 'bold', color: '#15803d', },
});