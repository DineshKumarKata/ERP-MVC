const AdmissionModel = require("../models/admissions/student_adm_regs");
const AdmissionFormModel = require("../models/admissions/admission_form");
const CampusModel = require("../models/admissions/campus_ms");
const ChoiceFillingModel = require("../models/admissions/choice_filling");
const BranchModel = require("../models/admissions/prog_branch_ms");
const EntranceExamModel = require("../models/admissions/entrance_exams_m");

class AdmissionDAO {
  

  getAll = async () => {
    try {
      console.log("AdmissionDAO - Inside of getAll");
      
      // First get all students
      const students = await AdmissionModel.find();
      console.log("Found students:", students.length);

      // Get all exam marks in one query
      const examMarks = await AdmissionFormModel.find({}, { 
        admission_no: 1, 
        exam_marks: 1,
        exam_id: 1 
      });
      console.log("Found exam marks records:", examMarks.length);

      // Get all campuses in one query
      const campuses = await CampusModel.find({}, { campus_id: 1, campus_name: 1 });
      console.log("Found campus records:", campuses.length);

      // Get all choice fillings in one query
      const choices = await ChoiceFillingModel.find({}, {
        admission_no: 1,
        ch_1_brnh_id: 1,
        ch_2_brnh_id: 1,
        ch_3_brnh_id: 1
      });
      console.log("Found choice filling records:", choices.length);

      // Get all branches in one query
      const branches = await BranchModel.find({}, {
        branch_id: 1,
        branch_short_name: 1
      });
      console.log("Found branch records:", branches.length);

      // Get all entrance exams in one query
      const entranceExams = await EntranceExamModel.find({}, {
        exam_id: 1,
        short_desc: 1
      });
      console.log("Found entrance exam records:", entranceExams.length);

      // Create maps for faster lookups
      const examMarksMap = examMarks.reduce((map, record) => {
        map[record.admission_no] = {
          marks: record.exam_marks,
          examId: record.exam_id
        };
        return map;
      }, {});

      const campusMap = campuses.reduce((map, campus) => {
        map[campus.campus_id] = campus.campus_name;
        return map;
      }, {});

      // Create choices map with string admission numbers
      const choicesMap = choices.reduce((map, choice) => {
        // Ensure admission_no is stored as string for consistent lookup
        const admissionNo = choice.admission_no.toString();
        console.log("Mapping choice for admission_no:", admissionNo, {
          ch_1_brnh_id: choice.ch_1_brnh_id,
          ch_2_brnh_id: choice.ch_2_brnh_id,
          ch_3_brnh_id: choice.ch_3_brnh_id
        });
        
        map[admissionNo] = {
          choice1: choice.ch_1_brnh_id,
          choice2: choice.ch_2_brnh_id,
          choice3: choice.ch_3_brnh_id
        };
        return map;
      }, {});

      // Create branch map with proper type handling
      const branchMap = branches.reduce((map, branch) => {
        map[branch.branch_id] = branch.branch_short_name;
        console.log("Mapping branch:", branch.branch_id, "->", branch.branch_short_name);
        return map;
      }, {});

      const examTypeMap = entranceExams.reduce((map, exam) => {
        map[exam.exam_id] = exam.short_desc;
        console.log("Mapping exam:", exam.exam_id, "->", exam.short_desc);
        return map;
      }, {});

      // Merge all the data
      const studentsWithDetails = students.map(student => {
        const studentObj = student.toObject();
        const admissionNo = student.admission_no.toString();
        
        // Get student choices using string admission number
        const studentChoices = choicesMap[admissionNo];
        const examInfo = examMarksMap[admissionNo] || {};
        
        console.log("Processing student:", admissionNo, {
          foundChoices: !!studentChoices,
          choices: studentChoices,
          examInfo: examInfo,
          examType: examTypeMap[examInfo.examId]
        });
        
        return {
          ...studentObj,
          exam_marks: examInfo.marks || null,
          exam_type: examTypeMap[examInfo.examId] || null,
          campus_name: campusMap[student.campus_code] || null,
          choice1: studentChoices ? branchMap[studentChoices.choice1] || null : null,
          choice2: studentChoices ? branchMap[studentChoices.choice2] || null : null,
          choice3: studentChoices ? branchMap[studentChoices.choice3] || null : null
        };
      });

      console.log("Sample student with details:", studentsWithDetails[0]);
      return studentsWithDetails;
    } catch (error) {   
      console.error("AdmissionDAO - getAll || Error:", error);
      throw error;
    }
  };
 
  
}

module.exports = AdmissionDAO;