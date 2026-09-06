import React, { useState } from 'react';
import { Cpu, Lock, CheckCircle2, Activity, Code, Users, PlayCircle, Award, FileText, RotateCcw, Clock, ArrowRight, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import SimulationStartModal from './simulation/SimulationStartModal';
import GenericTestUI from './simulation/GenericTestUI';
import CodingRoundUI from './simulation/CodingRoundUI';
import HRInterviewUI from './simulation/HRInterviewUI';
import TestResultUI from './simulation/TestResultUI';

/*
  VIEW STATES:
    overview        – stage cards with Start button
    start-modal     – confirmation modal overlay
    test-aptitude   – aptitude test UI
    result-aptitude – aptitude result
    test-technical  – technical test UI
    result-technical– technical result
    test-coding     – coding round UI
    result-coding   – coding result
    test-hr         – HR interview UI
    result-hr       – HR result
    final-report    – overall placement readiness report
*/

const STAGES = [
  {
    id: 1,
    key: 'aptitude',
    title: 'Aptitude Test',
    description: 'Test your quantitative aptitude, logical reasoning, and verbal ability.',
    duration: '30 Minutes',
    questions: '30 Questions',
    timeLimitMinutes: 30,
    questionCount: 30,
  },
  {
    id: 2,
    key: 'technical',
    title: 'Technical Assessment',
    description: 'Test your programming fundamentals, technical knowledge, and core concepts.',
    duration: '40 Minutes',
    questions: '30 Questions',
    timeLimitMinutes: 40,
    questionCount: 30,
  },
  {
    id: 3,
    key: 'coding',
    title: 'Coding Round',
    description: 'Solve programming problems and test your problem-solving skills.',
    duration: '60 Minutes',
    questions: '4 Coding Problems',
    timeLimitMinutes: 60,
    questionCount: 4,
  },
  {
    id: 4,
    key: 'hr',
    title: 'HR Interview',
    description: 'Practice HR interview questions and evaluate your communication and interview readiness.',
    duration: '20 Minutes',
    questions: '5 Questions',
    timeLimitMinutes: 20,
    questionCount: 5,
  }
];

const Simulations = () => {
  const [view, setView] = useState('overview');
  const [completedStages, setCompletedStages] = useState(0); // 0 = none, 1 = aptitude done, etc.
  const [stageResults, setStageResults] = useState({});

  const progressPercentage = Math.round((completedStages / 4) * 100);

  const handleStageComplete = (stageKey, results) => {
    setStageResults((prev) => ({ ...prev, [stageKey]: results }));
    setView(`result-${stageKey}`);
  };

  const handleContinueFromResult = (stageKey) => {
    const stageIndex = STAGES.findIndex((s) => s.key === stageKey);
    const newCompleted = stageIndex + 1;
    setCompletedStages(newCompleted);

    if (newCompleted >= 4) {
      setView('final-report');
    } else {
      setView('overview');
    }
  };

  const resetSimulation = () => {
    setView('overview');
    setCompletedStages(0);
    setStageResults({});
  };

  // ─── RENDER TEST VIEWS ────────────────────────────────────
  if (view === 'test-aptitude') {
    return (
      <main className="dashboard-content" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <GenericTestUI
          stage="aptitude"
          stageLabel="Aptitude Test"
          questionCount={30}
          timeLimitMinutes={30}
          onComplete={(r) => handleStageComplete('aptitude', r)}
          onExit={() => setView('overview')}
        />
      </main>
    );
  }

  if (view === 'test-technical') {
    return (
      <main className="dashboard-content" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <GenericTestUI
          stage="technical"
          stageLabel="Technical Assessment"
          questionCount={30}
          timeLimitMinutes={40}
          onComplete={(r) => handleStageComplete('technical', r)}
          onExit={() => setView('overview')}
        />
      </main>
    );
  }

  if (view === 'test-coding') {
    return (
      <main className="dashboard-content" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <CodingRoundUI
          onComplete={(r) => handleStageComplete('coding', r)}
          onExit={() => setView('overview')}
        />
      </main>
    );
  }

  if (view === 'test-hr') {
    return (
      <main className="dashboard-content" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <HRInterviewUI
          onComplete={(r) => handleStageComplete('hr', r)}
          onExit={() => setView('overview')}
        />
      </main>
    );
  }

  // ─── RENDER RESULT VIEWS ──────────────────────────────────
  if (view === 'result-aptitude') {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title="Aptitude Test"
          results={stageResults.aptitude}
          onContinue={() => handleContinueFromResult('aptitude')}
        />
      </main>
    );
  }

  if (view === 'result-technical') {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title="Technical Assessment"
          results={stageResults.technical}
          onContinue={() => handleContinueFromResult('technical')}
        />
      </main>
    );
  }

  if (view === 'result-coding') {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title="Coding Round"
          results={stageResults.coding}
          onContinue={() => handleContinueFromResult('coding')}
        />
      </main>
    );
  }

  if (view === 'result-hr') {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title="HR Interview"
          results={stageResults.hr}
          onContinue={() => handleContinueFromResult('hr')}
        />
      </main>
    );
  }

  // ─── FINAL REPORT ─────────────────────────────────────────
  if (view === 'final-report') {
    const apt = stageResults.aptitude || {};
    const tech = stageResults.technical || {};
    const code = stageResults.coding || {};
    const hr = stageResults.hr || {};
    const overallPercentage = ((apt.percentage || 0) + (tech.percentage || 0) + (code.percentage || 0) + (hr.percentage || 0)) / 4;

    return (
      <main className="dashboard-content">
        <div className="test-wrapper">
          <div className="results-card">
            
            {/* Banner matching AssessmentTest Results Banner */}
            <div className="results-banner">
              <Award size={40} style={{ marginBottom: '4px' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
                Simulation Completed
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Placement Readiness Report</h2>
              <div className="results-score-highlight">
                {overallPercentage.toFixed(0)}%
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', opacity: 0.9 }}>
                Overall Readiness
              </div>
            </div>

            {/* Individual Score Stats Chips */}
            <div className="results-stats-row">
              <div className="result-stat-chip">
                <span className="result-stat-num" style={{ color: 'var(--primary)' }}>{apt.percentage?.toFixed(1) || 0}%</span>
                <span className="result-stat-lbl">Aptitude</span>
              </div>
              <div className="result-stat-chip">
                <span className="result-stat-num" style={{ color: 'var(--primary)' }}>{tech.percentage?.toFixed(1) || 0}%</span>
                <span className="result-stat-lbl">Technical</span>
              </div>
              <div className="result-stat-chip">
                <span className="result-stat-num" style={{ color: 'var(--primary)' }}>{code.percentage?.toFixed(1) || 0}%</span>
                <span className="result-stat-lbl">Coding</span>
              </div>
              <div className="result-stat-chip">
                <span className="result-stat-num" style={{ color: 'var(--primary)' }}>{hr.percentage?.toFixed(1) || 0}%</span>
                <span className="result-stat-lbl">HR Interview</span>
              </div>
            </div>

            {/* Review Section */}
            <div className="review-section">
              <h3 className="review-section-title">Feedback & Next Steps</h3>
              
              {/* Strengths Card */}
              <div className="review-item-card">
                <div className="review-item-header">
                  <span className="review-item-qnum" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" /> Strengths
                  </span>
                </div>
                <div className="review-answers-box" style={{ marginTop: '8px' }}>
                  {(apt.percentage || 0) >= 70 && <div className="review-answer-line">• Strong quantitative aptitude and reasoning skills.</div>}
                  {(tech.percentage || 0) >= 70 && <div className="review-answer-line">• Solid technical and programming fundamentals.</div>}
                  {(code.percentage || 0) >= 70 && <div className="review-answer-line">• Good problem-solving and coding ability.</div>}
                  {(hr.percentage || 0) >= 70 && <div className="review-answer-line">• Effective communication and interview readiness.</div>}
                  {overallPercentage < 70 && <div className="review-answer-line">• Willingness to attempt and complete the full simulation.</div>}
                </div>
              </div>

              {/* Improvements Card */}
              <div className="review-item-card">
                <div className="review-item-header">
                  <span className="review-item-qnum" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} color="#B45309" /> Areas for Improvement
                  </span>
                </div>
                <div className="review-answers-box" style={{ marginTop: '8px' }}>
                  {(apt.percentage || 0) < 70 && <div className="review-answer-line">• Practice more aptitude and reasoning problems.</div>}
                  {(tech.percentage || 0) < 70 && <div className="review-answer-line">• Revise core technical concepts and data structures.</div>}
                  {(code.percentage || 0) < 70 && <div className="review-answer-line">• Strengthen coding skills with more practice problems.</div>}
                  {(hr.percentage || 0) < 70 && <div className="review-answer-line">• Work on communication and interview presentation.</div>}
                  {overallPercentage >= 70 && <div className="review-answer-line">• Continue practicing to maintain your performance level.</div>}
                </div>
              </div>
              
              {/* Recommendation Box */}
              <div className="review-explanation-box" style={{ marginTop: '16px' }}>
                <strong>Recommendation: </strong> 
                {overallPercentage >= 80
                  ? 'You are well-prepared for campus placements! Continue with mock interviews and review company-specific question patterns for the best results.'
                  : overallPercentage >= 60
                  ? 'Good progress! Focus on your weaker areas identified above. Use the Study Modules and Improvement Path to target specific skill gaps.'
                  : 'Focus on building strong fundamentals. Use the PLACED study materials and take multiple simulation attempts to build confidence before your placement drives.'}
              </div>
            </div>

            {/* Back Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button className="btn btn-outline" onClick={resetSimulation}>
                <RotateCcw size={14} /> Start New Simulation
              </button>
              <button className="btn btn-primary">
                <FileText size={14} /> View Detailed Report
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── OVERVIEW (DEFAULT VIEW) ──────────────────────────────
  const startTestForStage = (stageKey) => {
    setView(`test-${stageKey}`);
  };

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <Cpu size={24} style={{ marginRight: '10px' }} /> Practice & Multi-Stage Recruitment Simulations
          </h1>
          <p className="view-sub">Experience full multi-stage recruitment drives: Aptitude → Technical → Coding → HR Interview.</p>
        </div>
      </div>

      <div className="test-wrapper">
        <div className="instructions-card">
          <div className="instructions-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="sim-badge" style={{ background: '#DBEAFE', color: '#1E40AF' }}>FULL SIMULATION</span>
            </div>
            <h1 className="instructions-title">
              <Award size={26} color="var(--primary)" /> Campus Placement Simulation
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
              Experience a complete campus recruitment process through multiple stages. Complete each stage successfully to unlock the next stage.
            </p>
          </div>

          {completedStages > 0 && (
            <div className="instructions-meta-grid" style={{ marginTop: '0' }}>
              <div className="instructions-meta-box" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                <span className="instructions-meta-label">Simulation Progress</span>
                <span className="instructions-meta-value" style={{ color: 'var(--primary)' }}>{progressPercentage}% Completed</span>
              </div>
            </div>
          )}

          {completedStages === 0 && (
            <div className="instructions-actions">
              <button className="btn btn-primary" onClick={() => setView('start-modal')}>
                Start Simulation <PlayCircle size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="simulations-grid">
          {STAGES.map((stage) => {
            const isCompleted = completedStages >= stage.id;
            const isAvailable = completedStages === stage.id - 1 && completedStages > 0;
            const isLocked = !isCompleted && !isAvailable && completedStages > 0;
            const isInitial = completedStages === 0;

            let badgeStatus = 'pending';
            let badgeText = 'Locked';
            let statusColor = {};

            if (isCompleted) {
              badgeStatus = 'success';
              badgeText = 'Completed';
              statusColor = { background: '#DCFCE7', color: '#15803D' };
            } else if (isAvailable || (isInitial && stage.id === 1)) {
              badgeStatus = 'info';
              badgeText = 'Ready to Start';
              statusColor = { background: '#EFF6FF', color: '#1E40AF' };
            }

            return (
              <div className={`sim-card ${isAvailable || (isInitial && stage.id === 1) ? 'active' : ''}`} key={stage.id} style={{ opacity: isLocked ? 0.6 : 1 }}>
                <div className="sim-header">
                  <span className={`sim-badge ${badgeStatus}`} style={statusColor}>
                    Stage 0{stage.id} - {badgeText}
                  </span>
                  <span className="sim-time"><Clock size={14} style={{ marginRight: '4px' }} /> {stage.duration}</span>
                </div>
                <h4 className="sim-title">{stage.title}</h4>
                <p className="sim-sub">{stage.description}</p>
                
                <div className="sim-footer">
                  <span className="sim-score" style={isCompleted ? { fontWeight: '700', color: 'var(--primary)' } : {}}>
                    {isCompleted && stageResults[stage.key] 
                      ? `Score: ${stageResults[stage.key].score} / ${stageResults[stage.key].total}`
                      : stage.questions}
                  </span>
                  
                  {isAvailable ? (
                    <button 
                      type="button"
                      className="btn btn-primary btn-sm" 
                      onClick={() => startTestForStage(stage.key)}
                    >
                      Start Stage <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </button>
                  ) : isCompleted ? (
                    <button 
                      type="button"
                      className="btn btn-outline btn-sm" 
                    >
                      <CheckCircle size={13} style={{ marginRight: '4px' }} /> Done
                    </button>
                  ) : isLocked ? (
                    <button 
                      type="button"
                      className="btn btn-outline btn-sm" 
                      disabled
                      style={{ opacity: 0.5 }}
                    >
                      <Lock size={13} style={{ marginRight: '4px' }} /> Locked
                    </button>
                  ) : (
                    <button 
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setView('start-modal')}
                    >
                      Start Simulation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Modal */}
      {view === 'start-modal' && (
        <SimulationStartModal
          onClose={() => setView('overview')}
          onStart={() => {
            setCompletedStages(0);
            setView('test-aptitude');
          }}
        />
      )}
    </main>
  );
};

export default Simulations;
