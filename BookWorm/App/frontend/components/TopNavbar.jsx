import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TopNav = () => {
  const navigation = useNavigation(); // Correct placement of useNavigation

  return (
    <View style={styles.topNav}>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}> 
        <MaterialIcons name="person" size={28} color="white" style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.navTitle}>BookWorm</Text>
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.iconSpacing}>
          <MaterialIcons name="shopping-cart" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.navigate("Login"); // Navigate to Login after logout
        }}>
          <MaterialIcons name="logout" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topNav: {
    marginTop: 20,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginRight: 15,
  },
});

export default TopNav;
