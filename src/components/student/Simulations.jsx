import React, { useState } from 'react';
import { MonitorPlay, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import GenericTestUI from './simulation/GenericTestUI';
import CodingRoundUI from './simulation/CodingRoundUI';
import HRInterviewUI from './simulation/HRInterviewUI';
import TestResultUI from './simulation/TestResultUI';
import './AssessmentTest.css';

/*
  PRACTICE & SIMULATIONS:
  Individual practice tests. Students can take any test independently at any time.
  No sequential locking between tests.
*/

const PRACTICE_TESTS = [
  {
    id: 1,
    key: 'aptitude',
    title: 'Aptitude Test',
    description: 'Practice your quantitative aptitude, logical reasoning, and verbal ability with randomized practice sets.',
    duration: '30 Minutes',
    questions: '30 Questions',
    timeLimitMinutes: 30,
    questionCount: 30,
  },
  {
    id: 2,
    key: 'technical',
    title: 'Technical Assessment',
    description: 'Practice programming fundamentals, data structures, DBMS, and core computer science concepts.',
    duration: '40 Minutes',
    questions: '30 Questions',
    timeLimitMinutes: 40,
    questionCount: 30,
  },
  {
    id: 3,
    key: 'coding',
    title: 'Coding Round',
    description: 'Solve programming problems in Python, Java, C, or C++ and test your problem-solving skills.',
    duration: '60 Minutes',
    questions: '4 Coding Problems',
    timeLimitMinutes: 60,
    questionCount: 4,
  },
  {
    id: 4,
    key: 'hr',
    title: 'HR Interview Practice',
    description: 'Practice HR interview questions and evaluate your communication and interview readiness.',
    duration: '20 Minutes',
    questions: '5 Questions',
    timeLimitMinutes: 20,
    questionCount: 5,
  }
];

const Simulations = () => {
  const [activeTest, setActiveTest] = useState(null); // 'aptitude' | 'technical' | 'coding' | 'hr'
  const [viewState, setViewState] = useState('overview'); // 'overview' | 'test' | 'result'
  const [practiceResults, setPracticeResults] = useState(() => {
    try {
      const saved = localStorage.getItem('placed_practice_results');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleStartTest = (testKey) => {
    setActiveTest(testKey);
    setViewState('test');
  };

  const handleTestComplete = (testKey, results) => {
    const updated = { ...practiceResults, [testKey]: results };
    setPracticeResults(updated);
    try {
      localStorage.setItem('placed_practice_results', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to cache practice result:', e);
    }
    setActiveTest(testKey);
    setViewState('result');
  };

  const handleBackToOverview = () => {
    setActiveTest(null);
    setViewState('overview');
  };

  // ─── RENDER ACTIVE TEST VIEW ──────────────────────────────
  if (viewState === 'test' && activeTest) {
    if (activeTest === 'aptitude') {
      return (
        <main className="dashboard-content">
          <GenericTestUI
            stage="aptitude"
            stageLabel="Aptitude Test Practice"
            questionCount={30}
            timeLimitMinutes={30}
            onComplete={(r) => handleTestComplete('aptitude', r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }

    if (activeTest === 'technical') {
      return (
        <main className="dashboard-content">
          <GenericTestUI
            stage="technical"
            stageLabel="Technical Assessment Practice"
            questionCount={30}
            timeLimitMinutes={40}
            onComplete={(r) => handleTestComplete('technical', r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }

    if (activeTest === 'coding') {
      return (
        <main className="dashboard-content">
          <CodingRoundUI
            onComplete={(r) => handleTestComplete('coding', r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }

    if (activeTest === 'hr') {
      return (
        <main className="dashboard-content">
          <HRInterviewUI
            onComplete={(r) => handleTestComplete('hr', r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }
  }

  // ─── RENDER TEST RESULT VIEW ──────────────────────────────
  if (viewState === 'result' && activeTest && practiceResults[activeTest]) {
    const currentConfig = PRACTICE_TESTS.find((t) => t.key === activeTest);
    return (
      <main className="dashboard-content">
        <TestResultUI
          title={currentConfig?.title || 'Practice Test'}
          subtitle="Practice Completed"
          continueLabel="Back to Practice Tests"
          results={practiceResults[activeTest]}
          onContinue={handleBackToOverview}
          onRetake={() => handleStartTest(activeTest)}
        />
      </main>
    );
  }

  // ─── OVERVIEW (INDIVIDUAL PRACTICE DASHBOARD) ─────────────
  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <MonitorPlay size={24} style={{ marginRight: '10px' }} /> Practice & Simulations
          </h1>
          <p className="view-sub">Practice individual recruitment rounds independently at your own pace.</p>
        </div>
      </div>

      <div className="test-wrapper">
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>
            Individual Practice Tests
          </h2>
        </div>

        <div className="simulations-grid">
          {PRACTICE_TESTS.map((test) => {
            const result = practiceResults[test.key];
            const hasCompleted = Boolean(result);

            return (
              <div className="sim-card active" key={test.id}>
                <div className="sim-header">
                  <span
                    className="sim-badge"
                    style={
                      hasCompleted
                        ? { background: '#DCFCE7', color: '#15803D' }
                        : { background: '#EFF6FF', color: '#1E40AF' }
                    }
                  >
                    {hasCompleted ? 'Completed' : 'Ready to Start'}
                  </span>
                  <span className="sim-time">
                    <Clock size={14} style={{ marginRight: '4px' }} /> {test.duration}
                  </span>
                </div>
                <h4 className="sim-title">{test.title}</h4>
                <p className="sim-sub">{test.description}</p>

                <div className="sim-footer">
                  <span className="sim-score" style={hasCompleted ? { fontWeight: '700', color: 'var(--primary)' } : {}}>
                    {hasCompleted
                      ? `Score: ${result.score} / ${result.total}`
                      : test.questions}
                  </span>

                  {hasCompleted ? (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleStartTest(test.key)}
                    >
                      <RotateCcw size={13} style={{ marginRight: '4px' }} /> Retake Test
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStartTest(test.key)}
                    >
                      Start Test <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Simulations;
