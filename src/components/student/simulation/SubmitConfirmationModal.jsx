import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const SubmitConfirmationModal = ({ answeredCount, totalCount, onCancel, onSubmit }) => {
  const unansweredCount = totalCount - answeredCount;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', // Dark enough overlay
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'var(--surface-color, #ffffff)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px', // 500px to 600px max
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        boxSizing: 'border-box'
      }}>
        
        {/* Modal Header */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid var(--border-color, #e2e8f0)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexShrink: 0
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 700, 
            margin: 0, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: 'var(--text-primary, #0f172a)'
          }}>
            <CheckCircle size={20} color="var(--primary-color, #2563eb)" /> Submit Test?
          </h2>
          <button 
            onClick={onCancel} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted, #64748b)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Content (Scrollable) */}
        <div style={{ 
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            marginBottom: '24px', 
            backgroundColor: 'var(--bg-color, #f8fafc)', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success-color, #22c55e)' }}>
                {answeredCount}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted, #64748b)' }}>
                Answered
              </div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color, #e2e8f0)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                color: unansweredCount > 0 ? 'var(--danger-color, #ef4444)' : 'var(--text-primary, #0f172a)' 
              }}>
                {unansweredCount}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted, #64748b)' }}>
                Unanswered
              </div>
            </div>
          </div>
          
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--text-muted, #64748b)', 
            textAlign: 'center', 
            margin: 0,
            lineHeight: 1.5
          }}>
            Once submitted, your answers cannot be changed. Are you sure you want to proceed?
          </p>
        </div>
        
        {/* Modal Footer */}
        <div style={{ 
          padding: '20px 24px', 
          backgroundColor: 'var(--bg-color, #f8fafc)', 
          borderTop: '1px solid var(--border-color, #e2e8f0)', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px',
          flexShrink: 0
        }}>
          <button className="btn btn-outline" onClick={onCancel}>
            Continue Test
          </button>
          <button className="btn btn-primary" onClick={onSubmit} style={{ backgroundColor: 'var(--primary-color, #2563eb)' }}>
            Submit Test
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;
