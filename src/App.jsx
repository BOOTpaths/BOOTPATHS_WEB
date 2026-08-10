import { useState, useEffect } from 'react';
import AdminConsole from './components/AdminConsole';
import BlogSection from './components/BlogSection';
import LeadCareers from './components/LeadCareers';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import UserDashboard from './components/UserDashboard';
import AuthModal from './components/AuthModal';
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
  ChevronDown
} from 'lucide-react';

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

const INSTAGRAM_POSTS = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=400&q=80',
    likes: '1,248',
    comments: '42'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=400&q=80',
    likes: '932',
    comments: '18'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
    likes: '2,105',
    comments: '88'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=400&q=80',
    likes: '1,504',
    comments: '31'
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=400&q=80',
    likes: '1,822',
    comments: '56'
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=400&q=80',
    likes: '2,401',
    comments: '94'
  }
];

export default function App() {
  const [treks, setTreks] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [currentHash, setCurrentHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  const [isTermsRoute, setIsTermsRoute] = useState(typeof window !== 'undefined' ? window.location.pathname.endsWith('/terms') : false);
  const [isPrivacyRoute, setIsPrivacyRoute] = useState(typeof window !== 'undefined' ? window.location.pathname.endsWith('/privacy') : false);
  const [isRefundRoute, setIsRefundRoute] = useState(typeof window !== 'undefined' ? window.location.pathname.endsWith('/refund') : false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [expeditionViews, setExpeditionViews] = useState([]);

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
  const [isCareersEnabled, setIsCareersEnabled] = useState(true);
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

  // Subscribe to live appSettings for careers toggle
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'appSettings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setIsCareersEnabled(docSnap.data().careersEnabled ?? true);
      }
    }, (err) => {
      console.warn('AppSettings snapshot error:', err);
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
  const { currentUser, userData, logout, walletBalance: contextWalletBalance } = useAuth();
  const [user, setUser] = useState(null); // { name: 'John Doe', email: 'john@example.com', initials: 'JD', photo: null }
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
  };



  // Keep compatibility with card calls
  const handleBookNow = (trek) => {
    handleTrigger({ type: 'book_trek', payload: trek });
  };

  const handleGetDetails = (trek) => {
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

  // Confirm simulated success payment
  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  // Reset checkout flow
  const handleCloseSuccess = () => {
    setIsRazorpayModalOpen(false);
    setPaymentSuccess(false);

    // Register new confirmed booking record
    const newBookingId = `BP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      id: newBookingId,
      title: selectedTrek.title,
      date: selectedDate || (selectedTrek.batchDates ? selectedTrek.batchDates[0] : (selectedTrek.dates ? selectedTrek.dates[0] : '')),
      trekkers: numTrekkers,
      price: finalPayablePrice,
      status: 'Confirmed'
    };
    setExpeditionRecords(prev => [newRecord, ...prev]);

    // Save booking to Firestore bookings collection
    if (user && user.uid) {
      try {
        setDoc(doc(db, 'bookings', newBookingId), {
          ...newRecord,
          userId: user.uid,
          createdAt: new Date().toISOString()
        }).catch((err) => {
          console.warn('Firestore booking sync notice:', err.message);
        });
      } catch (err) {
        console.warn('Firestore booking sync error:', err.message);
      }
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
    setDashboardTab('bookings');
    setIsDashboardOpen(true); // Open dashboard to view the confirmed booking
  };

  if (isTermsRoute || currentHash === '#/terms' || currentHash === '#terms') {
    return (
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
    );
  }

  if (isPrivacyRoute || currentHash === '#/privacy' || currentHash === '#privacy') {
    return (
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
    );
  }

  if (isRefundRoute || currentHash === '#/refund' || currentHash === '#refund') {
    return (
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
    );
  }

  if (currentHash === '#admin') {
    return (
      <AdminConsole 
        treks={treks} 
        setTreks={setTreks} 
        blogs={blogs}
        setBlogs={setBlogs}
        isCareersEnabled={isCareersEnabled}
        setIsCareersEnabled={setIsCareersEnabled}
        leadApplications={leadApplications}
        setLeadApplications={setLeadApplications}
        expeditionViews={expeditionViews}
        onReturnToSite={() => { window.location.hash = ''; }} 
      />
    );
  }

  const activeHeroMedia = expeditionViews.length > 0 ? expeditionViews : HERO_MEDIA;

  return (
    <div className="min-h-screen bg-autumn-mist text-autumn-bark font-sans selection:bg-autumn-maple selection:text-black">
      
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full border-b border-autumn-bark/10 bg-autumn-mist/70 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 md:px-12">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2A1D14] flex items-center justify-center shadow-md border border-[#C1571F]/30 transition-transform duration-300 group-hover:scale-105">
              <img 
                src="assets/logo-dark.png" 
                alt="BOOTpaths Logo" 
                className="w-full h-full object-cover scale-105" 
              />
            </div>
            <span className="font-outfit text-xl font-extrabold tracking-tight text-[#3A2A1E]">
              BOOT<span className="text-[#C1571F]">paths</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#upcoming-treks" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
              Upcoming Treks
            </a>

            <a href="#advantage" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
              Our Crew
            </a>
            <a href="#community" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
              Community
            </a>
            {isCareersEnabled && (
              <a href="#careers" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
                Careers
              </a>
            )}
          </nav>

          {/* Nav CTA / User Avatar */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2.5 rounded-full border border-autumn-bark/10 bg-[#EFE8D6]/60 p-1.5 pr-4 transition-all duration-200 hover:border-autumn-maple/50 hover:bg-[#EFE8D6] focus:outline-none focus:ring-2 focus:ring-autumn-maple">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-autumn-maple font-outfit text-sm font-bold text-[#F3ECDD] shadow-md">
                    {user.initials}
                  </div>
                  <span className="font-outfit text-xs font-bold text-autumn-bark/80 tracking-wide">{user.name}</span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-autumn-bark/10 bg-[#EFE8D6] p-2 shadow-2xl opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto z-50">
                  <div className="px-3 py-1.5 border-b border-autumn-bark/10 text-[10px] text-autumn-bark/50 uppercase tracking-widest font-bold">
                    {user.email}
                  </div>
                  <button 
                    onClick={() => setIsDashboardOpen(true)}
                    className="w-full text-left rounded px-3 py-2 mt-1 text-xs font-outfit font-bold uppercase tracking-wider text-autumn-maple hover:bg-autumn-maple/10 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left rounded px-3 py-2 mt-1 text-xs font-outfit font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="border border-[#C1571F] text-[#C1571F] hover:bg-[#C1571F] hover:text-[#3A2A1E] font-bold text-xs uppercase tracking-wider rounded-lg px-4 py-2 transition-all duration-200 focus:outline-none"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-autumn-bark/10 bg-[#EFE8D6]/40 text-autumn-bark transition-colors hover:bg-[#EFE8D6] md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full border-b border-autumn-bark/10 bg-autumn-mist/95 px-8 py-6 backdrop-blur-lg md:hidden animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-5">
              <a 
                href="#upcoming-treks" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
              >
                Upcoming Treks
              </a>

              <a 
                href="#advantage" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
              >
                Our Crew
              </a>
              <a 
                href="#community" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
              >
                Community
              </a>
              {isCareersEnabled && (
                <a 
                  href="#careers" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
                >
                  Careers
                </a>
              )}
              <hr className="my-2 border-autumn-bark/10" />
              {user ? (
                <div className="flex flex-col gap-3">
                  {/* User Profile Summary Badge */}
                  <div className="bg-[#EBE3D3] border border-[#3A2A1E]/10 p-4 rounded-2xl flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-autumn-maple font-outfit text-md font-bold text-[#F3ECDD] shadow-md overflow-hidden shrink-0">
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user.initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-outfit text-sm font-bold text-[#3A2A1E] truncate">{user.name}</div>
                      <div className="text-xxs text-[#3A2A1E]/60 truncate">{user.email}</div>
                    </div>
                  </div>
                  {/* My Dashboard Button */}
                  <button 
                    onClick={() => {
                      setIsDashboardOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-[#C1571F] text-white font-bold py-3 w-full rounded-xl text-center font-outfit text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#a44717] focus:outline-none"
                  >
                    My Dashboard
                  </button>
                  {/* Sign Out Button */}
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-[#8C2B2A] font-semibold text-center w-full mt-2 text-xs uppercase tracking-wider transition-colors hover:text-[#732221]"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="flex h-12 w-full items-center justify-center rounded-lg border border-[#C1571F] text-[#C1571F] hover:bg-[#C1571F] hover:text-[#3A2A1E] font-outfit text-sm font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

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
          
          {/* Trust Badge / Decathlon Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F3ECDD]/10 bg-[#3A2A1E]/40 py-1.5 px-4 backdrop-blur-md transition-colors hover:border-autumn-maple/30">
            <span className="flex h-2 w-2 rounded-full bg-autumn-maple animate-ping"></span>
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-[#F3ECDD]/80">
              Official Trekking Partner with <span className="text-autumn-maple font-extrabold">Decathlon</span>
            </span>
          </div>

          {/* Main Slogan */}
          <h1 className="mt-8 font-outfit text-4xl font-black leading-none tracking-tight text-[#F3ECDD] sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg">
            Every Trail <br />
            <span className="bg-gradient-to-r from-autumn-maple via-autumn-amber to-autumn-rhodo bg-clip-text text-transparent">
              Turns You
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
              <span className="text-xxs uppercase tracking-wider text-[#F3ECDD]/60">Certified Guides</span>
            </div>
            <div className="flex flex-col border-r border-[#F3ECDD]/10 pr-4 sm:border-r">
              <span className="font-outfit text-lg font-bold text-autumn-maple">Zero Waste</span>
              <span className="text-xxs uppercase tracking-wider text-[#F3ECDD]/60">Green Trail Policy</span>
            </div>
            <div className="flex flex-col border-r border-[#F3ECDD]/10 pr-4 sm:pr-0 sm:border-r-0 md:border-r md:pr-4">
              <span className="font-outfit text-lg font-bold text-autumn-maple">Premium Gear</span>
              <span className="text-xxs uppercase tracking-wider text-[#F3ECDD]/60">Decathlon Powered</span>
            </div>
            <div className="flex flex-col">
              <span className="font-outfit text-lg font-bold text-autumn-maple">Live Slots</span>
              <span className="text-xxs uppercase tracking-wider text-[#F3ECDD]/60">Instant Approval</span>
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
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-outfit text-xl font-bold text-autumn-bark">
                Decathlon Standards
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-autumn-bark/70">
                Our official alliance guarantees premium Decathlon equipment: Quechua tents, high-grade warm sleeping bags, and reliable safety harnesses. Rigorously benchmarked outdoor gears for every climate.
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                <li className="flex items-center gap-2 text-xs text-autumn-bark/80">
                  <Check className="h-4 w-4 text-autumn-maple shrink-0" />
                  Quechua-approved camp hygiene setup
                </li>
                <li className="flex items-center gap-2 text-xs text-autumn-bark/80">
                  <Check className="h-4 w-4 text-autumn-maple shrink-0" />
                  Gear maintenance audited monthly
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
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-[#6E7042] text-[#3A2A1E] font-outfit text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#6E7042]/10"
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


      {/* 6. INSTAGRAM COMMUNITY FEED */}
      <section id="community" className="relative border-t border-autumn-bark/10 bg-autumn-mist py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center">
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-autumn-maple">
              Community Vibes
            </span>
            <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-autumn-bark sm:text-4xl">
              Catch the Vibe on Instagram
            </h2>
            <a 
              href="https://instagram.com/bootpaths" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-autumn-maple font-outfit text-lg font-bold hover:underline"
            >
              <Instagram className="h-5 w-5" />
              @bootpaths
              <ExternalLink className="h-3.5 w-3.5 text-autumn-bark/50" />
            </a>
          </div>

          {/* Grid Layout Placeholder for UGC Feed */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {(INSTAGRAM_POSTS || []).map((post) => (
              <div 
                key={post.id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-autumn-mist border border-autumn-bark/10 cursor-pointer"
              >
                <img 
                  src={post.imageUrl} 
                  alt="UGC Story Highlight" 
                  className="h-full w-full object-cover object-center transition-transform duration-505 group-hover:scale-105"
                />
                {/* Grid Overlay on Hover */}
                <div className="absolute inset-0 bg-stone-955/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center z-10 gap-2">
                  <Instagram className="h-6 w-6 text-autumn-maple" />
                  <div className="text-center">
                    <span className="text-xs font-bold text-autumn-bark block">♥ {post.likes}</span>
                    <span className="text-xxs text-autumn-bark/70 block mt-0.5">💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decathlon Partner Spotlight */}
          <div className="mt-16 rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/20 p-8 text-center max-w-4xl mx-auto backdrop-blur-sm">
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

      <LeadCareers 
        isCareersEnabled={isCareersEnabled}
      />

      <BlogSection 
        blogs={blogs} 
        onAddBlog={(newBlog) => setBlogs(prev => [newBlog, ...prev])} 
        user={user} 
        onOpenAuth={(action) => {
          setPendingAction(action);
          setIsAuthModalOpen(true);
        }}
      />

      {/* FOOTER */}
      <footer className="border-t border-autumn-bark/10 bg-autumn-mist py-16 px-6 md:px-12 text-autumn-bark/70 text-xs">
        <div className="mx-auto max-w-7xl grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <a href="#" className="flex items-center">
              <img 
                src="assets/logo-dark.png" 
                alt="BOOTpaths" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </a>
            <p className="text-xs text-autumn-bark/50 leading-relaxed max-w-sm">
              We guide adventurers to unexplored peaks and premium trails across Southern India. Fully vetted batches, certified mountain leads, and environment first.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/bootpaths" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full border border-autumn-bark/10 flex items-center justify-center text-autumn-bark/70 hover:text-autumn-maple hover:border-emerald-505/30 transition-colors bg-[#EFE8D6]/20">
                <Instagram className="h-4.5 w-4.5" />
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
              <li>Email: contact@bootpaths.com</li>
              <li>WhatsApp Support: +91 98765 43210</li>
              <li>Instagram DM: @bootpaths</li>
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
            <a href="#admin" className="hover:text-autumn-maple font-bold transition-colors">Admin Console</a>
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
                  src="assets/logo-dark.png" 
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

                    {/* Simulation alert */}
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
                      <div className="flex gap-2">
                        <Info className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xxs font-bold uppercase tracking-wider text-amber-400">Sandbox Environment</h5>
                          <p className="text-xxs text-autumn-bark/70 mt-1">This Razorpay window is simulated. No real currency is exchanged. Click below to mimic a successful transaction.</p>
                        </div>
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
                      onClick={handleConfirmPayment}
                      className="w-full flex h-11 items-center justify-center gap-2 rounded bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-widest text-[#F3ECDD] transition-colors hover:bg-[#a44717]"
                    >
                      Simulate Success Payment
                    </button>
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
          setName(newUser.name);
          setEmail(newUser.email);
          if (pendingAction) {
            executeAction(pendingAction);
            setPendingAction(null);
          } else {
            setIsDashboardOpen(true);
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

    </div>
  );
}
