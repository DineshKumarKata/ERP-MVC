const express = require("express");
const router = express.Router();

const {verifyjwt} = require('../middleware/authorizationFilter');
const handlers = require('../middleware/studentHandlerWrapper');

router.post('/studentRegistration', [handlers.studentRegistration]);
router.post('/internationalStudentRegistration', [handlers.internationalStudentRegistration]);
router.get('/getInternationalStudentDetails', [handlers.getInternationalStudentDetails]);
router.post('/login', [handlers.loginUser]);
router.get('/refreshToken', [handlers.refreshToken]);
router.post('/setPassword', [handlers.setStudentPassword]);
router.get('/getuser', [handlers.getUserDetails]);

// Certificate management endpoints - removed verifyjwt
router.get('/certificates', [handlers.getCertificates]);
router.post('/certificates/upload/:type', [handlers.uploadCertificate]);
router.get('/certificates/:type', [handlers.getCertificate]);
router.put('/certificates/:type', [handlers.updateCertificate]);
router.delete('/certificates/:type', [handlers.deleteCertificate]);

//verifyjwt should be there for all APIs which are accessed after the login to maintain the user session.
//router.post('/updateStudenteducationalData',verifyjwt, [handler.studentRegistration]);

module.exports = router;    