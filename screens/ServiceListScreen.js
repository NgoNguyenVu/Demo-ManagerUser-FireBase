import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { db } from '../src/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ServiceListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch services based on categoryId from Firestore
    const fetchServices = async () => {
      const serviceCollection = collection(db, 'services');
      const q = query(serviceCollection, where('category', '==', categoryId));
      const serviceSnapshot = await getDocs(q);
      const serviceList = serviceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(serviceList);
    };

    fetchServices();
  }, [categoryId]);

  return (
    <View style={styles.container}>
      {/* Title with a more stylish look */}
      <Text style={styles.title}>{categoryName}</Text>

      {/* Display service list with enhanced styles */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('ServiceDetailsScreen', { serviceId: item.id })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>Giá : {item.price} VND</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent} // Add spacing to the list
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8', // Slightly different background color for contrast
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker title color
    textAlign: 'center', // Center the title
  },
  serviceItem: {
    padding: 16,
    backgroundColor: '#ffffff', // White background for the service items
    marginVertical: 8,
    borderRadius: 15, // More rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // Optional: Add border for better separation
    borderColor: '#e0e0e0', // Light border color
  },
  serviceImage: {
    width: 90,
    height: 90,
    marginRight: 15,
    borderRadius: 10, // Rounded corners for images
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff', // Blue color for service name
  },
  servicePrice: {
    fontSize: 18,
    color: '#555', // Dark gray color for price
    marginTop: 5,
  },
  flatListContent: {
    paddingBottom: 20, // Add bottom padding to the list
  },
});

export default ServiceListScreen;
