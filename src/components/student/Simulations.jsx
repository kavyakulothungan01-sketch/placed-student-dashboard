import React, { useState } from 'react';
import { Cpu, Lock, CheckCircle, Activity, Code, Users, PlayCircle, Award, FileText, RotateCcw } from 'lucide-react';
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
    icon: <Activity size={22} />,
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
    icon: <Cpu size={22} />,
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
    icon: <Code size={22} />,
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
    icon: <Users size={22} />,
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
        <div className="card">
          <TestResultUI
            title="Aptitude Test"
            results={stageResults.aptitude}
            onContinue={() => handleContinueFromResult('aptitude')}
          />
        </div>
      </main>
    );
  }

  if (view === 'result-technical') {
    return (
      <main className="dashboard-content">
        <div className="card">
          <TestResultUI
            title="Technical Assessment"
            results={stageResults.technical}
            onContinue={() => handleContinueFromResult('technical')}
          />
        </div>
      </main>
    );
  }

  if (view === 'result-coding') {
    return (
      <main className="dashboard-content">
        <div className="card">
          <TestResultUI
            title="Coding Round"
            results={stageResults.coding}
            onContinue={() => handleContinueFromResult('coding')}
          />
        </div>
      </main>
    );
  }

  if (view === 'result-hr') {
    return (
      <main className="dashboard-content">
        <div className="card">
          <TestResultUI
            title="HR Interview"
            results={stageResults.hr}
            onContinue={() => handleContinueFromResult('hr')}
          />
        </div>
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
        <div className="card">
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <Award size={56} style={{ color: 'var(--success-color)', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Placement Readiness Report</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Congratulations! You have completed the full campus recruitment simulation.</p>

            {/* Overall Score */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '6px solid var(--primary-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 40px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-color)' }}>{overallPercentage.toFixed(0)}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Overall</div>
            </div>

            {/* Individual Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Aptitude</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{apt.percentage?.toFixed(1) || 0}%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{apt.score || 0}/{apt.total || 30}</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Technical</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{tech.percentage?.toFixed(1) || 0}%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tech.score || 0}/{tech.total || 30}</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Coding</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{code.percentage?.toFixed(1) || 0}%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{code.score || 0}/{code.total || 2}</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>HR Interview</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{hr.percentage?.toFixed(1) || 0}%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{hr.score || 0}/{hr.total || 5}</div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left', marginBottom: '32px' }}>
              <div style={{ padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} color="var(--success-color)" /> Strengths
                </h4>
                <ul style={{ fontSize: '14px', color: 'var(--text-muted)', paddingLeft: '20px', margin: 0, lineHeight: 1.7 }}>
                  {(apt.percentage || 0) >= 70 && <li>Strong quantitative aptitude and reasoning skills.</li>}
                  {(tech.percentage || 0) >= 70 && <li>Solid technical and programming fundamentals.</li>}
                  {(code.percentage || 0) >= 70 && <li>Good problem-solving and coding ability.</li>}
                  {(hr.percentage || 0) >= 70 && <li>Effective communication and interview readiness.</li>}
                  {overallPercentage < 70 && <li>Willingness to attempt and complete the full simulation.</li>}
                </ul>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--warning-color)" /> Areas for Improvement
                </h4>
                <ul style={{ fontSize: '14px', color: 'var(--text-muted)', paddingLeft: '20px', margin: 0, lineHeight: 1.7 }}>
                  {(apt.percentage || 0) < 70 && <li>Practice more aptitude and reasoning problems.</li>}
                  {(tech.percentage || 0) < 70 && <li>Revise core technical concepts and data structures.</li>}
                  {(code.percentage || 0) < 70 && <li>Strengthen coding skills with more practice problems.</li>}
                  {(hr.percentage || 0) < 70 && <li>Work on communication and interview presentation.</li>}
                  {overallPercentage >= 70 && <li>Continue practicing to maintain your performance level.</li>}
                </ul>
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div style={{ textAlign: 'left', marginBottom: '36px', padding: '20px', backgroundColor: 'rgba(37, 99, 235, 0.04)', borderRadius: '10px', border: '1px solid rgba(37, 99, 235, 0.12)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--primary-color)' }}>Recommended Next Steps</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
                {overallPercentage >= 80
                  ? 'You are well-prepared for campus placements! Continue with mock interviews and review company-specific question patterns for the best results.'
                  : overallPercentage >= 60
                  ? 'Good progress! Focus on your weaker areas identified above. Use the Study Modules and Improvement Path to target specific skill gaps.'
                  : 'Focus on building strong fundamentals. Use the PLACED study materials and take multiple simulation attempts to build confidence before your placement drives.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary">
                <FileText size={18} style={{ marginRight: '8px' }} /> View Detailed Report
              </button>
              <button className="btn btn-outline" onClick={resetSimulation}>
                <RotateCcw size={16} style={{ marginRight: '8px' }} /> Start New Simulation
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

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h2 className="card-title">Campus Placement Simulation</h2>
          {completedStages === 0 && (
            <button className="btn btn-primary" onClick={() => setView('start-modal')}>
              <PlayCircle size={18} style={{ marginRight: '6px' }} /> Start Campus Simulation
            </button>
          )}
        </div>

        <div style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '15px' }}>
            Experience a complete campus recruitment process through multiple stages. Complete each stage successfully to unlock the next stage.
          </p>

          {/* Progress Bar */}
          {completedStages > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Simulation Progress</span>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--primary-color)' }}>{progressPercentage}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: 'var(--primary-color)', width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out', borderRadius: '4px' }}></div>
              </div>
            </div>
          )}

          {/* Stage Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {STAGES.map((stage) => {
              const isCompleted = completedStages >= stage.id;
              const isAvailable = completedStages === stage.id - 1 && completedStages > 0;
              const isLocked = !isCompleted && !isAvailable;

              return (
                <div key={stage.id} style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: `1.5px solid ${isAvailable ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  backgroundColor: isAvailable ? 'var(--surface-color)' : (isLocked ? 'var(--bg-color)' : 'var(--surface-color)'),
                  opacity: isLocked ? 0.65 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: isAvailable ? '0 4px 16px rgba(37, 99, 235, 0.1)' : 'none',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: isCompleted ? 'var(--success-color)' : (isAvailable ? 'var(--primary-color)' : 'var(--border-color)'),
                      color: isLocked ? 'var(--text-muted)' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isCompleted ? <CheckCircle size={20} /> : (isLocked ? <Lock size={20} /> : stage.icon)}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>0{stage.id}</span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{stage.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', flex: 1, lineHeight: 1.5 }}>{stage.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isAvailable ? '14px' : '0' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>⏱ {stage.duration}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>{stage.questions}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isCompleted ? 'var(--success-color)' : (isAvailable ? 'var(--primary-color)' : 'var(--text-muted)')
                    }}>
                      {isCompleted ? '✓ Completed' : (isAvailable ? 'Ready to Start' : 'Locked')}
                    </span>
                  </div>

                  {isAvailable && (
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                      onClick={() => startTestForStage(stage.key)}
                    >
                      Start {stage.title}
                    </button>
                  )}

                  {isCompleted && stageResults[stage.key] && (
                    <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: 'rgba(34, 197, 94, 0.08)', borderRadius: '6px', fontSize: '13px', color: 'var(--success-color)', fontWeight: 600, textAlign: 'center' }}>
                      Score: {stageResults[stage.key].score}/{stageResults[stage.key].total} ({stageResults[stage.key].percentage.toFixed(0)}%)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
