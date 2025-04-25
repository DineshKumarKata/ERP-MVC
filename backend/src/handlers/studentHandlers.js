const StudentService = require("../services/studentService");
const {createToken} = require('../middleware/authorizationFilter');
const jwt = require('jsonwebtoken');
const fs = require('fs');

class StudentHandler {

    constructor(){
        this.studentService = new StudentService();
    }

    studentRegistration = async (req, res) => {
        let requestData = req.body;
        console.log("StudentHandler - Insdie of studentRegistration");
        try {
             if (!requestData || !requestData.email || !requestData.category || !requestData.country
                || !requestData.course || !requestData.firstName || !requestData.course || !requestData.dob
                || !requestData.lastName || !requestData.mobile || !requestData.specialization || !requestData.program) {
                console.log("StudentHandler - End of studentRegistration");
                return res.status(400).send(
                {
                    status: "Failure",
                    message: "Bad Request",
                    code: "400",
                });
            }
        
            let response = await this.studentService.studentRegistration(requestData);
            console.log("StudentHandler - End of studentRegistration");
            res.status(200).send(
                {
                    status:"Success", 
                    message: "Student Registration completed Successfully.",
                    code: "200",
                    data: response
                }
            );
            return;
        } catch (error) {
            console.error("StudentHandler - End of studentRegistration || Error :", error);
            res.status(501).send(
                {
                    status: "Failure",
                    message: error.message ? error.message : "Internal Server Issue. Please try after sometime."
                }
            );
            return;
        }
    }


    loginUser = async (req, res) => {
        let requestData = req.body;
        console.log("StudentHandler - Inside of loginUser");
        try {
            // Validate request data
            if (!requestData || !requestData.email || !requestData.password) {
                console.log("StudentHandler - End of loginUser - Bad Request");
                return res.status(400).send({
                    status: "Failure",
                    message: "Bad Request - Email and password are required",
                    code: "400",
                });
            }
            
            // Attempt to log in the user
            let response = await this.studentService.loginUser(requestData);
            
            // Create a JWT token for the user
            try {
                const tokenResponse = await createToken(response);
                response["token"] = tokenResponse;
                
                console.log("StudentHandler - End of loginUser - Success");
                return res.status(200).send({
                    status: "Success", 
                    message: "User logged in successfully.",
                    code: "200",
                    data: response
                });
            } catch (tokenError) {
                console.error("StudentHandler - Token creation error:", tokenError);
                return res.status(500).send({
                    status: "Failure",
                    message: "Error creating authentication token. Please try again."
                });
            }
        } catch (error) {
            console.error("StudentHandler - End of loginUser || Error:", error);
            
            // Determine appropriate status code based on error
            const statusCode = error.message.includes("Invalid Credentials") ? 401 : 500;
            
            return res.status(statusCode).send({
                status: "Failure",
                message: error.message || "Internal Server Issue. Please try again later."
            });
        }
    }

    
    refreshToken = async(req,res)=>{
		try{
			let tokenHeader = req.headers['authorization']
			if (tokenHeader) {
				let token = await tokenHeader.split(" ");
	
				let decoded = jwt.decode(token[1], process.env.JWT_SECRET);
				console.log(" decoded :: ", decoded);
				if (decoded) {
					let currentTime = (new Date().getTime())/1000;
	
					let expiredVal = decoded.exp;
					const expiresIn = parseInt(process.env.JWT_RESET_EXP_IN.replace("m",""));
					expiredVal = expiredVal+expiresIn*60;
					if(expiredVal < currentTime)
						return res.status(400).send({ status: "Failure", message: 'Token Validity Expired.' });
					else
					{
						delete decoded.exp;
						delete decoded.iat;
						const token = await createToken(decoded);
						return res.status(200).send(
						{	status:"Sucess",
							data:token
						});
					}
				}else {
					return res.status(400).send({ status: "Failure", message: 'Unauthorized Token' })
				}
			}else{
				return res.status(400).send({ status: "Failure", message: 'Unauthorized Access' })
			}
	
		}catch(ex){
			return res.status(500).send({
				status: "Failure",
				message: ex.message
			});
		}
	}

    setStudentPassword = async (req, res) => {
        let requestData = req.body;
        console.log("StudentHandler - Inside of setStudentPassword");
        try {
            if (!requestData || !requestData.email || !requestData.token || !requestData.password) {
                console.log("StudentHandler - End of setStudentPassword - Bad Request");
                return res.status(400).send({
                    status: "Failure",
                    message: "Bad Request - Missing required fields",
                    code: "400",
                });
            }
            
            let response = await this.studentService.setStudentPassword(requestData);
            console.log("StudentHandler - End of setStudentPassword");
            res.status(200).send({
                status: "Success", 
                message: "Password set successfully",
                code: "200",
                data: { email: requestData.email }
            });
            return;
        } catch (error) {
            console.error("StudentHandler - End of setStudentPassword || Error:", error);
            res.status(501).send({
                status: "Failure",
                message: error.message ? error.message : "Internal Server Issue. Please try after sometime."
            });
            return;
        }
    }

    internationalStudentRegistration = async (req, res) => {
        let requestData = req.body;
        console.log("StudentHandler - Inside of internationalStudentRegistration");
        try {
            // Validate required fields based on InternationalStudentInfo schema
            if (!requestData || !requestData.email || !requestData.studentName || 
                !requestData.studentPhone || !requestData.fatherName || !requestData.fatherPhone || 
                !requestData.motherName || !requestData.motherPhone || !requestData.currentCountry || 
                !requestData.religion || !requestData.studentHeight || !requestData.address || 
                !requestData.permanentCountry || !requestData.passportNumber || !requestData.visaNumber ||
                !requestData.studentMoles || !requestData.bloodGroup || !requestData.visaIssuedCountry || 
                !requestData.visaIssuedPlace) {
                
                console.log("StudentHandler - End of internationalStudentRegistration - Missing fields");
                return res.status(400).send({
                    status: "Failure",
                    message: "Bad Request - Missing required fields",
                    code: "400"
                });
            }
            
            // Process the registration
            let response = await this.studentService.internationalStudentRegistration(requestData);
            
            console.log("StudentHandler - End of internationalStudentRegistration - Success");
            return res.status(200).send({
                status: "Success",
                message: "International Student Registration completed successfully. Data stored exclusively in the dedicated international students collection.",
                code: "200",
                data: response
            });
        } catch (error) {
            console.error("StudentHandler - End of internationalStudentRegistration || Error:", error);
            
            // Determine appropriate status code based on error message
            let statusCode = 500;
            if (error.message.includes("already exists")) {
                statusCode = 409; // Conflict - resource already exists
            } else if (error.message.includes("Validation failed")) {
                statusCode = 400; // Bad Request - validation error
            }
            
            return res.status(statusCode).send({
                status: "Failure",
                message: error.message || "Internal Server Issue. Please try after sometime.",
                code: statusCode.toString()
            });
        }
    }

    getInternationalStudentDetails = async (req, res) => {
        console.log("StudentHandler - Inside of getInternationalStudentDetails");
        try {
            // Get query parameters
            const { applicationId, email } = req.query;
            
            if (!applicationId && !email) {
                console.log("StudentHandler - End of getInternationalStudentDetails - Missing parameters");
                return res.status(400).send({
                    status: "Failure",
                    message: "Bad Request - Either applicationId or email is required",
                    code: "400"
                });
            }
            
            // Get student details
            let studentDetails = await this.studentService.getInternationalStudentDetails({
                applicationId,
                email
            });
            
            if (!studentDetails) {
                console.log("StudentHandler - End of getInternationalStudentDetails - Student not found");
                return res.status(404).send({
                    status: "Failure",
                    message: "International student not found",
                    code: "404"
                });
            }
            
            console.log("StudentHandler - End of getInternationalStudentDetails - Success");
            return res.status(200).send({
                status: "Success",
                message: "International student details retrieved successfully",
                code: "200",
                data: studentDetails
            });
        } catch (error) {
            console.error("StudentHandler - End of getInternationalStudentDetails || Error:", error);
            return res.status(500).send({
                status: "Failure",
                message: error.message || "Internal Server Issue. Please try after sometime.",
                code: "500"
            });
        }
    }

    /**
     * Gets all certificates for a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} Response with certificates data
     */
    async getCertificates(req, res) {
        try {
            // Use email from query parameters or decoded JWT
            const email = req.query.email || (req.decoded ? req.decoded.email : null);
            
            if (!email) {
                return res.status(400).send({ status: "Failure", message: "Email is required as a query parameter" });
            }
            
            const result = await this.studentService.getCertificates(email);
            if (result.status === "Failure") {
                return res.status(500).send(result);
            }
            
            return res.status(200).send(result);
        } catch (error) {
            console.error('Error in getCertificates handler:', error);
            return res.status(500).send({ status: "Failure", message: "Internal server error" });
        }
    }

    /**
     * Upload a certificate for a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} Response with upload status
     */
    async uploadCertificate(req, res) {
        try {
            // Use email from query parameters or decoded JWT
            const email = req.query.email || (req.decoded ? req.decoded.email : null);
            const { type } = req.params;
            
            console.log("Certificate upload request received for email:", email, "type:", type);
            console.log("Request body:", req.body);
            console.log("Request files:", req.files);
            
            if (!email) {
                return res.status(400).send({ status: "Failure", message: "Email is required as a query parameter" });
            }
            
            if (!type) {
                return res.status(400).send({ status: "Failure", message: "Certificate type is required" });
            }
            
            // Check if a file was uploaded (format depends on middleware)
            let file;
            
            if (req.files && req.files.file) {
                // express-form-data format
                file = req.files.file;
                console.log("File found in req.files.file:", { 
                    originalname: file.originalFilename || file.name,
                    size: file.size,
                    type: file.type,
                    path: file.path
                });
            } else if (req.file) {
                // multer format
                file = req.file;
                console.log("File found in req.file:", { 
                    originalname: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype
                });
            } else {
                console.error("No file found in request:", {
                    hasFiles: !!req.files,
                    hasFile: !!req.file,
                    bodyKeys: Object.keys(req.body)
                });
                return res.status(400).send({ status: "Failure", message: "No file uploaded" });
            }
            
            // Prepare file data for service
            const fileData = {
                originalname: file.originalFilename || file.originalname || file.name,
                size: file.size,
                type: file.type || file.mimetype,
                buffer: file.buffer || fs.readFileSync(file.path)
            };
            
            // Validate file type
            if (!fileData.type.match(/image\/(jpeg|jpg|png)/)) {
                return res.status(400).send({ 
                    status: "Failure", 
                    message: "Only JPG/PNG images are allowed",
                    fileType: fileData.type
                });
            }
            
            // Validate file size (1MB)
            if (fileData.size > 1048576) {
                return res.status(400).send({ 
                    status: "Failure", 
                    message: "File size exceeds 1MB limit",
                    fileSize: fileData.size
                });
            }
            
            const result = await this.studentService.uploadCertificate(email, type, fileData);
            
            if (result.status === "Failure") {
                return res.status(500).send(result);
            }
            
            return res.status(200).send(result);
        } catch (error) {
            console.error('Error in uploadCertificate handler:', error);
            return res.status(500).send({ 
                status: "Failure", 
                message: "Internal server error: " + (error.message || "Unknown error")
            });
        }
    }

    /**
     * Updates an existing certificate for a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} Response with update status
     */
    async updateCertificate(req, res) {
        try {
            // Use email from query parameters or decoded JWT
            const email = req.query.email || (req.decoded ? req.decoded.email : null);
            const { type } = req.params;
            
            console.log("Certificate update request received for email:", email, "type:", type);
            console.log("Request body:", req.body);
            console.log("Request files:", req.files);
            
            if (!email) {
                return res.status(400).send({ status: "Failure", message: "Email is required as a query parameter" });
            }
            
            if (!type) {
                return res.status(400).send({ status: "Failure", message: "Certificate type is required" });
            }
            
            // Check if a file was uploaded (format depends on middleware)
            let file;
            
            if (req.files && req.files.file) {
                // express-form-data format
                file = req.files.file;
                console.log("File found in req.files.file:", { 
                    originalname: file.originalFilename || file.name,
                    size: file.size,
                    type: file.type,
                    path: file.path
                });
            } else if (req.file) {
                // multer format
                file = req.file;
                console.log("File found in req.file:", { 
                    originalname: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype
                });
            } else {
                console.error("No file found in request:", {
                    hasFiles: !!req.files,
                    hasFile: !!req.file,
                    bodyKeys: Object.keys(req.body)
                });
                return res.status(400).send({ status: "Failure", message: "No file uploaded" });
            }
            
            // Prepare file data for service
            const fileData = {
                originalname: file.originalFilename || file.originalname || file.name,
                size: file.size,
                type: file.type || file.mimetype,
                buffer: file.buffer || fs.readFileSync(file.path)
            };
            
            // Validate file type
            if (!fileData.type.match(/image\/(jpeg|jpg|png)/)) {
                return res.status(400).send({ 
                    status: "Failure", 
                    message: "Only JPG/PNG images are allowed",
                    fileType: fileData.type
                });
            }
            
            // Validate file size (1MB)
            if (fileData.size > 1048576) {
                return res.status(400).send({ 
                    status: "Failure", 
                    message: "File size exceeds 1MB limit",
                    fileSize: fileData.size
                });
            }
            
            // Use the same service method for updates (it handles both create and update)
            const result = await this.studentService.uploadCertificate(email, type, fileData);
            
            if (result.status === "Failure") {
                return res.status(500).send(result);
            }
            
            return res.status(200).send(result);
        } catch (error) {
            console.error('Error in updateCertificate handler:', error);
            return res.status(500).send({ 
                status: "Failure", 
                message: "Internal server error: " + (error.message || "Unknown error")
            });
        }
    }

    /**
     * Gets a specific certificate for a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} Response with certificate data
     */
    async getCertificate(req, res) {
        try {
            // Use email from query parameters or decoded JWT
            const email = req.query.email || (req.decoded ? req.decoded.email : null);
            const { type } = req.params;
            
            if (!email) {
                return res.status(400).send({ status: "Failure", message: "Email is required as a query parameter" });
            }
            
            if (!type) {
                return res.status(400).send({ status: "Failure", message: "Certificate type is required" });
            }
            
            const result = await this.studentService.getCertificate(email, type);
            
            if (result.status === "Failure") {
                return res.status(404).send(result);
            }
            
            // Set content type for image
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Disposition', `inline; filename="${result.originalName}"`);
            
            // Send the file buffer
            return res.send(result.file);
        } catch (error) {
            console.error('Error in getCertificate handler:', error);
            return res.status(500).send({ status: "Failure", message: "Internal server error" });
        }
    }

    /**
     * Deletes a certificate for a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} Response with deletion status
     */
    async deleteCertificate(req, res) {
        try {
            // Use email from query parameters or decoded JWT
            const email = req.query.email || (req.decoded ? req.decoded.email : null);
            const { type } = req.params;
            
            if (!email) {
                return res.status(400).send({ status: "Failure", message: "Email is required as a query parameter" });
            }
            
            if (!type) {
                return res.status(400).send({ status: "Failure", message: "Certificate type is required" });
            }
            
            const result = await this.studentService.deleteCertificate(email, type);
            
            if (result.status === "Failure") {
                return res.status(404).send(result);
            }
            
            return res.status(200).send(result);
        } catch (error) {
            console.error('Error in deleteCertificate handler:', error);
            return res.status(500).send({ status: "Failure", message: "Internal server error" });
        }
    }

    /**
     * Gets user details 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} Response with user details
     */
    async getUserDetails(req, res) {
        try {
            // Use email from query parameters or decoded JWT
            const email = req.query.email || (req.decoded ? req.decoded.email : null);
            
            if (!email) {
                console.error("Missing email parameter in request", req.query);
                return res.status(400).send({ 
                    status: "Failure", 
                    message: "Email parameter is required",
                    debug: {
                        query: req.query,
                        decoded: req.decoded || null
                    }
                });
            }
            
            // Get user details from the database
            const result = await this.studentService.getUserDetailsByEmail(email);
            
            if (result.status === "Failure") {
                return res.status(404).send(result);
            }
            
            return res.status(200).send(result);
        } catch (error) {
            console.error('Error in getUserDetails handler:', error);
            return res.status(500).send({ 
                status: "Failure", 
                message: "Internal server error: " + (error.message || "Unknown error") 
            });
        }
    }

}

module.exports = StudentHandler;