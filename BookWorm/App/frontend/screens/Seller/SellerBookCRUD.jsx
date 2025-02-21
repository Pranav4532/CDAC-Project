import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BOOK_URL } from "../../utils";
import images from "../../assets/imageMap";
import { Ionicons } from "@expo/vector-icons";

const BookPage = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const apiUrl = `${BOOK_URL}/seller/books/${userId}`;

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks(response.data);
    } catch (error) {
      console.error("Fetch Books Error:", error);
      Alert.alert("Error", "Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(`${BOOK_URL}/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete Response:", response.data);
      Alert.alert("Success", "Book deleted successfully");
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error(
        "Delete Book Error:",
        error.response ? error.response.data : error
      );
      Alert.alert("Error", "Failed to delete book. Please try again.");
    }
  };
  const handleEdit = (book) => {
    navigation.navigate("SellerEditBook", {
      book,
      onUpdate: fetchBooks, // Pass function to refresh books
    });
  };

  const handleAddBook = () => {
    navigation.navigate("SellerEditBook", {
      onUpdate: fetchBooks, // Pass function to refresh books
    });
  };

  const renderBookItem = ({ item }) => {
    let imageSource = images[item.image_path] || images["default.png"];

    return (
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>by {item.author}</Text>
          <Text style={styles.price}>Price: ${item.price}</Text>
          <Text style={styles.stock}>Stock: {item.stock}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Books</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : books.length === 0 ? (
        <Text style={styles.noBooksText}>No books added yet.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBookItem}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  noBooksText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 15,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  author: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E8B57",
  },
  stock: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC3545",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default BookPage;
