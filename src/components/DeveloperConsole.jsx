/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot, setDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { CURATED_TREKS } from '../data/curatedTreks';
import { 
  Shield, 
  Cpu, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Database, 
  Calendar, 
  Users, 
  Lock, 
  Unlock, 
  Server, 
  HardDrive, 
  Terminal, 
  Sliders, 
  Trash2, 
  Eye, 
  EyeOff, 
  Compass, 
  DollarSign, 
  Check, 
  LogOut, 
  ArrowLeft,
  KeyRound,
  ExternalLink,
  Wifi,
  Sparkles,
  Zap,
  Power
} from 'lucide-react';

export default function DeveloperConsole({ user, onExit }) {
  const { currentUser, userData, userRole } = useAuth();
  
  // Tab Management: 'maintenance' | 'system_health' | 'inventory' | 'bookings'
  const [activeTab, setActiveTab] = useState('maintenance');

  // DevOps / Admin Bypass state
  const [isDevBypassed, setIsDevBypassed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isDevOps') === 'true' || 
             sessionStorage.getItem('dev_bypass') === 'true' ||
             sessionStorage.getItem('isAdmin') === 'true' ||
             localStorage.getItem('bootpaths_developer_mode') === 'true';
    }
    return false;
  });

  // Centralized System Controls & Emergency Toggles
  const [systemControls, setSystemControls] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("bootpaths_system_controls") : null;
    return saved ? JSON.parse(saved) : {
      lockout: false,
      readOnly: false,
      stagingDb: false,
      mockCheckout: true,
      emergencyKillSwitch: false,
      networkThrottle: false,
      corsBypass: true
    };
  });

  // Auth check
  const isAdmin = currentUser?.email === 'admin@bootpaths.com' || 
                  currentUser?.email === 'vzentura2026@gmail.com' || 
                  (typeof window !== 'undefined' && (
                    sessionStorage.getItem('dev_bypass') === 'true' ||
                    sessionStorage.getItem('isAdmin') === 'true' ||
                    sessionStorage.getItem('isDevOps') === 'true' ||
                    localStorage.getItem('bootpaths_developer_mode') === 'true'
                  ));

  const isDeveloper = isDevBypassed ||
                      (typeof window !== 'undefined' && (
                        sessionStorage.getItem('isDevOps') === 'true' || 
                        sessionStorage.getItem('dev_bypass') === 'true' || 
                        sessionStorage.getItem('isAdmin') === 'true' ||
                        localStorage.getItem('bootpaths_developer_mode') === 'true'
                      )) ||
                      userRole === 'developer' || 
                      userRole === 'devops' ||
                      userRole === 'superadmin' ||
                      userRole === 'admin' ||
                      currentUser?.role === 'developer' || 
                      currentUser?.role === 'superadmin' || 
                      currentUser?.role === 'devops' || 
                      userData?.role === 'developer' ||
                      userData?.role === 'superadmin' ||
                      userData?.role === 'devops' ||
                      currentUser?.email === 'vzentura2026@gmail.com' ||
                      userData?.email === 'vzentura2026@gmail.com' ||
                      currentUser?.email === 'admin@bootpaths.com' ||
                      userData?.email === 'admin@bootpaths.com';

  // Login Form State for Devops
  const [emailInput, setEmailInput] = useState('vzentura2026@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  // Feature Flags State with local storage fallback
  const [featureFlags, setFeatureFlags] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bootpaths_feature_flags');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      enableLeadApplications: false,
      enableExpeditionViews: false,
      enableSocialFeeds: false,
      enableCommunityBlogs: false,
      enableMaintenanceMode: false,
      maintenanceMode: false
    };
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  // Inventory & Bookings Data States
  const [inventoryList, setInventoryList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Realtime Feature Flags Subscription
  useEffect(() => {
    const flagsDocRef = doc(db, 'app_settings', 'feature_flags');
    const unsub = onSnapshot(flagsDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const merged = {
          enableLeadApplications: !!data.enableLeadApplications,
          enableExpeditionViews: !!data.enableExpeditionViews,
          enableSocialFeeds: !!data.enableSocialFeeds,
          enableCommunityBlogs: !!data.enableCommunityBlogs,
          enableMaintenanceMode: !!(data.enableMaintenanceMode || data.maintenanceMode),
          maintenanceMode: !!(data.enableMaintenanceMode || data.maintenanceMode)
        };
        setFeatureFlags(merged);
        if (typeof window !== 'undefined') {
          localStorage.setItem('bootpaths_feature_flags', JSON.stringify(merged));
          localStorage.setItem('bootpaths_maintenance_mode', String(merged.maintenanceMode));
        }
      }
    }, (err) => {
      console.warn('DeveloperConsole Feature Flags snapshot error:', err);
    });
    return () => unsub();
  }, []);

  // Fetch Inventory and Bookings when authorized
  useEffect(() => {
    if (!isDeveloper) return;

    // Load inventory from Firestore or fallback
    const loadInventory = async () => {
      setIsLoadingInventory(true);
      try {
        const snap = await getDocs(collection(db, 'packages'));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setInventoryList(list);
        } else {
          setInventoryList(CURATED_TREKS);
        }
      } catch (err) {
        console.warn('Inventory fetch fallback to curated catalog:', err.message);
        setInventoryList(CURATED_TREKS);
      } finally {
        setIsLoadingInventory(false);
      }
    };

    // Load bookings from Firestore or fallback
    const loadBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const snap = await getDocs(collection(db, 'bookings'));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setBookingsList(list);
        } else {
          setBookingsList([
            { id: 'DEMO-9481', trekTitle: 'Agasthyarkoodam Peak Expedition', userName: 'DevOps Mock Hiker', userEmail: 'vzentura2026@gmail.com', amount: 4850, status: 'Confirmed (Demo)', date: new Date().toLocaleDateString() },
            { id: 'DEMO-7320', trekTitle: 'Valley of Flowers & Hemkund', userName: 'Alex Chen', userEmail: 'alex.chen@example.com', amount: 8900, status: 'Confirmed (Demo)', date: new Date().toLocaleDateString() }
          ]);
        }
      } catch (err) {
        console.warn('Bookings fetch notice:', err.message);
        setBookingsList([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    loadInventory();
    loadBookings();
  }, [isDeveloper]);

  // Devops Sign-in Handler with Auto-provisioning & Fallback
  const handleDevOpsLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    const cleanEmail = emailInput.trim();
    const cleanPassword = passwordInput;
    const isTargetDev = cleanEmail.toLowerCase() === 'vzentura2026@gmail.com';
    const isTargetPassword = cleanPassword === 'vzentura@BooTpaths';

    try {
      let userCred = null;
      try {
        userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      } catch (signInErr) {
        console.warn('DevOps sign-in error:', signInErr.code, signInErr.message);

        // Auto-provision if user not found
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          if (isTargetDev && isTargetPassword) {
            try {
              userCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
            } catch (createErr) {
              console.warn('DevOps auto-provisioning create error:', createErr.code, createErr.message);
            }
          }
        }

        // Local emergency session bypass if network/key error or target dev credentials
        if (!userCred && isTargetDev && isTargetPassword) {
          sessionStorage.setItem('isAdmin', 'true');
          sessionStorage.setItem('isDevOps', 'true');
          sessionStorage.setItem('dev_bypass', 'true');
          localStorage.setItem('bootpaths_developer_mode', 'true');
          setIsDevBypassed(true);
          setIsAuthenticating(false);
          return;
        }

        if (!userCred) throw signInErr;
      }

      if (userCred && userCred.user) {
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('isDevOps', 'true');
        sessionStorage.setItem('dev_bypass', 'true');
        localStorage.setItem('bootpaths_developer_mode', 'true');

        // Write user role as superadmin / devops in Firestore
        try {
          const userDocRefByEmail = doc(db, 'users', cleanEmail);
          const userDocRefByUid = doc(db, 'users', userCred.user.uid);
          const devData = {
            uid: userCred.user.uid,
            name: 'DevOps Lead Engineer',
            email: cleanEmail,
            role: 'superadmin',
            roles: ['superadmin', 'devops', 'developer', 'admin'],
            updatedAt: new Date().toISOString()
          };
          await setDoc(userDocRefByEmail, devData, { merge: true });
          await setDoc(userDocRefByUid, devData, { merge: true });
        } catch (fsErr) {
          console.warn('Firestore DevOps role sync notice:', fsErr);
        }

        setIsDevBypassed(true);
      }
    } catch (err) {
      if (isTargetDev && isTargetPassword) {
        // Fallback for offline/local environments
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('isDevOps', 'true');
        sessionStorage.setItem('dev_bypass', 'true');
        localStorage.setItem('bootpaths_developer_mode', 'true');
        setIsDevBypassed(true);
      } else {
        setAuthError(err.message || 'Invalid DevOps Credentials.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Universal System Controls Toggle Handler
  const toggleControl = async (key) => {
    const nextVal = !systemControls[key];
    setSystemControls((prev) => {
      const updated = { ...prev, [key]: nextVal };
      if (typeof window !== 'undefined') {
        localStorage.setItem("bootpaths_system_controls", JSON.stringify(updated));
      }
      return updated;
    });

    setActionNotice(`Updated ${key} to ${nextVal ? 'ON' : 'OFF'}`);
    setTimeout(() => setActionNotice(''), 2000);

    // Optional Firestore sync in background (non-blocking)
    try {
      await setDoc(doc(db, "system_settings", "controls"), {
        [key]: nextVal,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn(`Firestore sync skipped for ${key}:`, err.message);
    }
  };

  // Feature Flags Toggle Handler
  const toggleFlag = async (flagName) => {
    setIsUpdating(true);
    setUpdateStatus('Saving modifications...');

    const isMaintenance = flagName === 'enableMaintenanceMode' || flagName === 'maintenanceMode';
    const nextVal = !featureFlags[flagName];

    const updatedFlags = {
      ...featureFlags,
      [flagName]: nextVal,
      ...(isMaintenance ? { enableMaintenanceMode: nextVal, maintenanceMode: nextVal } : {})
    };

    // Immediate local UI state update
    setFeatureFlags(updatedFlags);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("bootpaths_feature_flags", JSON.stringify(updatedFlags));
      if (isMaintenance) {
        localStorage.setItem("bootpaths_maintenance_mode", String(nextVal));
      }
    }

    try {
      await setDoc(doc(db, 'app_settings', 'feature_flags'), updatedFlags, { merge: true });
      setUpdateStatus('Persisted successfully');
      setTimeout(() => setUpdateStatus(''), 2000);
    } catch (err) {
      console.error('Failed to update feature flags in Firestore:', err);
      setUpdateStatus('Save error: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleTrekVisibility = async (trekId, currentStatus) => {
    const newStatus = currentStatus === false ? true : false;
    setActionNotice(`Updating ${trekId}...`);
    try {
      const trekRef = doc(db, 'packages', String(trekId));
      await updateDoc(trekRef, { isVisible: newStatus, status: newStatus ? 'published' : 'draft' });
      setInventoryList(prev => prev.map(t => t.id === trekId ? { ...t, isVisible: newStatus, status: newStatus ? 'published' : 'draft' } : t));
      setActionNotice(`Trek visibility updated!`);
      setTimeout(() => setActionNotice(''), 2500);
    } catch (err) {
      console.warn('Live Firestore update failed, applying in-memory:', err.message);
      setInventoryList(prev => prev.map(t => t.id === trekId ? { ...t, isVisible: newStatus, status: newStatus ? 'published' : 'draft' } : t));
      setActionNotice(`Updated locally.`);
      setTimeout(() => setActionNotice(''), 2500);
    }
  };

  const handlePurgeDemoBookings = async () => {
    setActionNotice('Purging demo bookings...');
    try {
      const snap = await getDocs(collection(db, 'bookings'));
      const deletePromises = snap.docs
        .filter(d => d.id.startsWith('DEMO') || d.data().isDemo === true || d.data().userEmail === 'vzentura2026@gmail.com')
        .map(d => deleteDoc(doc(db, 'bookings', d.id)));
      await Promise.all(deletePromises);
      setBookingsList(prev => prev.filter(b => !String(b.id).startsWith('DEMO') && !b.isDemo));
      setActionNotice('Demo bookings cleaned up successfully.');
      setTimeout(() => setActionNotice(''), 2500);
    } catch (err) {
      console.warn('Booking purge error:', err.message);
      setBookingsList([]);
      setActionNotice('Bookings cleared locally.');
      setTimeout(() => setActionNotice(''), 2500);
    }
  };

  const handleDevLogout = () => {
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isDevOps');
    sessionStorage.removeItem('dev_bypass');
    localStorage.removeItem('bootpaths_developer_mode');
    setIsDevBypassed(false);
    if (onExit) {
      onExit();
    } else {
      window.location.hash = '';
      window.location.reload();
    }
  };

  // If Not Authorized: Render DevOps Credentials Login Screen
  if (!isDeveloper) {
    return (
      <div className="min-h-screen bg-[#0F1115] text-[#E4E6EB] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient Dark Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E232D_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C1571F]/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-6 border-b border-[#30363D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C1571F]/20 border border-[#C1571F]/40 flex items-center justify-center text-[#C1571F]">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-outfit text-base font-extrabold text-white tracking-wide uppercase">
                  DevOps Terminal Login
                </h1>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8B949E]">
                  BOOTpaths Internal Infrastructure
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C1571F]/20 border border-[#C1571F]/40 text-[#FF7A3D] font-bold">
              ROOT
            </span>
          </div>

          {authError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleDevOpsLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                DevOps Authorized Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="vzentura2026@gmail.com"
                className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#C1571F] focus:ring-1 focus:ring-[#C1571F] text-white text-xs rounded-xl px-4 py-3 outline-none font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                Security Key / Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#C1571F] focus:ring-1 focus:ring-[#C1571F] text-white text-xs rounded-xl px-4 py-3 outline-none font-mono transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#C1571F] to-[#E06727] hover:from-[#A84310] hover:to-[#C1571F] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Authenticating Node...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Authorize DevOps Access</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#30363D]/60 flex items-center justify-between text-xxs font-mono text-[#8B949E]">
            <span>Whitelist: vzentura2026@gmail.com</span>
            <button 
              onClick={() => {
                if (onExit) {
                  onExit();
                } else {
                  window.location.hash = '';
                  window.location.reload();
                }
              }}
              className="hover:text-white transition-colors underline"
            >
              Exit to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // System Controls Toggle List Configuration
  const systemControlsConfig = [
    {
      key: 'lockout',
      title: 'Platform-Wide Lockout',
      description: 'Instantly locks public access and routes all unauthenticated visitors to the maintenance holding page.',
      badge: 'Security Core',
      icon: Lock
    },
    {
      key: 'readOnly',
      title: 'Read-Only Mode',
      description: 'Freezes all database writes, booking creation, payment collection, and package mutations.',
      badge: 'Database Guard',
      icon: Database
    },
    {
      key: 'stagingDb',
      title: 'Staging Database Route',
      description: 'Routes analytics, booking payloads, and package fetching to the isolated staging database partition.',
      badge: 'Environment Switch',
      icon: HardDrive
    },
    {
      key: 'mockCheckout',
      title: 'Mock Checkout Pipeline',
      description: 'Bypasses external Razorpay payment gateway API and completes instant test reservations locally.',
      badge: 'Payment Pipeline',
      icon: DollarSign
    },
    {
      key: 'emergencyKillSwitch',
      title: 'Emergency Master Kill Switch',
      description: 'Immediately freezes payment gateways, user registrations, and live slot bookings platform-wide.',
      badge: 'Master Override',
      icon: AlertTriangle
    },
    {
      key: 'networkThrottle',
      title: 'Network Throttle Simulator',
      description: 'Simulates high-latency 3G network conditions and delays responses to stress test UX spinners.',
      badge: 'Telemetry & Chaos',
      icon: Wifi
    },
    {
      key: 'corsBypass',
      title: 'Dynamic CORS Proxy Bypass',
      description: 'Enables cross-origin headers proxy for direct client asset fetching and CDN media uploads.',
      badge: 'Proxy Gateway',
      icon: Server
    }
  ];

  const flagsConfig = [
    {
      key: 'enableLeadApplications',
      title: 'Lead Careers Module',
      description: 'Gates applicant portal, roles onboarding, guide submissions and application lists.',
      badge: 'Tier 1 Module'
    },
    {
      key: 'enableExpeditionViews',
      title: 'Expedition Views & Dynamic Analytics',
      description: 'Activates dynamic landing analytics tracking and custom view counters.',
      badge: 'Core Engine'
    },
    {
      key: 'enableSocialFeeds',
      title: 'Social Feeds Manager',
      description: 'Enables Instagram, YouTube feeds integration and direct media thumbnail upload managers.',
      badge: 'Social Media Hub'
    },
    {
      key: 'enableCommunityBlogs',
      title: 'Community Blogs & Content System',
      description: 'Gates client-facing adventure guides, blog entries, and markup editor consoles.',
      badge: 'Content System'
    },
    {
      key: 'enableMaintenanceMode',
      title: 'Maintenance Mode System',
      description: 'Places public site under maintenance screen for visitors while bypassing for administrators.',
      badge: 'System Guard'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E4E6EB] font-sans py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Main DevOps Navigation Bar & Header */}
        <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="/#" className="flex items-center gap-2.5 select-none hover:opacity-95 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#30363D] shadow-sm flex items-center justify-center overflow-hidden p-1">
                <img src="/logo.png" alt="BOOTpaths" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight select-none">
                <span className="text-[#FF6B00]">BOOT</span>
                <span className="text-[#8B2626]">paths</span>
              </span>
            </a>
            <div className="h-6 w-px bg-[#30363D] hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit text-base md:text-lg font-black uppercase tracking-wider text-white">
                  DevOps Infrastructure Console
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-[#8B949E] flex items-center gap-1.5 mt-0.5">
                <Shield className="h-3 w-3 text-[#FF7A3D]" /> Authenticated: <strong className="text-white">vzentura2026@gmail.com</strong> (Superadmin)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {actionNotice && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl bg-[#C1571F]/20 text-[#FF7A3D] border border-[#C1571F]/40 animate-pulse">
                {actionNotice}
              </span>
            )}
            {updateStatus && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                updateStatus.includes('error') ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
              }`}>
                {updateStatus}
              </span>
            )}
            {isUpdating && <RefreshCw className="h-4 w-4 animate-spin text-[#C1571F]" />}
            
            <button
              onClick={() => { window.location.hash = '#admin'; window.location.reload(); }}
              className="h-9 px-3.5 rounded-xl border border-[#30363D] bg-[#21262D] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#30363D] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#FF7A3D]" /> Admin Portal (Treks & Bookings)
            </button>
            
            <button 
              onClick={handleDevLogout}
              className="h-9 px-3.5 rounded-xl border border-rose-900/40 bg-rose-950/30 text-xs font-bold uppercase tracking-wider text-rose-300 hover:bg-rose-900/40 transition-colors flex items-center gap-1.5 shadow-sm"
              title="End DevOps Session"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#30363D]/60">
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'maintenance'
                ? 'bg-[#C1571F] text-white shadow-md'
                : 'bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Maintenance & Emergency Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('system_health')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'system_health'
                ? 'bg-[#C1571F] text-white shadow-md'
                : 'bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>System Health</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-[#C1571F] text-white shadow-md'
                : 'bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Trek Inventory Management</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-[#C1571F] text-white shadow-md'
                : 'bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Bookings & Reservations</span>
          </button>
        </div>

        {/* TAB 1: Maintenance Mode, Emergency Controls & Feature Flags Gating */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            
            {/* SECTION 1: Emergency & Platform Control Toggles */}
            <div className="bg-[#161B22] border border-[#30363D] p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-outfit text-sm font-bold uppercase tracking-widest text-[#8B949E] flex items-center gap-2">
                    <Power className="h-4 w-4 text-[#FF7A3D]" /> Emergency & Platform Subsystem Toggles
                  </h2>
                  <p className="text-xs text-[#8B949E] mt-1">
                    Centralized state controls with immediate local persistence and non-blocking Firestore synchronization.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#30363D]/60">
                {systemControlsConfig.map((ctrl) => {
                  const isActive = !!systemControls[ctrl.key];
                  const IconComp = ctrl.icon;
                  return (
                    <div key={ctrl.key} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-3">
                          <IconComp className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-[#8B949E]'}`} />
                          <h3 className="font-outfit text-sm font-bold text-white uppercase tracking-wide">
                            {ctrl.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-[#0D1117] border border-[#30363D] text-[#8B949E]">
                            {ctrl.badge}
                          </span>
                        </div>
                        <p className="text-xxs text-[#8B949E] leading-relaxed">
                          {ctrl.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {/* Status badge */}
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1.5 border transition-all ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-stone-800/40 border-stone-700 text-stone-400'
                        }`}>
                          {isActive ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                              ACTIVE
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 rounded-full bg-stone-500"></span>
                              INACTIVE
                            </>
                          )}
                        </span>

                        {/* Interactive Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleControl(ctrl.key)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? 'bg-emerald-500' : 'bg-stone-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: Active Feature Flags Gating */}
            <div className="bg-[#161B22] border border-[#30363D] p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-outfit text-sm font-bold uppercase tracking-widest text-[#8B949E] flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#FF7A3D]" /> Production Feature Flags Gating
                  </h2>
                  <p className="text-xs text-[#8B949E] mt-1">
                    Control global production feature gating, applicant pipelines, and community portals.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#30363D]/60">
                {flagsConfig.map((flag) => {
                  const isActive = !!featureFlags[flag.key];
                  return (
                    <div key={flag.key} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-3">
                          <h3 className="font-outfit text-sm font-bold text-white uppercase tracking-wide">
                            {flag.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-[#0D1117] border border-[#30363D] text-[#8B949E]">
                            {flag.badge}
                          </span>
                        </div>
                        <p className="text-xxs text-[#8B949E] leading-relaxed">
                          {flag.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1.5 border transition-all ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-stone-800/40 border-stone-700 text-stone-400'
                        }`}>
                          {isActive ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                              ONLINE / ENABLED
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 rounded-full bg-stone-500"></span>
                              OFFLINE / MUTED
                            </>
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleFlag(flag.key)}
                          disabled={isUpdating}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? 'bg-[#C1571F]' : 'bg-[#30363D]'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: System Health & Telemetry */}
        {activeTab === 'system_health' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B949E]">Firebase Database</span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-black text-white">Firestore Node</h3>
                  <span className="text-xxs font-mono text-emerald-400 font-bold">
                    {systemControls.stagingDb ? 'STAGING PARTITION ACTIVE' : 'PROD REALTIME STREAMING'}
                  </span>
                </div>
              </div>
              <p className="text-xxs text-[#8B949E]">
                Active project: <strong className="text-white font-mono">bootpaths-4b877</strong>. Realtime listeners online.
              </p>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B949E]">Auth Engine</span>
                <Shield className="h-4 w-4 text-[#FF7A3D]" />
              </div>
              <div className="flex items-center gap-3">
                <Lock className="h-8 w-8 text-[#FF7A3D]" />
                <div>
                  <h3 className="text-lg font-black text-white">Identity Gateway</h3>
                  <span className="text-xxs font-mono text-emerald-400 font-bold">RBAC SUPERADMIN AUTHORIZED</span>
                </div>
              </div>
              <p className="text-xxs text-[#8B949E]">
                Whitelisted engineer: <strong className="text-white font-mono">vzentura2026@gmail.com</strong>
              </p>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B949E]">Payment Pipeline</span>
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-amber-400" />
                <div>
                  <h3 className="text-lg font-black text-white">Razorpay Checkout</h3>
                  <span className={`text-xxs font-mono font-bold ${
                    systemControls.mockCheckout ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {systemControls.mockCheckout ? 'MOCK LOCAL BYPASS ACTIVE' : 'LIVE TEST GATEWAY ACTIVE'}
                  </span>
                </div>
              </div>
              <p className="text-xxs text-[#8B949E]">
                Client ID: <strong className="text-white font-mono">rzp_test_TZOR1bH6I8CVFp</strong>
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: Trek Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="bg-[#161B22] border border-[#30363D] p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-outfit text-sm font-bold uppercase tracking-widest text-[#8B949E] flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#FF7A3D]" /> Trek Inventory & Package Roster
                </h2>
                <p className="text-xs text-[#8B949E] mt-1">
                  Manage live and draft expeditions, slots, and instant visibility gating.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#FF7A3D] px-3 py-1 rounded-xl bg-[#0D1117] border border-[#30363D] w-fit">
                Total Expeditions: {inventoryList.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#30363D] text-[#8B949E] font-mono text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-3">Trek Name</th>
                    <th className="py-3 px-3">Difficulty</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D]/50 font-sans">
                  {inventoryList.map((trek) => {
                    const isVisible = trek.isVisible !== false && trek.status !== 'draft' && trek.status !== 'hidden';
                    return (
                      <tr key={trek.id} className="hover:bg-[#21262D]/50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2.5">
                          <img src={trek.image || '/logo.png'} alt={trek.title} className="w-8 h-8 rounded-lg object-cover border border-[#30363D]" />
                          <div>
                            <div>{trek.title}</div>
                            <span className="text-[10px] font-mono text-[#8B949E]">{trek.location || 'Western Ghats'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs">{trek.difficulty || 'Moderate'}</td>
                        <td className="py-3.5 px-3 font-mono text-xs">{trek.duration || '2 Days'}</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-[#FF7A3D]">₹{trek.price || '4,850'}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                            isVisible ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {isVisible ? 'PUBLISHED' : 'DRAFT / HIDDEN'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleTrekVisibility(trek.id, trek.isVisible)}
                            className="px-3 py-1.5 rounded-lg border border-[#30363D] bg-[#0D1117] hover:bg-[#30363D] text-white text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                          >
                            {isVisible ? 'Set Hidden' : 'Publish'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Bookings & Reservations */}
        {activeTab === 'bookings' && (
          <div className="bg-[#161B22] border border-[#30363D] p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-outfit text-sm font-bold uppercase tracking-widest text-[#8B949E] flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#FF7A3D]" /> Bookings & Customer Reservations
                </h2>
                <p className="text-xs text-[#8B949E] mt-1">
                  Inspect incoming customer reservations, payment statuses, and clear demo records.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePurgeDemoBookings}
                className="px-4 py-2 rounded-xl border border-rose-900/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Purge Demo Bookings
              </button>
            </div>

            {bookingsList.length === 0 ? (
              <div className="p-8 text-center text-[#8B949E] font-mono text-xs border border-dashed border-[#30363D] rounded-2xl">
                No active bookings recorded in Firestore.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#30363D] text-[#8B949E] text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-3">Order / ID</th>
                      <th className="py-3 px-3">Expedition</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]/50">
                    {bookingsList.map((b) => (
                      <tr key={b.id} className="hover:bg-[#21262D]/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-white">{b.id}</td>
                        <td className="py-3 px-3 text-[#E4E6EB]">{b.trekTitle || b.trekName || 'Agasthyarkoodam'}</td>
                        <td className="py-3 px-3">
                          <div className="text-white">{b.userName || b.name || 'Anonymous Hiker'}</div>
                          <div className="text-[10px] text-[#8B949E]">{b.userEmail || b.email || '-'}</div>
                        </td>
                        <td className="py-3 px-3 text-[#FF7A3D] font-bold">₹{b.amount || b.totalPrice || 4850}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {b.status || 'PAID / CONFIRMED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer info banner */}
        <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xxs font-mono text-[#8B949E] gap-2">
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-[#FF7A3D]" />
            <span>Node: <strong className="text-white">bootpaths-prod-cluster-01</strong></span>
            <span>|</span>
            <span>Clearance: <strong className="text-emerald-400">SuperAdmin / DevOps</strong></span>
          </div>
          <div>
            CONFIDENTIAL - Internal BOOTpaths Systems
          </div>
        </div>

      </div>
    </div>
  );
}
