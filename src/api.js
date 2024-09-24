// src/userService.js
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const fetchUsers = async () => {
  const userCollection = collection(db, 'users');
  const userSnapshot = await getDocs(userCollection);
  return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUser = async (userDoc) => {
  await addDoc(collection(db, 'users'), userDoc);
};

export const updateUser = async (id, userDoc) => {
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, userDoc);
};

export const deleteUser = async (id) => {
  const userRef = doc(db, 'users', id);
  await deleteDoc(userRef);
};
