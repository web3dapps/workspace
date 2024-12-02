import React, { useState, useEffect } from "react";
import Web3 from "web3";
import deductTokens from "@/utils/coinDeduction";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState(null);


    useEffect(() => {
    async function initializeWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setUserAddress(accounts[0]);
          setWeb3(web3Instance);
        } catch (error) {
          console.error("User denied account access:", error);
        }
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        const accounts = await web3Instance.eth.getAccounts();
        setUserAddress(accounts[0]);
        setWeb3(web3Instance);
      } else {
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        console.warn("No MetaMask detected. Using local web3 provider.");
      }
    }

    initializeWeb3();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    const tokenAmount = 1 * 10 ** 9; 
    const txHash = await deductTokens(web3, userAddress, tokenAmount);

    alert(`Tokens deducted successfully (TX: ${txHash}). Proceeding with response...`);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const botMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const userMessage = { role: "user", content: "Uploaded a PDF for summarization." };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const botMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = {
          role: "assistant",
          content: "Sorry, something went wrong while processing the PDF.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <ul className="list-unstyled chat-details">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`d-flex justify-content-${
              msg.role === "user" ? "end" : "start"
            } mb-4`}
          >
            {msg.role === "assistant" && (
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                alt="avatar"
                className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                width="40"
              />
            )}
            <div className="card">
              <div className="card-body">
                <p className="mb-0">{msg.content}</p>
              </div>
            </div>
            {msg.role === "user" && (
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
                alt="avatar"
                className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                width="40"
              />
            )}
          </li>
        ))}

        {loading && (
          <li className="d-flex justify-content-start mb-4">
            <div className="card">
              <div className="card-body">
                <p className="mb-0">
                  <span className="typing-bubble"></span>
                  <span className="typing-bubble"></span>
                  <span className="typing-bubble"></span>
                </p>
              </div>
            </div>
          </li>
        )}

        <li className="mb-3">
          <div className="form-outline position-relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="form-control bg-primary-light rounded-5"
              placeholder="Type a message..."
            />
            <div className="right-12 float-end position-absolute d-flex align-items-center">
              {/* Microphone button */}
              <button type="button" className="btn p-0 px-1">
                <i className="bi bi-mic"></i>
              </button>

              {/* File upload */}
              <label className="btn p-0 px-1">
                <i className="bi bi-paperclip"></i>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </label>

              {/* Send button */}
              <button
                type="button"
                onClick={handleSend}
                className="btn p-0 px-1"
              >
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </li>
      </ul>

      <style jsx>{`
        .typing-bubble {
          width: 12px;
          height: 12px;
          margin-right: 6px;
          border-radius: 50%;
          background-color: #bbb;
          display: inline-block;
          animation: typing 1.5s infinite ease-in-out;
        }

        .typing-bubble:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-bubble:nth-child(2) {
          animation-delay: 0.3s;
        }

        .typing-bubble:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes typing {
          0% {
            opacity: 0.1;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0.1;
            transform: scale(0.7);
          }
        }
      `}</style>
    </div>
  );
}
