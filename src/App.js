import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Link } from "react-scroll";
import AOS from "aos";
import { useInView } from "react-intersection-observer";
import VideosSection from "./VideosSection";
import SkincareChatbot from "./SkincareChatbot";

// Mock stats (replace with real API data)
const stats = {
  subscribers: 132,
  instagram: 46,
  monthlyViews: 20,
};

export default function App() {
  const showShopSection = process.env.REACT_APP_SHOW_SHOP_SECTION === "true";
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <TopBar showShopSection={showShopSection} onChatOpen={() => setChatOpen(true)} />
      
      <main className="flex-1">
        <section id="home"><Hero stats={stats} /></section>
        <section id="videos"><VideosSection /></section>
        {showShopSection && <section id="shop"><ShopSection /></section>}
        <section id="about" className="scroll-mt-[80px]"><AboutSection /></section>
        <section id="collaboration" className="scroll-mt-[80px]"><CollaborationSection /></section>
        <DisclaimerSection />
        <section id="contact" className="scroll-mt-[80px]"><ContactSection /></section>
      </main>
      
      <Footer />

      {/* FLOATING Chat Button - positioned OUTSIDE footer to ensure proper floating */}
      <button
        onClick={() => setChatOpen(true)}
        aria-label="Open Chatbot"
        className="fixed bottom-6 right-6 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-colors duration-300 z-50 relative"
        style={{ position: 'fixed' }} // Force fixed positioning
      >
        💬 Chat
        {!chatOpen && <span className="blink-dot"></span>}
      </button>

      {/* Chat Popup */}
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-red-400 to-yellow-300 flex items-center justify-center text-white font-bold">TF</div>
          <h1 className="text-lg font-semibold">Tanya Fashion Skincare</h1>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 text-sm items-center">
          <NavItem to="home" activeTab={activeTab} onTabChange={handleTabChange}>Home</NavItem>
          <NavItem to="videos" activeTab={activeTab} onTabChange={handleTabChange}>Videos</NavItem>
          {showShopSection && <NavItem to="shop" activeTab={activeTab} onTabChange={handleTabChange}>My Favorites</NavItem>}
          <NavItem to="about" activeTab={activeTab} onTabChange={handleTabChange}>About Me</NavItem>
          <NavItem to="collaboration" activeTab={activeTab} onTabChange={handleTabChange}>Collaboration</NavItem>
          <NavItem to="contact" activeTab={activeTab} onTabChange={handleTabChange}>Say Hello</NavItem>
          <button onClick={onChatOpen} className="text-pink-500 font-bold hover:underline" aria-label="Open chat">
            Chat 💬
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
        <div className="md:hidden bg-white px-4 py-3 space-y-2 animate-slide-down">
          <NavItem to="home" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>Home</NavItem>
          <NavItem to="videos" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>Videos</NavItem>
          {showShopSection && <NavItem to="shop" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>My Favorites</NavItem>}
          <NavItem to="about" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>About Me</NavItem>
          <NavItem to="collaboration" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>Collaboration</NavItem>
          <NavItem to="contact" activeTab={activeTab} onTabChange={handleTabChange} onClick={() => setMenuOpen(false)}>Say Hello</NavItem>
          <button onClick={() => { onChatOpen(); setMenuOpen(false); }} className="block text-pink-500 font-bold hover:underline" aria-label="Open chat">
            Chat 💬
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
      className={`block px-2 py-1 rounded cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-pink-300 ${
        activeTab === to ? "nav-active" : ""
      }`}
    >
      {children}
    </Link>
  );
}

// Hero
function Hero({ stats }) {
  return (
    <section className="bg-gradient-to-br from-pink-200 via-pink-300 to-orange-200 py-16" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900">Welcome to Tanya Fashion Skincare 💖</h2>
          <p className="mt-3 text-gray-800 text-lg">
            Your daily dose of DIY skincare, beauty tips, and fun content! Join our growing family of 127K YouTube subscribers and 45K Instagram followers.
          </p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <a href="https://youtube.com/@tanyafashionskincare" target="_blank" rel="noreferrer" className="px-5 py-3 bg-red-600 text-white rounded-lg text-sm shadow hover:bg-red-700">Subscribe on YouTube</a>
            <a href="http://instagram.com/tanikhanvlog1996/" target="_blank" rel="noreferrer" className="px-5 py-3 bg-pink-500 text-white rounded-lg text-sm shadow hover:bg-pink-600">Follow on Instagram</a>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
            <Stat label="YouTube" value={stats.subscribers} suffix="K+" />
            <Stat label="Instagram" value={stats.instagram} suffix="K+" />
            <Stat label="YT Monthly Views" value={stats.monthlyViews} suffix="M+" />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-64 h-64 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden">
            <img alt="Tanya" src="/MainPic.JPG" className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Stat
function Stat({ label, value, suffix }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="bg-white p-4 rounded-lg shadow text-center" data-aos="zoom-in">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-bold text-gray-900">
        {inView && (
          <CountUp end={value} duration={2} decimals={suffix.includes("M") ? 1 : 0} suffix={suffix} />
        )}
      </div>
    </div>
  );
}

// ShopSection
function ShopSection() {
  return (
    <section className="py-16 bg-orange-50" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-gray-900">My Favorite Products</h3>
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
    <section className="py-16 bg-purple-50" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-gray-900">About Me</h3>
        <p className="mt-3 text-gray-700 text-lg">
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
    <div className="py-16 bg-gradient-to-br from-pink-100 via-orange-100 to-pink-200" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-semibold text-gray-900">Collaboration & Partnerships</h3>
        <p className="mt-3 text-gray-700 text-lg">
          I love working with brands, creators, and businesses that align with my vision in skincare, beauty, and lifestyle.
          Let's create something amazing together! 💖
        </p>
        <p className="mt-4 text-gray-700">
          📩 Email me at{" "}
          <a href="mailto:tanyaskincare123@gmail.com" className="text-pink-600 underline">
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
    <section className="py-16 bg-gray-100" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-gray-900">Say Hello 👋</h3>
        <p className="text-md text-gray-700 mt-2">
          Have a question, feedback, or just want to say hi? Email me at{" "}
          <a href="mailto:tanyaskincare123@gmail.com" aria-label="Email Tanya Skincare" className="text-pink-600 underline">
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          ✖
        </button>
        <h3 className="text-lg font-semibold mb-2">
          Ask Tanya’s AI Skincare Bot 🤖
        </h3>
        <SkincareChatbot onClose={onClose} />
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
