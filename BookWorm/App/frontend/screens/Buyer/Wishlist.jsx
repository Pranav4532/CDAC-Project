import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext"; // Import cart context
import BottomNav from "../../components/BottomNavbar";
import TopNav from "../../components/TopNavbar";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { cart, addToCart } = useCart(); // Get cart state & addToCart function

  const handleAddToCart = (book) => {
    if (!cart.some((item) => item.id === book.id)) {
      addToCart(book);
    }
  };

  return (
    <View style={styles.container}>
      <TopNav />
      <Text style={styles.title}>Wishlist</Text>

      {wishlist.length === 0 ? (
        <Text style={styles.emptyText}>No books in wishlist.</Text>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const book = item.volumeInfo;
            const price =
              item.saleInfo?.listPrice?.amount
                ? `$${item.saleInfo.listPrice.amount}`
                : "Price Not Available";

            return (
              <View style={styles.bookItem}>
                <Image
                  source={{
                    uri: book.imageLinks?.thumbnail || "https://via.placeholder.com/150",
                  }}
                  style={styles.bookImage}
                />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {book.title || "No Title Available"}
                  </Text>
                  <Text style={styles.bookPrice}>{price}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleWishlist(item)}>
                  <FontAwesome name="trash" size={22} color="red" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
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
  listContainer: {
    paddingBottom: 80,
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  bookImage: {
    width: 50,
    height: 75,
    marginRight: 10,
    borderRadius: 5,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookPrice: {
    fontSize: 14,
    color: "#4F46E5",
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Wishlist;
