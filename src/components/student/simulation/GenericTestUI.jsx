import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, AlertTriangle, Loader } from 'lucide-react';
import { simulationService } from '../../../services/simulationService';
import SubmitConfirmationModal from './SubmitConfirmationModal';

const GenericTestUI = ({ stage, stageLabel, questionCount, timeLimitMinutes, onComplete, onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimitMinutes * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Fetch questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data = [];

        // Aptitude Test:
        // 10 Quantitative + 10 Logical + 10 Verbal
        if (stage === 'aptitude') {
          data = await simulationService.getAptitudeQuestions();

        } else if (stage === 'technical') {
          data = await simulationService.getTechnicalQuestions();

        } else {
          data = await simulationService.getSimulationQuestions(
            stage,
            questionCount
          );
        }

        if (!data || data.length === 0) {
          setError(
            'No questions available for this stage. Please contact your administrator.'
          );
          return;
        }

        setQuestions(data);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setTimeRemaining(timeLimitMinutes * 60);

        // Start the timer only after questions are loaded
        startTimeRef.current = Date.now();

      } catch (error) {
        console.error('Failed to load questions:', error);

        setError(
          'Failed to load questions. Please check your connection and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [stage, questionCount, timeLimitMinutes]);

  // Timer countdown
  useEffect(() => {
    if (isLoading || error || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLoading, error, questions.length]);

  const handleAutoSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    calculateAndSubmit();
  }, [questions, selectedAnswers]);

  const calculateAndSubmit = () => {
    clearInterval(timerRef.current);
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const timeTaken = `${minutes}m ${seconds}s`;

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    questions.forEach((q) => {
      const answer = selectedAnswers[q.id];
      if (!answer) {
        unansweredCount++;
      } else if (answer === q.correct_answer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const total = questions.length;
    const score = correctCount;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    onComplete({
      score,
      total,
      percentage,
      timeTaken,
      correctCount,
      incorrectCount,
      unansweredCount
    });
  };

  const handleSelectAnswer = (questionId, optionKey) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  // Loading state
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <Loader size={40} className="spin-animation" style={{ color: 'var(--primary-color)', marginBottom: '16px' }} />
        <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Loading {stageLabel} questions...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <AlertTriangle size={48} style={{ color: 'var(--danger-color)', marginBottom: '16px' }} />
        <p style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>Unable to Load Questions</p>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'center', maxWidth: '400px' }}>{error}</p>
        <button className="btn btn-outline" onClick={onExit}>Return to Overview</button>
      </div>
    );
  }

  // Empty state
  if (questions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <AlertTriangle size={48} style={{ color: 'var(--warning-color)', marginBottom: '16px' }} />
        <p style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>No questions available</p>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Questions for this stage haven't been added yet.</p>
        <button className="btn btn-outline" onClick={onExit}>Return to Overview</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = [
    { key: 'A', text: currentQuestion.option_a },
    { key: 'B', text: currentQuestion.option_b },
    { key: 'C', text: currentQuestion.option_c },
    { key: 'D', text: currentQuestion.option_d },
  ];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isTimeLow = timeRemaining < 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Test Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>PLACED • Campus Placement Simulation</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{stageLabel}</div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '8px',
          backgroundColor: isTimeLow ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-color)',
          border: `1px solid ${isTimeLow ? 'var(--danger-color)' : 'var(--border-color)'}`,
          color: isTimeLow ? 'var(--danger-color)' : 'var(--text-primary)',
          fontFamily: 'monospace',
          fontSize: '20px',
          fontWeight: 700
        }}>
          <Clock size={18} />
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Main Content: Question + Navigator side by side on desktop */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Question Area */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
          {currentQuestion.category && (
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--primary-color)',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              padding: '3px 10px',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              {currentQuestion.category}
            </span>
          )}
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {currentQuestion.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {options.map((opt) => {
              const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectAnswer(currentQuestion.id, opt.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: `1.5px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.06)' : 'var(--surface-color)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    width: '100%',
                    fontSize: '15px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    flexShrink: 0,
                    backgroundColor: isSelected ? 'var(--primary-color)' : 'var(--bg-color)',
                    color: isSelected ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`
                  }}>
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '12px' }}>
            <button
              className="btn btn-outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Previous
            </button>
            {isLastQuestion ? (
              <button className="btn btn-primary" onClick={() => setShowSubmitModal(true)}>
                Submit Test
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}>
                Next <ChevronRight size={16} style={{ marginLeft: '4px' }} />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator Panel — hidden on small screens via media query class */}
        <div className="test-navigator-panel" style={{
          width: '220px',
          borderLeft: '1px solid var(--border-color)',
          padding: '20px 16px',
          backgroundColor: 'var(--bg-color)',
          overflowY: 'auto',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>Question Navigator</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {questions.map((q, i) => {
              const isAnswered = !!selectedAnswers[q.id];
              const isCurrent = i === currentIndex;
              let bgColor = 'var(--surface-color)';
              let borderColor = 'var(--border-color)';
              let textColor = 'var(--text-muted)';

              if (isCurrent) {
                bgColor = 'var(--primary-color)';
                borderColor = 'var(--primary-color)';
                textColor = 'white';
              } else if (isAnswered) {
                bgColor = 'var(--success-color)';
                borderColor = 'var(--success-color)';
                textColor = 'white';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    border: `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--success-color)' }}></span> Answered
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary-color)' }}></span> Current
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}></span> Not Answered
            </div>
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <SubmitConfirmationModal
          answeredCount={answeredCount}
          totalCount={questions.length}
          onCancel={() => setShowSubmitModal(false)}
          onSubmit={calculateAndSubmit}
        />
      )}
    </div>
  );
};

export default GenericTestUI;
