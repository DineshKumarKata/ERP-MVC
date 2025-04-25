const User = require('../models/User');
const InternationalStudentInfo = require('../models/InternationalStudentInfo');
const studentDAO = require('../dao/studentDAO');
const dao = new studentDAO();

class StudentService {
    internationalStudentRegistration = async (requestData) => {
        console.log("StudentService - Inside of internationalStudentRegistration");
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: requestData.email });
            if (!existingUser) {
                console.log("StudentService - End of internationalStudentRegistration - User not found");
                throw Error("User does not exist. Please register first.");
            }

            // Check if international student info already exists
            const existingInternationalInfo = await InternationalStudentInfo.findOne({ email: requestData.email });
            if (existingInternationalInfo) {
                console.log("StudentService - End of internationalStudentRegistration - Already registered");
                throw Error("International student info already registered for this email.");
            }

            // Create new international student info document
            const internationalStudentInfo = new InternationalStudentInfo({
                email: requestData.email,
                studentName: requestData.studentName,
                studentPhone: requestData.studentPhone,
                fatherName: requestData.fatherName,
                fatherPhone: requestData.fatherPhone,
                motherName: requestData.motherName,
                motherPhone: requestData.motherPhone,
                currentCountry: requestData.currentCountry,
                religion: requestData.religion,
                studentHeight: requestData.studentHeight,
                address: requestData.address,
                permanentCountry: requestData.permanentCountry,
                passportNumber: requestData.passportNumber,
                visaNumber: requestData.visaNumber,
                studentMoles: requestData.studentMoles,
                bloodGroup: requestData.bloodGroup,
                visaIssuedCountry: requestData.visaIssuedCountry,
                visaIssuedPlace: requestData.visaIssuedPlace
            });

            // Save the international student information
            await internationalStudentInfo.save();

            // Update user status if needed
            existingUser.registrationStatus = "INTERNATIONAL_REGISTERED";
            await existingUser.save();

            console.log("StudentService - End of internationalStudentRegistration - Success");
            return {
                message: "International student registration successful",
                email: requestData.email
            };
        } catch (error) {
            console.error("StudentService - End of internationalStudentRegistration || Error:", error);
            throw error;
        }
    }

    /**
     * Upload or update a certificate for a student
     * @param {string} email - Student email
     * @param {string} type - Certificate type
     * @param {Object} fileData - File data
     * @returns {Promise<Object>} Result object
     */
    async uploadCertificate(email, type, fileData) {
        try {
            const result = await dao.createOrUpdateCertificate(email, type, fileData);
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
    async getCertificates(email) {
        try {
            const certificates = await dao.getCertificates(email);
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
            return { status: "Failure", message: "Failed to get certificates" };
        }
    }

    /**
     * Get a specific certificate
     * @param {string} email - Student email
     * @param {string} type - Certificate type
     * @returns {Promise<Object>} Result object with certificate data
     */
    async getCertificate(email, type) {
        try {
            const certificate = await dao.getCertificate(email, type);
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
            return { status: "Failure", message: "Failed to get certificate" };
        }
    }

    /**
     * Delete a specific certificate
     * @param {string} email - Student email
     * @param {string} type - Certificate type
     * @returns {Promise<Object>} Result object
     */
    async deleteCertificate(email, type) {
        try {
            const success = await dao.deleteCertificate(email, type);
            if (!success) {
                return { status: "Failure", message: "Certificate not found" };
            }
            
            return { status: "Success", message: "Certificate deleted successfully" };
        } catch (error) {
            console.error('Error in deleteCertificate service:', error);
            return { status: "Failure", message: "Failed to delete certificate" };
        }
    }

    /**
     * Get user details by email
     * @param {string} email - Student email
     * @returns {Promise<Object>} Result object with user details
     */
    async getUserDetailsByEmail(email) {
        try {
            const user = await dao.getUserByEmail(email);
            
            if (!user) {
                return { status: "Failure", message: "User not found" };
            }
            
            // Return necessary user details without sensitive information
            return { 
                status: "Success", 
                data: {
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    specialization: user.specialization || "",
                    mobile: user.mobile || "",
                    program: user.program || "",
                    email: user.email
                }
            };
        } catch (error) {
            console.error('Error in getUserDetailsByEmail service:', error);
            return { status: "Failure", message: "Failed to get user details" };
        }
    }
}

module.exports = new StudentService(); 