'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
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
      }); // Clear form
    }
  };

  const handleDelete = (index) => {
    const updatedWorkspaces = workspaces.filter((_, i) => i !== index);
    setWorkspaces(updatedWorkspaces);
  };

  return (
    <>
      <Header />
      <div className="py-5 bg-dark"
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "100vh",
    paddingTop: "5rem",
    paddingBottom: "5rem",
    boxSizing: "border-box",
    backgroundColor: "#343a40", // Equivalent to bg-dark
  }}
      
      >
        <Container className="pt-5 mt-5">
          <Row>
            <Col md="12" className="mb-5">
              <form onSubmit={handleSubmit}>
                <Card className="border-0">
                  <CardHeader className="bg-warning border-0">
                    <h4 className="text-white mb-0 py-2">Create Workspace</h4>
                  </CardHeader>
                  <CardBody>
                    <Row className="g-3">
                      <Col md="6">
                        <label className="mb-1" htmlFor="name">
                          Workspace Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Workspace Name"
                          id="name"
                          value={workspace.name}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md="6">
                        <label className="mb-1" htmlFor="description">
                          Workspace Description
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Workspace Description"
                          id="description"
                          value={workspace.description}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md="6">
                        <label className="mb-1" htmlFor="creator">
                          Creator
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Creator"
                          id="creator"
                          value={workspace.creator}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md="6">
                        <label className="mb-1" htmlFor="file">
                          Workspace Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="file"
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md="12">
                        <input
                          type="submit"
                          className="btn btn-dark"
                          value="Submit"
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </form>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <h4 className="text-white">Workspace List</h4>
            </Col>
            {workspaces.map((ws, index) => (
              <Col lg="3" md="4" key={index}>
                <Card className="border-0 position-relative">
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-2"
                    aria-label="Close"
                    onClick={() => handleDelete(index)}
                  ></button>
                  <CardBody className="text-center">
                    <h5 className="mb-3">{ws.name}</h5>
                    {ws.image ? (
                      <img
                        src={ws.image}
                        alt={ws.name}
                        width="120"
                        height="120"
                        className="rounded-circle mb-4 d-block text-center m-auto"
                      />
                    ) : (
                      <img
                        src="/default-image.png" 
                        alt="default"
                        width="120"
                        height="120"
                        className="rounded-circle mb-4 d-block text-center m-auto"
                      />
                    )}
                    <Link href="/admin" passHref className="btn btn-dark w-100">
                      Manage
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
}
