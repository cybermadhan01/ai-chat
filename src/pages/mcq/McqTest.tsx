import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import './McqTest.css';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface AnswerRecord {
  questionIndex: number;
  selectedOption: string;
  isCorrect: boolean;
  shuffledOptions: string[];
}

interface ProgressState {
  answers: AnswerRecord[];
  questionOrder: number[];
  optionsMap: { [key: number]: string[] };
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const McqTest: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [forceCompleted, setForceCompleted] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<ProgressState>({
    answers: [],
    questionOrder: [],
    optionsMap: {}
  });

  // Scroll refs
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Current question interaction
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load test data
  useEffect(() => {
    const fetchTest = async () => {
      try {
        // First try to load test data from localStorage
        const rawData = localStorage.getItem(`mcq_test_data_${slug}`);
        let data;
        
        if (rawData) {
          data = JSON.parse(rawData);
        } else {
          // If not in localStorage, fetch from database and cache it
          const response = await fetch(`/api/mcq/${slug}`);
          if (!response.ok) {
            throw new Error('Test not found or error loading test.');
          }
          data = await response.json();
          // Cache the test questions data locally
          localStorage.setItem(`mcq_test_data_${slug}`, JSON.stringify(data));
        }
        
        setQuestions(data);

        // Load saved progress
        const saved = localStorage.getItem(`mcq_progress_${slug}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Ensure the saved data is compatible with the new ProgressState interface
            if (parsed && Array.isArray(parsed.answers) && Array.isArray(parsed.questionOrder) && parsed.optionsMap) {
              setProgress(parsed);
            } else {
              // Obsolete or corrupted data structure - clear it
              localStorage.removeItem(`mcq_progress_${slug}`);
            }
          } catch (e) {
            localStorage.removeItem(`mcq_progress_${slug}`);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [slug]);

  // Anti-cheat
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (testStarted && !forceCompleted) e.preventDefault();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testStarted && !forceCompleted && !isTestComplete()) {
        setShowExitDialog(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && testStarted && !forceCompleted && !isTestComplete()) {
        setShowExitDialog(true);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [testStarted, forceCompleted, progress, questions.length]);

  const isTestComplete = useCallback(() => {
    return progress.answers.length === questions.length && questions.length > 0;
  }, [progress.answers.length, questions.length]);

  const getScore = useCallback(() => {
    return progress.answers.filter(a => a.isCorrect).length;
  }, [progress.answers]);

  // Initialize question order and shuffled options on start
  const initializeTest = useCallback(() => {
    if (progress.questionOrder.length > 0) {
      // Resume existing test
      const answeredCount = progress.answers.length;
      setCurrentStep(answeredCount);

      // Check if already answered this step
      if (answeredCount < progress.questionOrder.length) {
        const existingAnswer = progress.answers.find(
          a => a.questionIndex === progress.questionOrder[answeredCount]
        );
        if (existingAnswer) {
          setSelectedOption(existingAnswer.selectedOption);
          setIsSubmitted(true);
        } else {
          setSelectedOption(null);
          setIsSubmitted(false);
        }
      }
    } else {
      // Fresh test: shuffle question order and options
      const order = shuffleArray(questions.map((_, i) => i));
      const optMap: { [key: number]: string[] } = {};
      order.forEach(qi => {
        optMap[qi] = shuffleArray(questions[qi].options);
      });

      const newProgress: ProgressState = {
        answers: [],
        questionOrder: order,
        optionsMap: optMap
      };
      setProgress(newProgress);
      localStorage.setItem(`mcq_progress_${slug}`, JSON.stringify(newProgress));
      setCurrentStep(0);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  }, [questions, progress, slug]);

  const handleStartTest = () => {
    setTestStarted(true);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen prevented:', err.message);
      });
    }

    initializeTest();
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || currentStep >= progress.questionOrder.length) return;

    const qIndex = progress.questionOrder[currentStep];
    const isCorrect = selectedOption === questions[qIndex].answer;

    const record: AnswerRecord = {
      questionIndex: qIndex,
      selectedOption,
      isCorrect,
      shuffledOptions: progress.optionsMap[qIndex]
    };

    const newAnswers = [...progress.answers, record];
    const newProgress = { ...progress, answers: newAnswers };

    setProgress(newProgress);
    localStorage.setItem(`mcq_progress_${slug}`, JSON.stringify(newProgress));
    setIsSubmitted(true);
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep >= progress.questionOrder.length) return;

    setCurrentStep(nextStep);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Check if this question was already answered
    const qIndex = progress.questionOrder[nextStep];
    const existingAnswer = progress.answers.find(a => a.questionIndex === qIndex);
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selectedOption);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep <= 0) return;
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const qIndex = progress.questionOrder[prevStep];
    const existingAnswer = progress.answers.find(a => a.questionIndex === qIndex);
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selectedOption);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const handleEndTestEarly = () => {
    setShowExitDialog(false);
    setForceCompleted(true);
  };

  const handleContinueTest = () => {
    setShowExitDialog(false);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    }
  };

  // --- RENDER ---

  if (loading) {
    return <div className="loading-container">Loading Test Data...</div>;
  }

  if (error) {
    return (
      <div className="mcq-test-page">
        <div className="start-test-screen">
          <h1 style={{ color: '#EF4444' }}>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const isComplete = forceCompleted || isTestComplete();

  if (isComplete) {
    return (
      <div className="mcq-test-page">
        <div className="completed-screen">
          <h1>Test Completed!</h1>
          <div className="score-display">{getScore()} / {questions.length}</div>
          <p>You answered {getScore()} out of {questions.length} questions correctly.</p>
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    const resumeCount = progress.answers.length;
    return (
      <div className="mcq-test-page">
        <div className="start-test-screen">
          <h1>MCQ Assessment</h1>
          <p>This test contains {questions.length} questions.{resumeCount > 0 ? ` You have completed ${resumeCount}.` : ''}</p>
          <p style={{ fontSize: '14px', color: '#EF4444', marginBottom: '32px' }}>
            Note: Starting the test will enter full-screen mode. Right-clicking is disabled.
          </p>
          <Button variant="primary" onClick={handleStartTest}>
            {resumeCount > 0 ? 'Resume Test' : 'Start Test'}
          </Button>
        </div>
      </div>
    );
  }

  // Active test view
  const qIndex = progress.questionOrder[currentStep];
  const q = questions[qIndex];
  const options = progress.optionsMap[qIndex] || q.options;
  const answeredCount = progress.answers.length;
  const progressPercent = (answeredCount / questions.length) * 100;
  const isLastQuestion = currentStep === progress.questionOrder.length - 1;
  const isAlreadyAnswered = progress.answers.some(a => a.questionIndex === qIndex);

  return (
    <>
      {showExitDialog && (
        <div className="exit-dialog-overlay">
          <div className="exit-dialog">
            <h2>Test Paused</h2>
            <p>You have exited full screen mode. Do you want to end your test early?</p>
            <div className="exit-dialog-actions">
              <Button variant="secondary" onClick={handleEndTestEarly}>
                Yes, End Test
              </Button>
              <Button variant="primary" onClick={handleContinueTest}>
                Continue Test
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mcq-test-page">
        <div className="question-container">
          <div ref={topRef}></div>
          {/* Header */}
          <div className="question-header">
            <span className="question-number">Question {currentStep + 1} of {questions.length}</span>
            <div className="question-progress-bar">
              <div className="question-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="question-score">Score: {getScore()}/{answeredCount}</span>
          </div>

          {/* Question */}
          <div className="question-text">{q.question}</div>

          {/* Options */}
          <div className="options-grid">
            {options.map((opt, i) => {
              let optionClass = 'mcq-option';

              if (isSubmitted) {
                if (opt === q.answer) {
                  optionClass += ' correct';
                } else if (opt === selectedOption && opt !== q.answer) {
                  optionClass += ' incorrect';
                }
              } else if (opt === selectedOption) {
                optionClass += ' selected';
              }

              return (
                <button
                  key={i}
                  className={optionClass}
                  onClick={() => {
                    if (!isSubmitted && !isAlreadyAnswered) {
                      setSelectedOption(opt);
                      // Smooth scroll down to the submit button
                      setTimeout(() => {
                        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }
                  }}
                  disabled={isSubmitted || isAlreadyAnswered}
                >
                  <span className="option-letter">{OPTION_LETTERS[i]}</span>
                  <span className="mcq-option-text">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <div className="action-buttons-left">
              <button
                className="nav-btn prev-btn"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                ← Previous
              </button>
            </div>
            <div className="action-buttons-right">
              {!isSubmitted && !isAlreadyAnswered ? (
                <button
                  className="nav-btn submit-btn"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  className="nav-btn next-btn"
                  onClick={isLastQuestion && isSubmitted ? () => setCurrentStep(currentStep) : handleNext}
                  disabled={isLastQuestion && isSubmitted && isTestComplete()}
                >
                  {isLastQuestion && answeredCount >= questions.length ? 'Finish' : 'Next →'}
                </button>
              )}
            </div>
          </div>
          <div ref={bottomRef}></div>
        </div>
      </div>
    </>
  );
};
