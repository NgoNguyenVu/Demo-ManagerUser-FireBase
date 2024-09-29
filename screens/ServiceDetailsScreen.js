import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { db } from '../src/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ServiceDetailsScreen = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);

  useEffect(() => {
    // Lấy chi tiết dịch vụ từ Firestore
    const fetchServiceDetails = async () => {
      const docRef = doc(db, 'services', serviceId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setService(docSnap.data());
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (!service) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: service.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.description}>{service.description}</Text>
        <Text style={styles.price}>Giá: <Text style={styles.priceAmount}>{service.price} VND</Text></Text>
        <Text style={styles.duration}>Thời gian: <Text style={styles.durationAmount}>{service.duration} phút</Text></Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BookServiceScreen', { serviceId: serviceId })}
        >
          <Text style={styles.buttonText}>Đặt Dịch Vụ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 15,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007BFF',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28A745',
  },
  duration: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  durationAmount: {
    fontWeight: 'bold',
    color: '#28A745',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ServiceDetailsScreen;
