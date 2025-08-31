import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiSend, FiThumbsUp, FiThumbsDown } from "react-icons/fi";

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

  // Update your AIProvider's getAIResponse method
  async getAIResponse(message, userProfile) {
    try {
      // Add timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch(
        process.env.REACT_APP_AI_API || "https://tanya-ai-backend.onrender.com/api/ai-chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
          signal: controller.signal // Add abort signal
        }
      );

      clearTimeout(timeoutId); // Clear timeout on success

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
    // AI down fallback responses
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

    // Return a random response for variety
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

// Add this component for feedback functionality
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

// Component export at top level
export default function SkincareChatbot({ onClose }) {
  // Initialize AI provider
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

  // ✅ Custom debounce function (NOT a hook)
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ✨ Beautify response with pastel bullet bubbles
  const beautifyResponse = (text) => {
    if (!text) return text;

    // Split into lines
    const lines = text
      .replace(/[\x00-\x1F\x7F]+/g, " ")
      .split(/(?=\n|👉|🌿|✨)/g);

    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      // Bullet styling
      if (trimmed.startsWith("👉")) {
        return (
          <div
            key={i}
            style={{
              background: "#fef3c7",
              padding: "8px 12px",
              borderRadius: "8px",
              marginBottom: "6px",
            }}
          >
            {trimmed}
          </div>
        );
      }
      if (trimmed.startsWith("🌿")) {
        return (
          <div
            key={i}
            style={{
              background: "#d1fae5",
              padding: "8px 12px",
              borderRadius: "8px",
              marginBottom: "6px",
            }}
          >
            {trimmed}
          </div>
        );
      }
      if (trimmed.startsWith("✨")) {
        return (
          <div
            key={i}
            style={{
              background: "#e0e7ff",
              padding: "8px 12px",
              borderRadius: "8px",
              marginBottom: "6px",
            }}
          >
            {trimmed}
          </div>
        );
      }

      // Normal text
      return (
        <div key={i} style={{ marginBottom: "6px" }}>
          {trimmed}
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

  const handleNext = (value) => {
    // Validation
    if (step === 0 && !value.trim()) {
      alert("Please enter your name");
      return;
    }
    if (step === 1) {
      if (!/^\d+$/.test(value)) {
        alert("Please enter a valid number");
        return;
      }
      const num = parseInt(value, 10);
      if (num < 14) {
        alert("Sorry, we do not give advice for children under 14.");
        return;
      }
      if (num > 90) {
        alert("Please enter a valid age between 14 and 90");
        return;
      }
    }
    if (step === 4) {
      if (!formData.country) {
        alert("Please select a country");
        return;
      }
      if (formData.country === "Other" && !formData.otherCountry.trim()) {
        alert("Please enter your country name");
        return;
      }
    }
    if (step === 5 && formData.allergy === "Yes" && !formData.allergyDetails.trim()) {
      alert("Please provide details about your allergy");
      return;
    }

    setFormData((prev) => ({ ...prev, [keys[step]]: value }));

    if (step < keys.length - 1) {
      setStep(step + 1);
    } else {
      sendQuery(value);
    }
    setInputValue("");
  };

  // Updated sendQuery with proper state handling
  const sendQuery = async (currentUserInput) => {
    const userQuery = currentUserInput || formData.query;
    const messageId = Date.now();
    
    if (!userQuery.trim()) return;

    const prompt = `
You are Tanya, a Skin and Hair Care Specialist who combines medical expertise with traditional Ayurvedic wisdom. Provide practical skincare and haircare advice with lifestyle recommendations in a casual, approachable way.

STRICT RULES - ONLY ANSWER THESE TOPICS:
• Skincare concerns (acne, dark spots, wrinkles, dry/oily skin, etc.)
• Haircare problems (hair fall, dandruff, hair growth, etc.)
• Beauty routines and DIY remedies
• Natural/Ayurvedic treatments for skin and hair
• Skincare and haircare product recommendations

IF USER ASKS ABOUT NON-BEAUTY TOPICS (cooking, coding, math, weather, news, etc.), RESPOND WITH:
"Hi ${formData.name}! I'm your skincare and haircare specialist 🌸 Please ask me about skin concerns, hair problems, beauty routines, or DIY remedies. I'm here to help you glow naturally! 💖"

USER PROFILE:
• Name: ${formData.name}
• Age: ${formData.age} years old
• Gender: ${formData.gender}
• Skin Type: ${formData.skinType}
• Location: ${formData.country}

USER QUESTION: "${userQuery}"

COMMUNICATION STYLE:
• Use simple, modern Hindi-English mix (Hinglish) when natural
• Be warm, friendly, and supportive — like a caring doctor-friend
• Keep answers short (max 5–6 sentences)
• Use emojis sparingly to keep it fun 🌿✨
• Avoid long essays, focus on quick tips and steps
• Break replies into easy-to-scan bullet points when needed
• If user wants more details, offer to explain further
• IMPORTANT: Reply in the same language/style as the user's question (e.g., Hindi → Hindi, Hinglish → Hinglish, English → English)

DERMATOLOGICAL APPROACH (ONLY FOR BEAUTY QUESTIONS):
• Assess their skin/hair concern in a simple way
• Suggest 2–3 practical solutions (DIY + safe product options)
• Give **step-by-step routine** in short form
• Add **one lifestyle/diet tip** if relevant
• Warn about precautions and when to see a doctor

RESPONSE STRUCTURE (ONLY FOR BEAUTY QUESTIONS):
- Warm, professional greeting using their name
- Quick assessment of their concern
- 2–3 practical solutions (mix of DIY + gentle products)
- Short daily routine tip in 1–2 lines
- One lifestyle/diet tip in 1 line
- Important precaution in 1 line
- Encouraging, supportive closing

FORMATTING RULES:
+ Keep replies **short (max 5–6 sentences)**, avoid long sections or headings
+ Do NOT use "Tip 1/Tip 2" or bold section titles
+ Use simple bullets (👉, 🌿, ✨) instead of markdown formatting
+ Replies should feel like a quick chat, not a blog article
+ Always reply in the same language/style as the user's question

REMEMBER: You are ONLY a skincare and haircare specialist. Never discuss other topics.

Tone: Chatty, caring, authentic, focused on beauty only 💖
`;

    // Add user message with ID immediately
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
      setMessages((prev) => [...prev, { 
        id: messageId + 1,
        sender: "bot", 
        text: aiResponse,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error("AI error:", error);
      const fallbackResponse = aiProvider.getFallbackResponse(userQuery, formData);
      setMessages((prev) => [...prev, { 
        id: messageId + 1,
        sender: "bot", 
        text: fallbackResponse,
        timestamp: new Date().toISOString()
      }]);
    }

    setLoading(false);
  };

  // ✅ MOVE useCallback INSIDE the component
  const debouncedSendQuery = useCallback(
    debounce((input) => {
      sendQuery(input);
    }, 500),
    [] // Dependencies
  );

  // ✅ FIXED event handlers - now inside component with access to state
  const handleSendClick = () => {
    const currentInput = inputValue.trim();
    if (currentInput !== "") {
      if (step < keys.length - 1) {
        handleNext(currentInput);
      } else {
        debouncedSendQuery(currentInput); // Use the memoized version
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
          debouncedSendQuery(currentInput); // Use the memoized version
        }
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Messages with beautified responses */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1rem",
          background: "#fdf2f8",
          borderRadius: "8px",
          paddingBottom: "80px", // Space for input area
          WebkitOverflowScrolling: "touch" // Smooth scrolling on mobile
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
              whiteSpace: "pre-line", // Preserves line breaks
            }}
          >
            {msg.sender === "bot" ? beautifyResponse(msg.text) : msg.text}
            {msg.sender === 'bot' && (
              <MessageFeedback 
                messageId={`msg-${idx}-${Date.now()}`}
                onFeedback={(type) => console.log(`Message ${idx} feedback: ${type}`)}
              />
            )}
          </div>
        ))}

        {/* ALL STEPS INCLUDED */}
        {step === 0 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            Hi! 😊 I'm Tanya, your skincare assistant. What's your name?
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
            Nice to meet you, {formData.name}! How old are you?
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
            <p style={{ marginBottom: "1rem" }}>Got it! What's your gender?</p>
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
            <p style={{ marginBottom: "1rem" }}>What's your skin type?</p>
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
                  }}
                >
                  <input
                    type="radio"
                    name="skinType"
                    value={type}
                    onChange={() => handleNext(type)}
                  />
                  <span>{type}</span>
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
            <p style={{ marginBottom: "1rem" }}>Which country are you in? 🌏</p>
            <select
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
              value={formData.country}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
            >
              <option value="">-- Select your country --</option>
              <option value="India">🇮🇳 India</option>
              <option value="Pakistan">🇵🇰 Pakistan</option>
              <option value="Bangladesh">🇧🇩 Bangladesh</option>
              <option value="Nepal">🇳🇵 Nepal</option>
              <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
              <option value="Other">🌍 Other</option>
            </select>
            {formData.country === "Other" && (
              <input
                type="text"
                placeholder="Please enter your country"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  marginBottom: "1rem",
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
              }}
            >
              Next
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
            <p style={{ marginBottom: "1rem" }}>Do you have any allergies? 🤔</p>
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
                }}
              >
                No
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
                }}
              >
                Yes
              </button>
            </div>
            {formData.allergy === "Yes" && (
              <>
                <input
                  type="text"
                  placeholder="Please describe your allergy"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    marginBottom: "1rem",
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
                  }}
                >
                  Next
                </button>
              </>
            )}
          </div>
        )}

        {step === 6 && (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            Tell me about your skincare or haircare concern 💬
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

        <div ref={messagesEndRef} />
      </div>

      {/* RESPONSIVE ALIGNED INPUT - FIXED VERSION */}
      {step !== 2 &&
        step !== 3 &&
        step !== 4 &&
        step !== 5 &&
        !loading && (
          <div style={{
            position: "absolute",  // Changed from "fixed"
            bottom: "0",
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
            {/* Input Field */}
            <input
              type="text"
              placeholder="Ask me about skincare..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                flex: 1,  // Takes remaining space
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

            {/* Send Button */}
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
