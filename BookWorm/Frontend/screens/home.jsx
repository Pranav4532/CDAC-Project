import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Pressable, TextInput } from "react-native";
import { Button, Card, IconButton, Text, Snackbar } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BOOK_URL } from "../utils";

function BookList() {
    const navigation = useNavigation();
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get(`${BOOK_URL}/all`)
            .then((response) => {
                if (response.data.status === 'success') {
                    setBooks(response.data.data);
                    setFilteredBooks(response.data.data);
                } else {
                    console.error('API Error:', response.data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching books:', error);
            });
    }, []);

    useEffect(() => {
        const results = books.filter(book => 
            book.Title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            book.Author.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBooks(results);
    }, [searchQuery, books]);

    const AddtoCart = (book) => {
        setCart([...cart, book]);
        setTotalAmount(totalAmount + book.Price);
        setSnackbarMessage(`${cart.length + 1} item added to cart successfully`);
        setSnackbarVisible(true);
    };

    const ChekOut = () => {
        navigation.navigate("bill", { cart, totalAmount });
    };

    const handleSnackbarDismiss = () => {
        setSnackbarVisible(false);
    };

    const Profile = () => {
        navigation.navigate("Profile");
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.text}>Book List</Text>
                        <TouchableOpacity>
                            <Pressable onPress={Profile}>
                                <Image style={styles.pp} source={{ uri: "https://i.pinimg.com/236x/4a/cd/01/4acd0124f5c5b29fd25e69cf41c16fe3.jpg" }} />
                            </Pressable>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search books..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View style={{ flex: 1 }}>
                        {filteredBooks.map((book) => (
                            <TouchableOpacity 
                                key={book.BookId}
                                onPress={() => navigation.navigate("BookDetails", { bookId: book.BookId })}
                            >
                                <Card style={styles.card}>
                                    <Card.Content>
                                        <View style={{ flexDirection: "row", margin: 5, padding: 2 }}>
                                            <Image style={styles.image} source={{ uri: `${BOOK_URL}${book.ImagePath}` }} />
                                            <View style={styles.textSpace}>
                                                <Text> Title : {book.Title}</Text>
                                                <Text> Author : {book.Author}</Text>
                                                <Text> Price : {book.Price} ₹</Text>
                                                <Button mode="contained" onPress={() => AddtoCart(book)}>
                                                    Add to Cart
                                                </Button>
                                            </View>
                                        </View>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Button style={styles.checkout} onPress={ChekOut}>
                        <IconButton iconColor="#f1f5f9" icon={"cart"} />
                        <Text style={{ color: 'white' }}> Check Out</Text>
                    </Button>
                </View>
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={handleSnackbarDismiss}
                duration={2000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'row',
        width: "100%",
        marginVertical: 10,
        paddingHorizontal: 15
    },
    searchBar: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        paddingLeft: 10
    },
    image: { width: 110, height: 110 },
    textSpace: { flexDirection: "column", marginLeft: 30 },
    card: { margin: 2 },
    text: { fontSize: 30, fontWeight: "bold" },
    checkout: { margin: 10, backgroundColor: '#F3B431' },
    pp: { marginTop: 10, borderWidth: 1, width: 60, height: 60, borderRadius: 30 }
});

export default BookList;
