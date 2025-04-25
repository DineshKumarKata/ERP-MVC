import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { CallingAxios, ShowMessagePopup } from "../GenericFunctions";
import { UseSetPassword } from "../axios";
import "bootstrap/dist/css/bootstrap.min.css";

const PasswordSetup: React.FC = () => {
  const router = useRouter();
  const { email, token } = router.query;

  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "text-muted",
  });

  // Set email and token from query params when available
  useEffect(() => {
    if (email && token) {
      setFormData((prev) => ({
        ...prev,
        email: email as string,
        token: token as string,
      }));
    }
  }, [email, token]);

  // Check if we have the required data
  useEffect(() => {
    if (!router.isReady) return;

    if (!email || !token) {
      ShowMessagePopup(
        false,
        "Invalid or missing setup information. Please use the link provided in your email.",
        "/"
      );
    }
  }, [router.isReady, email, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength if password field changes
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    // Basic password strength check
    let score = 0;
    let message = "";
    let color = "text-danger";

    if (password.length < 8) {
      message = "Password is too short";
    } else {
      score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      if (score === 1) {
        message = "Weak password";
        color = "text-danger";
      } else if (score === 2) {
        message = "Fair password";
        color = "text-warning";
      } else if (score === 3) {
        message = "Good password";
        color = "text-info";
      } else if (score === 4) {
        message = "Strong password";
        color = "text-success";
      }
    }

    setPasswordStrength({ score, message, color });
  };

  const validateForm = () => {
    if (!formData.email || !formData.token) {
      ShowMessagePopup(
        false,
        "Missing required information. Please use the link provided in your email.",
        ""
      );
      return false;
    }

    if (!formData.password) {
      ShowMessagePopup(false, "Please enter a password.", "");
      return false;
    }

    if (formData.password.length < 8) {
      ShowMessagePopup(
        false,
        "Password must be at least 8 characters long.",
        ""
      );
      return false;
    }

    if (passwordStrength.score < 2) {
      ShowMessagePopup(false, "Please choose a stronger password.", "");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      ShowMessagePopup(false, "Passwords do not match.", "");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Submitting password setup with data:", {
      email: formData.email,
      token: formData.token,
      password: "********", // Don't log actual password
    });

    try {
      const result = await CallingAxios(
        UseSetPassword({
          email: formData.email,
          token: formData.token,
          password: formData.password,
        })
      );

      console.log("Password setup response:", result);

      if (result.status === "Success") {
        ShowMessagePopup(
          true,
          "Password set successfully. You can now log in with your new password.",
          "/StudentLoginPage"
        );
      } else {
        ShowMessagePopup(false, result.message, "");
      }
    } catch (error) {
      console.error("Password setup error:", error);
      ShowMessagePopup(
        false,
        "An unexpected error occurred. Please try again.",
        ""
      );
    }
  };

  return (
    <div className="PageSpacing studentloginCon">
      <Head>
        <title>Set Password | VIGNAN</title>
        <meta
          name="description"
          content="Set your password for your VIGNAN account"
        />
      </Head>

      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8} xs={12}>
            <div className="loginForm">
              <form onSubmit={handleSubmit} className="mx-auto">
                <h2 className="text-center mb-4">Set Your Password</h2>
                <p className="text-center mb-4">
                  Create a password for your account:{" "}
                  <strong>{formData.email}</strong>
                </p>

                <div className="mb-3">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                  {formData.password && (
                    <div
                      className={`mt-1 ${passwordStrength.color}`}
                      style={{ fontSize: "0.8rem" }}
                    >
                      {passwordStrength.message}
                    </div>
                  )}
                  <div
                    className="mt-1 text-muted"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Password must be at least 8 characters and include uppercase
                    letters, numbers, and special characters
                  </div>
                </div>

                <div className="mb-4">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control"
                    required
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                  {formData.password && formData.confirmPassword && (
                    <div
                      className={`mt-1 ${
                        formData.password === formData.confirmPassword
                          ? "text-success"
                          : "text-danger"
                      }`}
                      style={{ fontSize: "0.8rem" }}
                    >
                      {formData.password === formData.confirmPassword
                        ? "Passwords match"
                        : "Passwords don't match"}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="subBtn"
                    disabled={!formData.email || !formData.token}
                  >
                    Set Password
                  </button>
                </div>

                <div className="text-center mt-3">
                  <div
                    onClick={() => router.push("/StudentLoginPage")}
                    className="linkText"
                  >
                    <u>Back to Login</u>
                  </div>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PasswordSetup;
