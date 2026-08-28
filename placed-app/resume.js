/* =============================================
   PLACED – Resume Builder & ATS Engine (resume.js)
   S-3 Module
   ============================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // 1. Live Sync: Education Section
  const eduDegreeInput = document.getElementById('resEduDegree');
  const eduInstInput = document.getElementById('resEduInst');
  const eduYearInput = document.getElementById('resEduYear');
  const eduScoreInput = document.getElementById('resEduScore');

  const prevEduDegree = document.getElementById('prevEduDegree');
  const prevEduInst = document.getElementById('prevEduInst');
  const prevEduYear = document.getElementById('prevEduYear');
  const prevEduScore = document.getElementById('prevEduScore');

  if (eduDegreeInput && prevEduDegree) eduDegreeInput.addEventListener('input', () => prevEduDegree.textContent = eduDegreeInput.value || 'Degree Name');
  if (eduInstInput && prevEduInst) eduInstInput.addEventListener('input', () => prevEduInst.textContent = eduInstInput.value || 'Institution Name');
  if (eduYearInput && prevEduYear) eduYearInput.addEventListener('input', () => prevEduYear.textContent = eduYearInput.value || 'Year');
  if (eduScoreInput && prevEduScore) eduScoreInput.addEventListener('input', () => prevEduScore.textContent = eduScoreInput.value || 'Score');

  // 2. Live Sync: Internships Section
  const intCompanyInput = document.getElementById('resIntCompany');
  const intRoleInput = document.getElementById('resIntRole');
  const intDescInput = document.getElementById('resIntDesc');

  const prevIntCompany = document.getElementById('prevIntCompany');
  const prevIntRole = document.getElementById('prevIntRole');
  const prevIntDesc = document.getElementById('prevIntDesc');

  if (intCompanyInput && prevIntCompany) intCompanyInput.addEventListener('input', () => prevIntCompany.textContent = intCompanyInput.value || 'Company Name');
  if (intRoleInput && prevIntRole) intRoleInput.addEventListener('input', () => prevIntRole.textContent = intRoleInput.value || 'Role & Duration');
  if (intDescInput && prevIntDesc) intDescInput.addEventListener('input', () => prevIntDesc.textContent = intDescInput.value || 'Description');

  // 3. Live Sync: Projects Section
  const projNameInput = document.getElementById('resProjName');
  const projStackInput = document.getElementById('resProjStack');
  const projDescInput = document.getElementById('resProjDesc');

  const prevProjName = document.getElementById('prevProjName');
  const prevProjStack = document.getElementById('prevProjStack');
  const prevProjDesc = document.getElementById('prevProjDesc');

  if (projNameInput && prevProjName) projNameInput.addEventListener('input', () => prevProjName.textContent = projNameInput.value || 'Project Name');
  if (projStackInput && prevProjStack) projStackInput.addEventListener('input', () => prevProjStack.textContent = projStackInput.value || 'Tech Stack');
  if (projDescInput && prevProjDesc) projDescInput.addEventListener('input', () => prevProjDesc.textContent = projDescInput.value || 'Description');

  // 4. ATS Keyword Analyzer Logic
  const btnRunATS = document.getElementById('btnRunATS');
  const jobDescInput = document.getElementById('atsJobDescription');
  const atsResultsPanel = document.getElementById('atsResultsPanel');
  const scoreValue = document.getElementById('atsScoreValue');
  const densityValue = document.getElementById('atsDensityValue');
  const matchedList = document.getElementById('atsMatchedKeywords');
  const missingList = document.getElementById('atsMissingKeywords');

  if (btnRunATS && jobDescInput && atsResultsPanel) {
    btnRunATS.addEventListener('click', () => {
      const jdText = jobDescInput.value.trim().toLowerCase();
      
      if (!jdText) {
        if(window.showToast) window.showToast('Please paste a job description first', 'warn');
        return;
      }
      
      if(window.showToast) window.showToast('Analyzing ATS Compatibility...', 'info');

      // Common ATS keywords to look for (mock database)
      const keywordDB = [
        'react', 'node.js', 'javascript', 'python', 'c++', 'java', 'sql', 'postgresql',
        'mongodb', 'git', 'github', 'agile', 'aws', 'docker', 'kubernetes', 'typescript',
        'html', 'css', 'data structures', 'algorithms', 'system design', 'rest api', 'microservices'
      ];
      
      // Extract keywords present in JD
      const requiredKeywords = keywordDB.filter(kw => jdText.includes(kw));
      
      if (requiredKeywords.length === 0) {
        if(window.showToast) window.showToast('Could not find recognizable technical keywords in JD.', 'warn');
        return;
      }

      // Gather text from resume
      let resumeText = '';
      const fields = [
        'resSummary', 'resEduDegree', 'resIntDesc', 'resProjStack', 'resProjDesc'
      ];
      fields.forEach(id => {
        const el = document.getElementById(id);
        if(el) resumeText += el.value.toLowerCase() + ' ';
      });
      // Also grab the static skill chips from the DOM
      document.querySelectorAll('.skill-chip').forEach(chip => {
        resumeText += chip.textContent.toLowerCase() + ' ';
      });

      // Match logic
      const matched = [];
      const missing = [];
      let matchCount = 0;

      requiredKeywords.forEach(kw => {
        if (resumeText.includes(kw)) {
          matched.push(kw);
          matchCount++;
        } else {
          missing.push(kw);
        }
      });

      // Scoring formulas (Placeholders - confirm with project lead)
      // ATS Score = (matched / totalRequired) * 100
      let atsScore = Math.round((matchCount / requiredKeywords.length) * 100);
      
      // Density = (matched / total resume words) * 100
      const totalWords = resumeText.split(/\s+/).filter(w => w.length > 2).length;
      let density = totalWords > 0 ? ((matchCount / totalWords) * 100).toFixed(1) : 0;

      // Update UI
      scoreValue.textContent = atsScore + ' / 100';
      scoreValue.style.color = atsScore >= 70 ? '#16A34A' : atsScore >= 40 ? '#D97706' : '#DC2626';
      
      densityValue.textContent = density + '%';

      // Render matched keywords
      matchedList.innerHTML = matched.map(kw => 
        `<span class="skill-chip" style="background:#F0FDF4;color:#16A34A;border:1px solid #BBF7D0">${kw.toUpperCase()}</span>`
      ).join('');

      // Render missing keywords
      missingList.innerHTML = missing.map(kw => 
        `<span class="skill-chip" style="background:#FEF2F2;color:#DC2626;border:1px solid #FECACA">${kw.toUpperCase()}</span>`
      ).join('');

      // Show results
      atsResultsPanel.style.display = 'block';
    });
  }

  // 5. PDF Generation via Print
  const btnDownloadResumePDF = document.getElementById('btnDownloadResumePDF');
  if (btnDownloadResumePDF) {
    // Override the app.js toast for this button if possible
    btnDownloadResumePDF.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevent app.js from showing toast
      window.print();
    }, true); // use capture phase to intercept
  }
});
