import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Wallet, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  ChevronDown,
  Info,
  Gift,
  Compass
} from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function UserDashboard({
  isOpen,
  onClose,
  user,
  handleLogout,
  dashboardTab,
  setDashboardTab,
  expeditionRecords,
  setExpeditionRecords,
  walletBalance,
  walletTransactions,
  onConfirmCancellation,
  profileData,
  setProfileData,
  isSavingProfile,
  onSaveProfile
}) {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [selectedRefundOption, setSelectedRefundOption] = useState('bonus_credit'); // 'cash' or 'bonus_credit'

  useEffect(() => {
    if (!isOpen || !user || !user.uid) return;

    const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      // Sort bookings by date descending
      docs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setBookings(docs);
    }, (err) => {
      console.warn('User bookings subscription error:', err);
    });

    return () => unsubscribe();
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  // Calculate cancellation details when a booking is selected
  const getCancelDetails = (booking) => {
    if (!booking) return null;
    
    // Calculate days remaining before trek
    const trekDate = new Date(booking.date);
    const today = new Date();
    const diffTime = trekDate - today;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 50; // default for 15-30 days
    let tierLabel = '15–30 Days (50% Refund Tier)';

    if (daysRemaining > 30) {
      refundPercentage = 90;
      tierLabel = '> 30 Days (90% Refund Tier)';
    } else if (daysRemaining >= 15) {
      refundPercentage = 50;
      tierLabel = '15–30 Days (50% Refund Tier)';
    } else {
      refundPercentage = 20; // 1 day before / short notice minimum tier
      tierLabel = '< 15 Days (20% Minimum Refund Tier)';
    }

    const baseRefundAmount = Math.round(booking.price * (refundPercentage / 100));
    const bonusCreditAmount = Math.round(baseRefundAmount * 1.5);
    const extraBonusValue = bonusCreditAmount - baseRefundAmount;

    // Calculate 12-month expiry date
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const formattedExpiry = expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return {
      daysRemaining: Math.max(1, daysRemaining),
      refundPercentage,
      tierLabel,
      baseRefundAmount,
      bonusCreditAmount,
      extraBonusValue,
      formattedExpiry
    };
  };

  const cancelDetails = getCancelDetails(selectedBookingForCancel);

  const handleProcessCancellation = () => {
    if (!selectedBookingForCancel || !cancelDetails) return;
    onConfirmCancellation({
      booking: selectedBookingForCancel,
      refundOption: selectedRefundOption,
      cancelDetails
    });
    setSelectedBookingForCancel(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3A2A1E]/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-3xl border border-[#3A2A1E]/10 bg-[#F3ECDD] backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-250">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-[#EBE3D3] flex items-center justify-center text-[#3A2A1E]/70 hover:text-[#C1571F] hover:bg-[#EBE3D3]/80 transition-colors focus:outline-none shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Sidebar / Navigation Tabs */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#3A2A1E]/10 bg-[#EBE3D3]/60 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C1571F]/20 text-[#C1571F] font-outfit text-xl font-bold border border-[#C1571F]/30 shadow-[0_0_15px_rgba(193,87,31,0.2)] shrink-0 overflow-hidden">
              {user.photo ? (
                <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.initials
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-outfit text-sm font-bold text-[#3A2A1E] truncate">{user.name}</h3>
              <span className="text-[10px] text-[#3A2A1E]/50 uppercase tracking-widest block truncate">{user.email}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            <button 
              onClick={() => setDashboardTab('bookings')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                dashboardTab === 'bookings' 
                  ? 'bg-[#C1571F] text-white shadow-md' 
                  : 'text-[#3A2A1E]/70 hover:bg-[#EBE3D3] hover:text-[#3A2A1E]'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Expeditions
            </button>
            <button 
              onClick={() => setDashboardTab('profile')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                dashboardTab === 'profile' 
                  ? 'bg-[#C1571F] text-white shadow-md' 
                  : 'text-[#3A2A1E]/70 hover:bg-[#EBE3D3] hover:text-[#3A2A1E]'
              }`}
            >
              <User className="h-4 w-4" />
              Hiker Profile
            </button>
            <button 
              onClick={() => setDashboardTab('wallet')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 relative ${
                dashboardTab === 'wallet' 
                  ? 'bg-[#C1571F] text-white shadow-md' 
                  : 'text-[#3A2A1E]/70 hover:bg-[#EBE3D3] hover:text-[#3A2A1E]'
              }`}
            >
              <Wallet className="h-4 w-4" />
              <span>Trail Wallet</span>
              {walletBalance > 0 && (
                <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#E3A21E] text-[#2A1D14]">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>

          <div className="mt-auto hidden md:block pt-6 border-t border-[#3A2A1E]/10">
            <button 
              onClick={() => { onClose(); handleLogout(); }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A2A1E]/50 hover:text-[#8C2B2A] transition-colors focus:outline-none"
            >
              <LogOut className="h-4 w-4" />
              Sign Out Securely
            </button>
          </div>
        </div>

        {/* Main Dashboard Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F3ECDD]">
          
          {/* TAB 1: EXPEDITION RECORDS */}
          {dashboardTab === 'bookings' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1571F]">Passes & History</span>
                <h2 className="font-outfit text-2xl font-black text-[#3A2A1E] tracking-tight">Expedition Records</h2>
                <p className="text-xs text-[#3A2A1E]/70 mt-0.5">Your confirmed wilderness passes and historical trail records.</p>
              </div>

              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 py-16 text-center bg-[#EBE3D3]/40 rounded-3xl border border-[#3A2A1E]/10 animate-in fade-in zoom-in-95 duration-200">
                    <Compass className="h-16 w-16 text-[#C1571F] animate-pulse mb-4" />
                    <h3 className="font-outfit text-lg font-black text-[#3A2A1E] uppercase tracking-wider">No Active Expeditions Found</h3>
                    <p className="text-xs text-[#3A2A1E]/60 max-w-sm mt-2">You haven't reserved any wilderness passes yet.</p>
                    <button
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          const upcoming = document.getElementById('upcoming-treks');
                          if (upcoming) {
                            upcoming.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 150);
                      }}
                      className="mt-6 px-6 py-2.5 rounded-xl bg-[#C1571F] hover:bg-[#a44717] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#C1571F]/20"
                    >
                      Explore Upcoming Treks
                    </button>
                  </div>
                ) : (
                  bookings.map((record) => {
                    const isConfirmed = record.status === 'Confirmed';
                    const isCancelled = record.status === 'Cancelled';
                    const isCompleted = record.status === 'Completed';

                    return (
                      <div 
                        key={record.id} 
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all ${
                          isCancelled 
                            ? 'border-[#3A2A1E]/10 bg-[#EBE3D3]/40 opacity-75' 
                            : 'border-[#3A2A1E]/15 bg-[#EBE3D3] hover:border-[#C1571F]/40 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xxs font-mono text-[#3A2A1E]/60 bg-[#F3ECDD] px-2 py-0.5 rounded border border-[#3A2A1E]/10 font-bold">
                              {record.id}
                            </span>
                            <span className={`text-xxs font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                              isConfirmed ? 'text-[#C1571F]' : isCompleted ? 'text-emerald-700' : 'text-[#8C2B2A]'
                            }`}>
                              {isConfirmed && <span className="flex h-2 w-2 rounded-full bg-[#C1571F] animate-pulse"></span>}
                              {record.status}
                            </span>
                          </div>
                          <h4 className="font-outfit text-lg font-bold text-[#3A2A1E] mt-1">{record.title}</h4>
                          <span className="text-xs text-[#3A2A1E]/70 flex items-center gap-2 mt-0.5">
                            <Calendar className="h-3.5 w-3.5 text-[#C1571F]" />
                            {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end justify-between border-t sm:border-t-0 border-[#3A2A1E]/10 pt-3 sm:pt-0 gap-2">
                          <div className="text-right">
                            <span className="text-xs text-[#3A2A1E]/60 block">{record.trekkers} Explorer{record.trekkers > 1 ? 's' : ''}</span>
                            <span className="font-outfit text-xl font-black text-[#C1571F]">₹{record.price.toLocaleString('en-IN')}</span>
                          </div>

                          {/* RENDER CANCEL BUTTON ONLY FOR CONFIRMED BOOKINGS */}
                          {isConfirmed && (
                            <button
                              onClick={() => setSelectedBookingForCancel(record)}
                              className="border border-[#8C2B2A] text-[#8C2B2A] hover:bg-[#8C2B2A] hover:text-white rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                            >
                              Cancel Booking
                            </button>
                          )}
                          {isCancelled && (
                            <span className="text-[10px] font-bold text-[#8C2B2A] uppercase tracking-wider bg-[#8C2B2A]/10 px-2.5 py-1 rounded-md">
                              Cancelled & Processed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HIKER VITAL PROFILE */}
          {dashboardTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1571F]">Safety Credentials</span>
                <h2 className="font-outfit text-2xl font-black text-[#3A2A1E] tracking-tight">Hiker Vital Profile</h2>
                <p className="text-xs text-[#3A2A1E]/70 mt-0.5">Manage your wilderness credentials and emergency medical protocols.</p>
              </div>

              <form onSubmit={onSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3A2A1E]/60 mb-2">Legal Full Name</label>
                    <input 
                      type="text"
                      value={profileData.fullName || user.name}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl border border-[#3A2A1E]/15 bg-[#EBE3D3] text-xs text-[#3A2A1E] placeholder-[#3A2A1E]/40 focus:outline-none focus:border-[#C1571F] transition-all"
                      placeholder="As per Government ID"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3A2A1E]/60 mb-2">Contact Mobile</label>
                    <input 
                      type="tel"
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl border border-[#3A2A1E]/15 bg-[#EBE3D3] text-xs text-[#3A2A1E] placeholder-[#3A2A1E]/40 focus:outline-none focus:border-[#C1571F] transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3A2A1E]/60 mb-2">Blood Group</label>
                    <div className="relative">
                      <select 
                        value={profileData.bloodGroup}
                        onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-[#3A2A1E]/15 bg-[#EBE3D3] text-xs text-[#3A2A1E] focus:outline-none focus:border-[#C1571F] transition-all appearance-none"
                      >
                        <option value="" disabled>Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-[#3A2A1E]/50 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3A2A1E]/60 mb-2">Emergency Contact</label>
                    <input 
                      type="tel"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl border border-[#3A2A1E]/15 bg-[#EBE3D3] text-xs text-[#3A2A1E] placeholder-[#3A2A1E]/40 focus:outline-none focus:border-[#C1571F] transition-all"
                      placeholder="Family or Guardian Mobile"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3A2A1E]/60 mb-2">Medical Conditions / Allergies</label>
                  <textarea 
                    rows="3"
                    value={profileData.medicalConditions}
                    onChange={(e) => setProfileData({...profileData, medicalConditions: e.target.value})}
                    className="w-full p-4 rounded-xl border border-[#3A2A1E]/15 bg-[#EBE3D3] text-xs text-[#3A2A1E] placeholder-[#3A2A1E]/40 focus:outline-none focus:border-[#C1571F] transition-all resize-none"
                    placeholder="List any history of AMS, asthma, heart conditions, or severe insect/drug allergies."
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#C1571F] px-6 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#a44717] disabled:opacity-50 shadow-md"
                  >
                    {isSavingProfile ? 'Synchronizing...' : 'Save Hiker Credentials'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: TRAIL WALLET & CREDITS */}
          {dashboardTab === 'wallet' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1571F]">Future Trek Credits</span>
                <h2 className="font-outfit text-2xl font-black text-[#3A2A1E] tracking-tight">Trail Wallet</h2>
                <p className="text-xs text-[#3A2A1E]/70 mt-0.5">Manage your bonus cancellation credits and auto-redeem them during checkout.</p>
              </div>

              {/* Main Balance Display Card */}
              <div className="bg-[#3A2A1E] text-[#F3ECDD] border border-[#C1571F]/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-[#C1571F]/20 blur-2xl pointer-events-none"></div>

                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">Active Credit Balance</span>
                    <span className="bg-[#E3A21E]/20 text-[#E3A21E] border border-[#E3A21E]/30 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      +50% BONUS
                    </span>
                  </div>
                  <div className="font-outfit text-4xl font-black text-white tracking-tight">
                    ₹{walletBalance.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-[#F3ECDD]/75 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Available for instant checkout redemption on all Western Ghats & Himalayan treks.
                  </p>
                </div>

                <div className="w-full md:w-auto bg-[#2A1D14]/60 p-4 rounded-xl border border-[#F3ECDD]/10 space-y-1.5 text-xs relative z-10">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#F3ECDD]/50">Validity & Transferability</div>
                  <div className="font-bold text-[#E3A21E] flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    12 Months Validity
                  </div>
                  <div className="text-[11px] text-[#F3ECDD]/70">Redeemable by trekker or immediate family.</div>
                </div>
              </div>

              {/* Transaction Ledger */}
              <div className="space-y-3">
                <h3 className="font-outfit text-sm font-bold text-[#3A2A1E] uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#C1571F]" />
                  Credit Transaction History
                </h3>

                {walletTransactions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#3A2A1E]/20 bg-[#EBE3D3]/40 p-8 text-center space-y-2">
                    <Wallet className="h-8 w-8 text-[#3A2A1E]/30 mx-auto" />
                    <h4 className="font-outfit text-sm font-bold text-[#3A2A1E]/70">No Wallet Transactions Yet</h4>
                    <p className="text-xs text-[#3A2A1E]/50 max-w-sm mx-auto">
                      When you cancel a trek booking and choose the Future Trek Credit option, your refund amount + 50% bonus credit will instantly appear here!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {walletTransactions.map((txn) => (
                      <div 
                        key={txn.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#3A2A1E]/10 bg-[#EBE3D3] hover:border-[#C1571F]/30 transition-all text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                              txn.type === 'credit' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                            }`}>
                              {txn.type === 'credit' ? '+ CREDIT' : '- REDEEMED'}
                            </span>
                            <span className="text-[10px] font-mono text-[#3A2A1E]/50">{txn.id}</span>
                            <span className="text-[10px] text-[#3A2A1E]/50">• {txn.date}</span>
                          </div>
                          <p className="font-semibold text-[#3A2A1E]">{txn.desc}</p>
                          {txn.expiry && txn.expiry !== 'N/A' && (
                            <p className="text-[10px] text-[#C1571F] font-medium">Valid until: {txn.expiry}</p>
                          )}
                        </div>

                        <div className="mt-2 sm:mt-0 font-outfit text-base font-extrabold text-right">
                          <span className={txn.type === 'credit' ? 'text-emerald-700' : 'text-amber-700'}>
                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* INTERACTIVE CANCELLATION MODAL & POLICY CALCULATOR */}
      {selectedBookingForCancel && cancelDetails && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#2A1D14]/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#3A2A1E]/20 bg-[#F3ECDD] shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-250 text-[#3A2A1E]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#3A2A1E]/10 pb-4">
              <div className="flex items-center gap-2.5 text-[#8C2B2A]">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <h3 className="font-outfit text-lg font-extrabold text-[#3A2A1E]">Cancel Expedition Booking</h3>
              </div>
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="p-1 rounded-full bg-[#EBE3D3] text-[#3A2A1E]/60 hover:text-[#3A2A1E]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Target Booking Info Card */}
            <div className="rounded-xl border border-[#3A2A1E]/10 bg-[#EBE3D3] p-4 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3A2A1E]">{selectedBookingForCancel.title}</span>
                <span className="font-mono text-[10px] bg-[#F3ECDD] px-2 py-0.5 rounded font-bold">{selectedBookingForCancel.id}</span>
              </div>
              <div className="flex items-center justify-between text-[#3A2A1E]/70 text-[11px]">
                <span>Trek Date: {selectedBookingForCancel.date}</span>
                <span className="font-bold text-[#C1571F]">Paid: ₹{selectedBookingForCancel.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Policy Tier Calculation Notice */}
            <div className="rounded-xl bg-[#C1571F]/10 border border-[#C1571F]/20 p-3.5 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-[#C1571F]">
                <span>Policy Calculator Status</span>
                <span className="bg-[#C1571F] text-white px-2 py-0.5 rounded text-[10px] uppercase">{cancelDetails.tierLabel}</span>
              </div>
              <p className="text-[11px] text-[#3A2A1E]/80">
                Based on your cancellation window ({cancelDetails.daysRemaining} days prior to departure).
              </p>
            </div>

            {/* Dual Refund Options Selection */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3A2A1E]/60">Select Refund Option</label>

              {/* Option A: Standard Cash Refund */}
              <div 
                onClick={() => setSelectedRefundOption('cash')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedRefundOption === 'cash' 
                    ? 'border-[#3A2A1E] bg-[#EBE3D3] ring-1 ring-[#3A2A1E]' 
                    : 'border-[#3A2A1E]/10 bg-[#EBE3D3]/40 hover:border-[#3A2A1E]/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="refund_choice" 
                      checked={selectedRefundOption === 'cash'} 
                      onChange={() => setSelectedRefundOption('cash')}
                      className="accent-[#3A2A1E]" 
                    />
                    <span className="font-bold text-xs">Option A: Standard Cash Refund</span>
                  </div>
                  <span className="font-outfit font-extrabold text-sm text-[#3A2A1E]">
                    ₹{cancelDetails.baseRefundAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-[#3A2A1E]/70 mt-1.5 pl-5">
                  Reimburses {cancelDetails.refundPercentage}% base refund amount back to your original payment method (Bank/UPI) within 5–7 business days.
                </p>
              </div>

              {/* Option B: 50% Bonus Future Trek Credit (DEFAULT HIGHLIGHT) */}
              <div 
                onClick={() => setSelectedRefundOption('bonus_credit')}
                className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                  selectedRefundOption === 'bonus_credit' 
                    ? 'border-[#C1571F] bg-[#C1571F]/10 ring-2 ring-[#C1571F]' 
                    : 'border-[#C1571F]/30 bg-[#C1571F]/5 hover:border-[#C1571F]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="refund_choice" 
                      checked={selectedRefundOption === 'bonus_credit'} 
                      onChange={() => setSelectedRefundOption('bonus_credit')}
                      className="accent-[#C1571F]" 
                    />
                    <div>
                      <span className="font-extrabold text-xs text-[#C1571F] block">Option B: 50% Bonus Trail Wallet Credit</span>
                      <span className="bg-[#E3A21E] text-[#2A1D14] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mt-0.5">
                        RECOMMENDED +50% BONUS
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-outfit font-black text-lg text-[#C1571F]">
                      ₹{cancelDetails.bonusCreditAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] block text-emerald-700 font-bold">+₹{cancelDetails.extraBonusValue.toLocaleString('en-IN')} extra credit!</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#3A2A1E]/80 mt-2 pl-5 leading-relaxed">
                  Applies base refund + <strong>50% extra bonus credit</strong> directly to your Trail Wallet. Available instantly for checkout redemption.
                </p>
              </div>
            </div>

            {/* Policy Summary Box */}
            <div className="rounded-xl border border-[#3A2A1E]/10 bg-[#EBE3D3] p-3.5 text-[11px] text-[#3A2A1E]/75 leading-relaxed flex items-start gap-2">
              <Info className="h-4 w-4 text-[#C1571F] shrink-0 mt-0.5" />
              <span>
                Credits remain valid for 12 months from original cancelled trek date ({cancelDetails.formattedExpiry}) and can be redeemed for future treks or transferred to immediate family members.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="h-11 rounded-xl border border-[#3A2A1E]/20 text-[#3A2A1E] font-outfit text-xs font-bold uppercase tracking-wider hover:bg-[#EBE3D3] transition-all"
              >
                Keep Booking
              </button>
              <button
                onClick={handleProcessCancellation}
                className="h-11 rounded-xl bg-[#8C2B2A] text-white font-outfit text-xs font-extrabold uppercase tracking-wider hover:bg-[#6e2221] shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Confirm Cancellation
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
