
import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Send,
  AlertTriangle,
  Loader,
  Code
} from 'lucide-react';

import { simulationService } from '../../../services/simulationService';

const LANGUAGES = ['Python', 'Java', 'C', 'C++'];

const DEFAULT_CODE = {
  'Python': '# Write your solution here\n\ndef solve():\n    pass\n\nsolve()',
  'Java': '// Write your solution here\nimport java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // your code\n    }\n}',
  'C': '// Write your solution here\n#include <stdio.h>\n\nint main() {\n    // your code\n    return 0;\n}',
  'C++': '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code\n    return 0;\n}'
};

const CodingRoundUI = ({ onComplete, onExit }) => {
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [language, setLanguage] = useState('Python');
  const [codes, setCodes] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeRemaining, setTimeRemaining] = useState(60 * 60);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  useEffect(() => {
    const loadCodingProblems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await simulationService.getCodingProblems();

        if (!data || data.length === 0) {
          setError(
            'No coding problems are available. Please contact your administrator.'
          );
          return;
        }

        // We expect 4 problems: 2 Easy + 2 Medium
        setProblems(data);

        // Create initial code editor and submission state
        const initialCodes = {};
        const initialSubmitted = {};

        data.forEach((_, index) => {
          initialCodes[index] = DEFAULT_CODE['Python'];
          initialSubmitted[index] = false;
        });

        setCodes(initialCodes);
        setSubmitted(initialSubmitted);

        setCurrentProblem(0);
        setLanguage('Python');

        // Start timer after problems load
        setTimeRemaining(60 * 60);
        startTimeRef.current = Date.now();

      } catch (err) {
        console.error('Failed to load coding problems:', err);

        setError(
          'Failed to load coding problems. Please check your connection and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCodingProblems();
  }, []);

  useEffect(() => {
    // Do not start timer while questions are loading
    if (isLoading || error || problems.length === 0) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);

          // Automatically finish when time is over
          setTimeout(() => {
            handleFinish();
          }, 0);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLoading, error, problems.length]);
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
          Loading coding problems...
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
          padding: '80px 20px',
          textAlign: 'center'
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
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}
        >
          Unable to Load Coding Problems
        </p>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginBottom: '24px',
            maxWidth: '420px'
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

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCodeChange = (e) => {
    setCodes((prev) => ({ ...prev, [currentProblem]: e.target.value }));
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (!codes[currentProblem] || codes[currentProblem] === DEFAULT_CODE[language]) {
      setCodes((prev) => ({ ...prev, [currentProblem]: DEFAULT_CODE[lang] }));
    }
  };

  const handleSubmitProblem = () => {
    setSubmitted((prev) => ({ ...prev, [currentProblem]: true }));
  };

  const handleFinish = () => {
    clearInterval(timerRef.current);

    const elapsedSeconds = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    // Count submitted problems
    const submittedCount = Object.values(submitted).filter(
      Boolean
    ).length;

    const totalProblems = problems.length;

    // Temporary simulation scoring:
    // submitted problem = completed problem
    const score = submittedCount;

    const percentage =
      totalProblems > 0
        ? (score / totalProblems) * 100
        : 0;

    onComplete({
      score,
      total: totalProblems,
      percentage,
      timeTaken: `${minutes}m ${seconds}s`,
      correctCount: submittedCount,
      incorrectCount: 0,
      unansweredCount: totalProblems - submittedCount
    });
  };

  const allSubmitted =
    problems.length > 0 &&
    problems.every((_, index) => submitted[index]);
  const problem = problems[currentProblem];
  const isTimeLow = timeRemaining < 120;

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
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Coding Round — Problem {currentProblem + 1} of {problems.length}</div>
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

      {/* Main Area - Split View */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexWrap: 'wrap' }}>
        {/* Problem Description */}
        <div style={{ flex: 1, minWidth: '320px', padding: '24px', overflowY: 'auto', borderRight: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{problem.title}</h3>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: problem.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: problem.difficulty === 'Easy' ? 'var(--success-color)' : 'var(--warning-color)'
            }}>
              {problem.difficulty}
            </span>
            {submitted[currentProblem] && (
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success-color)' }}>
                ✓ Submitted
              </span>
            )}
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
            {problem.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Input Format</div>
              <pre style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>{problem.inputFormat}</pre>
            </div>
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Output Format</div>
              <pre style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>{problem.outputFormat}</pre>
            </div>
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Constraints</div>
              <pre style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>{problem.constraints}</pre>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Sample Input</div>
                <pre style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>{problem.sampleInput}</pre>
              </div>
              <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Sample Output</div>
                <pre style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>{problem.sampleOutput}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor Area */}
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
          {/* Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)',
            flexWrap: 'wrap'
          }}>
            <Code size={16} style={{ color: 'var(--text-muted)' }} />
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: `1px solid ${language === lang ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  backgroundColor: language === lang ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  color: language === lang ? 'var(--primary-color)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={codes[currentProblem]}
            onChange={handleCodeChange}
            spellCheck={false}
            style={{
              flex: 1,
              padding: '20px',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '14px',
              lineHeight: 1.6,
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              border: 'none',
              resize: 'none',
              outline: 'none',
              minHeight: '300px'
            }}
          />

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-outline"
                disabled={currentProblem === 0}
                onClick={() =>
                  setCurrentProblem((prev) => Math.max(0, prev - 1))
                }
                style={{
                  opacity: currentProblem === 0 ? 0.5 : 1
                }}
              >
                <ChevronLeft size={16} style={{ marginRight: '4px' }} />
                Previous
              </button>

              <button
                className="btn btn-outline"
                disabled={currentProblem === problems.length - 1}
                onClick={() =>
                  setCurrentProblem((prev) =>
                    Math.min(problems.length - 1, prev + 1)
                  )
                }
                style={{
                  opacity:
                    currentProblem === problems.length - 1
                      ? 0.5
                      : 1
                }}
              >
                Next
                <ChevronRight size={16} style={{ marginLeft: '4px' }} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" onClick={() => alert('Code execution is not available in simulation mode.')}>
                <Play size={16} style={{ marginRight: '4px' }} /> Run Code
              </button>
              {!submitted[currentProblem] ? (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitProblem}
                >
                  <Send size={16} style={{ marginRight: '4px' }} />
                  Submit Solution
                </button>
              ) : allSubmitted ? (
                <button
                  className="btn btn-primary"
                  onClick={handleFinish}
                >
                  Finish Coding Round
                </button>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--success-color)',
                      fontWeight: 600
                    }}
                  >
                    ✓ Problem Submitted
                  </span>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setCurrentProblem((prev) =>
                        Math.min(problems.length - 1, prev + 1)
                      )
                    }
                    disabled={currentProblem === problems.length - 1}
                  >
                    Next Problem
                    <ChevronRight
                      size={16}
                      style={{ marginLeft: '4px' }}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingRoundUI;
