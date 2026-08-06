import { useState } from 'react';
import { X } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authErrors, setAuthErrors] = useState({});
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  // Real Google Sign-In Flow with Firestore Sync
  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthErrors({});
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const displayName = user.displayName || user.email.split('@')[0];
      const initials = displayName
        ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'GE';

      // Create or update user profile document in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || null,
          role: 'user',
          uid: user.uid,
          name: displayName,
          initials: initials,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore user profile sync error:', dbErr.message);
      }

      const newUser = {
        uid: user.uid,
        name: displayName,
        email: user.email,
        initials: initials,
        photo: user.photoURL || null
      };

      onAuthSuccess(newUser);
      onClose();
    } catch (err) {
      console.warn('Google sign-in popup error/closed:', err.message);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthErrors({ oauth: err.message });
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

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

    // Simulate Email registration / login fallback
    setTimeout(() => {
      setIsAuthenticating(false);
      const displayName = authMode === 'register' ? authName : authEmail.split('@')[0];
      const initials = displayName.substring(0, 2).toUpperCase();
      const newUser = {
        uid: `mail-user-${Date.now()}`,
        name: displayName,
        email: authEmail,
        initials: initials,
        photo: null
      };

      onAuthSuccess(newUser);
      onClose();
      
      // Reset form states
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    }, 1200);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-955/40 p-4 backdrop-blur-[20px] animate-in fade-in duration-[350ms] ease-out">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-autumn-maple/20 shadow-[inset_0_1px_2px_rgba(52,211,153,0.15),0_15px_35px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-[350ms] ease-out"
        style={{ background: 'rgba(18, 30, 26, 0.45)' }}
      >
        
        {/* Auth Top Header */}
        <div className="bg-autumn-mist/30 p-5 flex justify-between items-center border-b border-autumn-bark/10">
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
            className="h-8 w-8 rounded-full bg-[#EFE8D6]/40 flex items-center justify-center text-autumn-bark/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Auth Content */}
        {isAuthenticating ? (
          <div className="p-8 py-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-autumn-bark/10 border-t-emerald-500"></div>
            <div>
              <h4 className="text-sm font-bold text-autumn-bark/80 uppercase tracking-widest drop-shadow-sm">Securing Session</h4>
              <p className="text-xxs text-autumn-bark/50 mt-1">Setting up mountaineering client profile...</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Tab Switcher */}
            <div className="flex border-b border-autumn-bark/10 bg-autumn-mist/20">
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); setAuthErrors({}); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider font-outfit transition-all duration-200 border-b-2 ${authMode === 'login' ? 'text-autumn-maple border-autumn-maple bg-[#EFE8D6]/10' : 'text-autumn-bark/50 border-transparent hover:text-autumn-bark/80'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setAuthMode('register'); setAuthErrors({}); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider font-outfit transition-all duration-200 border-b-2 ${authMode === 'register' ? 'text-autumn-maple border-autumn-maple bg-[#EFE8D6]/10' : 'text-autumn-bark/50 border-transparent hover:text-autumn-bark/80'}`}
              >
                Create Account
              </button>
            </div>

            <div className="p-6">
              {/* Center Google OAuth Button */}
              <div className="flex justify-center mb-5">
                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex h-10 w-full max-w-xs items-center justify-center gap-2 rounded bg-autumn-mist/60 border border-autumn-bark/10 text-xs font-bold font-outfit text-autumn-bark/80 hover:bg-[#EFE8D6]/80 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-autumn-maple shadow-md"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>

              {authErrors.oauth && (
                <p className="text-red-400 text-xxs text-center mb-4">{authErrors.oauth}</p>
              )}

              {/* Separator */}
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-autumn-bark/10"></div>
                </div>
                <span className="relative bg-[#EFE8D6]/30 px-3 text-[10px] uppercase font-bold tracking-widest text-autumn-bark/50">
                  or continue with email
                </span>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-autumn-bark/70 mb-1.5">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Decathlon Hiker"
                      className="w-full h-10 px-3 rounded border border-autumn-bark/10 bg-autumn-mist/30 text-xs text-autumn-bark placeholder-autumn-bark/30 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple/50 transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
                    />
                    {authErrors.name && (
                      <span className="block text-[10px] text-red-400 font-bold mt-1">{authErrors.name}</span>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-autumn-bark/70 mb-1.5">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="hiker@decathlon.com"
                    className="w-full h-10 px-3 rounded border border-autumn-bark/10 bg-autumn-mist/30 text-xs text-autumn-bark placeholder-autumn-bark/30 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple/50 transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
                  />
                  {authErrors.email && (
                    <span className="block text-[10px] text-red-400 font-bold mt-1">{authErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-autumn-bark/70 mb-1.5">
                    Password
                  </label>
                  <input 
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 rounded border border-autumn-bark/10 bg-autumn-mist/30 text-xs text-autumn-bark placeholder-autumn-bark/30 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple/50 transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
                  />
                  <div className="flex justify-end mt-1.5">
                    <button 
                      type="button" 
                      onClick={() => alert("Password reset link sent (simulated).")}
                      className="text-[10px] font-bold uppercase tracking-wider text-autumn-maple hover:text-autumn-amber transition-colors focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  {authErrors.password && (
                    <span className="block text-[10px] text-red-400 font-bold mt-1">{authErrors.password}</span>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full flex h-11 items-center justify-center rounded bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-widest text-[#F3ECDD] transition-colors hover:bg-[#a44717] focus:outline-none focus:ring-2 focus:ring-autumn-maple shadow-[0_4px_12px_rgba(193,87,31,0.35)]"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Guest selection & footer */}
              <div className="mt-6 pt-4 border-t border-autumn-bark/10 flex items-center justify-between text-xxs">
                <span className="text-autumn-bark/50">Unsure about booking?</span>
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
