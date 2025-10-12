import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Link } from "react-scroll";
import AOS from "aos";
import { useInView } from "react-intersection-observer";
import VideosSection from "./VideosSection";
import SkincareChatbot from "./SkincareChatbot";
import ErrorBoundary from './ErrorBoundary';
import { fetchAllSocialStats } from "./services/socialMediaService";
import AdUnit from "./AdUnit";
import 'aos/dist/aos.css';

const SOCIAL_CONFIG = {
  youtubeChannelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID,
  instagramUsername: process.env.REACT_APP_INSTAGRAM_USERNAME,
};

export default function App() {
  const showShopSection = process.env.REACT_APP_SHOW_SHOP_SECTION === "true";
  const [chatOpen, setChatOpen] = useState(false);
  const [stats, setStats] = useState({ subscribers: 273, instagram: 70, monthlyViews: 186 });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

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

      if (socialData.youtube || socialData.instagram) {
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

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    window.scrollTo(0, 0);
    fetchLiveStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <TopBar showShopSection={showShopSection} onChatOpen={() => setChatOpen(true)} />
      <main className="flex-1">
        <section id="home"><Hero stats={stats} loading={loading} lastUpdated={lastUpdated} error={error} /></section>

        {/* Ads */}
        <div className="my-8 flex justify-center" data-aos="fade-up">
          <AdUnit slot="YOUR_GOOGLE_AD_SLOT_1" />
        </div>

        <section id="videos"><VideosSection /></section>

        <div className="my-8 flex justify-center" data-aos="fade-up">
          <AdUnit slot="YOUR_GOOGLE_AD_SLOT_2" />
        </div>

        {showShopSection && <section id="shop"><ShopSection /></section>}
        <section id="about" className="scroll-mt-[80px]"><AboutSection /></section>
        <section id="collaboration" className="scroll-mt-[80px]"><CollaborationSection /></section>
        <DisclaimerSection />
        <section id="contact" className="scroll-mt-[80px]"><ContactSection /></section>
      </main>

      <Footer />

      {/* Floating Chat */}
      <button
        onClick={() => setChatOpen(true)}
        aria-label="Open Chatbot"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg hover:bg-pink-600 active:scale-95 transition-all duration-300 z-50 text-sm sm:text-base"
      >
        <span className="hidden sm:inline">💬 Chat</span>
        <span className="sm:hidden">💬 Chat</span>
        {!chatOpen && <span className="absolute top-1 left-1 sm:top-2 sm:left-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>}
      </button>

      <ChatbotPopup open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

// TopBar
function TopBar({ showShopSection, onChatOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "home";
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center">
        <img
          src="/applogo.png"
          alt="Tanya Fashion Skincare Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
      </div>
          <h1 className="text-base sm:text-lg font-semibold">Tanya Fashion Skincare</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-3 lg:gap-4 text-sm items-center">
          <NavItem to="home" activeTab={activeTab} onTabChange={handleTabChange}>Home</NavItem>
          <NavItem to="videos" activeTab={activeTab} onTabChange={handleTabChange}>Videos</NavItem>
          {showShopSection && <NavItem to="shop" activeTab={activeTab} onTabChange={handleTabChange}>My Favorites</NavItem>}
          <NavItem to="about" activeTab={activeTab} onTabChange={handleTabChange}>About Me</NavItem>
          <NavItem to="collaboration" activeTab={activeTab} onTabChange={handleTabChange}>Collaboration</NavItem>
          <NavItem to="contact" activeTab={activeTab} onTabChange={handleTabChange}>Say Hello</NavItem>
          <button onClick={onChatOpen} className="text-pink-500 font-bold hover:underline whitespace-nowrap" aria-label="Open chat">
            AI Chat 💬
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none" aria-label="Toggle menu">
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-800"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
          </div>
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-3 space-y-1 animate-slide-down shadow-lg">
          <NavItem to="home" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>Home</NavItem>
          <NavItem to="videos" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>Videos</NavItem>
          {showShopSection && <NavItem to="shop" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>My Favorites</NavItem>}
          <NavItem to="about" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>About Me</NavItem>
          <NavItem to="collaboration" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>Collaboration</NavItem>
          <NavItem to="contact" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>Say Hello</NavItem>
          <button onClick={() => { onChatOpen(); setMenuOpen(false); }} className="block w-full text-left px-2 py-2 text-pink-500 font-bold hover:bg-pink-50 rounded" aria-label="Open chat">
            AI Chat 💬
          </button>
        </div>
      )}
    </header>
  );
}

// NavItem component
function NavItem({ to, children, onClick, activeTab, onTabChange }) {
  const headerHeight = typeof window !== "undefined" ? document.querySelector('header')?.offsetHeight || 70 : 70;
  return (
    <Link
      to={to}
      smooth={true}
      duration={500}
      offset={-headerHeight}
      spy={true}
      isDynamic={true}
      activeClass="nav-active"
      onClick={onClick}
      onSetActive={() => onTabChange(to)}
      className={`block px-2 py-1 rounded cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-pink-300 ${activeTab === to ? "nav-active" : ""
        }`}
    >
      {children}
    </Link>
  );
}

// Hero - UPDATED with live stats
function Hero({ stats, loading, onRefresh, lastUpdated, error }) {
  return (
    <section className="bg-gradient-to-br from-pink-200 via-pink-300 to-orange-200 py-12 md:py-16" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">Welcome to Tanya Fashion Skincare 💖</h2>
          <p className="mt-3 text-gray-800 text-base md:text-lg">
  Your daily dose of <strong>DIY</strong> skincare, beauty tips, and fun content! Join our growing family.
</p>
<p className="mt-3 text-gray-800 text-base md:text-lg">
  <strong>NEW:</strong> Try my FREE AI Face Analysis! Upload your photo to discover your skin age and get personalized DIY recipes instantly.
</p>

          <div className="mt-6 flex gap-3 flex-wrap">
            <a 
              href="https://youtube.com/@tanyafashionskincare" 
              target="_blank" 
              rel="noreferrer" 
              className="px-5 py-3 bg-red-600 text-white rounded-lg text-sm shadow hover:bg-red-700 flex items-center gap-2 transition-all duration-300"
              aria-label="Subscribe on YouTube"
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
              className="px-5 py-3 bg-pink-500 text-white rounded-lg text-sm shadow hover:bg-pink-600 flex items-center gap-2 transition-all duration-300"
              aria-label="Follow on Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow
            </a>
          </div>

          {/* NEW: Enhanced stats section with live data */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Stats
              </h4>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="text-xs text-amber-600 mb-2 flex items-center gap-1">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-sm">
              <Stat label="YouTube" value={stats.subscribers} suffix="K+" loading={loading} />
              <Stat label="Instagram" value={stats.instagram} suffix="K+" loading={loading} />
              <Stat label="YT Views" value={stats.monthlyViews} suffix="M+" loading={loading} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-6 md:mt-0">
          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden">
            <img alt="Tanya" src="/MainPic.JPG" className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Stat - UPDATED with loading state
function Stat({ label, value, suffix, loading }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow text-center relative" data-aos="zoom-in">
      <div className="text-xs sm:text-sm text-gray-500">{label}</div>
      <div className="text-lg sm:text-xl font-bold text-gray-900">
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

// ShopSection
function ShopSection() {
  return (
    <section className="py-12 md:py-16 bg-orange-50" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">My Favorite Products</h3>
        <p className="text-sm text-gray-700 mt-2">These are some of the skincare items I personally use and love!</p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow" data-aos="zoom-in">
              <div className="h-32 bg-gray-100 mb-3 flex items-center justify-center">Product</div>
              <div className="text-md font-medium">Product {i}</div>
              <div className="text-xs text-gray-500 mt-1">Short product description</div>
              <button className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-md text-sm hover:bg-pink-600">View Product</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// AboutSection
function AboutSection() {
  return (
    <section className="py-12 md:py-16 bg-rose-50" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">About Me</h3>
        <p className="mt-3 text-gray-700 text-base md:text-lg">
          Hi, I'm Tanya! I create DIY skincare tutorials, beauty tips, and fun lifestyle content.
          I love connecting with my viewers and sharing easy, affordable ways to look and feel amazing. 💖
        </p>
      </div>
    </section>
  );
}

// CollaborationSection
function CollaborationSection() {
  return (
    <div className="py-12 md:py-16 bg-gradient-to-br from-pink-100 via-orange-100 to-pink-200" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">Collaboration & Partnerships</h3>
        <p className="mt-3 text-gray-700 text-base md:text-lg">
          I love working with brands, creators, and businesses that align with my vision in skincare, beauty, and lifestyle.
          Let's create something amazing together! 💖
        </p>
        <p className="mt-4 text-gray-700">
          📩 Email me at{" "}
          <a
            href="mailto:tanyaskincare123@gmail.com"
            className="text-pink-600 underline hover:text-pink-700"
          >
            tanyaskincare123@gmail.com
          </a>

        </p>
        <a href="/Tanya-Media-Kit.pdf" download className="inline-block mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600">
          📄 Download My Media Kit
        </a>
      </div>
    </div>
  );
}

// DisclaimerSection
function DisclaimerSection() {
  return (
    <div className="py-5 bg-yellow-50 max-w-4xl mx-auto px-4 text-center text-sm text-yellow-900 rounded-md shadow mt-4 mb-4">
      <p>
        <strong>Disclaimer:</strong> The skincare and haircare tips shared on this channel are based on personal experience and general knowledge. Always{" "}
        <span className="font-bold text-red-600 underline">do a patch test</span>{" "}
        before trying any new product or remedy. If you have sensitive skin, allergies, or medical conditions, please consult a dermatologist or healthcare professional before use.
      </p>
    </div>
  );
}

// ContactSection
function ContactSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-100" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">Say Hello 👋</h3>
        <p className="text-sm md:text-base text-gray-700 mt-2">
          Have a question, feedback, or just want to say hi? Email me at{" "}
          <a
            href="mailto:tanyaskincare123@gmail.com"
            aria-label="Email Tanya Skincare"
            className="text-pink-600 underline hover:text-pink-700 transition-colors"
          >
            tanyaskincare123@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}

// Footer - NO chat button here
function Footer() {
  return (
    <footer className="bg-white py-6 border-t">
      <div className="max-w-6xl mx-auto px-4 text-sm text-gray-500 flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-6">
        <span>© {new Date().getFullYear()} Tanya Fashion Skincare • Made with 💖 for my viewers</span>
        <span>
          <a href="https://youtube.com/@tanyafashionskincare" target="_blank" rel="noreferrer" className="text-blue-600 underline">YouTube</a> |{' '}
          <a href="http://instagram.com/tanikhanvlog1996/" target="_blank" rel="noreferrer" className="text-pink-500 underline ml-1">Instagram</a>
        </span>
        <span className="text-xs text-gray-700 font-mono sm:ml-auto">v{process.env.REACT_APP_VERSION}</span>
      </div>
    </footer>
  );
}

// Chatbot Popup Component
function ChatbotPopup({ open, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 sm:p-4">
      <div
        className="bg-white rounded-lg shadow-lg relative animate-fadeIn"
        style={{
          width: '100%',
          maxWidth: 'min(95vw, 480px)',
          height: '85vh',
          maxHeight: '650px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >


        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition text-lg sm:text-base"
        >
          ✖
        </button>
        <h3 className="text-base sm:text-lg font-semibold mb-2 p-3 sm:p-4 border-b">
          Ask Tanya ✨
        </h3>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <ErrorBoundary>
            <SkincareChatbot onClose={onClose} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

// Chatbot Wrapper (floating button + popup)
export function ChatbotWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
        className="fixed bottom-6 right-6 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 relative animate-bounce-slow"
      >
        💬 Chat
        {/* Blinking + bouncing green dot */}
        <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
        <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"></span>
      </button>

      {/* Chat Popup */}
      <ChatbotPopup open={open} onClose={() => setOpen(false)} />
    </>
  );
}