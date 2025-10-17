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
          Your privacy is extremely important to us. This Privacy Policy explains how Tanya DIY
          (“we”, “our”, or “us”) handles your information when you visit our website or interact
          with our chatbot or other features.
        </p>

        <h2 className="mt-8 text-2xl font-semibold text-gray-900">
          1. Information We Collect
        </h2>
        <p className="mt-2 text-gray-700">
          We do not collect or permanently store any personal information, photos, or chat messages.
          The chatbot may process your questions temporarily to provide accurate responses, but this
          data is not saved on our servers.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          2. Chatbot Interactions
        </h2>
        <p className="mt-2 text-gray-700">
          When you chat with our AI assistant, your messages are used only to generate replies.
          Once your session ends, the data is deleted automatically and is not stored or shared in
          any form.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          3. Photos & Uploads
        </h2>
        <p className="mt-2 text-gray-700">
          If you upload a photo or provide an image for analysis, it is processed in real-time to
          give instant results. We do not store, share, or reuse any images after the analysis is
          completed.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          4. Cookies & Analytics
        </h2>
        <p className="mt-2 text-gray-700">
          Our site may use cookies and analytics tools (like Google Analytics or Ezoic) to
          understand visitor trends and improve the website experience. These do not include your
          personal chat or image data.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          5. Data Security
        </h2>
        <p className="mt-2 text-gray-700">
          We take strong precautions to ensure that your browsing and chatbot experience remain
          secure. Since we do not store any personal data, there is no risk of your chat or image
          being accessed later.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">6. Your Rights</h2>
        <p className="mt-2 text-gray-700">
          You have full control over what you share in the chatbot. If you have any questions about
          privacy or security, you can contact us at{" "}
          <a
            href="mailto:tanyaskincare123@gmail.com"
            className="text-pink-600 underline hover:text-pink-700"
          >
            tanyaskincare123@gmail.com
          </a>
          .
        </p>

        {/* ✅ Keep Ezoic Policy (unchanged) */}
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
          <strong>Effective Date:</strong> October 17, 2025
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
