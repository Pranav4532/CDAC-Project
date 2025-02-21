import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BottomNav = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNav}>
      {/* Home */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("BookList")}>
        <FontAwesome name="book" size={28} color="black" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Wishlist (Updated Icon - 🎁 Gift) */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Wishlist")}>
        <FontAwesome name="bookmark" size={28} color="black" />
        <Text style={styles.navText}>Wishlist</Text>
      </TouchableOpacity>

      {/* Cart */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cart")}>
        <FontAwesome name="shopping-cart" size={28} color="black" />
        <Text style={styles.navText}>Cart</Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
        <FontAwesome name="user-circle-o" size={28} color="black" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
});

export default BottomNav;
