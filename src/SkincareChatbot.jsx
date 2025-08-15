import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";

export default function SkincareChatbot({ onClose }) {
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
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const keys = ["name", "age", "gender", "skinType", "country", "allergy", "query"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, step]);

  // Android keyboard detection (multiple methods for compatibility)
  useEffect(() => {
    const initialHeight = window.innerHeight;
    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentHeight = window.innerHeight;
        const heightDiff = initialHeight - currentHeight;
        
        // Keyboard is considered open if viewport shrunk by more than 150px
        const isKeyboardOpen = heightDiff > 150;
        setKeyboardOpen(isKeyboardOpen);
        setViewportHeight(currentHeight);

        // Force scroll to input when keyboard opens
        if (isKeyboardOpen && inputRef.current) {
          setTimeout(() => {
            inputRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 100);
        }
      }, 100);
    };

    // Visual Viewport API for modern browsers
    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const heightDiff = window.screen.height - window.visualViewport.height;
        const isKeyboardOpen = heightDiff > 200;
        setKeyboardOpen(isKeyboardOpen);
        setViewportHeight(window.visualViewport.height);
      }
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    // Input focus handler
    const handleInputFocus = () => {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleInputFocus);
    }

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleInputFocus);
      }
    };
  }, []);

  const handleNext = (value) => {
    // Your existing validation code
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

  const sendQuery = (value) => {
    const newMsg = { sender: "user", text: value };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Here's your personalized skincare remedy based on your inputs. 🌸" },
      ]);
    }, 2000);
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

  // Calculate dynamic heights
  const containerHeight = keyboardOpen ? 
    `${Math.min(viewportHeight - 20, 400)}px` : 
    '70vh';
  
  const messagesHeight = keyboardOpen ? 
    `${Math.min(viewportHeight - 120, 300)}px` : 
    'calc(70vh - 80px)';

  return (
    <div 
      ref={containerRef}
      style={{
        height: containerHeight,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Chat Messages */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: messagesHeight,
          padding: '0.75rem',
          backgroundColor: '#fdf2f8',
          borderRadius: '0.375rem',
          marginBottom: '0.5rem'
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '0.75rem',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              maxWidth: '85%',
              fontSize: '0.875rem',
              ...(msg.sender === "user" ? {
                backgroundColor: '#ec4899',
                color: 'white',
                marginLeft: 'auto',
                textAlign: 'right'
              } : {
                backgroundColor: '#e5e7eb',
                color: '#374151'
              })
            }}
          >
            {msg.text}
          </div>
        ))}

        {/* Step-based questions */}
        <div style={{ paddingBottom: '1rem' }}>
          {step === 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem'
            }}>
              Hi! 😊 I'm Tanya, your skincare assistant. What's your name?
            </div>
          )}
          {step === 1 && (
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem'
            }}>
              Nice to meet you, {formData.name}! How old are you?
            </div>
          )}
          {step === 2 && (
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem'
            }}>
              <p style={{ marginBottom: '0.75rem' }}>Got it! What's your gender?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => handleNext("Female")}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#ec4899',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Female
                </button>
                <button
                  onClick={() => handleNext("Male")}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Male
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem'
            }}>
              <p style={{ marginBottom: '0.75rem' }}>What's your skin type?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {["Normal", "Dry", "Oily", "Combination", "Sensitive"].map((type) => (
                  <label key={type} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    borderRadius: '0.25rem'
                  }}>
                    <input
                      type="radio"
                      name="skinType"
                      value={type}
                      onChange={() => handleNext(type)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem'
            }}>
              <p style={{ marginBottom: '0.75rem' }}>Which country are you in? 🌏</p>
              <select
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem'
                }}
                value={formData.country}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({ ...prev, country: val }));
                }}
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
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem'
                  }}
                  value={formData.otherCountry}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, otherCountry: e.target.value }))
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
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#ec4899',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
          {step === 5 && (
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem'
            }}>
              <p style={{ marginBottom: '0.75rem' }}>Do you have any allergies? 🤔</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, allergy: "No" })) || handleNext("No")}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, allergy: "Yes" }))}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
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
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}
                    value={formData.allergyDetails}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, allergyDetails: e.target.value }))
                    }
                  />
                  <button
                    onClick={() => handleNext(formData.allergyDetails)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#ec4899',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Next
                  </button>
                </>
              )}
            </div>
          )}
          {step === 6 && (
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem'
            }}>
              Tell me about your skincare or haircare concern 💬
            </div>
          )}
          {loading && (
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              Thank you! I'm preparing your skincare remedy advice...
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input + Send button - Android optimized with fixed positioning */}
      {step !== 2 && step !== 3 && step !== 4 && step !== 5 && !loading && (
        <div 
          ref={inputRef}
          style={{
            position: keyboardOpen ? 'fixed' : 'sticky',
            bottom: keyboardOpen ? '10px' : '0px',
            left: keyboardOpen ? '1rem' : '0px',
            right: keyboardOpen ? '1rem' : '0px',
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            borderRadius: keyboardOpen ? '0.5rem' : '0'
          }}
        >
          <input
            type="text"
            placeholder="Type here..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '16px', // Prevent iOS zoom
              outline: 'none'
            }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSendClick}
            disabled={!inputValue.trim()}
            style={{
              padding: '0.75rem',
              backgroundColor: inputValue.trim() ? '#ec4899' : '#d1d5db',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '50px',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            <FiSend size={18} />
          </button>
        </div>
      )}
    </div>
  );
}


