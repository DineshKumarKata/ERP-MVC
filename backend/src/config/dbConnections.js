const mongoose = require('mongoose');
const dbConfig = require('./database');

// Create connections to both databases
const admissionDB = mongoose.createConnection(dbConfig.admission.uri, dbConfig.admission.options);
const academicDB = mongoose.createConnection(dbConfig.academic.uri, dbConfig.academic.options);
const financeDB = mongoose.createConnection(dbConfig.finance.uri, dbConfig.finance.options);

// Import models
const AdmissionForm = require('../models/admissions/admission_form');
const ChoiceFilling = require('../models/admissions/choice_filling');
const EntranceExams = require('../models/admissions/entrance_exams_m');
const CampusMS = require('../models/admissions/campus_ms');
const ProgBranchMS = require('../models/admissions/prog_branch_ms');
const StudentAdmRegs = require('../models/admissions/student_adm_regs');
const ScholarshipAcad = require('../models/admissions/scholarship_acad');
const SeatsRelease = require('../models/admissions/seats_release');
const StudentIRADMDetails = require('../models/admissions/student_iradm_details');
const FeesCategory = require('../models/admissions/fees_category');
const CollegeFees = require('../models/admissions/college_fees');
const CollegeFeesSplitup = require('../models/admissions/college_fees_splitup');
const Concession = require('../models/admissions/concession_types');
const SeatsAllocation = require('../models/admissions/seats_allocation');
const IdGenerator = require('../models/admissions/id_generators');
const ConcessionDetails = require('../models/admissions/concession_details');
const AdmissionStatus = require('../models/admissions/admission_status');
const StudentFeeDetails = require('../models/admissions/std_fee_details');

// Connect models to their respective databases
const models = {
  // Models in ad_process database
  admissionForm: AdmissionForm(admissionDB),
  choiceFilling: ChoiceFilling(admissionDB),
  entranceExams: EntranceExams(admissionDB),
  scholarshipAcad: ScholarshipAcad(admissionDB),
  seatsRelease: SeatsRelease(admissionDB),
  concession: Concession(admissionDB),
  seatsAllocation: SeatsAllocation(admissionDB),
  concessionDetails: ConcessionDetails(admissionDB),
  admissionStatus: AdmissionStatus(admissionDB),


  // Models in ad_master database
  campusMS: CampusMS(academicDB),
  progBranchMS: ProgBranchMS(academicDB),
  studentAdmRegs: StudentAdmRegs(academicDB),
  studentIRADMDetails: StudentIRADMDetails(academicDB),
  idGenerator: IdGenerator(academicDB),

  

  // Models in ad_finance database
  feesCategory: FeesCategory(financeDB),
  collegeFees: CollegeFees(financeDB),
  collegeFeesSplitup: CollegeFeesSplitup(financeDB),
  studentFeeDetails: StudentFeeDetails(financeDB),
};

module.exports = {
  admissionDB,
  academicDB,
  financeDB,
  models
}; 