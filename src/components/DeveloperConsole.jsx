/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Shield, Cpu, RefreshCw, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DeveloperConsole() {
  const { currentUser, userData, userRole } = useAuth();
  const [featureFlags, setFeatureFlags] = useState({
    enableLeadApplications: false,
    enableExpeditionViews: false,
    enableSocialFeeds: false,
    enableCommunityBlogs: false
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  // Connect to Firestore document app_settings/feature_flags using onSnapshot to read in real time
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'app_settings', 'feature_flags'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFeatureFlags({
          enableLeadApplications: !!data.enableLeadApplications,
          enableExpeditionViews: !!data.enableExpeditionViews,
          enableSocialFeeds: !!data.enableSocialFeeds,
          enableCommunityBlogs: !!data.enableCommunityBlogs
        });
      }
    }, (err) => {
      console.warn('DeveloperConsole Feature Flags snapshot error:', err);
    });
    return () => unsub();
  }, []);

  const toggleFlag = async (flagName) => {
    setIsUpdating(true);
    setUpdateStatus('Saving modifications...');

    const updatedFlags = {
      ...featureFlags,
      [flagName]: !featureFlags[flagName]
    };

    try {
      await setDoc(doc(db, 'app_settings', 'feature_flags'), updatedFlags);
      setUpdateStatus('Persisted successfully');
      setTimeout(() => setUpdateStatus(''), 2000);
    } catch (err) {
      console.error('Failed to update feature flags in Firestore:', err);
      setUpdateStatus('Save error: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Authorization check
  const isDeveloper = userRole === 'developer' || 
                      currentUser?.role === 'developer' || 
                      userData?.role === 'developer' ||
                      currentUser?.email === 'vzentura2026@gmail.com' ||
                      userData?.email === 'vzentura2026@gmail.com';

  if (!isDeveloper) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center gap-4 text-autumn-bark font-sans p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-[#C1571F] animate-pulse" />
        <h1 className="font-outfit text-2xl font-black uppercase tracking-wider text-[#1A1A18]">Access Denied</h1>
        <p className="text-xs max-w-md text-autumn-bark/70 leading-relaxed">
          Developer permissions required. Contact systems administrator to verify user roles or credentials.
        </p>
        <button 
          onClick={() => { window.location.hash = '#'; }}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[#C1571F] hover:bg-[#A84310] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
        >
          Return to Safety
        </button>
      </div>
    );
  }

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
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-autumn-bark font-sans py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E7E7E4] p-8 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <a href="/#" className="flex items-center gap-2.5 select-none hover:opacity-95 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-white border border-[#3E2723]/30 shadow-sm flex items-center justify-center overflow-hidden p-1">
                <img src="/logo.png" alt="BOOTpaths" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight select-none">
                <span className="text-[#FF6B00]">BOOT</span>
                <span className="text-[#8B2626]">paths</span>
              </span>
            </a>
            <div className="h-px w-4 bg-autumn-bark/20 rotate-90 hidden sm:block"></div>
            <div>
              <h1 className="font-outfit text-lg font-black uppercase tracking-wider text-[#1A1A18]">
                Ops / Developer Control Panel
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C1571F] flex items-center gap-1.5 mt-0.5">
                <Shield className="h-3 w-3" /> Security Clearance Level: Developer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {updateStatus && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                updateStatus.includes('error') ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700'
              }`}>
                {updateStatus}
              </span>
            )}
            {isUpdating && <RefreshCw className="h-4 w-4 animate-spin text-[#C1571F]" />}
            <button 
              onClick={() => { window.location.hash = '#'; }}
              className="h-9 px-4 rounded-xl border border-[#E7E7E4] bg-[#F8F8F6] text-xs font-bold uppercase tracking-wider text-autumn-bark hover:bg-[#E7E7E4]/50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Return to Site
            </button>
          </div>
        </div>

        {/* Feature Flags Grid */}
        <div className="grid gap-6">
          <div className="bg-[#FFFFFF] border border-[#E7E7E4] p-8 rounded-3xl shadow-sm">
            <h2 className="font-outfit text-sm font-bold uppercase tracking-widest text-autumn-bark/80 mb-6 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#C1571F]" /> Active Feature Flags Gating
            </h2>

            <div className="divide-y divide-[#E7E7E4]">
              {flagsConfig.map((flag) => {
                const isActive = !!featureFlags[flag.key];
                return (
                  <div key={flag.key} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-lg">
                      <div className="flex items-center gap-3">
                        <h3 className="font-outfit text-sm font-extrabold text-[#1A1A18] uppercase tracking-wide">
                          {flag.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-[#F8F8F6] border border-[#E7E7E4] text-[#52524E]">
                          {flag.badge}
                        </span>
                      </div>
                      <p className="text-xxs text-autumn-bark/70 leading-relaxed">
                        {flag.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Active Status Pill */}
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1.5 border transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                          : 'bg-stone-200/50 border-stone-300 text-stone-500'
                      }`}>
                        {isActive ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                            ONLINE / ENABLED
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-stone-400"></span>
                            OFFLINE / MUTED
                          </>
                        )}
                      </span>

                      {/* Custom Switch Toggle */}
                      <button
                        onClick={() => toggleFlag(flag.key)}
                        disabled={isUpdating}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isActive ? 'bg-[#C1571F]' : 'bg-stone-300'
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

        {/* Extra System Operations details */}
        <div className="bg-[#FFFFFF] border border-[#E7E7E4] p-6 rounded-2xl flex items-center justify-between text-xxs text-[#52524E]/80 shadow-sm">
          <div>
            ⚙️ <span className="font-bold">System Status:</span> Live Environment Node | <span className="font-bold">Vite</span> Native Deployment
          </div>
          <div>
            CONFIDENTIAL - Internal DevOps Panel
          </div>
        </div>

      </div>
    </div>
  );
}
