import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Button, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Pay(props) {
  const CheckOut = () => {
    props.navigation.navigate('thankyou');
  };
  const { totalAmount } = props.route.params;

  const [checked, setChecked] = React.useState('card');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>

      <RadioButton.Group
        onValueChange={(newValue) => setChecked(newValue)}
        value={checked}
      >
        <View style={styles.option}>
          <RadioButton value="card" />
          <View style={styles.iconContainer}>
            <Icon name="credit-card" size={30} color="blue" />
          </View>
          <Text >Pay with Card</Text>
        </View>        

        <View style={styles.option}>
          <RadioButton value="PhonePay" />
          <Image
            source={{
              uri:'https://i.pinimg.com/736x/2a/cf/b6/2acfb6fb41f7fcb82c3230afdecff714.jpg',
            }}
            style={styles.image}
          />
          <Text> Phone Pay</Text>
        </View>

        <View style={styles.option}>
          <RadioButton value="Gpay" />
          <Image
            source={{
              uri: 'https://i.pinimg.com/736x/8d/ec/e1/8dece15cc40aaf66ed47f6591b639d06.jpg',
            }}
            style={styles.image}
          />
          <Text> Google Pay</Text>
        </View>

        <View style={styles.option}>
          <RadioButton value="Cash" />
          <Image
            source={{
              uri: 'https://cdn-icons-png.freepik.com/512/8992/8992633.png',
            }}
            style={styles.image}
          />
          <Text>  Cash on Delivery</Text>
        </View>

      </RadioButton.Group>

      <Text
        style={{
          fontSize: 24,
          fontFamily: 'monospace',
          fontWeight: 'semibold',
          textAlign: 'center',
        }}
      >
        Total  Amount: {totalAmount}₹
      </Text>

      <Button mode="contained" onPress={CheckOut} style={styles.button}>
        See Receipt
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F3F6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginVertical: 8,
    backgroundColor: '#FAFAFA',
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    backgroundColor: 'transparent', 
  },
  button: {
    marginTop: 30,
    backgroundColor: '#0EA5E9',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
