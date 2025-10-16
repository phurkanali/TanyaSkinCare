// src/PrivacyPolicy.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function PrivacyPolicy() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 text-gray-800 py-12 px-6">
      <div
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12"
        data-aos="fade-up"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          Privacy Policy
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mt-4 rounded-full"></div>

        <p className="mt-8 text-gray-700 leading-relaxed">
          Your privacy is important to us. This Privacy Policy explains how Tanya Fashion Skincare
          (“we”, “our”, or “us”) collects, uses, and protects your information when you use our
          website, chatbot, or any related services.
        </p>

        <h2 className="mt-8 text-2xl font-semibold text-gray-900">
          1. Information We Collect
        </h2>
        <p className="mt-2 text-gray-700">
          We may collect personal information such as your name, email address, and messages you
          send through our chatbot or contact form. We also collect analytics data to improve our
          services.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          2. How We Use Your Information
        </h2>
        <p className="mt-2 text-gray-700">
          We use your data to respond to your inquiries, improve our content, and provide better
          recommendations. We never sell or share your information with third parties for marketing
          purposes.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          3. Cookies & Analytics
        </h2>
        <p className="mt-2 text-gray-700">
          Our site may use cookies and analytics tools like Google Analytics to understand visitor
          behavior and enhance your experience.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          4. Data Security
        </h2>
        <p className="mt-2 text-gray-700">
          We take reasonable measures to protect your personal data from unauthorized access,
          disclosure, or misuse.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">5. Your Rights</h2>
        <p className="mt-2 text-gray-700">
          You may request access to, correction, or deletion of your personal data by contacting us
          at{" "}
          <a
            href="mailto:tanyaskincare123@gmail.com"
            className="text-pink-600 underline hover:text-pink-700"
          >
            tanyaskincare123@gmail.com
          </a>
          .
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          6. Updates to This Policy
        </h2>
        <p className="mt-2 text-gray-700">
          We may update this Privacy Policy from time to time. Any changes will be posted on this
          page with an updated effective date.
        </p>

        {/* ✅ Ezoic Privacy Policy Disclosure */}
        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          7. Ezoic Services
        </h2>
        <p className="mt-2 text-gray-700">
          This website uses Ezoic to provide personalization and analytic services. As such, Ezoic's
          privacy policy is in effect and can be reviewed at the following link:{" "}
          <a
            href="http://g.ezoic.net/privacy/tanyadiy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 underline hover:text-pink-700"
          >
            View Ezoic Privacy Policy
          </a>
          .
        </p>

        <p className="mt-8 text-gray-700">
          <strong>Effective Date:</strong> October 16, 2025
        </p>

        <div className="mt-10 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
