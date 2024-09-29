import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../src/firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore';

const AppointmentManagementScreen = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch all appointments from Firestore
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        const allAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sắp xếp các cuộc hẹn theo ngày giờ (mới nhất trước)
        const sortedAppointments = allAppointments.sort((a, b) => {
          return b.bookingDate.toDate() - a.bookingDate.toDate(); // Sắp xếp giảm dần
        });

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    fetchAppointments();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentText}>Khách hàng: <Text style={styles.bold}>{item.customerName}</Text></Text>
      <Text style={styles.appointmentText}>Điện thoại: <Text style={styles.bold}>{item.customerPhone}</Text></Text>
      <Text style={styles.appointmentText}>Dịch vụ: <Text style={styles.bold}>{item.serviceName}</Text></Text>
      <Text style={styles.appointmentText}>Giá: <Text style={styles.bold}>{item.servicePrice} VND</Text></Text>
      <Text style={styles.appointmentText}>Thời gian: <Text style={styles.bold}>{item.serviceDuration} phút</Text></Text>
      <Text style={styles.appointmentText}>Trạng thái: <Text style={styles.bold}>{item.status}</Text></Text>
      <Text style={styles.appointmentText}>Email nhân viên: <Text style={styles.bold}>{item.employeeEmail}</Text></Text>
      <Text style={styles.appointmentText}>Ngày đặt: <Text style={styles.bold}>{item.bookingDate.toDate().toLocaleString()}</Text></Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Lịch Hẹn</Text>
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noAppointments}>Không có lịch hẹn nào</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4', // Màu nền nhẹ
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Màu chữ tiêu đề
  },
  appointmentItem: {
    backgroundColor: '#ffffff', // Màu nền của mục lịch hẹn
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3, // Tăng độ nổi của mục
  },
  appointmentText: {
    fontSize: 16,
    color: '#555', // Màu chữ
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold', // Định dạng chữ đậm cho các thông tin quan trọng
  },
  noAppointments: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777', // Màu chữ cho thông báo không có lịch hẹn
    marginTop: 50,
  },
});

export default AppointmentManagementScreen;
