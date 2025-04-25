const StudentDAO = require("../dao/studentDAO");
const UserDAO = require("../dao/userDAO");
const RoleDAO = require("../dao/roleDAO");
const CryptoJs = require('crypto-js');
const ObjectId = require('mongodb').ObjectId;

class StudentService {

    constructor(){
        this.studentDAO = new StudentDAO();
        this.userDAO = new UserDAO();
        this.roleDAO = new RoleDAO();
    }

    studentRegistration = async (requestData) => {
        try {
            console.log("StudentService - Insdie of studentRegistration");
            let resultList = await this.studentDAO.getOneDataByFilters({"email":requestData.email});
            if(resultList && resultList.length>0){
                console.log("StudentService - End of studentRegistration");
                throw new Error("User already exists");
            }
            
            let studentResponse = await this.studentDAO.create(requestData);
            const encryptedPassword = CryptoJs.MD5("Vignan@123").toString().toUpperCase();
            let userData = {
                roleId: new ObjectId("67e40ce05396d91ddfedeb45"),
                firstName: requestData.firstName,
                lastName: requestData.lastName,
                displayName: requestData.firstName+" "+requestData.lastName, 
                profilePic: "", 
                email: requestData.email, 
                password: encryptedPassword, 
                mobile: requestData.mobile,
                createdBy: studentResponse._id
            }
            let userResponse = await this.userDAO.create(userData);
            
            console.log("StudentService - End of studentRegistration");
            if(studentResponse && userResponse)
                return studentResponse
            else{
                throw new Error("Internal Server Error. Please try again.");
            }
        } catch (error) {
            console.error("StudentService - End of studentRegistration || Error :", error);
            throw error;
        }
    }

    loginUser = async (requestData) => {
        console.log("StudentService - Inside of loginUser");
        try {
            // Encrypt the password for database comparison
            const encryptedPassword = CryptoJs.MD5(requestData.password).toString().toUpperCase();
            console.log("Looking for user with email:", requestData.email);
            
            // Find user with matching email and password
            let userDataResponseList = await this.userDAO.getDataByFilters({
                "email": requestData.email, 
                password: encryptedPassword
            });
            
            // Check if user exists with these credentials
            if (!userDataResponseList || userDataResponseList.length == 0) {
                console.log("StudentService - User not found or invalid password");
                throw new Error("Invalid Credentials.");
            } else {
                let userDataResponse = userDataResponseList[0];
                
                // Get user role information
                let roleResponse = await this.roleDAO.getDataByFilters({_id: userDataResponse.roleId});
                if (!roleResponse) {
                    console.log("StudentService - Role not found for user");
                    throw new Error("User role configuration error. Please contact administrator.");
                }
                
                // Create token data
                let userTokenData = {
                    userId: userDataResponse._id,
                    loginEmail: userDataResponse.email,
                    loginName: userDataResponse.firstName + " " + userDataResponse.lastName,
                    loginMobile: userDataResponse.mobile,
                    role: roleResponse.roleName
                };
                
                console.log("StudentService - End of loginUser - Success");
                return userTokenData;
            }            
        } catch (error) {
            console.error("StudentService - End of loginUser || Error:", error);
            throw error;
        }
    }

    setStudentPassword = async (requestData) => {
        console.log("StudentService - Inside of setStudentPassword");
        try {
            // 1. Verify email exists
            let userList = await this.userDAO.getDataByFilters({ "email": requestData.email });
            if (!userList || userList.length === 0) {
                console.log("StudentService - End of setStudentPassword - User not found");
                throw new Error("User not found. Please check the email address.");
            }
            
            // 2. Verify token (in a real app, we would validate a token from email)
            // For demo purposes, we'll assume the token is valid if it matches a simple pattern
            // In production, you would verify against a stored token in the database
            if (requestData.token !== "setup_token") { // This is just for demo - you should replace with actual token validation
                console.log("StudentService - End of setStudentPassword - Invalid token");
                throw new Error("Invalid or expired token.");
            }
            
            // 3. Set the new password
            const encryptedPassword = CryptoJs.MD5(requestData.password).toString().toUpperCase();
            
            // 4. Update the user record
            const updateResult = await this.userDAO.updateOneData(
                { "email": requestData.email },
                { $set: { password: encryptedPassword } }
            );
            
            if (!updateResult || updateResult.modifiedCount !== 1) {
                console.log("StudentService - End of setStudentPassword - Password update failed");
                throw new Error("Failed to update password. Please try again.");
            }
            
            console.log("StudentService - End of setStudentPassword - Success");
            return { success: true };
        } catch (error) {
            console.error("StudentService - End of setStudentPassword || Error:", error);
            throw error;
        }
    }

    internationalStudentRegistration = async (requestData) => {
        try {
            console.log("StudentService - Inside of internationalStudentRegistration");
            
            // Check if email already exists in internationalStudents collection
            let existingInternationalStudent = null;
            try {
                // Use mongoose methods directly on the model for checking in the specific collection
                const InternationalStudentModel = require('../models/InternationalStudentInfo');
                existingInternationalStudent = await InternationalStudentModel.findOne({ email: requestData.email });
            } catch (err) {
                console.log("Error checking internationalStudents collection:", err);
            }
            
            if (existingInternationalStudent) {
                console.log("StudentService - International student with this email already exists");
                throw new Error("An international student with this email already exists");
            }
            
            // Add metadata to the request data
            requestData.isInternational = true;
            requestData.registrationDate = new Date();
            requestData.status = 'Pending';
            requestData.applicationId = 'INT-' + Math.floor(100000 + Math.random() * 900000);
            
            // Create student record in the separate internationalStudents collection only
            console.log("Saving international student to dedicated 'internationalStudents' collection");
            let studentResponse = await this.studentDAO.createInternationalStudent(requestData);
            console.log("International Student saved successfully in internationalStudents collection:", studentResponse._id);
            
            console.log("StudentService - End of internationalStudentRegistration - Success");
            
            // Return complete response with all student details for frontend
            return {
                _id: studentResponse._id,
                email: studentResponse.email,
                studentName: studentResponse.studentName,
                studentPhone: studentResponse.studentPhone,
                fatherName: studentResponse.fatherName,
                fatherPhone: studentResponse.fatherPhone,
                motherName: studentResponse.motherName,
                motherPhone: studentResponse.motherPhone,
                currentCountry: studentResponse.currentCountry,
                religion: studentResponse.religion,
                studentHeight: studentResponse.studentHeight,
                address: studentResponse.address,
                permanentCountry: studentResponse.permanentCountry,
                passportNumber: studentResponse.passportNumber,
                visaNumber: studentResponse.visaNumber,
                studentMoles: studentResponse.studentMoles,
                bloodGroup: studentResponse.bloodGroup,
                visaIssuedCountry: studentResponse.visaIssuedCountry,
                visaIssuedPlace: studentResponse.visaIssuedPlace,
                registrationDate: studentResponse.registrationDate,
                applicationId: studentResponse.applicationId,
                status: studentResponse.status || 'Pending',
                collection: "internationalStudents",
                message: "International student registration successful"
            };
        } catch (error) {
            console.error("StudentService - End of internationalStudentRegistration || Error:", error);
            throw error;
        }
    }

    getInternationalStudentDetails = async (params) => {
        try {
            console.log("StudentService - Inside of getInternationalStudentDetails");
            
            // Check if we have email in params
            if (params.email) {
                // Use the DAO method to get the international student by email
                const studentData = await this.studentDAO.getInternationalStudentByEmail(params.email);
                if (!studentData) {
                    console.log("StudentService - End of getInternationalStudentDetails - Student not found with email:", params.email);
                    return null;
                }
                
                console.log("StudentService - End of getInternationalStudentDetails - Success");
                return studentData.toObject();
            }
            
            // Check if we have applicationId in params
            if (params.applicationId) {
                // Create filter based on applicationId
                const filter = { applicationId: params.applicationId };
                
                // Use the mongoose model directly for query with applicationId
                const InternationalStudentModel = require('../models/InternationalStudentInfo');
                const studentData = await InternationalStudentModel.findOne(filter);
                
                if (!studentData) {
                    console.log("StudentService - End of getInternationalStudentDetails - Student not found with applicationId:", params.applicationId);
                    return null;
                }
                
                console.log("StudentService - End of getInternationalStudentDetails - Success");
                return studentData.toObject();
            }
            
            // If we reach here, we don't have either email or applicationId
            throw new Error("No search criteria provided");
        } catch (error) {
            console.error("StudentService - End of getInternationalStudentDetails || Error:", error);
            throw error;
        }
    }

    /**
     * Get user details by email
     * @param {string} email - Student email
     * @returns {Promise<Object>} Result object with user details
     */
    getUserDetailsByEmail = async (email) => {
        console.log("StudentService - Inside getUserDetailsByEmail for email:", email);
        try {
            // First, check for users in the regular users collection
            const users = await this.userDAO.getDataByFilters({ "email": email });
            
            // If found in users collection, return the user details
            if (users && users.length > 0) {
                const user = users[0];
                console.log("StudentService - User found in users collection:", user._id);
                
                // Try to get additional student data
                let studentData = null;
                try {
                    studentData = await this.studentDAO.getOneDataByFilters({ "email": email });
                } catch (err) {
                    console.log("Error fetching student data:", err);
                    // Continue with user data only
                }
                
                // Return necessary user details without sensitive information
                return { 
                    status: "Success", 
                    data: {
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        specialization: studentData?.specialization || "",
                        mobile: user.mobile || "",
                        program: studentData?.program || "",
                        email: user.email
                    }
                };
            }
            
            // If not found in users collection, check international students collection
            console.log("StudentService - User not found in users collection, checking international students");
            const internationalStudent = await this.studentDAO.getInternationalStudentByEmail(email);
            
            if (internationalStudent) {
                console.log("StudentService - International student found:", internationalStudent._id);
                
                // Return international student details
                return {
                    status: "Success",
                    data: {
                        firstName: internationalStudent.studentName.split(' ')[0] || "",
                        lastName: internationalStudent.studentName.split(' ').slice(1).join(' ') || "",
                        specialization: "International Student",
                        mobile: internationalStudent.studentPhone || "",
                        program: "International",
                        email: internationalStudent.email
                    }
                };
            }
            
            // If not found in either collection
            console.log("StudentService - User not found in any collection for email:", email);
            return { 
                status: "Failure", 
                message: "User not found" 
            };
        } catch (error) {
            console.error('Error in getUserDetailsByEmail service:', error);
            return { 
                status: "Failure", 
                message: "Failed to get user details: " + error.message
            };
        }
    }

    /**
     * Upload or update a certificate for a student
     * @param {string} email - Student email
     * @param {string} type - Certificate type
     * @param {Object} fileData - File data
     * @returns {Promise<Object>} Result object
     */
    uploadCertificate = async (email, type, fileData) => {
        try {
            console.log("StudentService - Inside uploadCertificate for email:", email);
            
            // Check if this is a regular user
            const users = await this.userDAO.getDataByFilters({ "email": email });
            const isRegularUser = users && users.length > 0;
            
            // Check if this is an international student
            const internationalStudent = await this.studentDAO.getInternationalStudentByEmail(email);
            const isInternationalStudent = !!internationalStudent;
            
            // If neither, return an error
            if (!isRegularUser && !isInternationalStudent) {
                console.log("StudentService - User not found for email:", email);
                return { status: "Failure", message: "User not found" };
            }
            
            const result = await this.studentDAO.createOrUpdateCertificate(email, type, fileData);
            return { status: "Success", data: result };
        } catch (error) {
            console.error('Error in uploadCertificate service:', error);
            return { status: "Failure", message: "Failed to upload certificate" };
        }
    }

    /**
     * Get all certificates for a student
     * @param {string} email - Student email
     * @returns {Promise<Object>} Result object with certificates
     */
    getCertificates = async (email) => {
        try {
            console.log("StudentService - Inside getCertificates for email:", email);
            
            // Check if this is a regular user
            const users = await this.userDAO.getDataByFilters({ "email": email });
            const isRegularUser = users && users.length > 0;
            
            // Check if this is an international student
            const internationalStudent = await this.studentDAO.getInternationalStudentByEmail(email);
            const isInternationalStudent = !!internationalStudent;
            
            // If neither, return an error
            if (!isRegularUser && !isInternationalStudent) {
                console.log("StudentService - User not found for email:", email);
                return { status: "Failure", message: "User not found" };
            }
            
            // Get certificates from the certificates collection
            const certificates = await this.studentDAO.getCertificates(email);
            if (!certificates) {
                return { status: "Success", certificates: {} };
            }
            
            // Transform data for frontend
            const certificatesData = {};
            
            // List of certificate types to check
            const certificateTypes = ['photo', 'signature', '10th', 'inter', 'diploma', 'ug1', 'ug2', 'pg1', 'pg2'];
            
            certificateTypes.forEach(type => {
                if (certificates[type] && certificates[type].originalName) {
                    certificatesData[type] = {
                        originalName: certificates[type].originalName,
                        ref: certificates[type].ref
                    };
                }
            });
            
            return { status: "Success", certificates: certificatesData };
        } catch (error) {
            console.error('Error in getCertificates service:', error);
            return { status: "Failure", message: "Failed to get certificates: " + error.message };
        }
    }

    /**
     * Get a specific certificate
     * @param {string} email - Student email
     * @param {string} type - Certificate type
     * @returns {Promise<Object>} Result object with certificate data
     */
    getCertificate = async (email, type) => {
        try {
            console.log("StudentService - Inside getCertificate for email:", email);
            
            // Check if this is a regular user
            const users = await this.userDAO.getDataByFilters({ "email": email });
            const isRegularUser = users && users.length > 0;
            
            // Check if this is an international student
            const internationalStudent = await this.studentDAO.getInternationalStudentByEmail(email);
            const isInternationalStudent = !!internationalStudent;
            
            // If neither, return an error
            if (!isRegularUser && !isInternationalStudent) {
                console.log("StudentService - User not found for email:", email);
                return { status: "Failure", message: "User not found" };
            }
            
            const certificate = await this.studentDAO.getCertificate(email, type);
            if (!certificate) {
                return { status: "Failure", message: "Certificate not found" };
            }
            
            return { 
                status: "Success", 
                file: certificate.file,
                originalName: certificate.originalName
            };
        } catch (error) {
            console.error('Error in getCertificate service:', error);
            return { status: "Failure", message: "Failed to get certificate: " + error.message };
        }
    }

    /**
     * Delete a specific certificate
     * @param {string} email - Student email
     * @param {string} type - Certificate type
     * @returns {Promise<Object>} Result object
     */
    deleteCertificate = async (email, type) => {
        try {
            console.log("StudentService - Inside deleteCertificate for email:", email);
            
            // Check if this is a regular user
            const users = await this.userDAO.getDataByFilters({ "email": email });
            const isRegularUser = users && users.length > 0;
            
            // Check if this is an international student
            const internationalStudent = await this.studentDAO.getInternationalStudentByEmail(email);
            const isInternationalStudent = !!internationalStudent;
            
            // If neither, return an error
            if (!isRegularUser && !isInternationalStudent) {
                console.log("StudentService - User not found for email:", email);
                return { status: "Failure", message: "User not found" };
            }
            
            const success = await this.studentDAO.deleteCertificate(email, type);
            if (!success) {
                return { status: "Failure", message: "Certificate not found" };
            }
            
            return { status: "Success", message: "Certificate deleted successfully" };
        } catch (error) {
            console.error('Error in deleteCertificate service:', error);
            return { status: "Failure", message: "Failed to delete certificate: " + error.message };
        }
    }

}


module.exports = StudentService;