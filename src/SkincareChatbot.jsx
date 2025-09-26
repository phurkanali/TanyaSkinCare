import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiSend, FiThumbsUp, FiThumbsDown, FiCamera } from "react-icons/fi";
import * as faceapi from 'face-api.js';

function TypingDots() {
  const [dots, setDots] = React.useState("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>💬 Tanya is typing{dots}</span>;
}

// AI Provider Class with updated fallback messages
class AIProvider {
  constructor(provider = "deepseek") {
    this.provider = provider;
  }

  async getAIResponse(message, userProfile) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(
        process.env.REACT_APP_AI_API || "https://tanya-ai-backend.onrender.com/api/ai-chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      return data.reply || "No response from AI";
    } catch (err) {
      if (err.name === 'AbortError') {
        return "⏰ Taking too long to respond. Please try a simpler question!";
      }
      console.error("AI error:", err);
      return "⚠️ AI service is down. Please try again later.";
    }
  }

  getFallbackResponse(message, userProfile) {
    const aiDownResponses = [
      `Hi ${userProfile.name}! 🤖 My AI brain is taking a little break right now, but I'd love to help you! 

For immediate skincare advice, check out my latest videos on YouTube: [https://youtube.com/@tanyafashionskincare](https://youtube.com/@tanyafashionskincare)

I cover everything from ${this.getRelevantTopic(
        message
      )} to complete skincare routines! 💖✨`,

      `Oops! ${userProfile.name} 😅 My AI assistant is currently offline, but don't worry! 

I have tons of helpful content on my YouTube channel that might answer your question: [https://youtube.com/@tanyafashionskincare](https://youtube.com/@tanyafashionskincare)

Thanks for your patience, and I hope my videos help! 🌸💕`,

      `Sorry ${userProfile.name}! 🔧 My AI is under maintenance right now, but I haven't forgotten about you!

Visit my YouTube channel for detailed skincare guides and tips: [https://youtube.com/@tanyafashionskincare](https://youtube.com/@tanyafashionskincare)

I'm constantly uploading new content to help with all your beauty concerns! 💄✨`,

      `Hi ${userProfile.name}! 🚧 The AI is temporarily down, but I've got you covered!

Head over to my YouTube channel where I share personalized skincare advice: [https://youtube.com/@tanyafashionskincare](https://youtube.com/@tanyafashionskincare)

You'll find solutions for ${userProfile.skinType || "all"} skin types and much more! 🌟💖`,
    ];

    const randomIndex = Math.floor(Math.random() * aiDownResponses.length);
    return aiDownResponses[randomIndex];
  }

  getRelevantTopic(message) {
    const topics = {
      acne: "acne treatment and prevention",
      pimple: "acne treatment and prevention",
      dry: "dry skin hydration",
      oily: "oil control and balance",
      dark: "dark spot removal",
      spot: "pigmentation and dark spots",
      pigment: "pigmentation treatments",
      wrinkle: "anti-aging and wrinkles",
      aging: "anti-aging skincare",
      sensitive: "sensitive skin care",
      routine: "skincare routines",
      hair: "hair care and treatments",
      dandruff: "dandruff solutions",
      blackhead: "blackhead removal",
      whitehead: "pore cleansing",
      diy: "DIY skincare remedies",
      natural: "natural skincare solutions",
      glow: "glowing skin tips",
      brightening: "skin brightening",
    };

    const messageWords = message.toLowerCase();
    const relevantTopic = Object.keys(topics).find((key) =>
      messageWords.includes(key)
    );

    return relevantTopic ? topics[relevantTopic] : "skincare and beauty tips";
  }

  switchTo(provider) {
    this.provider = provider;
    console.log(`Switched to: ${provider}`);
  }
}

function MessageFeedback({ messageId, onFeedback }) {
  const [feedback, setFeedback] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedback = async (type) => {
    if (isSubmitted) return;

    setFeedback(type);
    setIsSubmitted(true);

    try {
      await fetch("https://tanya-ai-backend.onrender.com/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messageId,
          feedback: type,
          timestamp: new Date().toISOString()
        }),
      });

      if (onFeedback) {
        onFeedback(type);
      }
    } catch (error) {
      console.error("Failed to send feedback:", error);
      setIsSubmitted(false);
      setFeedback(null);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        ✨ Thank you for your feedback!
      </div>
    );
  }

  return (
    <div style={{ 
      marginTop: '8px', 
      display: 'flex', 
      gap: '8px',
      alignItems: 'center'
    }}>
      <span style={{ fontSize: '12px', color: '#666' }}>Was this helpful?</span>
      
      <button
        onClick={() => handleFeedback('like')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: feedback === 'like' ? '#10b981' : '#9ca3af',
          fontSize: '16px',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'color 0.2s ease'
        }}
      >
        <FiThumbsUp size={14} />
      </button>

      <button
        onClick={() => handleFeedback('dislike')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: feedback === 'dislike' ? '#ef4444' : '#9ca3af',
          fontSize: '16px',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'color 0.2s ease'
        }}
      >
        <FiThumbsDown size={14} />
      </button>
    </div>
  );
}

export default function SkincareChatbot({ onClose }) {
  const [aiProvider] = useState(() => new AIProvider("deepseek"));

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    skinType: "",
    country: "",
    otherCountry: "",
    allergy: "",
    allergyDetails: "",
    query: "",
  });
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // ✨ Face analysis states
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);
  
  // ✨ Face-API.js model loading state
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const messagesEndRef = useRef(null);
  const keys = [
    "name",
    "age",
    "gender",
    "skinType",
    "country",
    "allergy",
    "query",
  ];

  // ✨ Load Face-API.js models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        
        // Load required models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        
        setModelsLoaded(true);
        console.log('Face-API.js models loaded successfully!');
      } catch (error) {
        console.error('Failed to load Face-API.js models:', error);
      }
    };
    
    loadModels();
  }, []);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      setTimeout(later, wait);
    };
  }

  // ✨ Helper function to generate skin problems based on age
  const generateSkinProblemsFromAge = (age, gender) => {
    const problems = [];
    
    if (age >= 18 && age < 25) {
      problems.push('Possible acne or occasional breakouts');
      problems.push('Oily T-zone area');
    } else if (age >= 25 && age < 35) {
      problems.push('Early signs of aging around eyes');
      problems.push('Possible dark circles from stress');
      problems.push('Minor skin texture changes');
    } else if (age >= 35 && age < 45) {
      problems.push('Fine lines and wrinkles starting to appear');
      problems.push('Possible age spots or pigmentation');
      problems.push('Skin elasticity beginning to decrease');
    } else if (age >= 45) {
      problems.push('More visible wrinkles and fine lines');
      problems.push('Age spots and pigmentation issues');
      problems.push('Skin firmness and elasticity concerns');
    }

    if (gender === 'female' && age > 30) {
      problems.push('Hormonal skin changes');
    }

    return problems;
  };

  // ✨ Helper function to generate recommendations based on age
  const generateRecommendationsFromAge = (age, gender) => {
    const recommendations = [];
    
    recommendations.push('Use sunscreen daily (SPF 30+)');
    recommendations.push('Drink 8+ glasses of water daily');
    recommendations.push('Get 7-8 hours of quality sleep');
    
    if (age < 25) {
      recommendations.push('Use gentle cleanser twice daily');
      recommendations.push('Light moisturizer for your skin type');
      recommendations.push('Spot treatment for any breakouts');
    } else if (age < 35) {
      recommendations.push('Add vitamin C serum to morning routine');
      recommendations.push('Use retinol 2-3 times per week (start slowly)');
      recommendations.push('Hydrating eye cream for prevention');
    } else if (age < 45) {
      recommendations.push('Consistent retinol use (build up tolerance)');
      recommendations.push('Anti-aging moisturizer with peptides');
      recommendations.push('Weekly exfoliation with AHA/BHA');
    } else {
      recommendations.push('Intensive anti-aging serum with retinol');
      recommendations.push('Rich moisturizer for mature skin');
      recommendations.push('Professional treatments (consider dermatologist)');
    }

    if (age > 25) {
      recommendations.push('Eat antioxidant-rich foods (berries, green tea)');
    }
    
    return recommendations;
  };

  // ✨ Helper function to calculate skin health score
  const calculateSkinHealthScore = (age, detectionScore) => {
    let score = detectionScore;
    
    if (age < 25) {
      score += 10;
    } else if (age > 40) {
      score -= 5;
    }
    
    return Math.min(100, Math.max(60, score));
  };

  // ✨ Face analysis function
  const analyzeFaceImage = async (file) => {
    if (!modelsLoaded) {
      alert('AI models are still loading. Please wait a moment and try again.');
      return;
    }

    setImageAnalyzing(true);
    
    // ✅ ADD THIS: Show immediate analyzing feedback
setMessages(prev => [...prev, {
  id: Date.now() + 0.5,
  sender: "bot", 
  text: "🔍 Analyzing your photo with AI... This will take a few seconds!",
  timestamp: new Date().toISOString()
}]);

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "user",
      text: "Please analyze my face photo",
      image: imageUrl,
      timestamp: new Date().toISOString()
    }]);

    try {
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withAgeAndGender();

      if (!detection) {
        throw new Error('No face detected');
      }

      // ✅ Extract age correctly
      const age = Math.round(detection.age);
      const gender = detection.gender;
      const genderConfidence = Math.round(detection.genderProbability * 100);
      const faceScore = Math.round(detection.detection.score * 100);
      
      const skinProblems = generateSkinProblemsFromAge(age, gender);
      const recommendations = generateRecommendationsFromAge(age, gender);
      const skinHealthScore = calculateSkinHealthScore(age, faceScore);

      const detectedAge = Math.round(detection.age);
      const userRealAge = parseInt(formData.age);
      const ageDifference = detectedAge - userRealAge;

      // Generate age comparison message
      let ageComparison = '';

      if (Math.abs(ageDifference) <= 2) {
        ageComparison = `🎯 **Perfect Match!** The AI detected your age exactly right!`;
      } else if (ageDifference < -5) {
        ageComparison = `🌟 **Incredible!** You look ${Math.abs(ageDifference)} years younger! Your skincare routine is working amazingly!`;
      } else if (ageDifference < -3) {
        ageComparison = `✨ **Fantastic!** You look ${Math.abs(ageDifference)} years younger than your actual age!`;
      } else if (ageDifference > 5) {
        ageComparison = `⚠️ **Skincare Focus Needed:** You appear ${ageDifference} years older. Let's create a targeted routine to help you look your age!`;
      } else if (ageDifference > 3) {
        ageComparison = `🔧 **Room for Improvement:** You appear ${ageDifference} years older. Some skincare adjustments could help!`;
      } else {
        ageComparison = `💫 **Pretty Good!** Very close to your actual age!`;
      }

      // Generate analysis text
      const analysisText = `🎉 **Face Analysis Complete!**

📊 **Your Age Analysis:**
👤 Your Real Age: ${userRealAge} years old
🤖 AI Detected Age: ${detectedAge} years old

${ageComparison}

💯 **Overall Assessment:**
💯 Skin Health Score: ${skinHealthScore}/100
🎯 Detection Confidence: ${faceScore}%

${skinProblems.length > 0 ? 
  `🔍 **Areas to Focus On:**\n${skinProblems.map(problem => `👉 ${problem}`).join('\n')}` 
  : `✨ **Excellent News!**\n👉 Your skin looks ${ageDifference < -2 ? 'younger than' : 'great for'} your age!`}

💡 **My Personal Recommendations:**
${recommendations.slice(0, 4).map(rec => `🌿 ${rec}`).join('\n')}

${userRealAge < 25 ? 
  '🛡️ **Your Focus:** Protection and prevention at your young age!' :
  userRealAge < 35 ? 
  '💫 **Your Focus:** Maintain your skin health with consistent care!' :
  '🌟 **Your Focus:** Anti-aging and repair treatments are perfect now!'
}

${ageDifference > 3 ? 
  'Would you like specific anti-aging remedies to look younger? 🌟' :
  ageDifference < -3 ?
  'Want to know your secret to looking so young? Keep it up! ✨' :
  'Would you like specific DIY remedies for any of these concerns? 💖'
}`;

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: analysisText,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Face analysis error:', error);
      
      let errorMessage = `Sorry ${formData.name}, I couldn't analyze your photo. `;
      
      if (error.message === 'No face detected') {
        errorMessage += `No face was detected. Please try again with:

📸 Photo Tips:
• Face clearly visible and well-lit
• Look directly at camera
• Remove sunglasses/masks
• Avoid heavy shadows

Feel free to ask any skincare questions! 😊`;
      } else {
        errorMessage += `Please try again with a clear, well-lit face photo, or ask me any skincare questions! 💕`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setImageAnalyzing(false);
      setShowImageUpload(false);
    }
  };

  // ✨ Handle image upload - FIXED VERSION
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!modelsLoaded) {
    alert('AI models are still loading. Please wait a moment and try again.');
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file only');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Please upload an image smaller than 5MB');
    return;
  }

  // ✅ IMPORTANT: Don't hide upload interface yet
  // setShowImageUpload(false); // ❌ Remove this line
  
  analyzeFaceImage(file);
};


  const beautifyResponse = (text) => {
    if (!text) return text;

    const lines = text.split('\n').filter(line => line.trim() !== '');

    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      const cleanLine = trimmed.replace(/\*\*/g, '');

      // Face Analysis Complete
      if (cleanLine.includes("Face Analysis Complete")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "16px",
            borderRadius: "16px",
            marginBottom: "16px",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "18px",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
          }}>
            🎉 Face Analysis Complete!
          </div>
        );
      }

      // Age Analysis header
      if (cleanLine.includes("Your Age Analysis")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)",
            border: "2px solid #3b82f6",
            padding: "14px",
            borderRadius: "12px",
            marginBottom: "12px",
          }}>
            <strong style={{ color: "#1e40af", fontSize: "16px" }}>📊 Your Age Analysis</strong>
          </div>
        );
      }

      // Real Age
      if (cleanLine.includes("Real Age:")) {
        return (
          <div key={i} style={{
            background: "#f8fafc",
            border: "2px solid #e2e8f0",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "6px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#475569"
          }}>
            {cleanLine}
          </div>
        );
      }

      // AI Detected Age
      if (cleanLine.includes("AI Detected Age:")) {
        return (
          <div key={i} style={{
            background: "#f1f5f9",
            border: "2px solid #94a3b8",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "16px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#475569"
          }}>
            {cleanLine}
          </div>
        );
      }

      // Age comparison results
      if (cleanLine.includes("Incredible!")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "3px solid #059669",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "700",
            color: "#047857",
            textAlign: "center",
            boxShadow: "0 8px 25px rgba(5, 150, 105, 0.4)"
          }}>
            {cleanLine}
          </div>
        );
      }

      if (cleanLine.includes("Perfect Match!")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
            border: "3px solid #10b981",
            padding: "18px",
            borderRadius: "15px",
            marginBottom: "18px",
            fontSize: "17px",
            fontWeight: "700",
            color: "#047857",
            textAlign: "center",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)"
          }}>
            {cleanLine}
          </div>
        );
      }

      // Overall Assessment
      if (cleanLine.includes("Overall Assessment")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)",
            border: "2px solid #3b82f6",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}>
            <strong style={{ color: "#1e40af", fontSize: "16px" }}>💯 Overall Assessment</strong>
          </div>
        );
      }

      // Skin Health Score
      if (cleanLine.includes("Skin Health Score")) {
        const score = cleanLine.match(/(\d+)\/100/)?.[1] || "0";
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "800",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)"
          }}>
            💯 Skin Health Score: {score}/100
          </div>
        );
      }

      // Excellent News
      if (cleanLine.includes("Excellent News")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "2px solid #10b981",
            padding: "14px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}>
            <strong style={{ color: "#065f46", fontSize: "16px" }}>✨ Excellent News!</strong>
          </div>
        );
      }

      // My Personal Recommendations
      if (cleanLine.includes("My Personal Recommendations")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
            border: "2px solid #10b981",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}>
            <strong style={{ color: "#065f46", fontSize: "16px" }}>💡 My Personal Recommendations</strong>
          </div>
        );
      }

      // Recommendation items
      if (cleanLine.startsWith("🌿")) {
        return (
          <div key={i} style={{
            background: "#f0fdf4",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "6px",
            borderLeft: "4px solid #22c55e",
            fontSize: "15px"
          }}>
            {cleanLine}
          </div>
        );
      }

      // Focus areas
      if (cleanLine.startsWith("👉")) {
        return (
          <div key={i} style={{
            background: "#fefbf2",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "6px",
            borderLeft: "4px solid #f59e0b",
            fontSize: "15px"
          }}>
            {cleanLine}
          </div>
        );
      }

      // Your Focus messages
      if (cleanLine.includes("Your Focus:")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
            color: "white",
            padding: "16px",
            borderRadius: "12px",
            marginTop: "16px",
            marginBottom: "16px",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "16px",
            boxShadow: "0 4px 15px rgba(236, 72, 153, 0.4)"
          }}>
            {cleanLine}
          </div>
        );
      }

      // Questions
      if (cleanLine.includes("Want to know") || cleanLine.includes("Would you like")) {
        return (
          <div key={i} style={{
            background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
            border: "2px solid #ec4899",
            padding: "14px",
            borderRadius: "12px",
            marginTop: "16px",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "600",
            color: "#be185d"
          }}>
            {cleanLine}
          </div>
        );
      }

      // Default - any other line
      return (
        <div key={i} style={{ 
          marginBottom: "8px", 
          lineHeight: "1.6", 
          fontSize: "15px",
          padding: "4px 0"
        }}>
          {cleanLine}
        </div>
      );
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, step]);

  // ✅ FIXED: sendQuery function defined ONLY ONCE in correct scope
  const sendQuery = async (currentUserInput, form = formData) => {
    const userQuery = currentUserInput || form.query;
    const messageId = Date.now();

    if (!userQuery.trim()) return;

    const payload = { ...form, query: userQuery };
    console.log("🚀 Sending:", payload);

    const prompt = `
You are Tanya, a skincare & haircare specialist. You give advice on skin, hair, and women’s health issues (PCOS, hormonal imbalance, periods, pregnancy-related skin/hair changes). Always clarify medical questions need a doctor. Give short, caring, casual advice.

ONLY ANSWER:
• Skin (acne, dark spots, wrinkles, dryness, oiliness, sensitivity)
• Hair (fall, dandruff, thinning, greying/white hair, scalp health)
• Beauty routines & DIY remedies
• Natural/Ayurvedic treatments
• Product recommendations

NON-BEAUTY QUESTIONS → reply: "Hi ${formData.name || 'Friend'}! I'm your skincare & haircare specialist 🌸 Ask me about skin, hair, beauty routines, or DIY remedies 💖"

USER PROFILE:
• Name: ${formData.name || 'Friend'}
• Age: ${formData.age || 'Not provided'}
• Gender: ${formData.gender || 'Not provided'}
• Skin Type: ${formData.skinType || 'Not provided'}
• Location: ${formData.country || 'Not provided'}

USER QUESTION: "${userQuery}"

STYLE:
• Short, friendly, Hinglish-English when natural
• 5–6 sentences max, light emojis 🌿✨💖
• Use simple bullets 👉🌿✨
• Reply in same language as user

RESPONSE STRUCTURE:
- Greet by name
- Quick assessment
- 2–3 practical solutions (DIY + safe product)
- 1 daily routine tip
- 1 lifestyle/diet tip
- 1 precaution
- Supportive closing

PROFILE USAGE:
• Personalize using name, age, gender, skin type, location

EXAMPLES:
User(Hindi): "Mere baal safed ho rahe hain"
Assistant(Hindi): "Hi Friend! Safed baal hona aam baat hai 💖
👉 Roz scalp par amla & bhringraj ka tel lagao
👉 Mahine mein 1x mehndi+shikakai mask
👉 Herbal shampoo, avoid chemicals
Rozana scalp massage 🌿
Iron & Vitamin B12 khana zaroor
Agar tezi se safed ho rahe hain → doctor ✨"

User(English): "I have dandruff"
Assistant(English): "Hi Friend! Dandruff is common 💖
👉 Gentle anti-dandruff shampoo 2–3x/week
👉 Neem water rinse 🌿
👉 Keep scalp clean, avoid oily products
Severe itching → dermatologist ✨"

RULES:
• Stay on skin/hair/beauty topics
• Keep answers chatty, not essay-like
• Treat short queries like "pimples", "grey hair" as valid
`;

    setMessages((prev) => [...prev, { 
      id: messageId,
      sender: "user", 
      text: userQuery,
      timestamp: new Date().toISOString()
    }]);
    
    setLoading(true);
    setInputValue("");

    try {
      const aiResponse = await aiProvider.getAIResponse(prompt);

      setMessages((prev) => [
        ...prev,
        {
          id: messageId + 1,
          sender: "bot",
          text: aiResponse || "Sorry, I couldn't generate a response.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("AI error:", error);

      const fallbackResponse = aiProvider.getFallbackResponse(
        prompt || "",   
        formData || {}  
      );

      setMessages((prev) => [
        ...prev,
        {
          id: messageId + 1,
          sender: "bot",
          text: fallbackResponse || "Something went wrong, please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: handleNext function (clean, no nested sendQuery)
  const handleNext = (value) => {
  if (step === 0 && !value.trim()) {
    alert("Please enter your name so I can personalize your experience");
    return;
  }
  if (step === 1) {
    if (!/^\d+$/.test(value)) {
      alert("Please enter a valid age (numbers only)");
      return;
    }
    const num = parseInt(value, 10);
    if (num < 14) {
      alert("I'm sorry, but I can only provide advice to people aged 14 and above for safety reasons.");
      return;
    }
    if (num > 90) {
      alert("Please enter a valid age between 14 and 90");
      return;
    }
  }
  if (step === 4) {
    if (!formData.country) {
      alert("Please select your country so I can give location-specific advice");
      return;
    }
    if (formData.country === "Other" && !formData.otherCountry.trim()) {
      alert("Please tell me which country you're from");
      return;
    }
  }
  if (step === 5 && formData.allergy === "Yes" && !formData.allergyDetails.trim()) {
    alert("Please describe your allergies so I can give you safe recommendations");
    return;
  }

  // ✅ ADD THIS LINE: Clear the input field after each step
  setInputValue("");

  setFormData((prev) => {
    const updated = { ...prev, [keys[step]]: value };

    if (step < keys.length - 1) {
      setStep(step + 1);
    } else {
      // ✅ Now sendQuery is accessible from component scope
      sendQuery(updated.query || value, updated);
    }

    return updated;
  });
};

  // ✅ FIXED: debouncedSendQuery with proper dependency
  const debouncedSendQuery = useCallback(
    debounce((input) => {
      sendQuery(input);
    }, 500),
    [sendQuery]
  );

  const handleSendClick = () => {
    const currentInput = inputValue.trim();
    if (currentInput !== "") {
      if (step < keys.length - 1) {
        handleNext(currentInput);
      } else {
        debouncedSendQuery(currentInput);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentInput = inputValue.trim();
      if (currentInput !== "") {
        if (step < keys.length - 1) {
          handleNext(currentInput);
        } else {
          debouncedSendQuery(currentInput);
        }
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1rem",
          background: "#fdf2f8",
          borderRadius: "8px",
          paddingBottom: "80px",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: "12px",
              maxWidth: "80%",
              backgroundColor: msg.sender === "user" ? "#ec4899" : "#f3f4f6",
              color: msg.sender === "user" ? "white" : "#374151",
              marginLeft: msg.sender === "user" ? "auto" : "0",
              lineHeight: "1.6",
              whiteSpace: "pre-line",
            }}
          >
            {/* Show uploaded image if exists */}
            {msg.image && (
              <img 
                src={msg.image}
                alt="Uploaded"
                style={{
                  width: "100%",
                  maxWidth: "min(200px, 90vw)",
                  borderRadius: "8px",
                  marginBottom: "8px"
                }}
              />
            )}
            
            {msg.sender === "bot" ? beautifyResponse(msg.text) : msg.text}
            {msg.sender === 'bot' && (
              <MessageFeedback 
                messageId={`msg-${idx}-${Date.now()}`}
                onFeedback={(type) => console.log(`Message ${idx} feedback: ${type}`)}
              />
            )}
          </div>
        ))}

        {/* ALL STEPS INCLUDED - OPTIMIZED UX */}
        {step === 0 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            Hi 😊 I’m Tanya, your skincare assistant. What’s your name?
          </div>
        )}

        {step === 1 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            Nice to meet you, {formData.name}! 💖 To share the best skincare tips for you, can you tell me your age?
          </div>
        )}

        {step === 2 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>Great! 🌸 Can you tell me your gender? This will help me suggest the right skincare for you.</p>
            <button
              onClick={() => handleNext("Female")}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "0.5rem",
                background: "#ec4899",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Female
            </button>
            <button
              onClick={() => handleNext("Male")}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Male
            </button>
          </div>
        )}

        {step === 3 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>Great! ✨ What’s your skin type? If you’re not sure, just pick the one that feels closest.</p>
            {["Normal", "Dry", "Oily", "Combination", "Sensitive"].map(
              (type) => (
                <label
                  key={type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                    borderRadius: "4px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#f9f9f9"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}
                >
                  <input
                    type="radio"
                    name="skinType"
                    value={type}
                    onChange={() => handleNext(type)}
                  />
                  <span>{type} skin</span>
                </label>
              )
            )}
          </div>
        )}

        {step === 4 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>Almost done! 🌏 Which country are you in? This helps me suggest products available near you.</p>
            <select
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "16px",
              }}
              value={formData.country}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
            >
              <option value="">-- Please select your country --</option>
              <option value="India">🇮🇳 India</option>
              <option value="Pakistan">🇵🇰 Pakistan</option>
              <option value="Bangladesh">🇧🇩 Bangladesh</option>
              <option value="Nepal">🇳🇵 Nepal</option>
              <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
              <option value="Other">🌍 Other country</option>
            </select>
            {formData.country === "Other" && (
              <input
                type="text"
                placeholder="Please tell me your country name"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  fontSize: "16px",
                }}
                value={formData.otherCountry}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    otherCountry: e.target.value,
                  }))
                }
              />
            )}
            <button
              onClick={() =>
                handleNext(
                  formData.country === "Other"
                    ? formData.otherCountry
                    : formData.country
                )
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#ec4899",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 5 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>Last question! 🤔 Do you have any allergies to skincare or haircare products? This helps keep you safe.</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <button
                onClick={() =>
                  setFormData((prev) => ({ ...prev, allergy: "No" })) ||
                  handleNext("No")
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                No, I don't have any known allergies
              </button>
              <button
                onClick={() =>
                  setFormData((prev) => ({ ...prev, allergy: "Yes" }))
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Yes, I have allergies
              </button>
            </div>
            {formData.allergy === "Yes" && (
              <>
                <input
                  type="text"
                  placeholder="Please describe what you're allergic to (e.g., fragrances, specific ingredients)"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    fontSize: "16px",
                  }}
                  value={formData.allergyDetails}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      allergyDetails: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={() => handleNext(formData.allergyDetails)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#ec4899",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Continue
                </button>
              </>
            )}
          </div>
        )}

        {/* ✨ UPDATED STEP 6 WITH MODEL LOADING STATUS */}
        {step === 6 && messages.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <p style={{ marginBottom: "12px" }}>Awesome! 🎉 Now I can help you with skincare and haircare. What’s your question?</p>
            
            {/* Face Analysis Button */}
            <button
              onClick={() => setShowImageUpload(true)}
              disabled={!modelsLoaded}
              style={{
                width: "100%",
                padding: "12px",
                background: modelsLoaded ? 
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : 
                  "#d1d5db",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: modelsLoaded ? "pointer" : "not-allowed",
                fontSize: "16px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: modelsLoaded ? 1 : 0.6
              }}
            >
              📸 {modelsLoaded ? 'Scan My Face for Age & Problems' : 'Loading AI Models...'}
            </button>
            
            {!modelsLoaded && (
              <p style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "8px" }}>
                AI models are loading in the background. This may take a few seconds...
              </p>
            )}
          </div>
        )}

        {/* Image upload interface - FIXED VERSION WITH PROGRESS */}
{showImageUpload && (
  <div style={{
    background: "white",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    border: "2px dashed #ec4899"
  }}>
    <h4 style={{ marginBottom: "12px", color: "#333", textAlign: "center" }}>
      📸 Upload Your Face Photo
    </h4>
    <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px", textAlign: "center" }}>
      Take a clear, well-lit photo of your face. I'll analyze your skin age and suggest personalized care!
    </p>
    
    {/* ✅ IMPORTANT: Show progress when analyzing */}
    {imageAnalyzing && (
      <div style={{
        background: "#f0f9ff",
        border: "2px solid #3b82f6", 
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "16px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "20px", marginBottom: "8px" }}>🔍</div>
        <p style={{ color: "#1e40af", fontWeight: "500", marginBottom: "8px" }}>
          Analyzing your photo with AI... Please wait!
        </p>
        <div style={{
          width: "100%",
          height: "6px",
          background: "#e5e7eb",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "8px"
        }}>
          <div style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            animation: "progress 2s ease-in-out infinite"
          }}></div>
        </div>
        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          This will take 3-5 seconds. Please don't close this window!
        </p>
      </div>
    )}
    
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      style={{ display: "none" }}
      id="face-upload"
      disabled={imageAnalyzing}
    />
    
    <div style={{ display: "flex", gap: "8px" }}>
      <label 
        htmlFor="face-upload"
        style={{
          flex: 1,
          padding: "12px",
          background: imageAnalyzing ? "#9ca3af" : "#ec4899",
          color: "white",
          textAlign: "center",
          borderRadius: "8px",
          cursor: imageAnalyzing ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          opacity: imageAnalyzing ? 0.7 : 1,
          pointerEvents: imageAnalyzing ? "none" : "auto"
        }}
      >
        <FiCamera size={18} />
        {imageAnalyzing ? "Analyzing..." : "Upload Photo"}
      </label>
      
      <button
        onClick={() => {
          if (!imageAnalyzing) {
            setShowImageUpload(false);
          }
        }}
        disabled={imageAnalyzing}
        style={{
          padding: "12px 16px",
          background: imageAnalyzing ? "#9ca3af" : "#6b7280",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: imageAnalyzing ? "not-allowed" : "pointer",
          fontSize: "16px",
          opacity: imageAnalyzing ? 0.7 : 1,
          pointerEvents: imageAnalyzing ? "none" : "auto"
        }}
      >
        {imageAnalyzing ? "Wait..." : "Cancel"}
      </button>
    </div>

    {/* Photo tips */}
    <div style={{
      marginTop: "12px",
      fontSize: "12px",
      color: "#666",
      textAlign: "center"
    }}>
      💡 <strong>Tips:</strong> Good lighting • Face clearly visible • Look directly at camera • Remove sunglasses
    </div>
  </div>
)}

        {loading && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              color: "#6b7280",
            }}
          >
            <TypingDots />
          </div>
        )}

        {/* Show analyzing status */}
        {imageAnalyzing && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              color: "#6b7280",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔍</div>
            <p>Analyzing your face photo with AI...</p>
          </div>
        )}

        {/* ✨ SHOW MODEL LOADING STATUS */}
        {!modelsLoaded && step === 6 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              color: "#6b7280",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🤖</div>
            <p>Loading AI models for face analysis...</p>
            <div style={{ fontSize: "12px", marginTop: "8px" }}>
              This happens once and may take 10-30 seconds depending on your internet speed.
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {step !== 2 &&
        step !== 3 &&
        step !== 4 &&
        step !== 5 &&
        !loading &&
        !imageAnalyzing && (
          <div style={{
            position: "sticky",
            bottom: "0",
            zIndex: 1000,
            left: "0",
            right: "0",
            padding: "12px",
            background: "white",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            minHeight: "60px",
            boxSizing: "border-box"
          }}>
            {/* Camera Button */}
            {step === 6 && (
              <button
                onClick={() => setShowImageUpload(true)}
                disabled={!modelsLoaded}
                style={{
                  width: "44px",
                  height: "44px",
                  minWidth: "44px",
                  background: modelsLoaded ? "#10b981" : "#d1d5db",
                  border: "none",
                  borderRadius: "22px",
                  color: "white",
                  cursor: modelsLoaded ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                  opacity: modelsLoaded ? 1 : 0.6
                }}
              >
                📷
              </button>
            )}

            <input
              type="text"
              placeholder={step === 0 ? "Type your name here..." : 
                          step === 1 ? "Enter your age..." :
                          step === 6 ? "Ask me about skincare, haircare, acne, or any beauty concern..." :
                          "Type your message..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "2px solid #ec4899",
                borderRadius: "20px",
                fontSize: "16px",
                outline: "none",
                background: "white",
                minWidth: "0",
                boxSizing: "border-box"
              }}
            />

            <button
              onClick={handleSendClick}
              disabled={!inputValue.trim()}
              style={{
                width: "44px",
                height: "44px",
                minWidth: "44px",
                background: inputValue.trim() ? "#ec4899" : "#d1d5db",
                border: "none",
                borderRadius: "22px",
                color: "white",
                cursor: inputValue.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                transition: "all 0.2s ease",
                flexShrink: 0
              }}
            >
              <FiSend />
            </button>
          </div>
        )}
    </div>
  );
}
