import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Table,
  Spinner
} from "react-bootstrap";
import { CallingAxios, ShowMessagePopup } from "../GenericFunctions"; // Using your existing utilities
import { GetSeatsData, CheckStudentIRADMDetails, GetFeeCategoryId, GetFeeId, GetFeeDetails, GetConcessionTypes, PostAdmissionDetails } from "../axios";

interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
}

interface ApiRequest {
  url: string;
  params?: Record<string, any>;
  method?: string;
  data?: any;
}

interface SeatsData {
  totalSeats: number;
  usedSeats: number;
  remainingSeats: number;
  seat_id: number;
  prgm_id: number;
  value: number;
}

interface FeeRecord {
  fesbgps_subgroup_id: number;
  amount: number;
  fee_term: number; // Updated to number
}

interface FeesData {
  admissionFees: string;
  tuitionFees: string;
  concessionAmount: string;
  payableFees: string;
  feeRecords: FeeRecord[]; // Store raw fee records
}

// TypeScript interfaces
interface StudentDetails {
  admissionNumber: string;
  studentName: string;
  admissionYear: string;
  campus: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice1_branch_id: number | null;
  choice2_branch_id: number | null;
  choice3_branch_id: number | null;
  examType: string;
  examMarks: string;
  academic_concession: string;
  scholarships_id: number | null;
}

interface SeatAllocationFormData {
  seatCategory: string;
  seatAllocation: string;
  categoryDropdown: string;
  concessions: { [key: number]: boolean };
  percentages: { [key: number]: number };
  extraConcessionPercentage: string;
  academicConcession: string;
  displayCategory: string;
  selectedBranchId?: number;
  scholarships_id?: number | null;
}

interface BranchOption {
  branch_id: number;
  branch_short_name: string;
}

interface AllocationModalProps {
  show: boolean;
  onHide: () => void;
  studentAdmissionNumber: string;
  students: any[];
  branches: BranchOption[];
}

interface ConcessionType {
  id: string;
  subId: number;
  description: string;
}

const SeatAllocationModal: React.FC<AllocationModalProps> = ({
  show,
  onHide,
  studentAdmissionNumber,
  students,
  branches
}) => {
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [savingData, setSavingData] = useState<boolean>(false);
  const [studentCategoryId, setStudentCategoryId] = useState<number>(2);
  const [feeCategoryId, setFeeCategoryId] = useState<number | null>(null);
  const [feeId, setFeeId] = useState<number | null>(null);

  // Seat allocation form data
  const [formData, setFormData] = useState<SeatAllocationFormData>({
    seatCategory: "",
    seatAllocation: "",
    categoryDropdown: "",
    concessions: {},
    percentages: {},
    extraConcessionPercentage: "0%",
    academicConcession: "0%",
    displayCategory: "",
    selectedBranchId: undefined,
    scholarships_id: null
  });

  const [seatsData, setSeatsData] = useState<SeatsData>({
    totalSeats: 0,
    usedSeats: 0,
    remainingSeats: 0,
    prgm_id: 0,
    seat_id: 0,
    value: 0
  });

  const [feesData, setFeesData] = useState<FeesData>({
    admissionFees: "₹0",
    tuitionFees: "₹0",
    concessionAmount: "₹0",
    payableFees: "₹0",
    feeRecords: []
  });

  const [concessionTypes, setConcessionTypes] = useState<ConcessionType[]>([]);
  const [loadingConcessions, setLoadingConcessions] = useState<boolean>(false);

  // Mock data for dropdowns and other fields
  const seatCategories = [
    "CATEGORY-A",
    "CATEGORY-B"
  ];

  // Get unique choices for seat allocation, removing any "NULL" values
  const getSeatAllocationOptions = () => {
    if (!student) return [];
    const studentChoices = [student.choice1, student.choice2, student.choice3].filter(Boolean);
    return branches.filter(branch =>
      studentChoices.includes(branch.branch_short_name)
    );
  };

  // Fetch student details and check IRADM details
  useEffect(() => {
    if (studentAdmissionNumber && show) {
      setLoading(true);
      const studentData = students.find(s => s.admissionNumber === studentAdmissionNumber);
      if (studentData) {
        // Set basic student data
        setStudent({
          admissionNumber: studentData.admissionNumber,
          studentName: studentData.studentName,
          admissionYear: studentData.admissionYear,
          campus: studentData.campus,
          choice1: studentData.choice1,
          choice2: studentData.choice2,
          choice3: studentData.choice3,
          choice1_branch_id: studentData.choice1_branch_id,
          choice2_branch_id: studentData.choice2_branch_id,
          choice3_branch_id: studentData.choice3_branch_id,
          examType: studentData.examType,
          examMarks: studentData.examMarks,
          academic_concession: studentData.academic_concession || '0',
          scholarships_id: studentData.scholarships_id || null
        });

        // Check IRADM details
        const checkIRADMDetails = async () => {
          try {
            const response = await CallingAxios(CheckStudentIRADMDetails(studentAdmissionNumber));
            if (response.status === "Success" && response.data) {
              setStudentCategoryId(response.data.student_category_id);
              console.log("Student category ID:", response.data.student_category_id);
            }
          } catch (error) {
            console.error("Error checking IRADM details:", error);
            setStudentCategoryId(2); // Default to 2 if there's an error
          }
        };

        checkIRADMDetails();

        setFormData(prev => ({
          ...prev,
          seatAllocation: "",
          academicConcession: `${studentData.academic_concession || 0}%`,
          extraConcessionPercentage: "0%",
          scholarships_id: studentData.scholarships_id || null
        }));
      }
      setLoading(false);
    }
  }, [studentAdmissionNumber, show, students]);

  // Function to fetch seats data
  const fetchSeatsData = async (branchId: number, category: string, concessionPercentage: number) => {
    try {
      console.log("Fetching seats data with params:", { branchId, category, concessionPercentage });
      
      if (!branchId || !category) {
        console.error("Missing required parameters:", { branchId, category });
        return;
      }

      const response = await CallingAxios(GetSeatsData(branchId, category, concessionPercentage));
      console.log("Seats data API response:", response);
      
      if (response.status === "Success" && response.data) {
        console.log("Setting seats data:", response.data);
        setSeatsData({
          totalSeats: response.data.totalSeats || 0,
          usedSeats: response.data.usedSeats || 0,
          remainingSeats: response.data.remainingSeats || 0,
          prgm_id: response.data.prgm_id || 0,
          seat_id: response.data.seat_id || 0,
          value: response.data.value || 0
        });
      } else {
        console.error("Failed to fetch seats data:", response.message);
        ShowMessagePopup(false, response.message || "Failed to fetch seats data", "");
      }
    } catch (error) {
      console.error('Error fetching seats data:', error);
      ShowMessagePopup(false, "Failed to fetch seats data", "");
    }
  };

  // Update seats data when seat allocation or category changes
  useEffect(() => {
    if (formData.selectedBranchId && formData.categoryDropdown) {
      console.log("Triggering seats data fetch with:", {
        branchId: formData.selectedBranchId,
        category: formData.categoryDropdown,
        concession: formData.academicConcession
      });
      
      const concessionPercentage = parseInt(formData.academicConcession.toString().replace('%', ''));
      fetchSeatsData(formData.selectedBranchId, formData.categoryDropdown, concessionPercentage);
    }
  }, [formData.selectedBranchId, formData.categoryDropdown, formData.academicConcession]);

  // Update display category when categoryDropdown changes
  useEffect(() => {
    if (formData.categoryDropdown) {
      setFormData(prev => ({
        ...prev,
        displayCategory: formData.categoryDropdown
      }));
    }
  }, [formData.categoryDropdown]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // Always store as string for dropdowns
    }));
  };

  // Handle extra concession input change independently
  const handleExtraConcessionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    // Ensure the value is a valid percentage (e.g., "10%" or "0%")
    const cleanedValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const formattedValue = cleanedValue ? `${cleanedValue}%` : "0%";
    
    setFormData(prev => ({
      ...prev,
      extraConcessionPercentage: formattedValue
    }));
  };

  // Clear the extra concession field when clicked (on focus)
  const handleExtraConcessionFocus = () => {
    setFormData(prev => ({
      ...prev,
      extraConcessionPercentage: ""
    }));
  };

  // Handle concession checkbox changes and calculate total extra concession
  const handleConcessionChange = (concessionId: number, checked: boolean) => {
    setFormData(prev => {
      const updatedConcessions = {
        ...prev.concessions,
        [concessionId]: checked
      };

      // Calculate total extra concession percentage from checked items
      const totalExtraConcession = Object.keys(updatedConcessions)
        .filter(id => updatedConcessions[id])
        .reduce((sum, id) => {
          const percentage = prev.percentages[id] || 0;
          return sum + percentage;
        }, 0);

      return {
        ...prev,
        concessions: updatedConcessions,
        extraConcessionPercentage: `${totalExtraConcession}%`
      };
    });
  };

  // Handle percentage input changes
  const handlePercentageChange = (concessionId: number, value: number) => {
    setFormData(prev => {
      const updatedPercentages = {
        ...prev.percentages,
        [concessionId]: value
      };

      // Recalculate total extra concession when percentage changes
      const totalExtraConcession = Object.keys(prev.concessions)
        .filter(id => prev.concessions[id])
        .reduce((sum, id) => {
          const percentage = updatedPercentages[id] || 0;
          return sum + percentage;
        }, 0);

      return {
        ...prev,
        percentages: updatedPercentages,
        extraConcessionPercentage: `${totalExtraConcession}%`
      };
    });
  };

  // Handle allocate seat button click
  const handleAllocateSeat = async () => {
    setSavingData(true);
    try {
      const data = {
        admission_no: studentAdmissionNumber,
        prgmm_id: seatsData.prgm_id,
        allot_brnch_id: formData.selectedBranchId,
        scrshp_id: formData.scholarships_id || 0,
        fee_cat_id: feeCategoryId,
        colg_fee_id: feeId,
        admission_fee: feesData.admissionFees,
        tuition_fee: feesData.tuitionFees,
        concession_amount: feesData.concessionAmount,
        payable_fee: feesData.payableFees,
        seat_category: formData.displayCategory,
        concessions: formData.concessions,
        percentages: formData.percentages,
        seat_id: seatsData.seat_id,
        value: seatsData.value
      };
      const response = await CallingAxios(PostAdmissionDetails(data));
      console.log("Seat allocation response:", response);
      if (response.status === "Success") {
        ShowMessagePopup(true, "Seat allocated successfully!", "");
        setSavingData(false);
        onHide();
      }
    } catch (error) {
      console.error("Error allocating seat:", error);
      ShowMessagePopup(false, "Failed to allocate seat. Please try again.", "");
      setSavingData(false);
    }
    return null;
  };

  // Function to fetch fee category ID
  const fetchFeeCategoryId = async (prgmId: number, seatCategory: string) => {
    try {
      console.log("Fetching fee category ID for:", { prgmId, seatCategory });
      const response = await CallingAxios(GetFeeCategoryId(prgmId, seatCategory));
      
      if (response.status === "Success" && response.data) {
        console.log("Fee category ID response:", response.data);
        setFeeCategoryId(response.data);
      } else {
        console.error("Failed to fetch fee category ID:", response.message);
        ShowMessagePopup(false, "Failed to fetch fee category ID", "");
      }
    } catch (error) {
      console.error("Error fetching fee category ID:", error);
      ShowMessagePopup(false, "Error fetching fee category ID", "");
    }
  };

  // Update fee category ID when program ID and category change
  useEffect(() => {
    if (seatsData.prgm_id && formData.categoryDropdown) {
      fetchFeeCategoryId(seatsData.prgm_id, formData.categoryDropdown);
    }
  }, [seatsData.prgm_id, formData.categoryDropdown]);

  // Function to fetch fee ID
  const fetchFeeId = async (fee_category_id: number, prgm_branch_id: number) => {
    try {
      console.log("Fetching fee ID for:", { fee_category_id, prgm_branch_id });
      const response = await CallingAxios(GetFeeId(fee_category_id, prgm_branch_id));
      
      if (response.status === "Success" && response.data) {
        console.log("Fee ID response:", response.data);
        setFeeId(response.data);
      } else {
        console.error("Failed to fetch fee ID:", response.message);
        ShowMessagePopup(false, "Failed to fetch fee ID", "");
      }
    } catch (error) {
      console.error("Error fetching fee ID:", error);
      ShowMessagePopup(false, "Error fetching fee ID", "");
    }
  };

  // Update fee ID when fee category ID and selected branch ID change
  useEffect(() => {
    if (feeCategoryId && formData.selectedBranchId) {
      fetchFeeId(feeCategoryId, formData.selectedBranchId);
    }
  }, [feeCategoryId, formData.selectedBranchId]);

  // Function to fetch fee details
  const fetchFeeDetails = async (colg_fees_fee_id: number) => {
    try {
      console.log("Fetching fee details for:", colg_fees_fee_id);
      const response = await CallingAxios(GetFeeDetails(colg_fees_fee_id));
      
      if (response.status === "Success" && response.data) {
        console.log("Fee details response:", response.data);
        
        // Calculate admission fee (fesbgps_subgroup_id = 1)
        const admissionFeeRecord = response.data.find(
          (record: FeeRecord) => record.fesbgps_subgroup_id === 1
        );
        const admissionFee = admissionFeeRecord ? admissionFeeRecord.amount : 0;

        // Calculate tuition fee (sum of amounts where fesbgps_subgroup_id = 2 or 3)
        const tuitionFeeRecords = response.data.filter(
          (record: FeeRecord) => record.fesbgps_subgroup_id === 2 || record.fesbgps_subgroup_id === 3
        );
        const tuitionFee = tuitionFeeRecords.reduce(
          (sum: number, record: FeeRecord) => sum + record.amount,
          0
        );

        setFeesData(prev => ({
          ...prev,
          admissionFees: `₹${admissionFee.toLocaleString()}`,
          tuitionFees: `₹${tuitionFee.toLocaleString()}`,
          feeRecords: response.data // Store raw records including fee_term
        }));
      } else {
        console.error("Failed to fetch fee details:", response.message);
        ShowMessagePopup(false, "Failed to fetch fee details", "");
      }
    } catch (error) {
      console.error("Error fetching fee details:", error);
      ShowMessagePopup(false, "Error fetching fee details", "");
    }
  };

  // Function to calculate concession amount and payable fees
  const calculateFees = (tuitionFees: string, academicConcession: string, extraConcession: string) => {
    try {
      // Extract numeric value from tuition fees (remove ₹ and convert to number)
      const tuitionAmount = Number(tuitionFees.replace('₹', '').replace(/,/g, ''));
      
      // Extract percentage values from both concessions (remove % and convert to numbers)
      const academicConcessionPercentage = Number(academicConcession.replace('%', ''));
      const extraConcessionPercentage = extraConcession ? Number(extraConcession.replace('%', '')) : 0;
      
      // Calculate concession amount from academic concession
      const academicConcessionAmount = (tuitionAmount * academicConcessionPercentage) / 100;
      
      // Calculate concession amount from extra concession
      const extraConcessionAmount = (tuitionAmount * extraConcessionPercentage) / 100;
      
      // Total concession amount
      const totalConcessionAmount = academicConcessionAmount + extraConcessionAmount;
      
      // Calculate payable fees
      const payableFees = tuitionAmount - totalConcessionAmount;
      
      return {
        concessionAmount: `₹${totalConcessionAmount.toLocaleString()}`,
        payableFees: `₹${payableFees.toLocaleString()}`
      };
    } catch (error) {
      console.error('Error calculating fees:', error);
      return {
        concessionAmount: '₹0',
        payableFees: tuitionFees
      };
    }
  };

  // Update fee details when feeId changes
  useEffect(() => {
    if (feeId) {
      fetchFeeDetails(feeId);
    }
  }, [feeId]);

  // Update concession amount and payable fees when tuition fees or concessions change
  useEffect(() => {
    const { concessionAmount, payableFees } = calculateFees(
      feesData.tuitionFees,
      formData.academicConcession,
      formData.extraConcessionPercentage
    );
    setFeesData(prev => ({
      ...prev,
      concessionAmount,
      payableFees
    }));
  }, [feesData.tuitionFees, formData.academicConcession, formData.extraConcessionPercentage]);

  // Function to fetch concession types
  const fetchConcessionTypes = async (progId: number) => {
    try {
      setLoadingConcessions(true);
      console.log("Fetching concession types for program ID:", progId);
      
      const response = await CallingAxios<ApiResponse<ConcessionType[]>>(GetConcessionTypes(progId));
      
      if (response?.status === "Success" && Array.isArray(response.data)) {
        console.log("Fetched concession types:", response.data);
        setConcessionTypes(response.data);
      } else {
        console.error("Failed to fetch concession types:", response.message);
        ShowMessagePopup(false, "Failed to fetch concession types", "");
      }
    } catch (error) {
      console.error("Error fetching concession types:", error);
      ShowMessagePopup(false, "Error fetching concession types", "");
    } finally {
      setLoadingConcessions(false);
    }
  };

  // Fetch concession types when program ID changes
  useEffect(() => {
    if (seatsData.prgm_id) {
      fetchConcessionTypes(seatsData.prgm_id);
    }
  }, [seatsData.prgm_id]);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Allocate Seat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading student details...</p>
          </div>
        ) : student ? (
          <Form>
            {/* Student Details Section */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Admission No:</Form.Label>
                  <Form.Control
                    type="text"
                    value={student.admissionNumber}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Category:</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.displayCategory}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={student.studentName}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Seats:</Form.Label>
                  {formData.categoryDropdown && (
                    <div className="mb-2">
                      <strong>Selected Category:</strong>{" "}
                      {formData.categoryDropdown}
                    </div>
                  )}
                  <Form.Control
                    type="text"
                    value={seatsData.totalSeats}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Admission Year:</Form.Label>
                  <Form.Control
                    type="text"
                    value={student.admissionYear}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Used Seats:</Form.Label>
                  <Form.Control
                    type="text"
                    value={seatsData.usedSeats}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Campus:</Form.Label>
                  <Form.Control type="text" value={student.campus} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Remaining Seats:</Form.Label>
                  <Form.Control
                    type="text"
                    value={seatsData.remainingSeats}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Choice 1:</Form.Label>
                  <Form.Control type="text" value={student.choice1} disabled />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Choice 2:</Form.Label>
                  <Form.Control type="text" value={student.choice2} disabled />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Choice 3:</Form.Label>
                  <Form.Control type="text" value={student.choice3} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Extra Concession:</Form.Label>
                  <Form.Control
                    type="text"
                    name="extraConcessionPercentage"
                    value={formData.extraConcessionPercentage}
                    onChange={handleExtraConcessionChange}
                    onFocus={handleExtraConcessionFocus}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Exam Type:</Form.Label>
                  <Form.Control type="text" value={student.examType} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Seats Available:</Form.Label>
                  <Form.Control
                    type="text"
                    value={seatsData.remainingSeats}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Exam Marks:</Form.Label>
                  <Form.Control
                    type="text"
                    value={student.examMarks}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Admission Fees:</Form.Label>
                  <Form.Control
                    type="text"
                    value={feesData.admissionFees}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Academic Concession:</Form.Label>
                  <Form.Control
                    type="text"
                    name="academicConcession"
                    value={formData.academicConcession}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tuition Fees:</Form.Label>
                  <Form.Control
                    type="text"
                    value={feesData.tuitionFees}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Display selected category */}
            {formData.displayCategory && (
              <Row className="mb-3">
                <Col>
                  <strong>Selected Category:</strong> {formData.displayCategory}
                </Col>
              </Row>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Allocation:</Form.Label>
                  <Form.Select
                    name="seatAllocation"
                    value={formData.seatAllocation}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      let branchId = null;

                      console.log("Selected seat allocation:", selectedValue);

                      // Map the selection to the corresponding branch ID
                      if (selectedValue === student?.choice1) {
                        branchId = student?.choice1_branch_id;
                      } else if (selectedValue === student?.choice2) {
                        branchId = student?.choice2_branch_id;
                      } else if (selectedValue === student?.choice3) {
                        branchId = student?.choice3_branch_id;
                      }

                      console.log("Mapped branch ID:", branchId);

                      // Update form data with both the selected choice and its branch ID
                      setFormData((prev) => ({
                        ...prev,
                        seatAllocation: selectedValue,
                        selectedBranchId: branchId || undefined,
                      }));
                    }}>
                    <option value="">-- Select Seat Allocation --</option>
                    {[
                      {
                        choice: student?.choice1,
                        name: "Choice 1",
                        id: student?.choice1_branch_id,
                      },
                      {
                        choice: student?.choice2,
                        name: "Choice 2",
                        id: student?.choice2_branch_id,
                      },
                      {
                        choice: student?.choice3,
                        name: "Choice 3",
                        id: student?.choice3_branch_id,
                      },
                    ]
                      .filter(({ choice }) => choice && choice !== "NULL")
                      .map(({ choice, name }, idx) => (
                        <option key={idx} value={choice}>
                          {`${name} - ${choice}`}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Concession Amount:</Form.Label>
                  <Form.Control
                    type="text"
                    value={feesData.concessionAmount}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Category:</Form.Label>
                  <Form.Select
                    name="categoryDropdown"
                    value={formData.categoryDropdown}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log("Selected category:", value);
                      setFormData((prev) => ({
                        ...prev,
                        categoryDropdown: value,
                        displayCategory: value,
                      }));
                    }}
                    disabled={
                      !formData.seatAllocation ||
                      formData.seatAllocation === "-- Select Seat Allocation --"
                    }>
                    <option value="">-- Select Seat Category --</option>
                    {seatCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payable Fees:</Form.Label>
                  <Form.Control
                    type="text"
                    value={feesData.payableFees}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Fee Records Display */}
            {feesData.feeRecords.length > 0 && (
              <Row className="mb-3">
                <Col>
                  <h5>Fee Breakdown</h5>
                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>fesbgps_subgroup_id</th>
                        <th>Amount</th>
                        <th>Fee Term</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feesData.feeRecords.map((record, index) => (
                        <tr key={index}>
                          <td>{record.fesbgps_subgroup_id}</td>
                          <td>₹{record.amount.toLocaleString()}</td>
                          <td>{record.fee_term}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}

            {/* Concession Types Table */}
            <h5 className="mt-4 mb-3">Concession Type</h5>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Apply</th>
                  <th>Concession Type</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {loadingConcessions ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <Spinner animation="border" size="sm" /> Loading
                      concession types...
                    </td>
                  </tr>
                ) : concessionTypes.length > 0 ? (
                  concessionTypes.map((concession) => (
                    <tr key={concession.subId}>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          id={`concession-${concession.subId}`}
                          checked={
                            formData.concessions[concession.subId] || false
                          }
                          onChange={(e) =>
                            handleConcessionChange(
                              concession.subId,
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td>{concession.description}</td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Enter %"
                          value={formData.percentages[concession.subId] || 0}
                          onChange={(e) =>
                            handlePercentageChange(
                              concession.subId,
                              Number(e.target.value)
                            )
                          }
                          disabled={!formData.concessions[concession.subId]}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No concession types available for this program
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Form>
        ) : (
          <p>No student data available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleAllocateSeat}
          disabled={savingData || !student}>
          {savingData ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Allocating...
            </>
          ) : (
            "Allocate Seat"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SeatAllocationModal;