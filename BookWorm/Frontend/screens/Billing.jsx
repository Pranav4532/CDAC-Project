import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function Billing(props) {
  const { cart: initialCart, totalAmount: initialTotalAmount } = props.route.params;

  // Ensure totalAmount is a number (parse it as float to avoid any string issues)
  const [cart, setCart] = useState(initialCart.map(item => ({
    ...item,
    quantity: item.quantity || 1, // Ensure quantity is initialized to 1 if not already present
  })));
  const [totalAmount, setTotalAmount] = useState(parseFloat(initialTotalAmount) || 0); // Default to 0 if invalid
  const [deliveryFee] = useState(50);
  const [platformFee] = useState(20);
  const [gstRate] = useState(0.18);

  // Function to remove item from cart and update the total
  const removeItem = (itemToRemove) => {
    const updatedCart = cart.filter(item => item.BookId !== itemToRemove.BookId);
    setCart(updatedCart);

    // Recalculate the total amount by summing the price of the remaining items
    const updatedTotalAmount = updatedCart.reduce((sum, item) => sum + (parseFloat(item.Price) * item.quantity), 0);
    setTotalAmount(updatedTotalAmount);
  };

  // Function to increase item quantity
  const increaseQuantity = (item) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.BookId === item.BookId
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setCart(updatedCart);

    // Recalculate the total amount
    const updatedTotalAmount = updatedCart.reduce((sum, item) => sum + (parseFloat(item.Price) * item.quantity), 0);
    setTotalAmount(updatedTotalAmount);
  };

  // Function to decrease item quantity
  const decreaseQuantity = (item) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.BookId === item.BookId && cartItem.quantity > 1
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem
    );
    setCart(updatedCart);

    // Recalculate the total amount
    const updatedTotalAmount = updatedCart.reduce((sum, item) => sum + (parseFloat(item.Price) * item.quantity), 0);
    setTotalAmount(updatedTotalAmount);
  };

  // Recalculate GST and final amount
  const gstAmount = totalAmount * gstRate;
  const finalAmount = totalAmount + deliveryFee + platformFee + gstAmount;

  // Log values for debugging
  console.log("Initial Total Amount: ", initialTotalAmount);
  console.log("Current Total Amount: ", totalAmount);
  console.log("GST Amount: ", gstAmount);
  console.log("Final Amount: ", finalAmount);

  // Function to navigate to payment page
  const Bill = () => {
    if (!isNaN(finalAmount) && finalAmount > 0) {
      props.navigation.navigate('Pay', { totalAmount: finalAmount.toFixed(2) });
    } else {
      console.error("Invalid total amount: ", finalAmount);
      // Optionally show an alert or message to the user
    }
  };

  return (
    <ScrollView>
      <Card>
        <Card.Content>
          <View style={{ width: "100%" }}>
            <Text>Your Bill</Text>
            <View style={{ margin: "auto", width: "80%" }}>
              {cart.map((item) => (
                <Card style={{ margin: 10 }} key={item.BookId}>
                  <Card.Content>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Image style={styles.imageBill} source={{ uri: item.ImagePath }} />
                      <Text>{item.Title} - ₹{(parseFloat(item.Price) * item.quantity).toFixed(2)}</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Button
                          mode="contained"
                          style={{ backgroundColor: '#FF6F61', marginTop: 10 }}
                          onPress={() => decreaseQuantity(item)}
                        >
                          -
                        </Button>
                        <Text style={{ marginTop: 10, fontSize: 18 }}>Qty: {item.quantity}</Text>
                        <Button
                          mode="contained"
                          style={{ backgroundColor: '#FF6F61', marginTop: 10 }}
                          onPress={() => increaseQuantity(item)}
                        >
                          +
                        </Button>
                      </View>
                      <Button
                        mode="contained"
                        style={{ backgroundColor: '#FF6F61', marginTop: 10 }}
                        onPress={() => removeItem(item)}
                      >
                        Remove
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Card style={styles.billcard}>
                <Card.Content>
                  <Text style={styles.textStyle}>Item Total: ₹{totalAmount.toFixed(2)}</Text>
                  <View style={styles.separator} />

                  <Text style={styles.textStyle}>Delivery Fee: ₹{deliveryFee}</Text>
                  <View style={styles.separator} />

                  <Text style={styles.textStyle}>Platform Fee: ₹{platformFee}</Text>
                  <View style={styles.separator} />

                  <Text style={styles.textStyle}>GST (18%): ₹{gstAmount.toFixed(2)}</Text>
                  <View style={styles.separator} />

                  <Text style={styles.textStyle}>Total Amount to Pay: ₹{finalAmount.toFixed(2)}</Text>
                  <Button
                    style={styles.proceedButton}
                    onPress={Bill}
                  >
                    <Text style={{ color: 'white' }}>Proceed To Pay</Text>
                  </Button>
                </Card.Content>
              </Card>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBill: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  billcard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  textStyle: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 5,
    color: '#333',
  },
  proceedButton: {
    backgroundColor: '#45CE30',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});
