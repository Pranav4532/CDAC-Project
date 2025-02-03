import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { USER_URL } from "../utils";
import { useNavigation } from "@react-navigation/native";
import sub from "../assets/body.png"; 
import main from "../assets/head.png";

const RegisterScreen = (props) => {
  const { dispatch } = useUser();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone number state
  const [role, setRole] = useState(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true); // State for password visibility

  const navigation = useNavigation();


   
const handleSignUp = () => {
  if (!username || !email || !password || !confirmPassword || !role || !phoneNumber) {
    Alert.alert("Error", "All fields must be filled.");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match.");
    return;
  }

  const userData = {
    name: username,
    email: email,
    password: password,
    phoneno: phoneNumber,
    role: role,
  };

  console.log("Sending userData:", userData);

  axios
    .post(`${USER_URL}/register`, userData)
    .then((result) => {
      const data = result.status;
      console.log("Server response:", data);
      if (data.status === "error") {
        Alert.alert("Error", data.message || "Failed to register.");
      } else {
        Alert.alert("Success", "Account created successfully.");
        props.navigation.navigate("SuccessRegister");
      }
    })
    .catch((error) => {
      console.error("Error occurred:", error.message);
      Alert.alert("Error", "Something went wrong, please try again.");
    });
};

    
  // Toggle password visibility
  const toggleVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.mainDiv}>
      <View style={styles.topImageContainer}>
        <Image source={main} style={styles.topImage} />
      </View>

      <View style={styles.subDiv}>
        <Image source={sub} style={styles.mainImage} />
      </View>

      <View style={styles.formWrapper}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address" // Ensure email input
        />
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            secureTextEntry={secureTextEntry}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={toggleVisibility} style={styles.emojiButton}>
            <Text style={styles.emoji}>{secureTextEntry ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={secureTextEntry}
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={toggleVisibility} style={styles.emojiButton}>
            <Text style={styles.emoji}>{secureTextEntry ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric" // Ensure number input
        />
        <View style={styles.roleContainer}>
          <Text style={styles.roleTitle}>Select Role</Text>
          <View style={styles.roleOptions}>
            <TouchableOpacity
              style={[styles.roleButton, role === "admin" && styles.selectedRole]}
              onPress={() => setRole("admin")}
            >
              <Text style={styles.roleText}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === "Buyer" && styles.selectedRole]}
              onPress={() => setRole("Buyer")}
            >
              <Text style={styles.roleText}>Buyer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === "Seller" && styles.selectedRole]}
              onPress={() => setRole("Seller")}
            >
              <Text style={styles.roleText}>Seller</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.toggleText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    top: "30%", // Adjusting vertical position
    left: "5%", // Giving some margin from the left side
    right: "5%", // Giving some margin from the right side
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
    // marginTop:15,
    position: "absolute", // To position the button over the right side of the input
    right: 10, // Properly aligns the button to the right
    height: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    marginBottom: 10,
    fontSize: 30,
  },
  roleContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  roleOptions: {
    flexDirection: "row",
  },
  roleButton: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedRole: {
    backgroundColor: "#FFD700",
  },
  roleText: {
    fontSize: 16,
  },
});

export default RegisterScreen;
