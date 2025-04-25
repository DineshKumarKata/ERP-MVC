import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  CallingAxios,
  KeepLoggedIn,
  ShowMessagePopup,
  LoggedOut,
} from "../GenericFunctions";
import { useRouter } from "next/router";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Head from "next/head";
import { GetInternationalStudentDetails } from "../axios";

const LandingPage = () => {
  const router = useRouter();
  const loginDetails = useAppSelector((state: any) => state.login.loginDetails);
  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasInternationalData, setHasInternationalData] =
    useState<boolean>(false);

  // Run once on component mount to check authentication
  useEffect(() => {
    const checkAuth = () => {
      if (KeepLoggedIn()) {
        setIsAuthenticated(true);
        // Check if international student data exists
        const internationalData = localStorage.getItem(
          "internationalStudentData"
        );
        setHasInternationalData(!!internationalData);
      } else {
        ShowMessagePopup(false, "Invalid Access", "/");
      }
    };

    checkAuth();
  }, []);

  // Update username when loginDetails changes and user is authenticated
  useEffect(() => {
    if (isAuthenticated && loginDetails && loginDetails.loginName) {
      setUserName(loginDetails.loginName);

      // Check international student registration by email
      if (loginDetails.loginEmail) {
        checkInternationalStudentByEmail(loginDetails.loginEmail);
      }
    }
  }, [loginDetails?.loginName, loginDetails?.loginEmail, isAuthenticated]);

  // Function to check if the user is registered as an international student using email
  const checkInternationalStudentByEmail = async (email: string) => {
    if (!email) return;

    try {
      const result = await CallingAxios(
        GetInternationalStudentDetails({ email })
      );

      if (result.status === "Success" && result.data) {
        // Save student data in localStorage
        localStorage.setItem(
          "internationalStudentData",
          JSON.stringify(result.data)
        );
        setHasInternationalData(true);
      }
    } catch (error) {
      console.error("Error checking international student status:", error);
      // No need to show error message
    }
  };

  const handleLogout = () => {
    LoggedOut();
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="landing-page">
      <Head>
        <title>Welcome | VIGNAN</title>
        <meta name="description" content="Vignan University student portal" />
      </Head>

      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-center align-items-center">
              <h1>Welcome, {userName}</h1>
            </div>
            <hr />
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12}>
            <div className="welcome-banner p-4 bg-light rounded">
              <h2 className="text-center mb-3">Student Portal</h2>
              <p className="text-center">
                Access your academic information, resources, and services to
                enhance your learning experience at Vignan University.
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={6} md={6} className="mb-4">
            <Card className="h-100 border-primary">
              <Card.Body>
                <Card.Title>
                  <span className="text-primary">
                    International Student Registration
                  </span>
                </Card.Title>
                <Card.Text>
                  Special registration for international students with
                  additional requirements and support.
                </Card.Text>
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    navigateTo("/InternationalStudentRegistration")
                  }
                >
                  Register as International Student
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} md={6} className="mb-4">
            <Card className="h-100 border-primary">
              <Card.Body>
                <Card.Title>
                  <span className="text-primary">
                    International Student Details
                  </span>
                </Card.Title>
                <Card.Text>
                  View your submitted international student information and
                  registration status.
                </Card.Text>
                {hasInternationalData ? (
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/InternationalStudentDetails")}
                  >
                    View Details
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      ShowMessagePopup(
                        false,
                        "Please register as an international student first.",
                        ""
                      )
                    }
                  >
                    View Details
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={12} md={12} className="mb-4">
            <Card className="h-100 border-success">
              <Card.Body>
                <Card.Title>
                  <span className="text-success">Certificates & Documents</span>
                </Card.Title>
                <Card.Text>
                  Upload and manage your photo, signature, and academic
                  certificates. View, update, or download your uploaded
                  documents.
                </Card.Text>
                <Button
                  variant="success"
                  onClick={() => navigateTo("/Certificates")}
                >
                  Manage Certificates
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

                <Row className="mt-3">
          <Col lg={12} md={12} className="mb-4">
            <Card className="h-100 border-success">
              <Card.Body>
                <Card.Title>
                  <span className="text-success">Certificates & Documents</span>
                </Card.Title>
                <Card.Text>
                  Upload and manage your photo, signature, and academic
                  certificates. View, update, or download your uploaded
                  documents.
                </Card.Text>
                <Button
                  variant="success"
                  onClick={() => navigateTo("/Certificates")}
                >
                  Manage Certificates
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={12} md={12} className="mb-4">
            <Card className="h-100 border-info">
              <Card.Body>
                <Card.Title>
                  <span className="text-info">Create Test</span>
                </Card.Title>
                <Card.Text>
                  Create and manage tests by selecting subjects and question banks. Set up test parameters including difficulty levels and monitor student performance.
                </Card.Text>
                <Button
                  variant="info"
                  onClick={() => navigateTo("/SubjectSelector")}
                >
                  Create a Test
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default LandingPage;
