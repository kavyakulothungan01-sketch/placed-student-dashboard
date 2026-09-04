import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Clock, ArrowRight } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    assessmentService
      .getAssessments()
      .then((data) => {
        if (Array.isArray(data)) {
          setAssessments(data);
        }
      })
      .catch((err) => {
        console.error('Error loading assessments:', err);
      });
  }, []);

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

      <div className="simulations-grid">
        {assessments.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No diagnostic assessments currently scheduled in your database.
          </div>
        ) : (
          assessments.map((ass) => (
            <div className={`sim-card ${ass.isActive ? 'active' : ''}`} key={ass.id}>
              <div className="sim-header">
                <span className={`sim-badge ${ass.status === 'upcoming' ? 'info' : ''}`}>{ass.statusBadge}</span>
                <span className="sim-time"><Clock size={14} style={{ marginRight: '4px' }} /> {ass.duration}</span>
              </div>
              <h4 className="sim-title">{ass.title}</h4>
              <p className="sim-sub">{ass.description}</p>
              <div className="sim-footer">
                <span className="sim-score">{ass.questionCount}</span>
                {ass.status === 'pending' ? (
                  <button className="btn btn-primary btn-sm">
                    Start Assessment <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </button>
                ) : (
                  <button className="btn btn-outline btn-sm">Launch Challenge</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Assessments;
