import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Button, Text } from 'react-native-paper';

export default function Thankyou(props) {
  const Menus = () => {
    props.navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://i.pinimg.com/236x/2c/7b/be/2c7bbeb42fa01dcc040161e00544e1e7.jpg'}}  
        style={styles.image}
      />
      <Text style={styles.title}>Thank You!</Text>
      <Text style={styles.message}>Your order has been successfully placed.</Text>
      <Button mode="contained" onPress={Menus} style={styles.button}>
        Order Again!
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
