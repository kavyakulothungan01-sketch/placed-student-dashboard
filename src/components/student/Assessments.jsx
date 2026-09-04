import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardCheck, Clock, ArrowRight, AlertCircle, RotateCcw } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import AssessmentTest from './AssessmentTest';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [activeAssessmentId, setActiveAssessmentId] = useState(null);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [completedAttempts, setCompletedAttempts] = useState({});

  const loadAssessments = useCallback(async () => {
    try {
      const data = await assessmentService.getAssessments();
      if (Array.isArray(data)) {
        setAssessments(data);
      }

      // Fetch student's latest completed attempt for aptitude-diagnostic-01
      const latestAttempt = await assessmentService.getLatestAssessmentAttempt('aptitude-diagnostic-01');
      if (latestAttempt) {
        setCompletedAttempts((prev) => ({
          ...prev,
          'aptitude-diagnostic-01': latestAttempt
        }));
      }
    } catch (err) {
      console.error('Error loading assessments:', err);
    }
  }, []);

  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);

  const handleAssessmentClick = (ass) => {
    if (ass.id === 'aptitude-diagnostic-01') {
      setActiveAssessmentId(ass.id);
      setNoticeMessage('');
    } else {
      setNoticeMessage(`This assessment is being prepared.`);
      setTimeout(() => {
        setNoticeMessage('');
      }, 4000);
    }
  };

  // If a test is active, render the assessment runner
  if (activeAssessmentId) {
    return (
      <AssessmentTest
        assessmentId={activeAssessmentId}
        onBack={() => {
          setActiveAssessmentId(null);
          loadAssessments();
        }}
      />
    );
  }

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <ClipboardCheck size={24} style={{ marginRight: '10px' }} /> Assessments & Diagnostic Tests
          </h1>
          <p className="view-sub">Timed aptitude, coding, and technical CS core assessments.</p>
        </div>
      </div>

      {noticeMessage && (
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          borderRadius: 'var(--radius)',
          padding: '12px 18px',
          color: '#1E40AF',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{noticeMessage}</span>
        </div>
      )}

      <div className="simulations-grid">
        {assessments.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No diagnostic assessments currently scheduled in your database.
          </div>
        ) : (
          assessments.map((ass) => {
            const latestAttempt = completedAttempts[ass.id];
            const isCompleted = Boolean(latestAttempt && latestAttempt.status === 'completed');
            const displayBadge = isCompleted ? 'Completed' : ass.statusBadge;
            const displayScore = isCompleted 
              ? `Score: ${latestAttempt.score} / ${latestAttempt.total_marks || 20}` 
              : ass.questionCount;

            return (
              <div className={`sim-card ${ass.isActive ? 'active' : ''}`} key={ass.id}>
                <div className="sim-header">
                  <span className={`sim-badge ${isCompleted ? 'success' : (ass.status === 'upcoming' ? 'info' : '')}`} style={isCompleted ? { background: '#DCFCE7', color: '#15803D' } : {}}>
                    {displayBadge}
                  </span>
                  <span className="sim-time"><Clock size={14} style={{ marginRight: '4px' }} /> {ass.duration}</span>
                </div>
                <h4 className="sim-title">{ass.title}</h4>
                <p className="sim-sub">{ass.description}</p>
                <div className="sim-footer">
                  <span className="sim-score" style={isCompleted ? { fontWeight: '700', color: 'var(--primary)' } : {}}>
                    {displayScore}
                  </span>
                  {isCompleted ? (
                    <button 
                      type="button"
                      className="btn btn-outline btn-sm" 
                      onClick={() => handleAssessmentClick(ass)}
                    >
                      <RotateCcw size={13} style={{ marginRight: '4px' }} /> Retake Test
                    </button>
                  ) : ass.status === 'pending' ? (
                    <button 
                      type="button"
                      className="btn btn-primary btn-sm" 
                      onClick={() => handleAssessmentClick(ass)}
                    >
                      Start Assessment <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </button>
                  ) : (
                    <button 
                      type="button"
                      className="btn btn-outline btn-sm" 
                      onClick={() => handleAssessmentClick(ass)}
                    >
                      Launch Challenge
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};

export default Assessments;
