import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut 
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const adminFlag = user.email?.toLowerCase() === 'admin@bootpaths.com';
        setIsAdmin(adminFlag);

        // Listen to live user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeUserDoc = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserData(data);
            setWalletBalance(data.walletBalance || 0);
            if (data.role === 'admin') setIsAdmin(true);
          } else {
            // Create user document if it doesn't exist yet
            const initials = user.displayName
              ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              : user.email[0].toUpperCase();
            const initialUserData = {
              uid: user.uid,
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              photoURL: user.photoURL || null,
              initials: initials,
              walletBalance: 0,
              role: adminFlag ? 'admin' : 'hiker',
              createdAt: new Date().toISOString()
            };
            setDoc(userDocRef, initialUserData).catch((err) => {
              console.warn('Firestore User Sync Notice:', err.message);
            });
            setUserData(initialUserData);
          }
        }, (err) => {
          console.warn('Firestore Snapshot Notice:', err.message);
        });

      } else {
        setCurrentUser(null);
        setUserData(null);
        setWalletBalance(0);
        setIsAdmin(false);
        if (unsubscribeUserDoc) unsubscribeUserDoc();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res.user) {
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        name: name,
        email: email,
        initials: initials,
        walletBalance: 0,
        role: 'hiker',
        createdAt: new Date().toISOString()
      });
    }
    return res;
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const userDocRef = doc(db, 'users', res.user.uid);
        const initials = res.user.displayName
          ? res.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : res.user.email[0].toUpperCase();

        await setDoc(userDocRef, {
          uid: res.user.uid,
          name: res.user.displayName || res.user.email.split('@')[0],
          displayName: res.user.displayName || '',
          email: res.user.email,
          photoURL: res.user.photoURL || null,
          initials: initials,
          role: 'user',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      return res;
    } catch (err) {
      console.warn('Firebase Google Login Notice:', err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase Logout Notice:', err.message);
    }
    setCurrentUser(null);
    setUserData(null);
    setWalletBalance(0);
    setIsAdmin(false);
  };

  const value = {
    currentUser,
    userData,
    walletBalance,
    setWalletBalance,
    isAdmin,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
