import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, ImageBackground, Image } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={require("../assets/body.png")} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.welcomeText}>Welcome to Book Worm!</Text>

        {/* GitBook Image Button */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.button}>
          <Image
            source={require("../assets/Bookshop.gif")} // GIF should now work
            style={styles.gitbookIcon}
          />
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  welcomeText: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 30, textAlign: "center" },
  button: { alignItems: "center", backgroundColor: "#fbbf24", padding: 15, borderRadius: 15, elevation: 5 },
  gitbookIcon: { width: 300, height: 300 },
  buttonText: { marginTop: 10, fontSize: 18, fontWeight: "bold", color: "#333" },
});

export default HomeScreen;
