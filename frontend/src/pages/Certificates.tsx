import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaTrash, FaDownload, FaUpload, FaEdit } from "react-icons/fa";
import {
  GetCertificates,
  UploadCertificate,
  UpdateCertificate,
  DeleteCertificate,
  GetUserDetails,
} from "../axios";
import { CallingAxios, ShowMessagePopup } from "../GenericFunctions";
import instance from "../redux/api";

// Use environment variable for API base URL or hardcode it based on your setup
const serverurl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/vignanAPI";

const fileOptionsOrder = [
  "Photo",
  "Signature",
  "10th",
  "Inter",
  "Diploma",
  "Ug1",
  "Ug2",
  "Pg1",
  "Pg2",
];

interface FileRef {
  originalName: string;
  ref: string;
}

interface UploadedFiles {
  [key: string]: FileRef;
}

interface StudentDetails {
  name: string;
  branch: string;
  phone: string;
  programme: string;
}

const FileUploadComponent: React.FC = () => {
  const [selectedFileType, setSelectedFileType] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    name: "John Doe",
    branch: "Computer Science",
    phone: "+1 234 567 890",
    programme: "B.Tech",
  });
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getuser = async () => {
      try {
        // Check if user is logged in
        const loginDetailsStr = localStorage.getItem("LoginDetails");
        if (!loginDetailsStr) {
          console.error("No login details found in localStorage");
          ShowMessagePopup(
            false,
            "Please log in to view this page",
            "/StudentLoginPage"
          );
          return;
        }

        // Log what we found in localStorage to help with debugging
        console.log(
          "LoginDetails from localStorage:",
          JSON.parse(loginDetailsStr)
        );

        // Try to extract email directly from localStorage for debugging
        try {
          const loginDetails = JSON.parse(loginDetailsStr);
          const email =
            loginDetails.loginEmail ||
            (loginDetails.data && loginDetails.data.loginEmail) ||
            loginDetails.email ||
            (loginDetails.data && loginDetails.data.email);

          console.log("Directly extracted email from localStorage:", email);
        } catch (e) {
          console.error("Error parsing login details:", e);
        }

        // Attempt to get user details
        console.log("About to call GetUserDetails");
        const result = await CallingAxios(GetUserDetails());
        console.log("GetUserDetails result:", result);

        if (result.status === "Success" && result.data) {
          setStudentDetails({
            name:
              result.data.firstName + " " + result.data.lastName ||
              "Unknown User",
            branch: result.data.specialization || "",
            phone: result.data.mobile || "",
            programme: result.data.program || "B.Tech",
          });

          // Only fetch certificates if we have user details
          await fetchUploadedFiles();
        } else {
          // Show specific error message if available
          const errorMessage = result.message || "Failed to fetch user details";
          console.error("Error in user details:", errorMessage);

          // If it's an authentication issue, redirect to login
          if (
            errorMessage.includes("not found") ||
            errorMessage.includes("log in") ||
            errorMessage.includes("session")
          ) {
            ShowMessagePopup(false, errorMessage, "/StudentLoginPage");
          } else {
            ShowMessagePopup(false, errorMessage, "");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        ShowMessagePopup(
          false,
          "Failed to fetch user details. Please try again or log in again.",
          "/StudentLoginPage"
        );
      }
    };

    getuser();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const result = await CallingAxios(GetCertificates());
      console.log("GetCertificates result:", result);

      if (result.status === "Success") {
        setUploadedFiles(result.certificates);
      } else {
        // Show specific error message if available
        const errorMessage = result.message || "Error fetching certificates";
        console.error("Error fetching certificates:", errorMessage);
        ShowMessagePopup(false, errorMessage, "");
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      ShowMessagePopup(
        false,
        "Failed to fetch certificates. Please try again.",
        ""
      );
    }
  };

  const validateFile = (file: File, type: string): boolean => {
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      ShowMessagePopup(false, "Only JPG/PNG images are allowed", "");
      return false;
    }
    if (file.size > 1048576) {
      ShowMessagePopup(false, "File size exceeds 1MB limit", "");
      return false;
    }
    return true;
  };

  const getAllowedFiles = (): string[] => {
    const allowedFiles = ["Photo", "Signature", "10th", "Inter"];
    const hasPhoto = uploadedFiles["photo"];
    const hasSignature = uploadedFiles["signature"];

    if (studentDetails.programme === "Undergraduation") {
      allowedFiles.push("Diploma");
    } else if (studentDetails.programme === "Postgraduation") {
      allowedFiles.push("Diploma", "Ug1", "Ug2");
    } else if (studentDetails.programme === "PHD") {
      allowedFiles.push("Diploma", "Ug1", "Ug2", "Pg1", "Pg2");
    }

    // If both Photo and Signature are uploaded, return all allowed files
    if (hasPhoto && hasSignature) {
      return allowedFiles;
    }
    // Otherwise, only return Photo and Signature
    return allowedFiles.filter(
      (file) => file === "Photo" || file === "Signature"
    );
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      event.target.files &&
      event.target.files.length > 0 &&
      selectedFileType
    ) {
      const file = event.target.files[0];
      if (!validateFile(file, selectedFileType)) return;

      try {
        const result = await CallingAxios(
          UploadCertificate(selectedFileType.toLowerCase(), file)
        );

        if (result.status === "Success") {
          ShowMessagePopup(
            true,
            `${selectedFileType} uploaded successfully!`,
            ""
          );
          fetchUploadedFiles();
          setSelectedFileType("");
        } else {
          ShowMessagePopup(false, result.message || "Error uploading file", "");
        }
      } catch (error) {
        console.error("Upload error:", error);
        ShowMessagePopup(false, "Error uploading file", "");
      }
    }
  };

  const handleFileEdit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.files &&
      event.target.files.length > 0 &&
      editingIndex !== null
    ) {
      const file = event.target.files[0];
      if (!validateFile(file, editingIndex)) return;

      try {
        const result = await CallingAxios(
          UpdateCertificate(editingIndex.toLowerCase(), file)
        );

        if (result.status === "Success") {
          ShowMessagePopup(true, `${editingIndex} updated successfully!`, "");
          fetchUploadedFiles();
          setEditingIndex(null);
        } else {
          ShowMessagePopup(false, result.message || "Error updating file", "");
        }
      } catch (error) {
        console.error("Update error:", error);
        ShowMessagePopup(false, "Error updating file", "");
      }
    }
  };

  const handleDelete = async (fileType: string) => {
    try {
      const result = await CallingAxios(
        DeleteCertificate(fileType.toLowerCase())
      );

      if (result.status === "Success") {
        ShowMessagePopup(true, `${fileType} deleted successfully!`, "");
        fetchUploadedFiles();
      } else {
        ShowMessagePopup(false, result.message || "Error deleting file", "");
      }
    } catch (error) {
      console.error("Delete error:", error);
      ShowMessagePopup(false, "Error deleting file", "");
    }
  };

  const handleEdit = (fileType: string) => {
    setEditingIndex(fileType);
    if (editInputRef.current) {
      editInputRef.current.click();
    }
  };

  // Helper function to get the user's email from localStorage
  const getUserEmail = (): string | null => {
    try {
      const loginDetailsStr = localStorage.getItem("LoginDetails");
      if (!loginDetailsStr) {
        console.error("No login details found in localStorage");
        return null;
      }

      const loginDetails = JSON.parse(loginDetailsStr);
      const email = loginDetails.loginEmail || loginDetails.email || "";

      if (!email) {
        console.error("No email found in login details", loginDetails);
        return null;
      }

      return email;
    } catch (e) {
      console.error("Error extracting email from localStorage:", e);
      return null;
    }
  };

  const handleViewFile = async (fileType: string) => {
    try {
      // Get email from local storage
      const email = getUserEmail();
      if (!email) {
        ShowMessagePopup(false, "User email not found", "");
        return;
      }

      // For direct file download/viewing, we'll use the axios instance directly
      const response = await instance.get(
        `/v1/student/certificates/${fileType.toLowerCase()}?email=${email}`,
        {
          responseType: "blob",
        }
      );

      const data = response.data;
      const fileURL = URL.createObjectURL(data);
      window.open(fileURL, "_blank");

      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(fileURL), 3000);
    } catch (error) {
      console.error("View error:", error);
      ShowMessagePopup(false, "Error viewing file", "");
    }
  };

  const handleDownloadFile = async (fileType: string) => {
    try {
      // Get email from local storage
      const email = getUserEmail();
      if (!email) {
        ShowMessagePopup(false, "User email not found", "");
        return;
      }

      // For direct file download/viewing, we'll use the axios instance directly
      const response = await instance.get(
        `/v1/student/certificates/${fileType.toLowerCase()}?email=${email}`,
        {
          responseType: "blob",
        }
      );

      const data = response.data;
      const fileURL = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = `${fileType}.jpg`;
      a.click();

      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(fileURL), 3000);
    } catch (error) {
      console.error("Download error:", error);
      ShowMessagePopup(false, "Error downloading file", "");
    }
  };

  return (
    <div className="container my-4 vh-100">
      {/* Student Details Section */}
      <h3 className="mb-3">Student Details</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-control-plaintext mb-3">
            <strong>Name:</strong> {studentDetails.name}
          </div>
          <div className="form-control-plaintext mb-3">
            <strong>Branch:</strong> {studentDetails.branch}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-control-plaintext mb-3">
            <strong>Phone:</strong> {studentDetails.phone}
          </div>
          <div className="form-control-plaintext">
            <strong>Programme:</strong> {studentDetails.programme}
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <h3 className="mb-3">Photo, Signature, & Certificates Uploads</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <select
            className="form-control"
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
          >
            <option value="">Select File Type</option>
            {getAllowedFiles()
              .filter((option) => !uploadedFiles[option.toLowerCase()])
              .map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>
      </div>

      {!uploadedFiles["photo"] || !uploadedFiles["signature"] ? (
        <div className="alert alert-warning mt-3">
          Please upload both <strong>Photo</strong> and{" "}
          <strong>Signature</strong> before uploading other files.
        </div>
      ) : null}

      {selectedFileType && (
        <div className="row mb-3">
          <div className="col-md-6 d-flex align-items-center">
            <strong className="me-3">
              {selectedFileType} (.jpg, .png, 1MB)
            </strong>
            <label className="btn btn-danger d-flex align-items-center mb-0">
              <FaUpload className="me-2" />
              Upload
              <input
                type="file"
                accept="image/jpeg, image/png"
                className="d-none"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
      )}

      {Object.keys(uploadedFiles).length > 0 && (
        <div className="row">
          <div className="col-md-8">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>File Type</th>
                  <th>File Name</th>
                  <th style={{ width: "200px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fileOptionsOrder.map((fileType) =>
                  uploadedFiles[fileType.toLowerCase()] ? (
                    <tr key={fileType.toLowerCase()}>
                      <td>{fileType.toLowerCase()}</td>
                      <td>
                        {uploadedFiles[fileType.toLowerCase()].originalName}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleViewFile(fileType.toLowerCase())}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(fileType.toLowerCase())}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-2"
                          onClick={() => handleDelete(fileType.toLowerCase())}
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            handleDownloadFile(fileType.toLowerCase())
                          }
                        >
                          <FaDownload />
                        </button>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hidden file input for editing/reupload */}
      <input
        type="file"
        style={{ display: "none" }}
        ref={editInputRef}
        onChange={handleFileEdit}
        accept="image/jpeg, image/png"
      />
    </div>
  );
};

export default FileUploadComponent;
