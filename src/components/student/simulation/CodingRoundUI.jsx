import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
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
      <div className="test-wrapper" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <Loader size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Loading coding problems...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-wrapper">
        <div className="test-error-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <AlertTriangle size={20} /> Unable to Load Coding Problems
          </div>
          <p style={{ fontSize: '13px', margin: 0 }}>{error}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button className="btn btn-outline btn-sm" onClick={onExit}>
              <ArrowLeft size={14} /> Return to Overview
            </button>
          </div>
        </div>
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
  const isTimeLow = timeRemaining <= 300; // 5 min warning

  return (
    <div className="test-wrapper">
      {/* Header */}
      <div className="test-topbar">
        <div className="test-title-area">
          <span className="test-title">Coding Round</span>
          <span className="test-progress-tag">
            Problem {currentProblem + 1} of {problems.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isTimeLow && (
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#B45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={14} /> 5 Minutes Remaining
            </span>
          )}
          <div className={`test-timer ${isTimeLow ? 'timer-warning' : ''} ${timeRemaining <= 60 ? 'timer-danger' : ''}`}>
            <Clock size={16} />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Main Area - Split View */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexWrap: 'wrap' }}>
        {/* Problem Description - Styled similarly to question-card */}
        <div className="question-card" style={{ flex: 1, minWidth: '320px', margin: 0, borderRadius: 0, borderRight: '1px solid var(--border-light)', overflowY: 'auto' }}>
          <div className="question-header" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{problem.title}</h3>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="question-marks-badge" style={{ 
                backgroundColor: problem.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: problem.difficulty === 'Easy' ? 'var(--success)' : '#B45309',
                borderColor: 'transparent'
              }}>
                {problem.difficulty}
              </span>
              {submitted[currentProblem] && (
                <span className="question-marks-badge" style={{ backgroundColor: '#DCFCE7', color: '#15803D', borderColor: 'transparent' }}>
                  ✓ Submitted
                </span>
              )}
            </div>
          </div>

          <div className="question-text" style={{ whiteSpace: 'pre-wrap', marginBottom: '24px', fontSize: '14.5px' }}>
            {problem.description}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Input Format</div>
              <pre style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{problem.inputFormat}</pre>
            </div>
            <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Output Format</div>
              <pre style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{problem.outputFormat}</pre>
            </div>
            <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Constraints</div>
              <pre style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{problem.constraints}</pre>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Sample Input</div>
                <pre style={{ fontSize: '13px', color: 'var(--text)', margin: 0, fontFamily: 'monospace' }}>{problem.sampleInput}</pre>
              </div>
              <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Sample Output</div>
                <pre style={{ fontSize: '13px', color: 'var(--text)', margin: 0, fontFamily: 'monospace' }}>{problem.sampleOutput}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor Area */}
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
          {/* Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-card)',
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
                  border: `1px solid ${language === lang ? 'var(--primary)' : 'transparent'}`,
                  backgroundColor: language === lang ? '#EFF6FF' : 'transparent',
                  color: language === lang ? 'var(--primary)' : 'var(--text-muted)',
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
          <div className="question-nav-bar" style={{ borderRadius: 0, borderTop: '1px solid var(--border-light)' }}>
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
                <ArrowLeft size={14} />
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
                  opacity: currentProblem === problems.length - 1 ? 0.5 : 1
                }}
              >
                Next
                <ArrowRight size={14} />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" onClick={() => alert('Code execution is not available in simulation mode.')}>
                <Play size={14} /> Run Code
              </button>
              
              {!submitted[currentProblem] ? (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitProblem}
                >
                  <Send size={14} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#15803D', fontWeight: 600 }}>
                    ✓ Problem Submitted
                  </span>
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentProblem((prev) => Math.min(problems.length - 1, prev + 1))}
                    disabled={currentProblem === problems.length - 1}
                  >
                    Next Problem
                    <ArrowRight size={14} />
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
