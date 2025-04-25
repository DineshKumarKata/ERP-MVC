import React from "react";
import Link from "next/link";
import Head from "next/head";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function Custom404() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/vignan";

  return (
    <Container className="py-5 text-center">
      <Head>
        <title>Page Not Found | VIGNAN</title>
        <meta name="description" content="Page not found - Vignan University" />
      </Head>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="error-container p-4">
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead mb-4">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <div className="mb-4">
              <Link href="/StudentLoginPage">
                <Button variant="primary" size="lg" className="me-3">
                  Go to Login Page
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline-secondary" size="lg">
                  Return Home
                </Button>
              </Link>
            </div>
            <p className="text-muted mt-4">
              If you believe this is an error, please contact the system
              administrator.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
