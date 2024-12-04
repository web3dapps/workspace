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
    if (workspace.name && workspace.description && workspace.creator) {
      setWorkspaces([...workspaces, workspace]);
      setWorkspace({
        name: "",
        description: "",
        creator: "",
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
              <h3 className="text-white">Web3Space Management</h3>
              <p className="text-muted">Create and manage your workspaces effortlessly</p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg="3" md="4" sm="6">
              <Card
                className="border-0 shadow-sm d-flex justify-content-center align-items-center"
                style={{
                  height: "250px",
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                  borderRadius: "10px",
                }}
                onClick={() => setModalOpen(true)}
              >
                <h1 className="text-muted">+</h1>
                <p className="text-muted">Create New</p>
              </Card>
            </Col>

            {workspaces.map((ws, index) => (
              <Col lg="3" md="4" sm="6" key={index}>
                <Card
                  className="border-0 shadow-sm position-relative"
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-2"
                    aria-label="Close"
                    onClick={() => handleDelete(index)}
                  ></button>
                  <CardBody className="text-center p-4">
                    <img
                      src={ws.image || "/default-image.png"}
                      alt={ws.name}
                      width="120"
                      height="120"
                      className="rounded-circle mb-3 shadow-sm"
                    />
                    <h5 className="mb-2">{ws.name}</h5>
                    <Link href="/admin" passHref>
                      <Button color="dark" className="w-100">
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

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)} className="bg-primary text-white">
          Create Workspace
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
                <label htmlFor="creator" className="form-label">
                  Creator
                </label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="creator"
                  value={workspace.creator}
                  onChange={handleChange}
                  required
                />
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
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
