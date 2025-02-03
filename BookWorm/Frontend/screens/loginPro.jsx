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
import { useUser } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { USER_URL } from "../utils";
import sub from "../assets/body.png";
import main from "../assets/head.png";

const LoginScreen = (props) => {
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
      const response = await axios
        .post(`${USER_URL}/login`, {
          email: username,
          password: password,
        })
        .then((result) => {
          userData = result.data;
          if (userData.status === "error") {
            setError(userData.message || "Invalid login credentials.");
          } else {
            dispatch({ type: "user/login", payload: userData.data });
            props.navigation.navigate("Home");
          }
        });
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const toggleVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onRegister = () => {
    props.navigation.navigate("Register");
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
              <TouchableOpacity
                onPress={toggleVisibility}
                style={styles.emojiButton}
              >
                <Text style={styles.emoji}>
                  {secureTextEntry ? "👁️" : "🙈"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.toggleText} onPress={onRegister}>
                Don't have an account? Sign Up
              </Text>
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
    marginTop: 20,
    width: "100%",
    height: 600,
    resizeMode: "cover",
    position: "relative",
  },
  formWrapper: {
    marginTop: -80,
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
    width: "100%", // Make the wrapper take the full width
    flexDirection: "row", // To align the password input and the emoji button horizontally
    alignItems: "center", // Vertically center the button and input
    marginBottom: 0,
  },
  emojiButton: {
    position: "relative", // To position the button over the right side of the input
    alignItems: "center",
    marginLeft: "-45", // Push the button to the right
    height: "100%",
    width: 50,
  },
  emoji: {
    fontSize: 30,
  },
});

export default LoginScreen;
