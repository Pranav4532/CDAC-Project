import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookList from "./pages/Buyer/BookList";
import FavoritePage from "./pages/Buyer/FavoritePage";
import OrderPage from "./pages/Buyer/OrderPage";
import BookDetail from "./pages/Buyer/BookDetails";
import PaymentPage from "./pages/Buyer/PaymentPage";
import SuccessPage from "./pages/Buyer/SuccessPage";
import ProfilePage from "./pages/ProfilePage";
import SellerBooks from "./pages/Seller/SellerList";
import AdminBooks from "./pages/Admin/AdminBookList";
import SellerEdit from "./pages/Seller/SellerBooks";
import AddEditBook from "./pages/Seller/AddEditBook";
import { BookManagement } from "./pages/Admin/BookManagement";
import AdminAddEditBook from "./pages/Admin/AdminEdit";
import SellerList from "./pages/Admin/SellerList";
import AddEditSeller from "./pages/Admin/AddEditSeller";
import BuyerList from "./pages/Admin/BuyerList";
import AddEditBuyer from "./pages/Admin/AddEditBuyer";

function App() {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/books"
          element={
            <BookList
              favorites={favorites}
              setFavorites={setFavorites}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritePage favorites={favorites} setFavorites={setFavorites} />
          }
        />
        <Route
          path="/book/:id"
          element={
            <BookDetail
              favorites={favorites}
              setFavorites={setFavorites}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/order"
          element={<OrderPage cart={cart} setCart={setCart} />}
        />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/seller" element={<SellerBooks />} />
        <Route path="/admin" element={<AdminBooks />} />
        <Route path="/sellerbook" element={<SellerEdit />} />
        <Route path="/add-book" element={<AddEditBook />} />
        <Route path="/edit-book/:bookId" element={<AddEditBook />} />
        <Route path="/bookmanagement" element={<BookManagement />} />
        <Route path="/add-adminbook" element={<AdminAddEditBook />} />
        <Route path="/edit-adminbook/:bookId" element={<AdminAddEditBook />} />
        <Route path="/seller-list" element={<SellerList />} />
        <Route path="/add-seller" element={<AddEditSeller />} />
        <Route path="/edit-seller/:id" element={<AddEditSeller />} />
        <Route path="/buyer-list" element={<BuyerList />} />
        <Route path="/add-buyer" element={<AddEditBuyer />} />
        <Route path="/edit-buyer/:id" element={<AddEditBuyer />} />
      </Routes>
    </Router>
  );
}

export default App;
