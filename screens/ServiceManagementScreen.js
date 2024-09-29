import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../src/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const ServiceManagementScreen = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [newServiceImageUrl, setNewServiceImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const fetchServices = async () => {
    const serviceCollection = collection(db, 'services');
    const serviceSnapshot = await getDocs(serviceCollection);
    const serviceList = serviceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setServices(serviceList);
  };

  const fetchCategories = async () => {
    const categoryCollection = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoryCollection);
    const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCategories(categoryList);
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const addService = async () => {
    if (
      newServiceName.trim() === '' ||
      newServicePrice.trim() === '' ||
      selectedCategory === ''
    ) {
      alert('Please enter a valid service name, price, and select a category');
      return;
    }

    const serviceData = {
      name: newServiceName,
      price: Number(newServicePrice),
      description: newServiceDescription,
      duration: Number(newServiceDuration),
      imageUrl: newServiceImageUrl,
      category: selectedCategory,
    };

    await addDoc(collection(db, 'services'), serviceData);
    resetForm();
    alert('Service added successfully!');
    fetchServices();
  };

  const resetForm = () => {
    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceDescription('');
    setNewServiceDuration('');
    setNewServiceImageUrl('');
    setSelectedCategory('');
  };

  const deleteService = async (serviceId) => {
    await deleteDoc(doc(db, 'services', serviceId));
    alert('Service deleted successfully!');
    fetchServices();
  };

  const updateService = async () => {
    if (!currentService) return;

    const serviceRef = doc(db, 'services', currentService.id);
    await updateDoc(serviceRef, {
      name: newServiceName,
      price: Number(newServicePrice),
      description: newServiceDescription,
      duration: Number(newServiceDuration),
      imageUrl: newServiceImageUrl,
      category: selectedCategory,
    });

    alert('Service updated successfully!');
    setModalVisible(false);
    fetchServices();
  };

  const openEditModal = (service) => {
    setCurrentService(service);
    setNewServiceName(service.name);
    setNewServicePrice(service.price.toString());
    setNewServiceDescription(service.description);
    setNewServiceDuration(service.duration.toString());
    setNewServiceImageUrl(service.imageUrl);
    setSelectedCategory(service.category);
    setModalVisible(true);
  };

  const updateCategory = async (categoryId) => {
    if (!currentService) return;

    const serviceRef = doc(db, 'services', currentService.id);
    await updateDoc(serviceRef, {
      category: categoryId,
    });

    alert('Category updated successfully!');
    fetchServices();
    setCategoryModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Management</Text>

      <TextInput
        placeholder="Service Name"
        value={newServiceName}
        onChangeText={setNewServiceName}
        style={styles.input}
      />
      <TextInput
        placeholder="Service Price"
        value={newServicePrice}
        onChangeText={setNewServicePrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Service Description"
        value={newServiceDescription}
        onChangeText={setNewServiceDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Service Duration (in minutes)"
        value={newServiceDuration}
        onChangeText={setNewServiceDuration}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Service Image URL"
        value={newServiceImageUrl}
        onChangeText={setNewServiceImageUrl}
        style={styles.input}
      />

      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="Select Category" value="" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.addButton} onPress={addService}>
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>Price: {item.price} VND</Text>
              <TouchableOpacity onPress={() => {
                setCurrentService(item);
                setSelectedCategory(item.category);
                setCategoryModalVisible(true);
              }}>
                <Text style={styles.categoryText}>Category: {categories.find(cat => cat.id === item.category)?.name || 'N/A'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <Icon name="create-outline" size={24} color="blue" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteService(item.id)}>
                <Icon name="trash-outline" size={24} color="red" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Edit Service</Text>
          <TextInput
            placeholder="Service Name"
            value={newServiceName}
            onChangeText={setNewServiceName}
            style={styles.input}
          />
          <TextInput
            placeholder="Service Price"
            value={newServicePrice}
            onChangeText={setNewServicePrice}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={newServiceDescription}
            onChangeText={setNewServiceDescription}
            style={styles.input}
          />
          <TextInput
            placeholder="Duration (in minutes)"
            value={newServiceDuration}
            onChangeText={setNewServiceDuration}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Image URL"
            value={newServiceImageUrl}
            onChangeText={setNewServiceImageUrl}
            style={styles.input}
          />

          <TouchableOpacity style={styles.updateButton} onPress={updateService}>
            <Text style={styles.updateButtonText}>Update Service</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Category</Text>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} onPress={() => updateCategory(category.id)}>
              <Text style={styles.categoryOption}>{category.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setCategoryModalVisible(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Centering the title
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff', // White background for inputs
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50', // Green background color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  serviceItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 16,
    color: '#555',
  },
  categoryText: {
    color: '#007BFF', // Link color
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  categoryOption: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Divider between options
  },
  updateButton: {
    backgroundColor: '#2196F3', // Blue background for update
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'gray', // Gray background for cancel
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ServiceManagementScreen;
