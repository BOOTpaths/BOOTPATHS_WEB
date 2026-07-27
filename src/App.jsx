import { useState, useEffect } from 'react';
import AdminConsole from './components/AdminConsole';
import BlogSection from './components/BlogSection';
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

const INITIAL_BLOGS = [
  {
    id: 'blog-1',
    title: 'Monsoon Magic: Conquering the Netravathi Ridge',
    category: 'Trail Stories',
    coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    author: 'Sarah Jenkins',
    authorBadge: 'Community Trekker',
    date: '2026-07-20',
    status: 'published',
    content: `The Western Ghats undergo a dramatic transformation during the monsoons. Streams erupt from hidden fissures, shola grasslands glow with an incandescent green, and the peak of Netravathi becomes a fortress of fog and wind.\n\nOur journey started at dawn from the base camp. Registering at the forest checkpost, our certified mountaineer lead briefed us on keeping our footprints green and our trash packed. The ascent was challenging—wet clay patches made every step a test of grip, but our Decathlon waterproof boots held strong.\n\nReaching the summit ridge felt surreal. The valley below was completely submerged in a sea of mist, which parted occasionally to reveal the rolling green hills of Kudremukh range. It was a stark reminder of why we trek: not to conquer the peak, but to be conquered by the silence of the wilderness.`
  },
  {
    id: 'blog-2',
    title: 'Decathlon Gear Checklist for Rugged Ghats Trails',
    category: 'Gear & Packing',
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    author: 'Rohan Mehta',
    authorBadge: 'Certified Guide',
    date: '2026-07-15',
    status: 'published',
    content: `Packing for a multi-day trek in the Western Ghats requires a delicate balance between weight and preparedness. The weather here is notoriously volatile; a hot sunny afternoon can turn into a torrential downpour in minutes.\n\nHere are the top 4 essentials we recommend from Decathlon's Quechua range:\n\n1. MH500 Trekking Shoes: Crucial for wet, slippery rock faces. They offer robust ankle support and excellent water-resistance.\n2. Arpenaz 30L Backpack: Perfect size for 2-day hikes. Lightweight, with mesh pockets for easy water bottle access.\n3. Quechua Rain Poncho: Compact and covers both you and your pack. Do not rely on cheap umbrellas that blow away in ridge winds.\n4. Quick-dry synthetic t-shirts: Cotton is your enemy on high-humidity climbs. It retains sweat and causes chills once you reach windy peaks.`
  },
  {
    id: 'blog-3',
    title: 'Trail Safety Protocols: Navigating Sudden Weather Shifts',
    category: 'Safety First',
    coverUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80',
    author: 'Captain Vikram',
    authorBadge: 'Certified Guide',
    date: '2026-07-02',
    status: 'published',
    content: `Safety on high-altitude ridges isn't just about having the right gear; it is about decision-making under pressure. As a guide, the most critical skill I teach is learning when to turn back.\n\nOn a recent hike to Agastyarkoodam, we encountered a sudden thunderstorm. Lighting on an exposed ridge is highly dangerous. We immediately halted our ascent, had the team crouch on their insulated backpacks (to avoid lightning conduction from the wet ground), and waited for the cell to pass.\n\nAlways check local permits and coordinate with forest wardens. Keep a copy of medical vitals handy, pack a basic first-aid kit with rehydration salts, and never trek alone. Remember: the mountains will always be there, but you only have one life.`
  }
];

const INITIAL_TREKS = [
  {
    id: 'netravathi',
    title: 'Netravathi Peak Trek',
    tag: 'Filling Fast!',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    duration: '2 Days / 1 Night',
    difficulty: 'Moderate',
    price: 3499,
    originalPrice: 4499,
    slotsLeft: 4,
    description: 'Trek through lush green shola forests and grassy ridges of Kudremukh range to reach the mist-shrouded peak.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    videoLocal: 'netravathi.mp4',
    dates: ['2026-07-11', '2026-07-18', '2026-07-25'],
    location: 'Chikkamagaluru, Karnataka',
    altitude: '1,520 m / 4,986 ft',
    inclusion: ['Decathlon Quechua Gear', 'Forest Permits', 'Mountaineering Lead', '4 Meals']
  },
  {
    id: 'brahmagiri',
    title: 'Brahmagiri Trek',
    tag: 'Next Batch: July 15',
    tagColor: 'bg-autumn-maple/10 text-autumn-maple border-autumn-maple/20',
    duration: '2 Days',
    difficulty: 'Moderate',
    price: 3299,
    originalPrice: 3999,
    slotsLeft: 12,
    description: 'Cross the border of Coorg into dense forests, wild animal habitats, and climb to the legendary Brahmagiri peak.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    videoLocal: 'brahmagiri.mp4',
    dates: ['2026-07-15', '2026-07-22', '2026-07-29'],
    location: 'Coorg, Karnataka',
    altitude: '1,608 m / 5,275 ft',
    inclusion: ['High-end Tents', 'Wildlife Warden Permit', 'Certified Lead', '3 Meals']
  },
  {
    id: 'vellagavi',
    title: 'Vellagavi Trek',
    tag: 'Premium Trail',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    duration: '3 Days',
    difficulty: 'Challenging',
    price: 5999,
    originalPrice: 7499,
    slotsLeft: 6,
    description: 'An ancient, hidden mountain village trek near Kodaikanal. Steep forest ascents, pine ridges, and deep silence.',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80',
    videoLocal: 'vellagavi.mp4',
    dates: ['2026-07-17', '2026-07-24', '2026-07-31'],
    location: 'Kodaikanal, Tamil Nadu',
    altitude: '2,100 m / 6,890 ft',
    inclusion: ['Decathlon Backpacker Pack', 'Heritage Guide', 'Certified Lead', '7 Meals']
  },
  {
    id: 'banasura',
    title: 'Banasura Hill',
    tag: 'Western Ghats Classic',
    tagColor: 'bg-autumn-maple/10 text-autumn-maple border-autumn-maple/20',
    duration: '2 Days',
    difficulty: 'Moderate',
    price: 2899,
    originalPrice: 3599,
    slotsLeft: 10,
    description: 'Trek the second highest peak in Wayanad district, offering stunning panoramic views of the Banasura Sagar Dam.',
    image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-07-20', '2026-07-27'],
    location: 'Wayanad, Kerala',
    altitude: '2,073 m / 6,801 ft',
    inclusion: ['Camping', 'Forest Permits', 'Guide', '4 Meals']
  },
  {
    id: 'meesapulimala',
    title: 'Meesapulimala',
    tag: 'Alpine Classic',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    duration: '2 Days',
    difficulty: 'Challenging',
    price: 3499,
    originalPrice: 4299,
    slotsLeft: 8,
    description: 'Trek through eight hills and high altitude grasslands to reach the second highest peak in the Western Ghats.',
    image: 'https://images.unsplash.com/photo-1596489379685-ce12b87617b0?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-08-01', '2026-08-08'],
    location: 'Munnar, Kerala',
    altitude: '2,640 m / 8,661 ft',
    inclusion: ['KFDC Permits', 'Base Camp Stay', 'Guide', 'Meals']
  },
  {
    id: 'agastyarkoodam',
    title: 'Agastyarkoodam',
    tag: 'Limited Slots',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    duration: '3 Days',
    difficulty: 'Hard',
    price: 4599,
    originalPrice: 5599,
    slotsLeft: 2,
    description: 'A legendary and rigorous trek through dense forests in the Neyyar Wildlife Sanctuary, known for rare medicinal flora.',
    image: 'https://images.unsplash.com/photo-1518182170546-076616fdcbdd?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-08-15', '2026-08-22'],
    location: 'Trivandrum, Kerala',
    altitude: '1,868 m / 6,129 ft',
    inclusion: ['Forest Dept Permits', 'Dorm Stay', 'Trek Guide']
  },
  {
    id: 'netravathi-gangadikallu',
    title: 'Netravathi & Gangadikallu',
    tag: 'Twin Peak Combo',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    duration: '2 Days',
    difficulty: 'Moderate',
    price: 3899,
    originalPrice: 4899,
    slotsLeft: 14,
    description: 'A combo trek covering the rolling hills of Netravathi and the steep ascent of Gangadikallu in the Kudremukh range.',
    image: 'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-07-25', '2026-08-01'],
    location: 'Chikkamagaluru, Karnataka',
    altitude: '1,520 m / 4,986 ft',
    inclusion: ['Homestay', 'Permits', 'Jeep Ride', 'Meals']
  },
  {
    id: 'silent-valley',
    title: 'Silent Valley',
    tag: 'Rainforest Trail',
    tagColor: 'bg-autumn-maple/10 text-autumn-maple border-autumn-maple/20',
    duration: '2 Days',
    difficulty: 'Easy',
    price: 2999,
    originalPrice: 3499,
    slotsLeft: 12,
    description: 'Explore the core zones of this pristine tropical evergreen forest, a biodiversity hotspot untouched by time.',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-08-10', '2026-08-17'],
    location: 'Palakkad, Kerala',
    altitude: '2,383 m / 7,818 ft',
    inclusion: ['Safari', 'Guide', 'Forest Stay', 'Meals']
  },
  {
    id: 'valley-of-flowers',
    title: 'Valley of Flowers',
    tag: 'Himalayan Bloom',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    duration: '6 Days',
    difficulty: 'Moderate',
    price: 12500,
    originalPrice: 15000,
    slotsLeft: 6,
    description: 'Wander through a UNESCO World Heritage Site bursting with thousands of endemic alpine flowers in full bloom.',
    image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-08-05', '2026-08-15'],
    location: 'Uttarakhand, India',
    altitude: '3,658 m / 12,001 ft',
    inclusion: ['Accommodations', 'Permits', 'Meals', 'Trek Leader']
  },
  {
    id: 'chimmini',
    title: 'Chimmini Climate Walk',
    tag: 'Nature Immersion',
    tagColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    duration: '1 Day',
    difficulty: 'Easy',
    price: 1499,
    originalPrice: 1999,
    slotsLeft: 20,
    description: 'A refreshing walk through the tropical forests around Chimmini Dam, focusing on micro-climates and diverse birdlife.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-07-26', '2026-08-02'],
    location: 'Thrissur, Kerala',
    altitude: '1,116 m / 3,661 ft',
    inclusion: ['Guided Walk', 'Entry Fees', 'Lunch']
  },
  {
    id: 'goechala',
    title: 'Goechala Pass',
    tag: 'High Altitude',
    tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    duration: '11 Days',
    difficulty: 'Hard',
    price: 18500,
    originalPrice: 22000,
    slotsLeft: 5,
    description: 'Get up close with the majestic Mt. Kanchenjunga on this epic high-altitude trek through rhododendron forests.',
    image: 'https://images.unsplash.com/photo-1543883713-3760eb8090bd?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-09-10', '2026-09-25'],
    location: 'Sikkim, India',
    altitude: '4,940 m / 16,207 ft',
    inclusion: ['Tents', 'Permits', 'Porters/Mules', 'Meals']
  },
  {
    id: 'elbrus',
    title: 'Mount Elbrus',
    tag: 'International Summit',
    tagColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    duration: '9 Days',
    difficulty: 'Extreme',
    price: 85000,
    originalPrice: 95000,
    slotsLeft: 4,
    description: 'Conquer the highest peak in Europe. A demanding glacier climb requiring crampons, ice axes, and extreme endurance.',
    image: 'https://images.unsplash.com/photo-1614002622915-18d452d751fb?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-07-15', '2026-08-05'],
    location: 'Caucasus, Russia',
    altitude: '5,642 m / 18,510 ft',
    inclusion: ['Huts', 'Visas', 'Snowcat', 'Guide', 'Meals']
  },
  {
    id: 'peechi',
    title: 'Peechi MoodalMala',
    tag: 'Offbeat Trek',
    tagColor: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
    duration: '1 Day',
    difficulty: 'Moderate',
    price: 1299,
    originalPrice: 1699,
    slotsLeft: 15,
    description: 'An unexplored trail offering spectacular views of the Peechi reservoir and surrounding wildlife sanctuary from the summit.',
    image: 'https://images.unsplash.com/photo-1582200877995-1f9dbce0d62a?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-08-02', '2026-08-09'],
    location: 'Thrissur, Kerala',
    altitude: '900 m / 2,952 ft',
    inclusion: ['Guide', 'Permits', 'Packed Lunch']
  },
  {
    id: 'kudremukh',
    title: 'Kudremukh',
    tag: 'Horse Face Peak',
    tagColor: 'bg-autumn-maple/10 text-autumn-maple border-autumn-maple/20',
    duration: '2 Days',
    difficulty: 'Moderate',
    price: 3299,
    originalPrice: 3999,
    slotsLeft: 10,
    description: 'Trek the third highest peak in Karnataka, known for its distinct horse-face shape and endless rolling green hills.',
    image: 'https://images.unsplash.com/photo-1616053896568-d0dc522e831f?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-07-18', '2026-07-25'],
    location: 'Chikkamagaluru, Karnataka',
    altitude: '1,894 m / 6,214 ft',
    inclusion: ['Homestay', 'Permits', 'Meals', 'Guide']
  },
  {
    id: 'chembra',
    title: 'Chembra Peak',
    tag: 'Heart Lake Trail',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    duration: '1 Day',
    difficulty: 'Moderate',
    price: 1599,
    originalPrice: 2099,
    slotsLeft: 12,
    description: 'Climb the highest peak in Wayanad and witness the famous heart-shaped lake, Hridayasaras, that never dries up.',
    image: 'https://images.unsplash.com/photo-1574305842880-974d6184e037?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-08-16', '2026-08-23'],
    location: 'Wayanad, Kerala',
    altitude: '2,100 m / 6,890 ft',
    inclusion: ['Guide', 'Permit', 'Lunch']
  },
  {
    id: 'thommankuthu',
    title: 'Thommankuthu River Hike',
    tag: 'River Cascade',
    tagColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    duration: '1 Day',
    difficulty: 'Easy',
    price: 999,
    originalPrice: 1299,
    slotsLeft: 20,
    description: 'A scenic 12km hike through a dense forest along a river featuring a series of seven stepped waterfalls.',
    image: 'https://images.unsplash.com/photo-1520624021275-c54d7e2f5baf?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-07-19', '2026-07-26'],
    location: 'Idukki, Kerala',
    altitude: '250 m / 820 ft',
    inclusion: ['Entry Fee', 'Guide', 'Refreshments']
  },
  {
    id: 'phulara',
    title: 'Phulara Ridge',
    tag: 'Ridge Walk',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    duration: '6 Days',
    difficulty: 'Moderate',
    price: 11000,
    originalPrice: 13500,
    slotsLeft: 8,
    description: 'Experience a thrilling ridge walk lasting over 4 hours with 270-degree views of snow-capped Himalayan mountains.',
    image: 'https://images.unsplash.com/photo-1522857432098-750529d3c5f4?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-09-05', '2026-09-12'],
    location: 'Uttarakhand, India',
    altitude: '3,700 m / 12,139 ft',
    inclusion: ['Tents', 'Permits', 'Meals', 'Leader']
  },
  {
    id: 'ebc',
    title: 'Everest Base Camp',
    tag: 'Epic Journey',
    tagColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    duration: '14 Days',
    difficulty: 'Hard',
    price: 65000,
    originalPrice: 75000,
    slotsLeft: 3,
    description: 'Walk in the footsteps of legends to the base of the world\'s highest mountain. Experience Sherpa culture and stunning vistas.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    dates: ['2026-10-01', '2026-10-15'],
    location: 'Khumbu, Nepal',
    altitude: '5,364 m / 17,598 ft',
    inclusion: ['Teahouses', 'Permit', 'Guide/Porter', 'Meals']
  }
];

const SAFETY_STANDARDS = [
  'Certified Wilderness First Aid Leads (WFR)',
  'Oxygen cylinders & medical rescue kits carried on all high trails',
  'Eco-waste clearance matching Leave No Trace (LNT) guidelines',
  'Decathlon certified rugged outdoor camping equipment only',
  'Real-time emergency tracking and satellite coordination (where supported)'
];

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

const EXPEDITION_RECORDS = [
  { id: 'BP-589142', title: 'Netravathi Peak Trek', date: '2026-07-11', trekkers: 2, price: 6998, status: 'Confirmed' },
  { id: 'BP-218491', title: 'Brahmagiri Trek', date: '2025-11-20', trekkers: 1, price: 3299, status: 'Completed' },
  { id: 'BP-109283', title: 'Vellagavi Trek', date: '2024-05-15', trekkers: 3, price: 17997, status: 'Completed' }
];

export default function App() {
  const [treks, setTreks] = useState(INITIAL_TREKS);
  const [currentHash, setCurrentHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % HERO_MEDIA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeHeroIndex]);

  const [showAllTreks, setShowAllTreks] = useState(false);
  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem('bootpaths_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  useEffect(() => {
    localStorage.setItem('bootpaths_blogs', JSON.stringify(blogs));
  }, [blogs]);

  const [detailedTrek, setDetailedTrek] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState(INITIAL_TREKS[0]);
  const [selectedDate, setSelectedDate] = useState(INITIAL_TREKS[0].dates[0]);
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
  const [user, setUser] = useState(null); // { name: 'John Doe', email: 'john@example.com', initials: 'JD', photo: null }
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authErrors, setAuthErrors] = useState({});
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Customer Dashboard State
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('bookings'); // 'bookings' or 'profile'
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    mobile: '',
    bloodGroup: '',
    emergencyContact: '',
    medicalConditions: ''
  });

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
  const currentSlotsLeft = selectedTrek.slotsLeft;
  const totalPrice = selectedTrek.price * numTrekkers;

  // Handle trek change in the widget
  const handleTrekChange = (trekId) => {
    const trek = treks.find(t => t.id === trekId);
    if (trek) {
      setSelectedTrek(trek);
      setSelectedDate(trek.dates[0]);
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
      setSelectedDate(action.payload.dates[0]);
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

  const handleLogout = () => {
    setUser(null);
  };

  const handleAuthSubmit = (e) => {
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

    setTimeout(() => {
      setIsAuthenticating(false);
      const displayName = authMode === 'register' ? authName : authEmail.split('@')[0];
      const initials = displayName.substring(0, 2).toUpperCase();
      const newUser = {
        name: displayName,
        email: authEmail,
        initials: initials,
        photo: null
      };
      setUser(newUser);
      setIsAuthModalOpen(false);
      
      // Auto-fill checkout fields for user convenience
      setName(displayName);
      setEmail(authEmail);
      
      // Complete pending action
      if (pendingAction) {
        executeAction(pendingAction);
        setPendingAction(null);
      } else {
        setIsDashboardOpen(true);
      }
      
      // Reset auth form states
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    }, 1200);
  };

  const handleOAuth = (provider) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const nameMap = { google: 'Google Explorer', github: 'GitHub Hiker' };
      const emailMap = { google: 'google@bootpaths.com', github: 'github@bootpaths.com' };
      const initialsMap = { google: 'GE', github: 'GH' };
      
      const newUser = {
        name: nameMap[provider],
        email: emailMap[provider],
        initials: initialsMap[provider],
        photo: null
      };
      setUser(newUser);
      setIsAuthModalOpen(false);

      // Auto-fill checkout fields
      setName(nameMap[provider]);
      setEmail(emailMap[provider]);

      if (pendingAction) {
        executeAction(pendingAction);
        setPendingAction(null);
      } else {
        setIsDashboardOpen(true);
      }
    }, 1000);
  };

  const handleContinueAsGuest = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const newUser = {
        name: 'Guest Hiker',
        email: 'guest@bootpaths.com',
        initials: 'GH',
        photo: null
      };
      setUser(newUser);
      setIsAuthModalOpen(false);

      setName('Guest Hiker');
      setEmail('guest@bootpaths.com');

      if (pendingAction) {
        executeAction(pendingAction);
        setPendingAction(null);
      } else {
        setIsDashboardOpen(true);
      }
    }, 800);
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
    setName('');
    setEmail('');
    setPhone('');
    setNumTrekkers(1);
    setIsDashboardOpen(true); // Open dashboard to view the confirmed booking
  };

  if (currentHash === '#admin') {
    return (
      <AdminConsole 
        treks={treks} 
        setTreks={setTreks} 
        blogs={blogs}
        setBlogs={setBlogs}
        onReturnToSite={() => { window.location.hash = ''; }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-autumn-mist text-autumn-bark font-sans selection:bg-autumn-maple selection:text-black">
      
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full border-b border-autumn-bark/10 bg-autumn-mist/70 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img 
              src="logo.jpg" 
              alt="BOOTpaths Logo" 
              className="h-10 w-10 rounded-full object-cover border border-autumn-bark/10 transition-transform duration-300 group-hover:scale-105 group-hover:border-autumn-maple/50"
            />
            <span className="font-outfit text-2xl font-black uppercase tracking-wider text-autumn-bark md:text-3xl">
              BOOT<span className="text-autumn-maple">paths</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#upcoming-treks" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
              Upcoming Treks
            </a>
            <a href="#safety-standards" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
              Safety Standards
            </a>
            <a href="#advantage" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
              Our Crew
            </a>
            <a href="#community" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
              Community
            </a>
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
                href="#safety-standards" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
              >
                Safety Standards
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
              <hr className="my-2 border-autumn-bark/10" />
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-1 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-autumn-maple font-outfit text-md font-bold text-[#F3ECDD] shadow-md">
                      {user.initials}
                    </div>
                    <div>
                      <div className="font-outfit text-sm font-bold text-autumn-bark">{user.name}</div>
                      <div className="text-xxs text-autumn-bark/50">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex h-12 w-full items-center justify-center rounded-lg border border-autumn-bark/10 bg-[#EFE8D6]/40 font-outfit text-sm font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-colors"
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
        {/* Full-Bleed Background Media Stack with Cross-Fade */}
        {HERO_MEDIA.map((media, idx) => {
          const isActive = idx === activeHeroIndex;
          return (
            <div
              key={media.src}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out z-0 ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <video
                src={media.src}
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
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
            <a 
              href="#safety-standards" 
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border border-[#F3ECDD]/10 bg-[#3A2A1E]/30 px-8 font-outfit text-sm font-bold uppercase tracking-wider text-[#F3ECDD] backdrop-blur-sm transition-all duration-300 hover:bg-[#3A2A1E] hover:text-white"
            >
              Safety Standards
            </a>
          </div>

        </div>

        {/* Floating Tiles Grid Switcher */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 z-20 backdrop-blur-md bg-[#3A2A1E]/60 border border-[#C1571F]/30 rounded-2xl p-2.5 shadow-2xl flex flex-col items-center sm:items-start max-w-[95vw] sm:max-w-sm">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#F3ECDD]/60 mb-2 px-1">
            Expedition Views
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full">
            {HERO_MEDIA.map((media, idx) => {
              const isActive = idx === activeHeroIndex;
              return (
                <button
                  key={media.src}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden border transition-all duration-300 group shrink-0 ${
                    isActive 
                      ? 'border-[#C1571F] ring-2 ring-[#C1571F] scale-105 shadow-[0_0_15px_rgba(193,87,31,0.5)]' 
                      : 'border-[#F3ECDD]/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={media.thumbnail}
                    alt={media.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
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
                      {trek.inclusion.slice(0, 4).map((inc, i) => (
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
                    value={selectedTrek.id}
                    onChange={(e) => handleTrekChange(e.target.value)}
                  >
                    {treks.map(t => (
                      <option key={t.id} value={t.id}>{t.title} (₹{t.price})</option>
                    ))}
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
                      className="w-full h-12 rounded-lg border border-autumn-bark/10 bg-autumn-mist px-4 text-sm text-autumn-bark transition-colors focus:border-autumn-maple focus:outline-none"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    >
                      {selectedTrek.dates.map(date => {
                        const parsedDate = new Date(date);
                        const formattedDate = parsedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                        return (
                          <option key={date} value={date}>{formattedDate}</option>
                        );
                      })}
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
                        disabled={numTrekkers <= 1}
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
                        disabled={numTrekkers >= currentSlotsLeft}
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

                {/* Razorpay Simulation Trigger Button */}
                <button
                  type="submit"
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-autumn-maple font-outfit text-sm font-bold uppercase tracking-wider text-[#F3ECDD] transition-all duration-300 hover:bg-[#a44717] hover:shadow-[0_0_20px_rgba(193,87,31,0.3)]"
                >
                  Secure Reservation
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

            </div>

            {/* Right: Dynamic Pricing Card Column (5 cols) */}
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
                          ? `Only ${currentSlotsLeft} vacancies left. Prices may rise shortly for this peak batch.` 
                          : `${currentSlotsLeft} slots remaining on selected dates.`}
                      </p>
                    </div>
                  </div>
                </div>
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
                    <span className="font-outfit text-3xl font-black text-autumn-bark block">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xxs text-autumn-bark/50 uppercase tracking-widest block mt-0.5">
                      + Inclusive of Taxes
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SAFETY STANDARDS SECTION (Eco-Portal Style details) */}
      <section id="safety-standards" className="relative border-t border-autumn-bark/10 bg-[#EFE8D6]/10 py-24 px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-12 items-center">
            
            {/* Left: Certifications Grid */}
            <div className="md:col-span-5 space-y-6">
              <span className="font-outfit text-xs font-bold tracking-widest uppercase text-autumn-maple">
                Eco-Tourism Protocols
              </span>
              <h2 className="font-outfit text-3xl font-black tracking-tight text-autumn-bark sm:text-4xl">
                Rigorous Safety Checklists
              </h2>
              <p className="text-sm leading-relaxed text-autumn-bark/70">
                Structured like official state forest eco-tourism divisions. Every single batch goes through strict validation before departure.
              </p>

              <div className="flex items-center gap-4 rounded-lg border border-autumn-bark/10 bg-[#EFE8D6]/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-autumn-maple/10 text-autumn-maple">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-autumn-bark/80 uppercase tracking-wider">Forest Dept. Authorized</h4>
                  <p className="text-xxs text-autumn-bark5 mt-0.5">Permits and approvals sorted. No illegal access trails.</p>
                </div>
              </div>
            </div>

            {/* Right: Checklist Cards */}
            <div className="md:col-span-7 rounded-xl border border-autumn-bark/10 bg-autumn-mist p-8">
              <h3 className="font-outfit text-sm font-bold uppercase tracking-widest text-autumn-bark/70 mb-6 border-b border-autumn-bark/10 pb-3 flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-autumn-maple" />
                Wilderness Safety Standards
              </h3>
              
              <ul className="space-y-4">
                {SAFETY_STANDARDS.map((std, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-autumn-maple text-[#F3ECDD] mt-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-xs text-autumn-bark/80 leading-normal">{std}</span>
                  </li>
                ))}
              </ul>
            </div>

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
            {INSTAGRAM_POSTS.map((post) => (
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
            <a href="#" className="flex items-center gap-3">
              <img 
                src="logo.jpg" 
                alt="BOOTpaths Logo" 
                className="h-8 w-8 rounded-full object-cover border border-autumn-bark/10"
              />
              <span className="font-outfit text-xl font-black uppercase tracking-wider text-autumn-bark">
                BOOT<span className="text-autumn-maple">paths</span>
              </span>
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
            <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Safety & Standards</h4>
            <ul className="space-y-2.5 text-autumn-bark/50">
              <li><a href="#safety-standards" className="hover:text-autumn-maple transition-colors">Wilderness Medicine</a></li>
              <li><a href="#safety-standards" className="hover:text-autumn-maple transition-colors">Green Trails Policy</a></li>
              <li><a href="#advantage" className="hover:text-autumn-maple transition-colors">Decathlon Partnership</a></li>
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
            <a href="#" className="hover:text-autumn-bark/70">Terms of Service</a>
            <a href="#" className="hover:text-autumn-bark/70">Privacy Policy</a>
            <a href="#" className="hover:text-autumn-bark/70">Refund Guidelines</a>
            <a href="#admin" className="hover:text-autumn-maple font-bold transition-colors">Admin Console</a>
          </div>
        </div>
      </footer>

      {/* RAZORPAY SECURE PAYMENT PORTAL SIMULATOR MODAL */}
      {isRazorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-autumn-mist/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-autumn-bark/10 bg-[#EFE8D6] shadow-2xl animate-in zoom-in-95 duration-250">
            
            {/* Razorpay Top Banner */}
            <div className="bg-autumn-mist p-6 flex justify-between items-center border-b border-autumn-bark/10">
              <div className="flex items-center gap-3">
                <img 
                  src="logo.jpg" 
                  alt="BOOTpaths Logo" 
                  className="h-8 w-8 rounded-full object-cover border border-autumn-bark/10"
                />
                <div>
                  <span className="font-outfit text-sm font-bold uppercase tracking-wider text-autumn-bark">
                    BOOTpaths
                  </span>
                  <span className="block text-xxs text-autumn-bark/50 tracking-wider">RAZORPAY SECURE API</span>
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
                      <span className="text-xs font-bold text-autumn-bark/80 block mt-1">{selectedTrek.title}</span>
                      <span className="text-xxs text-autumn-bark5 mt-0.5 block">Batch Date: {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
                  <div className="text-xxs text-autumn-bark/70"><span className="font-bold text-autumn-bark/80">Destination:</span> {selectedTrek.title}</div>
                  <div className="text-xxs text-autumn-bark/70"><span className="font-bold text-autumn-bark/80">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
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
                <div className="space-y-4 border-l-2 border-[#6E7042]/20 pl-4 ml-2">
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
              </div>

              {/* Inclusions */}
              <div>
                <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-maple mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Inclusions
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {detailedTrek.inclusion.map((inc, i) => (
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
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-955/40 p-4 backdrop-blur-[20px] animate-in fade-in duration-[350ms] ease-out">
          <div 
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-autumn-maple/20 shadow-[inset_0_1px_2px_rgba(52,211,153,0.15),0_15px_35px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-[350ms] ease-out"
            style={{ background: 'rgba(18, 30, 26, 0.45)' }}
          >
            
            {/* Auth Top Header */}
            <div className="bg-autumn-mist/30 p-5 flex justify-between items-center border-b border-autumn-bark/10">
              <div className="flex items-center gap-3">
                <img 
                  src="logo.jpg" 
                  alt="BOOTpaths Logo" 
                  className="h-8 w-8 rounded-full object-cover border border-autumn-bark/10"
                />
                <div>
                  <span className="font-outfit text-sm font-bold uppercase tracking-wider text-autumn-bark drop-shadow-sm">
                    BOOTpaths Identity
                  </span>
                  <span className="block text-[10px] text-autumn-maple tracking-wider font-extrabold uppercase drop-shadow-sm">Decathlon Partner Portal</span>
                </div>
              </div>
              <button 
                onClick={() => setIsAuthModalOpen(false)}
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
                      onClick={() => handleOAuth('google')}
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
      )}

      {/* CUSTOMER PROFILE & BOOKING HISTORY DASHBOARD */}
      {isDashboardOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-autumn-mist/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-3xl border border-autumn-bark/10 bg-autumn-mist/40 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-250">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsDashboardOpen(false)}
              className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-[#EFE8D6]/60 flex items-center justify-center text-autumn-bark/70 hover:text-autumn-maple transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Sidebar / Tabs */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-autumn-bark/10 bg-autumn-mist/60 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-autumn-maple/20 text-autumn-maple font-outfit text-xl font-bold border border-autumn-maple/30 shadow-[0_0_15px_rgba(193,87,31,0.2)]">
                  {user.initials}
                </div>
                <div>
                  <h3 className="font-outfit text-sm font-bold text-autumn-bark">{user.name}</h3>
                  <span className="text-xxs text-autumn-bark/50 uppercase tracking-widest block truncate w-32">{user.email}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
                <button 
                  onClick={() => setDashboardTab('bookings')}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${dashboardTab === 'bookings' ? 'bg-autumn-maple/10 text-autumn-maple border border-autumn-maple/20' : 'text-autumn-bark/70 hover:bg-[#EFE8D6]/50 hover:text-autumn-bark border border-transparent'}`}
                >
                  <Calendar className="h-4 w-4" />
                  Expeditions
                </button>
                <button 
                  onClick={() => setDashboardTab('profile')}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${dashboardTab === 'profile' ? 'bg-autumn-maple/10 text-autumn-maple border border-autumn-maple/20' : 'text-autumn-bark/70 hover:bg-[#EFE8D6]/50 hover:text-autumn-bark border border-transparent'}`}
                >
                  <User className="h-4 w-4" />
                  Hiker Profile
                </button>
              </div>

              <div className="mt-auto hidden md:block">
                <button 
                  onClick={() => { setIsDashboardOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-autumn-bark/50 hover:text-rose-400 transition-colors focus:outline-none"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out Securely
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-br from-stone-950/20 to-stone-900/10">
              
              {dashboardTab === 'bookings' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-8">
                    <h2 className="font-outfit text-3xl font-black text-autumn-bark tracking-tight">Expedition Records</h2>
                    <p className="text-sm text-autumn-bark/70 mt-1">Your confirmed wilderness passes and historical trails.</p>
                  </div>

                  <div className="space-y-4">
                    {EXPEDITION_RECORDS.map((record, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-autumn-bark/10 bg-autumn-mist/40 backdrop-blur-md transition-colors hover:border-autumn-maple/30 hover:bg-[#EFE8D6]/40">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xxs font-mono text-autumn-bark/50 bg-[#EFE8D6] px-2 py-0.5 rounded border border-autumn-bark/10">
                              {record.id}
                            </span>
                            <span className={`text-xxs font-bold uppercase tracking-widest flex items-center gap-1.5 ${record.status === 'Confirmed' ? 'text-autumn-maple' : 'text-autumn-bark/50'}`}>
                              {record.status === 'Confirmed' && <span className="flex h-1.5 w-1.5 rounded-full bg-autumn-maple animate-pulse"></span>}
                              {record.status}
                            </span>
                          </div>
                          <h4 className="font-outfit text-lg font-bold text-autumn-bark mt-1">{record.title}</h4>
                          <span className="text-xs text-autumn-bark/70 flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-autumn-bark/10 pt-4 sm:pt-0">
                          <span className="text-xs text-autumn-bark/70">{record.trekkers} Explorer{record.trekkers > 1 ? 's' : ''}</span>
                          <span className="font-outfit text-xl font-black text-autumn-maple">₹{record.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dashboardTab === 'profile' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-8">
                    <h2 className="font-outfit text-3xl font-black text-autumn-bark tracking-tight">Hiker Vital Profile</h2>
                    <p className="text-sm text-autumn-bark/70 mt-1">Manage your wilderness credentials and emergency protocols.</p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setIsSavingProfile(true);
                      setTimeout(() => {
                        setIsSavingProfile(false);
                        alert("Database Mutation Hook: Profile synchronized to Firestore successfully!");
                      }, 1200);
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/50 mb-2">Legal Full Name</label>
                        <input 
                          type="text"
                          value={profileData.fullName || user.name}
                          onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl border border-autumn-bark/10 bg-autumn-mist/50 text-sm text-autumn-bark placeholder-autumn-bark/35 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all duration-200"
                          placeholder="As per Government ID"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/50 mb-2">Contact Mobile</label>
                        <input 
                          type="tel"
                          value={profileData.mobile}
                          onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl border border-autumn-bark/10 bg-autumn-mist/50 text-sm text-autumn-bark placeholder-autumn-bark/35 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all duration-200"
                          placeholder="+91 00000 00000"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/50 mb-2">Blood Group</label>
                        <div className="relative">
                          <select 
                            value={profileData.bloodGroup}
                            onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}
                            className="w-full h-12 px-4 rounded-xl border border-autumn-bark/10 bg-autumn-mist/50 text-sm text-autumn-bark focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all duration-200 appearance-none"
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
                          <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-autumn-bark/50 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/50 mb-2">Emergency Contact</label>
                        <input 
                          type="tel"
                          value={profileData.emergencyContact}
                          onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl border border-autumn-bark/10 bg-autumn-mist/50 text-sm text-autumn-bark placeholder-autumn-bark/35 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all duration-200"
                          placeholder="Family or Guardian"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/50 mb-2">Medical Conditions / Allergies</label>
                      <textarea 
                        rows="4"
                        value={profileData.medicalConditions}
                        onChange={(e) => setProfileData({...profileData, medicalConditions: e.target.value})}
                        className="w-full p-4 rounded-xl border border-autumn-bark/10 bg-autumn-mist/50 text-sm text-autumn-bark placeholder-autumn-bark/35 focus:outline-none focus:ring-1 focus:ring-autumn-maple focus:border-autumn-maple transition-all duration-200 resize-none"
                        placeholder="List any altitude sickness history, asthma, or severe allergies crucial for our medics."
                      ></textarea>
                    </div>

                    <div className="pt-4 border-t border-autumn-bark/10 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-autumn-maple px-8 font-outfit text-xs font-bold uppercase tracking-widest text-[#F3ECDD] transition-all hover:bg-[#a44717] focus:outline-none focus:ring-2 focus:ring-autumn-maple focus:ring-offset-2 focus:ring-offset-stone-950 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(193,87,31,0.2)]"
                      >
                        {isSavingProfile ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-950 border-t-transparent"></div>
                            Synchronizing...
                          </>
                        ) : (
                          <>Save Profile Configurations</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
