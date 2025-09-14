// src/components/AdUnit.js
import { useEffect } from "react";

export default function AdUnit({ slot }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log("AdSense error", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8831250158617950"   // ✅ Your AdSense publisher ID
      data-ad-slot={slot}                       // ✅ Ad slot ID from AdSense dashboard
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
