import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { fetchUsers, addUser, updateUser, deleteUser } from '../src/api';

const UserManagementApp = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [editId, setEditId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersList = await fetchUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
      Alert.alert('Error', 'Failed to fetch users. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddUser = async () => {
    if (!name || !email || !age) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
  
    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 100) {
      Alert.alert('Error', 'Age must be a number between 18 and 100.');
      return;
    }
  
    setLoading(true);
    const userDoc = { name, email, age: ageNumber };
    
    try {
      await addUser(userDoc);
      setName('');
      setEmail('');
      setAge('');
      loadUsers();
    } catch (error) {
      console.error("Error adding user: ", error);
      Alert.alert('Error', 'Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateUser = async () => {
    if (!name || !email || !age) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
  
    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 100) {
      Alert.alert('Error', 'Age must be a number between 18 and 100.');
      return;
    }
  
    const userDoc = { name, email, age: ageNumber };
    
    try {
      await updateUser(editId, userDoc);
      setEditId(null);
      setModalVisible(false);
      loadUsers();
    } catch (error) {
      console.error("Error updating user: ", error);
      Alert.alert('Error', 'Failed to update user. Please try again.');
    }
  };
  
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
      Alert.alert('Error', 'Failed to delete user. Please try again.');
    }
  };
  

  useEffect(() => {
    loadUsers();
  }, []);

  const handleClearFields = () => {
    setName('');
    setEmail('');
    setAge('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manager Users</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Age" value={age} keyboardType="numeric" onChangeText={setAge} />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleAddUser}>
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleClearFields}>
          <Text style={styles.buttonText}>Clear Fields</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loading} />}

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>Name: {item.name}</Text>
            <Text style={styles.userEmail}>Email: {item.email}</Text>
            <Text style={styles.userAge}>Age: {item.age}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => {
                setName(item.name);
                setEmail(item.email);
                setAge(item.age.toString());
                setEditId(item.id);
                setModalVisible(true);
              }}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
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
          <Text style={styles.modalTitle}>Edit Users</Text>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Age" value={age} keyboardType="numeric" onChangeText={setAge} />
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
              <Text style={styles.buttonText}>Update User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    marginVertical: 20,
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  userAge: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default UserManagementApp;
