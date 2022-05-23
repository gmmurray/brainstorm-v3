import { Container, Nav, Navbar } from 'react-bootstrap';

import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

const Layout: FunctionComponentWithProps = ({ children }) => {
  const { pathname } = useRouter();
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Link href="/home" passHref>
            <Navbar.Brand>bootstrap v3</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="layout-nav" />
          <Navbar.Collapse id="layout-nav">
            <Nav className="me-auto">
              <Link href="/ideas" passHref>
                <Nav.Link active={pathname === '/ideas'}>ideas</Nav.Link>
              </Link>
              <Link href="/templates" passHref>
                <Nav.Link active={pathname === '/templates'}>
                  templates
                </Nav.Link>
              </Link>
              <Link href="/api/auth/logout" passHref>
                <Nav.Link>logout</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>{children}</Container>
    </>
  );
};

export default Layout;
