import { database, storage, db } from '../firebase';
import { ref as dbRef } from 'firebase/database';
import { ref as storageRef } from 'firebase/storage';
import { doc, collection } from 'firebase/firestore';

// ============= REALTIME DATABASE REFERENCES =============
export const createRealtimeRef = (id: string, link: string, val: string) => 
  dbRef(database, `${link}/${id}/${val}`);

export const proofRef = (userId: string, fileId: string) => 
  dbRef(database, `proofFile/${userId}/${fileId}`);

export const userRef = (userId: string, child?: string) => 
  dbRef(database, `users/${userId}${child ? `/${child}` : ''}`);

export const orderRef = (orderId: string) => 
  dbRef(database, `orders/${orderId}`);

// ============= FIRESTORE REFERENCES =============
export const createFirestoreDoc = (collectionName: string, docId: string) => 
  doc(db, collectionName, docId);

export const createFirestoreCollection = (collectionName: string) => 
  collection(db, collectionName);

export const productsCollection = () => collection(db, 'products');
export const productDoc = (productId: string) => doc(db, 'products', productId);
export const usersCollection = () => collection(db, 'users');
export const userDoc = (userId: string) => doc(db, 'users', userId);
export const ordersCollection = () => collection(db, 'orders');
export const orderDoc = (orderId: string) => doc(db, 'orders', orderId);

// ============= STORAGE REFERENCES =============
export const createStorageRef = (folder: string, id: string, fileName: string) => 
  storageRef(storage, `${folder}/${id}/${fileName}`);

export const productImageRef = (productId: string, imageName: string) => 
  storageRef(storage, `products/${productId}/${imageName}`);

export const productImagesFolderRef = (productId: string) => 
  storageRef(storage, `products/${productId}`);

export const userAvatarRef = (userId: string, fileName: string) => 
  storageRef(storage, `avatars/${userId}/${fileName}`);

export const tempImageRef = (tempId: string, fileName: string) => 
  storageRef(storage, `temp/${tempId}/${fileName}`);

// ============= HELPER: Generate Storage Path =============
export const generateStorageFileName = (originalName: string, index: number): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'jpg';
  const safeName = originalName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  return `${timestamp}_${random}_${index}_${safeName}.${extension}`;
};