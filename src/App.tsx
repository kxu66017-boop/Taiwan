/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, Map as MapIcon, Utensils, Heart, LogIn, Menu, Star, 
  MapPin, DollarSign, MessageCircle, Send, Award, Flame, ThumbsUp,
  ArrowLeft, Trash2, Settings, MessageSquare, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ============ TYPES ============
interface Food {
  id: number;
  name: string;
  region: string;
  city: string;
  emoji: string;
  rating: number;
  price: string;
  reviews: number;
  desc: string;
  tags: string[];
  type: string;
  featured: boolean;
  latest: boolean;
}

interface Review {
  id: string;
  foodId: number;
  foodName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Recommendation {
  id: string;
  restaurant: string;
  food: string;
  region: string;
  rating: number;
  comment: string;
  date: string;
}

// ============ DATA ============
const FOOD_DATA: Food[] = [
  { id: 1, name: "滷肉飯", region: "北部", city: "台北", emoji: "🍚", rating: 4.8, price: "$40-65", reviews: 24, desc: "細碎豬肉以醬油、五香慢滷，淋上Q彈白飯，是台灣最具代表性的庶民美食。", tags: ["飯類", "經典"], type: "飯類", featured: true, latest: false },
  { id: 2, name: "牛肉麵", region: "北部", city: "台北", emoji: "🍜", rating: 4.9, price: "$150-220", reviews: 31, desc: "紅燒或清燉湯頭，搭配軟嫩牛腱與手工麵條，是台北最具國際知名度的料理。", tags: ["麵類", "湯品"], type: "麵類", featured: true, latest: false },
  { id: 3, name: "小籠包", region: "北部", city: "台北", emoji: "🥟", rating: 4.7, price: "$100-250", reviews: 19, desc: "薄皮內包裹鮮美湯汁與豬肉餡，輕咬一口，湯汁四溢，功夫盡在摺痕之中。", tags: ["點心", "經典"], type: "點心", featured: true, latest: false },
  { id: 4, name: "珍珠奶茶", region: "中部", city: "台中", emoji: "🧋", rating: 4.6, price: "$45-75", reviews: 42, desc: "Q彈粉圓沉浮於香濃奶茶之中，源自台中的世界級飲品，甜度冰塊客製化。", tags: ["飲品", "經典"], type: "飲品", featured: false, latest: true },
  { id: 5, name: "太陽餅", region: "中部", city: "台中", emoji: "🥮", rating: 4.3, price: "$25-50", reviews: 15, desc: "層層酥皮包裹麥芽糖內餡，酥鬆香甜，是台中最具代表性的伴手禮。", tags: ["點心", "伴手禮"], type: "點心", featured: false, latest: false },
  { id: 6, name: "擔仔麵", region: "南部", city: "台南", emoji: "🍜", rating: 4.5, price: "$50-80", reviews: 28, desc: "小碗裝盛，以蝦頭熬製高湯為底，佐以肉燥與鮮蝦，台南小吃的精髓所在。", tags: ["麵類", "經典"], type: "麵類", featured: true, latest: false },
  { id: 7, name: "棺材板", region: "南部", city: "台南", emoji: "🍞", rating: 4.2, price: "$60-90", reviews: 12, desc: "炸至金黃的厚片吐司挖空填入奶油海鮮濃湯，外酥內滑，台南獨有創意小吃。", tags: ["點心", "創意"], type: "點心", featured: false, latest: true },
  { id: 8, name: "蚵仔煎", region: "南部", city: "台南", emoji: "🥚", rating: 4.6, price: "$50-70", reviews: 35, desc: "鮮蚵與雞蛋、地瓜粉漿在鐵板上煎成，淋上甜辣醬，夜市人氣王。", tags: ["小吃", "經典"], type: "小吃", featured: true, latest: false },
  { id: 9, name: "麻糬", region: "東部", city: "花蓮", emoji: "🍡", rating: 4.4, price: "$30-60", reviews: 18, desc: "花蓮名產，以糯米搗成彈牙外皮，內包花生或紅豆餡，口感軟糯香甜。", tags: ["點心", "伴手禮"], type: "點心", featured: false, latest: false },
  { id: 10, name: "鹽酥雞", region: "北部", city: "台北", emoji: "🍗", rating: 4.7, price: "$70-120", reviews: 38, desc: "炸得金黃酥脆的雞塊，撒上九層塔與椒鹽，台灣夜市最療癒的宵夜選擇。", tags: ["小吃", "夜市"], type: "小吃", featured: true, latest: false },
  { id: 11, name: "肉圓", region: "中部", city: "彰化", emoji: "🟤", rating: 4.5, price: "$40-60", reviews: 22, desc: "外皮以地瓜粉蒸或炸製成半透明狀，內裹豬肉與筍丁，佐以甜醬，彰化代表。", tags: ["小吃", "經典"], type: "小吃", featured: false, latest: true },
  { id: 12, name: "烤飛魚", region: "東部", city: "蘭嶼", emoji: "🐟", rating: 4.3, price: "$100-180", reviews: 11, desc: "達悟族傳統料理，新鮮飛魚以鹽醃後炭烤，海洋的原始鮮味，蘭嶼限定。", tags: ["海鮮", "原住民"], type: "海鮮", featured: false, latest: false },
];

const REGIONS = ["全部", "北部", "中部", "南部", "東部"];
const TYPES = ["全部", "飯類", "麵類", "小吃", "點心", "飲品", "海鮮"];

type Page = 'home' | 'search' | 'map' | 'recommend' | 'account' | 'detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const showDetail = (id: number) => {
    setSelectedFoodId(id);
    setCurrentPage('detail');
  };

  const navItems = [
    { id: 'home', label: '首頁', icon: <Utensils className="w-4 h-4" /> },
    { id: 'search', label: '搜尋', icon: <Search className="w-4 h-4" /> },
    { id: 'map', label: '地圖', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'recommend', label: '推薦', icon: <ThumbsUp className="w-4 h-4" /> },
    { id: 'account', label: '帳戶', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col grain">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-stone-200/60 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <span className="text-2xl drop-shadow-sm">🍜</span>
            <span className="font-display font-bold text-xl text-stone-800 tracking-tight">台灣美食探索</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-stone-100 rounded-full px-1.5 py-1.5">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  currentPage === item.id 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-800 hover:bg-white/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-[#7ea8c4] text-white hover:bg-[#6a94b0] shadow-sm transition-all hover:shadow-md active:scale-95">
              <LogIn className="w-4 h-4" /> 登入
            </button>
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-stone-100 active:bg-stone-200 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-stone-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-stone-200 bg-white/95 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                {navItems.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id as Page); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                      currentPage === item.id ? 'bg-red-50 text-red-600' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <HomeView 
              key="home" 
              onNavigate={setCurrentPage} 
              onShowDetail={showDetail} 
              favorites={favorites} 
              onToggleFavorite={toggleFavorite} 
            />
          )}
          {currentPage === 'search' && (
            <SearchView 
              key="search" 
              onShowDetail={showDetail} 
              favorites={favorites} 
              onToggleFavorite={toggleFavorite} 
            />
          )}
          {currentPage === 'map' && (
            <MapView 
              key="map" 
              onShowDetail={showDetail} 
              favorites={favorites} 
              onToggleFavorite={toggleFavorite} 
            />
          )}
          {currentPage === 'recommend' && (
            <RecommendView 
              key="recommend" 
              onAddRecommendation={(rec) => setRecommendations(prev => [rec, ...prev])} 
              recommendations={recommendations}
              onDelete={id => setRecommendations(prev => prev.filter(r => r.id !== id))}
            />
          )}
          {currentPage === 'account' && (
            <AccountView 
              key="account" 
              favorites={favorites} 
              onShowDetail={showDetail} 
              onToggleFavorite={toggleFavorite}
              userReviews={userReviews}
              onAddReview={(rev) => setUserReviews(prev => [rev, ...prev])}
              onDeleteReview={id => setUserReviews(prev => prev.filter(r => r.id !== id))}
            />
          )}
          {currentPage === 'detail' && selectedFoodId !== null && (
            <DetailView 
              key="detail" 
              food={FOOD_DATA.find(f => f.id === selectedFoodId)!} 
              onBack={() => setCurrentPage('home')} 
              isFavorite={favorites.includes(selectedFoodId)}
              onToggleFavorite={() => toggleFavorite(selectedFoodId)}
              reviews={userReviews.filter(r => r.foodId === selectedFoodId)}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-display font-bold text-white text-xl mb-2">台灣美食探索</h2>
            <p className="text-sm max-w-xs">致力於推廣台灣在地美食魅力，串聯從北到南、從東到西每一口道地驚喜。</p>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">關於我們</a>
            <a href="#" className="hover:text-white transition-colors">隱私權條款</a>
            <a href="#" className="hover:text-white transition-colors">聯絡我們</a>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition-colors cursor-pointer">FB</div>
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition-colors cursor-pointer">IG</div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-stone-800 mt-8 pt-8 text-center text-xs">
          &copy; 2026 台灣美食探索平台. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function FoodCard({ food, onShowDetail, isFavorite, onToggleFavorite }: any) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div 
        className="h-48 bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center relative cursor-pointer"
        onClick={() => onShowDetail(food.id)}
      >
        <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{food.emoji}</span>
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">{food.region}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(food.id); }}
          className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-lg transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-stone-300 hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-stone-800 text-lg group-hover:text-red-700 transition-colors">{food.name}</h3>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
            <Star className="w-3.5 h-3.5 fill-current" /> {food.rating}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500 mb-3 font-medium">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {food.city}</span>
          <span className="text-stone-900">{food.price}</span>
        </div>
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4 h-10">{food.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {food.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-stone-50 text-stone-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HomeView({ onNavigate, onShowDetail, favorites, onToggleFavorite }: any) {
  const featured = FOOD_DATA.filter(f => f.featured).slice(0, 3);
  const latest = FOOD_DATA.filter(f => f.latest).slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <header className="hero-pattern py-20 sm:py-32 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="text-7xl mb-6 inline-block"
          >
            🇹🇼
          </motion.div>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-stone-900 leading-tight mb-6 drop-shadow-sm">
            台灣美食探索
          </h1>
          <p className="font-display text-lg sm:text-2xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            從北到南，一口一故事，探索島嶼上最道地的滋味
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button 
              onClick={() => onNavigate('search')}
              className="px-8 py-3.5 bg-stone-900 text-white rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:bg-stone-800 active:scale-95 flex items-center gap-2 group"
            >
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 快速搜尋
            </button>
            <button 
              onClick={() => onNavigate('map')}
              className="px-8 py-3.5 bg-stone-200 text-stone-900 rounded-full font-bold hover:bg-stone-300 transition-all active:scale-95 flex items-center gap-2"
            >
              <MapIcon className="w-5 h-5" /> 美食地圖
            </button>
          </div>

          <div className="mt-16 flex justify-center gap-12 sm:gap-24">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-stone-900">{FOOD_DATA.length}</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">道特色美食</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-stone-900">4</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">大地理區域</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-stone-900">{favorites.length}</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">個人收藏清單</span>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">⭐</div>
             <h2 className="font-display font-bold text-3xl text-stone-800">熱門推薦</h2>
          </div>
          <button onClick={() => onNavigate('search')} className="text-sm font-bold text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1">查看全部 <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(f => (
            <FoodCard 
              key={f.id} 
              food={f} 
              onShowDetail={onShowDetail} 
              isFavorite={favorites.includes(f.id)} 
              onToggleFavorite={onToggleFavorite} 
            />
          ))}
        </div>

        <div className="mt-24 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl">🆕</div>
             <h2 className="font-display font-bold text-3xl text-stone-800">最新發現</h2>
          </div>
          <button onClick={() => onNavigate('search')} className="text-sm font-bold text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1">查看全部 <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest.map(f => (
            <FoodCard 
              key={f.id} 
              food={f} 
              onShowDetail={onShowDetail} 
              isFavorite={favorites.includes(f.id)} 
              onToggleFavorite={onToggleFavorite} 
            />
          ))}
        </div>

        <div className="mt-24 p-10 sm:p-16 rounded-[2.5rem] bg-gradient-to-br from-stone-900 to-stone-800 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl scale-150">🍜</div>
          <div className="relative z-10 max-w-xl">
             <h3 className="font-display font-black text-3xl sm:text-4xl mb-6 leading-tight">準備好探索這座島嶼的驚喜了嗎？</h3>
             <p className="text-stone-300 text-lg mb-10 leading-relaxed">我們收集了全國超過千位老饕的心得，只為讓你在下一個街角遇見最難忘的滋味。</p>
             <div className="flex gap-4 flex-wrap">
               <button onClick={() => onNavigate('map')} className="px-8 py-3.5 bg-white text-stone-900 rounded-full font-bold hover:bg-stone-50 transition-all active:scale-95 shadow-lg">立即探索美食地圖</button>
               <button onClick={() => onNavigate('search')} className="px-8 py-3.5 border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all active:scale-95">進階智能搜尋</button>
             </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function SearchView({ onShowDetail, favorites, onToggleFavorite }: any) {
  const [query, setQuery] = useState("");
  
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return FOOD_DATA.filter(f => 
      f.name.includes(query) || 
      f.city.includes(query) || 
      f.desc.includes(query) ||
      f.type.includes(query)
    );
  }, [query]);

  const rankings = useMemo(() => {
    const byRating = [...FOOD_DATA].sort((a, b) => b.rating - a.rating).slice(0, 5);
    const byPopular = [...FOOD_DATA].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
    return { byRating, byPopular };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display font-black text-4xl text-stone-900 mb-2">快速搜尋</h1>
          <p className="text-stone-500 font-medium">只要輸入關鍵字，就能在彈指間找到您的下一個目標</p>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋餐廳、地區或美食類別..." 
            className="w-full pl-12 pr-6 py-4 rounded-2xl border-none bg-white shadow-xl focus:ring-2 focus:ring-red-500/20 text-stone-800 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
          <h3 className="font-display font-bold text-xl text-stone-800 mb-6 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-lg"><Award className="w-5 h-5 text-amber-600" /></div>
             老饕評分排行
          </h3>
          <div className="space-y-4">
            {rankings.byRating.map((f, i) => (
              <div 
                key={f.id} 
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-all cursor-pointer group"
                onClick={() => onShowDetail(f.id)}
              >
                <span className={`w-8 text-center font-black text-xl ${i < 3 ? 'text-red-500' : 'text-stone-300'}`}>{i + 1}</span>
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all scale-100 group-hover:scale-125">{f.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-800 truncate">{f.name}</p>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">{f.city}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                  <Star className="w-4 h-4 fill-current" /> {f.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
          <h3 className="font-display font-bold text-xl text-stone-800 mb-6 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-lg"><Flame className="w-5 h-5 text-red-600" /></div>
             近期討論焦點
          </h3>
          <div className="space-y-4">
            {rankings.byPopular.map((f, i) => (
              <div 
                key={f.id} 
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-all cursor-pointer group"
                onClick={() => onShowDetail(f.id)}
              >
                <span className={`w-8 text-center font-black text-xl ${i < 3 ? 'text-amber-500' : 'text-stone-300'}`}>{i + 1}</span>
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all scale-100 group-hover:scale-125">{f.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-800 truncate">{f.name}</p>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">{f.reviews} 則食記</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-tighter">HOT</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="font-display font-bold text-2xl text-stone-800 mb-8 border-l-4 border-red-500 pl-4">搜尋結果</h3>
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map(f => (
              <FoodCard 
                key={f.id} 
                food={f} 
                onShowDetail={onShowDetail} 
                isFavorite={favorites.includes(f.id)} 
                onToggleFavorite={onToggleFavorite} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-stone-200">
            <div className="text-6xl mb-6">🔍</div>
            <p className="text-stone-400 font-medium text-lg">在上方輸入關鍵字開始您的美食冒險</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MapView({ onShowDetail, favorites, onToggleFavorite }: any) {
  const [region, setRegion] = useState("全部");
  const [type, setType] = useState("全部");

  const filtered = useMemo(() => {
    let base = FOOD_DATA;
    if (region !== "全部") base = base.filter(f => f.region === region);
    if (type !== "全部") base = base.filter(f => f.type === type);
    return base;
  }, [region, type]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-12"
    >
      <header className="mb-12">
        <h1 className="font-display font-black text-4xl text-stone-900 mb-2">美食地圖</h1>
        <p className="text-stone-500 font-medium">按地區或類別探索全台最具代表性的驚喜</p>
      </header>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 mb-12 flex flex-col sm:flex-row gap-10">
        <div className="flex-1">
          <h4 className="font-bold text-stone-700 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" /> 地理區域
          </h4>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(r => (
              <button 
                key={r}
                onClick={() => setRegion(r)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  region === r 
                    ? 'bg-stone-900 text-white shadow-xl scale-105' 
                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-stone-700 mb-4 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-500" /> 美食類型
          </h4>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button 
                key={t}
                onClick={() => setType(t)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  type === t 
                    ? 'bg-red-600 text-white shadow-xl scale-105' 
                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(f => (
          <FoodCard 
            key={f.id} 
            food={f} 
            onShowDetail={onShowDetail} 
            isFavorite={favorites.includes(f.id)} 
            onToggleFavorite={onToggleFavorite} 
          />
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-stone-200">
           <p className="text-stone-400">目前沒有符合該篩選條件的美食，快來推薦一個吧！</p>
        </div>
      )}
    </motion.div>
  );
}

function RecommendView({ onAddRecommendation, recommendations, onDelete }: any) {
  const [form, setForm] = useState({ restaurant: "", food: "", region: "", comment: "" });
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.restaurant || !form.food || !form.region || !rating || !form.comment) {
      alert("請填寫所有欄位並給予評分");
      return;
    }

    const newRec: Recommendation = {
      id: Date.now().toString(),
      ...form,
      rating,
      date: new Date().toISOString()
    };

    onAddRecommendation(newRec);
    setForm({ restaurant: "", food: "", region: "", comment: "" });
    setRating(0);
    alert("感謝您的分享！您的推薦已發佈。");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="md:w-1/3">
          <h1 className="font-display font-black text-4xl text-stone-900 mb-4">餐廳推薦</h1>
          <p className="text-stone-500 font-medium leading-relaxed mb-8">
            島嶼角落總有不為人知的美味。分享您在巷弄中遇見的驚喜，協助更多食客找到值得收藏的寶藏店家。
          </p>
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 hidden md:block">
            <p className="text-sm text-red-700 font-bold leading-relaxed mb-4">🏆 本月最佳分享將獲得平台特約餐廳九折券！</p>
            <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest">
               <Flame className="w-4 h-4" /> 共同打造最道地美食清單
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl border border-stone-100 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">餐廳名稱</label>
                <input 
                  type="text" 
                  value={form.restaurant}
                  onChange={e => setForm({...form, restaurant: e.target.value})}
                  placeholder="店名..." 
                  className="w-full px-5 py-3 rounded-xl border-stone-200 bg-stone-50 focus:ring-red-500/20 text-sm font-medium" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">特色美食</label>
                <input 
                  type="text" 
                  value={form.food}
                  onChange={e => setForm({...form, food: e.target.value})}
                  placeholder="必點招牌..." 
                  className="w-full px-5 py-3 rounded-xl border-stone-200 bg-stone-50 focus:ring-red-500/20 text-sm font-medium" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">所在區域</label>
                <select 
                   value={form.region}
                   onChange={e => setForm({...form, region: e.target.value})}
                   className="w-full px-5 py-3 rounded-xl border-stone-200 bg-stone-50 focus:ring-red-500/20 text-sm font-medium"
                >
                  <option value="">選擇區域...</option>
                  {REGIONS.filter(r => r !== '全部').map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">推薦星級</label>
                <div className="flex gap-2 pt-1">
                  {[1,2,3,4,5].map(s => (
                    <button 
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`text-2xl transition-all hover:scale-125 ${s <= rating ? 'grayscale-0' : 'grayscale opacity-30'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">推薦理由</label>
              <textarea 
                value={form.comment}
                onChange={e => setForm({...form, comment: e.target.value})}
                placeholder="分享為什麼這家店值得一去..." 
                className="w-full px-5 py-3 rounded-xl border-stone-200 bg-stone-50 focus:ring-red-500/20 text-sm font-medium h-32"
              ></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all active:scale-[0.98] shadow-lg">
              <Send className="w-4 h-4" /> 提交推薦分享
            </button>
          </form>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="font-display font-bold text-3xl text-stone-800 mb-10 text-center">社群最新推薦</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {recommendations.map(r => (
             <motion.div 
               layout
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               key={r.id} 
               className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-xl transition-all"
             >
                <div className="flex justify-between items-start mb-4">
                   <div>
                     <h4 className="font-display font-black text-xl text-stone-800">{r.restaurant}</h4>
                     <p className="text-red-500 font-bold text-sm tracking-tight flex items-center gap-1">🍜 {r.food}</p>
                   </div>
                   <button onClick={() => onDelete(r.id)} className="p-2 text-stone-300 hover:text-red-500 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-500 text-[10px] font-black uppercase tracking-widest">{r.region}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-500 fill-current' : 'text-stone-200'}`} />)}
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4 italic">「{r.comment}」</p>
                <div className="pt-4 border-t border-stone-50 text-[10px] font-bold text-stone-300 uppercase tracking-widest">
                   {new Date(r.date).toLocaleDateString()}
                </div>
             </motion.div>
           ))}
        </div>
        {recommendations.length === 0 && (
          <div className="text-center py-20 bg-stone-100/50 rounded-[3rem] border-2 border-dashed border-stone-200">
             <span className="text-4xl mb-4 block opacity-30">✨</span>
             <p className="text-stone-400 font-medium">還沒有老饕留下足跡，成為第一個分享的人吧！</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AccountView({ favorites, onShowDetail, onToggleFavorite, userReviews, onAddReview, onDeleteReview }: any) {
  const [tab, setTab] = useState<'favorites' | 'reviews'>('favorites');
  const [reviewForm, setReviewForm] = useState({ foodId: "", comment: "", rating: 0 });

  const favFoods = FOOD_DATA.filter(f => favorites.includes(f.id));

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.foodId || !reviewForm.comment || !reviewForm.rating) {
      alert("請選擇美食並填寫評價與評分");
      return;
    }

    const food = FOOD_DATA.find(f => f.id === parseInt(reviewForm.foodId))!;
    onAddReview({
      id: Date.now().toString(),
      foodId: food.id,
      foodName: food.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString()
    });
    setReviewForm({ foodId: "", comment: "", rating: 0 });
    alert("評價提交成功！");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-12"
    >
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/4">
          <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white text-center mb-8 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent"></div>
             <div className="w-24 h-24 rounded-full bg-stone-800 border-4 border-stone-700 font-black text-3xl flex items-center justify-center mx-auto mb-6 relative z-10">🍜</div>
             <h2 className="font-display font-black text-xl mb-1 relative z-10">老饕食客</h2>
             <p className="text-stone-500 text-xs font-bold uppercase tracking-widest relative z-10">精銳會員</p>
          </div>
          
          <div className="flex flex-col gap-2 p-2 bg-white rounded-3xl shadow-sm border border-stone-100">
             <button 
               onClick={() => setTab('favorites')}
               className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${tab === 'favorites' ? 'bg-red-600 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-50'}`}
             >
               <Heart className="w-4 h-4" /> 我的收藏
             </button>
             <button 
               onClick={() => setTab('reviews')}
               className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${tab === 'reviews' ? 'bg-red-600 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-50'}`}
             >
               <MessageSquare className="w-4 h-4" /> 我的食記
             </button>
          </div>
        </div>

        <div className="flex-1">
          {tab === 'favorites' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-display font-black text-3xl text-stone-900 mb-8">我的收藏清單</h3>
              {favFoods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   {favFoods.map(f => (
                     <FoodCard 
                      key={f.id} 
                      food={f} 
                      onShowDetail={onShowDetail} 
                      isFavorite={true} 
                      onToggleFavorite={onToggleFavorite} 
                    />
                   ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100 shadow-sm">
                   <Heart className="w-12 h-12 text-stone-100 mx-auto mb-4" />
                   <p className="text-stone-400 font-medium">還沒有任何收藏，快開始您的探索旅程吧！</p>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-12">
                <h3 className="font-display font-black text-3xl text-stone-900 mb-8">撰寫食記</h3>
                <form onSubmit={handleReviewSubmit} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">選擇美食</label>
                      <select 
                        value={reviewForm.foodId}
                        onChange={e => setReviewForm({...reviewForm, foodId: e.target.value})}
                        className="w-full px-5 py-3 rounded-xl border-stone-200 bg-stone-50 text-sm font-medium"
                      >
                         <option value="">請選擇...</option>
                         {FOOD_DATA.map(f => <option key={f.id} value={f.id}>{f.name} ({f.city})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">給予評價</label>
                      <div className="flex gap-2 pt-1 font-bold">
                        {[1,2,3,4,5].map(s => (
                          <button 
                            key={s} 
                            type="button" 
                            onClick={() => setReviewForm({...reviewForm, rating: s})}
                            className={`text-2xl transition-all ${s <= reviewForm.rating ? 'grayscale-0 opacity-100' : 'grayscale opacity-20'}`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">分享您的心得</label>
                    <textarea 
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                      placeholder="味道如何？有什麼印象特別深刻的地方嗎？"
                      className="w-full px-5 py-3 rounded-xl border-stone-200 bg-stone-50 h-32 text-sm font-medium"
                    ></textarea>
                  </div>
                  <button type="submit" className="px-10 py-3.5 bg-red-600 text-white rounded-full font-bold shadow-xl hover:bg-red-700 transition-all active:scale-95">
                    提交評價分享
                  </button>
                </form>
              </div>

              <h3 className="font-display font-black text-3xl text-stone-900 mb-8">我的所有食記</h3>
              <div className="space-y-6">
                {userReviews.map(r => (
                  <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex gap-6 items-start">
                     <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center text-3xl shrink-0">🍱</div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-stone-800 text-lg">{r.foodName}</h4>
                           <button onClick={() => onDeleteReview(r.id)} className="text-stone-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                           <div className="flex gap-0.5">
                             {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-500 fill-current' : 'text-stone-100'}`} />)}
                           </div>
                           <span className="text-[10px] font-bold text-stone-300 tracking-widest uppercase">{new Date(r.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed">{r.comment}</p>
                     </div>
                  </div>
                ))}
                {userReviews.length === 0 && (
                  <div className="text-center py-16 bg-stone-100/30 rounded-[3rem] border border-dashed border-stone-200">
                    <p className="text-stone-400">目前尚無發表過食記，期待您的精彩分享！</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DetailView({ food, onBack, isFavorite, onToggleFavorite, reviews }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-12"
    >
      <button onClick={onBack} className="flex items-center gap-2 font-bold text-stone-400 hover:text-red-600 transition-all mb-8 group active:scale-95">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 返回上一頁
      </button>

      <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-stone-100">
        <div className="h-80 sm:h-96 bg-gradient-to-br from-stone-50 to-stone-200 flex items-center justify-center relative p-12">
          <motion.span 
            initial={{ scale: 0.5, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-[12rem] sm:text-[16rem] drop-shadow-2xl"
          >
            {food.emoji}
          </motion.span>
          <button 
            onClick={onToggleFavorite}
            className={`absolute top-8 right-8 p-4 rounded-full shadow-2xl transition-all active:scale-90 ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white text-stone-300 hover:text-red-500'
            }`}
          >
            <Heart className={`w-8 h-8 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-6 py-2 rounded-2xl shadow-xl font-display font-black text-xl tracking-tight">
            {food.region}
          </div>
        </div>

        <div className="p-10 sm:p-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
               <h1 className="font-display font-black text-5xl text-stone-900 mb-4">{food.name}</h1>
               <div className="flex flex-wrap gap-6 text-stone-500 text-sm font-bold decoration-red-200">
                 <span className="flex items-center gap-2 underline decoration-2 underline-offset-4 font-black text-stone-900 underline-red-500"><MapPin className="w-4 h-4 text-red-500" /> {food.city}</span>
                 <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-stone-300" /> {food.price}</span>
                 <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-stone-300" /> {food.reviews} 則評論記錄</span>
               </div>
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-4xl font-black text-amber-500">⭐ {food.rating}</span>
               <span className="text-stone-300 font-bold uppercase tracking-widest text-[10px]">綜合評分</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
              <div>
                <h3 className="font-display font-black text-2xl text-stone-800 mb-6 flex items-center gap-3">
                   <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                   美食風味介紹
                </h3>
                <p className="text-stone-600 text-lg leading-relaxed font-medium">
                  {food.desc}
                  這道經典滋味之所以流傳至今，不僅是因為食材的講究，更是因為背後乘載著這塊土地世代相傳的記憶。不論是火候的掌控，還是私房配方的比例，每一口都是精心雕琢的作品。
                </p>
              </div>

              <div>
                <h3 className="font-display font-black text-2xl text-stone-800 mb-6">社群食客心得 ({reviews.length})</h3>
                <div className="space-y-6">
                   {reviews.map((r: any) => (
                     <div key={r.id} className="p-8 bg-stone-50 rounded-3xl border border-stone-100 flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-xl shrink-0 shadow-sm">🥘</div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <div className="flex gap-0.5">
                               {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-500 fill-current' : 'text-stone-200'}`} />)}
                             </div>
                             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{new Date(r.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-stone-600 font-medium leading-relaxed italic">「 {r.comment} 」</p>
                        </div>
                     </div>
                   ))}
                   {reviews.length === 0 && (
                     <div className="text-center py-12 px-6 border-2 border-dashed border-stone-200 rounded-[2rem]">
                        <p className="text-stone-400 font-medium italic">目前尚無收藏的心得分享</p>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                  <h4 className="font-display font-black text-lg text-stone-800 mb-6 uppercase tracking-tight">相關亮點標籤</h4>
                  <div className="flex flex-wrap gap-2">
                    {food.tags.map((tag: string) => (
                      <span key={tag} className="px-4 py-1.5 rounded-xl bg-white text-stone-500 text-xs font-bold shadow-sm border border-stone-100">
                        #{tag}
                      </span>
                    ))}
                    <span className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-200">
                      #{food.type}
                    </span>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🏅</div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-4 opacity-80">老饕小提醒</h4>
                  <p className="text-lg font-display font-bold leading-relaxed mb-6">
                    建議於非高峰時段造訪，才能品嚐到主廚最細膩的火候處理喔！
                  </p>
                  <div className="w-full h-1 bg-white/30 rounded-full"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
