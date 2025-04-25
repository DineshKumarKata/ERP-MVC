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

// TypeScript interfaces
interface StudentDetails {
  admissionNumber: string;
  studentName: string;
  admissionYear: string;
  campus: string;
  choice1: string;
  choice2: string;
  choice3: string;
  examType: string;
  examMarks: string;
}

interface SeatAllocationFormData {
  seatCategory: string;
  seatAllocation: string;
  categoryDropdown: string;
  concessions: {[key: string]: boolean};
  percentages: {[key: string]: string};
  extraConcessionPercentage: string;
  academicConcession: string;
}

interface AllocationModalProps {
  show: boolean;
  onHide: () => void;
  studentAdmissionNumber: string;
  students: any[]; // Using the students array from parent component
}

const SeatAllocationModal: React.FC<AllocationModalProps> = ({ 
  show, 
  onHide,
  studentAdmissionNumber,
  students
}) => {
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [savingData, setSavingData] = useState<boolean>(false);
  
  // Seat allocation form data
  const [formData, setFormData] = useState<SeatAllocationFormData>({
    seatCategory: "",
    seatAllocation: "",
    categoryDropdown: "",
    concessions: {},
    percentages: {},
    extraConcessionPercentage: "0%",
    academicConcession: "0%"
  });

  // Mock data for dropdowns and other fields
  const seatCategories = [
    "CATEGORY-A",
    "CATEGORY-B"
  ];

  // Get unique choices for seat allocation, removing any "NULL" values
  const getSeatAllocationOptions = (student: StudentDetails | null) => {
    if (!student) return [];
    
    const choices = [
      student.choice1,
      student.choice2,
      student.choice3
    ].filter(choice => choice && choice !== "NULL");
    
    return ["-- Select Seat Allocation --", ...choices];
  };

  const concessionTypes = [
    { id: "chairman_sir", name: "Chairman Sir" },
    { id: "vice_chairman_sir", name: "Vice Chairman Sir" },
    { id: "staff_reference", name: "Staff Reference" },
    { id: "vignan_student_alumni_std", name: "Vignan Student/Alumni Std" },
    { id: "sibling_student", name: "Sibling Student" },
    { id: "inter_merit", name: "INTER Merit" },
    { id: "jeee_merit", name: "JEEE Merit" },
    { id: "eapcet_merit", name: "EAPCET Merit" },
    { id: "vsat_merit", name: "VSAT Merit" },
    { id: "sc_st_merit", name: "SC/ST Merit" },
    { id: "neet_merit", name: "NEET Merit" },
    { id: "vice_chancellor", name: "Vice Chancellor" },
    { id: "nri_scholarship_type_1", name: "NRI Scholarship Type 1" },
    { id: "nri_scholarship_type_2", name: "NRI Scholarship Type 2" }
  ];

  // Fetch seat details - Mock
  useEffect(() => {
    if (studentAdmissionNumber && show) {
      const studentData = students.find(s => s.admissionNumber === studentAdmissionNumber);
      if (studentData) {
        setStudent({
          admissionNumber: studentData.admissionNumber,
          studentName: studentData.studentName,
          admissionYear: studentData.admissionYear,
          campus: studentData.campus,
          choice1: studentData.choice1,
          choice2: studentData.choice2,
          choice3: studentData.choice3,
          examType: studentData.examType,
          examMarks: studentData.examMarks
        });
        
        // Pre-select the seat allocation based on student's first choice if it's not "NULL"
        setFormData(prev => ({
          ...prev,
          seatAllocation: studentData.choice1 !== "NULL" ? studentData.choice1 : ""
        }));
      }
    }
  }, [studentAdmissionNumber, show, students]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle concession checkbox changes
  const handleConcessionChange = (concessionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      concessions: {
        ...prev.concessions,
        [concessionId]: checked
      }
    }));
  };

  // Handle percentage input changes
  const handlePercentageChange = (concessionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      percentages: {
        ...prev.percentages,
        [concessionId]: value
      }
    }));
  };

  // Handle allocate seat button click
  const handleAllocateSeat = async () => {
    setSavingData(true);
    try {
      // Here you would typically call your API
      // const response = await CallingAxios(AllocateSeat(studentAdmissionNumber, formData));
      
      // Mock successful API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      ShowMessagePopup(true, "Seat allocated successfully!", "");
      setSavingData(false);
      onHide();
    } catch (error) {
      console.error("Error allocating seat:", error);
      ShowMessagePopup(false, "Failed to allocate seat. Please try again.", "");
      setSavingData(false);
    }
  };

  // Calculate seat availability (example data)
  const calculatedData = {
    totalSeats: 60,
    usedSeats: 42,
    remainingSeats: 18,
    seatsAvailable: 18,
    admissionFees: "₹75,000",
    tuitionFees: "₹1,25,000",
    concessionAmount: "₹0",
    payableFees: "₹2,00,000"
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
    >
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
                  <Form.Select 
                    name="seatCategory"
                    value={formData.seatCategory}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select Seat Category --</option>
                    {seatCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
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
                  <Form.Control 
                    type="text" 
                    value={calculatedData.totalSeats} 
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
                    value={calculatedData.usedSeats} 
                    disabled 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Campus:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={student.campus} 
                    disabled 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Remaining Seats:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={calculatedData.remainingSeats} 
                    disabled 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Choice 1:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={student.choice1} 
                    disabled 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Empty for alignment */}
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Choice 2:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={student.choice2} 
                    disabled 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Empty for alignment */}
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Choice 3:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={student.choice3} 
                    disabled 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Extra Concession Percentage:</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="extraConcessionPercentage"
                    value={formData.extraConcessionPercentage}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Exam Type:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={student.examType} 
                    disabled 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Seats Available:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={calculatedData.seatsAvailable} 
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
                    value={calculatedData.admissionFees} 
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
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tuition Fees:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={calculatedData.tuitionFees} 
                    disabled 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Allocation:</Form.Label>
                  <Form.Select 
                    name="seatAllocation"
                    value={formData.seatAllocation}
                    onChange={handleInputChange}
                  >
                    {getSeatAllocationOptions(student).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Concession Amount:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={calculatedData.concessionAmount} 
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
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select Seat Category --</option>
                    {seatCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payable Fees:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={calculatedData.payableFees} 
                    disabled 
                  />
                </Form.Group>
              </Col>
            </Row>

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
                {concessionTypes.map(concession => (
                  <tr key={concession.id}>
                    <td className="text-center">
                      <Form.Check 
                        type="checkbox"
                        id={`concession-${concession.id}`}
                        checked={formData.concessions[concession.id] || false}
                        onChange={(e) => handleConcessionChange(concession.id, e.target.checked)}
                      />
                    </td>
                    <td>{concession.name}</td>
                    <td>
                      <Form.Control 
                        type="text"
                        placeholder="Enter %"
                        value={formData.percentages[concession.id] || ''}
                        onChange={(e) => handlePercentageChange(concession.id, e.target.value)}
                        disabled={!formData.concessions[concession.id]}
                      />
                    </td>
                  </tr>
                ))}
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
          disabled={savingData || !student}
        >
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