import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function RemediesPage() {
  useEffect(() => {
    if (AOS && typeof AOS.init === 'function') {
      AOS.init({ duration: 600, once: true, disable: 'mobile' });
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <RemediesHeader />
      <HeroSection />
      <RemedyCategories />
      <CTASection />
      <DisclaimerSection />
      <RemediesFooter />
    </div>
  );
}

function RemediesHeader() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 sm:gap-3">
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
        </a>

        <a
          href="/"
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 hover:shadow-lg text-sm"
        >
          Back to Home
        </a>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,207,232,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(254,215,170,0.2),transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6" data-aos="fade-up">
          Home Remedies That <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">Actually Work!</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="100">
          Discover simple, effective DIY remedies for glowing skin and strong hair using natural ingredients you already have at home.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">100% Natural</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Easy to Make</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Proven Results</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function RemedyCategories() {
  const categories = [
    {
      title: "For Skin Glow",
      icon: "✨",
      color: "from-amber-400 to-orange-400",
      bgColor: "bg-amber-50",
      remedies: [
        { name: "Turmeric Face Mask", ingredients: "Turmeric + Honey + Milk", benefit: "Brightens & evens skin tone" },
        { name: "Honey Glow Pack", ingredients: "Honey + Aloe Vera + Rose Water", benefit: "Deep hydration & natural glow" },
        { name: "Aloe Vera Refresh", ingredients: "Fresh Aloe Vera Gel", benefit: "Soothes & moisturizes skin" }
      ]
    },
    {
      title: "For Dandruff",
      icon: "🌿",
      color: "from-green-400 to-emerald-400",
      bgColor: "bg-green-50",
      remedies: [
        { name: "Neem Hair Rinse", ingredients: "Neem Leaves + Water", benefit: "Eliminates dandruff naturally" },
        { name: "Coconut Oil Treatment", ingredients: "Coconut Oil + Lemon Juice", benefit: "Moisturizes scalp & reduces flakes" },
        { name: "Curd Hair Mask", ingredients: "Fresh Curd + Fenugreek", benefit: "Controls dandruff & conditions hair" }
      ]
    },
    {
      title: "For Acne & Pimples",
      icon: "🌸",
      color: "from-pink-400 to-rose-400",
      bgColor: "bg-pink-50",
      remedies: [
        { name: "Multani Mitti Pack", ingredients: "Multani Mitti + Rose Water", benefit: "Absorbs excess oil & clears pores" },
        { name: "Tea Tree Spot Treatment", ingredients: "Tea Tree Oil + Aloe Vera", benefit: "Fights acne-causing bacteria" },
        { name: "Lemon Toner", ingredients: "Lemon Juice + Water", benefit: "Reduces blemishes & tightens pores" }
      ]
    },
    {
      title: "For Hair Fall",
      icon: "💪",
      color: "from-purple-400 to-indigo-400",
      bgColor: "bg-purple-50",
      remedies: [
        { name: "Onion Juice Treatment", ingredients: "Fresh Onion Juice", benefit: "Stimulates hair follicles & growth" },
        { name: "Amla Hair Mask", ingredients: "Amla Powder + Coconut Oil", benefit: "Strengthens roots & prevents fall" },
        { name: "Castor Oil Massage", ingredients: "Castor Oil + Vitamin E", benefit: "Promotes thick, healthy hair growth" }
      ]
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12" data-aos="fade-up">
          DIY Remedies by Category
        </h2>

        <div className="grid sm:grid-cols-2 gap-8">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className={`${category.bgColor} rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`text-4xl w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-md`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.remedies.map((remedy, ridx) => (
                  <div key={ridx} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-900 mb-2">{remedy.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Ingredients:</span> {remedy.ingredients}
                    </p>
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Benefit:</span> {remedy.benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,207,232,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(254,215,170,0.2),transparent_50%)]"></div>

      <div className="relative max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Want to See These Remedies in Action?
        </h2>

        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Watch detailed video tutorials on my YouTube channel and follow along step-by-step to achieve amazing results!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://youtube.com/@tanyafashionskincare"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 bg-red-600 text-white rounded-xl text-lg font-medium shadow-lg hover:shadow-xl hover:bg-red-700 hover:-translate-y-0.5 flex items-center gap-2 transition-all duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch on YouTube
          </a>

          <a
            href="http://instagram.com/tanikhanvlog1996/"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-lg font-medium shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600 hover:-translate-y-0.5 flex items-center gap-2 transition-all duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Daily Tips on Instagram
          </a>
        </div>

        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-pink-200 shadow-sm">
          <p className="text-gray-800 text-lg font-medium mb-3">
            Get Weekly DIY Tips Straight to Your Inbox
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Join 280K+ subscribers who receive exclusive natural beauty recipes, tips, and tutorials every week!
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 hover:shadow-lg whitespace-nowrap text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DisclaimerSection() {
  return (
    <div className="py-6 bg-gradient-to-r from-yellow-50 to-amber-50 max-w-5xl mx-auto my-8 px-6 text-center text-sm md:text-base text-yellow-900 rounded-2xl shadow-lg border border-yellow-200">
      <p>
        <strong>Disclaimer:</strong> The skincare and haircare tips shared here are based on personal experience and general knowledge. Always{" "}
        <span className="font-bold text-red-600 underline">do a patch test</span>{" "}
        before trying any new product or remedy. If you have sensitive skin, allergies, or medical conditions, please consult a dermatologist or healthcare professional before use.
      </p>
    </div>
  );
}

function RemediesFooter() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white py-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-sm text-gray-600 flex flex-col sm:flex-row items-center sm:items-baseline gap-3 sm:gap-6 text-center sm:text-left">
          <span className="font-medium">2025 Tanya Fashion Skincare</span>
          <span>
            <a href="https://youtube.com/@tanyafashionskincare" target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-700 font-medium transition-colors">YouTube</a> <span className="text-gray-400">|</span>{' '}
            <a href="http://instagram.com/tanikhanvlog1996/" target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-600 font-medium transition-colors ml-1">Instagram</a>
          </span>
          <a href="/" className="text-pink-600 hover:text-pink-700 font-medium transition-colors sm:ml-auto">
            Back to Home
          </a>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <a href="/privacy-policy" className="hover:text-pink-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="mailto:tanyaskincare123@gmail.com" className="hover:text-pink-600 transition-colors">Contact</a>
            <span>•</span>
            <a href="/" className="hover:text-pink-600 transition-colors">Home</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
