import React, { useState, useEffect } from "react";
import 'aos/dist/aos.css';

// Safe imports with error handling
let CountUp, Link, AOS, useInView, VideosSection, SkincareChatbot, ErrorBoundary, fetchAllSocialStats, AdUnit;

try {
  CountUp = require("react-countup").default;
} catch {
  CountUp = ({ end, suffix }) => <span>{end}{suffix}</span>;
}

try {
  Link = require("react-scroll").Link;
} catch {
  Link = ({ to, children, onClick, className }) => (
    <a href={`#${to}`} onClick={onClick} className={className}>{children}</a>
  );
}

try {
  AOS = require("aos").default;
} catch {
  AOS = { init: () => {} };
}

try {
  useInView = require("react-intersection-observer").useInView;
} catch {
  useInView = () => ({ ref: null, inView: true });
}

try {
  VideosSection = require("./VideosSection").default;
} catch {
  VideosSection = () => (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Most Popular Videos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Video {i}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Amazing DIY Recipe {i}</h3>
              <p className="text-sm text-gray-600">1M+ views</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

try {
  SkincareChatbot = require("./SkincareChatbot").default;
} catch {
  SkincareChatbot = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-4xl mb-4">🤖</div>
        <h3 className="text-lg font-semibold mb-2">AI Skincare Assistant</h3>
        <p className="text-gray-600">Coming soon! Check out my YouTube channel for tips.</p>
      </div>
    </div>
  );
}

try {
  ErrorBoundary = require("./ErrorBoundary").default;
} catch {
  ErrorBoundary = ({ children }) => children;
}

try {
  AdUnit = require("./AdUnit").default;
} catch {
  AdUnit = () => null;
}

try {
  fetchAllSocialStats = require("./services/socialMediaService").fetchAllSocialStats;
} catch {
  fetchAllSocialStats = () => Promise.resolve({ youtube: null, instagram: null });
}

// ✅ EZOIC AD COMPONENT
function EzoicAd({ id, size = "responsive" }) {
  useEffect(() => {
    const initAd = () => {
      if (window.ezstandalone && window.ezstandalone.cmd) {
        window.ezstandalone.cmd.push(function() {
          window.ezstandalone.display(id);
        });
        console.log(`✅ Ezoic ad initialized: ${id}`);
      } else {
        console.log(`⏳ Waiting for Ezoic to load for ad: ${id}`);
        setTimeout(initAd, 1000);
      }
    };
    
    // Delay to ensure Ezoic is loaded
    setTimeout(initAd, 2000);
  }, [id]);

  return (
    <div 
      id={id}
      className={`ezoic-ad ${size === "responsive" ? "w-full flex justify-center" : ""}`}
      style={{ 
        minHeight: size === "responsive" ? "250px" : "auto",
        textAlign: "center"
      }}
    >
      <div 
        className="ezoic-adpicker-ad bg-gray-100 rounded-lg flex items-center justify-center"
        data-ad-type="banner"
        data-ad-size={size}
      >
        <span className="text-gray-400 text-sm">Ad Loading - {id}</span>
      </div>
    </div>
  );
}

// Privacy Policy Page Component
const PrivacyPolicyPage = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
          >
            <span className="text-lg">←</span>
            Back to Home
          </button>
        </div>
      </div>

      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 text-lg">Last updated: October 20, 2025</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Tanya Fashion Skincare. We are committed to protecting your privacy and ensuring you have a positive experience on our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We may collect personal information that you voluntarily provide to us, including:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Name and email address</li>
                <li>Photos or images you upload for AI analysis</li>
                <li>Messages and inquiries you send us</li>
                <li>Device information and usage data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 AI Face Analysis Data</h2>
              <p className="text-blue-900 leading-relaxed mb-3">
                <strong>Your Privacy is Our Priority:</strong> When you use our AI face analysis feature:
              </p>
              <ul className="list-disc list-inside text-blue-900 space-y-2">
                <li>Photos are processed locally in your browser when possible</li>
                <li>We do not permanently store your uploaded photos</li>
                <li>All face data is automatically deleted within 30 minutes</li>
                <li>We never share your photos with third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advertising</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to provide advertisements about goods and services of interest to you.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We partner with Ezoic to display ads on our website. Ezoic may collect and use data about your visit for advertising purposes. You can opt out of personalized advertising by visiting the Digital Advertising Alliance's opt-out page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-200">
                <p className="text-gray-800 font-semibold mb-2">Tanya Fashion Skincare</p>
                <p className="text-gray-700">
                  Email: <a href="mailto:tanyaskincare123@gmail.com" className="text-pink-600 hover:text-pink-700 font-medium">tanyaskincare123@gmail.com</a>
                </p>
                <p className="text-gray-700 mt-2">
                  YouTube: <a href="https://youtube.com/@tanyafashionskincare" className="text-pink-600 hover:text-pink-700 font-medium">@tanyafashionskincare</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const SOCIAL_CONFIG = {
  youtubeChannelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID || "",
  instagramUsername: process.env.REACT_APP_INSTAGRAM_USERNAME || "",
};

export default function App() {
  const showShopSection = process.env.REACT_APP_SHOW_SHOP_SECTION === "true";
  const [chatOpen, setChatOpen] = useState(false);
  const [stats, setStats] = useState({ subscribers: 280, instagram: 72, monthlyViews: 191 });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [ezoicReady, setEzoicReady] = useState(false);

  // Fetch & cache social stats
  const fetchLiveStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = localStorage.getItem("socialStats");
      const cachedTime = localStorage.getItem("socialStatsTime");
      const now = new Date().getTime();

      if (cached && cachedTime && now - cachedTime < 5 * 60 * 1000) {
        setStats(JSON.parse(cached));
        setLastUpdated(new Date(parseInt(cachedTime)));
        setLoading(false);
        return;
      }

      const socialData = await fetchAllSocialStats(
        SOCIAL_CONFIG.youtubeChannelId,
        SOCIAL_CONFIG.instagramUsername
      );

      if (socialData && (socialData.youtube || socialData.instagram)) {
        const updatedStats = {
          ...stats,
          ...(socialData.youtube && {
            subscribers: Math.max(stats.subscribers, Math.floor(socialData.youtube.subscribers / 1000)),
            monthlyViews: Math.max(stats.monthlyViews, Math.floor(socialData.youtube.views / 1000000)),
          }),
          ...(socialData.instagram && {
            instagram: Math.max(stats.instagram, Math.floor(socialData.instagram.followers / 1000)),
          }),
        };
        setStats(updatedStats);
        setLastUpdated(new Date());
        localStorage.setItem("socialStats", JSON.stringify(updatedStats));
        localStorage.setItem("socialStatsTime", new Date().getTime());
      } else {
        setError('Unable to fetch live data. Showing cached values.');
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to update live stats.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED useEffect - Safe AOS initialization + Ezoic check
  useEffect(() => {
    try {
      // Safe AOS initialization
      if (AOS && typeof AOS.init === 'function') {
        AOS.init({ 
          duration: 600, 
          once: true,
          disable: 'mobile' // Better performance on mobile
        });
      }
      
      window.scrollTo(0, 0);
      
      // Safe stats fetching
      if (typeof fetchLiveStats === 'function') {
        fetchLiveStats();
      }

      // Check Ezoic status
      const checkEzoic = () => {
        if (window.ezstandalone && window.ezstandalone.cmd) {
          setEzoicReady(true);
          console.log('🎉 Ezoic integration successful!');
        } else {
          console.log('⏳ Waiting for Ezoic...');
          setTimeout(checkEzoic, 1000);
        }
      };
      
      setTimeout(checkEzoic, 3000);
      
    } catch (err) {
      console.warn('Non-critical initialization error:', err);
      // App continues working even if AOS fails
    }
  }, []);

  if (showPrivacyPolicy) {
    return <PrivacyPolicyPage onBackToHome={() => setShowPrivacyPolicy(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      
      {/* ✅ EZOIC STATUS INDICATOR */}
      <div className="bg-blue-50 py-2">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            ezoicReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              ezoicReady ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
            }`}></div>
            {ezoicReady ? '✅ Ezoic Connected' : '⏳ Connecting to Ezoic...'}
          </div>
        </div>
      </div>

      <TopBar showShopSection={showShopSection} onChatOpen={() => setChatOpen(true)} onPrivacyOpen={() => setShowPrivacyPolicy(true)} />
      <main className="flex-1">
        <section id="home"><Hero stats={stats} loading={loading} lastUpdated={lastUpdated} error={error} /></section>
        
        {/* ✅ EZOIC AD PLACEMENT 1 */}
        <div className="my-8">
          <EzoicAd id="ezoic-pub-ad-placeholder-101" size="responsive" />
        </div>
        
        <section id="videos">
          <ErrorBoundary>
            <VideosSection />
          </ErrorBoundary>
        </section>

        {/* ✅ EZOIC AD PLACEMENT 2 */}
        <div className="my-8">
          <EzoicAd id="ezoic-pub-ad-placeholder-102" size="responsive" />
        </div>

        {showShopSection && <section id="shop"><ShopSection /></section>}
        <section id="about" className="scroll-mt-[80px]"><AboutSection /></section>
        
        {/* ✅ EZOIC AD PLACEMENT 3 */}
        <div className="my-8">
          <EzoicAd id="ezoic-pub-ad-placeholder-103" size="responsive" />
        </div>
        
        <section id="collaboration" className="scroll-mt-[80px]"><CollaborationSection /></section>
        <DisclaimerSection />
      </main>

      <Footer onPrivacyOpen={() => setShowPrivacyPolicy(true)} />

      <button
        onClick={() => setChatOpen(true)}
        aria-label="Open Chatbot"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 sm:px-5 sm:py-3 rounded-2xl shadow-2xl hover:shadow-pink-500/50 hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all duration-300 z-50 text-sm sm:text-base font-semibold group"
      >
        <span className="hidden sm:inline group-hover:scale-110 transition-transform">💬 Chat with AI</span>
        <span className="sm:hidden group-hover:scale-110 transition-transform">💬 Chat</span>
        {!chatOpen && (
          <>
            <span className="absolute top-1 left-1 sm:top-2 sm:left-2 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-100"></span>
            <span className="absolute top-1 left-1 sm:top-2 sm:left-2 w-2 h-2 bg-green-500 rounded-full"></span>
          </>
        )}
      </button>

      <ChatbotPopup open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

// TopBar with safe navigation
function TopBar({ showShopSection, onChatOpen, onPrivacyOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem("activeTab") || "home";
    } catch {
      return "home";
    }
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem("activeTab", tab);
    } catch {
      // Silent fail if localStorage isn't available
    }
  };

  const scrollToSection = (sectionId) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 70;
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
        handleTabChange(sectionId);
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center">
            <img
              src="/applogo.png"
              alt="Tanya Fashion Skincare Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="text-pink-600 font-bold text-xl" style={{ display: 'none' }}>T</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Tanya Fashion Skincare</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-3 lg:gap-6 text-sm items-center">
          <SafeNavItem to="home" activeTab={activeTab} onClick={() => scrollToSection('home')}>Home</SafeNavItem>
          <SafeNavItem to="videos" activeTab={activeTab} onClick={() => scrollToSection('videos')}>Videos</SafeNavItem>
          {showShopSection && <SafeNavItem to="shop" activeTab={activeTab} onClick={() => scrollToSection('shop')}>My Favorites</SafeNavItem>}
          <SafeNavItem to="about" activeTab={activeTab} onClick={() => scrollToSection('about')}>About Me</SafeNavItem>
          <SafeNavItem to="collaboration" activeTab={activeTab} onClick={() => scrollToSection('collaboration')}>Collaboration</SafeNavItem>
          <button onClick={onChatOpen} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 hover:shadow-lg whitespace-nowrap">
            💬 AI Chat
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none">
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-800"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
          </div>
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-3 space-y-1 shadow-lg">
          <SafeNavItem to="home" activeTab={activeTab} onClick={() => { scrollToSection('home'); setMenuOpen(false); }}>Home</SafeNavItem>
          <SafeNavItem to="videos" activeTab={activeTab} onClick={() => { scrollToSection('videos'); setMenuOpen(false); }}>Videos</SafeNavItem>
          {showShopSection && <SafeNavItem to="shop" activeTab={activeTab} onClick={() => { scrollToSection('shop'); setMenuOpen(false); }}>My Favorites</SafeNavItem>}
          <SafeNavItem to="about" activeTab={activeTab} onClick={() => { scrollToSection('about'); setMenuOpen(false); }}>About Me</SafeNavItem>
          <SafeNavItem to="collaboration" activeTab={activeTab} onClick={() => { scrollToSection('collaboration'); setMenuOpen(false); }}>Collaboration</SafeNavItem>
          <button onClick={() => { onChatOpen(); setMenuOpen(false); }} className="block w-full text-center mx-2 my-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300">
            💬 AI Chat
          </button>
        </div>
      )}
    </header>
  );
}

// Safe NavItem component
function SafeNavItem({ to, children, onClick, activeTab }) {
  return (
    <button
      onClick={onClick}
      className={`block px-2 py-1 rounded cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-pink-300 ${activeTab === to ? "text-pink-600 bg-pink-50" : "hover:text-pink-600 hover:bg-pink-50"}`}
    >
      {children}
    </button>
  );
}

// Hero
function Hero({ stats, loading, lastUpdated, error }) {
  return (
    <section className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,207,232,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(254,215,170,0.2),transparent_50%)]" />
      <div className="relative max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Welcome to<br /><span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">Tanya Fashion Skincare</span> 💖</h2>
          <p className="mt-6 text-gray-700 text-lg md:text-xl leading-relaxed">
            Your daily dose of <strong className="text-pink-600">DIY</strong> skincare, beauty tips, and fun content! Join our growing family.
          </p>
          <div className="mt-5 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-200 shadow-sm">
            <p className="text-gray-800 text-base md:text-lg">
              <strong className="text-pink-600">NEW:</strong> Try my FREE AI Face Analysis! Upload your photo to discover your skin age and get personalized DIY recipes instantly.
            </p>
          </div>

          <div className="mt-8 flex gap-4 flex-wrap">
            <a 
              href="https://youtube.com/@tanyafashionskincare" 
              target="_blank" 
              rel="noreferrer" 
              className="px-6 py-3.5 bg-red-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl hover:bg-red-700 hover:-translate-y-0.5 flex items-center gap-2 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe
            </a>
            <a 
              href="http://instagram.com/tanikhanvlog1996/" 
              target="_blank" 
              rel="noreferrer" 
              className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600 hover:-translate-y-0.5 flex items-center gap-2 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow
            </a>
          </div>

          {/* Stats section */}
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                Live Stats
              </h4>
            </div>

            {error && (
              <div className="text-xs text-amber-600 mb-2 flex items-center gap-1">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md">
              <Stat label="YouTube" value={stats.subscribers} suffix="K+" loading={loading} />
              <Stat label="Instagram" value={stats.instagram} suffix="K+" loading={loading} />
              <Stat label="YT Views" value={stats.monthlyViews} suffix="M+" loading={loading} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-8 md:mt-0">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl rotate-6 opacity-20 blur-xl"></div>
            <div className="relative w-full h-full rounded-3xl bg-white shadow-2xl overflow-hidden ring-4 ring-white/50">
              <img 
                alt="Tanya" 
                src="/MainPic.JPG" 
                className="object-cover w-full h-full hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRkNFN0YzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0VDNDg5OSIgZm9udC1zaXplPSI4MCI+VDwvdGV4dD4KPC9zdmc+';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Safe Stat component
function Stat({ label, value, suffix, loading }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center relative group hover:-translate-y-1">
      <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</div>
      <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-pink-600 to-rose-600 bg-clip-text text-transparent">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ) : (
          inView && (
            <CountUp end={value} duration={2} decimals={suffix.includes("M") ? 1 : 0} suffix={suffix} />
          )
        )}
      </div>
      {loading && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

function ShopSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">My Favorite Products</h3>
          <p className="text-base md:text-lg text-gray-600 mt-3 max-w-2xl mx-auto">These are some of the skincare items I personally use and love!</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="h-48 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl font-semibold text-gray-400">Product</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">Product {i}</div>
              <div className="text-sm text-gray-600 mt-2 leading-relaxed">Short product description</div>
              <button className="mt-4 w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 hover:shadow-lg">View Product</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-rose-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">About Me</h3>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-8 text-gray-700 text-lg md:text-xl leading-relaxed text-center">
            Hi, I'm <span className="font-semibold text-pink-600">Tanya</span>! I create DIY skincare tutorials, beauty tips, and fun lifestyle content.
            I love connecting with my viewers and sharing easy, affordable ways to look and feel amazing. 💖
          </p>
        </div>
      </div>
    </section>
  );
}

// ✅ FIXED CollaborationSection - EMAIL LINK CORRECTED
function CollaborationSection() {
  return (
    <div className="py-16 md:py-20 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,207,232,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(254,215,170,0.2),transparent_50%)]"></div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">Collaboration & Partnerships</h3>
        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mt-4 rounded-full"></div>
        <p className="mt-8 text-gray-700 text-lg md:text-xl leading-relaxed">
          I love working with brands, creators, and businesses that align with my vision in skincare, beauty, and lifestyle.
          Let's create something amazing together! 💖
        </p>
        <p className="mt-6 text-gray-700 text-lg">
          📩 Email me at{" "}
          <a
            href="mailto:tanyaskincare123@gmail.com"
            className="text-pink-600 underline hover:text-pink-700"
          >
            tanyaskincare123@gmail.com
          </a>
        </p>
        <a href="/Tanya-Media-Kit.pdf" download className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-xl hover:shadow-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 hover:-translate-y-1 font-medium text-lg">
          📄 Download My Media Kit
        </a>
      </div>
    </div>
  );
}

function DisclaimerSection() {
  return (
    <div className="py-6 bg-gradient-to-r from-yellow-50 to-amber-50 max-w-5xl mx-auto my-8 px-6 text-center text-sm md:text-base text-yellow-900 rounded-2xl shadow-lg border border-yellow-200">
      <p>
        <strong>Disclaimer:</strong> The skincare and haircare tips shared on this channel are based on personal experience and general knowledge. Always{" "}
        <span className="font-bold text-red-600 underline">do a patch test</span>{" "}
        before trying any new product or remedy. If you have sensitive skin, allergies, or medical conditions, please consult a dermatologist or healthcare professional before use.
      </p>
    </div>
  );
}

function Footer({ onPrivacyOpen }) {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white py-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600 flex flex-col sm:flex-row items-center sm:items-baseline gap-3 sm:gap-6">
        <span className="font-medium">© {new Date().getFullYear()} Tanya Fashion Skincare • Made with <span className="text-pink-500">💖</span> for my viewers</span>
        <span>
          <a href="https://youtube.com/@tanyafashionskincare" target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-700 font-medium transition-colors">YouTube</a> <span className="text-gray-400">|</span>{' '}
          <a href="http://instagram.com/tanikhanvlog1996/" target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-600 font-medium transition-colors ml-1">Instagram</a>
        </span>
        <span className="text-xs text-gray-700 font-mono sm:ml-auto">v{process.env.REACT_APP_VERSION}</span>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-4 pt-4 border-t border-gray-200 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <button 
            onClick={onPrivacyOpen}
            className="hover:text-pink-600 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <a href="mailto:tanyaskincare123@gmail.com" className="hover:text-pink-600 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

function ChatbotPopup({ open, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-lg relative w-full max-w-md h-96 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg"
        >
          ✖
        </button>
        <h3 className="text-lg font-semibold mb-2 p-4 border-b">
          Ask Tanya ✨
        </h3>
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            <SkincareChatbot onClose={onClose} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export function ChatbotWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
        className="fixed bottom-6 right-6 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 relative animate-bounce-slow"
      >
        💬 Chat
        <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
        <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"></span>
      </button>

      <ChatbotPopup open={open} onClose={() => setOpen(false)} />
    </>
  );
}
