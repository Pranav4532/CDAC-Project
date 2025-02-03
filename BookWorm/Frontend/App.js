import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./context/UserContext";
import LoginScreen from "./screens/loginPro";
import RegisterScreen from "./screens/registerPro";
import SuccessRegister from "./screens/SuccessRegister";
import BookList from "./screens/home"
import Pay from "./screens/Pay";
import Billing from "./screens/Billing";
import Thankyou from "./screens/Thankyou";
import BookDetails from "./screens/BookDetails";
import Profile from "./screens/Profile";




const Stack = createStackNavigator();

// Hello Screen
const HelloScreen = ({ navigation }) => {
  return (
    <View style={styles.helloContainer}>
      <Text style={styles.helloText}>Hello!</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.navigateText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      {/* Move the UserProvider here to wrap the navigator */}
      <UserProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, next, layouts }) => {
              if (next) {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateY: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.height, 0],
                        }),
                      },
                    ],
                  },
                };
              }
              return {}; // Default case
            },
          }}
        >
          <Stack.Screen name="Hello" component={HelloScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={BookList} />
          <Stack.Screen name="SuccessRegister" component={SuccessRegister} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="BookDetails" component={BookDetails} />
          <Stack.Screen name="bill" component={Billing} />
          <Stack.Screen name="Pay" component={Pay} />
          <Stack.Screen name="thankyou" component={Thankyou}/>

        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  helloContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  helloText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#334155",
  },
  navigateText: {
    marginTop: 20,
    fontSize: 18,
    color: "#fbbf24",
  },
});

export default App;
