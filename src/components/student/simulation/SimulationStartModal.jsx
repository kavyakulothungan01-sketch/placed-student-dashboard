import React from 'react';
import { X, PlayCircle } from 'lucide-react';

const STAGES = [
  {
    id: '01',
    title: 'Aptitude Test',
    meta: '30 Questions • 30 Minutes',
    desc: 'Test quantitative, logical reasoning and verbal ability.'
  },
  {
    id: '02',
    title: 'Technical Assessment',
    meta: '30 Questions • 40 Minutes',
    desc: 'Programming fundamentals and core technical knowledge.'
  },
  {
    id: '03',
    title: 'Coding Round',
    meta: '4 Coding Problems • 60 Minutes',
    desc: 'Test problem-solving and programming.'
  },
  {
    id: '04',
    title: 'HR Interview',
    meta: '5 Questions • 20 Minutes',
    desc: 'Test communication and interview readiness.'
  }
];

const SimulationStartModal = ({ onClose, onStart }) => {
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
        maxWidth: '750px', // 700px to 800px max
        maxHeight: '85vh', // Allow max 85vh height
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
          alignItems: 'flex-start',
          flexShrink: 0
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', margin: 0 }}>
              Campus Placement Simulation
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted, #64748b)', margin: '4px 0 0' }}>
              You are about to begin a complete placement simulation.
            </p>
          </div>
          <button 
            onClick={onClose} 
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
          <h3 style={{ 
            fontSize: '15px', 
            fontWeight: 600, 
            color: 'var(--text-primary, #0f172a)', 
            marginBottom: '16px',
            marginTop: 0
          }}>
            Simulation Stages
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {STAGES.map((stage) => (
              <div key={stage.id} style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-color, #f8fafc)',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--primary-color, #2563eb)',
                  minWidth: '24px'
                }}>
                  {stage.id}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                    {stage.title}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary, #475569)' }}>
                    {stage.meta}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)' }}>
                    {stage.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onStart}>
            <PlayCircle size={18} style={{ marginRight: '6px' }} /> Start Aptitude Test
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default SimulationStartModal;
