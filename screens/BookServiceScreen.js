import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { db } from '../src/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../src/AuthContext';

const BookServiceScreen = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceDetails, setServiceDetails] = useState(null); // For service details
  const { user } = useContext(AuthContext); // Get logged-in user

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const serviceDoc = await getDoc(doc(db, 'services', serviceId));
        if (serviceDoc.exists()) {
          setServiceDetails(serviceDoc.data());
        } else {
          console.log("No such service!");
        }
      } catch (error) {
        console.error("Error fetching service details: ", error);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const handleAddBooking = async () => {
    if (!customerName || !customerPhone) {
      alert("Please fill in all fields");
      return;
    }
  
    try {
      // Add the booking to Firestore
      await addDoc(collection(db, 'appointments'), {
        serviceId: serviceId,
        customerName: customerName,
        customerPhone: customerPhone,
        bookingDate: new Date(),
        status: 'pending',
        employeeEmail: user.email, // Store the email of the logged-in employee
        serviceName: serviceDetails.name, // Use service name from Firestore
        servicePrice: serviceDetails.price, // Use price from Firestore
        serviceDuration: serviceDetails.duration, // Use duration from Firestore
      });
  
      // Navigate to payment screen and pass required parameters
      navigation.navigate('PaymentScreen', {
        serviceName: serviceDetails.name,
        price: serviceDetails.price,
        customerName: customerName,
      });
    } catch (error) {
      console.error("Error adding booking: ", error);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Book a Service</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên khách hàng"
        value={customerName}
        onChangeText={setCustomerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại khách hàng"
        value={customerPhone}
        onChangeText={setCustomerPhone}
        keyboardType="phone-pad"
      />

      {/* Display service details if they are loaded */}
      {serviceDetails && (
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceHeader}>Service Details</Text>
          <Text style={styles.serviceText}>Tên: <Text style={styles.serviceHighlight}>{serviceDetails.name}</Text></Text>
          <Text style={styles.serviceText}>Giá: <Text style={styles.serviceHighlight}>{serviceDetails.price} VND</Text></Text>
          <Text style={styles.serviceText}>Thời gian: <Text style={styles.serviceHighlight}>{serviceDetails.duration} phút</Text></Text>
          <Text style={styles.serviceText}>Chi tiết: <Text style={styles.serviceHighlight}>{serviceDetails.description}</Text></Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddBooking}>
        <Text style={styles.buttonText}>Đặt dịch vụ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007BFF',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#ffffff',
  },
  serviceDetails: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  serviceHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007BFF',
  },
  serviceText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  serviceHighlight: {
    fontWeight: 'bold',
    color: '#28A745', // Green color for highlights
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookServiceScreen;
