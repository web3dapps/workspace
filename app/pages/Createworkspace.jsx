'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Header from "../Components/Header";
import axios from "axios";


export default function CreateWorkspace() {
  const [workspace, setWorkspace] = useState({
    name: "",
    description: "",
    creator: "",
    image: "",
  });
  const [workspaces, setWorkspaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchWorkspaces = async () => {
  try {
    const response = await fetch("/api/workspace");

    if (!response.ok) {
      throw new Error("Failed to fetch workspaces.");
    }

    const data = await response.json();
    setWorkspaces(data);
  } catch (error) {
    console.error("Error fetching workspaces:", error.message);
  }
};

useEffect(() => {
  fetchWorkspaces();
}, []);

  // useEffect(() => {
  //   const storedWorkspaces = localStorage.getItem("workspaces");
  //   if (storedWorkspaces) {
  //     setWorkspaces(JSON.parse(storedWorkspaces));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("workspaces", JSON.stringify(workspaces));
  // }, [workspaces]);

const handleChange = (e) => {
  const { id, value, files } = e.target;

  if (id === "file" && files && files[0]) {
    const file = files[0];
    const imageURL = URL.createObjectURL(file); 
    setWorkspace({
      ...workspace,
      imageFile: file,
      image: imageURL,
    });
  } else {
    setWorkspace({
      ...workspace,
      [id]: value,
    });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (workspace.name && workspace.description) {
    try {
      let imageUrl = workspace.image;

      if (workspace.imageFile) {
        const formData = new FormData();
        formData.append("file", workspace.imageFile, workspace.imageFile.name);

        const uploadResponse = await axios.post("/api/upload", {
          file: await toBase64(workspace.imageFile),
          fileName: workspace.imageFile.name,
        });

        if (uploadResponse.status === 200) {
          const { hash } = uploadResponse.data;
          imageUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
        }
      }

      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workspace.name,
          description: workspace.description,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workspace");
      }

      const data = await response.json();
      setWorkspaces((prev) => [...prev, { ...workspace, id: data.id }]);

      setWorkspace({ name: "", description: "", image: "" });
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating workspace:", error.message);
    }
  }
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  })


const handleDelete = async (id) => {
  try {
    const response = await fetch(`/api/workspace?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete workspace");
    }

    const updatedWorkspaces = workspaces.filter((ws) => ws.id !== id);
    setWorkspaces(updatedWorkspaces);

    alert("Workspace deleted successfully.");
  } catch (error) {
    console.error("Error deleting workspace:", error.message);
    alert("Failed to delete workspace: " + error.message);
  }
};


  return (
    <>
      <Header />
      <div
        className="py-5 bg-dark"
        style={{
          minHeight: "100vh",
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        <Container>
          <Row className="mb-4" style={{ marginTop: "5rem" }}>
            <Col md="12" className="text-center">
              <h3
              style={{
                color: "#FFF5E5",
              }}
              >Web3Space Management</h3>
              <p className="text-muted">
                Create and manage your workspaces effortlessly
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg="3" md="4" sm="6">
              <Card
                className="border-0 shadow-sm d-flex justify-content-center align-items-center"
                style={{
                  height: "315px",
                  backgroundColor: "#FFF5E5", 
                  cursor: "pointer",
                  borderRadius: "10px",
                  border: "2px dashed #f59532", 
                }}
                onClick={() => setModalOpen(true)}
              >
                <h1
                  className="text-muted"
                  style={{
                    color: "#f59532",
                  }}
                >
                  +
                </h1>
                <p className="text-muted">Create New</p>
              </Card>
            </Col>

        {workspaces.map((ws, index) => (
          <Col lg="3" md="4" sm="6" key={index}>
            <Card
              className="border-0 shadow-sm position-relative text-center"
              style={{
                borderRadius: "15px", 
                backgroundColor: "#FFF5E5", 
                color: "white",
                overflow: "hidden",
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-2"
                aria-label="Close"
                style={{
                  color: "#000",
                  filter: "invert(100%)",
                }}
                onClick={() => handleDelete(ws.id)}
              ></button>

              <CardBody className="d-flex flex-column align-items-center p-4">
                <h5
                  className="mb-3"
                  style={{
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  {ws.name}
                </h5>

                <img
                  src={ws.image || "/default-image.png"}
                  alt={ws.name}
                  width="120"
                  height="120"
                  className="rounded-circle shadow mb-4"
                  style={{
                    objectFit: "cover",
                    border: "3px solid #f59532",
                  }}
                />

                    <h5
              className="mb-3 workspace-description"
              style={{
                color: "#000",
                fontWeight: "bold",
              }}
              title={ws.description}  
            >
              {ws.description}
            </h5>


                {/* Manage Button */}
                <Link href="/admin" passHref>
                  <Button
                    style={{
                      backgroundColor: "#f59532",
                      borderColor: "#f59532",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.5rem 1.5rem",
                      borderRadius: "25px", 
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#e58528"; 
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#f59532";
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = "scale(0.95)"; 
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = "scale(1)"; 
                    }}
                    onClick={() => {
                      localStorage.setItem("workspace_id", ws.id);
                    }}
                  >
                    Manage
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        ))}

          </Row>
        </Container>
      </div>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
<ModalHeader
  style={{
    backgroundColor: "#f59532", // Orange color
    color: "white",
    borderBottom: "none",
    display: "flex", // Flexbox for alignment
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    position: "relative",
  }}
>
  {/* Centered Title */}
  <h5
    style={{
      margin: 0,
      fontWeight: "bold",
    }}
  >
    Create Workspace
  </h5>

  {/* Close Button */}
  <button
    type="button"
    className="btn-close"
    aria-label="Close"
    style={{
      position: "absolute",
      top: "12px",
      right: "16px",
      color: "white",
      filter: "invert(100%)",
    }}
    onClick={() => setModalOpen(false)}
  ></button>
</ModalHeader>


        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md="12">
                <label htmlFor="name" className="form-label">
                  Workspace Name
                </label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="name"
                  value={workspace.name}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md="12">
                <label htmlFor="description" className="form-label">
                  Workspace Description
                </label>
                <textarea
                  className="form-control shadow-sm"
                  id="description"
                  rows="3"
                  value={workspace.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </Col>
              <Col md="12">
                <label htmlFor="file" className="form-label">
                  Workspace Image
                </label>
                <input
                  type="file"
                  className="form-control shadow-sm"
                  id="file"
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </form>
        </ModalBody>
        <ModalFooter
          className="d-flex justify-content-center"
          style={{ borderTop: "none" }}
        >
          <Button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#f59532",
              borderColor: "#f59532",
              color: "white",
              padding: "10px 30px",
              fontWeight: "bold",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e58528";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f59532";
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
