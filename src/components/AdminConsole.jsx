import React, { useState, useEffect } from 'react';
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
  CheckCircle2
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

export default function AdminConsole({ treks, setTreks, onReturnToSite }) {
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

  // Form State for Add / Edit Trek
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    altitude: '',
    duration: '',
    difficulty: 'Moderate',
    price: '',
    originalPrice: '',
    slotsLeft: '',
    tag: 'FILLING FAST!',
    description: '',
    image: '',
    inclusion: []
  });

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
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      inclusion: ['Quechua Gear', 'Forest Permits', 'Certified Lead']
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (trek) => {
    setEditingTrek(trek);
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
      inclusion: trek.inclusion || []
    });
    setIsModalOpen(true);
  };

  // Save (Create or Update) Trek
  const handleSaveTrek = (e) => {
    e.preventDefault();
    const tagMatch = BADGE_OPTIONS.find(b => b.label === formData.tag);
    const tagColor = tagMatch ? tagMatch.color : 'bg-autumn-maple/20 text-autumn-maple border-autumn-maple/40';

    if (editingTrek) {
      // UPDATE
      setTreks(prev => prev.map(t => t.id === editingTrek.id ? {
        ...t,
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        slotsLeft: Number(formData.slotsLeft),
        tagColor
      } : t));
    } else {
      // CREATE
      const newTrek = {
        id: `trek-${Date.now()}`,
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        slotsLeft: Number(formData.slotsLeft),
        tagColor,
        dates: ['2026-08-01', '2026-08-15', '2026-08-22']
      };
      setTreks(prev => [newTrek, ...prev]);
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
  const filteredTreks = treks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // UNAUTHENTICATED: LOGIN / RESET SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-autumn-bark flex items-center justify-center p-4 text-autumn-mist relative overflow-hidden font-sans">
        {/* Background glow graphics */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-autumn-maple/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-autumn-rhodo/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-autumn-maple/30 bg-[#3A2A1E]/80 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#2A1D14]/80 p-6 border-b border-autumn-mist/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-autumn-maple/20 border border-autumn-maple/40 flex items-center justify-center text-autumn-maple">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-outfit text-base font-bold uppercase tracking-wider text-autumn-mist">
                  BOOTpaths <span className="text-autumn-maple">Console</span>
                </h2>
                <span className="text-xxs text-autumn-mist/60 block font-mono">RBAC Admin Access Portal</span>
              </div>
            </div>
            {onReturnToSite && (
              <button 
                onClick={onReturnToSite}
                className="text-xs text-autumn-mist/60 hover:text-autumn-mist flex items-center gap-1 transition-colors"
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
                  <h3 className="font-outfit text-xl font-bold text-autumn-mist">Administrator Sign In</h3>
                  <p className="text-xs text-autumn-mist/70 mt-1">
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
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1.5">
                    Admin Email
                  </label>
                  <div className="relative">
                    <input 
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="admin@bootpaths.com"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/70 text-xs text-autumn-mist placeholder-autumn-mist/40 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-autumn-mist/40 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70">
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
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/70 text-xs text-autumn-mist placeholder-autumn-mist/40 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-autumn-mist/40 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full h-11 rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-widest text-stone-950 hover:bg-[#a44717] transition-all focus:outline-none focus:ring-2 focus:ring-autumn-maple flex items-center justify-center gap-2 disabled:opacity-50"
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
                  <h3 className="font-outfit text-xl font-bold text-autumn-mist">Password Reset Pipeline</h3>
                  <p className="text-xs text-autumn-mist/70 mt-1">
                    Request an administrator account recovery link.
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-400 flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Recovery Link Sent!</span>
                        <span className="text-autumn-mist/80 block mt-1">
                          A password recovery link has been dispatched to <strong>{emailInput}</strong>. Please check your admin mailbox.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAuthView('login'); setResetSuccess(false); setAuthError(''); }}
                      className="w-full h-10 rounded-xl border border-autumn-mist/20 bg-[#2A1D14]/60 font-outfit text-xs font-bold uppercase tracking-wider text-autumn-mist hover:bg-[#2A1D14] transition-all flex items-center justify-center gap-2"
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
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1.5">
                        Registered Admin Email
                      </label>
                      <div className="relative">
                        <input 
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="admin@bootpaths.com"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/70 text-xs text-autumn-mist placeholder-autumn-mist/40 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all"
                        />
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-autumn-mist/40 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingAuth}
                      className="w-full h-11 rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-widest text-stone-950 hover:bg-[#a44717] transition-all focus:outline-none focus:ring-2 focus:ring-autumn-maple flex items-center justify-center gap-2 disabled:opacity-50"
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
                      className="w-full text-center text-xs text-autumn-mist/60 hover:text-autumn-mist transition-colors pt-2 block"
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
    <div className="min-h-screen bg-autumn-bark text-autumn-mist font-sans">
      
      {/* 1. PERSISTENT ADMIN STATUS NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-autumn-mist/10 bg-[#2A1D14]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-8">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-outfit text-base font-black uppercase tracking-wider text-autumn-mist">
                BOOT<span className="text-autumn-maple">paths</span> Console
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-autumn-mist/10 text-xs text-autumn-mist/70">
              <KeyRound className="h-3.5 w-3.5 text-autumn-amber" />
              <span>Admin: <strong className="text-autumn-mist font-mono">admin@bootpaths.com</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onReturnToSite && (
              <button 
                onClick={onReturnToSite}
                className="h-9 px-3 rounded-lg border border-autumn-mist/20 bg-autumn-mist/5 text-xs font-bold uppercase tracking-wider text-autumn-mist hover:bg-autumn-mist/10 transition-colors flex items-center gap-1.5"
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
        
        {/* HEADER & ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#3A2A1E]/40 border border-autumn-mist/10 rounded-2xl p-6 backdrop-blur-md">
          <div>
            <h1 className="font-outfit text-2xl sm:text-3xl font-black text-autumn-mist">
              Trek Inventory Management
            </h1>
            <p className="text-xs text-autumn-mist/70 mt-1">
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
                className="w-full sm:w-64 h-11 pl-10 pr-4 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist placeholder-autumn-mist/40 focus:outline-none focus:border-autumn-maple"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-autumn-mist/40 pointer-events-none" />
            </div>

            {/* Add Trek Button */}
            <button
              onClick={handleOpenCreateModal}
              className="h-11 px-5 rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-wider text-stone-955 hover:bg-[#a44717] transition-all flex items-center justify-center gap-2 shadow-lg shadow-autumn-maple/20"
            >
              <Plus className="h-4 w-4" />
              Add New Trek
            </button>
          </div>
        </div>

        {/* INVENTORY STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-autumn-mist/10 bg-[#2A1D14]/60 backdrop-blur-sm">
            <span className="text-xxs uppercase tracking-wider text-autumn-mist/60 font-bold block">Total Packages</span>
            <span className="font-outfit text-2xl font-black text-autumn-mist mt-1 block">{treks.length}</span>
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
        <div className="overflow-hidden rounded-2xl border border-autumn-mist/10 bg-[#3A2A1E]/70 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-autumn-mist">
              <thead className="bg-[#2A1D14] text-[10px] font-bold uppercase tracking-wider text-autumn-mist/60 border-b border-autumn-mist/10">
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
                    <td colSpan="7" className="py-12 text-center text-autumn-mist/50 font-outfit text-sm">
                      No trek packages match your query.
                    </td>
                  </tr>
                ) : (
                  filteredTreks.map((trek) => (
                    <tr key={trek.id} className="hover:bg-[#2A1D14]/40 transition-colors">
                      {/* Title & Image */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={trek.image} 
                            alt={trek.title}
                            className="h-10 w-10 rounded-lg object-cover border border-autumn-mist/10 shrink-0" 
                          />
                          <div>
                            <span className="font-outfit text-sm font-bold text-autumn-mist block">{trek.title}</span>
                            <span className="text-xxs text-autumn-mist/60 block">{trek.duration}</span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1 text-autumn-mist/80">
                            <MapPin className="h-3 w-3 text-autumn-amber" />
                            {trek.location}
                          </span>
                          <span className="text-xxs text-autumn-mist/50 block font-mono">
                            {trek.altitude}
                          </span>
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xxs font-bold uppercase tracking-wider bg-autumn-mist/10 border border-autumn-mist/20">
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
                            <span className="text-xxs text-autumn-mist/40 line-through block">₹{trek.originalPrice?.toLocaleString()}</span>
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
                            className="h-8 w-8 rounded-lg bg-autumn-mist/10 hover:bg-autumn-maple hover:text-stone-955 text-autumn-mist transition-all flex items-center justify-center"
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
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-autumn-maple/30 bg-[#3A2A1E]/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 text-autumn-mist">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-autumn-mist/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-autumn-maple/20 text-autumn-maple flex items-center justify-center border border-autumn-maple/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-outfit text-xl font-bold">
                    {editingTrek ? 'Update Trek Package' : 'Create New Trek Package'}
                  </h3>
                  <span className="text-xxs text-autumn-mist/60 block">Configure inventory pricing and parameters</span>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-[#2A1D14] flex items-center justify-center text-autumn-mist/60 hover:text-autumn-mist transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTrek} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                    Trek Title
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Netravathi Peak Trek"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                    Location
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Chikkamagaluru, Karnataka"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                    Altitude (m / ft)
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.altitude}
                    onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}
                    placeholder="e.g. 1,520 m / 4,986 ft"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                    Duration
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 2 Days / 1 Night"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                    Offer Price (₹)
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3499"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                    Original Price (₹)
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="4499"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                    Available Live Slots
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.slotsLeft}
                    onChange={(e) => setFormData({ ...formData, slotsLeft: e.target.value })}
                    placeholder="10"
                    className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                    Badge Tag
                  </label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple"
                  >
                    {BADGE_OPTIONS.map(b => (
                      <option key={b.label} value={b.label} className="bg-[#2A1D14] text-autumn-mist">
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                  Image Banner URL
                </label>
                <input 
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-10 px-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-1">
                  Package Summary Description
                </label>
                <textarea 
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed trail summary..."
                  className="w-full p-3 rounded-xl border border-autumn-mist/15 bg-[#2A1D14]/80 text-xs text-autumn-mist focus:outline-none focus:border-autumn-maple resize-none"
                />
              </div>

              {/* Inclusions checklist */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-mist/70 mb-2">
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
                            : 'bg-[#2A1D14]/60 text-autumn-mist/60 border-autumn-mist/10 hover:border-autumn-mist/30'
                        }`}
                      >
                        <span className="truncate pr-1">{item}</span>
                        {isChecked && <Check className="h-3 w-3 shrink-0 text-autumn-maple" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-autumn-mist/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 px-5 rounded-xl border border-autumn-mist/20 bg-transparent text-xs font-bold uppercase tracking-wider text-autumn-mist hover:bg-autumn-mist/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-autumn-maple font-outfit text-xs font-bold uppercase tracking-wider text-stone-955 hover:bg-[#a44717] transition-colors shadow-lg shadow-autumn-maple/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-autumn-rhodo/40 bg-[#3A2A1E]/95 backdrop-blur-xl shadow-2xl p-6 text-autumn-mist space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-autumn-rhodo/20 border border-autumn-rhodo/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-outfit text-lg font-bold">Confirm Deletion</h3>
                <span className="text-xs text-autumn-mist/60 block">This action cannot be undone.</span>
              </div>
            </div>

            <p className="text-xs text-autumn-mist/80 bg-[#2A1D14] p-3.5 rounded-xl border border-autumn-mist/10">
              Are you sure you want to purge <strong>{deleteConfirmTrek.title}</strong> from active inventory?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmTrek(null)}
                className="h-10 px-4 rounded-xl border border-autumn-mist/20 bg-transparent text-xs font-bold uppercase tracking-wider text-autumn-mist hover:bg-autumn-mist/10 transition-colors"
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
