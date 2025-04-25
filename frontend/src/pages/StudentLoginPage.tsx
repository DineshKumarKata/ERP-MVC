import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import { CallingAxios, ShowMessagePopup } from "../GenericFunctions";
import { UseStudentLogin } from "../axios";
import { useRouter } from "next/router";
import Head from "next/head";

const StudentLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      ShowMessagePopup(false, "Please enter both email and password.", "");
      return;
    }

    let data = { email: email, password: password };
    const result = await CallingAxios(UseStudentLogin(data));
    if (result.status === "Success") {
      let loginData = result.data;
      localStorage.setItem("LoginDetails", JSON.stringify(loginData));
      ShowMessagePopup(true, result.message, "/landingpage");
    } else {
      ShowMessagePopup(false, result.message, "");
    }
  };

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
      // query: query,
    });
  };

  return (
    <div className="PageSpacing studentloginCon">
      <Head>
        <title>Student Login | VIGNAN</title>
      </Head>
      <Container>
        <Row>
          <Col lg={6} md={6} xs={12}>
            <img
              src="/vignan/images/login-img.svg"
              alt="logo"
              className="loginImg"
            />
          </Col>
          <Col lg={6} md={6} xs={12}>
            <div className="loginForm">
              <form onSubmit={handleSubmit} className="mx-auto">
                <h2>Student Login</h2>
                <div className="">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    required
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                </div>

                <div className="pt-2">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                </div>

                <Row>
                  <Col lg={12} md={12} xs={12}>
                    <div>
                      <button type="submit" className="subBtn mt-4">
                        Login
                      </button>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={5} md={5} xs={12}>
                    <div
                      onClick={() => {
                        redirectToPage("/StudentRegistration");
                      }}
                      className="linkText"
                    >
                      <u>Sign Up</u>
                    </div>
                  </Col>
                  <Col lg={7} md={7} xs={12}>
                    <div className="linkText" style={{ float: "right" }}>
                      <u>Forgot Password</u>
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
};

export default StudentLoginPage;
