import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import Head from "next/head";
import { ShowMessagePopup, CallingAxios } from "../GenericFunctions";
import { GetInternationalStudentDetails } from "../axios";
import { useAppSelector } from "../redux/hooks";

interface StudentDetails {
  studentName: string;
  studentPhone: string;
  email: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  currentCountry: string;
  religion: string;
  studentHeight: string;
  address: string;
  permanentCountry: string;
  passportNumber: string;
  visaNumber: string;
  studentMoles: string;
  bloodGroup: string;
  visaIssuedCountry: string;
  visaIssuedPlace: string;
  applicationId?: string;
  registrationDate?: string;
  status?: string;
}

export default function InternationalStudentDetails() {
  const router = useRouter();
  const loginDetails = useAppSelector((state: any) => state.login.loginDetails);
  const [studentData, setStudentData] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      // Try different data sources in priority order

      // 1. Check if data is passed through router query
      if (router.query.studentData) {
        try {
          const data = JSON.parse(router.query.studentData as string);
          setStudentData(data);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing student data from query:", error);
        }
      }

      // 2. Check if data exists in localStorage
      if (localStorage.getItem("internationalStudentData")) {
        try {
          const data = JSON.parse(
            localStorage.getItem("internationalStudentData") || ""
          );
          setStudentData(data);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing stored student data:", error);
        }
      }

      // 3. Check if we can fetch by user's email from login context
      if (loginDetails && loginDetails.loginEmail) {
        try {
          await fetchInternationalStudentData(null, loginDetails.loginEmail);
          return;
        } catch (error) {
          console.error("Error fetching by email:", error);
        }
      }

      // 4. Try to load from query parameter applicationId
      const applicationId = router.query.applicationId;
      if (applicationId) {
        try {
          await fetchInternationalStudentData(applicationId as string);
          return;
        } catch (error) {
          console.error("Error fetching by applicationId:", error);
        }
      }

      // If all methods fail, show no data available
      setLoading(false);
      if (router.pathname === "/InternationalStudentDetails") {
        // Only show message if directly navigating to this page
        ShowMessagePopup(
          false,
          "No student information found. Please complete registration first.",
          "/InternationalStudentRegistration"
        );
      }
    };

    loadStudentData();
  }, [router.query, router.pathname, loginDetails]);

  // Helper function to fetch international student data from backend
  const fetchInternationalStudentData = async (
    applicationId?: string | null,
    email?: string | null
  ) => {
    try {
      setLoading(true);

      // Prepare query parameters
      const queryParams: { applicationId?: string; email?: string } = {};
      if (applicationId) queryParams.applicationId = applicationId;
      if (email) queryParams.email = email;

      if (Object.keys(queryParams).length === 0) {
        setLoading(false);
        return;
      }

      // Call the API endpoint to get student details
      const result = await CallingAxios(
        GetInternationalStudentDetails(queryParams)
      );

      if (result.status === "Success" && result.data) {
        // Save to localStorage for future access
        localStorage.setItem(
          "internationalStudentData",
          JSON.stringify(result.data)
        );

        // Set the data in component state
        setStudentData(result.data);
        // Only show success message when explicitly fetching, not during initial load
        if (applicationId || email) {
          ShowMessagePopup(true, "Student details loaded successfully", "");
        }
      } else {
        // Show error message
        ShowMessagePopup(
          false,
          result.message ||
            "Unable to find international student details. Please register first.",
          ""
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      ShowMessagePopup(
        false,
        "Failed to load student details. Please try again later.",
        ""
      );
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goToLandingPage = () => {
    router.push("/landingpage");
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h3>Loading student information...</h3>
      </Container>
    );
  }

  if (!studentData) {
    return (
      <Container className="py-5 text-center">
        <h3>No student information available</h3>
        <Button
          variant="primary"
          onClick={() => router.push("/InternationalStudentRegistration")}
          className="mt-3"
        >
          Register as International Student
        </Button>
      </Container>
    );
  }

  return (
    <div className="PageSpacing">
      <Head>
        <title>International Student Details | VIGNAN</title>
        <meta
          name="description"
          content="International Student Personal Information at VIGNAN"
        />
      </Head>

      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1>International Student Details</h1>
              <Button variant="primary" onClick={goToLandingPage}>
                Back to Dashboard
              </Button>
            </div>
            <hr />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Card className="border-primary">
              <Card.Header className="bg-primary text-white">
                <h4 className="my-1">Application Summary</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Application ID:</strong>{" "}
                      {studentData.applicationId || "N/A"}
                    </p>
                    <p>
                      <strong>Full Name:</strong> {studentData.studentName}
                    </p>
                    <p>
                      <strong>Email:</strong> {studentData.email}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="badge bg-success">
                        {studentData.status || "Pending"}
                      </span>
                    </p>
                    <p>
                      <strong>Submitted On:</strong>{" "}
                      {formatDate(studentData.registrationDate || "")}
                    </p>
                    <p>
                      <strong>Phone:</strong> {studentData.studentPhone}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header className="bg-light">
                <h4 className="my-1">Personal Information</h4>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Name:</strong>
                      </td>
                      <td>{studentData.studentName}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Phone:</strong>
                      </td>
                      <td>{studentData.studentPhone}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Email:</strong>
                      </td>
                      <td>{studentData.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Religion:</strong>
                      </td>
                      <td>{studentData.religion}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Height:</strong>
                      </td>
                      <td>{studentData.studentHeight} cm</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Blood Group:</strong>
                      </td>
                      <td>{studentData.bloodGroup}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Identification Marks:</strong>
                      </td>
                      <td>{studentData.studentMoles}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header className="bg-light">
                <h4 className="my-1">Parent Information</h4>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Father's Name:</strong>
                      </td>
                      <td>{studentData.fatherName}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Father's Phone:</strong>
                      </td>
                      <td>{studentData.fatherPhone}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Mother's Name:</strong>
                      </td>
                      <td>{studentData.motherName}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Mother's Phone:</strong>
                      </td>
                      <td>{studentData.motherPhone}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header className="bg-light">
                <h4 className="my-1">Address Information</h4>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Current Country:</strong>
                      </td>
                      <td>{studentData.currentCountry}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Permanent Country:</strong>
                      </td>
                      <td>{studentData.permanentCountry}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Complete Address:</strong>
                      </td>
                      <td>{studentData.address}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header className="bg-light">
                <h4 className="my-1">Visa & Passport Information</h4>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Passport Number:</strong>
                      </td>
                      <td>{studentData.passportNumber}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Visa Number:</strong>
                      </td>
                      <td>{studentData.visaNumber}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Visa Issued Country:</strong>
                      </td>
                      <td>{studentData.visaIssuedCountry}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Visa Issued Place:</strong>
                      </td>
                      <td>{studentData.visaIssuedPlace}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className="text-center">
            <p className="text-muted">
              If you need to update any information, please contact the
              international student office.
            </p>
            <Button
              variant="primary"
              onClick={goToLandingPage}
              className="me-3"
            >
              Back to Dashboard
            </Button>
            <Button variant="outline-secondary" onClick={() => window.print()}>
              Print Details
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
