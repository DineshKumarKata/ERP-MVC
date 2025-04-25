import React from "react";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../styles/components/Home.module.scss";

const Footer = () => {
  return (
    <div className={styles.footerCon}>
      <Container>
        <Row>
          <Col lg={6} md={6} xs={12}>
            <p className="">COPYRIGHTS © 2024 VISTR. ALL RIGHTS RESERVED.</p>
          </Col>
          <Col lg={6} md={6} xs={12} className="text-end">
            <div className="d-flex text-end justify-content-end">
              <span className="fw-bold me-3">FOLLOW US ON</span>
              <a href="#" className="text-black mx-2 p-2 bg-white rounded-circle d-flex align-items-end justify-content-end" >
                <FaFacebookF />
              </a>
              <a href="#" className="text-black mx-2 p-2 bg-white rounded-circle d-flex align-items-end justify-content-end" >
                <FaLinkedinIn color="none" />
              </a>
              <a href="#" className="text-black mx-2 p-2 bg-white rounded-circle d-flex align-items-center justify-content-center" >
                <FaXTwitter />
              </a>
              <a href="#" className="text-black mx-2 p-2 bg-white rounded-circle d-flex align-items-center justify-content-center" >
                <FaYoutube />
              </a>
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );
}
export default Footer;
