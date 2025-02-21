import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import TopNavbar from "../../components/SellerTopNavbar";
import BottomNavbar from "../../components/SellerBottomNavbar";

const SellerBookDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { book } = route.params;
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarBooks, setSimilarBooks] = useState([]);

  useEffect(() => {
    if (book) {
      setBookDetails(book.volumeInfo);
      fetchSimilarBooks(book.volumeInfo.title);
      setLoading(false);
    } else {
      fetchBookDetails();
    }
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book?.volumeInfo?.title || "")}&maxResults=1`
      );
      const fetchedBook = response.data.items?.[0]?.volumeInfo || {};
      setBookDetails(fetchedBook);
      fetchSimilarBooks(fetchedBook.title);
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarBooks = async (title) => {
    if (!title) return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&maxResults=5`
      );

      let books = response.data.items || [];
      console.log("Fetched Similar Books:", books.map((b) => b.id));
      const uniqueBooks = Array.from(new Map(books.map((item) => [item.id, item])).values());
      setSimilarBooks(uniqueBooks);
    } catch (error) {
      console.error("Error fetching similar books:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const imageUrl =
    book?.volumeInfo?.imageLinks?.thumbnail ||
    book?.volumeInfo?.imageLinks?.smallThumbnail ||
    bookDetails?.imageLinks?.thumbnail ||
    bookDetails?.imageLinks?.smallThumbnail ||
    "https://via.placeholder.com/150";

  const title = book?.volumeInfo?.title || bookDetails?.title || "No Title Available";
  const authors = book?.volumeInfo?.authors?.join(", ") || bookDetails?.authors?.join(", ") || "Unknown Author";

  const price =
    book?.saleInfo?.listPrice?.amount ||
    bookDetails?.saleInfo?.listPrice?.amount ||
    "Not Available";

  return (
    <View style={styles.wrapper}>
      <TopNavbar />
      <ScrollView style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.bookImage} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>By {authors}</Text>
        <Text style={styles.description}>
          {bookDetails?.description || "No description available."}
        </Text>
        <Text style={styles.price}>Price: ₹{price}</Text>

        <Text style={styles.similarTitle}>Similar Books</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarBooksContainer}>
          {similarBooks.length > 0 ? (
            similarBooks.map((item, index) => {
              const bookId = item.id || `book-${index}`;
              return (
                <TouchableOpacity
                  key={bookId}
                  style={styles.similarBookItem}
                  onPress={() => navigation.push("BookDetail", { book: item })}
                >
                  <Image
                    source={{ uri: item.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/100" }}
                    style={styles.similarBookImage}
                  />
                  <Text style={styles.similarBookText}>{item.volumeInfo?.title || "Unknown"}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noSimilarBooks}>No similar books found.</Text>
          )}
        </ScrollView>
      </ScrollView>
      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  author: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  similarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  similarBooksContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  similarBookItem: {
    width: 120,
    marginRight: 10,
    alignItems: "center",
  },
  similarBookImage: {
    width: 100,
    height: 150,
    borderRadius: 5,
  },
  similarBookText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    color: "#4F46E5",
  },
  noSimilarBooks: {
    fontSize: 16,
    color: "gray",
    marginVertical: 5,
  },
});

export default SellerBookDetails;
