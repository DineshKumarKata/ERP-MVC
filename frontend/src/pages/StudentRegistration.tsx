import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { UseStudentRegistration } from "../axios";
import { CallingAxios, ShowMessagePopup } from "../GenericFunctions";
import Head from "next/head";

export default function StudentRegistration() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    country: "",
    category: "",
    program: "",
    course: "",
    specialization: "",
  });

  const courses: Record<string, string[]> = {
    "B.Tech": [
      "Computer Science",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
    ],
    "M.Tech": [
      "Data Science",
      "Robotics",
      "Power Systems",
      "Structural Engineering",
    ],
    MBA: ["Finance", "Marketing", "Human Resources", "Operations Management"],
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Reset specialization when course changes
    if (name === "course") {
      setFormData({ ...formData, [name]: value, specialization: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    // check if all fields are filled
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === "") {
        ShowMessagePopup(false, "Please fill in all fields", "");
        return false;
      }
    }
    if (formData.mobile.length !== 10) {
      ShowMessagePopup(false, "Mobile number must be 10 digits", "");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Submitting registration form with data:", formData);

    try {
      const result = await UseStudentRegistration(formData);
      console.log("Registration API response:", result);

      if (result.status === "Success") {
        // Instead of redirecting to login, redirect to password setup page with email
        const setupToken = "setup_token"; // This would normally come from the backend
        router.push({
          pathname: "/PasswordSetup",
          query: {
            email: formData.email,
            token: setupToken,
          },
        });
      } else {
        ShowMessagePopup(false, result.message || "Registration failed", "");
      }
    } catch (error: any) {
      console.error("Registration submission error:", error);
      ShowMessagePopup(
        false,
        error.message || "An unexpected error occurred. Please try again.",
        ""
      );
    }
  };

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
    });
  };

  return (
    <div className="PageSpacing studentloginCon">
      <Head>
        <title>Student Registration | VIGNAN</title>
        <meta name="description" content="Register as a student at VIGNAN" />
      </Head>
      <Container>
        <Row>
          <Col lg={6} md={6} xs={12}>
            <div className="regimgCon">
              <img
                src="/vignan/images/login-img.svg"
                alt="logo"
                className="loginImg"
              />
            </div>
          </Col>
          <Col lg={6} md={6} xs={12}>
            <div className="registrationForm regForm p-0">
              <form
                onSubmit={handleSubmit}
                style={{ padding: "10px" }}
                className="mx-auto">
                <h2 className="text-center">
                  <u>Registration Form</u>
                </h2>
                {/* First and Last Name */}
                <Row>
                  <Col lg={6} md={6} xs={12}>
                    <label>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>

                  <Col lg={6} md={6} xs={12}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                </Row>

                {/* Email and Mobile */}
                <Row className="mt-2">
                  <Col lg={6} md={6} xs={12}>
                    <label>Email</label>
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
                    <label>Mobile Number</label>
                    <input
                      maxLength={10}
                      type="tel"
                      className="form-control"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, "");
                      }}
                      pattern="\d*"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={6} md={6} xs={12}>
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Country</label>
                    <select
                      className="form-select"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}>
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="Sudan">Sudan</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={6} md={6} xs={12}>
                    <label>Select Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}>
                      <option value="">Select Category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC/ST">SC/ST</option>
                    </select>
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Select Program</label>
                    <select
                      className="form-select"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}>
                      <option value="">Select Program</option>
                      <option value="Undergraduation">Undergraduation</option>
                      <option value="PostGraduation">Graduation</option>
                      <option value="PHD">PHD</option>
                    </select>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={6} md={6} xs={12}>
                    <label>Select Course</label>
                    <select
                      className="form-select"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}>
                      <option value="">Select Course</option>
                      {Object.keys(courses).map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col lg={6} md={6} xs={12}>
                    <label>Select Specialization</label>
                    <select
                      className="form-select"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      disabled={!formData.course}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "15px",
                      }}>
                      <option value="">Select Specialization</option>
                      {formData.course &&
                        courses[formData.course]?.map((specialization) => (
                          <option key={specialization} value={specialization}>
                            {specialization}
                          </option>
                        ))}
                    </select>
                  </Col>
                </Row>

                <Row className="mt-3 text-start">
                  <Col lg={2} md={2} xs={12}></Col>
                  <Col lg={8} md={8} xs={12}>
                    <button
                      type="submit"
                      className="subBtn mt-3"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "20px",
                        backgroundColor: "#FF3C00",
                        color: "white",
                      }}>
                      Register
                    </button>
                  </Col>
                  <Col lg={2} md={2} xs={12}></Col>
                </Row>
                <Row className="mt-3 text-start">
                  <Col lg={3} md={3} xs={12}></Col>
                  <Col lg={7} md={7} xs={12}>
                    <div className="d-flex">
                      <p className="text-end mt-1 regText">
                        Already have an account?{" "}
                      </p>
                      <div
                        onClick={() => redirectToPage("/StudentLoginPage")}
                        className="linkText mt-1">
                        <u>Login</u>
                      </div>
                    </div>
                  </Col>
                  <Col lg={2} md={2} xs={12}></Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
