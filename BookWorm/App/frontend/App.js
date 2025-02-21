import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";
import BookList from "./screens/Buyer/BookList";
import Wishlist from "./screens/Buyer/Wishlist";
import Cart from "./screens/Buyer/Cart"; // Make sure this exists
import { UserProvider } from "./context/UserContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext"; // Make sure this exists
import BookDetail from "./screens/Buyer/BookDetail";
import Billing from "./screens/Buyer/Billing";
import Confirmation from "./screens/Buyer/Confirmation";
import Payment from "./screens/Buyer/Payment";
import Profile from "./screens/Profile";
import SellerBookList from "./screens/Seller/SellerBookList";
import SellerBookDetails from "./screens/Seller/SellerBookDetails";
import BookPage from "./screens/Seller/SellerBookCRUD";
import BookForm from "./screens/Seller/SellerEditBook";

const Stack = createStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <WishlistProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="BookList" component={BookList} />
              <Stack.Screen name="BookDetail" component={BookDetail} />
              <Stack.Screen name="Wishlist" component={Wishlist} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="Billing" component={Billing} />
              <Stack.Screen name="Payment" component={Payment} />
              <Stack.Screen name="Confirmation" component={Confirmation} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="SellerBookList" component={SellerBookList} />
              <Stack.Screen name="SellerBookDetails" component={SellerBookDetails} />
              <Stack.Screen name="SellerBookCRUD" component={BookPage} />
              <Stack.Screen name="SellerEditBook" component={BookForm} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </WishlistProvider>
    </UserProvider>
  );
};

export default App;
