import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { db } from '../src/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing icon library

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [numColumns, setNumColumns] = useState(2); // State for number of columns

  useEffect(() => {
    // Fetch categories from Firestore
    const fetchCategories = async () => {
      const categoryCollection = collection(db, 'categories');
      const categorySnapshot = await getDocs(categoryCollection);
      const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoryList);
    };

    fetchCategories();
  }, []);

  // Function to toggle between one and two columns
  const toggleColumns = () => {
    setNumColumns(prev => (prev === 2 ? 1 : 2));
  };

  return (
    <View style={styles.container}>
      {/* Display logo */}
      <Image source={require('../assets/spalogo.png')} style={styles.logo} />

      {/* Header with title and toggle icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dịch Vụ</Text>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleColumns}>
          <Icon name={numColumns === 2 ? 'grid-outline' : 'list-outline'} size={30} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Display list of service categories */}
      <FlatList
        key={numColumns} // Use numColumns as key to force re-render
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate('ServiceListScreen', { categoryId: item.id, categoryName: item.name })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        numColumns={numColumns} // Use state for number of columns
        contentContainerStyle={styles.flatListContent} // Added for spacing
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8', // Slightly different background color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Space below header
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10, // Reduced space below logo
  },
  toggleButton: {
    padding: 10,
  },
  categoryItem: {
    flex: 1, // Allow the item to take equal space
    margin: 8, // Margin around each item
    padding: 16,
    backgroundColor: '#ffffff', // Use white background for categories
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    borderWidth: 1, // Optional: Add border for better separation
    borderColor: '#e0e0e0', // Light border color
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10, // Rounded corners for images
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text
    color: '#333', // Darker text color for contrast
  },
  flatListContent: {
    justifyContent: 'space-between', // Add space between items
  },
});

export default HomeScreen;
