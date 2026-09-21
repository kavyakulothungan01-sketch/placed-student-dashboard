import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  X, 
  ChevronDown, 
  FileText, 
  Eye, 
  ShieldCheck, 
  Play,
  Info
} from 'lucide-react';
import { studyModuleService } from '../../services/studyModuleService';
import './StudyModules.css';

const TOPIC_OPTIONS = [
  'All Topics',
  'Quantitative Aptitude / Mathematics',
  'Logical & Analytical Reasoning',
  'Verbal Ability / English',
  'Data Interpretation',
  'General Knowledge & Current Affairs',
  'Computer & IT Fundamentals',
  'Subject/Technical Knowledge',
  'Research & Academic Aptitude',
  'Communication & Employability Skills'
];

// Helper to format date into "01 Sept 2026"
const formatUploadDate = (isoString) => {
  if (!isoString) return '01 Sept 2026';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '01 Sept 2026';
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return '01 Sept 2026';
  }
};

// Document details & study syllabus data for View-Only reader
const STUDY_DOCUMENT_CONTENT = {
  'module-quant': {
    syllabus: [
      { topic: 'Percentages & Fraction Equivalents', details: 'Speed calculations, percentage change, and multiplication factor method.' },
      { topic: 'Profit, Loss & Discount', details: 'Marked price, cost price, successive discounts, and faulty balance problems.' },
      { topic: 'Time, Speed & Distance', details: 'Relative speed in train crossings, upstream/downstream river streams, and circular tracks.' },
      { topic: 'Time & Work', details: 'Efficiency fractions, alternating work days, and pipes & cisterns flow equations.' }
    ],
    shortcuts: [
      'Fraction conversion: 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%',
      'Successive percentage change formula: Effective % = a + b + (ab / 100)',
      'Relative speed: Same direction = (S1 - S2), Opposite direction = (S1 + S2)'
    ],
    tips: 'Attempt the highest accuracy questions first. For quantitative placement rounds, eliminate obviously impossible options before computing multi-step arithmetic.'
  },
  'module-tech': {
    syllabus: [
      { topic: 'Object-Oriented Programming (OOP)', details: 'Inheritance hierarchies, interface contracts, polymorphism, and encapsulation rules.' },
      { topic: 'Memory Lifecycle & Pointers', details: 'Stack frame allocations, heap references, garbage collection, and pointer arithmetic.' },
      { topic: 'Data Structures & Algorithms', details: 'Two pointers, sliding window, binary search trees, BFS/DFS traversals, and dynamic programming.' },
      { topic: 'Complexity & Optimization', details: 'Big-O time and space asymptotic analysis with recursion tree evaluation.' }
    ],
    shortcuts: [
      'Two-pointer approach reduces O(N^2) array searches down to O(N)',
      'HashMap lookups provide average O(1) time complexity for duplicate detection',
      'Use BFS for shortest path in unweighted graphs, Dijkstra for positive weighted graphs'
    ],
    tips: 'Always state time and space complexity upfront in technical interviews. Write clean modular methods and handle null/edge cases first.'
  },
  'module-english': {
    syllabus: [
      { topic: 'Subject-Verb Agreement', details: 'Singular/plural subject rules, collective nouns, and inverted sentences.' },
      { topic: 'Corporate Placement Vocabulary', details: 'High-frequency GRE/Campus placement words, contextual connotations, synonyms, and antonyms.' },
      { topic: 'Sentence Correction & Spotting Errors', details: 'Modifier placement, parallel construction, and correct preposition usage.' },
      { topic: 'Group Discussion & Verbal Articulation', details: 'Initiating GDs with structured points, summarizing consensus, and corporate tone.' }
    ],
    shortcuts: [
      'Neither/Nor & Either/Or: The verb agrees with the subject closest to it',
      'Each, Everyone, Somebody always take singular verbs and pronouns',
      'PREP method for GD: Point, Reason, Example, Point reassertion'
    ],
    tips: 'In verbal ability tests, read the entire sentence before choosing options. Beware of subtle homophones and misplaced modifying clauses.'
  },
  'module-reasoning': {
    syllabus: [
      { topic: 'Blood Relations & Family Trees', details: 'Generation tiers, gender symbols, and complex coded relation decoding.' },
      { topic: 'Direction Sense & Vectors', details: 'Cardinal compass directions, Pythagoras hypotenuse theorem, and shadow shifts.' },
      { topic: 'Coding-Decoding Patterns', details: 'Alphabet numeric values (EJOTY), reverse letters (AZ, BY, CX), and matrix grids.' },
      { topic: 'Number & Alphabet Series', details: 'Double differences, prime progressions, Fibonacci variants, and alternating series.' }
    ],
    shortcuts: [
      'EJOTY formula: E=5, J=10, O=15, T=20, Y=25 for rapid alphabet positioning',
      'Reverse alphabet sum rule: Position of letter + Opposite letter = 27 (e.g., A(1) + Z(26) = 27)',
      'Pythagorean triplets to memorize: (3,4,5), (5,12,13), (7,24,25), (8,15,17)'
    ],
    tips: 'Draw quick scratch tree diagrams for blood relations. Do not assume gender based on names unless specified by pronouns or relations.'
  }
};

const StudyModules = () => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state matching 1st photo
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  // Document Viewer Modal state (View Only - No Download)
  const [activeDocument, setActiveDocument] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const modList = await studyModuleService.getStudyModules();
        // Strictly sort in ascending alphabetical order by title
        const sorted = (modList || []).sort((a, b) => a.title.localeCompare(b.title));
        setModules(sorted);
      } catch (err) {
        console.error('Failed to load study modules:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter study modules strictly based on search and topic dropdown
  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
      // 1. Topic dropdown filtering
      let topicMatches = true;
      if (selectedTopic !== 'All Topics') {
        const sel = selectedTopic.toLowerCase();
        const sub = (mod.subject || '').toLowerCase();
        const tit = (mod.title || '').toLowerCase();

        if (sel.includes('quant') || sel.includes('math')) {
          topicMatches = sub.includes('quant') || tit.includes('quant');
        } else if (sel.includes('logic') || sel.includes('reason')) {
          topicMatches = sub.includes('reason') || tit.includes('reason') || sub.includes('logic');
        } else if (sel.includes('verbal') || sel.includes('english')) {
          topicMatches = sub.includes('english') || tit.includes('english') || sub.includes('verbal');
        } else if (sel.includes('tech') || sel.includes('computer')) {
          topicMatches = sub.includes('tech') || tit.includes('tech') || sub.includes('coding');
        } else {
          topicMatches = sub.includes(sel) || sel.includes(sub);
        }
      }

      // 2. Search query filtering by name/title matching Photo 1
      let searchMatches = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = (mod.title || '').toLowerCase().includes(query);
        const subjectMatch = (mod.subject || '').toLowerCase().includes(query);
        const descMatch = (mod.description || '').toLowerCase().includes(query);
        searchMatches = titleMatch || subjectMatch || descMatch;
      }

      return topicMatches && searchMatches;
    });
  }, [modules, selectedTopic, searchQuery]);

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
                Your S-1 Readiness Audit identified a <strong>-12% deficit in Quantitative Aptitude</strong>. Completing this targeted module will boost your readiness score up to <strong>78/100</strong>.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => {
                const quantMod = modules.find(m => m.subjectId === 'quant' || m.id === 'module-quant');
                if (quantMod) setActiveDocument(quantMod);
              }} 
              style={{ whiteSpace: 'nowrap' }}
            >
              <Play size={12} style={{ marginRight: '4px' }} /> View Recommended Document
            </button>
            <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600 }}>
              Consuming S-1 Diagnostic Feed
            </span>
          </div>
        </div>
      </div>

      {/* UPLOADED STUDY MATERIALS TABLE CARD (EXACT MATCH WITH PHOTO 1) */}
      <div className="study-materials-card">
        <div className="sm-header">
          <div className="sm-header-left">
            <h3 className="sm-title">
              Uploaded Study Materials
            </h3>
            <p className="sm-subtitle">
              Study documents currently stored in study_module
            </p>
          </div>

          {/* Search & Topic Filters matching 1st Photo */}
          <div className="sm-controls">
            {/* Search Input: Search documents by name... */}
            <div className="sm-search-wrap">
              <Search size={14} className="sm-search-icon" />
              <input 
                type="text"
                placeholder="Search documents by name..."
                className="sm-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="sm-clear-btn" 
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Topic Filter Dropdown */}
            <div className="sm-select-wrap">
              <select 
                className="sm-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {TOPIC_OPTIONS.map((topic, idx) => (
                  <option key={idx} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="sm-select-arrow" />
            </div>
          </div>
        </div>

        {/* Study Materials Table */}
        <div className="sm-table-container">
          <table className="sm-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>DOCUMENT NAME</th>
                <th style={{ width: '22%' }}>MAIN TOPIC</th>
                <th style={{ width: '14%' }}>FILE DETAILS</th>
                <th style={{ width: '14%' }}>UPLOAD DATE</th>
                <th style={{ width: '12%', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="sm-empty">
                    Loading study materials from database...
                  </td>
                </tr>
              ) : filteredModules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="sm-empty">
                    No study documents found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredModules.map((item) => (
                  <tr key={item.id}>
                    {/* Document Name & Icon */}
                    <td>
                      <div className="sm-doc-cell">
                        <div className="sm-doc-icon">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="sm-doc-title">{item.title}</div>
                          <div className="sm-doc-sub">{item.subject || item.title}</div>
                        </div>
                      </div>
                    </td>

                    {/* Main Topic Badge */}
                    <td>
                      <span className="sm-topic-badge">
                        {item.subject}
                      </span>
                    </td>

                    {/* File Details (em-dash matching screenshot) */}
                    <td style={{ color: '#64748b' }}>
                      {item.fileDetails || '—'}
                    </td>

                    {/* Upload Date */}
                    <td style={{ color: '#475569', fontSize: '13px' }}>
                      {formatUploadDate(item.createdAt)}
                    </td>

                    {/* View/Open Action Button (Strictly Read-Only, No Download, No Delete) */}
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="sm-action-btn"
                        onClick={() => setActiveDocument(item)}
                        title="View document (read-only)"
                      >
                        <Eye size={13} style={{ marginRight: '2px', color: '#2563eb' }} /> View/Open
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENT VIEWER MODAL (STRICTLY VIEW-ONLY, NO DOWNLOAD) */}
      {activeDocument && (
        <div 
          className="doc-modal-overlay" 
          onClick={() => setActiveDocument(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="doc-modal-container" 
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()} // Disables right-click download
          >
            {/* Modal Header */}
            <div className="doc-modal-header">
              <div className="doc-modal-header-left">
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="doc-modal-title">{activeDocument.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span className="sm-topic-badge" style={{ padding: '1px 8px', fontSize: '11px' }}>
                      {activeDocument.subject}
                    </span>
                    <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} /> View-Only Access
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveDocument(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                title="Close viewer"
                aria-label="Close viewer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Document Body */}
            <div className="doc-modal-body">
              <div className="doc-paper">
                {/* Security Anti-Copy Watermark */}
                <div className="doc-watermark">STUDENT VIEW ONLY</div>

                {/* View-Only Security Notice */}
                <div className="doc-security-banner">
                  <ShieldCheck size={16} style={{ flexShrink: 0 }} />
                  <span>
                    Protected Study Document: Downloading, printing, or external distribution is disabled by placement policy.
                  </span>
                </div>

                {/* Document Metadata Header */}
                <div style={{ borderBottom: '1.5px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Official Placement Preparation Document
                  </span>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '6px 0 8px 0' }}>
                    {activeDocument.title}
                  </h1>
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {activeDocument.description}
                  </p>

                  <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap', fontSize: '12px', color: '#64748B' }}>
                    <div>Subject Track: <strong style={{ color: '#1E293B' }}>{activeDocument.subject}</strong></div>
                    <div>Source: <strong style={{ color: '#1E293B' }}>Supabase study_module</strong></div>
                    <div>Uploaded: <strong style={{ color: '#1E293B' }}>{formatUploadDate(activeDocument.createdAt)}</strong></div>
                  </div>
                </div>

                {/* Section 1: Curriculum Overview & Objectives */}
                <div className="doc-section">
                  <h4 className="doc-section-title">
                    <BookOpen size={15} color="#2563EB" /> 1. Syllabus & Core Concept Breakdown
                  </h4>
                  <p className="doc-paragraph">
                    This module provides direct coverage of topics assessed during preliminary placement aptitude tests and campus screening rounds:
                  </p>
                  
                  {STUDY_DOCUMENT_CONTENT[activeDocument.id]?.syllabus ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {STUDY_DOCUMENT_CONTENT[activeDocument.id].syllabus.map((item, idx) => (
                        <div key={idx} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <strong style={{ fontSize: '13px', color: '#0F172A' }}>{idx + 1}. {item.topic}:</strong>
                          <span style={{ fontSize: '13px', color: '#475569', marginLeft: '6px' }}>{item.details}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="doc-key-points">
                      <li>Fundamental theoretical concepts and practical derivations</li>
                      <li>Standard industry screening patterns and multiple-choice question typologies</li>
                      <li>Speed-solving heuristics tailored for timed campus examinations</li>
                    </ul>
                  )}
                </div>

                {/* Section 2: Key Formulas & Shortcuts */}
                <div className="doc-section">
                  <h4 className="doc-section-title">
                    <Sparkles size={15} color="#2563EB" /> 2. High-Yield Shortcuts & Exam Rules
                  </h4>
                  <div className="doc-callout">
                    <ul style={{ margin: 0, paddingLeft: '16px' }}>
                      {(STUDY_DOCUMENT_CONTENT[activeDocument.id]?.shortcuts || [
                        'Always cross-check unit dimensions and sign conventions',
                        'Memorize primary conversion factors to save calculation time',
                        'Use back-solving from provided answer choices when algebraic solving exceeds 90 seconds'
                      ]).map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: idx === 2 ? 0 : '6px', fontSize: '13px' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section 3: Placement Preparation Strategy */}
                <div className="doc-section">
                  <h4 className="doc-section-title">
                    <Info size={15} color="#2563EB" /> 3. Recommended Study Strategy
                  </h4>
                  <p className="doc-paragraph">
                    {STUDY_DOCUMENT_CONTENT[activeDocument.id]?.tips || 
                      'Review the core theory above, solve benchmark practice sets, and review time-per-question metrics in your S-1 Readiness Dashboard.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer (No Download button) */}
            <div className="doc-modal-footer">
              <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#16A34A" /> Document Protected • View Only Mode Active
              </span>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setActiveDocument(null)}
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StudyModules;
