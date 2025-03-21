import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1R5KPByb3b7_bcfnVstZQjPLu0Mc5gG8",
  authDomain: "fitness4all-acb27.firebaseapp.com",
  projectId: "fitness4all-acb27",
  storageBucket: "fitness4all-acb27.firebasestorage.app",
  messagingSenderId: "274077520789",
  appId: "1:274077520789:web:dd3fcca5ef6811b0e09c9c",
  measurementId: "G-6RN358N2XF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
export const registerUser = async (email: string, password: string, role: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create a user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// User data functions
export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Exercise plan functions
export const createExercisePlan = async (patientId: string, plan: any) => {
  try {
    const exerciseRef = doc(collection(db, "exercisePlans"));
    await setDoc(exerciseRef, {
      patientId,
      ...plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return exerciseRef.id;
  } catch (error) {
    throw error;
  }
};

export const getExercisePlans = async (patientId: string) => {
  try {
    const q = query(collection(db, "exercisePlans"), where("patientId", "==", patientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Diet plan functions
export const createDietPlan = async (patientId: string, plan: any) => {
  try {
    const dietRef = doc(collection(db, "dietPlans"));
    await setDoc(dietRef, {
      patientId,
      ...plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return dietRef.id;
  } catch (error) {
    throw error;
  }
};

export const getDietPlans = async (patientId: string) => {
  try {
    const q = query(collection(db, "dietPlans"), where("patientId", "==", patientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Progress update functions
export const updateProgress = async (patientId: string, update: any) => {
  try {
    const progressRef = doc(collection(db, "progressUpdates"));
    await setDoc(progressRef, {
      patientId,
      ...update,
      createdAt: new Date().toISOString()
    });
    return progressRef.id;
  } catch (error) {
    throw error;
  }
};

export const getProgressUpdates = async (patientId: string) => {
  try {
    const q = query(collection(db, "progressUpdates"), where("patientId", "==", patientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export { auth, db }; 