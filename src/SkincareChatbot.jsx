import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function SkincareChatbot() {
  const [step, setStep] = useState(0);
  const [chatEnded, setChatEnded] = useState(false); // for age restriction
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    country: "",
    allergy: "",
    query: "",
  });
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const keys = ["name", "age", "gender", "country", "allergy", "query"];

  const handleNext = (value) => {
    if (!value.trim()) return;

    // Age validation
    if (step === 1) {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 14) {
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: value },
          { sender: "bot", text: "❌ We are not giving advice for children." }
        ]);
        setChatEnded(true); // Stop further input
        return;
      }
      if (num > 90) {
        alert("Please enter a valid age between 14 and 90.");
        return;
      }
    }

    // Save response
    setFormData((prev) => ({ ...prev, [keys[step]]: value }));

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: value }]);

    // Go to next step or free chat
    if (step < keys.length - 1) {
      setStep(step + 1);
    } else {
      setStep(keys.length); // Free chat mode
      sendQuery(value);
    }

    setInputValue("");
  };

  const sendQuery = (value) => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Thank you! I’m preparing your skincare remedy advice..." }
    ]);

    // Simulate API
    setTimeout(() => {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Here’s your personalized skincare remedy based on your inputs. 🌸" }
      ]);
    }, 1500);
  };

  const handleSendClick = () => {
    if (inputValue.trim() !== "") {
      if (step >= keys.length) {
        // Already in free chat
        setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
        sendQuery(inputValue);
        setInputValue("");
      } else {
        handleNext(inputValue.trim());
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      handleSendClick();
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 bg-pink-50 rounded-md mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-pink-500 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Step-based questions */}
        {!chatEnded && step === 0 && <p>Hi! 😊 I’m Tanya, your skincare assistant. What’s your name?</p>}
        {!chatEnded && step === 1 && <p>Nice to meet you, {formData.name}! How old are you?</p>}
        {!chatEnded && step === 2 && (
          <div>
            <p>Got it! What’s your gender?</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleNext("Female")}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Female
              </button>
              <button
                onClick={() => handleNext("Male")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Male
              </button>
            </div>
          </div>
        )}
        {!chatEnded && step === 3 && <p>Which country are you in? 🌏</p>}
        {!chatEnded && step === 4 && <p>Do you have any allergies? 🌿</p>}
        {!chatEnded && step === 5 && <p>Tell me about your skincare or haircare concern 💬</p>}

        {loading && <p className="text-gray-500 italic mt-2">⏳ Processing...</p>}
      </div>

      {/* Input always visible except gender step and if chat ended */}
      {!chatEnded && step !== 2 && (
        <div className="flex p-2 border-t bg-white">
          <input
            type="text"
            placeholder="Type here..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <button
            onClick={handleSendClick}
            disabled={loading}
            className="ml-2 px-4 py-2 flex items-center gap-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            <span>Send</span>
            <FiSend className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
