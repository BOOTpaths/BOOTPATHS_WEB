import { useState, useRef, useEffect } from 'react';
import { Award, Shield, Leaf, X, Upload, CheckCircle2, AlertCircle, Phone, Compass } from 'lucide-react';
import { db, storage } from '../config/firebase';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function LeadCareers({ isCareersEnabled: propCareersEnabled, leadApplications, setLeadApplications }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [regions, setRegions] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCareersEnabled, setIsCareersEnabled] = useState(propCareersEnabled ?? true);

  const fileInputRef = useRef(null);

  const availableRegions = ['Chikkamagaluru', 'Coorg', 'Wayanad', 'Idukki'];

  // Subscribe to live global app settings for careers toggle
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'appSettings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setIsCareersEnabled(docSnap.data().careersEnabled ?? true);
      }
    }, (err) => {
      console.warn('AppSettings Notice:', err.message);
    });
    return () => unsub();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleRegionToggle = (region) => {
    setRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setFormError('Invalid file type. Only PDF and DOC/DOCX files are allowed.');
      return;
    }

    setResumeFile(file);
    setResumeName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeData(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setFormError('Invalid file type. Only PDF and DOC/DOCX files are allowed.');
      return;
    }

    setResumeFile(file);
    setResumeName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeData(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) return setFormError('Please enter your full name.');
    if (!phone.trim()) return setFormError('Please enter your WhatsApp contact number.');
    if (!experience.trim() || experience.trim().length < 30) {
      return setFormError('Experience details must be at least 30 characters.');
    }
    if (regions.length === 0) {
      return setFormError('Please select at least one preferred region.');
    }
    if (!resumeData && !resumeFile) {
      return setFormError('Please upload your resume (PDF or DOC/DOCX).');
    }

    setIsSubmitting(true);

    try {
      let finalResumeUrl = resumeData;

      // Upload file to Firebase Storage if online
      if (resumeFile) {
        try {
          const storageRef = ref(storage, `resumes/${Date.now()}_${resumeFile.name}`);
          const snapshot = await uploadBytes(storageRef, resumeFile);
          finalResumeUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadErr) {
          console.warn('Firebase Storage notice, fallback to data URL:', uploadErr.message);
        }
      }

      const newApplication = {
        fullName,
        phone,
        experience,
        regions: regions.join(', '),
        resumeUrl: finalResumeUrl,
        resumeFilename: resumeName,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        submittedAt: new Date().toISOString()
      };

      // Add document to Firestore leadApplications collection
      try {
        const docRef = await addDoc(collection(db, 'leadApplications'), newApplication);
        newApplication.id = docRef.id;
      } catch (dbErr) {
        console.warn('Firestore notice, using local ID fallback:', dbErr.message);
        newApplication.id = `lead-${Date.now()}`;
      }

      if (setLeadApplications) {
        setLeadApplications(prev => [newApplication, ...prev]);
      }
      setIsModalOpen(false);

      // Reset Form
      setFullName('');
      setPhone('');
      setExperience('');
      setRegions([]);
      setResumeFile(null);
      setResumeData('');
      setResumeName('');

      showToast('Application submitted! Our operations team will review your profile shortly.');
    } catch (err) {
      setFormError('Submission failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="careers" className="relative bg-[#F3ECDD] py-24 px-6 md:px-12 text-[#3A2A1E] overflow-hidden border-t border-[#C1571F]/15">
      {/* Background aesthetics */}
      <div className="absolute top-1/4 left-0 h-[300px] w-[300px] rounded-full bg-[#C1571F]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-0 h-[400px] w-[400px] rounded-full bg-[#E3A21E]/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        {!isCareersEnabled ? (
          /* PAUSED BANNER STATE */
          <div className="max-w-4xl mx-auto backdrop-blur-xl bg-[#EBE3D3] border border-[#3A2A1E]/10 rounded-3xl p-12 text-center shadow-sm">
            <Compass className="h-12 w-12 text-[#C1571F] mx-auto animate-spin-slow mb-6" />
            <h2 className="font-outfit text-2xl sm:text-3xl font-black text-[#3A2A1E]">
              Trek Lead Applications Paused
            </h2>
            <p className="mt-4 text-sm text-stone-700 leading-relaxed max-w-xl mx-auto">
              Our active recruitment batches for expedition leads are currently closed. Check back soon for upcoming season openings and decathlon partner spotlight workshops!
            </p>
          </div>
        ) : (
          /* FULL CAREERS CONTENT */
          <div className="space-y-16">
            
            {/* Header Block */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="font-outfit text-xs font-bold tracking-widest uppercase text-[#C1571F]">
                Join the Crew
              </span>
              <h2 className="font-outfit text-3xl font-black tracking-tight text-[#3A2A1E] sm:text-4xl md:text-5xl">
                Lead the Ghats — Become a BOOTpaths Expedition Lead
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                We are searching for certified mountaineers, first responders, and local trail experts to guide our exclusive premium batches across Southern India.
              </p>
            </div>

            {/* Features Row */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-6 rounded-2xl bg-[#EBE3D3] border border-[#3A2A1E]/10 shadow-sm space-y-4 hover:border-[#C1571F]/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-[#E3A21E]/10 border border-[#E3A21E]/30 flex items-center justify-center text-[#E3A21E]">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-outfit text-lg font-bold text-[#3A2A1E]">Professional Growth & WFA</h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Get certified with Wilderness First Aid (WFA) courses, advanced navigation mapping, and search-and-rescue drills sponsored fully by BOOTpaths.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#EBE3D3] border border-[#3A2A1E]/10 shadow-sm space-y-4 hover:border-[#C1571F]/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-[#C1571F]/10 border border-[#C1571F]/30 flex items-center justify-center text-[#C1571F]">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-outfit text-lg font-bold text-[#3A2A1E]">Decathlon Gear Sponsorship</h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Equip yourself with elite Quechua technical layers, waterproof backpacks, carbon trekking poles, and tents sponsored for all active guides.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#EBE3D3] border border-[#3A2A1E]/10 shadow-sm space-y-4 hover:border-[#C1571F]/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                  <Leaf className="h-5 w-5" />
                </div>
                <h3 className="font-outfit text-lg font-bold text-[#3A2A1E]">Eco-Trail Stewardship</h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Lead carbon-neutral forest cleanups and nature awareness programs as a certified steward under the BOOTpaths Green Trails initiative.
                </p>
              </div>
            </div>

            {/* Checklist & CTA Split */}
            <div className="rounded-3xl border border-[#3A2A1E]/10 bg-[#EBE3D3] p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
              <div className="space-y-6 max-w-lg">
                <h3 className="font-outfit text-xl font-bold text-[#3A2A1E]">Expedition Lead Eligibility Checklist</h3>
                <ul className="space-y-3.5 text-xs text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#C1571F] shrink-0 mt-0.5" />
                    <span>Basic Mountaineering Course (BMC) or Advanced (AMC) certified from recognized institutions (HMI, NIM, JIM, etc.) preferred.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#C1571F] shrink-0 mt-0.5" />
                    <span>In-depth trail routing, water point, and navigation familiarity with Western Ghats ridges (Chikkamagaluru, Coorg, Wayanad).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#C1571F] shrink-0 mt-0.5" />
                    <span>Physical fitness capability to traverse 15km+ per day bearing 12kg technical crew load packs.</span>
                  </li>
                </ul>
              </div>

              <div className="w-full md:w-auto shrink-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto h-14 inline-flex items-center justify-center gap-2 rounded-xl bg-[#C1571F] hover:bg-[#a44717] text-[#3A2A1E] px-8 font-outfit text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(193,87,31,0.15)]"
                >
                  <Compass className="h-4.5 w-4.5" />
                  Apply as Expedition Lead
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* APPLICATION FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#C1571F]/30 bg-[#3A2A1E] text-[#F3ECDD] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-[#2A1D14] p-5 flex justify-between items-center border-b border-[#C1571F]/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#C1571F]/10 flex items-center justify-center text-[#C1571F] border border-[#C1571F]/20">
                  <Compass className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-outfit text-base font-bold uppercase tracking-wider text-[#F3ECDD]">
                    Apply as Trek Lead
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#E3A21E] font-semibold">
                    Submit Candidate Credentials
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 text-[#F3ECDD]/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Rohan Deshmukh"
                  className="h-11 rounded-lg border border-[#C1571F]/20 bg-[#2A1D14]/85 px-4 text-sm text-[#F3ECDD] placeholder-[#F3ECDD]/30 outline-none focus:border-[#C1571F]/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">WhatsApp Contact Phone</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 88888"
                    className="w-full h-11 rounded-lg border border-[#C1571F]/20 bg-[#2A1D14]/85 pl-10 pr-4 text-sm text-[#F3ECDD] placeholder-[#F3ECDD]/30 outline-none focus:border-[#C1571F]/60 transition-colors"
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#F3ECDD]/40" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">Trekking Experience & Certifications</label>
                <textarea 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Detail institutional BMC/WFA certificates, total batches guided, and route route knowledge..."
                  rows="4"
                  className="rounded-lg border border-[#C1571F]/20 bg-[#2A1D14]/85 p-4 text-sm text-[#F3ECDD] placeholder-[#F3ECDD]/30 outline-none focus:border-[#C1571F]/60 transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60 mb-1">Preferred Operating Regions</label>
                <div className="flex flex-wrap gap-2">
                  {availableRegions.map(region => {
                    const isSelected = regions.includes(region);
                    return (
                      <button
                        type="button"
                        key={region}
                        onClick={() => handleRegionToggle(region)}
                        className={`h-9 px-4 rounded-lg text-xs font-bold transition-all border ${
                          isSelected 
                            ? 'bg-[#C1571F] border-[#C1571F] text-white shadow-md' 
                            : 'bg-[#2A1D14]/50 border-[#C1571F]/20 text-[#F3ECDD]/70 hover:border-[#C1571F]/40'
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">Resume / CV (PDF, DOC, DOCX)</label>
                
                {resumeName ? (
                  <div className="rounded-xl border border-[#C1571F]/30 bg-[#2A1D14] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#E3A21E]/10 border border-[#E3A21E]/30 flex items-center justify-center text-[#E3A21E]">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#F3ECDD] block line-clamp-1">{resumeName}</span>
                        <span className="text-[10px] text-emerald-400 block font-semibold">Attached & Converted</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { setResumeData(''); setResumeName(''); }}
                      className="h-8 w-8 rounded-lg bg-[#8C2B2A]/20 hover:bg-[#8C2B2A] text-rose-300 hover:text-white flex items-center justify-center transition-colors"
                      title="Clear File"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed transition-all rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isDragOver 
                        ? 'border-[#C1571F] bg-[#2A1D14]/90' 
                        : 'border-[#C1571F]/20 bg-[#2A1D14]/50 hover:border-[#C1571F]/50'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 text-[#C1571F]" />
                    <div className="text-xs text-[#F3ECDD]/80 font-medium">
                      Click or drag an image or document from your device
                    </div>
                    <span className="text-[9px] text-[#F3ECDD]/40">PDF, DOC, DOCX up to 5MB</span>
                  </div>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="bg-[#2A1D14] p-5 border-t border-[#C1571F]/10 flex gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 text-[#F3ECDD]/80 font-outfit text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg bg-[#C1571F] hover:bg-[#a44717] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                Submit Application
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TOAST SUCCESS NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#C1571F]/40 bg-[#3A2A1E] p-4 text-sm font-semibold text-[#F3ECDD] shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-5 w-5 text-[#E3A21E] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </section>
  );
}
