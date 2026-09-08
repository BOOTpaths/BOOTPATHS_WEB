/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
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
  const [userRole, setUserRole] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featureFlags, setFeatureFlags] = useState({
    enableLeadApplications: false,
    enableExpeditionViews: false,
    enableSocialFeeds: false,
    enableCommunityBlogs: false,
    enableMaintenanceMode: false
  });

  useEffect(() => {
    const unsubFeatureFlags = onSnapshot(doc(db, 'app_settings', 'feature_flags'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFeatureFlags({
          enableLeadApplications: !!data.enableLeadApplications,
          enableExpeditionViews: !!data.enableExpeditionViews,
          enableSocialFeeds: !!data.enableSocialFeeds,
          enableCommunityBlogs: !!data.enableCommunityBlogs,
          enableMaintenanceMode: !!data.enableMaintenanceMode
        });
      } else {
        // Create the document if it doesn't exist
        const defaultFlags = {
          enableLeadApplications: false,
          enableExpeditionViews: false,
          enableSocialFeeds: false,
          enableCommunityBlogs: false,
          enableMaintenanceMode: false
        };
        setDoc(doc(db, 'app_settings', 'feature_flags'), defaultFlags).catch((err) => {
          console.warn('Failed to initialize feature flags doc:', err);
        });
        setFeatureFlags(defaultFlags);
      }
    }, (err) => {
      console.warn('Feature Flags subscription notice:', err.message);
    });
    return () => unsubFeatureFlags();
  }, []);

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const emailClean = (user.email || "").trim().toLowerCase();
        const isAuthorizedAdmin = emailClean === 'admin@bootpaths.com' || emailClean === 'vzentura2026@gmail.com';
        const isAuthorizedDev = emailClean === 'vzentura2026@gmail.com';
        setIsAdmin(isAuthorizedAdmin);

        if (isAuthorizedAdmin) {
          sessionStorage.setItem("isAdmin", "true");
          sessionStorage.setItem("isDevOps", "true");
          sessionStorage.setItem("dev_bypass", "true");
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("userRole", isAuthorizedDev ? "devops" : "admin");
        } else {
          // Thoroughly wipe dev & admin privilege flags for normal users
          sessionStorage.removeItem("isAdmin");
          sessionStorage.removeItem("isDevOps");
          sessionStorage.removeItem("dev_bypass");
          localStorage.removeItem("isAdmin");
          localStorage.removeItem("isDevOps");
          localStorage.removeItem("userRole");
          localStorage.removeItem("bootpaths_admin_active");
          localStorage.removeItem("bootpaths_developer_mode");
        }

        // Listen to live user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeUserDoc = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserData(data);
            setWalletBalance(data.walletBalance || 0);
            const resolvedRole = isAuthorizedDev 
              ? 'superadmin' 
              : (isAuthorizedAdmin ? 'admin' : (data.role || 'member'));
            setUserRole(resolvedRole);
            if (isAuthorizedAdmin) {
              setIsAdmin(true);
            }
          } else {
            // Create user document if it doesn't exist yet
            const initials = user.displayName
              ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              : (user.email ? user.email[0].toUpperCase() : 'EX');
            const initialRole = isAuthorizedDev 
              ? 'superadmin' 
              : (isAuthorizedAdmin ? 'admin' : 'member');
            const initialUserData = {
              uid: user.uid,
              name: user.displayName || (user.email ? user.email.split('@')[0] : 'Explorer'),
              displayName: user.displayName || 'Explorer',
              email: user.email,
              photoURL: user.photoURL || null,
              initials: initials,
              walletBalance: 0,
              role: initialRole,
              createdAt: new Date().toISOString()
            };
            setDoc(userDocRef, initialUserData).catch((err) => {
              console.warn('Firestore User Sync Notice:', err.message);
            });
            setUserData(initialUserData);
            setUserRole(initialUserData.role);
          }
          setLoading(false);
        }, (err) => {
          console.warn('Firestore Snapshot Notice:', err.message);
          setLoading(false);
        });

      } else {
        sessionStorage.removeItem("isAdmin");
        sessionStorage.removeItem("isDevOps");
        sessionStorage.removeItem("dev_bypass");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("isDevOps");
        localStorage.removeItem("userRole");
        localStorage.removeItem("bootpaths_admin_active");
        localStorage.removeItem("bootpaths_developer_mode");
        setCurrentUser(null);
        setUserData(null);
        setUserRole(null);
        setWalletBalance(0);
        setIsAdmin(false);
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        setLoading(false);
      }
    });

    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(safetyTimer);
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
      const emailClean = (email || "").trim().toLowerCase();
      const isAuthorizedAdmin = emailClean === 'admin@bootpaths.com' || emailClean === 'vzentura2026@gmail.com';
      const isAuthorizedDev = emailClean === 'vzentura2026@gmail.com';
      const role = isAuthorizedDev ? 'superadmin' : (isAuthorizedAdmin ? 'admin' : 'member');
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        name: name,
        displayName: name,
        email: email,
        initials: initials,
        walletBalance: 0,
        role: role,
        createdAt: new Date().toISOString()
      });
    }
    return res;
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const emailClean = (res.user.email || "").trim().toLowerCase();
        const isAuthorizedAdmin = emailClean === 'admin@bootpaths.com' || emailClean === 'vzentura2026@gmail.com';
        const isAuthorizedDev = emailClean === 'vzentura2026@gmail.com';
        const role = isAuthorizedDev ? 'superadmin' : (isAuthorizedAdmin ? 'admin' : 'member');

        const userDocRef = doc(db, 'users', res.user.uid);
        const initials = res.user.displayName
          ? res.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : (res.user.email ? res.user.email[0].toUpperCase() : 'EX');

        await setDoc(userDocRef, {
          uid: res.user.uid,
          name: res.user.displayName || (res.user.email ? res.user.email.split('@')[0] : 'Explorer'),
          displayName: res.user.displayName || 'Explorer',
          email: res.user.email,
          photoURL: res.user.photoURL || null,
          initials: initials,
          role: role,
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
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("isDevOps");
    sessionStorage.removeItem("dev_bypass");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isDevOps");
    localStorage.removeItem("userRole");
    localStorage.removeItem("bootpaths_admin_active");
    localStorage.removeItem("bootpaths_developer_mode");
    setCurrentUser(null);
    setUserData(null);
    setUserRole(null);
    setWalletBalance(0);
    setIsAdmin(false);
  };

  const value = {
    currentUser,
    userData,
    userRole,
    setUserRole,
    walletBalance,
    setWalletBalance,
    isAdmin,
    loading,
    authLoading: loading,
    featureFlags,
    setFeatureFlags,
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
