/* =============================================
   PLACED – Readiness Engine (readiness.js)
   S-1 Module
   ============================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // PLACEHOLDER — confirm with project lead before finalizing
  const READINESS_TIERS = [
    { min: 85, label: 'Super Coder',      color: '#22C55E', bg: '#F0FDF4' },
    { min: 70, label: 'Interview Ready',  color: '#2563EB', bg: '#EFF6FF' },
    { min: 50, label: 'Moderate',         color: '#F59E0B', bg: '#FFF7ED' },
    { min: 0,  label: 'At Risk',          color: '#EF4444', bg: '#FEF2F2' },
  ];

  // Mock State Data
  const currentReadinessScore = 72; // Hardcoded score
  
  const skillData = [
    { name: 'Quantitative Aptitude', score: 78, target: 85, icon: 'calculator', color: 'blue' },
    { name: 'Logical Reasoning', score: 82, target: 85, icon: 'brain', color: 'purple' },
    { name: 'English Communication', score: 65, target: 80, icon: 'message-square', color: 'amber' },
    { name: 'Technical Coding', score: 92, target: 90, icon: 'terminal', color: 'green' }
  ];

  // 1. Readiness Score Ring & Tier Label Logic
  const ringSvg = document.getElementById('readinessRing');
  const scoreVal = document.getElementById('readinessScoreVal');
  const tierBadge = document.getElementById('readinessTierBadge');

  if (ringSvg && scoreVal && tierBadge) {
    scoreVal.textContent = currentReadinessScore;

    // Calculate tier
    const activeTier = READINESS_TIERS.find(t => currentReadinessScore >= t.min) || READINESS_TIERS[3];
    
    tierBadge.textContent = activeTier.label;
    tierBadge.style.color = activeTier.color;
    tierBadge.style.backgroundColor = activeTier.bg;
    
    ringSvg.style.stroke = activeTier.color;

    // Animate ring (circumference is ~314)
    setTimeout(() => {
      const circumference = 2 * Math.PI * 50; // 314.159
      const offset = circumference - (currentReadinessScore / 100) * circumference;
      ringSvg.style.strokeDashoffset = offset;
    }, 100);
  }

  // 2. Skill Weakness Radar Chart (Pure SVG)
  const radarContainer = document.getElementById('radarChartContainer');
  if (radarContainer) {
    drawRadarChart(radarContainer, skillData);
  }

  // 3. Skill Gap Deficit Cards
  const gapsList = document.getElementById('skillGapsList');
  if (gapsList) {
    renderSkillGaps(gapsList, skillData);
  }

  // Helper: Draw Radar Chart
  function drawRadarChart(container, data) {
    const size = 220;
    const center = size / 2;
    const radius = 80;
    const numAxes = data.length;
    const angleStep = (Math.PI * 2) / numAxes;

    let svgHTML = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

    // Draw background concentric polygons (grids)
    for (let level = 1; level <= 5; level++) {
      let r = (radius / 5) * level;
      let points = '';
      for (let i = 0; i < numAxes; i++) {
        // Start at top (-Math.PI/2)
        const angle = i * angleStep - Math.PI / 2;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        points += `${x},${y} `;
      }
      svgHTML += `<polygon points="${points.trim()}" fill="none" stroke="#E5E7EB" stroke-width="1"/>`;
    }

    // Draw axes
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      svgHTML += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`;
      
      // Labels
      const labelRadius = radius + 20;
      const lx = center + labelRadius * Math.cos(angle);
      const ly = center + labelRadius * Math.sin(angle) + 4; // adjust y for text baseline
      let textAnchor = 'middle';
      if (Math.cos(angle) > 0.1) textAnchor = 'start';
      if (Math.cos(angle) < -0.1) textAnchor = 'end';
      
      const shortName = data[i].name.split(' ')[0]; // Use first word for fit
      svgHTML += `<text x="${lx}" y="${ly}" text-anchor="${textAnchor}" fill="#6B7280" font-size="10" font-weight="600" font-family="Inter, sans-serif">${shortName}</text>`;
    }

    // Draw Data Polygon
    let dataPoints = '';
    for (let i = 0; i < numAxes; i++) {
      const val = data[i].score;
      const angle = i * angleStep - Math.PI / 2;
      const r = (val / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      dataPoints += `${x},${y} `;
    }
    
    // Using main primary color for radar
    svgHTML += `<polygon points="${dataPoints.trim()}" fill="rgba(37,99,235,0.2)" stroke="#2563EB" stroke-width="2"/>`;

    // Data dots
    for (let i = 0; i < numAxes; i++) {
      const val = data[i].score;
      const angle = i * angleStep - Math.PI / 2;
      const r = (val / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      svgHTML += `<circle cx="${x}" cy="${y}" r="4" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5"/>`;
    }

    svgHTML += `</svg>`;
    container.innerHTML = svgHTML;
  }

  // Helper: Render Skill Gaps
  function renderSkillGaps(container, data) {
    // Sort by largest gap
    const sortedGaps = [...data].sort((a, b) => {
      const gapA = a.score - a.target;
      const gapB = b.score - b.target;
      return gapA - gapB; // lowest (most negative) first
    });

    let html = '';
    sortedGaps.forEach(skill => {
      const gap = skill.score - skill.target;
      let badgeClass = 'blue';
      let priorityText = 'On Track';
      
      if (gap < -10) { badgeClass = 'red'; priorityText = 'High Priority'; }
      else if (gap < 0) { badgeClass = 'amber'; priorityText = 'Needs Focus'; }
      else { badgeClass = 'blue'; priorityText = 'Met Target'; }
      
      let gapDisplay = gap < 0 ? gap + '%' : '+' + gap + '%';

      html += `
        <div class="gap-item">
          <div class="gap-info">
            <div class="gap-badge ${badgeClass}">${priorityText}</div>
            <div>
              <h4 class="gap-title">${skill.name}</h4>
              <p class="gap-desc">Current: ${skill.score}% • Target: ${skill.target}% • <strong>Gap: ${gapDisplay}</strong></p>
            </div>
          </div>
          ${gap < 0 ? \`<button class="btn btn-outline btn-sm"><i data-lucide="play-circle" size="14"></i> Fix</button>\` : \`<i data-lucide="check-circle" size="18" style="color:#22C55E"></i>\`}
        </div>
      `;
    });
    
    container.innerHTML = html;
    if (window.lucide) lucide.createIcons({ root: container });
  }

});
