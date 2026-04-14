import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbyoEHnfkOUQJXOgD3NjMWGwPPBYUnIBk",
  authDomain: "rumah-sewa-app.firebaseapp.com",
  projectId: "rumah-sewa-app",
  storageBucket: "rumah-sewa-app.appspot.com",
  messagingSenderId: "562302381720",
  appId: "1:562302381720:web:ec577a0ac98e38326b2aed"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Properties
export async function savePropertiesToCloud(properties) {
  try {
    await setDoc(doc(db, "data", "properties"), {
      properties: properties,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving properties:", error);
    return false;
  }
}

export async function getPropertiesFromCloud() {
  try {
    const docSnap = await getDoc(doc(db, "data", "properties"));
    if (docSnap.exists()) {
      return docSnap.data().properties;
    }
    return null;
  } catch (error) {
    console.error("Error getting properties:", error);
    return null;
  }
}

// Tenants
export async function saveTenantsToCloud(tenants) {
  try {
    await setDoc(doc(db, "data", "tenants"), {
      tenants: tenants,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving tenants:", error);
    return false;
  }
}

export async function getTenantsFromCloud() {
  try {
    const docSnap = await getDoc(doc(db, "data", "tenants"));
    if (docSnap.exists()) {
      return docSnap.data().tenants;
    }
    return [];
  } catch (error) {
    console.error("Error getting tenants:", error);
    return [];
  }
}

// Image upload
export async function uploadImage(base64Image, path) {
  try {
    const storageRef = ref(storage, path);
    await uploadString(storageRef, base64Image, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export { db, storage };
