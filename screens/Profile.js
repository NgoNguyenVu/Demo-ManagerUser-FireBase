import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../src/AuthContext';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);

  // Lấy thông tin người dùng từ context
  useEffect(() => {
    setUserName(user.name || '');
    setAvatar(user.avatarUrl || null);
  }, [user]);

  // Chọn ảnh từ thiết bị
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập ảnh để tải ảnh đại diện.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri); // Lưu URI ảnh mới vào state
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hồ sơ cá nhân</Text>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Image source={require('../assets/user.jpg')} style={styles.avatar} />
        )}
      </TouchableOpacity>

      <Text style={styles.text}>Email: {user.email}</Text>

      {/* Modal cho lựa chọn xem hoặc thay đổi ảnh đại diện */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn tùy chọn</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                pickImage();
              }}
            >
              <Text style={styles.modalButtonText}>Thay đổi ảnh đại diện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                setModalImageVisible(true); // Mở modal hiển thị ảnh lớn
              }}
            >
              <Text style={styles.modalButtonText}>Xem ảnh đại diện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal hiển thị ảnh đại diện lớn */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalImageVisible}
        onRequestClose={() => setModalImageVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity onPress={() => setModalImageVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✖️</Text>
          </TouchableOpacity>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.largeAvatar} />
          ) : (
            <Image source={require('../assets/user.jpg')} style={styles.largeAvatar} />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Nền mờ
  },
  largeAvatar: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 30,
    color: '#fff',
  },
});

export default ProfileScreen;
