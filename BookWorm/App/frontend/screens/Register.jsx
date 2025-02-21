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
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { USER_URL } from "../utils";
import sub from "../assets/body.png";
import main from "../assets/head.png";

const RegisterScreen = (props) => {
  const [name, setName] = useState("");  // Added name state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");  // Changed phoneno → phone to match API
  const [role, setRole] = useState("");  
  const [secureTextEntryPassword, setSecureTextEntryPassword] = useState(true);
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!name || !username || !email || !password || !confirmPassword || !role || !phone) {
      Alert.alert("Error", "All fields must be filled.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const userData = { name, username, email, phone, password, role };

    try {
      await axios.post(`${USER_URL}/register`, userData);
      Alert.alert("Success", "Account created successfully.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong, please try again.");
    }
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

        <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        
        {/* Password Input */}
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            secureTextEntry={secureTextEntryPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureTextEntryPassword(!secureTextEntryPassword)} style={styles.emojiButton}>
            <Text style={styles.emoji}>{secureTextEntryPassword ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={secureTextEntryConfirm}
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setSecureTextEntryConfirm(!secureTextEntryConfirm)} style={styles.emojiButton}>
            <Text style={styles.emoji}>{secureTextEntryConfirm ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        <TextInput placeholder="Phone Number" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="numeric" />

        {/* Role Dropdown */}
        <View style={styles.roleContainer}>
          <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} style={styles.picker}>
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="Buyer" value="Buyer" />
            <Picker.Item label="Seller" value="Seller" />
          </Picker>
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
  mainDiv: { flex: 1, backgroundColor: "#F5F5F5" },
  topImageContainer: { width: "100%", justifyContent: "center", alignItems: "center", marginTop: 10 },
  topImage: { height: 100, width: "100%", resizeMode: "cover" },
  subDiv: { flex: 1, width: "100%" },
  mainImage: { marginTop: 10, width: "100%", height: 700, resizeMode: "cover", position: "relative" },
  formWrapper: {
    marginTop: -90,
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#FFD700", textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 10, marginBottom: 15, width: "100%", borderRadius: 4, borderWidth: 1, borderColor: "#ccc" },
  button: { backgroundColor: "#2B91DA", padding: 15, borderRadius: 4, width: "100%", alignItems: "center", marginBottom: 15 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  toggleText: { textAlign: "center", marginTop: 15, color: "#FFD700", fontWeight: "bold" },
  passwordWrapper: { width: "100%", flexDirection: "row", alignItems: "center" },
  emojiButton: { position: "absolute", right: 10, height: "100%", width: 50, justifyContent: "center", alignItems: "center" },
  emoji: { marginBottom: 10, fontSize: 30 },
  roleContainer: { width: "100%", marginBottom: 15 },
  picker: { backgroundColor: "#fff", borderRadius: 4, borderWidth: 1, borderColor: "#ccc" },
});

export default RegisterScreen;
