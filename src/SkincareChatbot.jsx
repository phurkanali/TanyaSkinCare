import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";

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
      const res = await fetch(
        process.env.REACT_APP_AI_API ||
          "https://tanya-ai-backend.onrender.com/api/ai-chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      return data.reply || "No response from AI";
    } catch (err) {
      console.error("AI error:", err);
      return "⚠️ AI service is down. Please try again later.";
    }
  }

  getFallbackResponse(message, userProfile) {
    // AI down fallback responses
    const aiDownResponses = [
      `Hi ${userProfile.name}! 🤖 My AI brain is taking a little break right now, but I'd love to help you! 

For immediate skincare advice, check out my latest videos on YouTube: https://youtube.com/@tanyafashionskincare

I cover everything from ${this.getRelevantTopic(
        message
      )} to complete skincare routines! 💖✨`,

      `Oops! ${userProfile.name} 😅 My AI assistant is currently offline, but don't worry! 

I have tons of helpful content on my YouTube channel that might answer your question: https://youtube.com/@tanyafashionskincare

Thanks for your patience, and I hope my videos help! 🌸💕`,

      `Sorry ${userProfile.name}! 🔧 My AI is under maintenance right now, but I haven't forgotten about you!

Visit my YouTube channel for detailed skincare guides and tips: https://youtube.com/@tanyafashionskincare

I'm constantly uploading new content to help with all your beauty concerns! 💄✨`,

      `Hi ${userProfile.name}! 🚧 The AI is temporarily down, but I've got you covered!

Head over to my YouTube channel where I share personalized skincare advice: https://youtube.com/@tanyafashionskincare

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

  // Updated sendQuery with AI integration
  const sendQuery = async () => {
    const userQuery = formData.query || inputValue;

    const prompt = `
You are Tanya, a Skin and Hair Care Specialist who combines medical expertise with traditional Ayurvedic wisdom. Provide practical skincare and haircare advice with lifestyle recommendations in a casual, approachable way.

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
+ • IMPORTANT: Reply in the same language/style as the user's question (e.g., Hindi → Hindi, Hinglish → Hinglish, English → English)

DERMATOLOGICAL APPROACH:
• Assess their skin/hair concern in a simple way
• Suggest 2–3 practical solutions (DIY + safe product options)
• Give **step-by-step routine** in short form
• Add **one lifestyle/diet tip** if relevant
• Warn about precautions and when to see a doctor

RESPONSE STRUCTURE:
- Warm, professional greeting using their name
- Quick assessment of their concern
- 2–3 practical solutions (mix of DIY + gentle products)
- Short daily routine tip in 1–2 lines
- One lifestyle/diet tip in 1 line
- Important precaution in 1 line
- Encouraging, supportive closing

+ Keep replies **short (max 5–6 sentences)**, avoid long sections or headings.
+ Do NOT use "Tip 1/Tip 2" or bold section titles. 
+ Use simple bullets (👉, 🌿, ✨) instead of markdown formatting.
+ Replies should feel like a quick chat, not a blog article.
+ Always reply in the same language/style as the user's question. 
+ If user writes in Hindi → reply in Hindi. 
+ If user writes in Hinglish → reply in Hinglish. 
+ If user writes in English → reply in English. 

Tone: Chatty, caring, authentic, and easy to follow 💖
`;

    setMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
    setLoading(true);

    try {
      const aiResponse = await aiProvider.getAIResponse(prompt);
      setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
    } catch (error) {
      console.error("AI error:", error);
      const fallbackResponse = aiProvider.getFallbackResponse(
        userQuery,
        formData
      );
      setMessages((prev) => [...prev, { sender: "bot", text: fallbackResponse }]);
    }

    setLoading(false);
  };

  const handleSendClick = () => {
    if (inputValue.trim() !== "") {
      handleNext(inputValue.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      handleNext(inputValue.trim());
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
      {/* Messages with beautified responses */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1rem",
          background: "#fdf2f8",
          borderRadius: "8px",
          marginBottom: "80px",
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

      {/* SIMPLE WORKING INPUT */}
      {step !== 2 &&
        step !== 3 &&
        step !== 4 &&
        step !== 5 &&
        !loading && (
          <>
            {/* Input Field */}
            <input
              type="text"
              placeholder="Type here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                position: "fixed",
                bottom: "15px",
                left: "15px",
                right: "80px",
                padding: "15px",
                border: "2px solid #ec4899",
                borderRadius: "25px",
                fontSize: "16px",
                outline: "none",
                zIndex: 99999,
                background: "white",
              }}
            />

            {/* Floating Send Button with Icon */}
            <button
              onClick={handleSendClick}
              disabled={!inputValue.trim()}
              style={{
                position: "fixed",
                bottom: "15px",
                right: "15px",
                width: "50px",
                height: "50px",
                background: inputValue.trim() ? "#ec4899" : "#ccc",
                border: "none",
                borderRadius: "50%",
                color: "white",
                cursor: inputValue.trim() ? "pointer" : "not-allowed",
                zIndex: 99999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                transition: "all 0.2s ease",
              }}
            >
              <FiSend />
            </button>
          </>
        )}
    </div>
  );
}
