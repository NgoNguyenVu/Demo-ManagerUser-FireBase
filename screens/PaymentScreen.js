import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BarCodeScanner } from 'expo-barcode-scanner';

const PaymentScreen = ({ route, navigation }) => {
  const { serviceName, price, customerName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [scanning, setScanning] = useState(false); // State for scanning
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // State to manage payment confirmation
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State for payment success message
  const [scannerData, setScannerData] = useState(''); // To store scanned QR code data

  const generateQRCode = () => {
    const paymentInfo = JSON.stringify({ serviceName, price, customerName });
    setQrCodeValue(paymentInfo);
    setModalVisible(true);
  };

  const handleBarCodeScanned = ({ data }) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.serviceName) {
        setScannerData(parsedData); // Save the scanned data
        setModalVisible(false); // Close QR code modal
        setPaymentConfirmed(true); // Show payment form
      } else {
        Alert.alert("Invalid QR code. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error scanning QR code. Please try again.");
    }
  };

  const confirmPayment = () => {
    setPaymentSuccess(true); // Show payment success message
    setPaymentConfirmed(false); // Hide payment confirmation form
  };

  const handleCashPayment = () => {
    Alert.alert("Thanh toán tiền mặt", "Khách hàng đã thánh toán!", [
      { text: "OK", onPress: () => navigation.navigate('HomeTab') }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thanh Toán Dịch Vụ</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Khách Hàng : <Text style={styles.infoText}>{customerName}</Text></Text>
        <Text style={styles.label}>Dịch Vụ : <Text style={styles.infoText}>{serviceName}</Text></Text>
        <Text style={styles.label}>Giá tiền : <Text style={styles.infoText}>{price} VND</Text></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCashPayment}>
        <Text style={styles.buttonText}>Thanh toán bằng tiền mặt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={generateQRCode}>
        <Text style={styles.buttonText}>QR Code</Text>
      </TouchableOpacity>

      {/* QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Scan QR Code</Text>
            <QRCode value={qrCodeValue} size={200} />
            <Text style={styles.modalText}>Use your camera to scan the QR code.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BarCode Scanner */}
      {scanning && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Payment Confirmation Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentConfirmed}
        onRequestClose={() => setPaymentConfirmed(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Confirm Payment</Text>
            <Text style={styles.label}>Customer: <Text style={styles.infoText}>{scannerData.customerName}</Text></Text>
            <Text style={styles.label}>Service: <Text style={styles.infoText}>{scannerData.serviceName}</Text></Text>
            <Text style={styles.label}>Amount: <Text style={styles.infoText}>${scannerData.price}</Text></Text>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmPayment}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPaymentConfirmed(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Success Message */}
      {paymentSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Payment Successful!</Text>
          <Button title="Back to Home" onPress={() => navigation.navigate('HomeTab')} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e9ecef',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#495057',
  },
  infoText: {
    fontWeight: 'bold',
    color: '#007BFF', // Highlighted text color
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
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
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007BFF',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6c757d',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  successMessage: {
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
});

export default PaymentScreen;
