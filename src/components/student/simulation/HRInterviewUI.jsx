import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Send, Loader, AlertTriangle } from 'lucide-react';
import { simulationService } from '../../../services/simulationService';


const HRInterviewUI = ({ onComplete, onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(20 * 60);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await simulationService.getHRQuestions(5);

        if (!data || data.length === 0) {
          setError(
            'No HR interview questions are available. Please contact your administrator.'
          );
          return;
        }

        setQuestions(data);
        setCurrentIndex(0);
        setAnswers({});
        setTimeRemaining(20 * 60);

        startTimeRef.current = Date.now();

      } catch (err) {
        console.error('Failed to load HR questions:', err);

        setError(
          'Failed to load HR interview questions. Please check your connection and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    if (isLoading || error || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLoading, error, questions.length]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswerChange = (e) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: e.target.value }));
  };

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current);

    const elapsedSeconds = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    const answeredCount = Object.values(answers).filter(
      (answer) => answer && answer.trim().length > 0
    ).length;

    const total = questions.length;

    onComplete({
      score: answeredCount,
      total,
      percentage: total > 0
        ? (answeredCount / total) * 100
        : 0,
      timeTaken: `${minutes}m ${seconds}s`,
      correctCount: answeredCount,
      incorrectCount: 0,
      unansweredCount: total - answeredCount
    });
  }, [answers, questions, onComplete]);
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px'
        }}
      >
        <Loader
          size={40}
          className="spin-animation"
          style={{
            color: 'var(--primary-color)',
            marginBottom: '16px'
          }}
        />

        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-muted)'
          }}
        >
          Loading HR interview questions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px'
        }}
      >
        <AlertTriangle
          size={48}
          style={{
            color: 'var(--danger-color)',
            marginBottom: '16px'
          }}
        />

        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-primary)',
            fontWeight: 600,
            marginBottom: '8px'
          }}
        >
          Unable to Load Questions
        </p>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginBottom: '24px',
            textAlign: 'center',
            maxWidth: '400px'
          }}
        >
          {error}
        </p>

        <button
          className="btn btn-outline"
          onClick={onExit}
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const isTimeLow = timeRemaining < 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
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
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>HR Interview — Question {currentIndex + 1} of {questions.length}</div>
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

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '24px' }}>
            {questions[currentIndex]?.question}
          </h3>

          <textarea
            value={answers[currentIndex] || ''}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            style={{
              flex: 1,
              minHeight: '250px',
              padding: '20px',
              borderRadius: '10px',
              border: '1.5px solid var(--border-color)',
              backgroundColor: 'var(--surface-color)',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'var(--text-primary)',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', gap: '12px' }}>
            <button
              className="btn btn-outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Previous
            </button>
            {isLastQuestion ? (
              <button className="btn btn-primary" onClick={handleSubmit}>
                <Send size={16} style={{ marginRight: '6px' }} /> Submit Interview
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setCurrentIndex((i) => i + 1)}>
                Next <ChevronRight size={16} style={{ marginLeft: '4px' }} />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="test-navigator-panel" style={{
          width: '200px',
          borderLeft: '1px solid var(--border-color)',
          padding: '20px 16px',
          backgroundColor: 'var(--bg-color)',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>Questions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {questions.map((_, i) => {
              const isAnswered = answers[i] && answers[i].trim().length > 0;
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
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Q{i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRInterviewUI;
