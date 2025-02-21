import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BOOK_URL } from "../../utils";
import * as ImagePicker from "expo-image-picker";
import images from "../../assets/imageMap"; 

const BookForm = ({ navigation, route }) => {
  const bookToEdit = route.params?.book || null;
  const onUpdate = route.params?.onUpdate; // Callback function to refresh the book list

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setPrice(bookToEdit.price.toString());
      setStock(bookToEdit.stock.toString());

      // Preserve existing image if editing
      if (bookToEdit.image_path && images[bookToEdit.image_path]) {
        setImage(images[bookToEdit.image_path]);
      }
    }
  }, [bookToEdit]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Store new image
    }
  };

  const handleSubmit = async () => {
    if (!title || !author || !price || !stock) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("price", parseFloat(price));
      formData.append("stock", parseInt(stock));

      // Append image only if it's newly selected
      if (image && image.uri && (!bookToEdit || image.uri !== bookToEdit.image_path)) {
        formData.append("image", {
          uri: image.uri,
          name: "book.jpg",
          type: "image/jpg",
        });
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (bookToEdit) {
        // **Update Existing Book**
        await axios.put(`${BOOK_URL}/${bookToEdit.id}`, formData, { headers });
        Alert.alert("Success", "Book updated successfully!");
      } else {
        // **Add New Book**
        await axios.post(`${BOOK_URL}`, formData, { headers });
        Alert.alert("Success", "Book added successfully!");
      }

      if (route.params?.onUpdate) {
        route.params.onUpdate();
      }
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error("Error submitting book:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{bookToEdit ? "Edit Book" : "Add New Book"}</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? <Image source={{ uri: image.uri }} style={styles.image} /> : <Text>Pick an Image</Text>}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Author" value={author} onChangeText={setAuthor} />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{bookToEdit ? "Update Book" : "Add Book"}</Text>}
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagePicker: {
    backgroundColor: "#E0E0E0",
    width: 150,
    height: 200,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookForm;
