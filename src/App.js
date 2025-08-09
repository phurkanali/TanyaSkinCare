import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Link } from "react-scroll";
import AOS from "aos";
import { useInView } from "react-intersection-observer";
import VideosSection from "./VideosSection";

const stats = {
  subscribers: 128,     // Will show as 127K+
  instagram: 44,        // Will show as 44K+
  monthlyViews: 17,   // Will show as 16.7M+
};

export default function App() {
  const showShopSection = process.env.REACT_APP_SHOW_SHOP_SECTION === "true"; // ✅ Flag from .env

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <TopBar />
      <main>
        <Hero />
        <VideosSection />
        {showShopSection && <ShopSection />}
        <AboutSection />
        <CollaborationSection /> {/* ✅ New section */}
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}

function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-red-400 to-yellow-300 flex items-center justify-center text-white font-bold">TF</div>
          <h1 className="text-lg font-semibold">Tanya Fashion Skincare</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 text-sm items-center">
          <NavItem to="home">Home</NavItem>
          <NavItem to="videos">Videos</NavItem>
          {process.env.REACT_APP_SHOW_SHOP_SECTION === "true" && <NavItem to="shop">My Favorites</NavItem>}
          <NavItem to="about">About Me</NavItem>
          <NavItem to="collaboration">Collaboration</NavItem> {/* ✅ New Tab */}
          <NavItem to="contact">Say Hello</NavItem>
          <a href="http://instagram.com/tanikhanvlog1996/" aria-label="Open Tanya's Instagram" target="_blank" rel="noreferrer" className="text-pink-500 font-bold hover:underline">IG</a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-800"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-3 space-y-2 animate-slide-down">
          <NavItem to="home" onClick={() => setMenuOpen(false)}>Home</NavItem>
          <NavItem to="videos" onClick={() => setMenuOpen(false)}>Videos</NavItem>
          {process.env.REACT_APP_SHOW_SHOP_SECTION === "true" && (
            <NavItem to="shop" onClick={() => setMenuOpen(false)}>My Favorites</NavItem>
          )}
          <NavItem to="about" onClick={() => setMenuOpen(false)}>About Me</NavItem>
          <NavItem to="collaboration" onClick={() => setMenuOpen(false)}>Collaboration</NavItem> {/* ✅ Mobile tab */}
          <NavItem to="contact" onClick={() => setMenuOpen(false)}>Say Hello</NavItem>
          <a href="http://instagram.com/tanikhanvlog1996/" target="_blank" rel="noreferrer" className="block text-pink-500 font-bold hover:underline">Instagram</a>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, children, onClick }) {
  return (
    <Link
      to={to}
      smooth={true}
      duration={500}
      offset={-70}
      onClick={onClick}
      className="hover:underline cursor-pointer block px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
    >
      {children}
    </Link>
  );
}

function Hero() {
  return (
    <section id="home" className="bg-gradient-to-br from-pink-200 via-pink-300 to-orange-200 py-16" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900">Welcome to Tanya Fashion Skincare 💖</h2>
          <p className="mt-3 text-gray-800 text-lg">
            Your daily dose of DIY skincare, beauty tips, and fun content! Join our growing family of
            127K YouTube subscribers and 44K Instagram followers.
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
            <img alt="Tanya" src="https://placehold.co/300x300?text=Tanya" className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, suffix }) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref} className="bg-white p-4 rounded-lg shadow text-center" data-aos="zoom-in">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-bold text-gray-900">
        {inView && (
          <CountUp
            end={value}
            duration={2}
            decimals={suffix.includes("M") ? 1 : 0}
            suffix={suffix}
          />
        )}
      </div>
    </div>
  );
}

function ShopSection() {
  return (
    <section id="shop" className="py-16 bg-orange-50" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-gray-900">My Favorite Products</h3>
        <p className="text-sm text-gray-700 mt-2">These are some of the skincare items I personally use and love!</p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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

function AboutSection() {
  return (
    <section id="about" className="py-16 bg-purple-50" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-gray-900">About Me</h3>
        <p className="mt-3 text-gray-700 text-lg">
          Hi, I’m Tanya! I create DIY skincare tutorials, beauty tips, and fun lifestyle content.
          I love connecting with my viewers and sharing easy, affordable ways to look and feel amazing. 💖
        </p>
      </div>
    </section>
  );
}

function CollaborationSection() {
  return (
    <section id="collaboration" className="py-16 bg-gradient-to-br from-pink-100 via-orange-100 to-pink-200" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-semibold text-gray-900">Collaboration & Partnerships</h3>
        <p className="mt-3 text-gray-700 text-lg">
          I love working with brands, creators, and businesses that align with my vision in skincare, beauty, and lifestyle.
          Let’s create something amazing together! 💖
        </p>
        <p className="mt-4 text-gray-700">
          📩 Email me at{" "}
          <a href="mailto:tanyaskincare123@gmail.com" className="text-pink-600 underline">
            tanyaskincare123@gmail.com
          </a>
        </p>
        <a
          href="/Tanya-Media-Kit.pdf"
          download
          className="inline-block mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
        >
          📄 Download My Media Kit
        </a>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-100" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-gray-900">Say Hello 👋</h3>
        <p className="text-md text-gray-700 mt-2">
          Have a question, feedback, or just want to say hi? Email me at{" "}
          <a href="mailto:tanyaskincare123@gmail.com" aria-label="Send email to Tanya Skincare" className="text-pink-600 underline">
            tanyaskincare123@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white mt-12 py-6">
      <div className="max-w-6xl mx-auto px-4 text-sm text-gray-500 flex flex-col sm:flex-row gap-2 sm:gap-6">
        <span>© {new Date().getFullYear()} Tanya Fashion Skincare • Made with 💖 for my viewers</span>
        <span>
          <a href="https://youtube.com/@tanyafashionskincare" target="_blank" rel="noreferrer" className="text-blue-600 underline">YouTube</a> | 
          <a href="http://instagram.com/tanikhanvlog1996/" target="_blank" rel="noreferrer" className="text-pink-500 underline ml-1">Instagram</a>
        </span>
      </div>
    </footer>
  );
}
