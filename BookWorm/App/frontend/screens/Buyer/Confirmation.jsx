import React from 'react';
import { ScrollView, Image, Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function Confirmation({ route, navigation }) {
  // Debugging: Log the route params to check received data
  console.log("Route Params:", JSON.stringify(route.params, null, 2));

  // Extracting params safely
  const totalAmount = route?.params?.totalAmount || 0;
  const paymentMethod = route?.params?.paymentMethod || 'Unknown';
  const cartItems = Array.isArray(route?.params?.cartItems) ? route.params.cartItems : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Success Icon */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }}
        style={styles.image}
      />
      
      {/* Success Message */}
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.amountText}>Total Paid: ₹{totalAmount}</Text>
      <Text style={styles.paymentDetails}>Payment Method: {paymentMethod}</Text>
      <Text style={styles.subtitle}>Thank you for your purchase.</Text>

      {/* Purchased Items Section */}
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsTitle}>Purchased Items:</Text>
        {cartItems.length > 0 ? (
  cartItems.map((item, index) => (
    <View key={index} style={styles.itemRow}>
      <Image 
        source={{ uri: item?.volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/100' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item?.volumeInfo?.title || 'No Title Available'}</Text>
        <Text style={styles.itemPrice}>₹{item?.saleInfo?.retailPrice?.amount?.toFixed(2) || '0.00'}</Text>
      </View>
    </View>
  ))
) : (
  <Text style={styles.noItemsText}>No items found.</Text>
)}

      </View>

      {/* Home Button */}
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('BookList')} 
        style={styles.button} 
        labelStyle={styles.buttonText}
      >
        Go to Home
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e0f7f',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  paymentDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  itemsContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  noItemsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#2E7D32',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});