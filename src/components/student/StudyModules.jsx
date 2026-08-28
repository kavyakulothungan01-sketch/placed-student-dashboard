import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Lock, Tv, ChevronRight, ChevronDown, Check, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studyModuleService } from '../../services/studyModuleService';
import { classService } from '../../services/classService';
import { progressService } from '../../services/progressService';
import { calculateModuleProgress } from '../../utils/progressCalculators';

const StudyModules = () => {
  const navigate = useNavigate();
  const [expandedModuleId, setExpandedModuleId] = useState('mod-2');
  const [modules, setModules] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    studyModuleService.getStudyModules().then(setModules);
    classService.getClasses().then(setClasses);
    progressService.getStudentProgress();
  }, []);

  const toggleModule = (id) => {
    setExpandedModuleId(prev => (prev === id ? null : id));
  };

  const getClassForLesson = (classId) => {
    return classes.find(c => c.id === classId);
  };

  const handleWatchClassVideo = (classId) => {
    navigate(`/classes?classId=${classId}`);
  };

  return (
    <main className="dashboard-content">
      {/* View Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <BookOpen size={24} style={{ marginRight: '10px' }} /> Structured Study Modules
          </h1>
          <p className="view-sub">Sequential learning pathways built to eliminate skill deficits and prepare for placements.</p>
        </div>
      </div>

      {/* S-1 SKILL GAP RECOMMENDATIONS BANNER */}
      <div style={{ 
        background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)', 
        border: '1.5px solid #BFDBFE', 
        borderRadius: '12px', 
        padding: '16px 20px', 
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(37, 99, 235, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span className="sim-badge" style={{ background: '#2563EB', color: '#fff', fontSize: '11px', padding: '2px 8px' }}>
                  S-1 Skill Gap Intelligence
                </span>
                <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>
                  Automated Diagnostic Feed
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E3A8A', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                Recommended Study Module: Quantitative Aptitude — Percentages & Data Interpretation
              </h3>
              <p style={{ fontSize: '12.5px', color: '#1E40AF', margin: 0, lineHeight: 1.4 }}>
                Your S-1 Readiness Audit identified a <strong>-12% deficit in Quantitative Aptitude</strong>. Completing this targeted 4-lesson module will boost your readiness score up to <strong>78/100</strong>.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setExpandedModuleId('mod-2')} style={{ whiteSpace: 'nowrap' }}>
              <Play size={12} style={{ marginRight: '4px' }} /> Start Recommended Module
            </button>
            <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600 }}>
              Consuming S-1 Diagnostic Feed
            </span>
          </div>
        </div>
      </div>

      {/* MODULES LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {modules.map((mod) => {
          const { completed, total, pct } = calculateModuleProgress(mod.lessons);
          const isExpanded = expandedModuleId === mod.id;

          return (
            <div className="card" key={mod.id} style={{ borderLeft: mod.isRecommended ? '4px solid #2563EB' : '1px solid var(--border-light)', overflow: 'hidden' }}>
              
              {/* Module Header Bar */}
              <div 
                style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
                onClick={() => toggleModule(mod.id)}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="tag blue">{mod.subject}</span>
                    {mod.isRecommended && (
                      <span className="sim-badge info" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={10} /> S-1 Skill Gap Match
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                    {mod.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                    {mod.description}
                  </p>
                </div>

                {/* Progress Indicators & Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '140px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Progress</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>{completed}/{total} Lessons ({pct}%)</span>
                    </div>
                    <div className="sp-bar" style={{ width: '140px', height: '6px' }}>
                      <div className="sp-fill" style={{ width: `${pct}%`, background: pct === 100 ? '#22C55E' : '#2563EB' }}></div>
                    </div>
                  </div>

                  <button className="btn btn-ghost" style={{ padding: '6px' }}>
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                </div>
              </div>

              {/* Sequential Lessons View (Expanded) */}
              {isExpanded && (
                <div style={{ background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)', padding: '20px 24px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Sequential Learning Path & Lessons ({completed}/{total} Completed)
                  </h4>

                  <div className="roadmap-steps" style={{ paddingLeft: '8px' }}>
                    {mod.lessons.map((lesson, idx) => {
                      const relatedClass = getClassForLesson(lesson.classId);
                      const isCompleted = lesson.status === 'completed';
                      const isActive = lesson.status === 'active';
                      const isLocked = lesson.status === 'locked';

                      return (
                        <div 
                          key={lesson.id} 
                          className={`roadmap-step ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}
                          style={{ marginBottom: idx === mod.lessons.length - 1 ? 0 : '16px' }}
                        >
                          <div className={`rs-marker ${isCompleted ? '' : isActive ? 'active' : 'rec'}`} style={{ opacity: isLocked ? 0.6 : 1 }}>
                            {isCompleted && <Check size={14} />}
                            {isActive && <Play size={14} />}
                            {isLocked && <Lock size={14} />}
                          </div>

                          <div className="rs-content" style={{ opacity: isLocked ? 0.75 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                              <div>
                                <span className="rs-stage">Lesson {idx + 1} • {isCompleted ? 'Completed' : isActive ? 'Current Lesson' : 'Locked'}</span>
                                <h4 className="rs-name">{lesson.title}</h4>
                                {relatedClass && (
                                  <p className="rs-sub">
                                    Linked Class: <strong>{relatedClass.title}</strong> ({relatedClass.duration})
                                  </p>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '8px' }}>
                                {relatedClass && !isLocked && (
                                  <button 
                                    className={`btn ${isActive ? 'btn-primary' : 'btn-outline'} btn-sm`}
                                    onClick={() => handleWatchClassVideo(lesson.classId)}
                                  >
                                    <Tv size={12} style={{ marginRight: '4px' }} /> Watch Class Video
                                  </button>
                                )}
                                {!isLocked && !isCompleted && (
                                  <button 
                                    className="btn btn-outline btn-sm"
                                    onClick={async () => {
                                      await progressService.updateLessonProgress(mod.id, lesson.id, 'completed');
                                      const updatedModules = await studyModuleService.getStudyModules();
                                      setModules(updatedModules);
                                    }}
                                  >
                                    <Check size={12} style={{ marginRight: '4px' }} /> Mark Complete
                                  </button>
                                )}
                                {isLocked && (
                                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                    <Lock size={12} /> Unlock Previous Lessons
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Backend schema ready: <code>studentId</code>, <code>moduleId</code>, <code>lessonId</code>, <code>progressPercentage</code>
                    </span>
                    <button className="btn btn-primary btn-sm" onClick={() => setExpandedModuleId(null)}>
                      Close Path View
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </main>
  );
};

export default StudyModules;
