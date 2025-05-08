const { models } = require('../config/dbConnections');
const AdmissionModel = models.studentAdmRegs;
const AdmissionFormModel = models.admissionForm;
const CampusModel = models.campusMS;
const ChoiceFillingModel = models.choiceFilling;
const BranchModel = models.progBranchMS;
const EntranceExamModel = models.entranceExams;
const ScholarshipAcadModel = models.scholarshipAcad;
const SeatsReleaseModel = models.seatsRelease;
const StudentIRADMDetailsModel = models.studentIRADMDetails;
const FeesCategoryModel = models.feesCategory;
const CollegeFeeModel = models.collegeFees;
const CollegeFeesSplitupModel = models.collegeFeesSplitup;
const ConcessionModel = models.concession;
const SeatsAllocationModel = models.seatsAllocation;
const ConcessionDetailsModel = models.concessionDetails;
const IdGeneratorModel = models.idGenerator;
const AdmissionStatusModel = models.admissionStatus;

class AdmissionDAO {
  // Helper function to get academic concession
  getAcademicConcession = async (exam_id, exam_marks) => {
    if (!exam_id || exam_marks == null) return { percentage: 0, scholarships_id: null };

    try {
      const records = await ScholarshipAcadModel.find({ exam_id });
      console.log(`Found ${records.length} scholarship records for exam_id ${exam_id}`);
      console.log('Checking marks:', exam_marks, 'against records:', records);

      const match = records.find(
        rec =>
          exam_marks >= rec.start_rank_mark &&
          exam_marks <= rec.end_rank_mark
      );

      console.log('Matching scholarship record:', match);

      return {
        percentage: match ? match.schlrsp_percentage : 0,
        scholarships_id: match ? match.scholarships_id : null
      };
    } catch (error) {
      console.error('Error getting academic concession:', error);
      return { percentage: 0, scholarships_id: null };
    }
  };

  // Check if admission number exists in student_iradm_details
  checkStudentIRADMDetails = async (admission_no) => {
    try {
      const student = await StudentIRADMDetailsModel.findOne({ admission_no });
      return {
        exists: !!student,
        student_category_id: student ? 1 : 2
      };
    } catch (error) {
      console.error('Error checking student IRADM details:', error);
      return {
        exists: false,
        student_category_id: 2
      };
    }
  };

  getAll = async () => {
    try {
      console.log("AdmissionDAO - Inside of getAll");

      // Fetch admission status records with adm_ofc_deo_status === 1 and seat_allocation === 0
      const admissionStatuses = await AdmissionStatusModel.find({
        adm_ofc_deo_status: 1,
        seat_allocation: 0
      }, {
        admission_no: 1
      });
      console.log("Found filtered admission status records:", admissionStatuses.length);

      // Extract admission numbers
      const admissionNos = admissionStatuses.map(status => status.admission_no);
      console.log("Filtered admission numbers:", admissionNos);

      // Fetch only students with matching admission numbers
      const students = await AdmissionModel.find({
        admission_no: { $in: admissionNos }
      });
      console.log("Found filtered students:", students.length);

      if (students.length === 0) {
        console.log("No students found matching the criteria");
        return [];
      }

      // Fetch exam marks
      const examMarks = await AdmissionFormModel.find({
        admission_no: { $in: admissionNos }
      }, {
        admission_no: 1,
        exam_marks: 1,
        exam_id: 1
      });
      console.log("Found exam marks records:", examMarks.length);

      // Fetch campuses
      const campuses = await CampusModel.find({}, { campus_id: 1, campus_name: 1 });
      console.log("Found campus records:", campuses.length);

      // Fetch choice fillings
      const choices = await ChoiceFillingModel.find({
        admission_no: { $in: admissionNos }
      }, {
        admission_no: 1,
        ch_1_brnh_id: 1,
        ch_2_brnh_id: 1,
        ch_3_brnh_id: 1,
        exam_id: 1
      });
      console.log("Found choice filling records:", choices.length);
      console.log(choices);

      // Fetch branches
      const branches = await BranchModel.find({}, {
        branch_id: 1,
        branch_short_name: 1
      });
      console.log("Found branch records:", branches.length);

      // Fetch entrance exams
      const entranceExams = await EntranceExamModel.find({}, {
        exam_id: 1,
        short_desc: 1
      });
      console.log("Found entrance exam records:", entranceExams.length);

      // Create maps for faster lookups
      const examMarksMap = examMarks.reduce((map, record) => {
        const key = `${record.admission_no}-${record.exam_id}`;
        map[key] = record.exam_marks;
        return map;
      }, {});

      const campusMap = campuses.reduce((map, campus) => {
        map[campus.campus_id] = campus.campus_name;
        return map;
      }, {});

      const choicesMap = choices.reduce((map, choice) => {
        const admissionNo = choice.admission_no.toString();
        console.log("Mapping choice for admission_no:", admissionNo, {
          ch_1_brnh_id: choice.ch_1_brnh_id,
          ch_2_brnh_id: choice.ch_2_brnh_id,
          ch_3_brnh_id: choice.ch_3_brnh_id,
          exam_id: choice.exam_id
        });
        map[admissionNo] = {
          choice1: choice.ch_1_brnh_id,
          choice2: choice.ch_2_brnh_id,
          choice3: choice.ch_3_brnh_id,
          exam_id: choice.exam_id
        };
        return map;
      }, {});

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
      const studentsWithDetailsPromises = students.map(async student => {
        const studentObj = student.toObject();
        const admissionNo = student.admission_no.toString();

        const studentChoices = choicesMap[admissionNo];
        const examId = studentChoices?.exam_id;
        const examMarksKey = examId ? `${student.admission_no}-${examId}` : null;
        const examMarksValue = examMarksKey ? examMarksMap[examMarksKey] : null;

        console.log("Processing student:", admissionNo, {
          foundChoices: !!studentChoices,
          choices: studentChoices,
          examId: examId,
          examMarks: examMarksValue,
          examType: examId ? examTypeMap[examId] : null
        });

        const academicConcession = await this.getAcademicConcession(examId, examMarksValue);
        console.log(`Academic concession for student ${admissionNo}:`, academicConcession);

        return {
          ...studentObj,
          exam_marks: examMarksValue || null,
          exam_type: examId ? examTypeMap[examId] : null,
          campus_name: campusMap[student.campus_code] || null,
          choice1: studentChoices ? branchMap[studentChoices.choice1] || null : null,
          choice2: studentChoices ? branchMap[studentChoices.choice2] || null : null,
          choice3: studentChoices ? branchMap[studentChoices.choice3] || null : null,
          choice1_branch_id: studentChoices ? studentChoices.choice1 : null,
          choice2_branch_id: studentChoices ? studentChoices.choice2 : null,
          choice3_branch_id: studentChoices ? studentChoices.choice3 : null,
          academic_concession: academicConcession.percentage,
          scholarships_id: academicConcession.scholarships_id,
          branches: branches
        };
      });

      const studentsWithDetails = await Promise.all(studentsWithDetailsPromises);

      console.log("Sample student with details:", studentsWithDetails[0]);
      return studentsWithDetails;
    } catch (error) {
      console.error("AdmissionDAO - getAll || Error:", error);
      throw error;
    }
  };

  // Get seats data based on branch, category and concession
  getSeatsData = async (branchId, category, concessionPercentage) => {
    try {
      console.log("Getting seats data for:", { branchId, category, concessionPercentage });
      
      const seatsData = await SeatsReleaseModel.findOne({
        prgm_branch_id: branchId
      });

      if (!seatsData) {
        throw new Error("No seats data found for the given branch");
      }

      let totalSeats = 0;
      let usedSeats = 0;
      let value = 0;
      if (category === 'CATEGORY-A') {
        switch(concessionPercentage) {
          case 10:
            totalSeats = seatsData.sub_cat_1_relse || 0;
            usedSeats = seatsData.sub_cat_1_utilis || 0;
            value = 1;
            break;
          case 25:
            totalSeats = seatsData.sub_cat_2_relse || 0;
            usedSeats = seatsData.sub_cat_2_utilis || 0;
            value = 2;
            break;
          case 50:
            totalSeats = seatsData.sub_cat_3_relse || 0;
            usedSeats = seatsData.sub_cat_3_utilis || 0;
            value = 3;
            break;
          case 75:
            totalSeats = seatsData.sub_cat_4_relse || 0;
            usedSeats = seatsData.sub_cat_4_utilis || 0;
            value = 4;
            break;
          case 0:
            totalSeats = seatsData.sub_cat_5_relse || 0;
            usedSeats = seatsData.sub_cat_5_utilis || 0;
            value = 5;
            break;
          default:
            throw new Error("Invalid concession percentage for Category A");
        }
      } else if (category === 'CATEGORY-B') {
        totalSeats = seatsData.sub_cat_6_relse || 0;
        usedSeats = seatsData.sub_cat_6_utilis || 0;
        value = 6;
      } else {
        throw new Error("Invalid category");
      }

      const remainingSeats = totalSeats - usedSeats;

      console.log("Seats calculation result:", {
        totalSeats,
        usedSeats,
        remainingSeats,
        seat_id: seatsData.seat_id,
        value,
        prgm_id: seatsData.prgm_id
      });

      return {
        totalSeats,
        usedSeats,
        remainingSeats,
        value: value,
        seat_id: seatsData.seat_id,
        prgm_id: seatsData.prgm_id,
        
      };
    } catch (error) {
      console.error('Error getting seats data:', error);
      throw error;
    }
  };

  getFeeCategoryId = async (prgm_id, fees_description) => {
    try {
      console.log("Finding fee category for:", { prgm_id, fees_description });
      const feeCategory = await FeesCategoryModel.findOne({
        prgrm_id: Number(prgm_id),
        fees_description
      });
      console.log("Found fee category:", feeCategory);
      return feeCategory ? feeCategory.fee_category_id : null;
    } catch (error) {
      console.error('Error getting fee category ID:', error);
      throw error;
    }
  };

  getFeeId = async (fee_category_id, prgm_branch_id) => {
    try {
      console.log("Finding fee id for:", { fee_category_id, prgm_branch_id });
      const fee = await CollegeFeeModel.findOne({
        fee_category_id: Number(fee_category_id),
        prgrm_branch_id: Number(prgm_branch_id)
      });
      console.log("Found fee:", fee);
      return fee ? fee.fee_id : null;
    } catch (error) {
      console.error('Error getting fee ID:', error);
      throw error;
    }
  };

  // In AdmissionDAO class
getFeeDetails = async (colg_fees_fee_id) => {
  try {
    console.log("Finding fee details for colg_fees_fee_id:", colg_fees_fee_id);

    
    // Get all records for the given fee_id and fee_year=1
    const feeRecords = await CollegeFeesSplitupModel.find({
      colg_fees_fee_id: Number(colg_fees_fee_id),
      fee_year: 1
    });

    console.log("Found fee records:", feeRecords);

    // Filter records for fesbgps_subgroup_id 1, 2, 3 and include fee_term as a number
    const relevantFeeRecords = feeRecords
      .filter(record => [1, 2, 3].includes(record.fesbgps_subgroup_id))
      .map(record => ({
        fesbgps_subgroup_id: record.fesbgps_subgroup_id,
        amount: record.amount,
        fee_term: Number(record.fee_term) // Ensure fee_term is a number
      }));

    console.log("Filtered fee records:", relevantFeeRecords);
    
    return relevantFeeRecords;
  } catch (error) {
    console.error('Error getting fee details:', error);
    throw error;
  }
};

  // Get concession types based on program ID
  getConcessionTypes = async (prog_id) => {
    try {
      console.log("Finding concession types for prog_id:", prog_id);
      const concessionTypes = await ConcessionModel.find({ prog_id: Number(prog_id) });
      console.log("Found concession types:", concessionTypes);
      
      return concessionTypes.map(type => ({
        id: type._id,
        subId: type.concession_subid,
        description: type.consess_desc
      }));
    } catch (error) {
      console.error('Error getting concession types:', error);
      throw error;
    }
  };

    // Post admission details with seat allocation
    postAdmissionDetails = async (data) => {
  try {
    // Validate input data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid or missing admission data');
    }
    if (!data.admission_no) {
      throw new Error('Admission number is required');
    }
    if (!data.allot_brnch_id) {
      throw new Error('Branch ID is required');
    }
    if (!data.prgmm_id) {
      throw new Error('Program ID is required');
    }
    if (!data.seat_category) {
      throw new Error('Seat category is required');
    }

    console.log("Posting admission for:", data);

    // Get admission form details
    const admissionForm = await AdmissionFormModel.findOne({ admission_no: data.admission_no });
    if (!admissionForm) {
      throw new Error(`Admission form not found for admission_no: ${data.admission_no}`);
    }
    const admissionYear = admissionForm.admission_year;
    const campusId = admissionForm.campus_id;

    // Get branch code
    const branchForm = await BranchModel.findOne({ branch_id: data.allot_brnch_id });
    if (!branchForm) {
      throw new Error(`Branch not found for branch_id: ${data.allot_brnch_id}`);
    }
    const branchCode = branchForm.branch_code;

    // Generate VU ID
    const serialNumber = await SeatsAllocationModel.countDocuments({ allot_brnch_id: data.allot_brnch_id });
    const serialNumberString = serialNumber.toString().padStart(4, '0');
    const serialNumberPlusOne = parseInt(serialNumberString) + 1;
    const serialNumberPlusOneString = serialNumberPlusOne.toString().padStart(4, '0');
    const vuId = `VU${admissionYear}${branchCode}-${serialNumberPlusOneString}`;

    // Get choice ID
    const choiceForm = await ChoiceFillingModel.findOne({ admission_no: data.admission_no });
    if (!choiceForm) {
      throw new Error(`Choice filling not found for admission_no: ${data.admission_no}`);
    }
    const choiceId = choiceForm.choice_id;

    // Get log user ID
    const campusForm = await CampusModel.findOne({ campus_id: campusId });
    if (!campusForm) {
      throw new Error(`Campus not found for campus_id: ${campusId}`);
    }
    const logUserId = campusForm.log_userid;

    // Generate concession ID
    const idGeneratorForm = await IdGeneratorModel.findOne({ start_data_year: admissionYear, purpose: "concession_id" });
    if (!idGeneratorForm) {
      throw new Error(`ID generator not found for year: ${admissionYear} and purpose: concession_id`);
    }
    const prefixCharacters = idGeneratorForm.prefix_characters;
    // const concessionDetailsCount = await ConcessionDetailsModel.countDocuments({ allot_brnch_id: data.allot_brnch_id });
    // const concessionDetailsString = concessionDetailsCount.toString().padStart(5, '0');
    // const concessionDetailsPlusOne = parseInt(concessionDetailsString) + 1;
    // const concessionDetailsPlusOneString = concessionDetailsPlusOne.toString().padStart(5, '0')
    const CurrentNo = idGeneratorForm.current_no;
    // const concessionId = `${prefixCharacters}${concessionDetailsPlusOneString}`;
        const concessionId = `${prefixCharacters}${CurrentNo + 1}`;
    await IdGeneratorModel.updateOne(
      { start_data_year: admissionYear, purpose: "concession_id" },
      { $inc: { current_no: 1 } }
    );


    // Store concession details
    const concessionTypes = await ConcessionModel.find({ prog_id: data.prgmm_id });
    const selectedConcessions = data.concessions || {};
    const concessionPercentages = data.percentages || {};
    
    let totalConcessionPercentage = 0;
    let concessionNames = [];

    for (const [subId, isSelected] of Object.entries(selectedConcessions)) {
      if (isSelected) {
        const concessionType = concessionTypes.find(type => type.concession_subid === Number(subId));
        if (concessionType) {
          const percentage = Number(concessionPercentages[subId]) || 0;
          totalConcessionPercentage += percentage;
          concessionNames.push(concessionType.consess_desc);

          const concessionDetails = new ConcessionDetailsModel({
            concession_id: concessionId,
            adm_no: data.admission_no,
            concession_subid: concessionType.concession_subid,
            concession_name: concessionType.consess_desc,
            concession_prntg: percentage,
            adm_year: admissionYear,
            campus_id: campusId,
            log_userid: logUserId,
            log_timestamp: new Date().toISOString(),
            log_ipaddress: "127.0.0.1",
            tot_concession_prntg: percentage,
            concession_names: concessionNames.join(" + ")
          });

          console.log("Concession details:", concessionDetails);

          await concessionDetails.save();
        }
      }
    }


    // Add additional fields to data
    const updatedData = { 
      admission_no: data.admission_no,
      vu_id: vuId,
      prgmm_id: data.prgmm_id,
      allot_brnch_id: data.allot_brnch_id, 
      choice_id: choiceId, 
      scrshp_id: data.scrshp_id,
      constion_id: concessionId,
      fee_cat_id: data.fee_cat_id,
      colg_fee_id: data.colg_fee_id,
      campus_id: campusId,
      adm_year: admissionYear, 
      log_userid: logUserId, 
      constion_id: concessionId, 
      log_timestamp: new Date().toISOString(),
      log_ipaddress: "127.0.0.1"
    };

    const newSeatsAllocation = new SeatsAllocationModel(updatedData);
    await newSeatsAllocation.save();
    console.log("Seats allocation saved successfully");

    // Update admission status to reflect seat allocation
    await AdmissionStatusModel.updateOne(
      { admission_no: data.admission_no },
      { $set: { seat_allocation: 1 } }
    );
    console.log(`Updated seat_allocation to 1 for admission_no ${data.admission_no}`);


    // update seats release table
    // find the seat_id from seats release table
    const seatId = await SeatsReleaseModel.findOne({ seat_id: data.seat_id });
    console.log("Seat ID:", seatId);
    // if data.value is 1, then update the sub_cat_1_utilis
    // if (data.value === 1) {
    //   await SeatsReleaseModel.updateOne(
    //     { seat_id: data.seat_id },
    //     { $set: { sub_cat_1_utilis: seatId.sub_cat_1_utilis + 1 } }
    //   );
    // }
    // // { $set: { sub_cat_1_utilis: seatId.sub_cat_1_utilis + 1 } } , can we use sub_cat_${data.value}_utilis: seatId.sub_cat_${data.value}_utilis + 1?

    // // if data.value is 2, then update the sub_cat_2_relse
    // if (data.value === 2) {
    //   await SeatsReleaseModel.updateOne(
    //     { seat_id: data.seat_id },
    //     { $set: { sub_cat_2_utilis: seatId.sub_cat_2_utilis + 1 } }
    //   );
    // }
    // // if data.value is 3, then update the sub_cat_3_relse
    // if (data.value === 3) {
    //   await SeatsReleaseModel.updateOne(
    //     { seat_id: data.seat_id },
    //     { $set: { sub_cat_3_utilis: seatId.sub_cat_3_utilis + 1 } }
    //   );
    // }
    // // if data.value is 4, then update the sub_cat_4_relse
    // if (data.value === 4) {
    //   await SeatsReleaseModel.updateOne(
    //     { seat_id: data.seat_id },
    //     { $set: { sub_cat_4_utilis: seatId.sub_cat_4_utilis + 1 } }
    //   );
    // }
    // // if data.value is 5, then update the sub_cat_5_relse
    // if (data.value === 5) {
    //   await SeatsReleaseModel.updateOne(
    //     { seat_id: data.seat_id },
    //     { $set: { sub_cat_5_utilis: seatId.sub_cat_5_utilis + 1 } }
    //   );
    // }
    // // if data.value is 6, then update the sub_cat_6_relse
    // if (data.value === 6) {
    //   await SeatsReleaseModel.updateOne(
    //     { seat_id: data.seat_id },
    //     { $set: { sub_cat_6_utilis: seatId.sub_cat_6_utilis + 1 } }
    //   );
    // }


    const value = data.value;
    if (value >= 1 && value <= 6) {
      const fieldName = `sub_cat_${value}_utilis`;

      await SeatsReleaseModel.updateOne(
        { seat_id: data.seat_id },
        { $inc: { [fieldName]: 1 } }
      );
    }



    return newSeatsAllocation;
  } catch (error) {
    console.error('Error posting admission:', error);
    throw error;
  }
};
}

module.exports = AdmissionDAO;