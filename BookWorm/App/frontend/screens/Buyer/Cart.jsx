import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useCart } from "../../context/CartContext";
import BottomNav from "../../components/BottomNavbar";
import TopNav from "../../components/TopNavbar";
import CartNavBar from "../../components/CartNavbar";

const Cart = ({ navigation }) => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Recalculate total price whenever the cart changes
    const price = cart.reduce((total, item) => {
      const price = item.saleInfo?.listPrice?.amount || 0;
      return total + price * item.quantity;
    }, 0);
    setTotalPrice(price);
  }, [cart]);

  return (
    <View style={styles.container}>
      <TopNav />
      <Text style={styles.title}>Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const book = item.volumeInfo;
            const price = item.saleInfo?.listPrice?.amount || 0;

            return (
              <View style={styles.cartItem}>
                <Image
                  source={{
                    uri: book?.imageLinks?.thumbnail || "https://via.placeholder.com/100",
                  }}
                  style={styles.bookImage}
                />
                <View style={styles.details}>
                  <Text style={styles.bookTitle}>{book?.title}</Text>
                  <Text style={styles.price}>₹{price}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => decreaseQuantity(item.id)}
                    >
                      <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => increaseQuantity(item.id)}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      <CartNavBar totalPrice={totalPrice} onOrderNow={() => navigation.navigate("Billing", { totalAmount: totalPrice, cart })} />

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 5,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "#16a34a",
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Cart;
