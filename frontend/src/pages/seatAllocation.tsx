import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import { CallingAxios, ShowMessagePopup } from "../GenericFunctions";
import { GetAllAdmissions } from "../axios";
import SeatAllocationModal from "./SeatAllocationModal";
import "bootstrap/dist/css/bootstrap.min.css";

interface ApiStudent {
  _id: string;
  admission_no: string;
  student_name: string;
  admission_year: string;
  campus?: string;
  choice1?: string;
  choice2?: string;
  choice3?: string;
  exam_type?: string;
  exam_marks?: string;
  deo_status?: string;
  primary_phone_no: string;
  primary_email_id: string;
  adm_status: number;
  residential_status: string;
  campus_name?: string;
  academic_concession?: number;
  scholarships_id?: number;
  choice1_branch_id?: number;
  choice2_branch_id?: number;
  choice3_branch_id?: number;
}

interface DisplayStudent {
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
  deoStatus: string;
  academic_concession: number;
  scholarships_id: number | null;
}

interface SearchParams {
  admissionYear: string;
  campus: string;
  programGroup: string;
  fromDate: string;
  toDate: string;
}

interface BranchOption {
  branch_id: number;
  branch_short_name: string;
}

const SeatAllocation: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    admissionYear: "",
    campus: "",
    programGroup: "",
    fromDate: "",
    toDate: "",
  });

  const [students, setStudents] = useState<DisplayStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showResults, setShowResults] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  const admissionYears = [
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ];

  const campuses = [
    "Vignan's Foundation for Science, Technology & Research is a Deemed university",
    "vignan hyderabad off campus",
    "Vadlamudi ( VFSTR )",
  ];

  const programs = [
    "B.Tech ___ (BTECH)",
    "B.A (LLB) ___ (BALLB)",
    "BBA ___(BBA)",
    "B.B.A (LLB) ___ (BBALLB)",
    "BCA ___(BCA)",
    "B.Pharamacy ___ (BPHARM)",
    "BSC(Hons) ___ (BSCH)",
    "MBA ___ (MBA)",
    "M.Sc. ___ (MSC)",
    "MCA ___ (MCA)",
    "M.Tech ___ (MTECH)",
    "PHD_INTERNAL_FULLTIME ___ (PHDI)",
    "PHD_EXTERNAL_PART-TIME ___(PHDE)",
    "B.Sc ___(BSC)",
    "Diploma ___ (DPO)",
    "MA ___ (MA)",
    "BBA+MBA ___ (BBAMBA)",
  ];

  const [branches, setBranches] = useState<BranchOption[]>([]);

  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        console.log("Fetching admission data...");
        const response = await CallingAxios(GetAllAdmissions());
        console.log("API Response:", response);

        if (response.status === "Success") {
          const apiData = Array.isArray(response.data) ? response.data : [];
          console.log("API Data:", apiData);

          const formattedData: DisplayStudent[] = apiData.map((item) => {
            console.log("Processing student item:", {
              admission_no: item.admission_no,
              exam_marks: item.exam_marks,
              exam_type: item.exam_type,
              campus_name: item.campus_name,
              choices: {
                choice1: item.choice1,
                choice2: item.choice2,
                choice3: item.choice3,
                choice1_branch_id: item.choice1_branch_id,
                choice2_branch_id: item.choice2_branch_id,
                choice3_branch_id: item.choice3_branch_id,
              },
              academic_concession: item.academic_concession,
              scholarships_id: item.scholarships_id,
            });

            return {
              // admissionNumber: item.admission_no?.toString() || "NULL",
              admissionNumber: item.admission_no || 0,
              studentName: item.student_name || "NULL",
              admissionYear: item.admission_year || "NULL",
              campus: item.campus_name || "NULL",
              choice1: item.choice1 || "NULL",
              choice2: item.choice2 || "NULL",
              choice3: item.choice3 || "NULL",
              choice1_branch_id: item.choice1_branch_id || null,
              choice2_branch_id: item.choice2_branch_id || null,
              choice3_branch_id: item.choice3_branch_id || null,
              examType: item.exam_type || "NULL",
              examMarks:
                item.exam_marks !== null && item.exam_marks !== undefined
                  ? item.exam_marks.toString()
                  : "NULL",
              deoStatus: "verified",
              academic_concession: item.academic_concession || 0,
              scholarships_id: item.scholarships_id || null,
            };
          });

          console.log("Formatted Data:", formattedData);
          setStudents(formattedData);

          if (response.data.branches) {
            setBranches(response.data.branches);
          }

          if (formattedData.length === 0) {
            console.log("Warning: No admission records found in the response");
          }

          setShowResults(true);
        } else {
          setStudents([]);
          console.error("API returned non-success status:", response.status);
          ShowMessagePopup(
            false,
            response.message || "Failed to fetch admission data",
            ""
          );
        }
      } catch (error) {
        console.error("Error fetching admission data:", error);
        setStudents([]);
        ShowMessagePopup(
          false,
          "Failed to fetch admission data. Please try again.",
          ""
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAllocate = (admissionNumber: string) => {
    setSelectedStudent(admissionNumber);
    setShowModal(true);
  };

  const filteredStudents = students.length
    ? students.filter((student) => {
        return (
          (!searchParams.admissionYear ||
            student.admissionYear === searchParams.admissionYear) &&
          (!searchParams.campus || student.campus === searchParams.campus) &&
          (!searchParams.programGroup ||
            student.choice1 === searchParams.programGroup) &&
          (!searchParams.fromDate ||
            student.admissionYear >= searchParams.fromDate) &&
          (!searchParams.toDate || student.admissionYear <= searchParams.toDate)
        );
      })
    : [];

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light p-4 min-vh-100">
          <div className="sidebar">
            <h5 className="mb-4">ADM PROCESS</h5>
            <ul className="list-unstyled">
              <li className="mb-2">○ Seat Allocation</li>
              <li className="mb-2">○ Seat Mofication</li>
              <li className="mb-2">○ Intake Seats modify</li>
              <li className="mb-2">○ Withdraw seat</li>
            </ul>
            <h5 className="mb-3 mt-4">Adm Data reports</h5>
            <h5 className="mb-3">Adm Consol reports</h5>
            <h5 className="mb-3">MYACCOUNT</h5>
          </div>
        </Col>

        <Col md={9} className="p-4">
          <Card className="mb-4">
            <Card.Body>
              <h2 className="text-center mb-4">Seat Allocation</h2>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="admissionYear">
                    <Form.Label>Admission Year</Form.Label>
                    <Form.Select
                      name="admissionYear"
                      value={searchParams.admissionYear}
                      onChange={handleInputChange}>
                      <option value="">Select Admission Year</option>
                      {admissionYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group controlId="campus">
                    <Form.Label>Campus</Form.Label>
                    <Form.Select
                      name="campus"
                      value={searchParams.campus}
                      onChange={handleInputChange}>
                      <option value="">Select Campus</option>
                      {campuses.map((campus) => (
                        <option key={campus} value={campus}>
                          {campus}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="programGroup">
                    <Form.Label>Program Group</Form.Label>
                    <Form.Select
                      name="programGroup"
                      value={searchParams.programGroup}
                      onChange={handleInputChange}>
                      <option value="">Select Program</option>
                      {programs.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group controlId="fromDate">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="fromDate"
                      value={searchParams.fromDate}
                      onChange={handleInputChange}
                      placeholder="dd-mm-yyyy"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="toDate">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="toDate"
                      value={searchParams.toDate}
                      onChange={handleInputChange}
                      placeholder="dd-mm-yyyy"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="d-flex justify-content-center">
                  <Button variant="primary" className="px-4">
                    Search
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {showResults && (
            <Card>
              <Card.Body>
                <h3 className="mb-4">Admission Data</h3>
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div>
                    {filteredStudents.length > 0 ? (
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Admission Number</th>
                              <th>Student Name</th>
                              <th>Admission Year</th>
                              <th>Campus</th>
                              <th>Choice 1</th>
                              <th>Choice 2</th>
                              <th>Choice 3</th>
                              <th>Exam Type</th>
                              <th>Exam Marks</th>
                              <th>Deo Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((student) => (
                              <tr key={student.admissionNumber}>
                                <td>{student.admissionNumber}</td>
                                <td>{student.studentName}</td>
                                <td>{student.admissionYear}</td>
                                <td>{student.campus}</td>
                                <td>{student.choice1}</td>
                                <td>{student.choice2}</td>
                                <td>{student.choice3}</td>
                                <td>{student.examType}</td>
                                <td>{student.examMarks}</td>
                                <td>{student.deoStatus}</td>
                                <td>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() =>
                                      handleAllocate(student.admissionNumber)
                                    }>
                                    Allocate
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <Alert variant="info" className="text-center">
                        <Alert.Heading>No Admission Data Found</Alert.Heading>
                        <p>
                          There are currently no admission records in the system
                          that are verified by DEO and have seats unallocated.
                          This could be because:
                        </p>
                        <ul className="list-unstyled">
                          <li>• No admissions have been verified by DEO</li>
                          <li>
                            • All verified admissions have seats allocated
                          </li>
                          <li>
                            • The selected filters don't match any records
                          </li>
                          <li>
                            • There might be an issue with the data retrieval
                          </li>
                        </ul>
                        <p className="mb-0">
                          Please verify that admission records exist and try
                          again.
                        </p>
                      </Alert>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <SeatAllocationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        studentAdmissionNumber={selectedStudent}
        students={students}
        branches={branches}
      />
    </Container>
  );
};

export default SeatAllocation;
