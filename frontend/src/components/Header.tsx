import React, { useEffect, useState } from "react";
import { useAppSelector } from '../redux/hooks';
import { Col, Container, Row } from "react-bootstrap";
import styles from "../styles/components/Home.module.scss";
import { KeepLoggedIn, ShowMessagePopup,LoggedOut } from '../GenericFunctions';
// import logo from "../../../public/images/vignanlogo.svg"

const Header = () => {

   let LoginDetails = useAppSelector((state: any) => state.login.loginDetails);
    
  
    useEffect(() => {
      if (KeepLoggedIn()) {
        console.log("LoginDetails :::::", LoginDetails);
        //Add Logic here 
      }
  }, []);
  

  return (
    <div className={styles.headerCon}>
      <Container fluid>
        <div className={styles.headerlogoInfo}>
          <Row className={styles.headerlogoconInfo}>
            <Col lg={2} md={2} xs={2}>
              <img src="/vignan/images/vignanlogo.svg" alt="logo" className={styles.logoImg} />
            </Col>
            <Col lg={4} md={4} xs={4}>
              <p className={styles.logoText}>విజ్ఞాన శాస్త్ర సాంకేతిక పరిశోధనా సంస్థ</p>
              <p className={styles.logoText}>विज्ञान शास्त्र प्रौद्योगिकी और परिशोधन संगठन</p>
            </Col>
            <Col lg={6} md={6} xs={6} className="p-0">
              <div className={`justify-content-end ${styles.headertextInfo}`}>
                <ul>
                  <li><a>International Students</a></li>
                  <li><a>New Student</a></li>
                  <li><a>Parent</a></li>
                  <li><a>Alumni</a></li>
                </ul>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} xs={12}>
            <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container" style={{marginRight:"0"}}>
     
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          {LoginDetails?.userId?
         <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className={`nav-item ${styles.logoutButton}`}><a className="nav-link" onClick={LoggedOut}>Logout</a></li>
           </ul>
          </div>
          :
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#">News</a></li>

              {/* Academics Dropdown */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="academicsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Academics
                </a>
                <ul className="dropdown-menu" aria-labelledby="academicsDropdown">
                  <li><a className="dropdown-item" href="#">Programs</a></li>
                  <li><a className="dropdown-item" href="#">Faculties</a></li>
                  <li><a className="dropdown-item" href="#">Departments</a></li>
                  <li><a className="dropdown-item" href="#">Academic Calendar</a></li>
                </ul>
              </li>

              <li className="nav-item"><a className="nav-link" href="#">Admission</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Research</a></li>

              {/* People Dropdown */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="peopleDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  People
                </a>
                <ul className="dropdown-menu" aria-labelledby="peopleDropdown">
                  <li><a className="dropdown-item" href="#">Faculty</a></li>
                  <li><a className="dropdown-item" href="#">Staff</a></li>
                  <li><a className="dropdown-item" href="#">Students</a></li>
                  <li><a className="dropdown-item" href="#">Leadership</a></li>
                </ul>
              </li>

              <li className="nav-item"><a className="nav-link" href="#">University Life</a></li>
              <li className="nav-item"><a className="nav-link" href="#">About Us</a></li>
            </ul>
          </div>
          }
          
        </div>
      </nav>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
export default Header;
