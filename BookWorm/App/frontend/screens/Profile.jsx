import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { USER_URL } from "../utils";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Retrieved Token in Profile Screen:", token);

        if (!token) {
          console.log("No token found, redirecting to login...");
          navigation.navigate("Login");
          return;
        }

        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired, logging out...");
          await AsyncStorage.removeItem("token");
          navigation.navigate("Login");
          return;
        }

        const userId = decoded.id;
        console.log("Fetching user data for ID:", userId);

        const response = await axios.get(`${USER_URL}/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setName(response.data.name);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (!isEditing) {
      // Switch to Edit Mode
      setIsEditing(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found, please log in again");
        navigation.navigate("Login");
        return;
      }

      const updatedData = { name, username, email, phone };
      if (password) updatedData.password = password;

      console.log("Updating profile with:", updatedData);

      await axios.put(`${USER_URL}/profile/update`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false); // Switch back to read-only mode
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? "Update Profile" : "Profile"}</Text>

      {/* Name Field */}
      <TextInput
        style={[styles.input, isEditing ? {} : styles.readOnly]}
        value={name}
        onChangeText={setName}
        editable={isEditing}
        placeholder="Name"
      />

      {/* Username Field */}
      <TextInput
        style={[styles.input, isEditing ? {} : styles.readOnly]}
        value={username}
        onChangeText={setUsername}
        editable={isEditing}
        placeholder="Username"
      />

      {/* Email Field */}
      <TextInput
        style={[styles.input, isEditing ? {} : styles.readOnly]}
        value={email}
        onChangeText={setEmail}
        editable={isEditing}
        placeholder="Email"
        keyboardType="email-address"
      />

      {/* Phone Field */}
      <TextInput
        style={[styles.input, isEditing ? {} : styles.readOnly]}
        value={phone}
        onChangeText={setPhone}
        editable={isEditing}
        placeholder="Phone"
        keyboardType="phone-pad"
      />

      {/* New Password Field (Only in Edit Mode) */}
      {isEditing && (
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="New Password"
          secureTextEntry
        />
      )}

      {/* Update Profile / Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>{isEditing ? "Save" : "Update Profile"}</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  readOnly: {
    backgroundColor: "#f0f0f0", // Light gray for read-only fields
    color: "#555",
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
