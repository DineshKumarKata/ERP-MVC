import instance from "./redux/api";
import axios, { AxiosError } from "axios";
/**
 * Student registration API call
 * Correct endpoint: /v1/student/studentRegistration
 */

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:4001/vignanAPI";


export const UseStudentRegistration = async (data: any) => {
  console.log(
    "Sending registration data to:",
    "/v1/student/studentRegistration"
  );
  try {
    const res = await instance.post("/v1/student/studentRegistration", data);
    console.log("Registration response:", res.data);
    return res.data;
  } catch (e: any) {
    console.error("Registration error details:", {
      message: e.message,
      code: e.code,
      response: e.response?.data,
      status: e.response?.status,
    });

    // Provide more specific error messages based on the error type
    if (!e.response) {
      throw new Error(
        "Network error: Unable to reach the server. Please check your internet connection and try again."
      );
    }

    if (e.response.status === 404) {
      throw new Error(
        "Server error: The registration service is not available. Please try again later."
      );
    }

    if (e.response.status === 400) {
      throw new Error(
        e.response.data.message ||
          "Invalid registration data. Please check your information and try again."
      );
    }

    throw new Error(
      e.response?.data?.message ||
        "Registration failed. Please try again later."
    );
  }
};

/**
 * International Student registration API call
 * Endpoint: /v1/student/internationalStudentRegistration
 */
export const UseInternationalStudentRegistration = async (data: any) => {
  console.log(
    "Sending international student registration data to:",
    "/v1/student/internationalStudentRegistration"
  );

  // Make sure we're sending the correct field names according to the schema
  const formattedData = {
    studentName: data.studentName,
    studentPhone: data.studentPhone,
    fatherName: data.fatherName,
    fatherPhone: data.fatherPhone,
    motherName: data.motherName,
    motherPhone: data.motherPhone,
    currentCountry: data.currentCountry,
    religion: data.religion,
    studentHeight: data.studentHeight,
    address: data.address,
    permanentCountry: data.permanentCountry,
    passportNumber: data.passportNumber,
    visaNumber: data.visaNumber,
    studentMoles: data.studentMoles,
    bloodGroup: data.bloodGroup,
    email: data.email,
    visaIssuedCountry: data.visaIssuedCountry,
    visaIssuedPlace: data.visaIssuedPlace,
  };

  try {
    const res = await instance.post(
      "/v1/student/internationalStudentRegistration",
      formattedData
    );
    console.log("International registration response:", res.data);

    // Return the complete response for the details page
    return {
      status: res.data.status,
      message: res.data.message,
      data: res.data.data || {},
    };
  } catch (e: any) {
    console.error("International registration error:", e);

    // Extract the most useful error message
    let errorMessage = "Registration failed. Please try again.";

    if (e.response) {
      // The request was made and the server responded with a status code
      if (e.response.data && e.response.data.message) {
        errorMessage = e.response.data.message;
      } else if (e.response.status === 501) {
        errorMessage =
          "Server error. This feature is not fully implemented yet.";
      }
    } else if (e.request) {
      // The request was made but no response was received
      errorMessage = "No response from server. Please check your connection.";
    } else {
      // Something happened in setting up the request
      errorMessage = e.message;
    }

    return {
      status: "Failure",
      message: errorMessage,
    };
  }
};

/**
 * Student login API call
 * Correct endpoint: /v1/student/login
 */
export const UseStudentLogin = async (data: any) => {
  console.log("Sending login data to:", "/v1/student/login");
  return await instance
    .post("/v1/student/login", data)
    .then((res) => {
      console.log("Login response:", res.data);
      return res.data;
    })
    .catch((e) => {
      console.error("Login error:", e);
      return {
        status: "Failure",
        message: e.response?.data?.message
          ? e.response?.data?.message
          : e.message,
      };
    });
};

/**
 * Set password API call
 * Endpoint: /v1/student/setPassword
 */
export const UseSetPassword = async (data: any) => {
  console.log("Sending password setup data to:", "/v1/student/setPassword");
  return await instance
    .post("/v1/student/setPassword", data)
    .then((res) => {
      console.log("Password setup response:", res.data);
      return res.data;
    })
    .catch((e) => {
      console.error("Password setup error:", e);
      return {
        status: "Failure",
        message: e.response?.data?.message
          ? e.response?.data?.message
          : e.message,
      };
    });
};

/**
 * Fetch International Student details API call
 * Endpoint: /student/getInternationalStudentDetails
 */
export const GetInternationalStudentDetails = async (params: {
  applicationId?: string;
  email?: string;
}) => {
  console.log("Fetching international student details with params:", params);

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.applicationId) {
      queryParams.append("applicationId", params.applicationId);
    }
    if (params.email) {
      queryParams.append("email", params.email);
    }

    const url = `/student/getInternationalStudentDetails?${queryParams.toString()}`;
    const res = await instance.get(url);
    console.log("International student details response:", res.data);

    return {
      status: res.data.status,
      message: res.data.message,
      data: res.data.data || {},
    };
  } catch (e: any) {
    console.error("Error fetching international student details:", e);

    let errorMessage = "Failed to fetch student details. Please try again.";

    if (e.response) {
      if (e.response.data && e.response.data.message) {
        errorMessage = e.response.data.message;
      } else if (e.response.status === 404) {
        errorMessage = "Student details not found.";
      }
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }

    return {
      status: "Failure",
      message: errorMessage,
    };
  }
};

/**
 * Helper function to get user email from localStorage
 * @returns {string|null} User email or null if not found
 */
const getUserEmail = (): string | null => {
  try {
    const loginDetailsStr = localStorage.getItem("LoginDetails");
    if (!loginDetailsStr) {
      console.error("No login details found in localStorage");
      return null;
    }

    console.log("Raw login details from localStorage:", loginDetailsStr);

    const loginDetails = JSON.parse(loginDetailsStr);
    console.log("Parsed login details:", loginDetails);

    // Try all possible email field names
    const email = loginDetails.loginEmail || loginDetails.email || "";

    if (!email) {
      console.error("No valid email found in login details", loginDetails);

      // If we have a token, log it for debugging
      if (loginDetails.token) {
        console.log("Token is present in login details");
      }

      // Check if there's a data field with the email
      if (loginDetails.data && typeof loginDetails.data === "object") {
        console.log("Checking data object for email");
        const dataEmail =
          loginDetails.data.loginEmail || loginDetails.data.email;
        if (dataEmail) {
          console.log("Found email in data object:", dataEmail);
          return dataEmail;
        }
      }

      return null;
    }

    console.log("Successfully found email:", email);
    return email;
  } catch (e) {
    console.error("Error extracting email from localStorage:", e);
    return null;
  }
};

/**
 * Get all certificates for a student
 * Endpoint: /v1/student/certificates
 */
export const GetCertificates = async () => {
  // Get email from local storage
  const email = getUserEmail();
  if (!email) {
    return {
      status: "Failure",
      message: "User email not found",
      certificates: {},
    };
  }

  console.log(
    "Fetching certificates from:",
    `/v1/student/certificates?email=${email}`
  );
  try {
    const res = await instance.get(`/v1/student/certificates?email=${email}`);
    console.log("Certificates response:", res.data);
    return {
      status: res.data.status,
      certificates: res.data.certificates || {},
    };
  } catch (e: any) {
    console.error("Error fetching certificates:", e);

    let errorMessage = "Failed to fetch certificates. Please try again.";

    if (e.response) {
      if (e.response.data && e.response.data.message) {
        errorMessage = e.response.data.message;
      }
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }

    return {
      status: "Failure",
      message: errorMessage,
      certificates: {},
    };
  }
};

/**
 * Upload a certificate
 * Endpoint: /v1/student/certificates/upload/:type
 */
export const UploadCertificate = async (type: string, file: File) => {
  // Get email from local storage
  const email = getUserEmail();
  if (!email) {
    return {
      status: "Failure",
      message: "User email not found",
    };
  }

  console.log(
    `Uploading ${type} certificate to:`,
    `/v1/student/certificates/upload/${type}?email=${email}`
  );
  console.log("File details:", {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString(),
  });

  try {
    const formData = new FormData();

    // Make sure to append the file with the name "file" to match the server expectation
    formData.append("file", file, file.name);

    // Log form data for debugging (note: FormData can't be directly logged)
    console.log("Form data created with file");

    // Create custom config for FormData
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("Sending upload request...");
    const res = await instance.post(
      `/v1/student/certificates/upload/${type}?email=${email}`,
      formData,
      config
    );
    console.log("Certificate upload response:", res.data);

    return {
      status: res.data.status,
      message: res.data.message || `${type} uploaded successfully`,
    };
  } catch (e: any) {
    console.error("Error uploading certificate:", e);

    // Extended error data for debugging
    console.error("Upload error details:", {
      message: e.message,
      status: e.response?.status,
      statusText: e.response?.statusText,
      responseData: e.response?.data,
      requestConfig: e.config,
    });

    let errorMessage = "Failed to upload certificate. Please try again.";

    if (e.response) {
      if (e.response.data && e.response.data.message) {
        errorMessage = e.response.data.message;
      }
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }

    return {
      status: "Failure",
      message: errorMessage,
    };
  }
};

/**
 * Update a certificate
 * Endpoint: /v1/student/certificates/:type
 */
export const UpdateCertificate = async (type: string, file: File) => {
  // Get email from local storage
  const email = getUserEmail();
  if (!email) {
    return {
      status: "Failure",
      message: "User email not found",
    };
  }

  console.log(
    `Updating ${type} certificate at:`,
    `/v1/student/certificates/${type}?email=${email}`
  );
  console.log("File details:", {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString(),
  });

  try {
    const formData = new FormData();

    // Make sure to append the file with the name "file" to match the server expectation
    formData.append("file", file, file.name);

    // Log form data for debugging (note: FormData can't be directly logged)
    console.log("Form data created with file");

    // Create custom config for FormData
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("Sending update request...");
    const res = await instance.put(
      `/v1/student/certificates/${type}?email=${email}`,
      formData,
      config
    );
    console.log("Certificate update response:", res.data);

    return {
      status: res.data.status,
      message: res.data.message || `${type} updated successfully`,
    };
  } catch (e: any) {
    console.error("Error updating certificate:", e);

    // Extended error data for debugging
    console.error("Update error details:", {
      message: e.message,
      status: e.response?.status,
      statusText: e.response?.statusText,
      responseData: e.response?.data,
      requestConfig: e.config,
    });

    let errorMessage = "Failed to update certificate. Please try again.";

    if (e.response) {
      if (e.response.data && e.response.data.message) {
        errorMessage = e.response.data.message;
      }
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }

    return {
      status: "Failure",
      message: errorMessage,
    };
  }
};

/**
 * Delete a certificate
 * Endpoint: /v1/student/certificates/:type
 */
export const DeleteCertificate = async (type: string) => {
  // Get email from local storage
  const email = getUserEmail();
  if (!email) {
    return {
      status: "Failure",
      message: "User email not found",
    };
  }

  console.log(
    `Deleting ${type} certificate at:`,
    `/v1/student/certificates/${type}?email=${email}`
  );

  try {
    const res = await instance.delete(
      `/v1/student/certificates/${type}?email=${email}`
    );
    console.log("Certificate deletion response:", res.data);

    return {
      status: res.data.status,
      message: res.data.message || `${type} deleted successfully`,
    };
  } catch (e: any) {
    console.error("Error deleting certificate:", e);

    let errorMessage = "Failed to delete certificate. Please try again.";

    if (e.response) {
      if (e.response.data && e.response.data.message) {
        errorMessage = e.response.data.message;
      }
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }

    return {
      status: "Failure",
      message: errorMessage,
    };
  }
};

/**
 * Get user details
 * Endpoint: /v1/student/getuser
 */
export const GetUserDetails = async () => {
  // Get email from local storage
  const email = getUserEmail();
  if (!email) {
    console.error("Failed to get user email from localStorage");
    return {
      status: "Failure",
      message: "User email not found in localStorage. Please log in again.",
      data: null,
    };
  }

  console.log("Fetching user details with email:", email);
  console.log("Request URL:", `/v1/student/getuser?email=${email}`);

  try {
    const res = await instance.get(`/v1/student/getuser?email=${email}`);
    console.log("User details response:", res.data);
    return res.data;
  } catch (e: any) {
    console.error("Error fetching user details:", e);
    console.error("Error details:", {
      message: e.message,
      status: e.response?.status,
      responseData: e.response?.data,
      stack: e.stack,
    });

    let errorMessage = "Failed to fetch user details. Please try again.";
    let errorStatus = "Failure";

    if (e.response) {
      if (e.response.data && e.response.data.message) {
        errorMessage = e.response.data.message;
      }
      if (e.response.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (e.response.status === 404) {
        errorMessage = "User not found. Please check your login details.";
      } else if (e.response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }

    return {
      status: errorStatus,
      message: errorMessage,
      data: null,
    };
  }
};

/**
 * Fetch all question banks
 * Endpoint: /api/admin/question-banks
 */
// export const GetQuestionBanks = async () => {
//   console.log(
//     "Fetching question banks from:",
//     "/questionbank/getAllQuestionBanks"
//   );
//   try {
//     const res = await instance.get("/questionbank/getAllQuestionBanks");
//     console.log("Question banks response:", res.data);
//     return {
//       status: res.data.status || "Success",
//       data: res.data || [],
//     };
//   } catch (e: any) {
//     console.error("Error fetching question banks:", e);
//     let errorMessage = "Failed to fetch question banks. Please try again.";
//     if (e.response && e.response.data && e.response.data.message) {
//       errorMessage = e.response.data.message;
//     } else if (e.request) {
//       errorMessage = "No response from server. Please check your connection.";
//     } else {
//       errorMessage = e.message;
//     }
//     return {
//       status: "Failure",
//       message: errorMessage,
//       data: [],
//     };
//   }
// };


export const GetQuestionBanks = async () => {
  console.log(
    "Fetching question banks from:",
    "/questionbank/getAllQuestionBanks"
  );
  try {
    const res = await instance.get("/questionbank/getAllQuestionBanks");
    console.log("Full response:", res);
    console.log("Question banks response:", res.data);
    
    // Ensure we have an array of question banks
    const questionBanks = Array.isArray(res.data) ? res.data :
                         Array.isArray(res.data.data) ? res.data.data :
                         Array.isArray(res.data.questionBanks) ? res.data.questionBanks : [];
    
    return {
      status: "Success",
      data: questionBanks
    };
  } catch (e: any) {
    console.error("Network error details:", {
      message: e.message,
      code: e.code,
      config: e.config,
      request: e.request,
      response: e.response,
    });
    let errorMessage = "Failed to fetch question banks. Please try again.";
    if (e.response && e.response.data && e.response.data.message) {
      errorMessage = e.response.data.message;
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }
    return {
      status: "Failure",
      message: errorMessage,
      data: []
    };
  }
};

/**
 * Fetch questions from a specific question bank
 * Endpoint: /api/admin/question-banks/:bankId
 */
export const GetQuestionsByBankId = async (bankId: string) => {
  const url = `/questionbank/getQuestionBankById/${bankId}`;
  console.log("Fetching questions from bank:", url);
  try {
    const res = await instance.get(url);
    console.log("Raw API response:", res);
    console.log("Response data structure:", {
      hasData: !!res.data,
      isArray: Array.isArray(res.data),
      hasDataProperty: !!res.data?.data,
      hasQuestionsProperty: !!res.data?.questions,
      dataType: typeof res.data
    });
    
    // Handle different response structures
    let questions = [];
    if (Array.isArray(res.data)) {
      questions = res.data;
    } else if (res.data?.data && Array.isArray(res.data.data)) {
      questions = res.data.data;
    } else if (res.data?.questions && Array.isArray(res.data.questions)) {
      questions = res.data.questions;
    } else if (res.data?.data?.questions && Array.isArray(res.data.data.questions)) {
      questions = res.data.data.questions;
    }
    
    console.log("Extracted questions array:", questions);
    console.log("First question sample:", questions[0]);
    
    return {
      status: "Success",
      data: questions
    };
  } catch (e: any) {
    console.error("Error fetching questions:", e);
    console.error("Error details:", {
      message: e.message,
      status: e.response?.status,
      data: e.response?.data,
      config: e.config
    });
    
    let errorMessage = "Failed to fetch questions. Please try again.";
    if (e.response && e.response.data && e.response.data.message) {
      errorMessage = e.response.data.message;
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }
    return {
      status: "Failure",
      message: errorMessage,
      data: []
    };
  }
};

/**
 * Generate a multi-subject test
 * Endpoint: /v1/test/generate-multi
 */
export const GenerateMultiSubjectTest = async (data: any) => {
  console.log("Generating multi-subject test with data:", data);
  try {
    // Get the authentication token from localStorage
    const loginDetails = localStorage.getItem("LoginDetails");
    if (!loginDetails) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const parsedData = JSON.parse(loginDetails);
    if (!parsedData || !parsedData.token) {
      throw new Error("Invalid authentication token. Please log in again.");
    }

    // Set up request config with authentication header
    const config = {
      headers: {
        'Authorization': typeof parsedData.token === 'string' 
          ? `Bearer ${parsedData.token}`
          : `Bearer ${parsedData.token.token}`,
        'Content-Type': 'application/json'
      }
    };

    console.log("Sending request with auth token:", config.headers.Authorization);
    const res = await instance.post("/v1/test/generate-multi", data, config);
    console.log("Test generation response:", res.data);
    
    // Handle different possible response structures
    if (res.data.status === "Success") {
      return {
        status: "Success",
        testId: res.data.testId || res.data.data?.testId,
        data: res.data.data || res.data
      };
    } else {
      throw new Error(res.data.message || "Failed to generate test");
    }
  } catch (e: any) {
    console.error("Error generating test:", e);
    console.error("Error details:", {
      message: e.message,
      status: e.response?.status,
      data: e.response?.data,
      config: e.config,
      url: e.config?.url,
      baseURL: instance.defaults.baseURL
    });
    
    let errorMessage = "Failed to generate test. Please try again.";
    if (e.response?.status === 401) {
      errorMessage = "Your session has expired. Please log in again.";
      // Clear localStorage and redirect to login
      localStorage.clear();
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/vignan';
      window.location.href = `${basePath}/StudentLoginPage`;
    } else if (e.response && e.response.data && e.response.data.message) {
      errorMessage = e.response.data.message;
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }
    
    return {
      status: "Failure",
      message: errorMessage,
      testId: null,
      data: null
    };
  }
};

/**
 * Fetch test details by ID
 * Endpoint: /api/admin/test/:testId
 */
export const GetTestById = async (testId: string) => {
  console.log("Fetching test details from:", `/v1/test/${testId}`);
  try {
    const res = await instance.get(`/v1/test/${testId}`);
    console.log("Test details response:", res.data);
    return {
      status: res.data.status || "Success",
      data: res.data,
    };
  } catch (e: any) {
    console.error("Error fetching test details:", e);
    let errorMessage = "Failed to fetch test details. Please try again.";
    if (e.response && e.response.data && e.response.data.message) {
      errorMessage = e.response.data.message;
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }
    return {
      status: "Failure",
      message: errorMessage,
      data: null,
    };
  }
};


/**
 * Fetch all admissions
 * Endpoint: /v1/admission/getAllAdmissions
 */
export const GetAllAdmissions = async () => {
  console.log("Fetching all admissions from:", "/v1/admission/getAllAdmissions");
  try {
    const res = await instance.get("/v1/admission/getAllAdmissions");
    console.log("Admissions response:", res.data);
    return {
      status: res.data.status || "Success",
      data: res.data.data || [],
      message: res.data.message
    };
  } catch (e: any) {
    console.error("Error fetching admissions:", e);
    let errorMessage = "Failed to fetch admissions. Please try again.";
    if (e.response && e.response.data && e.response.data.message) { 
      errorMessage = e.response.data.message;
    } else if (e.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = e.message;
    }
    return {
      status: "Failure",
      message: errorMessage,
      data: []
    };
  }
};
