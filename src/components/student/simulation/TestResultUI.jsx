import React from 'react';
import { Award, ArrowRight, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const TestResultUI = ({ title, results, onContinue }) => {
  const { score, total, percentage, timeTaken, correctCount, incorrectCount, unansweredCount } = results;

  let message = "";
  let messageColor = "var(--text-primary)";

  if (percentage >= 90) {
    message = "Excellent performance! You are highly prepared.";
    messageColor = "var(--success-color)";
  } else if (percentage >= 70) {
    message = "Good performance! You have successfully completed this stage.";
    messageColor = "var(--primary-color)";
  } else if (percentage >= 50) {
    message = "Fair performance. Review the recommended areas.";
    messageColor = "var(--warning-color)";
  } else {
    message = "More practice is recommended before progressing.";
    messageColor = "var(--danger-color)";
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <Award size={48} style={{ color: messageColor }} />
      </div>
      
      <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
        {title} Completed
      </h2>
      
      <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600, color: messageColor, marginBottom: '32px' }}>
        {message}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '600px', margin: '0 auto 32px' }}>
        <div style={{ padding: '24px', backgroundColor: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Score</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>{score} / {total}</div>
        </div>
        <div style={{ padding: '24px', backgroundColor: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Percentage</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary-color)' }}>{percentage.toFixed(1)}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', maxWidth: '800px', margin: '0 auto 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
          <CheckCircle size={24} color="var(--success-color)" />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{correctCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Correct</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
          <XCircle size={24} color="var(--danger-color)" />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{incorrectCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Incorrect</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
          <AlertCircle size={24} color="var(--warning-color)" />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{unansweredCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Unanswered</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
          <Clock size={24} color="var(--text-secondary)" />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{timeTaken}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Time Taken</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onContinue} style={{ padding: '12px 24px', fontSize: '16px' }}>
          Continue to Next Stage <ArrowRight size={18} style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div>
  );
};

export default TestResultUI;
