import React, { useState, useEffect } from 'react';
import { FileBadge, Download, CheckCircle, Eye, User, FileText, Code, FolderGit2, GraduationCap, Briefcase, Plus, X, Sparkles, Cpu } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { atsService } from '../../services/atsService';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: '', title: '', email: '', phone: '', linkedin: '', github: '', summary: '',
    eduDegree: '', eduInst: '', eduYear: '', eduScore: '',
    intCompany: '', intRole: '', intDesc: '',
    projName: '', projStack: '', projDesc: ''
  });

  const [skills, setSkills] = useState([]);
  const [atsJobDescription, setAtsJobDescription] = useState('');
  const [atsResults, setAtsResults] = useState(null);

  useEffect(() => {
    resumeService.getResume().then(({ formData: loadedData, skills: loadedSkills }) => {
      setFormData(loadedData);
      setSkills(loadedSkills);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    resumeService.updateResume(updated);
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter(s => s !== skillToRemove);
    setSkills(updatedSkills);
    resumeService.updateSkills(updatedSkills);
  };

  const handlePrint = () => {
    window.print();
  };

  const runAtsAudit = async () => {
    if (!atsJobDescription.trim()) return;
    const results = await atsService.analyzeResume(formData, skills, atsJobDescription);
    setAtsResults(results);
  };

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title"><FileBadge size={24} style={{ marginRight: '10px' }} /> Resume Maker & ATS Analyzer</h1>
          <p className="view-sub">Build a professional, ATS-friendly resume and test it against real job descriptions.</p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Download size={16} style={{ marginRight: '6px' }} /> Download PDF
        </button>
      </div>

      <div className="resume-builder-grid">
        
        {/* Left: Interactive Form Builder */}
        <div className="builder-editor-card card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ padding: '24px' }}>
            <h2 className="card-title" style={{ marginBottom: '20px' }}>Interactive Builder</h2>
            
            <div className="form-sections">
              
              {/* Section 1: Personal Details */}
              <div className="form-section">
                <h3 className="form-sec-title"><User size={16} /> 1. Personal Details</h3>
                <div className="form-grid-2">
                  <div className="form-group"><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" /></div>
                  <div className="form-group"><label>Professional Title</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-input" /></div>
                  <div className="form-group"><label>Email Address</label><input type="text" name="email" value={formData.email} onChange={handleInputChange} className="form-input" /></div>
                  <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" /></div>
                  <div className="form-group"><label>LinkedIn URL</label><input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="form-input" /></div>
                  <div className="form-group"><label>GitHub Repository</label><input type="text" name="github" value={formData.github} onChange={handleInputChange} className="form-input" /></div>
                </div>
              </div>

              {/* Section 2: Summary */}
              <div className="form-section">
                <h3 className="form-sec-title"><FileText size={16} /> 2. Professional Summary</h3>
                <div className="form-group">
                  <textarea name="summary" rows="3" value={formData.summary} onChange={handleInputChange} className="form-textarea"></textarea>
                </div>
              </div>

              {/* Section 3: Education */}
              <div className="form-section">
                <h3 className="form-sec-title"><GraduationCap size={16} /> 3. Education</h3>
                <div className="form-grid-2">
                  <div className="form-group"><label>Degree</label><input type="text" name="eduDegree" value={formData.eduDegree} onChange={handleInputChange} className="form-input" /></div>
                  <div className="form-group"><label>Institution</label><input type="text" name="eduInst" value={formData.eduInst} onChange={handleInputChange} className="form-input" /></div>
                  <div className="form-group"><label>Year</label><input type="text" name="eduYear" value={formData.eduYear} onChange={handleInputChange} className="form-input" /></div>
                  <div className="form-group"><label>CGPA / Score</label><input type="text" name="eduScore" value={formData.eduScore} onChange={handleInputChange} className="form-input" /></div>
                </div>
              </div>

              {/* Section 4: Skills */}
              <div className="form-section">
                <h3 className="form-sec-title"><Code size={16} /> 4. Technical Skills & Keywords</h3>
                <div className="skills-tag-editor">
                  {skills.map((skill, index) => (
                    <span className="skill-chip" key={index}>{skill} <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => removeSkill(skill)} /></span>
                  ))}
                  <button className="btn btn-outline btn-sm"><Plus size={12} style={{ marginRight: '4px' }} /> Add Skill Tag</button>
                </div>
              </div>

              {/* Section 5: Internships */}
              <div className="form-section">
                <h3 className="form-sec-title"><Briefcase size={16} /> 5. Internships / Experience</h3>
                <div className="project-entry-item">
                  <div className="form-grid-2">
                    <div className="form-group"><label>Company</label><input type="text" name="intCompany" value={formData.intCompany} onChange={handleInputChange} className="form-input" /></div>
                    <div className="form-group"><label>Role & Duration</label><input type="text" name="intRole" value={formData.intRole} onChange={handleInputChange} className="form-input" /></div>
                  </div>
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label>Description</label>
                    <textarea name="intDesc" rows="2" value={formData.intDesc} onChange={handleInputChange} className="form-textarea"></textarea>
                  </div>
                </div>
              </div>

              {/* Section 6: Projects */}
              <div className="form-section">
                <h3 className="form-sec-title"><FolderGit2 size={16} /> 6. Featured Projects</h3>
                <div className="project-entry-item">
                  <div className="form-grid-2">
                    <div className="form-group"><label>Project Name</label><input type="text" name="projName" value={formData.projName} onChange={handleInputChange} className="form-input" /></div>
                    <div className="form-group"><label>Tech Stack / Year</label><input type="text" name="projStack" value={formData.projStack} onChange={handleInputChange} className="form-input" /></div>
                  </div>
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label>Description</label>
                    <textarea name="projDesc" rows="2" value={formData.projDesc} onChange={handleInputChange} className="form-textarea"></textarea>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* ATS Keyword Analyzer */}
          <div className="builder-ats-card card" style={{ border: 'none', borderTop: '1px solid var(--border-light)', borderRadius: 0, boxShadow: 'none' }}>
            <div className="card-header" style={{ borderBottom: 'none' }}>
              <h2 className="card-title"><Sparkles size={18} style={{ marginRight: '8px' }} /> ATS Keyword Analyzer</h2>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Target Job Description</label>
                <textarea 
                  rows="4" className="form-textarea" 
                  placeholder="Paste the job description here to analyze against your resume..."
                  value={atsJobDescription} onChange={(e) => setAtsJobDescription(e.target.value)}
                ></textarea>
              </div>
              <button className="btn btn-outline" onClick={runAtsAudit} style={{ alignSelf: 'flex-start' }}>
                <Cpu size={16} style={{ marginRight: '6px' }} /> Run Compatibility Audit
              </button>
              
              {atsResults && (
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)', marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                    <div className="ats-score-box">
                      <span className="ats-lbl">ATS Compatibility</span>
                      <span className="ats-val" style={{ color: atsResults.score >= 70 ? '#16A34A' : atsResults.score >= 40 ? '#D97706' : '#DC2626' }}>{atsResults.score} / 100</span>
                    </div>
                    <div className="ats-score-box" style={{ borderRight: 'none' }}>
                      <span className="ats-lbl">Keyword Density</span>
                      <span className="ats-val">{atsResults.density}%</span>
                    </div>
                  </div>
                  
                  <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>Matched Keywords</h4>
                  <div className="skills-tag-editor" style={{ marginBottom: '12px' }}>
                    {atsResults.matched.length === 0 ? <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>None</span> : atsResults.matched.map((kw, i) => (
                      <span className="skill-chip" key={i} style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>{kw.toUpperCase()}</span>
                    ))}
                  </div>
                  
                  <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--danger)' }}>Missing Keywords (Skill Gaps)</h4>
                  <div className="skills-tag-editor">
                    {atsResults.missing.length === 0 ? <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>None</span> : atsResults.missing.map((kw, i) => (
                      <span className="skill-chip" key={i} style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>{kw.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Live Preview */}
        <div className="builder-preview-card card">
          <div className="card-header">
            <h2 className="card-title"><Eye size={18} style={{ marginRight: '8px' }} /> Real-Time ATS Document Preview</h2>
            <span className="status-badge success"><CheckCircle size={12} style={{ marginRight: '4px' }} /> ATS Compatible Format</span>
          </div>
          
          <div className="resume-paper-wrapper">
            <div className="resume-paper">
              <div className="rp-header">
                <h1 className="rp-name">{formData.name || 'Full Name'}</h1>
                <p className="rp-title">{formData.title || 'Professional Title'}</p>
                <p className="rp-contact">
                  {formData.email} • {formData.phone} • {formData.linkedin} • {formData.github}
                </p>
              </div>

              <hr className="rp-divider" />

              <div className="rp-section">
                <h2 className="rp-sec-head">SUMMARY</h2>
                <p className="rp-text">{formData.summary}</p>
              </div>

              <div className="rp-section">
                <h2 className="rp-sec-head">EDUCATION</h2>
                <div className="rp-item">
                  <div className="rp-item-top">
                    <strong>{formData.eduDegree}</strong>
                    <span>{formData.eduYear}</span>
                  </div>
                  <p className="rp-text">{formData.eduInst} • {formData.eduScore}</p>
                </div>
              </div>

              <div className="rp-section">
                <h2 className="rp-sec-head">TECHNICAL SKILLS</h2>
                <p className="rp-text"><strong>Keywords:</strong> {skills.join(', ')}</p>
              </div>

              <div className="rp-section">
                <h2 className="rp-sec-head">EXPERIENCE</h2>
                <div className="rp-item">
                  <div className="rp-item-top">
                    <strong>{formData.intCompany}</strong>
                    <span>{formData.intRole}</span>
                  </div>
                  <p className="rp-text" style={{ whiteSpace: 'pre-wrap' }}>{formData.intDesc}</p>
                </div>
              </div>

              <div className="rp-section">
                <h2 className="rp-sec-head">PROJECTS</h2>
                <div className="rp-item">
                  <div className="rp-item-top">
                    <strong>{formData.projName}</strong>
                    <span>{formData.projStack}</span>
                  </div>
                  <p className="rp-text" style={{ whiteSpace: 'pre-wrap' }}>{formData.projDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ResumeBuilder;
