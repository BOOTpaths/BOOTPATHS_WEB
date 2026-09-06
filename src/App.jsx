/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState, useEffect } from 'react';
import AdminConsole from './components/AdminConsole';
import DeveloperConsole from './components/DeveloperConsole';
import BlogSection from './components/BlogSection';
import BlogDetailPage from './components/BlogDetailPage';
import SilentValleyPage from './components/SilentValleyPage';
import LeadCareers from './components/LeadCareers';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import UserDashboard from './components/UserDashboard';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { db, auth, googleProvider } from './config/firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, query, orderBy } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { 
  Shield, 
  Leaf, 
  Award, 
  Check, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Clock, 
  Plus, 
  Minus, 
  X, 
  Menu, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Info,
  ExternalLink,
  Flame,
  AlertTriangle,
  User,
  LogOut,
  Wallet,
  Compass,
  Users
} from 'lucide-react';

const Youtube = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const Facebook = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Instagram = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const HERO_MEDIA = [
  {
    type: 'video',
    src: 'landing2.mp4',
    title: 'Wilderness',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80'
  },
  {
    type: 'video',
    src: 'netravathi.mp4',
    title: 'Netravathi',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80'
  },
  {
    type: 'video',
    src: 'brahmagiri.mp4',
    title: 'Brahmagiri',
    thumbnail: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=150&q=80'
  },
  {
    type: 'video',
    src: 'vellagavi.mp4',
    title: 'Vellagavi',
    thumbnail: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=150&q=80'
  }
];

const EXPEDITION_RECORDS = [];

const DEFAULT_INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    title: 'Malayali Trekking Guide',
    url: 'https://instagram.com/bootpaths',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80',
    likes: '1.2k',
    comments: '42'
  },
  {
    id: 'ig-2',
    title: 'Lock Your Heel In - Boot Guide',
    url: 'https://instagram.com/bootpaths',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=400&q=80',
    likes: '932',
    comments: '18'
  },
  {
    id: 'ig-3',
    title: 'Pre-Booking Started @ Decathlon',
    url: 'https://instagram.com/bootpaths',
    imageUrl: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=400&q=80',
    likes: '2.1k',
    comments: '88'
  }
];

const DEFAULT_YOUTUBE_POSTS = [
  {
    id: 'yt-1',
    title: 'Silent Valley Camping Interactive Session',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'yt-2',
    title: 'Kudremuk National Park Trek',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'yt-3',
    title: 'Look Deep Into Nature',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80'
  }
];

export default function App() {
  const [treks, setTreks] = useState([]);
  const [socialFeeds, setSocialFeeds] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [currentHash, setCurrentHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  const [isTermsRoute, setIsTermsRoute] = useState(typeof window !== 'undefined' ? window.location.pathname.endsWith('/terms') : false);
  const [isPrivacyRoute, setIsPrivacyRoute] = useState(typeof window !== 'undefined' ? window.location.pathname.endsWith('/privacy') : false);
  const [isRefundRoute, setIsRefundRoute] = useState(typeof window !== 'undefined' ? window.location.pathname.endsWith('/refund') : false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [expeditionViews, setExpeditionViews] = useState([]);

  // Emergency preview parameter check (?preview=dev_key)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('preview') === 'dev_key') {
        sessionStorage.setItem('dev_bypass', 'true');
      }
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      setIsTermsRoute(window.location.pathname.endsWith('/terms'));
      setIsPrivacyRoute(window.location.pathname.endsWith('/privacy'));
      setIsRefundRoute(window.location.pathname.endsWith('/refund'));
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Scroll to top when loading the blog details page or silent valley page
  useEffect(() => {
    if (currentHash.startsWith('#blog-') || currentHash.startsWith('#blog/') || currentHash === '#silent-valley') {
      window.scrollTo(0, 0);
    }
  }, [currentHash]);

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Auto-slide Hero Media
  useEffect(() => {
    const mediaLength = expeditionViews.length > 0 ? expeditionViews.length : HERO_MEDIA.length;
    if (mediaLength <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % mediaLength);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeHeroIndex, expeditionViews.length]);

  const [showAllTreks, setShowAllTreks] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [leadApplications, setLeadApplications] = useState([]);

  // Subscribe to live packages collection in Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'packages'), (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setTreks(docs);
      setLoadingPackages(false);
    }, (err) => {
      console.warn('Packages snapshot error:', err);
      setLoadingPackages(false);
    });
    return () => unsub();
  }, []);

  // Subscribe to live blogs collection in Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      // Sort in memory to guarantee sorting by createdAt descending without requiring a Firestore index
      docs.sort((a, b) => {
        const timeA = a.createdAt ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt) : 0;
        const timeB = b.createdAt ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt) : 0;
        return timeB - timeA;
      });
      setBlogs(docs);
    }, (err) => {
      console.warn('Blogs snapshot error:', err);
    });
    return () => unsub();
  }, []);

  // Subscribe to live leadApplications collection in Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'leadApplications'), (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date or submittedAt descending
      docs.sort((a, b) => new Date(b.submittedAt || b.date) - new Date(a.submittedAt || a.date));
      setLeadApplications(docs);
    }, (err) => {
      console.warn('LeadApplications snapshot error:', err);
    });
    return () => unsub();
  }, []);


  // Subscribe to live expeditionViews collection in Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'expeditionViews'), orderBy('order', 'asc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setExpeditionViews(docs);
      }, (err) => {
        console.warn('ExpeditionViews snapshot error:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Failed to listen to expeditionViews:', e.message);
    }
  }, []);

  // Subscribe to live socialFeeds collection in Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'socialFeeds'), (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        docs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setSocialFeeds(docs);
      }, (err) => {
        console.warn('socialFeeds snapshot error:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Failed to listen to socialFeeds:', e.message);
    }
  }, []);

  const [detailedTrek, setDetailedTrek] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (treks.length > 0 && !selectedTrek) {
      setSelectedTrek(treks[0]);
    }
  }, [treks, selectedTrek]);

  const [numTrekkers, setNumTrekkers] = useState(1);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Checkout Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Authentication State
  const { currentUser, userData, userRole: contextUserRole, setUserRole: setContextUserRole, authLoading, logout, walletBalance: contextWalletBalance, featureFlags, isAdmin } = useAuth();
  const isCareersEnabled = !!(featureFlags?.enableLeadApplications);
  const [user, setUser] = useState(null); // { name: 'John Doe', email: 'john@example.com', initials: 'JD', photo: null }
  const [userRole, setUserRole] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Customer Dashboard State & Trail Wallet
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('bookings'); // 'bookings', 'profile', or 'wallet'
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [expeditionRecords, setExpeditionRecords] = useState(EXPEDITION_RECORDS);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [useWalletCredit, setUseWalletCredit] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    mobile: '',
    bloodGroup: '',
    emergencyContact: '',
    medicalConditions: ''
  });

  // Client Security Guard
  useEffect(() => {
    if (import.meta.env.PROD) {
      console.clear();
      console.log(
        '%c STOP! BOOTpaths Security Policy Active.',
        'color: #C1571F; font-size: 20px; font-weight: bold;'
      );
    }

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return;
      }
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return;
      }
      // Ctrl + Shift + A (Emergency Admin Access Shortcut)
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (userRole === 'admin' || userRole === 'developer') {
          window.location.hash = '#admin';
        } else {
          alert('Access Denied: Administrative privileges required.');
        }
        return;
      }
      // Ctrl + Shift + D (Developer Access Shortcut)
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        const isDev = userRole === 'developer' || user?.role === 'developer' || user?.email === 'vzentura2026@gmail.com' || currentUser?.email === 'vzentura2026@gmail.com' || userData?.email === 'vzentura2026@gmail.com';
        if (isDev) {
          window.location.hash = '#dev-ops';
        } else {
          alert('Access Denied: Developer privileges required.');
        }
        return;
      }
    };
 
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
 
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [user, userRole]);

  // Synchronize local user session and profileData with Firestore userData
  useEffect(() => {
    if (userData) {
      setUser({
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        initials: userData.initials,
        photo: userData.photoURL || null,
        role: userData.role || 'hiker'
      });
      setUserRole(userData.role || 'hiker');
      if (userData.profile) {
        setProfileData({
          fullName: userData.profile.fullName || '',
          mobile: userData.profile.mobile || '',
          bloodGroup: userData.profile.bloodGroup || '',
          emergencyContact: userData.profile.emergencyContact || '',
          medicalConditions: userData.profile.medicalConditions || ''
        });
      } else {
        setProfileData({
          fullName: userData.name || '',
          mobile: '',
          bloodGroup: '',
          emergencyContact: '',
          medicalConditions: ''
        });
      }
    } else if (!currentUser) {
      setUser(prev => (prev && prev.uid.startsWith('guest-')) ? prev : null);
      setUserRole(null);
    }
  }, [currentUser, userData]);

  // Synchronize wallet balance with Firestore for logged-in users
  useEffect(() => {
    if (user && !user.uid.startsWith('guest-')) {
      setWalletBalance(contextWalletBalance || 0);
    }
  }, [user, contextWalletBalance]);

  // Handle Cancellation Confirmation from Dashboard
  const handleConfirmCancellation = async ({ booking, refundOption, cancelDetails }) => {
    setExpeditionRecords(prev => prev.map(rec => 
      rec.id === booking.id ? { ...rec, status: 'Cancelled' } : rec
    ));

    // Update cancelled status in Firestore bookings collection
    try {
      await setDoc(doc(db, 'bookings', booking.id), {
        status: 'Cancelled'
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore booking cancellation sync notice:', err.message);
    }

    if (refundOption === 'bonus_credit') {
      const bonusCredit = cancelDetails.bonusCreditAmount;
      const newBalance = walletBalance + bonusCredit;
      setWalletBalance(newBalance);
      
      const newTxn = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'credit',
        amount: bonusCredit,
        desc: `+₹${bonusCredit.toLocaleString('en-IN')} - 50% Bonus Cancellation Credit for ${booking.id}`,
        expiry: cancelDetails.formattedExpiry,
        trekRef: booking.id
      };
      setWalletTransactions(prev => [newTxn, ...prev]);

      // Sync to Firestore if user logged in
      if (user && user.uid) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            walletBalance: newBalance
          });
        } catch (err) {
          console.warn('Firestore User Wallet Notice:', err.message);
        }
      }

      setDashboardTab('wallet');
    } else {
      const cashRefund = cancelDetails.baseRefundAmount;
      alert(`Standard cash refund of ₹${cashRefund.toLocaleString('en-IN')} (Base ${cancelDetails.refundPercentage}%) has been initiated to your original payment method.`);
    }
  };

  // Auto-trigger auth modal after 15 seconds if not logged in or modal not opened manually
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('bootpaths_popup_seen') === 'true';
    if (hasSeenPopup || user || isAuthModalOpen) {
      return;
    }

    const timer = setTimeout(() => {
      setIsAuthModalOpen(true);
      localStorage.setItem('bootpaths_popup_seen', 'true');
    }, 15000);

    return () => clearTimeout(timer);
  }, [user, isAuthModalOpen]);

  // Dynamic booking details
  const currentPackageData = selectedTrek ? (treks.find(t => t.id === selectedTrek.id) || selectedTrek) : null;
  const availableBatchDates = currentPackageData ? (currentPackageData.batchDates || currentPackageData.dates || []) : [];
  const currentSlotsLeft = currentPackageData ? (currentPackageData.slotsLeft || 0) : 0;
  const totalPrice = currentPackageData ? (currentPackageData.price * numTrekkers) : 0;
  const appliedWalletDiscount = (useWalletCredit && walletBalance > 0) ? Math.min(walletBalance, totalPrice) : 0;
  const finalPayablePrice = Math.max(0, totalPrice - appliedWalletDiscount);

  // Auto-sync selectedDate to available batch dates
  useEffect(() => {
    if (availableBatchDates.length > 0) {
      if (!selectedDate || !availableBatchDates.includes(selectedDate)) {
        setSelectedDate(availableBatchDates[0]);
      }
    } else {
      setSelectedDate('');
    }
  }, [selectedTrek ? selectedTrek.id : null, availableBatchDates, selectedDate]);

  // Handle trek change in the widget
  const handleTrekChange = (trekId) => {
    const trek = treks.find(t => t.id === trekId);
    if (trek) {
      setSelectedTrek(trek);
      const trekDates = trek.batchDates || trek.dates || [];
      setSelectedDate(trekDates.length > 0 ? trekDates[0] : '');
      setNumTrekkers(1);
    }
  };

  // Auth & CTA flow triggers
  const handleTrigger = (action) => {
    if (!user) {
      setPendingAction(action);
      setIsAuthModalOpen(true);
      localStorage.setItem('bootpaths_popup_seen', 'true');
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action) => {
    if (action.type === 'book_trek') {
      setSelectedTrek(action.payload);
      setSelectedDate(action.payload.batchDates ? action.payload.batchDates[0] : (action.payload.dates ? action.payload.dates[0] : ''));
      setNumTrekkers(1);
      const widget = document.getElementById('booking-widget');
      if (widget) {
        setTimeout(() => {
          widget.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (action.type === 'explore_trails') {
      const upcoming = document.getElementById('upcoming-treks');
      if (upcoming) {
        setTimeout(() => {
          upcoming.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (action.type === 'nav_book') {
      const widget = document.getElementById('booking-widget');
      if (widget) {
        setTimeout(() => {
          widget.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn('Logout error:', err.message);
    }
    setUser(null);
    setUserRole(null);
  };



  // Keep compatibility with card calls
  const handleBookNow = (trek) => {
    handleTrigger({ type: 'book_trek', payload: trek });
  };

  const handleGetDetails = (trek) => {
    if (!trek) return;
    const detailsUrl = trek.detailsUrl || trek.details_url;
    if (detailsUrl && detailsUrl.trim()) {
      const trimmed = detailsUrl.trim();
      if (trimmed.startsWith('/treks/') || trimmed.startsWith('treks/')) {
        const fullUrl = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        window.open(fullUrl, '_blank');
        return;
      }
      if (trimmed.startsWith('#')) {
        window.location.hash = trimmed;
        return;
      }
    }
    if (trek.id === 'silent-valley' || trek.slug === 'silent-valley' || trek.title?.toLowerCase().includes('silent valley')) {
      window.location.hash = '#silent-valley';
      return;
    }
    setDetailedTrek(trek);
  };

  // Start Razorpay Checkout Simulation
  const handleCheckoutInit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required';
    if (!phone.trim() || phone.length < 10) errors.phone = '10-digit phone number is required';
    if (!hasAgreedToTerms) errors.terms = 'You must agree to the Terms of Service to book';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsRazorpayModalOpen(true);
    setIsProcessingPayment(true);

    // Simulate standard Razorpay SDK loading / overlay showing
    setTimeout(() => {
      setIsProcessingPayment(false);
    }, 1800);
  };

  // Handle successful payment: register booking and sync to database
  const handleBookingSuccess = async ({ paymentId, amount }) => {
    setIsProcessingPayment(true);
    
    // Register new confirmed booking record
    const newBookingId = `BP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      id: newBookingId,
      trekId: selectedTrek?.id || 'silent-valley',
      title: selectedTrek?.title || 'Wilderness Trek',
      date: selectedDate || (selectedTrek?.batchDates ? selectedTrek.batchDates[0] : (selectedTrek?.dates ? selectedTrek.dates[0] : '')),
      trekkers: numTrekkers,
      trekkersCount: numTrekkers,
      price: amount,
      totalPrice: amount,
      userName: name || user?.name || 'Trek Participant',
      userEmail: email || user?.email || '',
      userPhone: phone || user?.phone || '',
      status: 'Confirmed',
      paymentId: paymentId || 'Simulated'
    };
    
    setExpeditionRecords(prev => [newRecord, ...prev]);

    // Save booking to Firestore bookings collection
    if (user && user.uid) {
      try {
        await setDoc(doc(db, 'bookings', newBookingId), {
          ...newRecord,
          userId: user.uid,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        if (!import.meta.env.PROD) {
          console.warn('Firestore booking sync error:', err.message);
        }
      }
    }

    // Background POST request to Google Apps Script Web App Webhook
    try {
      const webhookUrl = "https://script.google.com/macros/s/AKfycbznKeKp7ZVY6cKEOoAdmQTedaBA5TcLJo4Yi_oMjAGsUtf8k3ejsVXra95mYT0MBhM/exec";
      fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: newBookingId,
          fullName: name || user?.name || "Trek Participant",
          email: email || user?.email || "N/A",
          phone: phone || user?.phone || "N/A",
          trekName: newRecord.title,
          batchDate: newRecord.date,
          trekkersCount: newRecord.trekkersCount || 1,
          totalPrice: newRecord.totalPrice || amount || 0,
          status: "CONFIRMED"
        })
      }).catch((err) => console.error("Google Sheet Sync Error:", err));
    } catch (sheetErr) {
      console.warn("Google Sheet Trigger Error:", sheetErr);
    }

    // Deduct wallet balance if credit discount was applied
    if (appliedWalletDiscount > 0) {
      setWalletBalance(prev => Math.max(0, prev - appliedWalletDiscount));
      const debitTxn = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'debit',
        amount: appliedWalletDiscount,
        desc: `-₹${appliedWalletDiscount.toLocaleString('en-IN')} - Redeemed for ${selectedTrek.title} (${newBookingId})`,
        expiry: 'N/A',
        trekRef: newBookingId
      };
      setWalletTransactions(prev => [debitTxn, ...prev]);
      setUseWalletCredit(false);
    }

    setName('');
    setEmail('');
    setPhone('');
    setHasAgreedToTerms(false);
    setNumTrekkers(1);
    
    setIsProcessingPayment(false);
    setPaymentSuccess(true);
  };

  // Launch Razorpay Checkout standard iframe modal overlay
  const handleProceedToPay = () => {
    const payableAmount = finalPayablePrice;
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
      amount: payableAmount * 100,
      currency: 'INR',
      name: 'BOOTpaths Expeditions',
      description: `${selectedTrek?.title || 'Trek Booking'} (${selectedDate || 'Select Date'})`,
      handler: async function (response) {
        await handleBookingSuccess({
          paymentId: response.razorpay_payment_id,
          amount: payableAmount
        });
      },
      prefill: {
        name: name || (user?.name || ''),
        email: email || (user?.email || ''),
        contact: phone || ''
      },
      theme: { color: '#C1571F' }
    };
    
    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Razorpay Checkout failed to initialize. Please check your network connection.');
    }
  };

  // Reset checkout flow
  const handleCloseSuccess = () => {
    setIsRazorpayModalOpen(false);
    setPaymentSuccess(false);
    setDashboardTab('bookings');
    setIsDashboardOpen(true); // Open dashboard to view the confirmed booking
  };

  const hasDevBypass = typeof window !== 'undefined' && sessionStorage.getItem('dev_bypass') === 'true';

  const isUserAdmin = isAdmin || 
                      userRole === 'admin' || 
                      userRole === 'developer' || 
                      userData?.role === 'admin' || 
                      userData?.role === 'developer' || 
                      user?.role === 'admin' || 
                      user?.role === 'developer' || 
                      currentUser?.email === 'admin@bootpaths.com' ||
                      user?.email === 'admin@bootpaths.com' ||
                      userData?.email === 'admin@bootpaths.com';

  const isMaintenanceMode = !!(featureFlags?.enableMaintenanceMode);
  const isAdminRoute = currentHash.startsWith('#admin') || currentHash.startsWith('#dev-ops');
  const isBypassed = isUserAdmin || isAdminRoute || hasDevBypass;

  const devBanner = (isMaintenanceMode && isBypassed && !isAdminRoute) ? (
    <div className="fixed bottom-4 right-4 z-50 bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl shadow-lg text-xs flex items-center gap-2 border border-amber-300">
      <span>🚧 Maintenance Mode is Active (Bypassed for Admin)</span>
    </div>
  ) : null;

  // Maintenance Mode Guard Check
  if (isMaintenanceMode && !isBypassed) {
    return (
      <div className="min-h-screen bg-[#1A1A18] text-[#F3ECDD] font-sans flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C1571F]/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
          {/* Logo Badge */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-[#F3ECDD]/20 p-3 mb-8 shadow-xl backdrop-blur-md flex items-center justify-center">
            <img src="/logo.png" alt="BOOTpaths" className="w-full h-full object-contain" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-[#C1571F]/20 text-[#C1571F] border border-[#C1571F]/40 text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" /> SYSTEM MAINTENANCE
          </span>

          <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Under Scheduled Upgrade
          </h1>

          <p className="text-sm text-[#F3ECDD]/70 leading-relaxed mb-8 max-w-md">
            Our expedition reservations and trail logging systems are currently undergoing planned maintenance to improve high-season performance. We will be back live shortly!
          </p>

          {/* Admin Access CTA */}
          <button
            onClick={() => {
              window.location.hash = '#admin';
            }}
            className="h-11 px-6 rounded-xl bg-[#C1571F] hover:bg-[#A84310] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Administrator Access</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-6 text-[11px] text-[#F3ECDD]/40 font-mono">
          © {new Date().getFullYear()} BOOTpaths Ecotourism Portal
        </div>
      </div>
    );
  }

  if (isTermsRoute || currentHash === '#/terms' || currentHash === '#terms') {
    return (
      <>
        <TermsOfService 
          onClose={() => {
            if (isTermsRoute) {
              window.history.pushState(null, '', '/');
              setIsTermsRoute(false);
            } else {
              window.location.hash = '';
            }
          }}
          isFullPage={true}
        />
        {devBanner}
      </>
    );
  }

  if (isPrivacyRoute || currentHash === '#/privacy' || currentHash === '#privacy') {
    return (
      <>
        <PrivacyPolicy 
          onClose={() => {
            if (isPrivacyRoute) {
              window.history.pushState(null, '', '/');
              setIsPrivacyRoute(false);
            } else {
              window.location.hash = '';
            }
          }}
        />
        {devBanner}
      </>
    );
  }

  if (isRefundRoute || currentHash === '#/refund' || currentHash === '#refund') {
    return (
      <>
        <RefundPolicy 
          onClose={() => {
            if (isRefundRoute) {
              window.history.pushState(null, '', '/');
              setIsRefundRoute(false);
            } else {
              window.location.hash = '';
            }
          }}
        />
        {devBanner}
      </>
    );
  }

  if (currentHash === '#dev-ops') {
    if (!import.meta.env.PROD) {
      console.log('DevOps Current User Role:', userRole || userData?.role || user?.role, 'UID:', currentUser?.uid || user?.uid);
    }
    if (authLoading || (currentUser && !userData)) {
      return (
        <div className="min-h-screen bg-[#F3ECDD] flex flex-col items-center justify-center gap-4 text-autumn-bark font-sans">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C1571F]/20 border-t-[#C1571F]"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C1571F]">Verifying Developer Authorization...</span>
        </div>
      );
    }
    const isDev = userRole === 'developer' || user?.role === 'developer' || user?.email === 'vzentura2026@gmail.com' || currentUser?.email === 'vzentura2026@gmail.com' || userData?.email === 'vzentura2026@gmail.com';
    if (isDev) {
      return <DeveloperConsole user={user} />;
    } else {
      window.location.hash = '#';
      return null;
    }
  }

  if (currentHash === '#admin') {
    if (!import.meta.env.PROD) {
      console.log('Current User Role:', userRole || userData?.role || user?.role, 'UID:', currentUser?.uid || user?.uid);
    }
    if (authLoading || (currentUser && !userData)) {
      return (
        <div className="min-h-screen bg-[#F3ECDD] flex flex-col items-center justify-center gap-4 text-autumn-bark font-sans">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C1571F]/20 border-t-[#C1571F]"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C1571F]">Verifying Admin Authorization...</span>
        </div>
      );
    }
    const isVzentura = currentUser?.email === 'vzentura2026@gmail.com' || user?.email === 'vzentura2026@gmail.com' || userData?.email === 'vzentura2026@gmail.com';
    const isAdminOrDev = (userRole === 'admin' || userData?.role === 'admin' || user?.role === 'admin' || userRole === 'developer' || userData?.role === 'developer') && !isVzentura;
    if (!currentUser || !isAdminOrDev) {
      window.location.hash = '#';
      return null;
    }
    return (
      <AdminConsole 
        treks={treks} 
        setTreks={setTreks} 
        blogs={blogs}
        setBlogs={setBlogs}
        isCareersEnabled={isCareersEnabled}
        leadApplications={leadApplications}
        setLeadApplications={setLeadApplications}
        expeditionViews={expeditionViews}
        onReturnToSite={() => { window.location.hash = ''; }} 
      />
    );
  }

  if (currentHash.startsWith('#blog-') || currentHash.startsWith('#blog/')) {
    const blogId = currentHash.startsWith('#blog/') 
      ? currentHash.replace('#blog/', '') 
      : currentHash.replace('#blog-', '');
    return (
      <div className="min-h-screen bg-autumn-mist text-autumn-bark font-sans selection:bg-autumn-maple selection:text-black">
        
        {/* 1. NAVIGATION BAR */}
        <Navbar
          isCareersEnabled={isCareersEnabled}
          user={user}
          userRole={userRole}
          handleLogout={handleLogout}
          setIsDashboardOpen={setIsDashboardOpen}
          setIsAuthModalOpen={setIsAuthModalOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          treks={treks}
          blogs={blogs}
          onSelectTrek={(trek) => {
            setSelectedTrek(trek);
            setSelectedDate(trek.batchDates ? trek.batchDates[0] : (trek.dates ? trek.dates[0] : ''));
            setNumTrekkers(1);
            window.location.hash = '#upcoming-treks';
            setTimeout(() => {
              document.getElementById('upcoming-treks')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
          onOpenAuth={(action) => {
            setPendingAction(action);
            setIsAuthModalOpen(true);
          }}
        />

        {/* Standalone Blog Detail Page content */}
        <BlogDetailPage 
          blogId={blogId} 
          blogs={blogs} 
          onBack={() => {
            window.location.hash = '#blogs';
          }} 
        />

        {/* FOOTER */}
        <footer className="border-t border-autumn-bark/10 bg-autumn-mist py-16 px-6 md:px-12 text-autumn-bark/70 text-xs">
          <div className="mx-auto max-w-7xl grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            
            {/* Brand Info */}
            <div className="lg:col-span-2 space-y-6">
              <a href="#" className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="BOOTpaths" 
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </a>
              <p className="text-xs text-autumn-bark/50 leading-relaxed max-w-sm">
                We guide adventurers to unexplored peaks and premium trails across Western Ghats, The Himalayan and International treks and Expeditions. Fully vetted batches, certified mountain leads, and environment first.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a 
                  href="https://instagram.com/bootpaths" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@BOOTpaths2025" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.facebook.com/share/1ELLiv1gUJ/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Links 1 */}
            <div className="space-y-4">
              <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Popular Trails</h4>
              <ul className="space-y-2.5 text-autumn-bark/50">
                <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Netravathi Peak Trek</a></li>
                <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Brahmagiri Coorg Trek</a></li>
                <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Vellagavi Village Trek</a></li>
              </ul>
            </div>

            {/* Links 2 */}
            <div className="space-y-4">
              <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Resources</h4>
              <ul className="space-y-2.5 text-autumn-bark/50">
                <li><a href="#blogs" className="hover:text-autumn-maple transition-colors">Trek preparation guides</a></li>
                <li><a href="#advantage" className="hover:text-autumn-maple transition-colors">Ecotourism standards</a></li>
                <li><a href="#blogs" className="hover:text-autumn-maple transition-colors">Trek leads & safety logs</a></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Contact Support</h4>
              <ul className="space-y-2 text-autumn-bark/50">
                <li>Email: lead@bootpaths.com</li>
                <li>WhatsApp Support:</li>
                <li className="font-semibold text-autumn-bark/70">+91 8848998470</li>
                <li className="font-semibold text-autumn-bark/70">+91 9895452187</li>
                <li className="font-semibold text-autumn-bark/70">+91 9446102200</li>
              </ul>
            </div>
          </div>

          <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-autumn-bark/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-autumn-bark/40">
            <span>© 2026 BOOTpaths. All Rights Reserved. Confidential & Proprietary.</span>
            <div className="flex gap-4">
              <a href="/terms" className="hover:underline transition-all">Terms of Service</a>
              <a href="/privacy" className="hover:underline transition-all">Privacy Policy</a>
              <a href="/refund" className="hover:underline transition-all">Refund Policy</a>
            </div>
          </div>
        </footer>

        {/* AUTHENTICATION MODAL */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={() => {
            setIsAuthModalOpen(false);
          }}
          defaultAction={pendingAction || 'login'}
        />
        {devBanner}
      </div>
    );
  }

  if (currentHash === '#silent-valley') {
    const svTrek = treks.find(t => t.id === 'silent-valley' || t.title?.toLowerCase().includes('silent valley')) || {
      id: 'silent-valley',
      title: 'Silent Valley Rainforest Trek',
      price: 4000,
      duration: '3 Days',
      altitude: '2,383m',
      location: 'Mukkali, Palakkad',
      originalPrice: 4500,
      slotsLeft: 12
    };

    return (
      <>
        <SilentValleyPage 
          packageData={svTrek}
          onBack={() => {
            window.location.hash = '#upcoming-treks';
          }}
          onOpenBookingModal={() => {
            setSelectedTrek(svTrek);
            setSelectedDate(svTrek.batchDates ? svTrek.batchDates[0] : (svTrek.dates ? svTrek.dates[0] : ''));
            setNumTrekkers(1);
            window.location.hash = '#upcoming-treks';
            setTimeout(() => {
              document.getElementById('upcoming-treks')?.scrollIntoView({ behavior: 'smooth' });
            }, 200);
          }}
        />
        {devBanner}
      </>
    );
  }

  const activeHeroMedia = expeditionViews.length > 0 ? expeditionViews : HERO_MEDIA;

  return (
    <div className="min-h-screen bg-autumn-mist text-autumn-bark font-sans selection:bg-autumn-maple selection:text-black">
      
      {/* 1. NAVIGATION BAR */}
      <Navbar
        isCareersEnabled={isCareersEnabled}
        user={user}
        userRole={userRole}
        handleLogout={handleLogout}
        setIsDashboardOpen={setIsDashboardOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        treks={treks}
        blogs={blogs}
        onSelectTrek={(trek) => {
          setSelectedTrek(trek);
          setSelectedDate(trek.batchDates ? trek.batchDates[0] : (trek.dates ? trek.dates[0] : ''));
          setNumTrekkers(1);
          window.location.hash = '#upcoming-treks';
          setTimeout(() => {
            document.getElementById('upcoming-treks')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
      />

      {/* 2. HERO SECTION */}
      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden py-16 px-6 md:px-12">
        {activeHeroMedia.map((media, idx) => {
          const isActive = idx === activeHeroIndex;
          const mediaUrl = media.mediaUrl || media.src;
          const mediaType = media.mediaType || media.type;
          const key = media.id || media.src;
          return (
            <div
              key={key}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out z-0 ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {mediaType === 'video' ? (
                <video
                  src={mediaUrl}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={media.title}
                  className="h-full w-full object-cover animate-in fade-in zoom-in-105 duration-1000"
                />
              )}
            </div>
          );
        })}
        {/* Advanced Gradient Overlays - Light Uniform Tint */}
        <div className="absolute inset-0 z-10 bg-stone-950/20"></div>

        {/* Dynamic Background Glow Elements */}
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-autumn-maple/10 blur-[100px] z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-emerald-800/10 blur-[120px] z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 mx-auto w-full max-w-5xl text-center md:text-left">
          
         {/* Trust Badge / Decathlon Pill
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F3ECDD]/10 bg-[#3A2A1E]/40 py-1.5 px-4 backdrop-blur-md transition-colors hover:border-autumn-maple/30">
            <span className="flex h-2 w-2 rounded-full bg-autumn-maple animate-ping"></span>
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-[#F3ECDD]/80">
              Official Trekking Partner with <span className="text-autumn-maple font-extrabold">Decathlon</span>
            </span>
          </div>*/}

          {/* Main Slogan */}
          <h1 className="mt-8 font-outfit text-4xl font-black leading-none tracking-tight text-[#F3ECDD] sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg">
            Every Step, <br />
            <span className="bg-gradient-to-r from-autumn-maple via-autumn-amber to-autumn-rhodo bg-clip-text text-transparent">
              a new story
            </span>
          </h1>

          {/* Value Proposition */}
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-[#F3ECDD] md:text-lg drop-shadow-md">
            <span className="font-bold text-[#F3ECDD]">Come green. Leave gold.</span> Safe, Responsible, and Quality Treks in the Western Ghats led by Certified Mountaineers. Backed by premium gear partnership and zero-waste ecotourism benchmarks.
          </p>

          {/* Key Facts Summary Banner (Eco-Tourism Portal style) */}
          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-4 rounded-xl border border-[#F3ECDD]/10 bg-[#3A2A1E]/40 p-4 backdrop-blur-sm sm:grid-cols-4">
            <div className="flex flex-col border-r border-[#F3ECDD]/10 pr-4">
              <span className="font-outfit text-lg font-bold text-autumn-maple">100%</span>
              <span className="text-xxs uppercase tracking-wider text-[#F3ECDD]/60">Experienced Leads</span>
            </div>
            <div className="flex flex-col border-r border-[#F3ECDD]/10 pr-4 sm:border-r">
              <span className="font-outfit text-lg font-bold text-autumn-maple">Zero Waste</span>
              <span className="text-xxs uppercase tracking-wider text-[#F3ECDD]/60">Green Trail Policy</span>
            </div>
            <div className="flex flex-col border-r border-[#F3ECDD]/10 pr-4 sm:pr-0 sm:border-r-0 md:border-r md:pr-4">
              <span className="font-outfit text-lg font-bold text-autumn-maple">Safety First</span>
              <span className="text-xxs uppercase tracking-wider text-[#F3ECDD]/60">First-Aid Kits</span>
            </div>
            <div className="flex flex-col">
              <span className="font-outfit text-lg font-bold text-autumn-maple">Inclusivity</span>
              <span className="text-xxs uppercase tracking-wider text-[#F3ECDD]/60">Safe Spaces</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:justify-start">
            <button 
              onClick={() => handleTrigger({ type: 'explore_trails' })}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-autumn-maple px-8 font-outfit text-sm font-bold uppercase tracking-wider text-[#F3ECDD] transition-all duration-300 hover:bg-[#a44717] hover:shadow-[0_0_30px_rgba(193,87,31,0.4)] focus:outline-none focus:ring-2 focus:ring-autumn-maple"
            >
              Explore Trails
              <ArrowRight className="h-4.5 w-4.5 transition-transform hover:translate-x-1" />
            </button>

          </div>

        </div>

        {/* Floating Tiles Grid Switcher */}
        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 z-20 backdrop-blur-md bg-[#3A2A1E]/60 border border-[#C1571F]/30 rounded-2xl p-2.5 shadow-2xl flex-col items-center sm:items-start max-w-[95vw] sm:max-w-sm">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#F3ECDD]/60 mb-2 px-1">
            Expedition Views
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full">
            {activeHeroMedia.map((media, idx) => {
              const isActive = idx === activeHeroIndex;
              const mediaUrl = media.mediaUrl || media.src;
              const mediaType = media.mediaType || media.type;
              const key = media.id || media.src;
              return (
                <button
                  key={key}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden border transition-all duration-300 group shrink-0 ${
                    isActive 
                      ? 'border-[#C1571F] ring-2 ring-[#C1571F] scale-105 shadow-[0_0_15px_rgba(193,87,31,0.5)]' 
                      : 'border-[#F3ECDD]/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  {mediaType === 'video' ? (
                    <video
                      src={mediaUrl}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={media.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/35 flex items-end p-1">
                    <span className="text-[7px] sm:text-[8px] font-bold text-white uppercase tracking-wider truncate block w-full text-center bg-black/50 py-0.5 rounded">
                      {media.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. THE BOOTpaths ADVANTAGE */}
      <section id="advantage" className="relative border-y border-autumn-bark/10 bg-autumn-mist py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center">
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-autumn-maple">
              The BOOTpaths Standard
            </span>
            <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-autumn-bark sm:text-4xl md:text-5xl">
              Why Wilderness Lovers Trek With Us
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-autumn-maple"></div>
          </div>

          {/* 3-Column Feature Section */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            
            {/* Advantage 1 */}
            <div className="group relative rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/20 p-8 backdrop-blur-sm transition-all duration-300 hover:border-autumn-bark/10 hover:bg-[#EFE8D6]/40 hover:-translate-y-1">
              <div className="absolute top-0 left-8 h-[2px] w-20 bg-autumn-maple transition-all duration-300 group-hover:w-36"></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-autumn-maple/10 text-autumn-maple">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-outfit text-xl font-bold text-autumn-bark">
                Certified Mountaineers
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-autumn-bark/70">
                Our outdoor leads are certified in wilderness medicine (WFR/WAFA) and advanced mountaineering. Safety-first protocols mean oxygen, sat-communicators, and backup systems are standard on every batch.
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                <li className="flex items-center gap-2 text-xs text-autumn-bark/80">
                  <Check className="h-4 w-4 text-autumn-maple shrink-0" />
                  Himalayan Mountaineering Institute Alum
                </li>
                <li className="flex items-center gap-2 text-xs text-autumn-bark/80">
                  <Check className="h-4 w-4 text-autumn-maple shrink-0" />
                  Wilderness First Aid (WFA) Certified
                </li>
              </ul>
            </div>

            {/* Advantage 2 */}
            <div className="group relative rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/20 p-8 backdrop-blur-sm transition-all duration-300 hover:border-autumn-bark/10 hover:bg-[#EFE8D6]/40 hover:-translate-y-1">
              <div className="absolute top-0 left-8 h-[2px] w-20 bg-autumn-maple transition-all duration-300 group-hover:w-36"></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-autumn-maple/10 text-autumn-maple">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-outfit text-xl font-bold text-autumn-bark">
                Responsible Travel
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-autumn-bark/70">
                We practice strictly eco-conscious trekking. Our "Green Trails" initiative ensures zero inorganic waste is left behind. Trekkers receive reusable canvas collection bags for minor path cleanups.
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                <li className="flex items-center gap-2 text-xs text-autumn-bark/80">
                  <Check className="h-4 w-4 text-autumn-maple shrink-0" />
                  100% Trash Backing Commitment
                </li>
                <li className="flex items-center gap-2 text-xs text-autumn-bark/80">
                  <Check className="h-4 w-4 text-autumn-maple shrink-0" />
                  Support for local tribal community guides
                </li>
              </ul>
            </div>

            {/* Advantage 3 */}
            <div className="group relative rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/20 p-8 backdrop-blur-sm transition-all duration-300 hover:border-autumn-bark/10 hover:bg-[#EFE8D6]/40 hover:-translate-y-1">
              <div className="absolute top-0 left-8 h-[2px] w-20 bg-autumn-maple transition-all duration-300 group-hover:w-36"></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-autumn-maple/10 text-autumn-maple">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-outfit text-xl font-bold text-autumn-bark">
                Inclusivity
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-autumn-bark/70">
                We believe the wilderness belongs to everyone. Our expeditions are mindfully designed to welcome solo travelers, beginners, diverse age groups, and women trekkers in a supportive, judgment-free community.
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                <li className="flex items-center gap-2 text-xs text-autumn-bark/80">
                  <Check className="h-4 w-4 text-autumn-maple shrink-0" />
                  Dedicated female trek leads & safe environments
                </li>
                <li className="flex items-center gap-2 text-xs text-autumn-bark/80">
                  <Check className="h-4 w-4 text-autumn-maple shrink-0" />
                  Beginner-friendly pacing with zero gatekeeping
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 4. UPCOMING TREKS GALLERY */}
      <section id="upcoming-treks" className="relative bg-[#EFE8D6]/10 py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-outfit text-xs font-bold tracking-widest uppercase text-autumn-maple">
                Live Batches
              </span>
              <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-autumn-bark sm:text-4xl md:text-5xl">
                Upcoming Western Ghats Trails
              </h2>
            </div>
            <p className="max-w-md text-sm text-autumn-bark/70 md:text-right">
              Fully approved routes with Forest Department clearance. Orderly batch structures with strict sizing of 12-15 trekkers max.
            </p>
          </div>
          
          <div className="mx-auto mt-6 h-1 w-full rounded-full bg-[#EFE8D6]">
            <div className="h-1 w-1/4 rounded-full bg-autumn-maple"></div>
          </div>

          {/* Grid Layout of Destination Cards */}
          {loadingPackages ? (
            <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-autumn-bark/10 border-t-[#C1571F] mb-4"></div>
              <p className="text-xs text-autumn-bark/60 uppercase tracking-widest font-bold">Loading Trails...</p>
            </div>
          ) : (treks || []).length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center p-8 py-16 text-center bg-[#EBE3D3]/40 rounded-3xl border border-[#3A2A1E]/10">
              <Compass className="h-16 w-16 text-[#C1571F] animate-pulse mb-4" />
              <h3 className="font-outfit text-lg font-black text-[#3A2A1E] uppercase tracking-wider">No Treks Currently Available</h3>
              <p className="text-xs text-[#3A2A1E]/60 max-w-sm mt-2">Check back soon for new wilderness pathways and seasonal bookings.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {(showAllTreks ? treks : treks.slice(0, 3)).map((trek) => (
                <div 
                  key={trek.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/40 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-autumn-maple/30 hover:bg-[#EFE8D6]/70 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  {/* Image & Badges Container */}
                  <div className="relative h-56 w-full overflow-hidden">
                    {trek.videoEmbed ? (
                      <iframe 
                        src={trek.videoEmbed} 
                        className="h-full w-full object-cover border-0 pointer-events-none scale-[1.35]" 
                        scrolling="no" 
                        title={trek.title}
                      />
                    ) : trek.videoLocal ? (
                      <video 
                        src={trek.videoLocal} 
                        className="h-full w-full object-cover" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                    ) : (
                      <img 
                        src={trek.image} 
                        alt={trek.title} 
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    {/* Dark Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none"></div>
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="rounded backdrop-blur-md bg-[#EFE8D6]/40 border border-autumn-bark/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-autumn-maple transition-all duration-300 group-hover:border-autumn-maple/40 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]">
                        {trek.tag}
                      </span>
                    </div>
  
                    {/* Difficulty Badge */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-autumn-mist/80 px-2 py-0.5 text-xs text-autumn-bark/80 backdrop-blur-sm">
                        <Clock className="h-3.5 w-3.5 text-autumn-maple" />
                        {trek.duration}
                      </span>
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold backdrop-blur-sm bg-autumn-mist/80 ${
                        trek.difficulty === 'Challenging' ? 'text-amber-400' : 'text-autumn-maple'
                      }`}>
                        {trek.difficulty}
                      </span>
                    </div>
                  </div>
  
                  {/* Card Info */}
                  <div className="flex flex-1 flex-col p-6">
                    
                    {/* Title & Altitude */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-outfit text-xl font-bold text-autumn-bark group-hover:text-autumn-maple transition-colors">
                          {trek.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs text-autumn-bark/50 mt-1">
                          <MapPin className="h-3 w-3" />
                          {trek.location}
                        </span>
                      </div>
                      <span className="shrink-0 rounded bg-stone-850/80 px-2 py-0.5 text-xxs font-mono text-autumn-bark/70">
                        {trek.altitude}
                      </span>
                    </div>
  
                    {/* Description */}
                    <p className="mt-4 text-xs leading-relaxed text-autumn-bark/70">
                      {trek.description}
                    </p>
  
                    {/* Quick details / inclusions */}
                    <div className="mt-5 border-t border-autumn-bark/10 pt-4">
                      <div className="grid grid-cols-2 gap-2 text-xxs text-autumn-bark/70">
                        {(trek.inclusion || []).slice(0, 4).map((inc, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-autumn-maple shrink-0" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
  
                    {/* Slot warning label */}
                    <div className="mt-5 flex items-center justify-between border-t border-autumn-bark/10 pt-4">
                      <div>
                        <span className="text-xxs uppercase tracking-wider text-autumn-bark/50">Live Slots Left</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`h-2 w-2 rounded-full ${trek.slotsLeft <= 5 ? 'bg-red-500 animate-ping' : 'bg-autumn-maple'}`}></span>
                          <span className={`text-xs font-bold ${trek.slotsLeft <= 5 ? 'text-red-400' : 'text-autumn-bark/80'}`}>
                            {trek.slotsLeft} slots remaining
                          </span>
                        </div>
                      </div>
  
                      <div className="text-right">
                        <span className="text-xxs uppercase tracking-wider text-autumn-bark/50">Price Starts At</span>
                        <div className="mt-0.5">
                          <span className="text-xs text-autumn-bark/50 line-through mr-1 font-semibold">₹{trek.originalPrice}</span>
                          <span className="text-base font-bold text-autumn-maple">₹{trek.price}</span>
                        </div>
                      </div>
                    </div>
  
                    {/* Action Row */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button
                        onClick={() => handleGetDetails(trek)}
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-[#6E7042] text-[#3A2A1E] font-outfit text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#6E7042]/10 cursor-pointer"
                      >
                        Get Details
                      </button>
                      <button
                        onClick={() => handleBookNow(trek)}
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#C1571F] text-white font-outfit text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:bg-[#a44717] hover:shadow-[0_4px_12px_rgba(193,87,31,0.2)]"
                      >
                        Book Now
                      </button>
                    </div>
  
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progressive Loading Toggle */}
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setShowAllTreks(!showAllTreks)}
              className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg border border-autumn-bark/10 bg-[#EFE8D6]/30 px-8 font-outfit text-sm font-bold uppercase tracking-wider text-autumn-bark backdrop-blur-sm transition-all duration-300 hover:border-autumn-maple/50 hover:bg-[#EFE8D6] hover:text-autumn-maple focus:outline-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                {showAllTreks ? 'Show Fewer Trails' : 'Explore More Experiences'}
                <Plus className={`h-4 w-4 transition-transform duration-300 ${showAllTreks ? 'rotate-45' : ''}`} />
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE SLOT BOOKING WIDGET */}
      <section id="booking-widget" className="relative border-t border-autumn-bark/10 bg-autumn-mist py-24 px-6 md:px-12">
        {/* Abstract mountain wireframe background glow */}
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] bg-autumn-maple/5 blur-[150px] pointer-events-none"></div>
        
        <div className="mx-auto max-w-5xl">
          
          <div className="text-center">
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-autumn-maple">
              Instant Booking System
            </span>
            <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-autumn-bark sm:text-4xl">
              Live Slot Reservation Widget
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-autumn-bark/70">
              Check real-time batch vacancies, calculate prices dynamically, and trigger instant authorization.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            
            {/* Left: Input Selection Column (7 cols) */}
            <div className="rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/20 p-8 backdrop-blur-sm lg:col-span-7">
              <h3 className="font-outfit text-lg font-bold text-autumn-bark mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-autumn-maple" />
                Select Destination & Batch
              </h3>

              <form onSubmit={handleCheckoutInit} className="space-y-6">
                
                {/* Trek Selection */}
                <div>
                  <label htmlFor="trek-select" className="block text-xs font-bold uppercase tracking-wider text-autumn-bark/70 mb-2">
                    Select Trek
                  </label>
                  <select 
                    id="trek-select"
                    className="w-full h-12 rounded-lg border border-autumn-bark/10 bg-autumn-mist px-4 text-sm text-autumn-bark transition-colors focus:border-autumn-maple focus:outline-none"
                    value={selectedTrek ? selectedTrek.id : ''}
                    onChange={(e) => handleTrekChange(e.target.value)}
                    disabled={treks.length === 0}
                  >
                    {(treks || []).length === 0 ? (
                      <option value="" disabled>No active treks available</option>
                    ) : (
                      (treks || []).map(t => (
                        <option key={t.id} value={t.id}>{t.title} (₹{t.price})</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Grid of Dates & Trekkers count */}
                <div className="grid gap-6 sm:grid-cols-2">
                  
                  {/* Date selection */}
                  <div>
                    <label htmlFor="date-select" className="block text-xs font-bold uppercase tracking-wider text-autumn-bark/70 mb-2">
                      Available Batch Date
                    </label>
                    <select
                      id="date-select"
                      className="w-full h-12 rounded-lg border border-autumn-bark/10 bg-autumn-mist px-4 text-sm text-autumn-bark transition-colors focus:border-autumn-maple focus:outline-none disabled:opacity-50"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      disabled={availableBatchDates.length === 0}
                    >
                      {(availableBatchDates || []).length === 0 ? (
                        <option value="" disabled>No active batches available</option>
                      ) : (
                        (availableBatchDates || []).map((dateStr, idx) => {
                          let formattedDate = dateStr;
                          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                            const parsedDate = new Date(dateStr + 'T00:00:00');
                            formattedDate = parsedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                          }
                          return (
                            <option key={idx} value={dateStr}>{formattedDate}</option>
                          );
                        })
                      )}
                    </select>
                  </div>

                  {/* Trekkers Count */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-autumn-bark/70 mb-2">
                      Number of Trekkers
                    </label>
                    <div className="flex h-12 items-center rounded-lg border border-autumn-bark/10 bg-autumn-mist px-2">
                      <button 
                        type="button"
                        onClick={() => setNumTrekkers(prev => Math.max(1, prev - 1))}
                        disabled={numTrekkers <= 1 || availableBatchDates.length === 0}
                        className="flex h-8 w-8 items-center justify-center rounded bg-[#EFE8D6] text-autumn-bark/80 transition-colors hover:bg-[#EFE8D6]/70 hover:text-white disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center font-outfit text-base font-bold text-autumn-bark">
                        {numTrekkers}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setNumTrekkers(prev => Math.min(currentSlotsLeft, prev + 1))}
                        disabled={numTrekkers >= currentSlotsLeft || availableBatchDates.length === 0}
                        className="flex h-8 w-8 items-center justify-center rounded bg-[#EFE8D6] text-autumn-bark/80 transition-colors hover:bg-[#EFE8D6]/70 hover:text-white disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>

                <hr className="border-autumn-bark/10 my-4" />

                {/* Personal Information for Checkout */}
                <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-autumn-bark/70 mb-4">
                  Lead Trekker Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="user-name" className="block text-xxs font-bold uppercase tracking-wider text-autumn-bark5 mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      id="user-name"
                      placeholder="Enter full name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full h-11 rounded-lg border bg-autumn-mist px-4 text-xs text-autumn-bark transition-colors focus:border-autumn-maple focus:outline-none ${
                        formErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-autumn-bark/10'
                      }`}
                    />
                    {formErrors.name && <p className="text-red-455 text-xxs mt-1">{formErrors.name}</p>}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="user-email" className="block text-xxs font-bold uppercase tracking-wider text-autumn-bark5 mb-1">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        id="user-email"
                        placeholder="trekker@gmail.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full h-11 rounded-lg border bg-autumn-mist px-4 text-xs text-autumn-bark transition-colors focus:border-autumn-maple focus:outline-none ${
                          formErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-autumn-bark/10'
                        }`}
                      />
                      {formErrors.email && <p className="text-red-455 text-xxs mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="user-phone" className="block text-xxs font-bold uppercase tracking-wider text-autumn-bark5 mb-1">
                        Contact Phone (WhatsApp)
                      </label>
                      <input 
                        type="tel" 
                        id="user-phone"
                        placeholder="10-digit number" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full h-11 rounded-lg border bg-autumn-mist px-4 text-xs text-autumn-bark transition-colors focus:border-autumn-maple focus:outline-none ${
                          formErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-autumn-bark/10'
                        }`}
                      />
                      {formErrors.phone && <p className="text-red-455 text-xxs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Terms of Service Checkbox */}
                <div className="mt-4">
                  <div className="flex items-start gap-2.5">
                    <input 
                      type="checkbox" 
                      id="agree-tos" 
                      checked={hasAgreedToTerms} 
                      onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-autumn-bark/20 text-[#C1571F] focus:ring-[#C1571F] accent-[#C1571F]"
                    />
                    <label htmlFor="agree-tos" className="text-xxs text-autumn-bark/70 leading-normal">
                      I have read and agree to the{' '}
                      <button 
                        type="button" 
                        onClick={() => setIsTermsModalOpen(true)}
                        className="text-[#C1571F] font-bold hover:underline bg-transparent border-none p-0 inline-block align-baseline"
                      >
                        BOOTpaths Terms of Service
                      </button>
                    </label>
                  </div>
                  {formErrors.terms && <p className="text-red-455 text-xxs mt-1">{formErrors.terms}</p>}
                </div>

                {/* Razorpay Simulation Trigger Button */}
                <button
                  type="submit"
                  disabled={availableBatchDates.length === 0}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-autumn-maple font-outfit text-sm font-bold uppercase tracking-wider text-[#F3ECDD] transition-all duration-300 hover:bg-[#a44717] hover:shadow-[0_0_20px_rgba(193,87,31,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {availableBatchDates.length === 0 ? 'No Batches Available' : 'Secure Reservation'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

            </div>

            {/* Right: Dynamic Pricing Card Column (5 cols) */}
            {!selectedTrek ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/30 p-8 backdrop-blur-sm lg:col-span-5 py-24 text-center">
                <Compass className="h-12 w-12 text-[#C1571F] animate-pulse mb-3" />
                <p className="text-xs text-autumn-bark/60 uppercase tracking-widest font-bold">Select a trek destination</p>
                <p className="text-xxs text-autumn-bark/40 mt-1 max-w-xs">Available vacancies and dynamic pricing details will load instantly.</p>
              </div>
            ) : (
              <div className="flex flex-col justify-between rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/30 p-8 backdrop-blur-sm lg:col-span-5">
                <div>
                  <span className="font-mono text-xxs text-autumn-maple border border-autumn-maple/20 bg-autumn-maple/5 px-2 py-0.5 rounded">
                    Live Vacancy Check
                  </span>
                  
                  {/* Selected Trek Info */}
                  <h3 className="mt-4 font-outfit text-2xl font-black text-autumn-bark">
                    {selectedTrek.title}
                  </h3>
                  <span className="text-xs text-autumn-bark/70 block mt-1.5 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-autumn-bark/50" />
                    {selectedTrek.location}
                  </span>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-xs py-1.5 border-b border-autumn-bark/10">
                      <span className="text-autumn-bark/50">Trip Duration</span>
                      <span className="text-autumn-bark/80 font-semibold">{selectedTrek.duration}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1.5 border-b border-autumn-bark/10">
                      <span className="text-autumn-bark/50">Altitude Reached</span>
                      <span className="text-autumn-bark/80 font-mono font-semibold">{selectedTrek.altitude}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1.5 border-b border-autumn-bark/10">
                      <span className="text-autumn-bark/50">Trek Cost (Per Trekker)</span>
                      <span className="text-autumn-bark/80 font-bold">₹{selectedTrek.price}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1.5 border-b border-autumn-bark/10">
                      <span className="text-autumn-bark/50">Decathlon Gear Kit</span>
                      <span className="text-autumn-maple font-semibold flex items-center gap-1">
                        Included <Info className="h-3 w-3 text-autumn-bark/50 hover:text-autumn-maple cursor-help" />
                      </span>
                    </div>
                  </div>

                  {/* Real-time Vacancy Warning */}
                  <div className={`mt-6 rounded-lg border p-4 ${
                    currentSlotsLeft <= 5 
                      ? 'border-red-500/20 bg-red-500/5' 
                      : 'border-autumn-maple/10 bg-autumn-maple/5'
                  }`}>
                    <div className="flex gap-3">
                      {currentSlotsLeft <= 5 ? (
                        <Flame className="h-5 w-5 text-red-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-autumn-maple shrink-0" />
                      )}
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${currentSlotsLeft <= 5 ? 'text-red-400' : 'text-autumn-maple'}`}>
                          {currentSlotsLeft <= 5 ? 'High Demand!' : 'Slots Available'}
                        </h4>
                        <p className="text-xxs text-autumn-bark/70 mt-1">
                          {currentSlotsLeft <= 5 
                            ? `Only ${currentSlotsLeft} vacancies left. Prices may rise shortly for this batch.` 
                            : `${currentSlotsLeft} slots remaining on selected dates.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trail Wallet Credit Checkout Auto-Redemption */}
                  {walletBalance > 0 && (
                    <div className="mt-4 p-3.5 rounded-xl border border-[#C1571F]/30 bg-[#C1571F]/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={useWalletCredit}
                            onChange={(e) => setUseWalletCredit(e.target.checked)}
                            className="h-4 w-4 rounded border-[#3A2A1E]/20 text-[#C1571F] focus:ring-[#C1571F] accent-[#C1571F]"
                          />
                          <span className="text-xs font-bold text-autumn-bark flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-[#C1571F]" />
                            Apply Trail Wallet Credit
                          </span>
                        </label>
                        <span className="text-xs font-extrabold text-[#C1571F]">
                          ₹{walletBalance.toLocaleString('en-IN')} Available
                        </span>
                      </div>
                      {useWalletCredit && (
                        <div className="text-xxs text-emerald-700 font-bold flex items-center justify-between pt-1 border-t border-[#C1571F]/10">
                          <span>Discount Applied:</span>
                          <span>-₹{appliedWalletDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dynamic Price Display */}
                <div className="mt-8 border-t border-autumn-bark/10 pt-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xxs uppercase tracking-wider text-autumn-bark/50">Total Price</span>
                      <div className="text-xxs text-autumn-bark/50 mt-0.5">
                        ₹{selectedTrek.price} x {numTrekkers} {numTrekkers === 1 ? 'Trekker' : 'Trekkers'}
                      </div>
                    </div>
                    <div className="text-right">
                      {appliedWalletDiscount > 0 && (
                        <span className="text-xs text-emerald-700 font-bold block line-through opacity-75">
                          ₹{totalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="font-outfit text-3xl font-black text-autumn-bark block">
                        ₹{finalPayablePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xxs text-autumn-bark/50 uppercase tracking-widest block mt-0.5">
                        + Inclusive of Taxes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 6. SOCIAL MEDIA COMMUNITY FEED */}
      {featureFlags.enableSocialFeeds && (
        <section id="community" className="relative border-t border-autumn-bark/10 bg-[#F3ECDD] py-24 px-6 md:px-12">
          <div className="mx-auto max-w-7xl font-sans">
          
          {/* Instagram Feed Section */}
          <div className="space-y-12">
            <div className="text-center">
              <span className="font-outfit text-xs font-bold tracking-widest uppercase text-autumn-maple">
                Community Vibes
              </span>
              <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-autumn-bark sm:text-4xl">
                Catch the Vibe on Instagram
              </h2>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="https://instagram.com/bootpaths" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-autumn-maple font-outfit text-lg font-bold hover:underline"
                >
                  <Instagram className="h-5 w-5" />
                  @bootpaths
                  <ExternalLink className="h-3.5 w-3.5 text-autumn-bark/50" />
                </a>
                <a 
                  href="https://instagram.com/bootpaths" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C1571F] text-[#F3ECDD] font-outfit text-xs font-bold uppercase tracking-wider hover:bg-[#a44717] transition-colors"
                >
                  Follow @bootpaths
                </a>
              </div>
            </div>

            {/* Instagram Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {(socialFeeds.filter(item => item.type === 'instagram').length > 0 
                ? socialFeeds.filter(item => item.type === 'instagram')
                : DEFAULT_INSTAGRAM_POSTS
              ).map((post) => (
                <a 
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-2xl bg-autumn-mist border border-autumn-bark/10 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {post.thumbnailUrl || post.imageUrl ? (
                    <img 
                      src={post.thumbnailUrl || post.imageUrl} 
                      alt={post.title} 
                      className="h-full w-full object-cover object-center transition-transform duration-505 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#3A2A1E] to-[#C1571F] flex flex-col items-center justify-center gap-3 p-4 transition-all duration-505 group-hover:scale-105">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-[#2A1D14] flex items-center justify-center shadow-lg border border-[#C1571F]/30">
                        <img 
                          src="/logo.png" 
                          alt="BOOTpaths Logo" 
                          className="w-full h-full object-cover scale-105" 
                        />
                      </div>
                      <span className="font-outfit text-sm font-extrabold tracking-tight text-[#F3ECDD]">
                        BOOT<span className="text-[#C1571F]">paths</span>
                      </span>
                    </div>
                  )}
                  {/* Grid Overlay on Hover */}
                  <div className="absolute inset-0 bg-[#3A2A1E]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center p-6 text-center z-10 gap-3">
                    <Instagram className="h-8 w-8 text-[#C1571F]" />
                    <h4 className="font-outfit text-sm font-extrabold text-[#F3ECDD] leading-snug">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-bold text-[#F3ECDD]/80">
                      <span>♥ {post.likes || '1.1k'}</span>
                      <span>💬 {post.comments || '24'}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C1571F] bg-[#F3ECDD] px-3 py-1 rounded-full mt-2">
                      View Post
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* YouTube Section */}
          <div className="mt-24 space-y-12 pt-24 border-t border-autumn-bark/10">
            <div className="text-center">
              <span className="font-outfit text-xs font-bold tracking-widest uppercase text-autumn-maple">
                Trail Stories
              </span>
              <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-autumn-bark sm:text-4xl">
                Trail Stories on YouTube
              </h2>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="https://youtube.com/@BOOTpaths2025" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-autumn-maple font-outfit text-lg font-bold hover:underline"
                >
                  <YoutubeIcon className="h-5 w-5 text-red-600" />
                  @BOOTpaths2025
                  <ExternalLink className="h-3.5 w-3.5 text-autumn-bark/50" />
                </a>
                <a 
                  href="https://youtube.com/@BOOTpaths2025?sub_confirmation=1" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white font-outfit text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
                >
                  Subscribe @BOOTpaths2025
                </a>
              </div>
            </div>

            {/* YouTube Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {(socialFeeds.filter(item => item.type === 'youtube').length > 0 
                ? socialFeeds.filter(item => item.type === 'youtube')
                : DEFAULT_YOUTUBE_POSTS
              ).map((video) => (
                <a 
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-2xl bg-autumn-mist border border-autumn-bark/10 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {video.thumbnailUrl || video.imageUrl ? (
                      <img 
                        src={video.thumbnailUrl || video.imageUrl} 
                        alt={video.title} 
                        className="h-full w-full object-cover object-center transition-transform duration-505 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#3A2A1E] to-[#C1571F] flex flex-col items-center justify-center gap-3 p-4 transition-all duration-505 group-hover:scale-105">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2A1D14] flex items-center justify-center shadow-lg border border-[#C1571F]/30">
                          <img 
                            src="/logo.png" 
                            alt="BOOTpaths Logo" 
                            className="w-full h-full object-cover scale-105" 
                          />
                        </div>
                        <span className="font-outfit text-xs font-extrabold tracking-tight text-[#F3ECDD]">
                          BOOT<span className="text-[#C1571F]">paths</span>
                        </span>
                      </div>
                    )}
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-[#3A2A1E]/30 flex items-center justify-center group-hover:bg-[#3A2A1E]/60 transition-all duration-300">
                      <div className="h-14 w-14 rounded-full bg-[#F3ECDD] text-[#C1571F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="h-6 w-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-autumn-mist">
                    <h4 className="font-outfit text-sm font-extrabold text-autumn-bark line-clamp-2 leading-snug group-hover:text-autumn-maple transition-colors">
                      {video.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 mt-3 text-[10px] font-bold text-autumn-bark/50 uppercase tracking-widest">
                      <YoutubeIcon className="h-3.5 w-3.5 text-red-600" />
                      Watch on YouTube
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Decathlon Partner Spotlight */}
          <div className="mt-24 rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/20 p-8 text-center max-w-4xl mx-auto backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
              <div className="font-outfit text-2xl font-black uppercase tracking-wider text-autumn-bark/80">
                BOOT<span className="text-autumn-maple">paths</span>
              </div>
              <div className="h-px w-12 bg-stone-800 sm:h-8 sm:w-px"></div>
              <div className="flex items-center gap-2 font-outfit text-lg font-bold tracking-widest text-autumn-bark/70 uppercase">
                <span>Trekking Partner</span>
                <span className="px-2 py-0.5 bg-autumn-maple text-[#F3ECDD] text-xxs font-extrabold rounded">DECATHLON</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-autumn-bark/50 leading-relaxed max-w-2xl mx-auto">
              Our trekkers enjoy access to exclusive trail gears and product tests at local Decathlon centers. Join our weekend workshops for trail hacks, map reading, and hiking pack essentials.
            </p>
          </div>

        </div>
      </section>
      )}

      <LeadCareers 
        isCareersEnabled={isCareersEnabled}
      />

      {featureFlags.enableCommunityBlogs && (
        <BlogSection 
          blogs={blogs} 
          onAddBlog={(newBlog) => setBlogs(prev => [newBlog, ...prev])} 
          user={user} 
          onOpenAuth={(action) => {
            setPendingAction(action);
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* FOOTER */}
      <footer className="border-t border-autumn-bark/10 bg-autumn-mist py-16 px-6 md:px-12 text-autumn-bark/70 text-xs">
        <div className="mx-auto max-w-7xl grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <a href="#" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="BOOTpaths" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </a>
            <p className="text-xs text-autumn-bark/50 leading-relaxed max-w-sm">
              We guide adventurers to unexplored peaks and premium trails across Western Ghats, The Himalayan and International treks and Expeditions. Fully vetted batches, certified mountain leads, and environment first.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a 
                href="https://instagram.com/bootpaths" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/@BOOTpaths2025" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/share/1ELLiv1gUJ/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-4">
            <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Popular Trails</h4>
            <ul className="space-y-2.5 text-autumn-bark/50">
              <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Netravathi Peak Trek</a></li>
              <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Brahmagiri Coorg Trek</a></li>
              <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Vellagavi Village Trek</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-4">
            <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Company Info</h4>
            <ul className="space-y-2.5 text-autumn-bark/50">
              <li><a href="#advantage" className="hover:text-autumn-maple transition-colors">Our Crew & Advantage</a></li>
              <li><a href="#community" className="hover:text-autumn-maple transition-colors">Community Stories</a></li>
              {isCareersEnabled && (
                <li><a href="#careers" className="hover:text-autumn-maple transition-colors">Careers for Leads</a></li>
              )}
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Get in Touch</h4>
            <ul className="space-y-2.5 text-autumn-bark/50">
              <li>Email: <a href="mailto:[EMAIL_ADDRESS]" className="hover:text-autumn-maple transition-colors">[bootpaths@gmail.com]</a></li>
              <li>WhatsApp Support: <a href="https://wa.me/918848998470" target="_blank" rel="noreferrer" className="hover:text-autumn-maple transition-colors">+91 8848998470</a></li>
              <li>WhatsApp Support: <a href="https://wa.me/919895452187" target="_blank" rel="noreferrer" className="hover:text-autumn-maple transition-colors">+91 9895452187</a></li>
              <li>WhatsApp Support: <a href="https://wa.me/919446102200" target="_blank" rel="noreferrer" className="hover:text-autumn-maple transition-colors">+91 9446102200</a></li>
              <li>Instagram DM: <a href="https://www.instagram.com/bootpaths/" target="_blank" rel="noreferrer" className="hover:text-autumn-maple transition-colors">@bootpaths</a></li>
            </ul>
          </div>

        </div>

        <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-autumn-bark/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xxs text-autumn-bark/40">
          <div>
            &copy; {new Date().getFullYear()} BOOTpaths Adventure Labs. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a 
              href="#/terms" 
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#/terms';
              }}
              className="hover:text-autumn-bark/70"
            >
              Terms of Service
            </a>
            <a 
              href="#/privacy" 
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#/privacy';
              }}
              className="hover:text-autumn-bark/70"
            >
              Privacy Policy
            </a>
            <a 
              href="#/refund" 
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#/refund';
              }}
              className="hover:text-autumn-bark/70"
            >
              Cancellation & Refund Policy
            </a>
          </div>
        </div>
      </footer>

      {/* TERMS OF SERVICE MODAL OVERLAY */}
      {isTermsModalOpen && (
        <TermsOfService 
          onClose={() => setIsTermsModalOpen(false)} 
          isFullPage={false} 
        />
      )}

      {/* RAZORPAY SECURE PAYMENT PORTAL SIMULATOR MODAL */}
      {isRazorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-autumn-mist/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-autumn-bark/10 bg-[#EFE8D6] shadow-2xl animate-in zoom-in-95 duration-250">
            
            {/* Razorpay Top Banner */}
            <div className="bg-autumn-mist p-6 flex justify-between items-center border-b border-autumn-bark/10">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="BOOTpaths" 
                  className="h-8 w-auto object-contain"
                />
                <div>
                  <span className="block text-[8px] text-autumn-bark/50 tracking-wider uppercase font-bold mt-0.5">RAZORPAY SECURE API</span>
                </div>
              </div>
              <button 
                onClick={() => setIsRazorpayModalOpen(false)}
                className="h-8 w-8 rounded-full bg-[#EFE8D6] flex items-center justify-center text-autumn-bark/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Simulated Payment content */}
            {!paymentSuccess ? (
              <div className="p-6">
                {isProcessingPayment ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-autumn-bark/10 border-t-emerald-500"></div>
                    <div>
                      <h4 className="text-sm font-bold text-autumn-bark/80 uppercase tracking-widest">Processing Transaction</h4>
                      <p className="text-xxs text-autumn-bark/50 mt-1">Please do not refresh or close this window.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Bill summary */}
                    <div className="rounded-lg bg-stone-955 p-4 mb-6">
                      <span className="text-xxs uppercase tracking-wider text-autumn-bark/50 block">Secure Payment Request For</span>
                      <span className="text-xs font-bold text-autumn-bark/80 block mt-1">{selectedTrek ? selectedTrek.title : ''}</span>
                      <span className="text-xxs text-autumn-bark5 mt-0.5 block">
                        Batch Date: {selectedDate && !isNaN(new Date(selectedDate).getTime()) ? new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      <span className="text-xxs text-autumn-bark5 block">Trekkers: {numTrekkers}</span>
                      
                      <div className="mt-4 pt-3 border-t border-autumn-bark/10 flex items-center justify-between">
                        <span className="text-xxs text-autumn-bark/70 font-bold uppercase">Payable Amount</span>
                        <span className="font-outfit text-xl font-black text-autumn-maple">₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Payer details review */}
                    <div className="text-xxs text-autumn-bark/50 space-y-1 mb-6 border-b border-autumn-bark/10 pb-4">
                      <div><span className="font-bold text-autumn-bark/70">Payer Name:</span> {name}</div>
                      <div><span className="font-bold text-autumn-bark/70">Email:</span> {email}</div>
                      <div><span className="font-bold text-autumn-bark/70">Phone:</span> {phone}</div>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handleProceedToPay}
                      className="w-full flex h-11 items-center justify-center gap-2 rounded bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-widest text-[#F3ECDD] transition-colors hover:bg-[#a44717] cursor-pointer"
                    >
                      PROCEED TO PAY ₹{finalPayablePrice.toLocaleString('en-IN')}
                    </button>

                    {/* Direct Fallback Link */}
                    <div className="mt-4 text-center">
                      <span className="text-xxs text-autumn-bark/40 block mb-2">— OR USE BACKUP DIRECT LINK —</span>
                      <a
                        href={`https://razorpay.me/@bootpaths?amount=${finalPayablePrice}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full h-11 items-center justify-center rounded border border-[#C1571F] text-[#C1571F] font-outfit text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#C1571F] hover:text-[#3A2A1E]"
                      >
                        🔗 Pay Direct via Razorpay.me ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Success screen state */
              <div className="p-8 text-center animate-in fade-in duration-300">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-autumn-maple/10 text-autumn-maple mb-6">
                  <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                </div>
                
                <h3 className="font-outfit text-xl font-black text-autumn-bark uppercase tracking-wide">
                  Trek Booked Successfully!
                </h3>
                <p className="text-xxs text-autumn-bark/70 mt-2">
                  Booking ID: <span className="font-mono font-bold text-autumn-maple uppercase">BP-{Math.floor(100000 + Math.random() * 900000)}</span>
                </p>

                <div className="rounded-lg bg-stone-955 p-4 my-6 text-left space-y-2">
                  <div className="text-xxs text-autumn-bark/70"><span className="font-bold text-autumn-bark/80">Destination:</span> {selectedTrek ? selectedTrek.title : ''}</div>
                  <div className="text-xxs text-autumn-bark/70">
                    <span className="font-bold text-autumn-bark/80">Date:</span> {selectedDate && !isNaN(new Date(selectedDate).getTime()) ? new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </div>
                  <div className="text-xxs text-autumn-bark/70"><span className="font-bold text-autumn-bark/80">Trekkers:</span> {numTrekkers}</div>
                  <div className="text-xxs text-autumn-bark/70"><span className="font-bold text-autumn-bark/80">Total Paid:</span> ₹{totalPrice.toLocaleString('en-IN')}</div>
                </div>

                <div className="text-xxs text-autumn-bark5 bg-[#EFE8D6]/50 p-3.5 rounded border border-autumn-bark/10 leading-relaxed mb-6">
                  📢 <span className="font-bold text-autumn-bark/70">Next Steps:</span> A confirmation summary and Decathlon prep list have been dispatched to your email & WhatsApp. Our mountaineering crew will contact you shortly for details.
                </div>

                <button
                  onClick={handleCloseSuccess}
                  className="w-full flex h-11 items-center justify-center rounded bg-stone-955 border border-autumn-bark/10 text-autumn-bark/80 font-outfit text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#EFE8D6] hover:text-white"
                >
                  Close & Back to Site
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CONDITIONAL TREK DETAILS & ITINERARY MODAL */}
      {detailedTrek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-autumn-maple/20 bg-autumn-mist text-autumn-bark shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#EFE8D6] p-5 flex justify-between items-center border-b border-autumn-bark/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-autumn-maple/10 flex items-center justify-center text-autumn-maple">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-outfit text-base font-bold uppercase tracking-wider text-autumn-bark">
                    {detailedTrek.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#6E7042] font-semibold">
                    Expedition Details & Itinerary
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setDetailedTrek(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-autumn-bark/10 text-autumn-bark/60 hover:text-autumn-bark transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
              
              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 bg-[#EFE8D6]/40 p-4 rounded-xl border border-autumn-bark/5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-autumn-bark/50 tracking-wider">Duration</span>
                  <span className="font-outfit text-sm font-semibold text-autumn-bark">{detailedTrek.duration}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-autumn-bark/50 tracking-wider">Difficulty</span>
                  <span className="font-outfit text-sm font-semibold text-autumn-maple uppercase">{detailedTrek.difficulty}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-autumn-bark/50 tracking-wider">Altitude</span>
                  <span className="font-outfit text-sm font-semibold text-autumn-bark">{detailedTrek.altitude || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-autumn-bark/50 tracking-wider">Location</span>
                  <span className="font-outfit text-sm font-semibold text-autumn-bark">{detailedTrek.location || 'Western Ghats'}</span>
                </div>
              </div>

              {/* Day-by-Day Itinerary */}
              <div>
                <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-maple mb-3 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Day-by-Day Plan
                </h4>
                <div className="space-y-4 border-l-2 border-[#6E7042]/20 pl-4 ml-2 animate-in fade-in duration-200">
                  <div className="relative">
                    <span className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-[#6E7042] border-2 border-autumn-mist"></span>
                    <span className="font-outfit text-xs font-bold uppercase text-[#6E7042]">Day 1: Base Camp Ascent</span>
                    <p className="text-xs text-autumn-bark/80 mt-1">
                      Register with forest guards, ascend through shola forest patches and misty ridges to the wilderness base camp. Setup camp and enjoy a warm local dinner.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-[#6E7042] border-2 border-autumn-mist"></span>
                    <span className="font-outfit text-xs font-bold uppercase text-[#6E7042]">Day 2: Peak Bid & Descent</span>
                    <p className="text-xs text-autumn-bark/80 mt-1">
                      Summit bid at sunrise to witness panoramic views above the clouds. Retrace steps back to the trailhead, collect ecotourism certifications, and depart.
                    </p>
                  </div>
                </div>

                {detailedTrek && detailedTrek.itineraryDocUrl && (
                  <a 
                    href={detailedTrek.itineraryDocUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 my-3 bg-autumn-bark/10 hover:bg-autumn-bark/20 text-autumn-bark font-semibold rounded-xl text-sm transition-colors border border-autumn-bark/20"
                  >
                    <span>📄</span> View / Download Full Itinerary (PDF / Doc) ↗
                  </a>
                )}
              </div>

              {/* Inclusions */}
              <div>
                <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-maple mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Inclusions
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {((detailedTrek && detailedTrek.inclusion) || []).map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-autumn-bark/90">
                      <Check className="h-4.5 w-4.5 text-autumn-maple shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Packing List */}
              <div>
                <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-maple mb-2 flex items-center gap-1.5">
                  <Info className="h-4 w-4" /> Recommended Packing List
                </h4>
                <ul className="list-disc pl-5 text-xs text-autumn-bark/80 space-y-1">
                  <li>20L to 30L rugged backpack with rain cover</li>
                  <li>Trekking shoes with solid grip (Decathlon Quechua recommended)</li>
                  <li>Re-usable water bottle (minimum 2 Litres)</li>
                  <li>Rain poncho or windproof jacket for wet weather</li>
                  <li>Headlamp or lightweight torch (with spare batteries)</li>
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#EFE8D6]/40 p-5 border-t border-autumn-bark/10 flex gap-3 shrink-0">
              <button 
                onClick={() => setDetailedTrek(null)}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg border border-autumn-bark/20 hover:bg-autumn-bark/5 text-autumn-bark/80 font-outfit text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close Itinerary
              </button>
              <button 
                onClick={() => {
                  const trek = detailedTrek;
                  setDetailedTrek(null);
                  handleBookNow(trek);
                }}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg bg-[#C1571F] hover:bg-[#a44717] text-white font-outfit text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                Book This Trek
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONDITIONAL AUTHENTICATION MODAL COMPONENT */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(newUser) => {
          setUser(newUser);
          setUserRole(newUser.role);
          setContextUserRole(newUser.role);
          setName(newUser.name);
          setEmail(newUser.email);
          setIsAuthModalOpen(false);
          
          if (newUser.role === 'developer') {
            window.location.hash = '#dev-ops';
          } else if (newUser.role === 'admin') {
            window.location.hash = '#admin';
          } else {
            if (pendingAction) {
              executeAction(pendingAction);
              setPendingAction(null);
            } else {
              setIsDashboardOpen(true);
            }
          }
        }}
      />

      {/* CUSTOMER PROFILE & BOOKING HISTORY DASHBOARD */}
      <UserDashboard 
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={user}
        handleLogout={handleLogout}
        dashboardTab={dashboardTab}
        setDashboardTab={setDashboardTab}
        expeditionRecords={expeditionRecords}
        setExpeditionRecords={setExpeditionRecords}
        walletBalance={walletBalance}
        walletTransactions={walletTransactions}
        onConfirmCancellation={handleConfirmCancellation}
        profileData={profileData}
        setProfileData={setProfileData}
        isSavingProfile={isSavingProfile}
        onSaveProfile={async (e) => {
          e.preventDefault();
          if (!user || !user.uid) return;
          setIsSavingProfile(true);
          try {
            await setDoc(doc(db, 'users', user.uid), {
              profile: {
                fullName: profileData.fullName || '',
                mobile: profileData.mobile || '',
                bloodGroup: profileData.bloodGroup || '',
                emergencyContact: profileData.emergencyContact || '',
                medicalConditions: profileData.medicalConditions || ''
              }
            }, { merge: true });
          } catch (err) {
            console.warn('Profile save error:', err.message);
          } finally {
            setIsSavingProfile(false);
          }
        }}
      />

      {/* DEVELOPER INDICATOR BANNER */}
      {devBanner}

    </div>
  );
}
