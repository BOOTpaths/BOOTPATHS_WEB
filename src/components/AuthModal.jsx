/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess
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

    try {
      if (authMode === 'login') {
        const res = await login(authEmail, authPassword);
        const user = res.user;
        
        let role = 'hiker';
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            role = userDoc.data().role || 'hiker';
          } else if (user.email?.toLowerCase() === 'admin@bootpaths.com') {
            role = 'admin';
          }
        } catch (err) {
          console.warn('Failed to retrieve role on sign in:', err);
        }

        const displayName = user.displayName || user.email.split('@')[0];
        const initials = displayName.substring(0, 2).toUpperCase();
        onAuthSuccess({
          uid: user.uid,
          name: displayName,
          email: user.email,
          initials: initials,
          photo: user.photoURL || null,
          role: role
        });
      } else {
        const res = await signup(authEmail, authPassword, authName);
        const user = res.user;
        const initials = authName.substring(0, 2).toUpperCase();
        const role = user.email?.toLowerCase() === 'admin@bootpaths.com' ? 'admin' : 'hiker';
        
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
    } catch (err) {
      if (!import.meta.env.PROD) {
        console.warn('Auth action error:', err.message);
      }
      if (err.code === 'auth/api-key-not-valid' || (err.message && err.message.includes('api-key-not-valid'))) {
        setAuthErrors({ form: 'Database connection configuration is updating. Please try again shortly.' });
      } else {
        setAuthErrors({ form: err.message });
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
              src="assets/logo-light.png" 
              alt="BOOTpaths" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="block text-[10px] text-autumn-maple tracking-wider font-extrabold uppercase drop-shadow-sm">Decathlon Partner Portal</span>
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
                      placeholder="Decathlon Hiker"
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
                    placeholder="hiker@decathlon.com"
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
