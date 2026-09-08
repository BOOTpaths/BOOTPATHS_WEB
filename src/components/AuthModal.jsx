/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, db, googleProvider } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialNotice = ''
}) {
  const { login, signup } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authErrors, setAuthErrors] = useState({});
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [resetErrorMessage, setResetErrorMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!authEmail.trim()) {
      setResetErrorMessage("Please enter your email address in the field above first.");
      setResetSuccessMessage("");
      return;
    }
    try {
      setIsAuthenticating(true);
      await sendPasswordResetEmail(auth, authEmail.trim());
      setResetSuccessMessage(`Password reset link sent to ${authEmail}! Check your inbox and spam folder.`);
      setResetErrorMessage("");
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.warn("Reset password error:", error);
      }
      if (error.code === 'auth/user-not-found' || (error.message && error.message.includes('user-not-found'))) {
        setResetErrorMessage("No registered account found with this email address.");
      } else if (error.code === 'auth/invalid-email' || (error.message && error.message.includes('invalid-email'))) {
        setResetErrorMessage("Please enter a valid email address.");
      } else {
        setResetErrorMessage("Failed to send reset email. Please try again.");
      }
      setResetSuccessMessage("");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthErrors({});
      setIsAuthenticating(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if Google user is an admin or devops engineer
      const email = user.email?.toLowerCase();
      const isAdminAccount = email === 'admin@bootpaths.com';
      const isDevOpsAccount = email === 'vzentura2026@gmail.com';

      if (isDevOpsAccount || isAdminAccount) {
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('isDevOps', 'true');
        sessionStorage.setItem('dev_bypass', 'true');
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('userRole', isDevOpsAccount ? 'superadmin' : 'admin');
        if (isDevOpsAccount) {
          localStorage.setItem('bootpaths_developer_mode', 'true');
        }
      }

      const assignedRole = isDevOpsAccount ? 'superadmin' : (isAdminAccount ? 'admin' : 'member');
      const displayName = user.displayName || (isDevOpsAccount ? 'DevOps Lead Engineer' : (isAdminAccount ? 'BOOTpaths Admin' : 'Explorer'));

      // Ensure user record exists in Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: displayName,
        name: displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        role: assignedRole,
        lastLogin: new Date().toISOString()
      }, { merge: true });

      if (onAuthSuccess) {
        const initials = displayName.substring(0, 2).toUpperCase();
        onAuthSuccess({
          uid: user.uid,
          name: displayName,
          email: user.email,
          initials: initials,
          photo: user.photoURL || null,
          role: assignedRole
        });
      }

      if (onClose) onClose();
      if (isDevOpsAccount) {
        window.location.hash = "#devops";
      } else if (isAdminAccount) {
        window.location.hash = "#admin";
      }
      window.location.reload();
    } catch (err) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthErrors({ form: "Sign-in cancelled. Please try again." });
      } else if (err.code === 'auth/popup-blocked') {
        setAuthErrors({ form: "Popup blocked by browser. Please allow popups for this site." });
      } else if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        setAuthErrors({ form: "Firebase API configuration is propagating. Please try again in 1 minute." });
      } else {
        setAuthErrors({ form: err.message || "Failed to sign in with Google." });
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isOpen) return null;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    const emailInput = (authEmail || "").trim().toLowerCase();
    const passInput = authPassword || "";

    // Immediate local dev bypass check for Superadmin / DevOps
    if (emailInput === "vzentura2026@gmail.com" && passInput === "vzentura@BooTpaths") {
      sessionStorage.setItem("dev_bypass", "true");
      sessionStorage.setItem("isDevOps", "true");
      sessionStorage.setItem("isAdmin", "true");
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("userRole", "devops");
      localStorage.setItem("bootpaths_developer_mode", "true");

      if (onAuthSuccess) {
        onAuthSuccess({
          uid: 'devops-master-uid',
          name: 'DevOps Lead Engineer',
          email: 'vzentura2026@gmail.com',
          initials: 'VZ',
          photo: null,
          role: 'superadmin'
        });
      }

      if (onClose) onClose();
      window.location.hash = "#devops";
      window.location.reload();
      return;
    }

    // Immediate local dev bypass check for Platform Admin
    if (emailInput === "admin@bootpaths.com" && passInput === "BooTpaths@Admin") {
      sessionStorage.setItem("dev_bypass", "true");
      sessionStorage.setItem("isAdmin", "true");
      sessionStorage.setItem("isDevOps", "true");
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("userRole", "admin");

      if (onAuthSuccess) {
        onAuthSuccess({
          uid: 'admin-master-uid',
          name: 'BOOTpaths Admin',
          email: 'admin@bootpaths.com',
          initials: 'BA',
          photo: null,
          role: 'admin'
        });
      }

      if (onClose) onClose();
      window.location.hash = "#admin";
      window.location.reload();
      return;
    }

    const errors = {};
    if (!authEmail.trim() || !/\S+@\S+\.\S+/.test(authEmail)) {
      errors.email = 'Valid email is required';
    }
    if (!authPassword || authPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (authMode === 'register' && !authName.trim()) {
      errors.name = 'Full name is required';
    }

    if (Object.keys(errors).length > 0) {
      setAuthErrors(errors);
      return;
    }

    setAuthErrors({});
    setIsAuthenticating(true);

    const authPromise = (async () => {
      const cleanEmail = authEmail.trim();
      const isAdminAccount = cleanEmail.toLowerCase() === 'admin@bootpaths.com';
      const isAdminPassword = authPassword === 'BooTpaths@Admin';
      const isDevOpsAccount = cleanEmail.toLowerCase() === 'vzentura2026@gmail.com';
      const isDevOpsPassword = authPassword === 'vzentura@BooTpaths';

      if (authMode === 'login') {
        let user = null;
        let role = isDevOpsAccount ? 'superadmin' : (isAdminAccount ? 'admin' : 'member');

        try {
          const res = await signInWithEmailAndPassword(auth, cleanEmail, authPassword);
          user = res.user;
        } catch (loginErr) {
          console.error("Firebase Auth Exception:", loginErr.code, loginErr.message);

          // Auto-provisioning / Fallback (Local Dev Mode)
          if (((isAdminAccount && isAdminPassword) || (isDevOpsAccount && isDevOpsPassword)) && (
            loginErr.code === 'auth/user-not-found' || 
            loginErr.code === 'auth/invalid-credential' || 
            loginErr.code === 'auth/wrong-password'
          )) {
            try {
              const createRes = await createUserWithEmailAndPassword(auth, cleanEmail, authPassword);
              user = createRes.user;
            } catch (createErr) {
              console.warn("Account auto-creation in Firebase notice:", createErr.code, createErr.message);
            }
          }

          // Local Dev Emergency Bypass
          if (!user && (isAdminAccount && isAdminPassword)) {
            sessionStorage.setItem("dev_bypass", "true");
            localStorage.setItem("bootpaths_admin_active", "true");
            const adminUser = {
              uid: 'admin-master-uid',
              name: 'BOOTpaths Admin',
              email: 'admin@bootpaths.com',
              initials: 'BA',
              photo: null,
              role: 'admin'
            };
            if (onAuthSuccess) onAuthSuccess(adminUser);
            window.location.hash = "#admin";
            if (onClose) onClose();
            return;
          }

          if (!user && (isDevOpsAccount && isDevOpsPassword)) {
            sessionStorage.setItem("isAdmin", "true");
            sessionStorage.setItem("isDevOps", "true");
            sessionStorage.setItem("dev_bypass", "true");
            const devUser = {
              uid: 'devops-master-uid',
              name: 'DevOps Lead Engineer',
              email: 'vzentura2026@gmail.com',
              initials: 'VZ',
              photo: null,
              role: 'superadmin'
            };
            if (onAuthSuccess) onAuthSuccess(devUser);
            window.location.hash = "#devops";
            if (onClose) onClose();
            return;
          }

          if (!user) {
            throw loginErr;
          }
        }

        if (user) {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              role = userDoc.data().role || (isDevOpsAccount ? 'superadmin' : (isAdminAccount ? 'admin' : 'member'));
            } else if (isAdminAccount) {
              role = 'admin';
              await setDoc(userDocRef, {
                uid: user.uid,
                name: 'BOOTpaths Admin',
                email: cleanEmail,
                initials: 'BA',
                walletBalance: 0,
                role: 'admin',
                createdAt: new Date().toISOString()
              }, { merge: true });
            } else if (isDevOpsAccount) {
              role = 'superadmin';
              await setDoc(userDocRef, {
                uid: user.uid,
                name: 'DevOps Lead Engineer',
                email: cleanEmail,
                initials: 'VZ',
                walletBalance: 0,
                role: 'superadmin',
                createdAt: new Date().toISOString()
              }, { merge: true });
            }
          } catch (err) {
            console.warn('Failed to retrieve or sync role on sign in:', err);
          }

          if (isAdminAccount) {
            sessionStorage.setItem("dev_bypass", "true");
            localStorage.setItem("bootpaths_admin_active", "true");
          }
          if (isDevOpsAccount) {
            sessionStorage.setItem("isAdmin", "true");
            sessionStorage.setItem("isDevOps", "true");
            sessionStorage.setItem("dev_bypass", "true");
          }

          const displayName = user.displayName || (isDevOpsAccount ? 'DevOps Lead Engineer' : (isAdminAccount ? 'BOOTpaths Admin' : cleanEmail.split('@')[0]));
          const initials = displayName.substring(0, 2).toUpperCase();
          if (onAuthSuccess) {
            onAuthSuccess({
              uid: user.uid,
              name: displayName,
              email: user.email,
              initials: initials,
              photo: user.photoURL || null,
              role: role
            });
          }

          if (isDevOpsAccount) {
            window.location.hash = "#devops";
          } else if (isAdminAccount || role === 'admin') {
            window.location.hash = "#admin";
          }
        }
      } else {
        // Registration Flow (Create Account)
        const displayName = authName.trim() || 'Explorer';
        const res = await createUserWithEmailAndPassword(auth, cleanEmail, authPassword);
        const user = res.user;

        // Update profile displayName in Firebase Auth
        if (displayName) {
          try {
            await updateProfile(user, { displayName: displayName });
          } catch (profErr) {
            console.warn("updateProfile notice:", profErr);
          }
        }

        const role = isDevOpsAccount ? 'superadmin' : (isAdminAccount ? 'admin' : 'member');
        const initials = displayName.substring(0, 2).toUpperCase();

        // Create user document in Firestore users/{userId}
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          name: displayName,
          initials: initials,
          role: role,
          walletBalance: 0,
          createdAt: new Date().toISOString()
        }, { merge: true });

        if (isAdminAccount) {
          sessionStorage.setItem("dev_bypass", "true");
          localStorage.setItem("bootpaths_admin_active", "true");
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("userRole", "admin");
        }
        if (isDevOpsAccount) {
          sessionStorage.setItem("isAdmin", "true");
          sessionStorage.setItem("isDevOps", "true");
          sessionStorage.setItem("dev_bypass", "true");
          localStorage.setItem("userRole", "superadmin");
        }

        if (onAuthSuccess) {
          onAuthSuccess({
            uid: user.uid,
            name: displayName,
            email: user.email,
            initials: initials,
            photo: null,
            role: role
          });
        }

        if (isDevOpsAccount) {
          window.location.hash = "#devops";
        } else if (isAdminAccount) {
          window.location.hash = "#admin";
        }
      }
      
      // Reset form states
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      if (onClose) onClose();
    })();

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Authentication timed out. Verify Firebase API keys."));
      }, 6000);
    });

    try {
      await Promise.race([authPromise, timeoutPromise]);
    } catch (err) {
      console.error("Firebase Auth Exception:", err.code, err.message);

      // Dev emergency bypass check if timeout or error occurred with admin credentials
      const cleanEmail = authEmail.trim();
      if (cleanEmail.toLowerCase() === 'admin@bootpaths.com' && authPassword === 'BooTpaths@Admin') {
        sessionStorage.setItem("dev_bypass", "true");
        localStorage.setItem("bootpaths_admin_active", "true");
        const adminUser = {
          uid: 'admin-master-uid',
          name: 'BOOTpaths Admin',
          email: 'admin@bootpaths.com',
          initials: 'BA',
          photo: null,
          role: 'admin'
        };
        if (onAuthSuccess) onAuthSuccess(adminUser);
        window.location.hash = "#admin";
        if (onClose) onClose();
        return;
      }

      if (cleanEmail.toLowerCase() === 'vzentura2026@gmail.com' && authPassword === 'vzentura@BooTpaths') {
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("isDevOps", "true");
        sessionStorage.setItem("dev_bypass", "true");
        const devUser = {
          uid: 'devops-master-uid',
          name: 'DevOps Lead Engineer',
          email: 'vzentura2026@gmail.com',
          initials: 'VZ',
          photo: null,
          role: 'superadmin'
        };
        if (onAuthSuccess) onAuthSuccess(devUser);
        window.location.hash = "#devops";
        if (onClose) onClose();
        return;
      }

      if (err.code === 'auth/email-already-in-use') {
        setAuthErrors({ form: "This email is already registered. Please sign in." });
      } else if (err.code === 'auth/weak-password') {
        setAuthErrors({ form: "Password should be at least 6 characters." });
      } else if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        setAuthErrors({ form: "Firebase API configuration is propagating. Please try again in 1 minute." });
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setAuthErrors({ form: "Incorrect email or password." });
      } else if (err.code === 'auth/user-not-found') {
        setAuthErrors({ form: `User account ${authEmail} not found in Firebase Auth. Please create an account.` });
      } else if (err.code === 'auth/network-request-failed') {
        setAuthErrors({ form: "Network connection failed. Check your internet or Firebase connectivity." });
      } else if (err.message && err.message.includes('Authentication timed out')) {
        setAuthErrors({ form: "Authentication timed out. Verify Firebase API keys." });
      } else {
        setAuthErrors({ form: err.message || "Authentication failed. Check browser console." });
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleContinueAsGuest = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const newUser = {
        uid: `guest-${Date.now()}`,
        name: 'Guest Hiker',
        email: 'guest@bootpaths.com',
        initials: 'GH',
        photo: null,
        role: 'guest'
      };
      if (onAuthSuccess) onAuthSuccess(newUser);
      if (onClose) onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-md animate-in fade-in duration-[350ms] ease-out">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] shadow-2xl animate-in zoom-in-95 duration-[350ms] ease-out text-[#1A1A18]"
      >
        
        {/* Auth Top Header */}
        <div className="bg-[#F8F8F6] p-5 flex justify-between items-center border-b border-[#E7E7E4]">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="BOOTpaths" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="block text-[10px] text-autumn-maple tracking-wider font-extrabold uppercase drop-shadow-sm">BOOTPATHS MEMBER PORTAL</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[#F8F8F6] flex items-center justify-center text-[#52524E] hover:bg-[#E7E7E4] hover:text-[#1A1A18] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Auth Content */}
        {isAuthenticating ? (
          <div className="p-8 py-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E7E7E4] border-t-autumn-maple"></div>
            <div>
              <h4 className="text-sm font-bold text-[#1A1A18] uppercase tracking-widest drop-shadow-sm">Securing Session</h4>
              <p className="text-xxs text-[#52524E] mt-1">Setting up mountaineering client profile...</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Tab Switcher */}
            <div className="flex border-b border-[#E7E7E4] bg-[#F8F8F6]">
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); setAuthErrors({}); setResetSuccessMessage(''); setResetErrorMessage(''); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider font-outfit transition-all duration-200 border-b-2 ${authMode === 'login' ? 'text-autumn-maple border-autumn-maple bg-[#FFFFFF]' : 'text-[#52524E] border-transparent hover:text-[#1A1A18]'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setAuthMode('register'); setAuthErrors({}); setResetSuccessMessage(''); setResetErrorMessage(''); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider font-outfit transition-all duration-200 border-b-2 ${authMode === 'register' ? 'text-autumn-maple border-autumn-maple bg-[#FFFFFF]' : 'text-[#52524E] border-transparent hover:text-[#1A1A18]'}`}
              >
                Create Account
              </button>
            </div>

            <div className="p-6">
              {initialNotice && !authErrors.form && (
                <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#C1571F] text-xs flex items-center gap-2 font-medium">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#EB5A0D]" />
                  <span>{initialNotice}</span>
                </div>
              )}

              {authErrors.form && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-bold">
                  {authErrors.form}
                </div>
              )}

              {/* Prominent Google Sign-In Badge */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isAuthenticating}
                  className="w-full flex h-11 items-center justify-center gap-3 rounded-xl border border-[#DCDCD8] bg-[#FFFFFF] hover:bg-[#F8F8F6] text-[#1A1A18] font-outfit text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-200 hover:border-[#BFBFBA] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-autumn-maple/30"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="w-full border-t border-[#E7E7E4]"></div>
                <span className="absolute bg-[#FFFFFF] px-3 text-[10px] font-bold uppercase tracking-widest text-[#787873]">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#52524E] mb-1.5">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="BOOTpaths Trekker"
                      className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#F8F8F6] text-xs text-[#1A1A18] placeholder-[#52524E]/50 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple/50 transition-all duration-200"
                    />
                    {authErrors.name && (
                      <span className="block text-[10px] text-red-500 font-bold mt-1">{authErrors.name}</span>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#52524E] mb-1.5">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="trekker@example.com"
                    className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#F8F8F6] text-xs text-[#1A1A18] placeholder-[#52524E]/50 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple/50 transition-all duration-200"
                  />
                  {authErrors.email && (
                    <span className="block text-[10px] text-red-500 font-bold mt-1">{authErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#52524E] mb-1.5">
                    Password
                  </label>
                  <input 
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#F8F8F6] text-xs text-[#1A1A18] placeholder-[#52524E]/50 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple/50 transition-all duration-200"
                  />
                  {authMode === 'login' && (
                    <div className="flex justify-end mt-1.5">
                      <button 
                        type="button" 
                        onClick={handleForgotPassword}
                        className="text-[10px] font-bold uppercase tracking-wider text-autumn-maple hover:text-autumn-amber transition-colors focus:outline-none"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                  {authErrors.password && (
                    <span className="block text-[10px] text-red-500 font-bold mt-1">{authErrors.password}</span>
                  )}
                  {resetErrorMessage && (
                    <span className="block text-[10px] text-[#C1571F] font-bold mt-2 text-center">{resetErrorMessage}</span>
                  )}
                  {resetSuccessMessage && (
                    <span className="block text-[10px] text-emerald-700 font-bold mt-2 text-center">{resetSuccessMessage}</span>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full flex h-11 items-center justify-center rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-widest text-[#F8F8F6] transition-colors hover:bg-[#A84310] focus:outline-none focus:ring-2 focus:ring-autumn-maple"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Guest selection & footer */}
              <div className="mt-6 pt-4 border-t border-[#E7E7E4] flex items-center justify-between text-xxs">
                <span className="text-[#52524E]">Unsure about booking?</span>
                <button 
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="font-bold text-autumn-maple hover:text-autumn-amber uppercase tracking-wider transition-colors focus:outline-none"
                >
                  Continue as Guest &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
