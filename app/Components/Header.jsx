"use client";
import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();

  const toggle = () => setIsOpen(!isOpen);

  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <Navbar color="" fixed="top" light expand="md" className="front-header">
      <NavbarBrand href="/">
        <img src="/img/logo.png" alt="" height="70" />
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        {/* <Nav className="ms-auto" navbar>
          <NavItem>
            <NavLink href="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">Usecase</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">Overview</NavLink>
          </NavItem>
          <NavItem>
            <Link href="/admin" passHref>
              <NavLink>Dashboard</NavLink>
            </Link>
          </NavItem>
        </Nav>
        {isConnected && (
          <Button
            color="primary"
            size=""
            className="rounded-5 px-4 py-1 ms-3"
            onClick={handleDashboardRedirect}
          >
            Dashboard
          </Button>
        )} */}
        <Button color="light" size="" className="rounded-5 px-4 py-1 ms-auto">
          Buy Token
        </Button>
        <ConnectButton />
      </Collapse>
    </Navbar>
  );
};

export default Header;
