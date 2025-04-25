var StudentModel = require("../models/StudentModel");
var InternationalStudentModel = require("../models/InternationalStudentInfo");
const CertificateModel = require('../models/UserCertificates');
const FileModel = require('../models/FileModel');
const mongoose = require('mongoose');


class StudentDao { 

	create = async (studentData)=>{
        try {
            console.log("StudentDao - Inside of create") 
            const student = new StudentModel({  ...studentData });
            const persistanceData = await student.save();
            console.log("StudentDao - End of create") 
            return persistanceData;
        } catch (error) {
            console.error("StudentDao - create ||  Error : ", error.message);
            throw error;
        }
    }

    createInternationalStudent = async (studentData) => {
        try {
            console.log("StudentDao - Inside of createInternationalStudent");
            console.log("Saving international student data to 'internationalStudents' collection:", JSON.stringify(studentData));
            
            // Create a new instance of the international student model with the data
            const internationalStudent = new InternationalStudentModel({ ...studentData });
            
            // Validate the model before saving
            const validationError = internationalStudent.validateSync();
            if (validationError) {
                console.error("Validation error:", validationError);
                throw new Error(`Validation failed: ${JSON.stringify(validationError.errors)}`);
            }
            
            // Save to database in the internationalStudents collection
            const persistanceData = await internationalStudent.save();
            console.log("StudentDao - End of createInternationalStudent - Success");
            console.log("Saved international student with ID:", persistanceData._id, "in collection: internationalStudents");
            
            return persistanceData;
        } catch (error) {
            console.error("StudentDao - createInternationalStudent || Error : ", error.message);
            if (error.name === 'MongoServerError' && error.code === 11000) {
                // Duplicate key error (likely email already exists)
                throw new Error(`International student with this email already exists.`);
            }
            throw error;
        }
    }

    getDataByAggregateFilters = async (filters) => {
        try {
            console.log("StudentDao - Inside of getDataByFilters") 
            const documentsData = await StudentModel.aggregate([{$match:filters}])
            console.log("StudentDao - Inside of getDataByFilters") 
            return documentsData;
        } catch (error) {
            console.log("StudentDao - getDataByFilters || Error : ", error);
            throw error;
        }
    }

    getDataByFilters = async (filters) => {
        try {
            console.log("StudentDao - Inside of getDataByFilters") 
            const documentsData = await StudentModel.find(filters);
            console.log("StudentDao - Inside of getDataByFilters") 
            return documentsData;
        } catch (error) {
            console.log("StudentDao - getDataByFilters || Error : ", error);
            throw error;
        }
    }

    getOneDataByFilters = async (filters) => {
        try {
            console.log("StudentDao - Inside of getOneDataByFilters");
            const documentsData = await StudentModel.findOne(filters);
            console.log("StudentDao - Inside of getOneDataByFilters");
            return documentsData;
        } catch (error) {
            console.log("StudentDao - getOneDataByFilters || Error : ", error);
            throw error;
        }
    }

    /**
     * Creates or updates a certificate record for a student
     * @param {string} email - Student email
     * @param {string} type - Type of certificate (photo, signature, etc.)
     * @param {Object} fileData - File data object containing originalName and file buffer
     * @returns {Promise<Object>} Created/updated certificate record
     */
    async createOrUpdateCertificate(email, type, fileData) {
        try {
            // First store the file in the FileModel collection
            const fileDoc = new FileModel({
                file: fileData.buffer,
                size: fileData.size
            });
            
            const savedFile = await fileDoc.save();
            
            // Check if user already has a certificate record
            let certDoc = await CertificateModel.findOne({ email });
            
            if (!certDoc) {
                // Create new certificate record if doesn't exist
                certDoc = new CertificateModel({ email });
            }
            
            // Update the specific certificate type
            certDoc[type.toLowerCase()] = {
                originalName: fileData.originalname,
                ref: savedFile._id
            };
            
            await certDoc.save();
            return certDoc;
        } catch (error) {
            console.error('Error in createOrUpdateCertificate:', error);
            throw error;
        }
    }

    /**
     * Gets all certificates for a student
     * @param {string} email - Student email
     * @returns {Promise<Object>} Certificate information
     */
    async getCertificates(email) {
        try {
            const certDoc = await CertificateModel.findOne({ email });
            if (!certDoc) {
                return null;
            }
            return certDoc;
        } catch (error) {
            console.error('Error in getCertificates:', error);
            throw error;
        }
    }

    /**
     * Gets a specific certificate for a student
     * @param {string} email - Student email
     * @param {string} type - Certificate type
     * @returns {Promise<Buffer>} Certificate file buffer
     */
    async getCertificate(email, type) {
        try {
            const certDoc = await CertificateModel.findOne({ email });
            if (!certDoc || !certDoc[type.toLowerCase()] || !certDoc[type.toLowerCase()].ref) {
                return null;
            }
            
            const fileId = certDoc[type.toLowerCase()].ref;
            const fileDoc = await FileModel.findById(fileId);
            
            if (!fileDoc) {
                return null;
            }
            
            return {
                file: fileDoc.file,
                originalName: certDoc[type.toLowerCase()].originalName
            };
        } catch (error) {
            console.error('Error in getCertificate:', error);
            throw error;
        }
    }

    /**
     * Deletes a specific certificate for a student
     * @param {string} email - Student email
     * @param {string} type - Certificate type
     * @returns {Promise<boolean>} Success status
     */
    async deleteCertificate(email, type) {
        try {
            const certDoc = await CertificateModel.findOne({ email });
            if (!certDoc || !certDoc[type.toLowerCase()] || !certDoc[type.toLowerCase()].ref) {
                return false;
            }
            
            // Get the file reference
            const fileId = certDoc[type.toLowerCase()].ref;
            
            // Remove the certificate reference
            certDoc[type.toLowerCase()] = undefined;
            await certDoc.save();
            
            // Delete the file itself
            await FileModel.findByIdAndDelete(fileId);
            
            return true;
        } catch (error) {
            console.error('Error in deleteCertificate:', error);
            throw error;
        }
    }

    /**
     * Gets a user by email
     * @param {string} email - User email
     * @returns {Promise<Object>} User data
     */
    async getUserByEmail(email) {
        try {
            console.log("StudentDao - Inside of getUserByEmail");
            const user = await StudentModel.findOne({ email });
            console.log("StudentDao - End of getUserByEmail");
            return user;
        } catch (error) {
            console.error("StudentDao - getUserByEmail || Error:", error);
            throw error;
        }
    }

    /**
     * Gets an international student by email
     * @param {string} email - Student email
     * @returns {Promise<Object>} International student data
     */
    async getInternationalStudentByEmail(email) {
        try {
            console.log("StudentDao - Inside of getInternationalStudentByEmail");
            const InternationalStudentModel = require('../models/InternationalStudentInfo');
            const internationalStudent = await InternationalStudentModel.findOne({ email });
            console.log("StudentDao - End of getInternationalStudentByEmail");
            return internationalStudent;
        } catch (error) {
            console.error("StudentDao - getInternationalStudentByEmail || Error:", error);
            throw error;
        }
    }

};
module.exports = StudentDao;