import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import deductTokens from "@/utils/coinDeduction";
import { toast } from "react-toastify";
import { Modal, Spinner } from "react-bootstrap";
import { BsCheckCircle } from "react-icons/bs";
import { useCrm } from "../context/CrmContext";
import axios from "axios";


export default function Chat({onRegister}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  // const { crmName, setCrmName } = useCrm();

  const chatEndRef = useRef(null);
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

  useEffect(() => {
    async function fetchChatHistory() {
      const workspaceId = localStorage.getItem("workspace_id");
      if (!workspaceId) return;

      try {
        const response = await fetch("/api/chat", {
          method: "GET",
          headers: {
            workspace_id: workspaceId,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.chats || []);
        } else {
          console.error("Failed to fetch chat history");
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    }
    initializeWeb3();
    fetchChatHistory();
  }, []);

    useEffect(() => {
    scrollToBottom();
  }, [messages]);

const handleFileUpload = async (documentUrl) => {
  try {
    const response = await fetch(documentUrl);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64File = e.target.result.split(",")[1]; // Extract base64 content

      
    setPaymentLoading(true);
    setModalVisible(true);
    setPaymentSuccess(false);

    const tokenAmount = 0.001 * 10 ** 9;

    const txHash = await deductTokens(web3, userAddress, tokenAmount);

    toast.success(`Tokens deducted successfully. TX: ${txHash}`);
    setPaymentLoading(false);
    setPaymentSuccess(true);
    setTimeout(() => setModalVisible(false), 1000);

      const uploadResponse = await axios.post("/api/upload", {
        file: base64File,
        fileName: "generated-document.doc",
      });

      if (uploadResponse.status === 200) {
        const { hash } = uploadResponse.data;

        try {
          const workspaceId = localStorage.getItem("workspace_id");
          if (!workspaceId) {
            alert("Workspace ID is missing. Cannot save file details to the database.");
            return;
          }

          // Save the file URL and metadata to your database
          const dbResponse = await axios.post("/api/pdf", {
            workspace_id: workspaceId,
            fileName: "generated-document.doc",
            file_url: `https://gateway.pinata.cloud/ipfs/${hash}`,
          });

          if (dbResponse.status === 201) {
            alert("File successfully saved to Web3 Storage and database!");
          }
        } catch (dbError) {
          console.error("Error saving file to database:", dbError);
          alert("File upload succeeded, but an error occurred while saving details to the database.");
        }
      }
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Error during file upload:", error);
    alert("An error occurred during file upload: " + error.message);
  }
};


const handleDownload = async (documentUrl) => {
  try {
    setPaymentLoading(true);
    setModalVisible(true);
    setPaymentSuccess(false);

    const tokenAmount = 0.001 * 10 ** 9;

    const txHash = await deductTokens(web3, userAddress, tokenAmount);

    toast.success(`Tokens deducted successfully. TX: ${txHash}`);
    setPaymentLoading(false);
    setPaymentSuccess(true);
    setTimeout(() => setModalVisible(false), 1000);


    const response = await fetch(documentUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.downloaddownload = "generated-document.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  } catch (error) {
    console.error("Error during download:", error);
    toast.error("An error occurred during the download process: " + error.message);
  } finally {
    setModalVisible(false);
  }
};

 

const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const handleSend = async (crmName) => {
  let web3Instance;
  let userAddress;

  if (window.ethereum) {
    web3Instance = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3Instance.eth.getAccounts();
      setUserAddress(accounts[0]);
      userAddress = accounts[0];
      setWeb3(web3Instance);
    } catch (error) {
      console.error("User denied account access:", error);
    }
  } else if (window.web3) {
    web3Instance = new Web3(window.web3.currentProvider);
    const accounts = await web3Instance.eth.getAccounts();
    setUserAddress(accounts[0]);
    userAddress = accounts[0];
    setWeb3(web3Instance);
  } else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    web3Instance = new Web3(provider);
    setWeb3(web3Instance);
    console.warn("No MetaMask detected. Using local web3 provider.");
  }

  if (!crmName && !input.trim()) return;

  const userMessage = { role: "user", content: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  // Show modal for payment processing
  setModalVisible(true);
  setLoading(true);
  setPaymentSuccess(false);
  setPaymentLoading(true);

  try {
    const tokenAmount = 0.001 * 10 ** 9;
    const txHash = await deductTokens(web3Instance, userAddress, tokenAmount);

    toast.success(`Tokens deducted successfully. TX: ${txHash}`);
    setPaymentLoading(false);
    setPaymentSuccess(true);
    setTimeout(() => setModalVisible(false), 1000);

    if (crmName) {
      const botMessage = { role: "assistant", content: `${crmName} connected successfully.` };
      setMessages((prev) => [...prev, botMessage]);
    } else {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          workspace_id: localStorage.getItem("workspace_id"),
        },
        body: JSON.stringify({ message: input }),
      });

      if (response.headers.get("Content-Type").includes("application/msword")) {
        // Handle document response
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const botMessage = {
          role: "assistant",
          content: "Your document has been generated. Click below to download:",
          documentUrl: url, // Add the document URL to the message
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const data = await response.json();

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
      }
    }
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (onRegister) {
      onRegister(()=>handleSend);
    }
  }, [onRegister]);

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
                 {msg.documentUrl && (
                    <div className="d-flex mt-2">
                      {/* Download Button */}
                      <button
                        className="btn btn-primary ms-3"
                        onClick={() => handleDownload(msg.documentUrl)}
                      >
                        Download Document
                      </button>

                      {/* Save to Web3 Storage Button */}
                      <button
                        className="btn btn-primary ms-3"
                        onClick={() => handleFileUpload(msg.documentUrl)}
                      >
                        Save to Web3 Storage
                      </button>
                    </div>
)}


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

        <div ref={chatEndRef}></div>
        
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
              <button type="button" className="btn p-0 px-1">
                <i className="bi bi-mic"></i>
              </button>

              <label className="btn p-0 px-1">
                <i className="bi bi-paperclip"></i>
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                />
              </label>

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



      {/* Modal */}
      <Modal show={modalVisible} centered>
        <Modal.Body className="text-center">
          {paymentLoading ? (
            <>
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Processing payment... Please wait.</p>
            </>
          ) : paymentSuccess ? (
            <>
              <BsCheckCircle className="text-success mb-3" size={50} />
              <p className="text-success">Payment Successful!</p>
            </>
          ) : (
            <p>Something went wrong.</p>
          )}
        </Modal.Body>
      </Modal>

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
