import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import './McqTest.css';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface ProgressState {
  solvedIndices: number[];
  score: number;
}

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
  const [progress, setProgress] = useState<ProgressState>({ solvedIndices: [], score: 0 });
  const [forceCompleted, setForceCompleted] = useState(false);
  
  // Anti-cheat / Exit Dialog State
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // Current active question state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/mcq/${slug}`);
        if (!response.ok) {
          throw new Error('Test not found or error loading test.');
        }
        const data = await response.json();
        setQuestions(data);
        
        const savedProgress = localStorage.getItem(`mcq_progress_${slug}`);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          setProgress(parsed);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [slug]);

  // Anti-cheat Listeners (Fullscreen exit, Escape key, Context Menu)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (testStarted && !forceCompleted) e.preventDefault();
    };
    
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testStarted && progress.solvedIndices.length < questions.length && !forceCompleted) {
        setShowExitDialog(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && testStarted && progress.solvedIndices.length < questions.length && !forceCompleted) {
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

  const pickNextQuestion = useCallback((currentProgress: ProgressState) => {
    const unsolvedIndices = questions
      .map((_, index) => index)
      .filter(index => !currentProgress.solvedIndices.includes(index));
      
    if (unsolvedIndices.length === 0) {
      setCurrentQuestionIndex(null); 
      return;
    }
    
    const randomIndex = unsolvedIndices[Math.floor(Math.random() * unsolvedIndices.length)];
    setCurrentQuestionIndex(randomIndex);
    
    const q = questions[randomIndex];
    setCurrentOptions(shuffleArray(q.options));
    setSelectedOption(null);
    setIsEvaluating(false);
  }, [questions]);

  const handleStartTest = () => {
    setTestStarted(true);
    
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen prevented by browser:', err.message);
      });
    }

    pickNextQuestion(progress);
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

  const handleOptionSelect = (option: string) => {
    if (isEvaluating || currentQuestionIndex === null) return;
    
    setSelectedOption(option);
    setIsEvaluating(true);
    
    const isCorrect = option === questions[currentQuestionIndex].answer;
    
    const newProgress = {
      solvedIndices: [...progress.solvedIndices, currentQuestionIndex],
      score: isCorrect ? progress.score + 1 : progress.score
    };
    
    setProgress(newProgress);
    localStorage.setItem(`mcq_progress_${slug}`, JSON.stringify(newProgress));
    
    setTimeout(() => {
      pickNextQuestion(newProgress);
    }, 1500);
  };

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

  const isCompleted = forceCompleted || (progress.solvedIndices.length === questions.length && questions.length > 0);

  if (isCompleted) {
    return (
      <div className="mcq-test-page">
        <div className="completed-screen">
          <h1>Test Completed!</h1>
          <p>You scored {progress.score} out of {questions.length}</p>
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="mcq-test-page">
        <div className="start-test-screen">
          <h1>MCQ Assessment</h1>
          <p>This test contains {questions.length} questions. You have completed {progress.solvedIndices.length}.</p>
          <p style={{ fontSize: '14px', color: '#EF4444', marginBottom: '32px' }}>
            Note: Starting the test will enter full-screen mode. Right-clicking is disabled.
          </p>
          <Button variant="primary" onClick={handleStartTest}>
            {progress.solvedIndices.length > 0 ? 'Resume Test' : 'Start Test'}
          </Button>
        </div>
      </div>
    );
  }

  const q = currentQuestionIndex !== null ? questions[currentQuestionIndex] : null;

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
        {q && (
          <div className="question-container">
            <div className="question-progress">
              Question {progress.solvedIndices.length + 1} of {questions.length}
            </div>
            
            <div className="question-text">
              {q.question}
            </div>
            
            <div className="options-grid">
              {currentOptions.map((opt, i) => {
                let optionClass = 'mcq-option';
                
                if (isEvaluating) {
                  if (opt === q.answer) {
                    optionClass += ' correct';
                  } else if (opt === selectedOption && opt !== q.answer) {
                    optionClass += ' incorrect';
                  }
                }
                
                return (
                  <button 
                    key={i} 
                    className={optionClass}
                    onClick={() => handleOptionSelect(opt)}
                    disabled={isEvaluating}
                  >
                    <span className="mcq-option-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
