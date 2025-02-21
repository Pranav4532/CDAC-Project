import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import TopNav from "../../components/SellerTopNavbar";
import BottomNav from "../../components/SellerBottomNavbar";

const categories = [
  "fiction",
  "nonfiction",
  "biography",
  "autobiography",
  "history",
  "science",
  "philosophy",
  "psychology",
  "self-help",
  "business",
  "finance",
  "economics",
  "health",
  "medicine",
  "technology",
  "computers",
  "art",
  "design",
  "architecture",
  "photography",
  "music",
  "poetry",
  "drama",
  "mystery",
  "thriller",
  "crime",
  "horror",
  "fantasy",
  "science fiction",
  "romance",
  "adventure",
  "classics",
  "religion",
  "spirituality",
  "politics",
  "law",
  "education",
  "mathematics",
  "sports",
  "travel",
  "cooking",
  "food",
  "children",
  "young adult",
  "graphic novels",
  "manga",
  "comics",
  "short stories",
  "mythology",
  "folklore",
  "literary criticism",
  "essays",
  "war",
  "anthropology",
  "sociology",
  "astronomy",
  "physics",
  "chemistry",
  "biology",
  "environment",
  "nature",
  "engineering",
  "aviation",
  "transportation",
  "gardening",
  "pets",
  "crafts",
  "diy",
  "parenting",
  "relationships",
  "language",
  "linguistics",
];

const SellerBookList = () => {
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchBooksWithLimit();
  }, []);

  const fetchBooksWithLimit = async () => {
    setLoading(true);
    const categoryData = {};
    const selectedCategories = categories
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    for (let category of selectedCategories) {
      await new Promise((resolve) => setTimeout(resolve, 700));

      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${category}&maxResults=40`
        );

        const allBooks = response.data.items || [];
        const selectedBooks = allBooks
          .sort(() => Math.random() - 0.5)
          .slice(0, 8);

        categoryData[category] = selectedBooks;
      } catch (error) {
        console.error(`Error fetching books for ${category}:`, error);
      }
    }

    setBooks(categoryData);
    setLoading(false);
  };

  const deleteBook = (category, bookId) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setBooks((prevBooks) => {
              const updatedCategoryBooks = prevBooks[category].filter(
                (book) => book.id !== bookId
              );
              return { ...prevBooks, [category]: updatedCategoryBooks };
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`
      );
      setBooks({ [query]: response.data.items || [] });
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopNav />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchBooks}>
          <FontAwesome name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={Object.keys(books)}
        keyExtractor={(category) => category}
        renderItem={({ item: category }) => (
          <View>
            <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
            <FlatList
              data={books[category]}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => {
                const book = item.volumeInfo;
                const price = item.saleInfo?.listPrice?.amount || "Not Available";

                return (
                  <View style={styles.bookItem}>
                    <Image
                      source={{
                        uri: book.imageLinks?.thumbnail || "https://via.placeholder.com/150",
                      }}
                      style={styles.bookImage}
                    />
                    <Text style={styles.title} numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text style={styles.price}>₹{price}</Text>
                    <TouchableOpacity
                      style={[styles.button, styles.deleteButton]}
                      onPress={() => deleteBook(category, item.id)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
      />

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  searchButton: {
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 15,
  },
  listContainer: {
    paddingLeft: 10,
  },
  bookItem: {
    width: 160,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: 5,
  },
  button: {
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 5,
    width: "80%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SellerBookList;