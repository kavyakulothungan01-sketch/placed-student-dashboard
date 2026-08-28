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

const Sidebar = ({ collapsed, setCollapsed }) => {
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
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="logo-wrap">
          <svg
            className="sidebar-logo-img"
            viewBox="0 0 148 44"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="placed"
          >
            <text
              x="6"
              y="28"
              fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
              fontSize="24"
              fontWeight="800"
              letterSpacing="-0.5"
              fill="#111827"
            >placed</text>
          </svg>
        </NavLink>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          <img src={student?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Student&backgroundColor=b6e3f4"} alt={student?.name || "Student"} />
          <span className="online-dot"></span>
        </div>
        <div className="sidebar-profile-info">
          <p className="sidebar-name">{student?.name || "Student Profile"}</p>
          <p className="sidebar-roll">{student?.degree ? student.degree.slice(0, 15) : 'Student'} | {student?.batchYear ? `Batch '${student.batchYear.slice(-2)}` : 'Active'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Core Track</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><LayoutDashboard size={18} /></span>
              <span className="nav-label">Dashboard</span>
              <span className="nav-badge active-dot"></span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/readiness" className={({ isActive }) => (isActive ? 'active' : '')}>
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
            <NavLink to="/assessments" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><ClipboardCheck size={18} /></span>
              <span className="nav-label">Assessments</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/improvement" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><Compass size={18} /></span>
              <span className="nav-label">Improvement Path</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/simulations" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><Cpu size={18} /></span>
              <span className="nav-label">Practice & Simulations</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/classes" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><Tv size={18} /></span>
              <span className="nav-label">Classes</span>
              {counts.classes > 0 && <span className="nav-count new">{counts.classes}</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/modules" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><BookOpen size={18} /></span>
              <span className="nav-label">Study Modules</span>
              {counts.modules > 0 && <span className="nav-count">{counts.modules}</span>}
            </NavLink>
          </li>
        </ul>

        <p className="nav-section-label">Tools & Drives</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/resume" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><FileBadge size={18} /></span>
              <span className="nav-label">Resume Maker & Analyzer</span>
              {counts.atsScore !== null && <span className="nav-count new">ATS {counts.atsScore}%</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/opportunities" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><Briefcase size={18} /></span>
              <span className="nav-label">Opportunities / Drives</span>
              {counts.opportunities > 0 && <span className="nav-count">{counts.opportunities}</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/interviews" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-icon"><Video size={18} /></span>
              <span className="nav-label">Interviews</span>
              {counts.interviews > 0 && <span className="nav-count new">{counts.interviews}</span>}
            </NavLink>
          </li>
        </ul>

        <p className="nav-section-label">Account</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
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
        <NavLink to="/profile" className="logout-btn">
          <LogOut size={16} />
          <span>Account Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

