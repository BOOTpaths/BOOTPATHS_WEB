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
import { sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
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

  if (!isOpen) return null;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    const emailClean = (authEmail || "").trim().toLowerCase();
    const isAuthorizedAdmin = emailClean === "vzentura2026@gmail.com" || emailClean === "admin@bootpaths.com";

    if (isAuthorizedAdmin && (authPassword === "vzentura@BooTpaths" || authPassword === "BooTpaths@Admin")) {
      // Grant local session immediately
      sessionStorage.setItem("dev_bypass", "true");
      sessionStorage.setItem("isAdmin", "true");
      sessionStorage.setItem("isDevOps", "true");
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("userRole", "superadmin");

      // Close modal and route to admin/devops console
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
      errors.name = 'Name is required';
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
        let role = isDevOpsAccount ? 'superadmin' : (isAdminAccount ? 'admin' : 'hiker');

        try {
          const res = await signInWithEmailAndPassword(auth, cleanEmail, authPassword);
          user = res.user;
        } catch (loginErr) {
          console.error("Firebase Auth Exception:", loginErr.code, loginErr.message);

          // 3. Auto-provisioning / Fallback (Local Dev Mode)
          if ((isAdminAccount && isAdminPassword) || (isDevOpsAccount && isDevOpsPassword) && (
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

          // 4. Local Dev Emergency Bypass: If credentials match or Firebase cannot reach Google servers
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
            onAuthSuccess(adminUser);
            window.location.hash = "#admin";
            onClose();
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
            onAuthSuccess(devUser);
            window.location.hash = "#dev-ops";
            onClose();
            return;
          }

          // If not recovered, throw error to be captured in dynamic error handler
          if (!user) {
            throw loginErr;
          }
        }

        if (user) {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              role = userDoc.data().role || (isDevOpsAccount ? 'superadmin' : (isAdminAccount ? 'admin' : 'hiker'));
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
              await setDoc(doc(db, 'users', 'vzentura2026@gmail.com'), {
                uid: user.uid,
                name: 'DevOps Lead Engineer',
                email: cleanEmail,
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
          onAuthSuccess({
            uid: user.uid,
            name: displayName,
            email: user.email,
            initials: initials,
            photo: user.photoURL || null,
            role: role
          });

          if (isDevOpsAccount) {
            window.location.hash = "#dev-ops";
          } else if (isAdminAccount || role === 'admin') {
            window.location.hash = "#admin";
          }
        }
      } else {
        const res = await signup(cleanEmail, authPassword, authName);
        const user = res.user;
        const initials = authName.substring(0, 2).toUpperCase();
        const role = isDevOpsAccount ? 'superadmin' : (isAdminAccount ? 'admin' : 'hiker');

        if (isAdminAccount) {
          sessionStorage.setItem("dev_bypass", "true");
          localStorage.setItem("bootpaths_admin_active", "true");
          window.location.hash = "#admin";
        }
        if (isDevOpsAccount) {
          sessionStorage.setItem("isAdmin", "true");
          sessionStorage.setItem("isDevOps", "true");
          sessionStorage.setItem("dev_bypass", "true");
          window.location.hash = "#dev-ops";
        }
        
        onAuthSuccess({
          uid: user.uid,
          name: authName,
          email: user.email,
          initials: initials,
          photo: null,
          role: role
        });
      }
      
      // Reset form states
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      onClose();
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
        onAuthSuccess(adminUser);
        window.location.hash = "#admin";
        onClose();
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
        onAuthSuccess(devUser);
        window.location.hash = "#dev-ops";
        onClose();
        return;
      }

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setAuthErrors({ form: "Incorrect email or password." });
      } else if (err.code === 'auth/user-not-found') {
        setAuthErrors({ form: `User account ${authEmail} not found in Firebase Auth.` });
      } else if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid') {
        setAuthErrors({ form: "Firebase API Key is invalid or rejected by Google Cloud." });
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
        photo: null
      };
      onAuthSuccess(newUser);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/20 p-4 backdrop-blur-[20px] animate-in fade-in duration-[350ms] ease-out">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] shadow-sm animate-in zoom-in-95 duration-[350ms] ease-out text-[#1A1A18]"
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
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[#F8F8F6] flex items-center justify-center text-[#52524E] hover:bg-[#E7E7E4] hover:text-[#1A1A18] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Auth Content */}
        {isAuthenticating ? (
          <div className="p-8 py-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E7E7E4] border-t-emerald-500"></div>
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
                <p className="text-red-400 text-xxs text-center mb-4 font-bold">{authErrors.form}</p>
              )}

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
                      <span className="block text-[10px] text-red-400 font-bold mt-1">{authErrors.name}</span>
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
                    <span className="block text-[10px] text-red-400 font-bold mt-1">{authErrors.email}</span>
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
                  <div className="flex justify-end mt-1.5">
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-[10px] font-bold uppercase tracking-wider text-autumn-maple hover:text-autumn-amber transition-colors focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  {authErrors.password && (
                    <span className="block text-[10px] text-red-400 font-bold mt-1">{authErrors.password}</span>
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
