import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import axios from "axios";
import { BOOK_URL } from "../utils";

const BookDetails = ({ route, navigation }) => {
    const { bookId } = route.params;
    const [book, setBook] = useState(null);

    useEffect(() => {
        axios.get(`${BOOK_URL}/${bookId}`)
            .then(response => {
                if (response.data.status === "success") {
                    setBook(response.data.data);
                } else {
                    console.error("API returned an error:", response.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching book details:", error);
            });
    }, [bookId]);

    if (!book) {
        return (
            <View style={styles.centered}>
                <Text>Loading book details...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <Card style={styles.card}>
                <Card.Content>
                    <Image style={styles.image} source={{ uri: `${BOOK_URL}${book.ImagePath}` }} />
                    <Text style={styles.title}>{book.Title}</Text>
                    <Text style={styles.author}>by {book.Author}</Text>
                    <Text style={styles.price}>Price: ₹{book.Price}</Text>
                    <Text style={styles.description}>{book.Description}</Text>
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
                Back to Book List
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    card: { margin: 20, padding: 10 },
    image: { width: "100%", height: 300, resizeMode: "contain" },
    title: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
    author: { fontSize: 18, color: "gray", marginBottom: 10 },
    price: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    description: { fontSize: 14, color: "#333" },
    button: { margin: 20 }
});

export default BookDetails;
