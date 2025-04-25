// import type { NextPage } from "next";
// import Head from "next/head";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

// const Home: NextPage = () => {
//   const router = useRouter();
//   const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/vignan";
//   const [redirectFailed, setRedirectFailed] = useState(false);

//   useEffect(() => {
//     // Redirect to the login page
//     const redirect = async () => {
//       try {
//         await router.replace("/StudentLoginPage");
//       } catch (error) {
//         console.error("Navigation error:", error);
//         // Try direct URL if Next.js router fails
//         try {
//           window.location.href = `${basePath}/StudentLoginPage`;
//         } catch (fallbackError) {
//           console.error("Fallback redirect failed:", fallbackError);
//           setRedirectFailed(true);
//         }
//       }
//     };

//     // Start redirect
//     redirect();

//     // Set a timeout to show manual redirect options if automatic redirect fails
//     const timer = setTimeout(() => {
//       setRedirectFailed(true);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [router, basePath]);

//   return (
//     <Container className="py-5 text-center mt-5">
//       <Head>
//         <title>VIGNAN - Student Portal</title>
//         <meta name="description" content="Vignan University Student Portal" />
//         <link rel="icon" href={`${basePath}/favicon.ico`} type="image/x-icon" />
//       </Head>

//       <Row className="justify-content-center">
//         <Col md={8} lg={6}>
//           <h1 className="mb-4">Vignan University Student Portal</h1>

//           {!redirectFailed ? (
//             <div className="my-5">
//               <Spinner animation="border" role="status" variant="primary" />
//               <p className="mt-3">Redirecting to Student Login...</p>
//             </div>
//           ) : (
//             <div className="my-4">
//               <p className="lead mb-4">
//                 If you are not redirected automatically, please click the button
//                 below:
//               </p>
//               <Link href="/StudentLoginPage">
//                 <Button variant="primary" size="lg">
//                   Go to Student Login
//                 </Button>
//               </Link>
//               <p className="text-muted mt-4">
//                 <small>
//                   If the link above doesn't work, you can try accessing directly
//                   at:
//                   <br />
//                   <a
//                     href={`${basePath}/StudentLoginPage`}
//                     className="text-decoration-underline"
//                   >
//                     {window?.location?.origin}
//                     {basePath}/StudentLoginPage
//                   </a>
//                 </small>
//               </p>
//             </div>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Home;



import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Button } from "react-bootstrap";
import { KeepLoggedIn } from "../GenericFunctions";
import "bootstrap/dist/css/bootstrap.min.css";

const Home: NextPage = () => {
  const router = useRouter();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/vignan";

  const goToSubjectSelector = async () => {
    if (!KeepLoggedIn()) {
      router.push(`${basePath}/StudentLoginPage`);
      return;
    }
    try {
      await router.push(`${basePath}/SubjectSelector`);
    } catch (error) {
      console.error("Navigation to SubjectSelector failed:", error);
      window.location.href = `${basePath}/SubjectSelector`;
    }
  };

  const goToStudentLogin = async () => {
    try {
      await router.push(`${basePath}/StudentLoginPage`);
    } catch (error) {
      console.error("Navigation to StudentLoginPage failed:", error);
      window.location.href = `${basePath}/StudentLoginPage`;
    }
  };

  return (
    <Container className="py-5 text-center mt-5">
      <Head>
        <title>VIGNAN - Student Portal</title>
        <meta name="description" content="Vignan University Student Portal" />
        <link rel="icon" href={`${basePath}/favicon.ico`} type="image/x-icon" />
      </Head>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="mb-4">Vignan University Student Portal</h1>
          <p className="lead mb-4">
            Welcome to the Vignan University Student Portal
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={goToSubjectSelector}
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "20px",
                backgroundColor: "#FF3C00",
                borderColor: "#FF3C00",
              }}>
              Go to Test Generator
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={goToStudentLogin}
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "20px",
              }}>
              Go to Student Login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;