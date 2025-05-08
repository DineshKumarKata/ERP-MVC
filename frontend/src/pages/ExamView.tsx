import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Alert, Spinner, Form, ListGroup, Card } from "react-bootstrap";
import {
  GetTestById,
  GetExamResponses,
  SaveExamResponse,
  DeleteExamResponse,
  SaveExamResult,
  StartExam,
  GetImageByRefId,
} from "../axios";
import {
  CallingAxios,
  ShowMessagePopup,
  KeepLoggedIn,
} from "../GenericFunctions"; // Utility functions


interface Question {
  _id: string;
  quesubject: string;
  que_level: string;
  questiondesc: string | { ref: string };
  option1: string | { ref: string };
  option2: string | { ref: string };
  option3: string | { ref: string };
  option4: string | { ref: string };
  answer: number;
  qmarks: number;
  qtimesec: number;
}

interface Subject {
  name: string;
  bankId: string;
  questions: {
    easy: Question[];
    average: Question[];
    difficult: Question[];
  };
}

interface Test {
  _id: string;
  name: string;
  subjects: Subject[];
  totalDuration: number;
  totalMarks: number;
}

interface QuestionStatus {
  viewed: boolean;
  answered: boolean;
  markedForReview: boolean;
  answeredAndMarkedForReview: boolean;
}

const ExamView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [questionStatuses, setQuestionStatuses] = useState<{
    [subjectName: string]: QuestionStatus[];
  }>({});
  const [savedResponses, setSavedResponses] = useState<{
    [questionId: string]: string;
  }>({});
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isFullScreenRequired, setIsFullScreenRequired] = useState(false);
  const [imageUrls, setImageUrls] = useState<{ [ref: string]: string }>({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [slotId, setSlotId] = useState<string | null>(null);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/vignan";


  const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if ((element as any).mozRequestFullScreen)
      (element as any).mozRequestFullScreen();
    else if ((element as any).webkitRequestFullscreen)
      (element as any).webkitRequestFullscreen();
    else if ((element as any).msRequestFullscreen)
      (element as any).msRequestFullscreen();
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if ((document as any).mozCancelFullScreen)
      (document as any).mozCancelFullScreen();
    else if ((document as any).webkitExitFullscreen)
      (document as any).webkitExitFullscreen();
    else if ((document as any).msExitFullscreen)
      (document as any).msExitFullscreen();
  };

  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      ShowMessagePopup(false, "Right-click is disabled during the exam.", "");
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    const fetchSlotId = async () => {
      try {
        const response = await CallingAxios(StartExam(testId!));
        if (response.status === "Success" && response.data?.examSlot?.slotId) {
          setSlotId(response.data.examSlot.slotId);
        } else {
          setError(response.message || "Failed to start exam");
        }
      } catch (err) {
        setError("Failed to fetch slotId: " + (err as Error).message);
      }
    };

    if (location.state?.enterFullScreen) {
      enterFullScreen();
      fetchSlotId();
    }
  }, [location.state, testId]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && test && timeLeft > 0) {
        ShowMessagePopup(
          false,
          "Warning: Please complete the exam in full-screen mode. Exiting full-screen is not allowed during the exam.",
          ""
        );
        setIsFullScreenRequired(true);
      } else {
        setIsFullScreenRequired(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, [test, timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount === 1) {
            ShowMessagePopup(
              false,
              "Warning: Switching tabs is not allowed during the exam!",
              ""
            );
          } else if (newCount >= 2) {
            handleSubmit(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const getDisplayContent = (
  field: string | { ref: string } | undefined
): React.ReactNode => {
  if (!field) return null;

  if (typeof field === "object" && "ref" in field) {
    return imageUrls[field.ref] ? (
      <img
        src={imageUrls[field.ref]}
        alt="Question content"
        className="img-fluid mt-2"
        style={{ maxHeight: "200px" }}
      />
    ) : (
      <Spinner animation="border" size="sm" />
    );
  }

  return <span>{field as string}</span>;
};

  const fetchQuestionImages = async (question: Question) => {
    if (!question) return;
    setLoadingImages(true);
    const newImageUrls = { ...imageUrls };
    const imageFields = [
      question.questiondesc,
      question.option1,
      question.option2,
      question.option3,
      question.option4,
    ].filter(
      (field): field is { ref: string } =>
        typeof field === "object" && !!field?.ref
    );

    try {
      for (const field of imageFields) {
        if (!newImageUrls[field.ref]) {
          const response = await CallingAxios(GetImageByRefId(field.ref));
          if (response.status === "Success" && response.data) {
            const url = URL.createObjectURL(response.data);
            newImageUrls[field.ref] = url;
          } else {
            console.error(
              "Failed to fetch image for ref:",
              field.ref,
              response.message
            );
          }
        }
      }
      setImageUrls(newImageUrls);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (currentQuestions.length > 0 && currentQuestions[currentIndex]) {
      fetchQuestionImages(currentQuestions[currentIndex]);
    }
  }, [currentIndex, currentQuestions]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await CallingAxios(GetTestById(testId!));
        if (response.status !== "Success" || !response.data) {
          setError(
            response.message || "No test found for the provided test ID."
          );
          return;
        }

        const testData = response.data;
        setTest(testData);
        setTimeLeft(testData.totalDuration || 20 * 60);

        if (testData.subjects?.length > 0) {
          const firstSubject = testData.subjects[0];
          setCurrentSubject(firstSubject);
          const allQuestions = [
            ...(firstSubject.questions.easy || []),
            ...(firstSubject.questions.average || []),
            ...(firstSubject.questions.difficult || []),
          ];
          setCurrentQuestions(allQuestions);
          setQuestionStatuses((prev) => ({
            ...prev,
            [firstSubject.name]:
              prev[firstSubject.name] ||
              allQuestions.map(() => ({
                viewed: false,
                answered: false,
                markedForReview: false,
                answeredAndMarkedForReview: false,
              })),
          }));
        }
      } catch (err) {
        setError("Failed to fetch test: " + (err as Error).message);
      }
    };

    if (testId) fetchTest();
  }, [testId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSavedResponses = async () => {
    try {
      const response = await CallingAxios(GetExamResponses(test!._id));
      const responses = response.data || [];
      const formattedResponses = responses.reduce(
        (acc: { [key: string]: string }, response: any) => {
          acc[response.questionId] = response.selectedOption;
          return acc;
        },
        {}
      );
      setSavedResponses(formattedResponses);
      const updatedStatuses = { ...questionStatuses };
      Object.keys(formattedResponses).forEach((questionId) => {
        const questionIndex = currentQuestions.findIndex(
          (q) => q._id === questionId
        );
        if (questionIndex !== -1) {
          updatedStatuses[currentSubject!.name][questionIndex] = {
            ...updatedStatuses[currentSubject!.name][questionIndex],
            answered: true,
            answeredAndMarkedForReview: false,
          };
        }
      });
      setQuestionStatuses(updatedStatuses);
    } catch (err) {
      setError("Failed to fetch saved responses: " + (err as Error).message);
    }
  };

  useEffect(() => {
    if (test) fetchSavedResponses();
  }, [test]);

  useEffect(() => {
    const questionId = currentQuestions[currentIndex]?._id;
    if (questionId && savedResponses[questionId]) {
      setSelectedOption(savedResponses[questionId]);
    } else {
      setSelectedOption("");
    }
  }, [currentIndex, currentQuestions, savedResponses]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs < 10 ? "0" : ""}${secs} sec`;
  };

  const handleSubjectChange = (subject: Subject) => {
    const allQuestions = [
      ...(subject.questions.easy || []),
      ...(subject.questions.average || []),
      ...(subject.questions.difficult || []),
    ];
    setCurrentSubject(subject);
    setCurrentQuestions(allQuestions);
    setCurrentIndex(0);
    setError("");
    setQuestionStatuses((prev) => ({
      ...prev,
      [subject.name]:
        prev[subject.name] ||
        allQuestions.map(() => ({
          viewed: false,
          answered: false,
          markedForReview: false,
          answeredAndMarkedForReview: false,
        })),
    }));
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    setError("");
  };

  const handleSaveAndNext = async () => {
    if (!selectedOption) {
      setError("Please select an option before saving.");
      return;
    }

    setIsSaving(true);
    setError("");

    const questionId = currentQuestions[currentIndex]._id;
    const updatedStatuses = { ...questionStatuses };
    updatedStatuses[currentSubject!.name][currentIndex] = {
      ...updatedStatuses[currentSubject!.name][currentIndex],
      viewed: true,
      answered: true,
      markedForReview: false,
      answeredAndMarkedForReview: false,
    };

    try {
      await CallingAxios(
        SaveExamResponse({
          testId: test!._id,
          questionBankId: currentSubject!.bankId,
          questionId,
          selectedOption,
        })
      );

      setSavedResponses((prev) => ({
        ...prev,
        [questionId]: selectedOption,
      }));
      setQuestionStatuses(updatedStatuses);

      if (currentIndex < currentQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const currentSubjectIndex = test!.subjects.findIndex(
          (s) => s.name === currentSubject!.name
        );
        if (currentSubjectIndex < test!.subjects.length - 1) {
          const nextSubject = test!.subjects[currentSubjectIndex + 1];
          handleSubjectChange(nextSubject);
          setCurrentIndex(0);
        } else {
          setError("This is the last question of the exam.");
        }
      }
    } catch (err) {
      setError("Failed to save response: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    const updatedStatuses = { ...questionStatuses };
    updatedStatuses[currentSubject!.name][currentIndex] = {
      ...updatedStatuses[currentSubject!.name][currentIndex],
      viewed: true,
    };
    setQuestionStatuses(updatedStatuses);

    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setError("");
  };

  const handleMarkAndReview = async () => {
    const updatedStatuses = { ...questionStatuses };
    updatedStatuses[currentSubject!.name][currentIndex] = {
      ...updatedStatuses[currentSubject!.name][currentIndex],
      viewed: true,
      answered: !!selectedOption,
      markedForReview: !selectedOption,
      answeredAndMarkedForReview: !!selectedOption,
    };

    if (selectedOption) {
      setIsSaving(true);
      setError("");
      const questionId = currentQuestions[currentIndex]._id;
      try {
        await CallingAxios(
          SaveExamResponse({
            testId: test!._id,
            questionBankId: currentSubject!.bankId,
            questionId,
            selectedOption,
          })
        );

        setSavedResponses((prev) => ({
          ...prev,
          [questionId]: selectedOption,
        }));
        setQuestionStatuses(updatedStatuses);
        if (currentIndex < currentQuestions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      } catch (err) {
        setError("Failed to save response: " + (err as Error).message);
      } finally {
        setIsSaving(false);
      }
    } else {
      setQuestionStatuses(updatedStatuses);
      if (currentIndex < currentQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handleClearResponse = async () => {
    const questionId = currentQuestions[currentIndex]._id;
    setSelectedOption("");
    const updatedStatuses = { ...questionStatuses };
    updatedStatuses[currentSubject!.name][currentIndex] = {
      ...updatedStatuses[currentSubject!.name][currentIndex],
      answered: false,
      answeredAndMarkedForReview: false,
    };

    try {
      await CallingAxios(
        DeleteExamResponse({
          testId: test!._id,
          questionId,
        })
      );
      setSavedResponses((prev) => {
        const newResponses = { ...prev };
        delete newResponses[questionId];
        return newResponses;
      });
      setQuestionStatuses(updatedStatuses);
      setError("");
    } catch (err) {
      setError("Failed to delete response: " + (err as Error).message);
    }
  };

  const handleSubmit = async (forceSubmit = false) => {
    setIsSubmitting(true);
    setError("");

    const questionId = currentQuestions[currentIndex]._id;
    if (selectedOption) {
      try {
        await CallingAxios(
          SaveExamResponse({
            testId: test!._id,
            questionBankId: currentSubject!.bankId,
            questionId,
            selectedOption,
          })
        );
        setSavedResponses((prev) => ({
          ...prev,
          [questionId]: selectedOption,
        }));
      } catch (err) {
        setError(
          "Failed to save response on submit: " + (err as Error).message
        );
        setIsSubmitting(false);
        return;
      }
    }

    let responses: any[] = [];
    try {
      const response = await CallingAxios(GetExamResponses(test!._id));
      responses = response.data || [];
    } catch (err) {
      setError("Failed to fetch responses: " + (err as Error).message);
      setIsSubmitting(false);
      return;
    }

    try {
      await CallingAxios(
        SaveExamResult({
          testId: test!._id,
          slotId,
        })
      );

      setIsSubmitting(false);
      if (!forceSubmit) {
        ShowMessagePopup(true, "Exam submitted successfully!", "");
      }

      exitFullScreen();
      navigate(`${basePath}/show-results/${testId}`, {
        state: { testName: test!.name },
        replace: true,
      });
    } catch (err) {
      setError("Failed to save result: " + (err as Error).message);
      setIsSubmitting(false);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    const updatedStatuses = { ...questionStatuses };
    updatedStatuses[currentSubject!.name][currentIndex] = {
      ...updatedStatuses[currentSubject!.name][currentIndex],
      viewed: true,
    };
    setQuestionStatuses(updatedStatuses);
    setCurrentIndex(index);
    setError("");
  };

  const getStatusCounts = () => {
    const statuses = questionStatuses[currentSubject?.name || ""] || [];
    return {
      answered: statuses.filter((s) => s.answered).length,
      notAnswered: statuses.filter(
        (s) => s.viewed && !s.answered && !s.markedForReview
      ).length,
      notVisited: statuses.filter((s) => !s.viewed).length,
      markedForReview: statuses.filter((s) => s.markedForReview && !s.answered)
        .length,
      answeredAndMarkedForReview: statuses.filter(
        (s) => s.answeredAndMarkedForReview
      ).length,
    };
  };

  const statusCounts = getStatusCounts();

  if (error && !test) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }

  if (!test || !currentSubject || currentQuestions.length === 0) {
    return <h2 className="text-center">Loading test...</h2>;
  }

  const currentQuestion = currentQuestions[currentIndex];

  const handleReEnterFullScreen = () => {
    enterFullScreen();
    setIsFullScreenRequired(false);
  };

  return (
    <div className="container-fluid p-0 bg-light">
      {error && (
        <Alert variant="danger" className="m-3">
          {error}
        </Alert>
      )}

      {isFullScreenRequired && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            flexDirection: "column",
            textAlign: "center",
            padding: "20px",
          }}>
          <h2>Full-Screen Mode Required</h2>
          <p>
            The exam must be taken in full-screen mode. Please click the button
            below to continue.
          </p>
          <Button
            variant="primary"
            className="mt-3"
            onClick={handleReEnterFullScreen}>
            Enter Full-Screen Mode
          </Button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3 sticky-top">
        <div className="d-flex gap-2">
          {test.subjects.map((subject) => (
            <Button
              key={subject.name}
              variant={
                currentSubject.name === subject.name ? "dark" : "secondary"
              }
              size="sm"
              onClick={() => handleSubjectChange(subject)}>
              {subject.name}
            </Button>
          ))}
        </div>
        <h1 className="m-0 text-center flex-grow-1">{test.name}</h1>
        <div className="d-flex align-items-center gap-3">
          <p className="m-0">Time Left: {formatTime(timeLeft)}</p>
          <p className="m-0">Marks: {currentQuestion?.qmarks || 1}</p>
        </div>
      </div>

      <div className="row m-0">
        <div className="col-md-9 p-3">
          <Card className="mb-3">
            <Card.Body>
              <h2 className="h5">
                Q{currentIndex + 1}/{currentQuestions.length}
              </h2>
              <div className="mb-3">
                {loadingImages ? (
                  <Spinner animation="border" />
                ) : (
                  getDisplayContent(currentQuestion?.questiondesc)
                )}
              </div>
              <ListGroup>
                {["A", "B", "C", "D"].map((option, index) => {
                  const optionKey = `option${index + 1}` as keyof Question;
                  return (
                    <ListGroup.Item
                      key={option}
                      className="d-flex align-items-start">
                      <Form.Check
                        type="radio"
                        name="option"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => handleOptionChange(option)}
                        className="me-2 mt-1"
                      />
                      <div className="flex-grow-1">
                        <span className="me-2">{option})</span>
                        {loadingImages ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          getDisplayContent(
                            currentQuestion?.[optionKey] as
                              | string
                              | { ref: string }
                          )
                        )}
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-3 p-3">
          <Card className="mb-3">
            <Card.Body>
              <p className="mb-1">
                <span className="text-success me-2">⬢</span> Answered:{" "}
                {statusCounts.answered}
              </p>
              <p className="mb-1">
                <span className="text-warning me-2">⬢</span> Not Answered:{" "}
                {statusCounts.notAnswered}
              </p>
              <p className="mb-1">
                <span className="text-danger me-2">⬢</span> Not Visited:{" "}
                {statusCounts.notVisited}
              </p>
              <p className="mb-1">
                <span className="text-primary me-2">⬢</span> Marked for Review:{" "}
                {statusCounts.markedForReview}
              </p>
              <p className="mb-0">
                <span className="text-info me-2">⬢</span> Answered & Marked for
                Review: {statusCounts.answeredAndMarkedForReview}
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h3 className="h6 text-primary text-uppercase">
                {currentSubject.name}
              </h3>
              <h4 className="h6">Choose a Question</h4>
              <div className="d-flex flex-wrap gap-2">
                {currentQuestions.map((_, index) => {
                  const status = questionStatuses[currentSubject.name][index];
                  let variant = "secondary";
                  if (status.answered) variant = "success";
                  else if (status.markedForReview) variant = "primary";
                  else if (status.viewed && !status.answered)
                    variant = "danger";
                  else if (status.viewed) variant = "warning";

                  return (
                    <Button
                      key={index}
                      variant={variant}
                      size="sm"
                      style={{ width: "40px" }}
                      onClick={() => handleQuestionNavigation(index)}>
                      {index + 1}
                    </Button>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 p-3 bg-white border-top">
        <Button variant="danger" onClick={handleClearResponse}>
          Clear Response
        </Button>
        <Button variant="warning" onClick={handleMarkAndReview}>
          Mark for Review
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveAndNext}
          disabled={isSaving}>
          {isSaving ? "Saving..." : "Save & Next"}
        </Button>
        <Button
          variant="success"
          onClick={() => handleSubmit()}
          disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default ExamView;
