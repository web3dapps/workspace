import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import { Button, Card, Col, Row } from "reactstrap";
import deductTokens from "@/utils/coinDeduction";

export default function TabPaneDocuments() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  
useEffect(() => {
  async function getDocuments() {
    try {
      const workspaceId = localStorage.getItem("workspace_id");
      if (!workspaceId) {
        alert("Workspace ID is not found in localStorage. Please select a workspace.");
        return;
      }

      const response = await axios.get(`/api/pdf?workspace_id=${workspaceId}`);
      if (response.status === 200) {
        const fetchedDocuments = response.data.map((doc) => ({
          id: doc.id,
          workspaceId: doc.workspace_id,
          fileName: doc.fileName,
          file_url: doc.file_url,
          uploadedAt: doc.uploaded_at,
        }));
        setDocuments(fetchedDocuments);
      }
    } catch (error) {
      console.error("Error fetching documents:", error.message);
      alert("Failed to load documents. Please try again later.");
    }
  }

  getDocuments();
}, []);



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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
  if (!file) {
    alert("Please select a file first!");
    return;
  }

  if (!web3) {
    alert("Web3 is not initialized. Please ensure MetaMask is connected.");
    return;
  }

  try {
    // const tokenAmount = 0.1 * 10 ** 9; 
    // const txHash = await deductTokens(web3, userAddress, tokenAmount);

    // alert(`Tokens deducted successfully (TX: ${txHash}). Proceeding with file upload...`);

     const reader = new FileReader();
    reader.onload = async (e) => {
      const base64File = e.target.result.split(",")[1];

      const uploadResponse = await axios.post("/api/upload", {
        file: base64File,
        fileName: file.name,
      });

      if (uploadResponse.status === 200) {
        alert("File uploaded successfully!");
        const { hash } = uploadResponse.data;

        try {
          const workspaceId = localStorage.getItem("workspace_id");
          if (!workspaceId) {
            alert("Workspace ID is missing. Cannot save file details to the database.");
            return;
          }

          const dbResponse = await axios.post("/api/pdf", {
            workspace_id: workspaceId,
            fileName: file.name, 
            file_url: `https://gateway.pinata.cloud/ipfs/${hash}`,
          });

          if (dbResponse.status === 201) {
            alert("File details saved to the database successfully!");

            setDocuments((prev) => [
              ...prev,
              {
                id: dbResponse.data.id,
                fileName: file.name,
                file_url: `https://gateway.pinata.cloud/ipfs/${hash}`,
                uploadedAt: dbResponse.data.uploaded_at, 
              },
            ]);
          }
        } catch (dbError) {
          console.error("Error saving file details to the database:", dbError);
          alert(
            "File upload succeeded, but an error occurred while saving details to the database."
          );
        }
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("Error during the process:", error);
    alert("An error occurred: " + error.message);
  }
};


  return (
    <div>
      <h1 className="admin-main-title">Documents</h1>
      <Row>
        <Col md="12">
          <Card body className="border-0 mb-4">
            <Row className="align-items-center">
              <Col sm="9">
                <input
                  id="file"
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </Col>
              <Col sm="3">
                <Button
                  color="primary"
                  className="rounded-3 w-100 px-2 py-1 h-100"
                  onClick={uploadFile}
                >
                  Upload File
                </Button>
              </Col>
            </Row>
          </Card>

          <Card body className="border-0 mb-4">
            <h5 className="mb-4">All Documents</h5>
            <div className="all-documentboxes p-3">
              {documents.map((doc, index) => (
                <div key={index} className="documentboxes text-center">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src="/img/home14-imagebox1.png"
                      alt={doc.fileName}
                      className="mb-4"
                    />
                  </a>
                  <p className="mb-0">{doc.fileName}</p>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
