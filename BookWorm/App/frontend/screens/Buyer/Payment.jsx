import { StyleSheet, Text, View, Image, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Button, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Payment(props) {
  const Receipt = () => {
    props.navigation.navigate('Confirmation', { totalAmount, cartItems, paymentMethod: checked });
  };

  const { totalAmount, cartItems } = props.route.params; // Cart items passed as params

  const [checked, setChecked] = useState('card');
  const [paymentId, setPaymentId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.title}>Select Payment Method</Text>

        <RadioButton.Group
          onValueChange={(newValue) => {
            setChecked(newValue);
            setPaymentId('');
          }}
          value={checked}
        >
          {/* Card Payment */}
          <View style={styles.option}>
            <RadioButton value="card" />
            <View style={styles.iconContainer}>
              <Icon name="credit-card" size={30} color="#fff" />
            </View>
            <Text style={styles.optionText}>Pay with Card</Text>
          </View>

          {checked === 'card' && (
            <View style={styles.cardDetailsContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="Enter Card Number"
                keyboardType="numeric"
                style={styles.input}
              />
              <View style={styles.row}>
                <View style={styles.halfInputContainer}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="CVV"
                    keyboardType="numeric"
                    secureTextEntry
                    style={styles.input}
                  />
                </View>
                <View style={styles.halfInputContainer}>
                  <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                  <TextInput
                    value={expiry}
                    onChangeText={setExpiry}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Phone Pay */}
          <View style={styles.option}>
            <RadioButton value="PhonePay" />
            <Image
              source={{
                uri: 'https://i.pinimg.com/736x/2a/cf/b6/2acfb6fb41f7fcb82c3230afdecff714.jpg',
              }}
              style={styles.image}
            />
            <Text style={styles.optionText}>Phone Pay</Text>
          </View>

          {checked === 'PhonePay' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter Your PhonePay ID:</Text>
              <TextInput
                value={paymentId}
                onChangeText={setPaymentId}
                placeholder="Enter ID"
                style={styles.input}
              />
            </View>
          )}

          {/* Google Pay */}
          <View style={styles.option}>
            <RadioButton value="Gpay" />
            <Image
              source={{
                uri: 'https://i.pinimg.com/736x/8d/ec/e1/8dece15cc40aaf66ed47f6591b639d06.jpg',
              }}
              style={styles.image}
            />
            <Text style={styles.optionText}>Google Pay</Text>
          </View>

          {checked === 'Gpay' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter Your Google Pay ID:</Text>
              <TextInput
                value={paymentId}
                onChangeText={setPaymentId}
                placeholder="Enter ID"
                style={styles.input}
              />
            </View>
          )}

          {/* Cash on Delivery */}
          <View style={styles.option}>
            <RadioButton value="Cash" />
            <Image
              source={{
                uri: 'https://cdn-icons-png.freepik.com/512/8992/8992633.png',
              }}
              style={styles.image}
            />
            <Text style={styles.optionText}>Cash on Delivery</Text>
          </View>
        </RadioButton.Group>

        <Text style={styles.amountText}>Total Amount: ₹{totalAmount}</Text>

        <Button mode="contained" onPress={Receipt} style={styles.button}>
          See Receipt
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00695c',
    marginBottom: 30,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderColor: '#004d40',
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004d40',
    borderRadius: 50,
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  optionText: {
    fontSize: 18,
    color: '#00796b',
    fontWeight: '500',
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d40',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#004d40',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardDetailsContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#00796b',
    borderWidth: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00796b',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#00796b',
    borderRadius: 8,
    fontSize: 16,
    color: '#004d40',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
});

