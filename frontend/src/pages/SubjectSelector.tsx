import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import Head from "next/head";
import { useRouter } from "next/router";
import instance from "../redux/api"; // Axios instance from instance.ts
import { CallingAxios, ShowMessagePopup,KeepLoggedIn } from "../GenericFunctions"; // Utility functions
import { GetQuestionBanks, GetQuestionsByBankId, GenerateMultiSubjectTest, GetTestById} from "../axios";
import "bootstrap/dist/css/bootstrap.min.css";

// TypeScript interfaces for state and API responses
interface Subject {
  name: string;
  id: string;
  bankId: string;
}

interface QuestionBank {
  _id: string;
  name: string;
}

interface QuestionStats {
  total: number;
  easy: number;
  average: number;
  difficult: number;
}

interface SelectedQuestions {
  [key: string]: {
    [key: string]: number | string;
    bankId: string;
    subjectId: string;
  };
}

interface GeneratedTest {
  _id: string;
  name: string;
  questions: any[];
}

const SubjectSelector: React.FC = () => {
  const router = useRouter();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/vignan";

  // State declarations with TypeScript types
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedCount, setSelectedCount] = useState<string>("");
  const [questionStats, setQuestionStats] = useState<QuestionStats>({
    total: 0,
    easy: 0,
    average: 0,
    difficult: 0,
  });
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestions>({});
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [allSubjectsPreviewVisible, setAllSubjectsPreviewVisible] = useState<boolean>(false);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [activeBank, setActiveBank] = useState<string>("");
  const [testName, setTestName] = useState<string>("");
  const [generatingTest, setGeneratingTest] = useState<boolean>(false);
  const [testGenerated, setTestGenerated] = useState<boolean>(false);
  const [generatedTestId, setGeneratedTestId] = useState<string | null>(null);
  const [generatedTest, setGeneratedTest] = useState<GeneratedTest | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allSubjects, setAllSubjects] = useState<{
    [bankId: string]: Subject[];
  }>({});

  const difficulties = ["easy", "average", "difficult"];
  const difficultyLabels: { [key: string]: string } = {
    easy: "Easy",
    average: "Medium",
    difficult: "Hard",
  };

  // Check authentication on mount
  useEffect(() => {
    if (!KeepLoggedIn()) {
      router.push(`${basePath}/StudentLoginPage`);
    } else {
      fetchQuestionBanks();
    }
  }, [router]);

  // Fetch question banks on component mount
  useEffect(() => {
    fetchQuestionBanks();
  }, []);

  const fetchQuestionBanks = async () => {
    try {
      const response = await CallingAxios(GetQuestionBanks());
      if (response.status === "Success" && Array.isArray(response.data)) {
      setQuestionBanks(response.data);
        if (response.data.length > 0) {
        const defaultBank = response.data[0]._id;
        setSelectedBanks([defaultBank]);
        setActiveBank(defaultBank);
        await fetchSubjectsFromBank(defaultBank);
        }
      } else {
        throw new Error("Invalid question banks data received");
      }
    } catch (err) {
      console.error("Error fetching question banks:", err);
      ShowMessagePopup(
        false,
        "Failed to load question banks. Please try again.",
        ""
      );
      setQuestionBanks([]);
    }
  };

  const fetchSubjectsFromBank = async (bankId: string) => {
    try {
      console.log("Fetching subjects for bank:", bankId);
      const bankResponse = await CallingAxios(GetQuestionsByBankId(bankId));
      console.log("Bank response structure:", {
        status: bankResponse.status,
        hasData: !!bankResponse.data,
        dataIsArray: Array.isArray(bankResponse.data),
        dataLength: Array.isArray(bankResponse.data) ? bankResponse.data.length : 0
      });

      if (bankResponse.status === "Success" && Array.isArray(bankResponse.data)) {
        const uniqueSubjects = new Set<string>();
        
        // Log each question for debugging
        bankResponse.data.forEach((question: any, index: number) => {
          console.log(`Question ${index} structure:`, {
            hasSubject: !!question.subject,
            hasQueSubject: !!question.quesubject,
            subject: question.subject,
            quesubject: question.quesubject,
            fullQuestion: question
          });
          
          // Try to extract subject from either field
          const subjectField = question.subject || question.quesubject;
          if (subjectField) {
            const subjectName = subjectField.toLowerCase();
            uniqueSubjects.add(subjectName);
          }
        });

        console.log("Unique subjects found:", Array.from(uniqueSubjects));
        
        if (uniqueSubjects.size === 0) {
          console.warn("No subjects found in the question bank data");
          ShowMessagePopup(
            false,
            "No subjects found in this question bank.",
            ""
          );
          setSubjects([]);
          return;
        }
        
        const subjectArray: Subject[] = Array.from(uniqueSubjects).map(
          (subject: string) => ({
            name: subject.charAt(0).toUpperCase() + subject.slice(1),
            id: subject.toLowerCase(),
            bankId,
          })
        );

        console.log("Final processed subject array:", subjectArray);
        
        setAllSubjects((prev) => ({ ...prev, [bankId]: subjectArray }));
        setSubjects(subjectArray);
        setSelectedQuestions((prev) => {
          const updatedSelection = { ...prev };
          subjectArray.forEach((subject) => {
            const compoundId = `${subject.id}-${bankId}`;
            if (!updatedSelection[compoundId]) {
              updatedSelection[compoundId] = {
                easy: 0,
                average: 0,
                difficult: 0,
                bankId,
                subjectId: subject.id,
              };
            }
          });
          return updatedSelection;
        });

        if (
          activeSubject &&
          !subjectArray.some(
            (s) =>
              s.id === activeSubject.id && s.bankId === activeSubject.bankId
          )
        ) {
          setActiveSubject(null);
        }
      } else {
        console.error("Invalid response format:", bankResponse);
        throw new Error(
          bankResponse.message || "No questions found in this bank"
        );
      }
    } catch (err) {
      console.error("Error fetching subjects from bank:", err);
      ShowMessagePopup(
        false,
        "Failed to load subjects from this question bank.",
        ""
      );
      setSubjects([]);
    }
  };

  useEffect(() => {
    if (activeBank) {
      fetchSubjectsFromBank(activeBank);
      setActiveSubject(null);
      setPreviewVisible(false);
    }
  }, [activeBank]);

  useEffect(() => {
    setTestGenerated(false);
    setGeneratedTestId(null);
    setAllSubjectsPreviewVisible(false);
    const fetchAllSelectedBanks = async () => {
      for (const bankId of selectedBanks) {
        if (!allSubjects[bankId]) await fetchSubjectsFromBank(bankId);
      }
    };
    fetchAllSelectedBanks();
  }, [selectedBanks]);

  useEffect(() => {
    if (activeSubject && activeBank) {
      fetchQuestionStats(activeSubject.id, activeBank);
      setSelectedDifficulty("");
      setSelectedCount("");
    }
  }, [activeSubject, activeBank]);

  const fetchQuestionStats = async (subjectId: string, bankId: string) => {
    try {
      const bankResponse = await CallingAxios(
        GetQuestionsByBankId(bankId)
      );
      if (bankResponse.status === "Success" && Array.isArray(bankResponse.data)) {
        const allQuestions = bankResponse.data;
      const subjectQuestions = allQuestions.filter(
        (q: any) =>
          q.quesubject && q.quesubject.toLowerCase() === subjectId.toLowerCase()
      );
      const stats: QuestionStats = {
        total: subjectQuestions.length,
        easy: subjectQuestions.filter((q: any) => q.que_level === "easy")
          .length,
        average: subjectQuestions.filter((q: any) => q.que_level === "average")
          .length,
        difficult: subjectQuestions.filter(
          (q: any) => q.que_level === "difficult"
        ).length,
      };
      setQuestionStats(stats);
      } else {
        throw new Error("No questions found in this bank");
      }
    } catch (err) {
      console.error("Error fetching question stats:", err);
      ShowMessagePopup(
        false,
        "Failed to load question statistics. Please try again.",
        ""
      );
      setQuestionStats({ total: 0, easy: 0, average: 0, difficult: 0 });
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Bank selection changed:", e.target.value);
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    console.log("Selected banks:", options);
    setSelectedBanks(options);
    if (!options.includes(activeBank)) {
      const newActiveBank = options[0] || "";
      console.log("Setting new active bank:", newActiveBank);
      setActiveBank(newActiveBank);
    }
  };

  const handleActiveBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Active bank changed to:", e.target.value);
    setActiveBank(e.target.value);
  };

  const handleSubjectClick = (subject: Subject) => {
    setActiveSubject(subject);
    setPreviewVisible(false);
    setTestGenerated(false);
    setGeneratedTestId(null);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(e.target.value);
    setSelectedCount("");
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCount(e.target.value);
  };

  const handleTestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestName(e.target.value);
  };

  const handleAddQuestions = () => {
    if (activeSubject && selectedDifficulty && selectedCount) {
      const compoundId = `${activeSubject.id}-${activeSubject.bankId}`;
      const count = parseInt(selectedCount);
      if (count > questionStats[selectedDifficulty]) {
        ShowMessagePopup(
          false,
          `Cannot select more than ${questionStats[selectedDifficulty]} ${difficultyLabels[selectedDifficulty]} questions.`,
          ""
        );
        return;
      }
      setSelectedQuestions((prev) => ({
        ...prev,
        [compoundId]: {
          ...prev[compoundId],
          [selectedDifficulty]: count,
          bankId: activeSubject.bankId,
          subjectId: activeSubject.id,
        },
      }));
      setSelectedDifficulty("");
      setSelectedCount("");
      ShowMessagePopup(
        true,
        `${count} ${difficultyLabels[selectedDifficulty]} questions added for ${activeSubject.name}.`,
        ""
      );
    }
  };

  const handlePreview = () => {
    setPreviewVisible(!previewVisible);
    setAllSubjectsPreviewVisible(false);
  };

  const handleAllSubjectsPreview = () => {
    setAllSubjectsPreviewVisible(!allSubjectsPreviewVisible);
    setPreviewVisible(false);
  };

  const getTotalSelectedForCurrentSubject = (): number => {
    if (!activeSubject) return 0;
    const compoundId = `${activeSubject.id}-${activeSubject.bankId}`;
    if (!selectedQuestions[compoundId]) return 0;
    const subjectSelections = selectedQuestions[compoundId];
    return Object.entries(subjectSelections)
      .filter(([key]) => difficulties.includes(key))
      .reduce((sum, [, count]) => sum + (count as number), 0);
  };

  const getTotalSelectedForAllSubjects = (): number => {
    let total = 0;
    Object.values(selectedQuestions).forEach((selections) => {
      total += Object.entries(selections)
        .filter(([key]) => difficulties.includes(key))
        .reduce((sum, [, count]) => sum + (count as number), 0);
    });
    return total;
  };

  const hasQuestionsSelected = (subjectId: string, bankId: string): boolean => {
    const compoundId = `${subjectId}-${bankId}`;
    if (!selectedQuestions[compoundId]) return false;
    const subjectSelections = selectedQuestions[compoundId];
    return Object.entries(subjectSelections)
      .filter(([key]) => difficulties.includes(key))
      .some(([, count]) => (count as number) > 0);
  };

  const getAllSelectedBanksSubjects = (): Subject[] => {
    const allBankSubjects: Subject[] = [];
    selectedBanks.forEach((bankId) => {
      if (allSubjects[bankId]) allBankSubjects.push(...allSubjects[bankId]);
    });
    return allBankSubjects;
  };

  const handleGenerateTest = async () => {
    if (!testName) {
      ShowMessagePopup(false, "Please enter a test name", "");
      return;
    }

    setGeneratingTest(true);
    try {
      // Get the active bank ID
      const bankId = activeBank;
      if (!bankId) {
        throw new Error("No active question bank selected");
      }

      // Format the test data according to the backend's expected structure
      const testData = {
        bankId: bankId,
        testName: testName,
        subjectsData: Object.entries(selectedQuestions)
          .filter(([_, selections]) => {
            // Convert values to numbers and calculate total
            const easyCount = Number(selections.easy) || 0;
            const averageCount = Number(selections.average) || 0;
            const difficultCount = Number(selections.difficult) || 0;
            const total = easyCount + averageCount + difficultCount;
            return total > 0;
          })
          .map(([compoundId, selections]) => {
            const [subjectId] = compoundId.split('-');
            return {
              bankId: selections.bankId,
              subjectId: subjectId,
              difficultyDistribution: {
                easy: Number(selections.easy) || 0,
                average: Number(selections.average) || 0,
                difficult: Number(selections.difficult) || 0
              }
            };
          })
      };

      console.log("Sending test generation data:", testData);

      const response = await CallingAxios(GenerateMultiSubjectTest(testData));
      console.log("Test generation response:", response);

      if (response.status === "Success" && (response.testId || response.data?.testId)) {
        const testId = response.testId || response.data?.testId;
        setGeneratedTestId(testId);
      setTestGenerated(true);
        ShowMessagePopup(true, "Test generated successfully!", "");
      } else {
        throw new Error(response.message || "Failed to generate test");
      }
    } catch (error: any) {
      console.error("Test generation error:", error);
      ShowMessagePopup(false, error.message || "Failed to generate test", "");
    } finally {
      setGeneratingTest(false);
    }
  };

  const handleViewTest = (testId: string) => {
    router.push(`${basePath}/tests/${testId}`);
  };

  return (
    <>
      <Head>
        <title>Subject Selector - Vignan</title>
      </Head>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card>
              <Card.Body>
                <Card.Title as="h1" className="mb-4">Subject Selector</Card.Title>
        <Row>
                  {/* Question Bank Selection */}
                  <Col xs={12} className="mb-4">
                    <Form.Group>
                      <Form.Label>Select Question Banks</Form.Label>
                <Form.Select
                        multiple
                        value={selectedBanks}
                        onChange={handleBankChange}
                        className="mb-3">
                        {questionBanks.map((bank) => (
                          <option key={bank._id} value={bank._id}>
                            {bank.name}
                    </option>
                  ))}
                      </Form.Select>
                    </Form.Group>
                    {selectedBanks.length > 0 && (
                      <Form.Group>
                        <Form.Label>Active Question Bank</Form.Label>
                        <Form.Select
                          value={activeBank}
                          onChange={handleActiveBankChange}>
                          {selectedBanks.map((bankId) => {
                            const bank = questionBanks.find((b) => b._id === bankId);
                            return (
                              <option key={bankId} value={bankId}>
                                {bank?.name || bankId}
                              </option>
                            );
                          })}
                </Form.Select>
              </Form.Group>
            )}
                  </Col>

                  {/* Subject List */}
                  <Col xs={12} md={4}>
                    <h5>Subjects</h5>
            {subjects.length > 0 ? (
              <ListGroup>
                {subjects.map((subject) => (
                  <ListGroup.Item
                    key={`${subject.id}-${subject.bankId}`}
                    action
                    active={
                      activeSubject?.id === subject.id &&
                      activeSubject?.bankId === subject.bankId
                    }
                    onClick={() => handleSubjectClick(subject)}>
                    {subject.name}
                    {hasQuestionsSelected(subject.id, subject.bankId) && (
                      <span className="badge bg-success ms-2">✓</span>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="text-muted text-center">
                <p>No subjects found in selected bank.</p>
              </div>
            )}
          </Col>

                  {/* Question Selection */}
                  <Col xs={12} md={8}>
                    {activeSubject ? (
                      <div>
                        <h5>{activeSubject.name}</h5>
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Difficulty Level</Form.Label>
              <Form.Select
                              value={selectedDifficulty}
                              onChange={handleDifficultyChange}>
                              <option value="">Select Difficulty</option>
                              {difficulties.map((difficulty) => (
                                <option key={difficulty} value={difficulty}>
                                  {difficultyLabels[difficulty]} ({questionStats[difficulty]} available)
                                </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {selectedDifficulty && (
                            <Form.Group className="mb-3">
                              <Form.Label>Number of Questions</Form.Label>
                    <Form.Control
                      type="number"
                                min="1"
                                max={questionStats[selectedDifficulty]}
                      value={selectedCount}
                      onChange={handleCountChange}
                              />
                  </Form.Group>
                )}

                  <Button
                            variant="primary"
                            onClick={handleAddQuestions}
                            disabled={!selectedDifficulty || !selectedCount}>
                    Add Questions
                  </Button>
                        </Form>

                        {/* Preview Section */}
                        {hasQuestionsSelected(activeSubject.id, activeSubject.bankId) && (
                          <div className="mt-4">
                            <Button variant="outline-primary" onClick={handlePreview}>
                      {previewVisible ? "Hide Preview" : "Show Preview"}
                    </Button>
                    {previewVisible && (
                              <div className="mt-3">
                                <h6>Selected Questions:</h6>
                            {difficulties.map((difficulty) => {
                                  const count = selectedQuestions[
                                    `${activeSubject.id}-${activeSubject.bankId}`
                                  ]?.[difficulty];
                                  return count ? (
                                    <div key={difficulty}>
                                      {difficultyLabels[difficulty]}: {count}
                                    </div>
                                  ) : null;
                                })}
                                <div className="mt-2">
                                  <strong>
                                    Total: {getTotalSelectedForCurrentSubject()}
                                  </strong>
                                </div>
                            </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-muted text-center">
                        <p>Select a subject to add questions</p>
                      </div>
                    )}
                  </Col>
                </Row>

                {/* Test Generation Section */}
                {getTotalSelectedForAllSubjects() > 0 && (
                  <div className="mt-4 pt-4 border-top">
                    <Form.Group className="mb-3">
                      <Form.Label>Test Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={testName}
                        onChange={handleTestNameChange}
                        placeholder="Enter test name"
                      />
                    </Form.Group>
                          <Button
                      variant="success"
                            onClick={handleGenerateTest}
                      disabled={!testName || generatingTest}>
                            {generatingTest ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Generating Test...
                        </>
                      ) : (
                        "Generate Test"
                            )}
                          </Button>
                  </div>
                )}

                {/* Test Results Section */}
                {testGenerated && generatedTestId && (
                  <Alert variant="success" className="mt-4">
                    <Alert.Heading>Test Generated Successfully!</Alert.Heading>
                    <p>Your test has been created with ID: {generatedTestId}</p>
                    <Button
                      variant="outline-success"
                      onClick={() => handleViewTest(generatedTestId)}>
                      View Test
                    </Button>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SubjectSelector;
