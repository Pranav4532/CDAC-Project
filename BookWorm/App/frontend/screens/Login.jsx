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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { USER_URL } from "../utils";
import sub from "../assets/body.png";
import main from "../assets/head.png";

const LoginScreen = ({ navigation }) => {
  const { dispatch } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      console.log("Logging in...", username, password);
      const response = await axios.post(`${USER_URL}/login`, {
        username,
        password,
      });

      const { token, message } = response.data;
      if (!token) {
        setError(message || "Invalid login credentials.");
        return;
      }

      // Decode JWT token
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      const userRole = decodedToken.role;

      // Store token in AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userRole", userRole);
      const storedToken = await AsyncStorage.getItem("token");
console.log("Stored Token in AsyncStorage:", storedToken);

      // Store token in context
      dispatch({ type: "user/login", payload: { token, username, role: userRole } });

      // Navigate based on role
      if (userRole === "buyer") {
        navigation.navigate("BookList");
      } else if (userRole === "seller") {
        navigation.navigate("SellerBookList");
      } else {
        setError("Unauthorized role.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainDiv}>
          <View style={styles.topImageContainer}>
            <Image source={main} style={styles.topImage} />
          </View>

          <View style={styles.subDiv}>
            <Image source={sub} style={styles.mainImage} />
          </View>

          <View style={styles.formWrapper}>
            <Text style={styles.title}>Sign In</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
              placeholder="Username"
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
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeButton}>
                <Text style={styles.emoji}>{secureTextEntry ? "👁️" : "🙈"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.toggleText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
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
  mainDiv: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  topImageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  topImage: {
    height: 100,
    width: "100%",
    resizeMode: "cover",
  },
  subDiv: {
    flex: 1,
    width: "100%",
  },
  mainImage: {
    marginTop: 10,
    width: "100%",
    height: 700,
    resizeMode: "cover",
    position: "relative",
  },
  formWrapper: {
    position: "absolute",
    top: "30%",
    left: "5%",
    right: "5%",
    alignItems: "center",
    backgroundColor: "#C2B3B3",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFD700",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#2B91DA",
    padding: 15,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleText: {
    textAlign: "center",
    marginTop: 15,
    color: "#FFD700",
    fontWeight: "bold",
  },
  passwordWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  emoji: {
    fontSize: 25,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
