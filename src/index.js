import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import PrivacyPolicy from './PrivacyPolicy';
import RemediesPage from './RemediesPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Main App (your home page) */}
        <Route path="/" element={<App />} />

        {/* Privacy Policy Page */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Remedies Page */}
        <Route path="/remedies" element={<RemediesPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// Optional performance analytics
reportWebVitals();
