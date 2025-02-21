import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, Button, Image, Alert } from "react-native";

export default function Billing(props) {
  const { totalAmount: initialTotalAmount, cart } = props.route.params;

  const [books, setBooks] = useState(cart);
  const [totalAmount, setTotalAmount] = useState(parseFloat(initialTotalAmount) || 0);
  const [deliveryFee] = useState(50);
  const [platformFee] = useState(20);
  const [gstRate] = useState(0.18);

  // Recalculate GST and final amount
  const gstAmount = totalAmount * gstRate;
  const finalAmount = totalAmount + deliveryFee + platformFee + gstAmount;

  // Function to send cart data (no DB storage)
  const sendCartDataToAPI = async () => {
    try {
      const cartData = books.map((item) => ({
        image: item.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/100",
        title: item.volumeInfo?.title,
        author: item.volumeInfo?.authors?.join(", ") || "Unknown Author",
        price: item.saleInfo?.listPrice?.amount || 0,
        quantity: item.quantity,
      }));

      // Simulate API request to send cart data
      const response = await fetch("http://your-backend-api.com/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartData }), // Send static cart data as JSON
      });

      if (response.ok) {
        console.log("Cart data sent successfully.");
      } else {
        Alert.alert("Error", "There was an error sending cart data.");
      }
    } catch (error) {
      console.error("Error sending cart data:", error);
      Alert.alert("Error", "There was an error sending cart data.");
    }
  };

  // Function to navigate to the payment page
  const proceedToPayment = () => {
    if (!isNaN(finalAmount) && finalAmount > 0) {
      sendCartDataToAPI(); // Call API before proceeding to payment
      alert("Proceeding to payment...");
      // Navigate to the payment page (ensure it's defined in your navigation)
      props.navigation.navigate("Payment", { totalAmount: finalAmount.toFixed(2), cartItems: books });
    } else {
      console.error("Invalid total amount: ", finalAmount);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {books.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <View>
          {books.map((item, index) => {
            const book = item.volumeInfo;
            const price = item.saleInfo?.listPrice?.amount || 0;

            return (
              <View key={index} style={styles.itemContainer}>
                <Image source={{ uri: book?.imageLinks?.thumbnail || "https://via.placeholder.com/100" }} style={styles.image} />
                <Text>
                  {book?.title} - ₹{(price * item.quantity).toFixed(2)}
                </Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Author: {book?.authors?.join(", ") || "Unknown Author"}</Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.billSummary}>
        <Text style={styles.text}>Item Total: ₹{totalAmount.toFixed(2)}</Text>
        <Text style={styles.text}>Delivery Fee: ₹{deliveryFee}</Text>
        <Text style={styles.text}>Platform Fee: ₹{platformFee}</Text>
        <Text style={styles.text}>GST (18%): ₹{gstAmount.toFixed(2)}</Text>
        <Text style={styles.text}>Total Amount to Pay: ₹{finalAmount.toFixed(2)}</Text>
        <Button title="Proceed to Payment" onPress={proceedToPayment} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F1F3F6",
  },
  itemContainer: {
    marginBottom: 15,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 150,
    resizeMode: "contain",
  },
  billSummary: {
    marginBottom: 30,
    marginTop: 15,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
    color: "#333",
  },
});
