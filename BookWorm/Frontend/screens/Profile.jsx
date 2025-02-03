import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_URL } from "../utils";

export default function Profile() {
  const navigation = useNavigation();

  // User state
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [userId, setUserId] = useState(null);

  // Fetch user ID from AsyncStorage and fetch user data
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          fetchUserData(id); // Fetch user data using the userId
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  // Fetch user data
  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`${USER_URL}/user/${id}`);
      setUser(response.data.data); // Adjust depending on your response format
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Update user data
  const handleUpdate = async () => {
    try {
      await axios.put(`${USER_URL}/user/${userId}`, user);
      alert('Profile Updated Successfully!');
      navigation.navigate('home');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.view}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.container}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24 }}>Profile</Text>
                <Image source={{ uri: 'https://i.pinimg.com/236x/4a/cd/01/4acd0124f5c5b29fd25e69cf41c16fe3.jpg' }} style={styles.photo} />
                <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
                <TextInput
                  label="Enter your Name"
                  mode="outlined"
                  value={user.name}
                  onChangeText={(text) => setUser({ ...user, name: text })}
                />
                <TextInput
                  label="Enter your Email"
                  mode="outlined"
                  value={user.email}
                  onChangeText={(text) => setUser({ ...user, email: text })}
                />
                <TextInput
                  label="Enter your Mobile"
                  mode="outlined"
                  value={user.mobile}
                  onChangeText={(text) => setUser({ ...user, mobile: text })}
                />
                <TextInput
                  label="Enter your Password"
                  mode="outlined"
                  secureTextEntry
                  value={user.password}
                  onChangeText={(text) => setUser({ ...user, password: text })}
                />
                <Button onPress={handleUpdate} style={styles.button}>Update</Button>
                <View style={styles.footer}><Text>Made by Pranav ❤️</Text></View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 20 },
  button: { marginTop: 20 },
  footer: { alignItems: 'center', padding: 10, marginBottom: 20, borderTopWidth: 1, borderTopColor: '#ccc' },
  photo: { marginTop: 10, borderWidth: 1, width: 250, height: 250, borderRadius: 500, borderColor: 'black' },
  card: { alignSelf: 'stretch', margin: 20, padding: 10, backgroundColor: '#FFFFFF' },
  view: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
});
