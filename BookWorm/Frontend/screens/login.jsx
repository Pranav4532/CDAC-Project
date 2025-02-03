import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_URL } from "../utils";

const Login = (props) => {
  const { dispatch } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setError(""); // Reset error message on each login attempt

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${USER_URL}/login`, {
        email: username,
        password,
      });

      const userData = response.data;

      if (userData.status === "error") {
        setError(userData.message || "Invalid login credentials.");
      } else {
        // Store the JWT token and user ID in AsyncStorage
        const { token, userId } = userData.data;

        await AsyncStorage.setItem("jwtToken", token); // Store JWT token
        await AsyncStorage.setItem("userId", userId.toString()); // Store user ID

        // Optionally, store additional user data if required
        dispatch({ type: "user/login", payload: userData.data });

        // Navigate to the home screen
        navigation.navigate("Home");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const toggleVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageWrapper}>
          {/* Add your images here */}
          <Image source={require("../assets/head.png")} style={styles.topImage} />
        </View>

        <View style={styles.formWrapper}>
          <Text style={styles.title}>Sign In</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              secureTextEntry={secureTextEntry}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={toggleVisibility}
              style={styles.emojiButton}
            >
              <Text style={styles.emoji}>{secureTextEntry ? "👁️" : "🙈"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => props.navigation.navigate("Register")}>
            <Text style={styles.toggleText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  topImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  formWrapper: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordWrapper: {
    width: "100%",
    position: "relative",
  },
  emojiButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
  },
  emoji: {
    fontSize: 20,
  },
  button: {
    backgroundColor: "#fbbf24",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  toggleText: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 20,
  },
  errorText: {
    color: "#f44336",
    fontSize: 16,
    marginBottom: 15,
  },
});

export default Login;
