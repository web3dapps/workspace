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

export default function CreateWorkspace() {
  const [workspace, setWorkspace] = useState({
    name: "",
    description: "",
    creator: "",
    image: "",
  });
  const [workspaces, setWorkspaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedWorkspaces = localStorage.getItem("workspaces");
    if (storedWorkspaces) {
      setWorkspaces(JSON.parse(storedWorkspaces));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workspaces", JSON.stringify(workspaces));
  }, [workspaces]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === "file" && files && files[0]) {
      const file = files[0];
      const imageURL = URL.createObjectURL(file);
      setWorkspace({
        ...workspace,
        image: imageURL,
      });
    } else {
      setWorkspace({
        ...workspace,
        [id]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workspace.name && workspace.description) {
      setWorkspaces([...workspaces, workspace]);
      setWorkspace({
        name: "",
        description: "",
        image: "",
      });
      setModalOpen(false);
    }
  };

  const handleDelete = (index) => {
    const updatedWorkspaces = workspaces.filter((_, i) => i !== index);
    setWorkspaces(updatedWorkspaces);
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
                  height: "250px",
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
        borderRadius: "15px", // Rounded corners for the card
        backgroundColor: "#FFF5E5", // Light orange background
        color: "white", // White text for contrast
        overflow: "hidden",
      }}
    >
      {/* Close Button */}
      <button
        type="button"
        className="btn-close position-absolute top-0 end-0 m-2"
        aria-label="Close"
        style={{
          color: "white", // White color for the close button
          filter: "invert(100%)", // Ensure it stands out against the dark background
        }}
        onClick={() => handleDelete(index)}
      ></button>

      <CardBody className="d-flex flex-column align-items-center p-4">
        {/* Workspace Name */}
        <h5
          className="mb-3"
          style={{
            color: "#000",
            fontWeight: "bold",
          }}
        >
          {ws.name}
        </h5>

        {/* Profile Image */}
        <img
          src={ws.image || "/default-image.png"}
          alt={ws.name}
          width="120"
          height="120"
          className="rounded-circle shadow mb-4"
          style={{
            objectFit: "cover", // Ensure image scales properly
            border: "3px solid #f59532", // Add orange border around the image
          }}
        />

        <h5
          className="mb-3"
          style={{
                    color: "#000",
            fontWeight: "bold",
          }}
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
              borderRadius: "25px", // Rounded button
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e58528"; // Darker orange on hover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f59532"; // Original orange
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.95)"; // Slight shrink on click
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1)"; // Revert to normal size
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
