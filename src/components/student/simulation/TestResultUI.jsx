import React from 'react';
import { Award, ArrowLeft, ArrowRight } from 'lucide-react';

const TestResultUI = ({ title, results, onContinue }) => {
  const { score, total, percentage, timeTaken, correctCount, incorrectCount, unansweredCount } = results;

  let message = "";
  if (percentage >= 90) {
    message = "Excellent performance! You are highly prepared.";
  } else if (percentage >= 70) {
    message = "Good performance! You have successfully completed this stage.";
  } else if (percentage >= 50) {
    message = "Fair performance. Review the recommended areas.";
  } else {
    message = "More practice is recommended before progressing.";
  }

  return (
    <div className="test-wrapper">
      <div className="results-card">
        {/* Banner */}
        <div className="results-banner">
          <Award size={40} style={{ marginBottom: '4px' }} />
          <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
            Stage Completed
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{title}</h2>
          <div className="results-score-highlight">
            {score} / {total}
          </div>
          <div style={{ fontSize: '15px', fontWeight: '600', opacity: 0.9 }}>
            Score: {percentage.toFixed(1)}%
          </div>
        </div>

        {/* Message */}
        <p style={{ textAlign: 'center', fontSize: '15px', fontWeight: 600, margin: '24px 0', color: 'var(--text)' }}>
          {message}
        </p>

        {/* Stat Chips */}
        <div className="results-stats-row">
          <div className="result-stat-chip correct">
            <span className="result-stat-num">{correctCount}</span>
            <span className="result-stat-lbl">Correct Answers</span>
          </div>
          <div className="result-stat-chip incorrect">
            <span className="result-stat-num">{incorrectCount}</span>
            <span className="result-stat-lbl">Incorrect Answers</span>
          </div>
          <div className="result-stat-chip unanswered">
            <span className="result-stat-num">{unansweredCount}</span>
            <span className="result-stat-lbl">Unanswered</span>
          </div>
        </div>

        {/* Time Taken */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div className="result-stat-chip" style={{ width: 'auto', padding: '16px 32px' }}>
            <span className="result-stat-num" style={{ color: 'var(--text)' }}>{timeTaken}</span>
            <span className="result-stat-lbl">Total Time Taken</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button className="btn btn-primary" onClick={onContinue}>
            Continue to Next Stage <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultUI;
