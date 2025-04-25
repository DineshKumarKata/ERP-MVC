import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { UseInternationalStudentRegistration } from "../axios";
import { CallingAxios, ShowMessagePopup } from "../GenericFunctions";
import Head from "next/head";
import { useAppSelector } from "../redux/hooks";

export default function InternationalStudentRegistration() {
  const router = useRouter();
  const loginDetails = useAppSelector((state: any) => state.login.loginDetails);

  const [formData, setFormData] = useState({
    studentName: "",
    studentPhone: "",
    email: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    currentCountry: "",
    religion: "",
    studentHeight: "",
    address: "",
    permanentCountry: "",
    passportNumber: "",
    visaNumber: "",
    studentMoles: "",
    bloodGroup: "",
    visaIssuedCountry: "",
    visaIssuedPlace: "",
  });

  // Pre-fill email from login details if available
  useEffect(() => {
    if (loginDetails && loginDetails.loginEmail) {
      setFormData((prev) => ({
        ...prev,
        email: loginDetails.loginEmail,
      }));
    }
  }, [loginDetails]);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const religions = [
    "Hindu",
    "Muslim",
    "Christian",
    "Buddhist",
    "Sikh",
    "Jain",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Basic required field validation
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === "") {
        ShowMessagePopup(
          false,
          `Please fill in all required fields: ${key
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} is missing`,
          ""
        );
        return false;
      }
    }

    // Phone number validation
    const phoneFields = ["studentPhone", "fatherPhone", "motherPhone"];
    for (const field of phoneFields) {
      if (formData[field as keyof typeof formData].length < 7) {
        ShowMessagePopup(
          false,
          `Please enter a valid phone number for ${field.replace("Phone", "")}`,
          ""
        );
        return false;
      }
    }

    // Passport number validation
    if (formData.passportNumber.length < 6) {
      ShowMessagePopup(false, "Please enter a valid passport number", "");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      ShowMessagePopup(false, "Please enter a valid email address", "");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log(
      "Submitting international student registration form with data:",
      formData
    );

    try {
      // Show loading state
      const result = await CallingAxios(
        UseInternationalStudentRegistration(formData)
      );
      console.log("Registration API response:", result);

      if (result.status === "Success") {
        // Save form data and API response data to localStorage
        const studentData = {
          ...formData,
          applicationId: result?.data?.applicationId || "",
          registrationDate:
            result?.data?.registrationDate || new Date().toISOString(),
          status: "Pending",
        };

        // Save to localStorage for later retrieval
        localStorage.setItem(
          "internationalStudentData",
          JSON.stringify(studentData)
        );

        // Redirect to details page with application ID
        router.push({
          pathname: "/InternationalStudentDetails",
          query: {
            applicationId: result?.data?.applicationId,
            // We don't need to pass all data in the URL since we stored it in localStorage
          },
        });
      } else {
        // Show specific error message from API
        ShowMessagePopup(
          false,
          result.message || "Registration failed. Please try again.",
          ""
        );
      }
    } catch (error: any) {
      console.error("Registration submission error:", error);

      // Show user-friendly error message
      ShowMessagePopup(
        false,
        error.message ||
          "An unexpected error occurred. Please try again later.",
        ""
      );
    }
  };

  return (
    <div className="PageSpacing studentloginCon">
      <Head>
        <title>International Student Registration | VIGNAN</title>
        <meta
          name="description"
          content="Register as an international student at VIGNAN"
        />
      </Head>
      <Container>
        <Row className="mb-4">
          <Col xs={12}>
            <h1 className="text-center">International Student Registration</h1>
            <p className="text-center">
              Please fill out all required information to register as an
              international student
            </p>
          </Col>
        </Row>
        <Row className="mb-4" style={{ marginLeft: "320px" }}>
          <Col lg={8} md={7} xs={12}>
            <div className="registrationForm regForm p-0">
              <form
                onSubmit={handleSubmit}
                style={{ padding: "20px" }}
                className="mx-auto"
              >
                <h3 className="mb-4">
                  <u>Personal Information</u>
                </h3>

                {/* Student Information */}
                <Row>
                  <Col lg={6} md={6} xs={12}>
                    <label>Student Full Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Student Phone Number*</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="studentPhone"
                      value={formData.studentPhone}
                      onChange={handleChange}
                      required
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9+\-\s]/g, "");
                      }}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                    <small className="text-muted">
                      Include country code (e.g., +1 for US)
                    </small>
                  </Col>
                </Row>

                {/* Email */}
                <Row className="mt-3">
                  <Col lg={6} md={6} xs={12}>
                    <label>Email*</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Religion*</label>
                    <select
                      className="form-select"
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    >
                      <option value="">Select Religion</option>
                      {religions.map((religion) => (
                        <option key={religion} value={religion}>
                          {religion}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>

                {/* Parent Information */}
                <h3 className="mt-4 mb-3">
                  <u>Parent/Guardian Information</u>
                </h3>
                <Row>
                  <Col lg={6} md={6} xs={12}>
                    <label>Father's Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Father's Phone Number*</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="fatherPhone"
                      value={formData.fatherPhone}
                      onChange={handleChange}
                      required
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9+\-\s]/g, "");
                      }}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={6} md={6} xs={12}>
                    <label>Mother's Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Mother's Phone Number*</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="motherPhone"
                      value={formData.motherPhone}
                      onChange={handleChange}
                      required
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9+\-\s]/g, "");
                      }}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                </Row>

                {/* Address Information */}
                <h3 className="mt-4 mb-3">
                  <u>Address Information</u>
                </h3>
                <Row>
                  <Col lg={6} md={6} xs={12}>
                    <label>Current Country*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="currentCountry"
                      value={formData.currentCountry}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Permanent Country*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="permanentCountry"
                      value={formData.permanentCountry}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <label>Complete Address*</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                </Row>

                {/* Physical & Medical Information */}
                <h3 className="mt-4 mb-3">
                  <u>Physical Information</u>
                </h3>
                <Row>
                  <Col lg={6} md={6} xs={12}>
                    <label>Height (in cm)*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="studentHeight"
                      value={formData.studentHeight}
                      onChange={handleChange}
                      required
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9.]/g, "");
                      }}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Blood Group*</label>
                    <select
                      className="form-select"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <label>Identification Marks (Moles/Scars)*</label>
                    <textarea
                      className="form-control"
                      name="studentMoles"
                      value={formData.studentMoles}
                      onChange={handleChange}
                      required
                      rows={2}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                      placeholder="Describe any visible moles, scars or identifying marks"
                    />
                  </Col>
                </Row>

                {/* Visa Information */}
                <h3 className="mt-4 mb-3">
                  <u>Visa & Passport Information</u>
                </h3>
                <Row>
                  <Col lg={6} md={6} xs={12}>
                    <label>Passport Number*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Visa Number*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="visaNumber"
                      value={formData.visaNumber}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={6} md={6} xs={12}>
                    <label>Visa Issued Country*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="visaIssuedCountry"
                      value={formData.visaIssuedCountry}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Visa Issued Place*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="visaIssuedPlace"
                      value={formData.visaIssuedPlace}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                      placeholder="City/Office where visa was issued"
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xs={12}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="termsCheck"
                        required
                      />
                      <label className="form-check-label" htmlFor="termsCheck">
                        I agree to the terms and conditions, and I confirm that
                        all information provided is accurate.
                      </label>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col className="text-center">
                    <button
                      type="submit"
                      className="subBtn mt-3"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "18px",
                        backgroundColor: "#FF3C00",
                        color: "white",
                        padding: "10px 30px",
                      }}
                    >
                      Submit Application
                    </button>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <p className="mb-0 me-2">Already have an account?</p>
                      <div
                        onClick={() => router.push("/StudentLoginPage")}
                        className="linkText"
                      >
                        <u>Login</u>
                      </div>
                    </div>
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
