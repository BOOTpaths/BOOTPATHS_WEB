import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  LogOut, 
  KeyRound, 
  ShieldAlert, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Mountain, 
  Tag, 
  AlertTriangle,
  Lock,
  Mail,
  Search,
  CheckCircle2,
  Eye,
  Upload,
  Phone,
  Compass
} from 'lucide-react';

const BADGE_OPTIONS = [
  { label: 'FILLING FAST!', color: 'bg-autumn-rhodo/20 text-autumn-rhodo border-autumn-rhodo/40' },
  { label: 'PREMIUM TRAIL', color: 'bg-autumn-amber/20 text-autumn-amber border-autumn-amber/40' },
  { label: 'LIMITED SLOTS', color: 'bg-autumn-maple/20 text-autumn-maple border-autumn-maple/40' },
  { label: 'SOLD OUT', color: 'bg-stone-500/20 text-stone-400 border-stone-500/40' },
];

const INCLUSION_OPTIONS = [
  'Quechua Gear',
  'Forest Permits',
  'Certified Lead',
  'Meals Included',
  'Wilderness First Aid',
  'Tents & Sleeping Bags',
  'Wildlife Warden Permit'
];

export default function AdminConsole({ 
  treks, 
  setTreks, 
  blogs = [], 
  setBlogs, 
  isCareersEnabled, 
  setIsCareersEnabled, 
  leadApplications = [], 
  setLeadApplications, 
  onReturnToSite 
}) {
  // Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'forgot_password'
  
  // Auth Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // CRUD State
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrek, setEditingTrek] = useState(null);
  const [deleteConfirmTrek, setDeleteConfirmTrek] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [viewingBlog, setViewingBlog] = useState(null);

  // Trek image local upload selectors
  const [isAdminDragOver, setIsAdminDragOver] = useState(false);
  const trekFileInputRef = useRef(null);

  const handleTrekFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdminDragOver = (e) => {
    e.preventDefault();
    setIsAdminDragOver(true);
  };

  const handleAdminDragLeave = () => {
    setIsAdminDragOver(false);
  };

  const handleAdminDrop = (e) => {
    e.preventDefault();
    setIsAdminDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };



  // Check persistent login on mount
  useEffect(() => {
    const activeSession = localStorage.getItem('bootpaths_admin_active');
    if (activeSession === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Handle Login Submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);

    setTimeout(() => {
      if (emailInput === 'admin@bootpaths.com' && passwordInput === 'BooTpaths@Admin') {
        localStorage.setItem('bootpaths_admin_active', 'true');
        setIsAdminLoggedIn(true);
        setIsSubmittingAuth(false);
      } else {
        setAuthError('Invalid administrator credentials provided.');
        setIsSubmittingAuth(false);
      }
    }, 600);
  };

  // Handle Password Recovery Request
  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);

    setTimeout(() => {
      if (emailInput.toLowerCase() === 'admin@bootpaths.com') {
        setResetSuccess(true);
      } else {
        setAuthError('Admin account not found for this email address.');
      }
      setIsSubmittingAuth(false);
    }, 800);
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('bootpaths_admin_active');
    setIsAdminLoggedIn(false);
    setEmailInput('');
    setPasswordInput('');
    setAuthView('login');
  };

  const [newBatchDateInput, setNewBatchDateInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    altitude: '',
    duration: '2 Days / 1 Night',
    difficulty: 'Moderate',
    price: '',
    originalPrice: '',
    slotsLeft: '10',
    tag: 'FILLING FAST!',
    description: '',
    image: '',
    inclusion: ['Quechua Gear', 'Forest Permits', 'Certified Lead'],
    batchDates: ['Jul 11, 2026', 'Jul 18, 2026', 'Jul 25, 2026']
  });

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTrek(null);
    setFormData({
      title: '',
      location: '',
      altitude: '',
      duration: '2 Days / 1 Night',
      difficulty: 'Moderate',
      price: '',
      originalPrice: '',
      slotsLeft: '10',
      tag: 'FILLING FAST!',
      description: '',
      image: '',
      inclusion: ['Quechua Gear', 'Forest Permits', 'Certified Lead'],
      batchDates: ['Jul 11, 2026', 'Jul 18, 2026', 'Jul 25, 2026']
    });
    setNewBatchDateInput('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (trek) => {
    setEditingTrek(trek);
    const existingDates = trek.batchDates || trek.dates || ['Jul 11, 2026', 'Jul 18, 2026', 'Jul 25, 2026'];
    setFormData({
      title: trek.title || '',
      location: trek.location || '',
      altitude: trek.altitude || '',
      duration: trek.duration || '',
      difficulty: trek.difficulty || 'Moderate',
      price: trek.price || '',
      originalPrice: trek.originalPrice || '',
      slotsLeft: trek.slotsLeft !== undefined ? String(trek.slotsLeft) : '0',
      tag: trek.tag || 'FILLING FAST!',
      description: trek.description || '',
      image: trek.image || '',
      inclusion: trek.inclusion || [],
      batchDates: existingDates
    });
    setNewBatchDateInput('');
    setIsModalOpen(true);
  };

  // Add Batch Date
  const handleAddBatchDate = async () => {
    if (!newBatchDateInput) return;
    const parsedDate = new Date(newBatchDateInput + 'T00:00:00');
    const formattedDate = parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (!formData.batchDates.includes(formattedDate)) {
      const updatedDates = [...formData.batchDates, formattedDate];
      setFormData(prev => ({
        ...prev,
        batchDates: updatedDates
      }));

      if (editingTrek && editingTrek.id) {
        try {
          await updateDoc(doc(db, 'packages', editingTrek.id), {
            batchDates: updatedDates,
            dates: updatedDates
          });
        } catch (err) {
          console.warn('Live Firestore update notice:', err.message);
        }
      }
    }
    setNewBatchDateInput('');
  };

  // Remove Batch Date
  const handleRemoveBatchDate = async (indexToRemove) => {
    const updatedDates = formData.batchDates.filter((_, idx) => idx !== indexToRemove);
    setFormData(prev => ({
      ...prev,
      batchDates: updatedDates
    }));

    if (editingTrek && editingTrek.id) {
      try {
        await updateDoc(doc(db, 'packages', editingTrek.id), {
          batchDates: updatedDates,
          dates: updatedDates
        });
      } catch (err) {
        console.warn('Live Firestore update notice:', err.message);
      }
    }
  };

  // Save (Create or Update) Trek
  const handleSaveTrek = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload a banner image for the trek package.');
      return;
    }
    const tagMatch = BADGE_OPTIONS.find(b => b.label === formData.tag);
    const tagColor = tagMatch ? tagMatch.color : 'bg-autumn-maple/20 text-autumn-maple border-autumn-maple/40';

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      slotsLeft: Number(formData.slotsLeft),
      tagColor,
      batchDates: formData.batchDates && formData.batchDates.length > 0 ? formData.batchDates : ['Jul 11, 2026', 'Jul 18, 2026', 'Jul 25, 2026'],
      dates: formData.batchDates && formData.batchDates.length > 0 ? formData.batchDates : ['Jul 11, 2026', 'Jul 18, 2026', 'Jul 25, 2026']
    };

    if (editingTrek) {
      // UPDATE
      setTreks(prev => prev.map(t => t.id === editingTrek.id ? { ...t, ...payload } : t));
      try {
        await setDoc(doc(db, 'packages', editingTrek.id), payload, { merge: true });
      } catch (err) {
        console.warn('Firestore package update notice:', err.message);
      }
    } else {
      // CREATE
      const newId = `trek-${Date.now()}`;
      const newTrek = { id: newId, ...payload };
      setTreks(prev => [newTrek, ...prev]);
      try {
        await setDoc(doc(db, 'packages', newId), payload);
      } catch (err) {
        console.warn('Firestore package create notice:', err.message);
      }
    }
    setIsModalOpen(false);
  };

  // Delete Trek
  const handleConfirmDelete = () => {
    if (deleteConfirmTrek) {
      setTreks(prev => prev.filter(t => t.id !== deleteConfirmTrek.id));
      setDeleteConfirmTrek(null);
    }
  };

  // Blog Moderation
  const handleApproveBlog = async (id) => {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: 'published' } : b));
    try {
      await updateDoc(doc(db, 'blogs', id), { status: 'published' });
    } catch (err) {
      console.warn('Firestore Blog Approve Notice:', err.message);
    }
  };

  const handleRejectBlog = async (id) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (err) {
      console.warn('Firestore Blog Reject Notice:', err.message);
    }
  };

  // Lead Applications Moderation
  const handleMarkContacted = async (id) => {
    setLeadApplications(prev => prev.map(l => l.id === id ? { ...l, status: 'Contacted' } : l));
    try {
      await updateDoc(doc(db, 'leadApplications', id), { status: 'Contacted' });
    } catch (err) {
      console.warn('Firestore Lead Status Notice:', err.message);
    }
  };

  const handleApproveLead = async (id) => {
    setLeadApplications(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
    try {
      await updateDoc(doc(db, 'leadApplications', id), { status: 'Approved' });
    } catch (err) {
      console.warn('Firestore Lead Status Notice:', err.message);
    }
  };

  const handleDeleteApplication = async (id) => {
    setLeadApplications(prev => prev.filter(l => l.id !== id));
    try {
      await deleteDoc(doc(db, 'leadApplications', id));
    } catch (err) {
      console.warn('Firestore Lead Delete Notice:', err.message);
    }
  };

  const handleToggleCareersEnabled = async () => {
    const nextVal = !isCareersEnabled;
    setIsCareersEnabled(nextVal);
    try {
      await setDoc(doc(db, 'appSettings', 'global'), { careersEnabled: nextVal }, { merge: true });
    } catch (err) {
      console.warn('Firestore Careers Toggle Notice:', err.message);
    }
  };

  // Toggle inclusion item in form
  const toggleInclusion = (item) => {
    setFormData(prev => {
      const exists = prev.inclusion.includes(item);
      return {
        ...prev,
        inclusion: exists 
          ? prev.inclusion.filter(i => i !== item)
          : [...prev.inclusion, item]
      };
    });
  };

  // Filtered Treks
  const filteredTreks = (treks || []).filter(t => 
    (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // UNAUTHENTICATED: LOGIN / RESET SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-autumn-mist flex items-center justify-center p-4 text-autumn-bark relative overflow-hidden font-sans">
        {/* Background glow graphics */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-autumn-maple/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-autumn-rhodo/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-autumn-maple/30 bg-[#F3ECDD]/80 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#EFE8D6]/80 p-6 border-b border-autumn-bark/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="assets/logo-dark.png" 
                alt="BOOTpaths" 
                className="h-8 w-auto object-contain"
              />
              <div className="h-px w-4 bg-autumn-bark/20 rotate-90"></div>
              <div>
                <span className="text-[10px] text-autumn-bark/60 block font-mono uppercase font-bold tracking-wider">Console Login</span>
              </div>
            </div>
            {onReturnToSite && (
              <button 
                onClick={onReturnToSite}
                className="text-xs text-autumn-bark/60 hover:text-autumn-bark flex items-center gap-1 transition-colors"
                title="Return to Main Site"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Site</span>
              </button>
            )}
          </div>

          <div className="p-6 md:p-8">
            {authView === 'login' ? (
              /* LOGIN VIEW */
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <h3 className="font-outfit text-xl font-bold text-autumn-bark">Administrator Sign In</h3>
                  <p className="text-xs text-autumn-bark/70 mt-1">
                    Enter authorized operations credentials to manage active trek inventory.
                  </p>
                </div>

                {authError && (
                  <div className="rounded-xl border border-autumn-rhodo/40 bg-autumn-rhodo/10 p-3.5 text-xs text-autumn-rhodo flex items-center gap-2.5">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1.5">
                    Admin Email
                  </label>
                  <div className="relative">
                    <input 
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="admin@bootpaths.com"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/70 text-xs text-autumn-bark placeholder-autumn-bark/40 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-autumn-bark/40 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70">
                      Password
                    </label>
                    <button 
                      type="button"
                      onClick={() => { setAuthView('forgot_password'); setAuthError(''); }}
                      className="text-[10px] font-bold uppercase tracking-wider text-autumn-amber hover:text-autumn-maple transition-colors"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/70 text-xs text-autumn-bark placeholder-autumn-bark/40 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-autumn-bark/40 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full h-11 rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-widest text-[#F3ECDD] hover:bg-[#a44717] transition-all focus:outline-none focus:ring-2 focus:ring-autumn-maple flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingAuth ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-950 border-t-transparent"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>Authorize & Access Console</>
                  )}
                </button>
              </form>
            ) : (
              /* FORGOT PASSWORD VIEW */
              <form onSubmit={handlePasswordResetSubmit} className="space-y-5">
                <div>
                  <h3 className="font-outfit text-xl font-bold text-autumn-bark">Password Reset Pipeline</h3>
                  <p className="text-xs text-autumn-bark/70 mt-1">
                    Request an administrator account recovery link.
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-400 flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Recovery Link Sent!</span>
                        <span className="text-autumn-bark/80 block mt-1">
                          A password recovery link has been dispatched to <strong>{emailInput}</strong>. Please check your admin mailbox.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAuthView('login'); setResetSuccess(false); setAuthError(''); }}
                      className="w-full h-10 rounded-xl border border-autumn-bark/20 bg-[#EFE8D6]/60 font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark hover:bg-[#EFE8D6] transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Return to Login
                    </button>
                  </div>
                ) : (
                  <>
                    {authError && (
                      <div className="rounded-xl border border-autumn-rhodo/40 bg-autumn-rhodo/10 p-3.5 text-xs text-autumn-rhodo flex items-center gap-2.5">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1.5">
                        Registered Admin Email
                      </label>
                      <div className="relative">
                        <input 
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="admin@bootpaths.com"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/70 text-xs text-autumn-bark placeholder-autumn-bark/40 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all"
                        />
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-autumn-bark/40 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingAuth}
                      className="w-full h-11 rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-widest text-[#F3ECDD] hover:bg-[#a44717] transition-all focus:outline-none focus:ring-2 focus:ring-autumn-maple flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmittingAuth ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-950 border-t-transparent"></div>
                          Sending Link...
                        </>
                      ) : (
                        <>Send Recovery Link</>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthView('login'); setAuthError(''); }}
                      className="w-full text-center text-xs text-autumn-bark/60 hover:text-autumn-bark transition-colors pt-2 block"
                    >
                      ← Return to Login
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED: FULL ADMIN PORTAL
  return (
    <div className="min-h-screen bg-autumn-mist text-autumn-bark font-sans">
      
      {/* 1. PERSISTENT ADMIN STATUS NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-autumn-bark/10 bg-[#EFE8D6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-8">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <img 
                src="assets/logo-dark.png" 
                alt="BOOTpaths" 
                className="h-7 w-auto object-contain"
              />
              <span className="text-[10px] text-autumn-bark/60 font-mono uppercase font-bold tracking-wider hidden sm:inline">Console</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-autumn-bark/10 text-xs text-autumn-bark/70">
              <KeyRound className="h-3.5 w-3.5 text-autumn-amber" />
              <span>Admin: <strong className="text-autumn-bark font-mono">admin@bootpaths.com</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onReturnToSite && (
              <button 
                onClick={onReturnToSite}
                className="h-9 px-3 rounded-lg border border-autumn-bark/20 bg-autumn-mist/5 text-xs font-bold uppercase tracking-wider text-autumn-bark hover:bg-autumn-mist/10 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Main Site</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="h-9 px-3 sm:px-4 rounded-lg bg-autumn-rhodo/20 border border-autumn-rhodo/40 text-xs font-bold uppercase tracking-wider text-rose-300 hover:bg-autumn-rhodo/40 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl p-4 sm:p-8 space-y-6">

        {/* Tab Switcher */}
        <div className="flex gap-4 border-b border-autumn-bark/10 pb-1">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'inventory' 
                ? 'border-autumn-maple text-autumn-maple' 
                : 'border-transparent text-autumn-bark/60 hover:text-autumn-bark'
            }`}
          >
            Trek Inventory
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'blogs' 
                ? 'border-autumn-maple text-autumn-maple' 
                : 'border-transparent text-autumn-bark/60 hover:text-autumn-bark'
            }`}
          >
            Community Blogs ({blogs.filter(b => b.status === 'pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'leads' 
                ? 'border-autumn-maple text-autumn-maple' 
                : 'border-transparent text-autumn-bark/60 hover:text-autumn-bark'
            }`}
          >
            Lead Applications ({leadApplications.filter(l => l.status === 'Pending').length} Pending)
          </button>
        </div>

        {activeTab === 'inventory' && (
          <>
            {/* HEADER & ACTION BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F3ECDD]/40 border border-autumn-bark/10 rounded-2xl p-6 backdrop-blur-md">
          <div>
            <h1 className="font-outfit text-2xl sm:text-3xl font-black text-autumn-bark">
              Trek Inventory Management
            </h1>
            <p className="text-xs text-autumn-bark/70 mt-1">
              Create, modify pricing, manage live available slots, or archive active packages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory..."
                className="w-full sm:w-64 h-11 pl-10 pr-4 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark placeholder-autumn-bark/40 focus:outline-none focus:border-autumn-maple"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-autumn-bark/40 pointer-events-none" />
            </div>

            {/* Add Trek Button */}
            <button
              onClick={handleOpenCreateModal}
              className="h-11 px-5 rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-wider text-[#F3ECDD] hover:bg-[#a44717] transition-all flex items-center justify-center gap-2 shadow-lg shadow-autumn-maple/20"
            >
              <Plus className="h-4 w-4" />
              Add New Trek
            </button>
          </div>
        </div>

        {/* INVENTORY STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/60 backdrop-blur-sm">
            <span className="text-xxs uppercase tracking-wider text-autumn-bark/60 font-bold block">Total Packages</span>
            <span className="font-outfit text-2xl font-black text-autumn-bark mt-1 block">{treks.length}</span>
          </div>

          <div className="p-5 rounded-xl border border-autumn-amber/20 bg-autumn-amber/5 backdrop-blur-sm">
            <span className="text-xxs uppercase tracking-wider text-autumn-amber font-bold block">Active Slots Available</span>
            <span className="font-outfit text-2xl font-black text-autumn-amber mt-1 block">
              {treks.reduce((acc, t) => acc + (t.slotsLeft || 0), 0)} Slots
            </span>
          </div>

          <div className="p-5 rounded-xl border border-autumn-maple/20 bg-autumn-maple/5 backdrop-blur-sm">
            <span className="text-xxs uppercase tracking-wider text-autumn-maple font-bold block">Featured High Season Treks</span>
            <span className="font-outfit text-2xl font-black text-autumn-maple mt-1 block">
              {treks.filter(t => t.tag === 'FILLING FAST!').length} Packages
            </span>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-hidden rounded-2xl border border-autumn-bark/10 bg-[#F3ECDD]/70 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-autumn-bark">
              <thead className="bg-[#EFE8D6] text-[10px] font-bold uppercase tracking-wider text-autumn-bark/60 border-b border-autumn-bark/10">
                <tr>
                  <th className="py-4 px-6">Trek Package</th>
                  <th className="py-4 px-4">Location & Alt</th>
                  <th className="py-4 px-4">Difficulty</th>
                  <th className="py-4 px-4">Live Slots</th>
                  <th className="py-4 px-4">Price (₹)</th>
                  <th className="py-4 px-4">Badge Tag</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-autumn-mist/10">
                {filteredTreks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-autumn-bark/50 font-outfit text-sm">
                      No trek packages match your query.
                    </td>
                  </tr>
                ) : (
                  (filteredTreks || []).map((trek) => (
                    <tr key={trek.id} className="hover:bg-[#EFE8D6]/40 transition-colors">
                      {/* Title & Image */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={trek.image} 
                            alt={trek.title}
                            className="h-10 w-10 rounded-lg object-cover border border-autumn-bark/10 shrink-0" 
                          />
                          <div>
                            <span className="font-outfit text-sm font-bold text-autumn-bark block">{trek.title}</span>
                            <span className="text-xxs text-autumn-bark/60 block">{trek.duration}</span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1 text-autumn-bark/80">
                            <MapPin className="h-3 w-3 text-autumn-amber" />
                            {trek.location}
                          </span>
                          <span className="text-xxs text-autumn-bark/50 block font-mono">
                            {trek.altitude}
                          </span>
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xxs font-bold uppercase tracking-wider bg-autumn-mist/10 border border-autumn-bark/20">
                          {trek.difficulty}
                        </span>
                      </td>

                      {/* Slots */}
                      <td className="py-4 px-4">
                        <span className={`font-outfit text-sm font-bold ${trek.slotsLeft <= 4 ? 'text-autumn-rhodo' : 'text-autumn-amber'}`}>
                          {trek.slotsLeft} Left
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-outfit text-sm font-black text-autumn-maple block">₹{trek.price?.toLocaleString()}</span>
                          {trek.originalPrice && (
                            <span className="text-xxs text-autumn-bark/40 line-through block">₹{trek.originalPrice?.toLocaleString()}</span>
                          )}
                        </div>
                      </td>

                      {/* Badge Tag */}
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${trek.tagColor || 'bg-autumn-maple/20 text-autumn-maple border-autumn-maple/40'}`}>
                          {trek.tag}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(trek)}
                            className="h-8 w-8 rounded-lg bg-autumn-mist/10 hover:bg-autumn-maple hover:text-[#F3ECDD] text-autumn-bark transition-all flex items-center justify-center"
                            title="Edit Package"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmTrek(trek)}
                            className="h-8 w-8 rounded-lg bg-autumn-rhodo/20 border border-autumn-rhodo/40 text-rose-300 hover:bg-autumn-rhodo hover:text-white transition-all flex items-center justify-center"
                            title="Delete Package"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}

    {activeTab === 'blogs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Stats Banner */}
            <div className="bg-[#F3ECDD]/40 border border-autumn-bark/10 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-outfit text-xl sm:text-2xl font-black text-autumn-bark">
                  Community Blogs Moderation
                </h1>
                <p className="text-xs text-autumn-bark/70 mt-1">
                  Approve, publish, or reject trail stories and articles submitted by explorers.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-autumn-maple/10 border border-autumn-maple/35 text-autumn-maple rounded-xl text-xs font-bold font-outfit">
                  {blogs.filter(b => b.status === 'pending').length} Pending Review
                </div>
                <div className="px-4 py-2 bg-autumn-amber/10 border border-autumn-amber/35 text-[#C1571F] rounded-xl text-xs font-bold font-outfit">
                  {blogs.filter(b => b.status === 'published').length} Published
                </div>
              </div>
            </div>

            {/* Moderation Table */}
            <div className="rounded-2xl border border-autumn-bark/10 bg-[#EFE8D6]/30 overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-autumn-bark">
                  <thead className="bg-[#EFE8D6] text-xxs uppercase tracking-wider text-autumn-bark/60 font-bold border-b border-autumn-bark/15">
                    <tr>
                      <th className="py-4 px-5">Cover & Title</th>
                      <th className="py-4 px-5">Author</th>
                      <th className="py-4 px-5">Category</th>
                      <th className="py-4 px-5">Date</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-autumn-bark/10">
                    {(blogs || []).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-autumn-bark/50">
                          No blog posts found in database.
                        </td>
                      </tr>
                    ) : (
                      (blogs || []).map((post) => (
                        <tr key={post.id} className="hover:bg-[#EFE8D6]/40 transition-colors">
                          <td className="py-4 px-5 font-medium">
                            <div className="flex items-center gap-3">
                              <img 
                                src={post.coverUrl} 
                                alt={post.title} 
                                className="h-10 w-16 object-cover rounded-lg border border-autumn-bark/10 bg-stone-200 shrink-0" 
                              />
                              <div className="max-w-xs sm:max-w-sm">
                                <span className="font-outfit text-sm font-bold text-autumn-bark block line-clamp-1">
                                  {post.title}
                                </span>
                                <span className="text-[10px] text-autumn-bark/60 block line-clamp-1 mt-0.5">
                                  {post.content}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <div>
                              <span className="font-semibold block text-autumn-bark">{post.author}</span>
                              <span className="text-[9px] uppercase tracking-wider text-[#E3A21E] font-bold block mt-0.5">
                                {post.authorBadge}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="inline-block rounded-full bg-autumn-maple/10 border border-autumn-maple/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-autumn-maple">
                              {post.category}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-autumn-bark/70 font-semibold">{post.date}</td>
                          <td className="py-4 px-5">
                            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              post.status === 'published' 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' 
                                : 'bg-[#E3A21E]/10 border-[#E3A21E]/30 text-[#E3A21E]'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              {/* Preview Action */}
                              <button 
                                onClick={() => setViewingBlog(post)}
                                className="h-8 w-8 rounded-full border border-autumn-bark/20 bg-autumn-mist/5 flex items-center justify-center hover:bg-autumn-mist/10 text-autumn-bark transition-all"
                                title="Preview Full Article"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>

                              {/* Approve Action */}
                              {post.status === 'pending' && (
                                <button 
                                  onClick={() => handleApproveBlog(post.id)}
                                  className="h-8 w-8 rounded-full border border-[#6E7042]/30 bg-[#6E7042]/10 flex items-center justify-center hover:bg-[#6E7042]/20 text-[#6E7042] transition-all"
                                  title="Approve & Publish"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {/* Reject/Delete Action */}
                              <button 
                                onClick={() => handleRejectBlog(post.id)}
                                className="h-8 w-8 rounded-full border border-[#8C2B2A]/30 bg-[#8C2B2A]/10 flex items-center justify-center hover:bg-[#8C2B2A]/20 text-[#8C2B2A] transition-all"
                                title="Reject & Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. LEAD CAREERS APPLICATIONS MANAGEMENT */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Global Settings Toggle Switch */}
            <div className="bg-[#F3ECDD]/40 border border-autumn-bark/10 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-outfit text-xl sm:text-2xl font-black text-autumn-bark">
                  Lead Careers Management
                </h1>
                <p className="text-xs text-autumn-bark/70 mt-1">
                  Manage candidate applications, view certifications and resumes, or toggle careers section visibility.
                </p>
              </div>
              
              <div className="flex items-center gap-4 bg-[#EFE8D6]/60 border border-autumn-bark/10 rounded-xl px-4 py-2 shrink-0">
                <span className="text-[10px] font-bold text-autumn-bark uppercase tracking-wider">
                  Enable Careers Section
                </span>
                <button
                  type="button"
                  onClick={handleToggleCareersEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isCareersEnabled ? 'bg-[#C1571F]' : 'bg-stone-500'
                  }`}
                  aria-label="Toggle Careers Section Visibility"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isCareersEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Metrics counter card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-autumn-bark/10 bg-[#EFE8D6]/60 backdrop-blur-sm">
                <span className="text-xxs uppercase tracking-wider text-autumn-bark/60 font-bold block">Total Applications Received</span>
                <span className="font-outfit text-2xl font-black text-autumn-bark mt-1 block">
                  {leadApplications.length} Lead Applications
                </span>
              </div>
              <div className="p-5 rounded-xl border border-autumn-amber/20 bg-autumn-amber/5 backdrop-blur-sm">
                <span className="text-xxs uppercase tracking-wider text-[#C1571F] font-bold block">Pending Review</span>
                <span className="font-outfit text-2xl font-black text-[#C1571F] mt-1 block">
                  {leadApplications.filter(l => l.status === 'Pending').length} Candidates
                </span>
              </div>
              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
                <span className="text-xxs uppercase tracking-wider text-emerald-400 font-bold block">Approved Leads</span>
                <span className="font-outfit text-2xl font-black text-emerald-400 mt-1 block">
                  {leadApplications.filter(l => l.status === 'Approved').length} Guides
                </span>
              </div>
            </div>

            {/* Applications Table */}
            <div className="rounded-2xl border border-autumn-bark/10 bg-[#F3ECDD]/70 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-autumn-bark">
                  <thead className="bg-[#EFE8D6] text-xxs uppercase tracking-wider text-autumn-bark/60 font-bold border-b border-autumn-bark/15">
                    <tr>
                      <th className="py-4 px-5">Candidate Name</th>
                      <th className="py-4 px-5">Contact (WhatsApp)</th>
                      <th className="py-4 px-5">Experience & Credentials</th>
                      <th className="py-4 px-5">Regions</th>
                      <th className="py-4 px-5">Date</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-autumn-bark/10">
                    {(leadApplications || []).length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-autumn-bark/50">
                          No expedition lead applications received yet.
                        </td>
                      </tr>
                    ) : (
                      (leadApplications || []).map((app) => (
                        <tr key={app.id} className="hover:bg-[#EFE8D6]/40 transition-colors">
                          {/* Full Name & Resume */}
                          <td className="py-4 px-5 font-semibold">
                            <div>
                              <span className="font-outfit text-sm font-bold text-autumn-bark block">{app.fullName}</span>
                              <span className="text-[10px] text-autumn-bark/50 block mt-0.5">{app.resumeFilename}</span>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-4 px-5 font-medium font-mono text-autumn-bark/80">
                            {app.phone}
                          </td>

                          {/* Experience */}
                          <td className="py-4 px-5">
                            <p className="max-w-xs text-xxs text-autumn-bark/80 leading-relaxed line-clamp-2" title={app.experience}>
                              {app.experience}
                            </p>
                          </td>

                          {/* Regions */}
                          <td className="py-4 px-5">
                            <span className="text-[10px] font-bold text-[#E3A21E] bg-[#E3A21E]/10 border border-[#E3A21E]/20 px-2 py-0.5 rounded uppercase">
                              {app.regions}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-4 px-5 text-autumn-bark/60">
                            {app.date}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-5">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${
                              app.status === 'Approved'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : app.status === 'Contacted'
                                ? 'bg-autumn-amber/10 border-autumn-amber/30 text-autumn-amber'
                                : 'bg-autumn-rhodo/10 border-autumn-rhodo/30 text-autumn-rhodo'
                            }`}>
                              {app.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-2 shrink-0">
                              {/* Resume Download */}
                              <a
                                href={app.resumeUrl}
                                download={app.resumeFilename}
                                className="h-8 px-2.5 rounded-lg border border-autumn-bark/20 bg-autumn-mist/5 flex items-center justify-center hover:bg-autumn-mist/10 text-autumn-bark text-[10px] font-bold uppercase tracking-wider transition-all gap-1"
                                title="Download CV File"
                              >
                                <Upload className="h-3.5 w-3.5 rotate-180" />
                                <span>CV</span>
                              </a>

                              {/* Mark as Contacted */}
                              {app.status === 'Pending' && (
                                <button
                                  onClick={() => handleMarkContacted(app.id)}
                                  className="h-8 w-8 rounded-lg border border-autumn-amber/30 bg-autumn-amber/10 flex items-center justify-center hover:bg-autumn-amber/20 text-[#C1571F] transition-all"
                                  title="Mark as Contacted"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {/* Approve candidate */}
                              {app.status !== 'Approved' && (
                                <button
                                  onClick={() => handleApproveLead(app.id)}
                                  className="h-8 w-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 text-emerald-400 transition-all"
                                  title="Approve Expedition Lead"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {/* Delete Application */}
                              <button
                                onClick={() => handleDeleteApplication(app.id)}
                                className="h-8 w-8 rounded-lg border border-autumn-rhodo/30 bg-autumn-rhodo/10 flex items-center justify-center hover:bg-autumn-rhodo/20 text-autumn-rhodo transition-all"
                                title="Delete Candidate Application"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* BLOG PREVIEW MODAL */}
      {viewingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-autumn-maple/20 bg-[#F3ECDD] text-autumn-bark shadow-2xl animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#EFE8D6] p-5 flex justify-between items-center border-b border-autumn-bark/10 shrink-0">
              <div>
                <h3 className="font-outfit text-base font-bold uppercase tracking-wider text-autumn-bark">
                  Preview Story
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-[#6E7042] font-semibold">
                  {viewingBlog.category} • Submitted by {viewingBlog.author}
                </span>
              </div>
              <button 
                onClick={() => setViewingBlog(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-autumn-bark/10 text-autumn-bark/60 hover:text-autumn-bark transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm leading-relaxed">
              <img 
                src={viewingBlog.coverUrl} 
                alt={viewingBlog.title} 
                className="h-48 w-full object-cover rounded-xl border border-autumn-bark/10" 
              />
              <h2 className="font-outfit text-xl font-bold">{viewingBlog.title}</h2>
              <div className="whitespace-pre-line text-xs text-autumn-bark/85">
                {viewingBlog.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#EFE8D6]/40 p-5 border-t border-autumn-bark/10 flex gap-3 shrink-0">
              <button 
                onClick={() => setViewingBlog(null)}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg border border-autumn-bark/20 hover:bg-autumn-bark/5 text-autumn-bark/80 font-outfit text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close Preview
              </button>
              {viewingBlog.status === 'pending' && (
                <button 
                  onClick={() => {
                    handleApproveBlog(viewingBlog.id);
                    setViewingBlog(null);
                  }}
                  className="flex-1 h-11 inline-flex items-center justify-center rounded-lg bg-[#6E7042] hover:bg-[#5b5d36] text-[#F3ECDD] font-outfit text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Approve & Publish
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-autumn-mist/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-autumn-maple/30 bg-[#F3ECDD]/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 text-autumn-bark">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-autumn-bark/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-autumn-maple/20 text-autumn-maple flex items-center justify-center border border-autumn-maple/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-outfit text-xl font-bold">
                    {editingTrek ? 'Update Trek Package' : 'Create New Trek Package'}
                  </h3>
                  <span className="text-xxs text-autumn-bark/60 block">Configure inventory pricing and parameters</span>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-[#EFE8D6] flex items-center justify-center text-autumn-bark/60 hover:text-autumn-bark transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTrek} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                    Trek Title
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Netravathi Peak Trek"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                    Location
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Chikkamagaluru, Karnataka"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                    Altitude (m / ft)
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.altitude}
                    onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}
                    placeholder="e.g. 1,520 m / 4,986 ft"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                    Duration
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 2 Days / 1 Night"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                    Offer Price (₹)
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3499"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                    Original Price (₹)
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="4499"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                    Available Live Slots
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.slotsLeft}
                    onChange={(e) => setFormData({ ...formData, slotsLeft: e.target.value })}
                    placeholder="10"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                    Badge Tag
                  </label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple"
                  >
                    {BADGE_OPTIONS.map(b => (
                      <option key={b.label} value={b.label} className="bg-[#EFE8D6] text-autumn-bark">
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1.5">
                  Trek Banner Image
                </label>
                
                {formData.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-autumn-maple/20 bg-[#3A2A1E]/5 p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={formData.image} 
                        alt="Trek Preview" 
                        className="h-14 w-24 object-cover rounded-lg border border-autumn-maple/10"
                      />
                      <div>
                        <span className="text-xs font-semibold text-autumn-bark">Banner Selected</span>
                        <span className="text-[10px] text-autumn-bark/50 block">Ready to save</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="h-8 w-8 rounded-lg bg-[#8C2B2A]/10 hover:bg-[#8C2B2A] text-[#8C2B2A] hover:text-white flex items-center justify-center transition-colors border border-[#8C2B2A]/20"
                      title="Remove Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleAdminDragOver}
                    onDragLeave={handleAdminDragLeave}
                    onDrop={handleAdminDrop}
                    onClick={() => trekFileInputRef.current?.click()}
                    className={`border-2 border-dashed transition-all rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isAdminDragOver 
                        ? 'border-[#C1571F] bg-[#3A2A1E]/10 scale-[0.99]' 
                        : 'border-[#C1571F]/40 bg-[#3A2A1E]/5 hover:border-[#C1571F]'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={trekFileInputRef}
                      onChange={handleTrekFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="h-5 w-5 text-autumn-maple" />
                    <div className="text-xs text-autumn-bark/85 font-medium">
                      Click or drag trek banner photo from local device
                    </div>
                    <span className="text-[9px] text-autumn-bark/40">Supports PNG, JPG, JPEG, WEBP</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-1">
                  Package Summary Description
                </label>
                <textarea 
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed trail summary..."
                  className="w-full p-3 rounded-xl border border-autumn-bark/15 bg-[#EFE8D6]/80 text-xs text-autumn-bark focus:outline-none focus:border-autumn-maple resize-none"
                />
              </div>

              {/* Inclusions checklist */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-2">
                  Package Inclusions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INCLUSION_OPTIONS.map(item => {
                    const isChecked = formData.inclusion.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleInclusion(item)}
                        className={`px-3 py-2 rounded-xl text-xxs font-bold text-left transition-all flex items-center justify-between border ${
                          isChecked 
                            ? 'bg-autumn-maple/20 text-autumn-maple border-autumn-maple/50' 
                            : 'bg-[#EFE8D6]/60 text-autumn-bark/60 border-autumn-bark/10 hover:border-autumn-bark/30'
                        }`}
                      >
                        <span className="truncate pr-1">{item}</span>
                        {isChecked && <Check className="h-3 w-3 shrink-0 text-autumn-maple" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AVAILABLE BATCH DATES MANAGER */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/70 mb-2">
                  Available Batch Dates
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input 
                    type="date"
                    value={newBatchDateInput}
                    onChange={(e) => setNewBatchDateInput(e.target.value)}
                    className="bg-[#EBE3D3] border border-[#3A2A1E]/20 text-[#3A2A1E] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C1571F] flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddBatchDate}
                    className="bg-[#C1571F] text-white font-bold hover:bg-[#a44717] rounded-lg px-4 py-2 text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Batch Date
                  </button>
                </div>

                {/* Active Dates List (Pill Tags) */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {(formData.batchDates || []).length === 0 ? (
                    <span className="text-xxs text-autumn-bark/40 italic">No batch dates added yet. Select a date above.</span>
                  ) : (
                    (formData.batchDates || []).map((dateStr, index) => (
                      <span 
                        key={index} 
                        className="bg-[#3A2A1E] text-[#F3ECDD] rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-[#C1571F]/30"
                      >
                        <Calendar className="h-3 w-3 text-[#C1571F]" />
                        {dateStr}
                        <button
                          type="button"
                          onClick={() => handleRemoveBatchDate(index)}
                          className="hover:text-amber-400 focus:outline-none ml-1 transition-colors"
                          title="Remove batch date"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-autumn-bark/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 px-5 rounded-xl border border-autumn-bark/20 bg-transparent text-xs font-bold uppercase tracking-wider text-autumn-bark hover:bg-autumn-mist/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-wider text-[#F3ECDD] hover:bg-[#a44717] transition-colors shadow-lg shadow-autumn-maple/20"
                >
                  {editingTrek ? 'Save Changes' : 'Publish Trek Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmTrek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-autumn-mist/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-autumn-rhodo/40 bg-[#F3ECDD]/95 backdrop-blur-xl shadow-2xl p-6 text-autumn-bark space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-autumn-rhodo/20 border border-autumn-rhodo/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-outfit text-lg font-bold">Confirm Deletion</h3>
                <span className="text-xs text-autumn-bark/60 block">This action cannot be undone.</span>
              </div>
            </div>

            <p className="text-xs text-autumn-bark/80 bg-[#EFE8D6] p-3.5 rounded-xl border border-autumn-bark/10">
              Are you sure you want to purge <strong>{deleteConfirmTrek.title}</strong> from active inventory?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmTrek(null)}
                className="h-10 px-4 rounded-xl border border-autumn-bark/20 bg-transparent text-xs font-bold uppercase tracking-wider text-autumn-bark hover:bg-autumn-mist/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="h-10 px-5 rounded-xl bg-autumn-rhodo border border-autumn-rhodo/50 font-outfit text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition-colors shadow-lg shadow-autumn-rhodo/30"
              >
                Purge Package
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
