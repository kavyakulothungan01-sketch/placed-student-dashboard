import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Gauge, ClipboardCheck, Compass, Cpu, FileBadge, Briefcase, Video, UserCog, Award, LogOut, PanelLeftClose, PanelLeftOpen, Tv, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { readinessService } from '../../services/readinessService';
import { classService } from '../../services/classService';
import { studyModuleService } from '../../services/studyModuleService';
import { opportunityService } from '../../services/opportunityService';
import { interviewService } from '../../services/interviewService';
import { atsService } from '../../services/atsService';
import { supabase } from '../../lib/supabaseClient';

const Sidebar = ({ collapsed, setCollapsed, mobileSidebarOpen, onMobileClose }) => {
  const [student, setStudent] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [counts, setCounts] = useState({
    classes: 0,
    modules: 0,
    opportunities: 0,
    interviews: 0,
    atsScore: null
  });

  const loadData = async () => {
    studentService.getStudentProfile().then(setStudent);
    readinessService.getReadinessMetrics().then(setMetrics);
    
    Promise.all([
      classService.getClasses(),
      studyModuleService.getStudyModules(),
      opportunityService.getOpportunities(),
      interviewService.getInterviews(),
      atsService.getRecentAnalysis()
    ]).then(([cls, mods, opps, ints, ats]) => {
      setCounts({
        classes: cls.length,
        modules: mods.length,
        opportunities: opps.length,
        interviews: ints.length,
        atsScore: ats?.score ?? null
      });
    });
  };

  useEffect(() => {
    loadData();

    // Supabase Realtime Channels to reactively update counts & student state
    const channel = supabase
      .channel('sidebar_db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_skills' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_opportunities' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_interviews' }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header" style={{ height: '80px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <NavLink to="/" className="logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', textDecoration: 'none', flex: 1, minWidth: 0 }} onClick={onMobileClose}>
          <div className="sidebar-logo-container" style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            padding: '4px',
            flexShrink: 0,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E2E8F0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            colorScheme: 'light'
          }}>
            <img 
              src="/placeduplogo.jpg" 
              alt="Placed Logo" 
              loading="eager"
              className="sidebar-logo-fixed"
              style={{ width: '100%', height: '100%', objectFit: 'contain', colorScheme: 'light' }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#FFFFFF', letterSpacing: '-0.025em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {student?.name || "Student Profile"}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399', flexShrink: 0 }}></span>
              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {student?.degree ? student.degree.slice(0, 15) : 'Student'} | {student?.batchYear ? `Batch '${student.batchYear.slice(-2)}` : 'Active'}
              </span>
            </div>
          </div>
        </NavLink>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} style={{ flexShrink: 0 }}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Core Track</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><LayoutDashboard size={18} /></span>
              <span className="nav-label">Dashboard</span>
              <span className="nav-badge active-dot"></span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/readiness" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Gauge size={18} /></span>
              <span className="nav-label">Career Readiness</span>
              {metrics?.hasRecordedSkills ? (
                <span className="nav-count new">{metrics.overallScore}%</span>
              ) : (
                <span className="nav-count">—</span>
              )}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/assessments" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><ClipboardCheck size={18} /></span>
              <span className="nav-label">Assessments</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/improvement" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Compass size={18} /></span>
              <span className="nav-label">Improvement Path</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/simulations" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Cpu size={18} /></span>
              <span className="nav-label">Practice & Simulations</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/classes" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Tv size={18} /></span>
              <span className="nav-label">Classes</span>
              {counts.classes > 0 && <span className="nav-count new">{counts.classes}</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/modules" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><BookOpen size={18} /></span>
              <span className="nav-label">Study Modules</span>
              {counts.modules > 0 && <span className="nav-count">{counts.modules}</span>}
            </NavLink>
          </li>
        </ul>

        <p className="nav-section-label">Tools & Drives</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/resume" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><FileBadge size={18} /></span>
              <span className="nav-label">Resume Maker & Analyzer</span>
              {counts.atsScore !== null && <span className="nav-count new">ATS {counts.atsScore}%</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/opportunities" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Briefcase size={18} /></span>
              <span className="nav-label">Opportunities / Drives</span>
              {counts.opportunities > 0 && <span className="nav-count">{counts.opportunities}</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/interviews" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Video size={18} /></span>
              <span className="nav-label">Interviews</span>
              {counts.interviews > 0 && <span className="nav-count new">{counts.interviews}</span>}
            </NavLink>
          </li>
        </ul>

        <p className="nav-section-label">Account</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><UserCog size={18} /></span>
              <span className="nav-label">Profile & Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="placement-badge-mini">
          <Award size={14} />
          <span>Readiness: {metrics?.hasRecordedSkills ? `${metrics.overallScore}/100` : '— / 100'}</span>
        </div>
        <NavLink to="/profile" className="logout-btn" onClick={onMobileClose}>
          <LogOut size={16} />
          <span>Account Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

