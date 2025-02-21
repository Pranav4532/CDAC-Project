import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CartNavBar = ({ totalPrice, onOrderNow }) => {
  return (
    <View style={styles.container}>
      {/* Total Price */}
      <Text style={styles.totalText}>Total: ₹{totalPrice.toFixed(2)}</Text>

      {/* Order Now Button */}
      <TouchableOpacity style={styles.orderButton} onPress={onOrderNow}>
        <Text style={styles.orderButtonText}>Order Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
    position: "absolute",
    bottom: 50, // Adjust position above bottom navbar
    left: 0,
    right: 0,
    zIndex: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orderButton: {
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  orderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartNavBar;
