import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Search, 
  BookOpen, 
  UtensilsCrossed, 
  ShoppingCart,
  Calendar,
  ChefHat,
  Bell,
  ArrowLeft,
  ChevronRight,
  Mic,
  Timer,
  Play,
  CheckCircle2,
  Heart,
  X,
  Hourglass,
  ArrowRight,
  Info,
  Check,
  Package,
  LogOut
} from 'lucide-react';
import { cn } from './lib/utils';
import { RECIPES, PANTRY_ITEMS } from './data';
import { Recipe, PantryItem } from './types';
import { supabase } from './lib/supabase';
import { AuthScreen } from './components/AuthScreen';
import { Session } from '@supabase/supabase-js';
import { YouTubePlayer } from './components/YouTubePlayer';

// --- Components ---
// ... (rest of the components stay the same until Main App part)

const BottomNav = ({ activeTab, setTab }: { activeTab: string, setTab: (t: string) => void }) => {
  const tabs = [
    { id: 'feed', label: 'Feed', icon: Flame },
    { id: 'cookbook', label: 'Cookbook', icon: BookOpen },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'pantry', label: 'Pantry', icon: UtensilsCrossed },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-saffron/10 px-4 pb-8 pt-3 z-50 flex justify-around shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative px-4 py-1 rounded-full",
              isActive ? "text-saffron bg-saffron/5" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            {isActive && (
              <motion.div 
                layoutId="nav-pill"
                className="absolute inset-0 bg-saffron/10 rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

const TopBar = ({ title, showBack, onBack, onLogout }: { title: string, showBack?: boolean, onBack?: () => void, onLogout?: () => void }) => (
  <header className="fixed top-0 left-0 right-0 h-16 bg-cream/80 backdrop-blur-md z-40 px-6 flex items-center justify-between border-b border-saffron/5">
    <div className="flex items-center gap-3">
      {showBack ? (
        <button onClick={onBack} className="p-2 -ml-2 text-saffron active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
      ) : (
        <UtensilsCrossed className="text-saffron" size={24} />
      )}
      <h1 className="font-display text-xl font-bold text-saffron-800 tracking-tight">{title}</h1>
    </div>
    <div className="flex items-center gap-4">
      {!showBack && <button className="text-slate-400 p-1 hover:text-saffron transition-colors"><Bell size={22} /></button>}
      <button 
        onClick={onLogout}
        className="w-9 h-9 rounded-full bg-saffron-100 overflow-hidden border-2 border-white shadow-sm cursor-pointer active:scale-95 transition-transform group relative"
      >
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <LogOut size={16} className="text-white" />
        </div>
      </button>
    </div>
  </header>
);

// --- Screens ---

const FeedScreen = ({ onSelectRecipe, onNavigate }: { onSelectRecipe: (r: Recipe) => void, onNavigate: (t: string) => void }) => {
  return (
    <div className="pt-20 pb-28 px-6 space-y-8 max-w-2xl mx-auto">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search trending recipes..."
          className="w-full bg-white border-2 border-sage/10 focus:border-sage h-14 pl-12 pr-6 rounded-2xl outline-none transition-all shadow-sm shadow-sage/5"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
        {['For You', 'Quick 15-min', 'Baking', 'Vegetarian', 'Gluten Free'].map((cat, i) => (
          <button 
            key={cat}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all",
              i === 0 ? "bg-sage text-white shadow-md shadow-sage/20" : "bg-white border border-sage/10 text-slate-500 hover:bg-sage/5"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bento Grid Discovery */}
      <div className="grid grid-cols-2 gap-4">
        {/* Large Trending Card */}
        {RECIPES.filter(r => r.trending).map(recipe => (
          <motion.article 
            key={recipe.id}
            onClick={() => onSelectRecipe(recipe)}
            className="col-span-2 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl group cursor-pointer"
            whileTap={{ scale: 0.98 }}
          >
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="bg-sage text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-3">Trending</span>
              <h2 className="font-display text-2xl font-bold text-white mb-2 leading-tight">{recipe.title}</h2>
              <div className="flex gap-4 text-white/90 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Timer size={14} className="text-saffron" /> {recipe.time}</span>
                <span className="flex items-center gap-1.5"><ChefHat size={14} className="text-sage" /> {recipe.level}</span>
              </div>
            </div>
          </motion.article>
        ))}

        {RECIPES.filter(r => !r.trending && !r.featured).map(recipe => (
          <motion.article 
            key={recipe.id}
            onClick={() => onSelectRecipe(recipe)}
            className="relative h-64 rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
            whileTap={{ scale: 0.96 }}
          >
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
              <h3 className="font-display text-white font-bold leading-tight mb-1">{recipe.title}</h3>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">{recipe.time} • {recipe.level}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Curated Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-800">Curated for You</h2>
            <p className="text-slate-500 text-sm">Based on your love for Mediterranean</p>
          </div>
          <button 
            onClick={() => onNavigate('cookbook')}
            className="text-saffron font-bold text-xs flex items-center gap-1 uppercase tracking-wider"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4">
          {RECIPES.filter(r => !r.trending).slice(0, 3).map((recipe, i) => (
            <div 
              key={recipe.id} 
              onClick={() => onSelectRecipe(recipe)}
              className="flex-none w-64 bg-white rounded-3xl overflow-hidden shadow-sm border border-sage/10 transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button 
                  onClick={(e) => { e.stopPropagation(); /* Toggle Favorite */ }}
                  className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:text-red-400 transition-colors"
                >
                  <Heart size={18} />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 leading-tight mb-2">{recipe.title}</h4>
                <div className="flex gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Timer size={12} /> {recipe.time}</span>
                  <span className="flex items-center gap-1"><Flame size={12} /> {recipe.calories}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


const RecipeDetailScreen = ({ recipe, onBack, onStartCooking, onAddToPlanner, isInPlanner }: { 
  recipe: Recipe, 
  onBack: () => void, 
  onStartCooking: () => void,
  onAddToPlanner: (r: Recipe) => void,
  isInPlanner: boolean
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 bg-cream z-50 overflow-y-auto no-scrollbar"
    >
      <TopBar title="Recipe Details" showBack onBack={onBack} />
      
      <div className="pt-20 pb-32 px-6 max-w-4xl mx-auto space-y-8">
        {/* YouTube Video Player */}
        {recipe.youtubeVideoId ? (
          <YouTubePlayer videoId={recipe.youtubeVideoId} />
        ) : (
          <section className="relative rounded-3xl overflow-hidden glass shadow-2xl aspect-video group cursor-pointer bg-slate-900">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-saffron text-white rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90">
                <Play size={40} fill="currentColor" />
              </button>
            </div>
            <div className="absolute bottom-4 left-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-widest">
              No Video Available
            </div>
          </section>
        )}

        {/* Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2">
              {recipe.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-sage/10 text-sage-dark rounded-full text-[10px] font-bold uppercase tracking-widest">{tag}</span>
              ))}
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-900 leading-tight">{recipe.title}</h1>
            <p className="text-slate-500 leading-relaxed max-w-2xl">{recipe.description}</p>
          </div>

          <div className="bg-sage/5 rounded-3xl p-6 border border-sage/10 space-y-6 flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Time</p>
                <p className="font-display text-xl font-bold text-slate-800">{recipe.time}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Calories</p>
                <p className="font-display text-xl font-bold text-slate-800">{recipe.calories.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Level</p>
                <p className="font-display text-xl font-bold text-slate-800">{recipe.level.slice(0, 3)}</p>
              </div>
            </div>
            <button 
              onClick={onStartCooking}
              className="w-full bg-saffron text-white py-4 rounded-2xl font-bold tracking-tight shadow-lg shadow-saffron/20 active:scale-95 transition-all"
            >
              Start Cooking Mode
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <section className="bg-white rounded-3xl p-8 border border-sage/10 shadow-sm space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-display text-2xl font-bold text-slate-900">Ingredients</h3>
            <div className="flex bg-cream p-1 rounded-xl">
              <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-saffron uppercase">Metric</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase">Imperial</button>
            </div>
          </div>
          
          <ul className="space-y-4">
            {recipe.ingredients.map(ing => (
              <li key={ing.id} className="flex items-center gap-4 group">
                <button className={cn(
                  "w-6 h-6 rounded-lg border-2 border-sage flex items-center justify-center transition-all",
                  ing.inStock ? "bg-sage text-white" : "hover:bg-sage/5"
                )}>
                  {ing.inStock && <Check size={16} strokeWidth={3} />}
                </button>
                <div className="flex-1 flex justify-between items-center border-b border-sage/5 pb-2">
                  <span className="text-slate-700 font-medium">{ing.name}</span>
                  <span className="text-slate-400 font-bold text-sm tracking-tight">{ing.amount}</span>
                </div>
              </li>
            ))}
          </ul>

          <button 
            disabled={isInPlanner}
            onClick={() => onAddToPlanner(recipe)}
            className={cn(
              "w-full py-4 rounded-2xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95",
              isInPlanner 
                ? "bg-slate-100 text-slate-400 cursor-default" 
                : "bg-sage text-white shadow-sage/20"
            )}
          >
            <ShoppingCart size={20} />
            {isInPlanner ? 'Already in Planner' : 'Add Missing to Grocery List'}
          </button>
        </section>
      </div>
    </motion.div>
  );
};

const SmartCookScreen = ({ recipe, onExit, onComplete }: { recipe: Recipe, onExit: () => void, onComplete: () => void }) => {
  const [stepIdx, setStepIdx] = useState(() => {
    const saved = localStorage.getItem(`active-step-${recipe.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const currentStep = recipe.steps[stepIdx] || recipe.steps[0];

  useEffect(() => {
    localStorage.setItem(`active-step-${recipe.id}`, stepIdx.toString());
  }, [stepIdx, recipe.id]);

  // Mock YouTube Sync
  useEffect(() => {
    const handleTimeSync = (e: any) => {
      // Simulate video scrubbing syncing to steps
      if (e.detail?.time) {
        const time = e.detail.time;
        const matchingStep = recipe.steps.findIndex(s => {
          const [m, s_val] = s.timestamp.split(':').map(Number);
          return (m * 60 + s_val) <= time;
        });
        if (matchingStep !== -1 && matchingStep !== stepIdx) {
          setStepIdx(matchingStep);
        }
      }
    };
    window.addEventListener('yt-time-sync', handleTimeSync);
    return () => window.removeEventListener('yt-time-sync', handleTimeSync);
  }, [recipe.steps, stepIdx]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed inset-0 bg-cream z-[60] flex flex-col pt-4"
    >
      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-sage/10 z-[70]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((stepIdx + 1) / recipe.steps.length) * 100}%` }}
          className="h-full bg-sage shadow-[0_0_10px_rgba(42,157,143,0.5)]"
        />
      </div>

      <header className="px-6 h-20 flex items-center justify-between">
        <button onClick={onExit} className="flex items-center gap-2 text-saffron font-bold uppercase tracking-widest active:scale-95">
          <X size={20} strokeWidth={3} />
          Exit
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-full shadow-lg shadow-sage/20 animate-pulse">
          <Mic size={18} fill="currentColor" />
          <span className="text-xs font-bold tracking-widest">LISTENING...</span>
        </div>
      </header>

      <main className="flex-1 px-6 max-w-4xl mx-auto w-full flex flex-col gap-6 overflow-y-auto no-scrollbar pb-12">
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border-4 border-white">
          <img src={currentStep.imageUrl || recipe.imageUrl} alt={currentStep.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <span className="bg-saffron text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest w-fit mb-2">Step {stepIdx + 1} of {recipe.steps.length}</span>
            <h2 className="text-white text-2xl font-display font-bold leading-tight">{currentStep.title}</h2>
          </div>
        </div>

        <article className="bg-white p-8 rounded-3xl shadow-xl border-l-[10px] border-saffron space-y-6">
          <h1 className="font-display text-4xl font-black text-slate-900 leading-[1.1]">{currentStep.title}</h1>
          <p className="text-2xl text-slate-700 leading-snug font-medium text-pretty">{currentStep.description}</p>
          <div className="flex items-center gap-2 px-4 py-2 bg-saffron/10 text-saffron-800 rounded-xl w-fit font-bold text-xl">
            <Timer size={24} />
            3 - 5 MINUTES
          </div>
        </article>

        <div className="grid grid-cols-2 gap-4">
          <button 
            disabled={stepIdx === 0}
            onClick={() => setStepIdx(s => s - 1)}
            className="bg-slate-100 text-slate-400 h-28 rounded-3xl flex flex-col items-center justify-center gap-2 font-bold uppercase tracking-wider disabled:opacity-50"
          >
            <ArrowLeft size={32} /> Back
          </button>
          
          {stepIdx === recipe.steps.length - 1 ? (
            <button 
              onClick={onComplete}
              className="bg-sage text-white h-28 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-xl shadow-sage/20 font-bold uppercase tracking-wider"
            >
              <Check size={32} /> Finish Cooking
            </button>
          ) : (
            <button 
              onClick={() => setStepIdx(s => s + 1)}
              className="bg-saffron text-white h-28 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-xl shadow-saffron/20 font-bold uppercase tracking-wider"
            >
              <ArrowRight size={32} /> Next Step
            </button>
          )}
        </div>

        <section className="bg-slate-900 text-white p-8 rounded-3xl mt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Step Ingredients</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xl font-bold">
              <CheckCircle2 className="text-saffron" size={28} />
              <span>4 tbsp Unsalted Butter</span>
            </div>
            <div className="flex items-center gap-4 text-xl font-bold">
              <CheckCircle2 className="text-saffron" size={28} />
              <span>6 Fresh Sage Leaves</span>
            </div>
          </div>
        </section>
      </main>

      <button className="fixed bottom-10 right-10 w-20 h-20 bg-sage text-white rounded-3xl shadow-2xl flex items-center justify-center shadow-sage/30 active:scale-90 transition-transform">
        <Hourglass size={32} fill="currentColor" />
      </button>
    </motion.div>
  );
};

const PantryScreen = ({ items, onUpdateLevel }: { items: PantryItem[], onUpdateLevel: (id: string, level: PantryItem['level']) => void }) => {
  return (
    <div className="pt-20 pb-28 px-6 space-y-8 max-w-2xl mx-auto">
      <header>
        <h2 className="font-display text-4xl font-bold text-saffron-900 leading-tight">My Pantry</h2>
        <p className="text-slate-500">Manage your staples and see what's missing for your next meal.</p>
      </header>

      <div className="bg-white rounded-3xl p-8 border border-sage/10 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="text-sage" />
            <h3 className="font-display text-xl font-bold text-slate-800">Essential Staples</h3>
          </div>
          <button className="text-saffron font-bold text-xs uppercase tracking-widest">Edit List</button>
        </div>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className={cn(
              "p-5 rounded-2xl border transition-all",
              item.active ? "bg-white border-sage/10" : "bg-slate-50 border-slate-200 opacity-60"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sage/5 flex items-center justify-center text-sage">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      {item.level === 'Low' && (
                        <span className="bg-[#E76F51] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm animate-pulse">Low Stock</span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.category}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">{item.quantity}{item.unit} available</p>
                  </div>
                </div>
                {item.active ? (
                  <div className="flex gap-1 bg-cream/30 p-1 rounded-xl">
                    {(['Low', 'Half', 'Full'] as const).map(l => (
                      <button 
                        key={l}
                        onClick={() => onUpdateLevel(item.id, l)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest transition-all",
                          item.level === l ? (
                            l === 'Low' ? "bg-[#E76F51] text-white shadow-md" : "bg-sage text-white shadow-md"
                          ) : "bg-white text-slate-300 hover:text-slate-500"
                        )}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button className="px-4 py-2 bg-saffron/20 text-saffron-800 rounded-xl text-xs font-bold uppercase tracking-widest">Activate</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-saffron p-8 rounded-3xl text-white relative overflow-hidden group shadow-2xl shadow-saffron/20">
        <div className="relative z-10">
          <h3 className="font-display text-xl font-bold mb-1">Pantry Insights</h3>
          <p className="opacity-80 text-sm">Flour is trending low. We've added it to your grocery list suggestions.</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <TrendingUp size={120} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

const CookbookScreen = ({ onSelectRecipe, onNavigate }: { onSelectRecipe: (r: Recipe) => void, onNavigate: (t: string) => void }) => {
  return (
    <div className="pt-20 pb-28 px-6 space-y-8 max-w-2xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="font-display text-4xl font-bold text-saffron-900">Your Collections</h2>
          <p className="text-slate-500">Access your saved culinary treasures.</p>
        </div>
        <button 
          onClick={() => onNavigate('feed')}
          className="text-saffron font-bold text-xs flex items-center gap-1 uppercase tracking-widest"
        >
          View All <ChevronRight size={16} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Weeknight Dinners", count: 12, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400" },
          { title: "Healthy Starts", count: 8, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400" },
          { title: "Holiday Baking", count: 24, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400" }
        ].map((col, i) => (
          <motion.div 
            key={i}
            className="group relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
            whileTap={{ scale: 0.98 }}
          >
            <img src={col.img} alt={col.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="font-display text-2xl font-bold text-white">{col.title}</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">{col.count} SAVED VIDEOS</p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="space-y-4">
        <h3 className="font-display text-2xl font-bold text-slate-800">Quick Access Recipes</h3>
        <div className="grid grid-cols-1 gap-4">
          {RECIPES.map(r => (
            <div key={r.id} onClick={() => onSelectRecipe(r)} className="bg-white rounded-3xl p-4 flex gap-4 cursor-pointer hover:bg-sage/5 transition-colors border border-sage/5">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm flex-none">
                <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center flex-1">
                <h4 className="font-bold text-slate-800 leading-tight mb-2">{r.title}</h4>
                <div className="flex gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Timer size={12} /> {r.time}</span>
                  <span className="flex items-center gap-1"><ChefHat size={12} /> {r.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const MealPlannerScreen = ({ mealPlan, onNavigate, onRemove }: { mealPlan: Recipe[], onNavigate: (t: string) => void, onRemove: (id: string) => void }) => {
  return (
    <div className="pt-20 pb-28 px-6 space-y-8 max-w-2xl mx-auto">
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
        {['MON 12', 'TUE 13', 'WED 14', 'THU 15', 'FRI 16'].map((day, i) => (
          <button 
            key={day}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[70px] py-4 rounded-2xl font-bold transition-all",
              i === 0 ? "bg-sage text-white shadow-lg shadow-sage/20 scale-105" : "bg-white text-slate-400"
            )}
          >
            <span className="text-[10px] uppercase tracking-widest">{day.split(' ')[0]}</span>
            <span className="text-2xl">{day.split(' ')[1]}</span>
            {i === 0 && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-sage/10 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-xl font-bold text-slate-800">Monday Nutrition</h3>
          <span className="text-[10px] font-bold text-sage uppercase tracking-widest">Target: 2,200 kcal</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Calories', val: '1,420', color: 'text-saffron' },
            { label: 'Protein', val: '82g', color: 'text-sage' },
            { label: 'Carbs', val: '145g', color: 'text-saffron' }
          ].map(stat => (
            <div key={stat.label} className="bg-cream/50 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
              <p className={cn("font-display text-xl font-bold", stat.color)}>{stat.val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {['BREAKFAST', 'LUNCH', 'DINNER'].map(meal => (
          <div key={meal} className="space-y-3">
            <div className="flex items-center gap-2 text-saffron">
              <Flame size={18} />
              <h4 className="font-bold uppercase text-xs tracking-widest">{meal}</h4>
            </div>
            {meal === 'DINNER' && mealPlan.length > 0 ? (
              <div className="bg-white rounded-3xl overflow-hidden shadow-md flex gap-4 p-4 border border-sage/5 group relative">
                <button 
                  onClick={() => onRemove(mealPlan[0].id)}
                  className="absolute top-4 right-4 p-1 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <X size={16} />
                </button>
                <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-sm flex-none">
                  <img src={mealPlan[0].imageUrl} alt={mealPlan[0].title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center flex-1 space-y-2">
                  <h5 className="font-bold text-slate-800 leading-tight">{mealPlan[0].title}</h5>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{mealPlan[0].time} • {mealPlan[0].level}</p>
                  <button className="w-fit flex items-center gap-1.5 px-3 py-1 bg-sage/10 text-sage rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <Flame size={12} /> Cook once, eat twice
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('cookbook')}
                className="w-full h-24 border-2 border-dashed border-sage/20 rounded-3xl flex items-center justify-center gap-2 text-slate-400 hover:text-saffron hover:bg-saffron/5 transition-all group"
              >
                <div className="p-2 border-2 border-slate-200 rounded-full group-hover:border-saffron transition-all">
                  <X className="rotate-45" size={16} />
                </div>
                <span className="font-bold text-sm">Quick Add from Cookbook</span>
              </button>
            )}
          </div>
        ))}
        {mealPlan.length === 0 && (
          <div 
            onClick={() => onNavigate('feed')}
            className="p-12 text-center text-slate-400 border-2 border-dashed border-sage/20 rounded-3xl cursor-pointer hover:bg-sage/5 transition-colors"
          >
            No meals planned. Add some from the feed!
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-white/10 rounded-2xl">
              <ShoppingCart className="text-saffron" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Grocery Budget</p>
              <p className="text-xl font-bold">₹4,250 / ₹5,500</p>
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '77%' }}
            className="h-full bg-saffron shadow-[0_0_15px_rgba(244,162,97,0.4)]"
          />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">EST. BY BIGBASKET & SWIGGY</p>
          <button 
            onClick={() => onNavigate('cart')}
            className="text-saffron font-bold text-xs uppercase tracking-widest flex items-center gap-1"
          >
            Order Ingredients <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};


const CheckoutScreen = ({ items }: { items: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="pt-20 pb-28 px-6 space-y-8 max-w-2xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="font-display text-4xl font-bold text-saffron-900">Consolidated List</h2>
          <p className="text-slate-500">Optimized for your week.</p>
        </div>
        <span className="bg-sage text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{items.length} ITEMS</span>
      </header>

      <div className="bg-white rounded-3xl p-6 border border-sage/10 shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="p-3 bg-saffron/10 rounded-2xl text-saffron">
            <Flame size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Delta Logic Applied</h4>
            <p className="text-sm text-slate-500">We've calculated exactly what you're missing from your current pantry levels.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sage">
            <Flame size={18} />
            <h3 className="font-bold uppercase text-xs tracking-widest">To Procure</h3>
          </div>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.name} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-sage/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center">
                    <Package className="text-saffron" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Needed: {item.needed} • Owned: {item.owned}</p>
                  </div>
                </div>
                <p className="font-display text-xl font-bold text-saffron">+{item.delta}{item.unit}</p>
              </div>
            ))}
            {items.length === 0 && (
              <div className="bg-sage/5 p-8 rounded-2xl text-center">
                <Check className="mx-auto text-sage mb-2" />
                <p className="text-sm font-bold text-sage">Pantry Fully Stocked!</p>
                <p className="text-xs text-slate-400 mt-1">You have everything needed for your planned meals.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-2xl font-bold text-saffron-900 border-t border-saffron/10 pt-8 mt-8">Price Match</h3>
          <button 
            onClick={() => {
              setLoading(true);
              setError(false);
              setTimeout(() => {
                setLoading(false);
                if (Math.random() < 0.2) setError(true);
              }, 1500);
            }}
            className="text-saffron text-[10px] font-black uppercase tracking-widest mt-8"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 bg-white rounded-[40px] border-2 border-dashed border-sage/20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Crawling BigBasket & Swiggy...</p>
          </div>
        ) : error ? (
          <div className="p-12 bg-red-50 rounded-[40px] border border-red-100 flex flex-col items-center justify-center gap-4 text-center">
            <Info className="text-red-400" size={32} />
            <p className="text-red-900 font-bold">Checkout Mocks Failed</p>
            <p className="text-red-600/60 text-xs">The partner APIs timed out. Please try again.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-6 bg-sage/5 border-2 border-sage rounded-3xl relative">
              <span className="absolute top-0 right-6 -translate-y-1/2 bg-sage text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sage/20">Best Value</span>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-sage shadow-sm">BB</div>
                  <p className="font-bold text-slate-800 text-lg">BigBasket</p>
                </div>
                <p className="font-display text-2xl font-bold text-sage">₹{1420 + (items.length * 45)}</p>
              </div>
              <p className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <Timer size={14} /> Delivery by 6:00 PM
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="bg-sage/10 p-8 rounded-[40px] space-y-6">
        <button className="w-full h-16 bg-saffron text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-saffron/20 active:scale-95 transition-all">
          Place Order with BigBasket
          <ShoppingCart size={24} />
        </button>
      </div>
    </div>
  );
};

// Placeholder for TrendingUp as it's missing from my manual import
function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

// --- Main App ---

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCooking, setIsCooking] = useState(false);

  // Supabase-backed state
  const [pantry, setPantry] = useState<PantryItem[]>(PANTRY_ITEMS);
  const [mealPlan, setMealPlan] = useState<Recipe[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      const fetchUserData = async () => {
        // Fetch Pantry
        const { data: pantryData } = await supabase
          .from('pantry')
          .select('*')
          .eq('user_id', session.user.id);

        if (pantryData && pantryData.length > 0) {
          setPantry(pantryData as PantryItem[]);
        } else {
          // Initialize with defaults if empty
          const initialPantry = PANTRY_ITEMS.map(item => ({ ...item, user_id: session.user.id }));
          const { data: inserted } = await supabase.from('pantry').upsert(initialPantry).select();
          if (inserted) setPantry(inserted as PantryItem[]);
        }

        // Fetch Meal Plan
        const { data: mealData } = await supabase
          .from('meal_plan')
          .select('recipe_id')
          .eq('user_id', session.user.id);

        if (mealData) {
          const plannedRecipes = RECIPES.filter(r => mealData.some(m => m.recipe_id === r.id));
          setMealPlan(plannedRecipes);
        }
      };
      fetchUserData();
    }
  }, [session]);

  const updatePantryItem = async (id: string, level: PantryItem['level']) => {
    if (!session) return;
    const item = pantry.find(p => p.id === id);
    if (!item) return;

    const newPantry = pantry.map(p => p.id === id ? { ...p, level } : p);
    setPantry(newPantry);

    await supabase
      .from('pantry')
      .update({ level })
      .eq('id', id)
      .eq('user_id', session.user.id);
  };

  const addRecipeToPlanner = async (recipe: Recipe) => {
    if (!session) return;
    if (mealPlan.some(r => r.id === recipe.id)) return;

    const newMealPlan = [...mealPlan, recipe];
    setMealPlan(newMealPlan);

    await supabase
      .from('meal_plan')
      .insert({ user_id: session.user.id, recipe_id: recipe.id });
  };

  const removeRecipeFromPlanner = async (id: string) => {
    if (!session) return;
    if (window.confirm("Remove ingredients for this recipe from your cart as well?")) {
      const newMealPlan = mealPlan.filter(r => r.id !== id);
      setMealPlan(newMealPlan);

      await supabase
        .from('meal_plan')
        .delete()
        .eq('user_id', session.user.id)
        .eq('recipe_id', id);
    }
  };

  const handleFinishCooking = async () => {
    if (!selectedRecipe || !session) return;

    const updatedItems: PantryItem[] = [];
    const newPantry = pantry.map(item => {
      const consumed = selectedRecipe.ingredients.find(i => i.name.toLowerCase().includes(item.name.toLowerCase()));
      if (consumed) {
        const amount = parseInt(consumed.amount, 10);
        const newQty = Math.max(0, item.quantity - (isNaN(amount) ? 10 : amount));
        const updated = {
          ...item,
          quantity: newQty,
          level: (newQty < 50 ? 'Low' : (newQty < 200 ? 'Half' : 'Full')) as PantryItem['level']
        };
        updatedItems.push(updated);
        return updated;
      }
      return item;
    });

    setPantry(newPantry);

    // Sync updates to Supabase
    for (const item of updatedItems) {
      await supabase
        .from('pantry')
        .update({ quantity: item.quantity, level: item.level })
        .eq('id', item.id)
        .eq('user_id', session.user.id);
    }

    setIsCooking(false);
    setSelectedRecipe(null);
  };

  const cartDeltas = useMemo(() => {
    const deltas: any[] = [];
    mealPlan.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const pantryItem = pantry.find(p => p.name.toLowerCase().includes(ing.name.split(' ')[0].toLowerCase()));
        if (pantryItem) {
          const needed = parseInt(ing.amount, 10);
          if (!isNaN(needed) && pantryItem.quantity < needed) {
            deltas.push({
              name: ing.name,
              owned: pantryItem.quantity,
              needed: needed,
              delta: needed - pantryItem.quantity,
              unit: pantryItem.unit
            });
          }
        }
      });
    });
    return deltas;
  }, [mealPlan, pantry]);

  const screenTitle = () => {
    switch(activeTab) {
      case 'feed': return 'Discover';
      case 'cookbook': return 'My Cookbook';
      case 'planner': return 'Meal Planner';
      case 'pantry': return 'Smart Pantry';
      case 'cart': return 'Cart';
      default: return 'Saffron & Sage';
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen pb-20 bg-cream">
      <TopBar title={screenTitle()} onLogout={handleLogout} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'feed' && <FeedScreen onSelectRecipe={setSelectedRecipe} onNavigate={setActiveTab} />}
          {activeTab === 'pantry' && <PantryScreen items={pantry} onUpdateLevel={updatePantryItem} />}
          {activeTab === 'cookbook' && <CookbookScreen onSelectRecipe={setSelectedRecipe} onNavigate={setActiveTab} />}
          {activeTab === 'planner' && <MealPlannerScreen mealPlan={mealPlan} onNavigate={setActiveTab} onRemove={removeRecipeFromPlanner} />}
          {activeTab === 'cart' && <CheckoutScreen items={cartDeltas} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecipe && !isCooking && (
          <RecipeDetailScreen 
            recipe={selectedRecipe} 
            onBack={() => setSelectedRecipe(null)} 
            onStartCooking={() => setIsCooking(true)}
            isInPlanner={mealPlan.some(r => r.id === selectedRecipe.id)}
            onAddToPlanner={addRecipeToPlanner}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCooking && selectedRecipe && (
          <SmartCookScreen 
            recipe={selectedRecipe} 
            onExit={() => setIsCooking(false)} 
            onComplete={handleFinishCooking}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setTab={setActiveTab} />
    </div>
  );
}
