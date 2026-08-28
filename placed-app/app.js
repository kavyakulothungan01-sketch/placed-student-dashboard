/* =============================================
   PLACED – Multi-Page Application Engine (app.js)
   ============================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Init Lucide Icons ──
  if (window.lucide) lucide.createIcons();

  // ── 2. Active Sidebar Page Highlight ──
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  });

  // ── 3. Toast Notification System ──
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  function showToast(message, type = 'info') {
    const colors = {
      success: { bg: '#F0FDF4', border: '#86EFAC', text: '#16A34A' },
      info:    { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' },
      warn:    { bg: '#FFF7ED', border: '#FED7AA', text: '#D97706' },
      error:   { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
    };
    const c = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      background: ${c.bg};
      border: 1.5px solid ${c.border};
      border-radius: 10px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: ${c.text};
      pointer-events: all;
      cursor: pointer;
      animation: toastIn 0.25s cubic-bezier(0.4,0,0.2,1);
      max-width: 360px;
      backdrop-filter: blur(10px);
    `;

    toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${c.text}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9,12 11,14 15,10"/></svg><span>${message}</span>`;

    toastContainer.appendChild(toast);
    toast.addEventListener('click', () => removeToast(toast));
    setTimeout(() => removeToast(toast), 3500);
  }

  window.showToast = showToast;

  // ── 4. Sidebar Toggle & State Persistence ──
  const sidebar       = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const menuBtn       = document.getElementById('menuBtn');
  
  // Restore collapsed state
  let isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (sidebar && isCollapsed) sidebar.classList.add('collapsed');

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
    localStorage.setItem('sidebar_collapsed', isCollapsed);
    if (sidebar) sidebar.classList.toggle('collapsed', isCollapsed);
    const icon = sidebarToggle ? sidebarToggle.querySelector('i[data-lucide]') : null;
    if (icon) {
      icon.setAttribute('data-lucide', isCollapsed ? 'panel-left-open' : 'panel-left-close');
    }
    if (window.lucide) lucide.createIcons();
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleSidebar(); });
  if (menuBtn) menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSidebar(); });

  // ── 5. Profile Dropdown & Notification Drawer ──
  const profileTrigger  = document.getElementById('profileDropdownTrigger');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!profileTrigger.contains(e.target)) {
        profileDropdown.classList.remove('show');
      }
    });
  }

  const notifBtn     = document.getElementById('notifBtn');
  const notifPanel   = document.getElementById('notifPanel');
  const notifClose   = document.getElementById('notifClose');
  const notifOverlay = document.getElementById('notifOverlay');

  function openNotifPanel() {
    if (notifPanel) notifPanel.classList.add('open');
    if (notifOverlay) notifOverlay.classList.add('show');
  }

  function closeNotifPanel() {
    if (notifPanel) notifPanel.classList.remove('open');
    if (notifOverlay) notifOverlay.classList.remove('show');
  }

  if (notifBtn) notifBtn.addEventListener('click', (e) => { e.stopPropagation(); openNotifPanel(); });
  if (notifClose) notifClose.addEventListener('click', closeNotifPanel);
  if (notifOverlay) notifOverlay.addEventListener('click', closeNotifPanel);

  // ── 6. Real-Time Resume Editor (for resume.html) ──
  const resName    = document.getElementById('resName');
  const resTitle   = document.getElementById('resTitle');
  const resSummary = document.getElementById('resSummary');

  const prevName    = document.getElementById('prevName');
  const prevTitle   = document.getElementById('prevTitle');
  const prevSummary = document.getElementById('prevSummary');

  if (resName && prevName) {
    resName.addEventListener('input', () => { prevName.textContent = resName.value || 'Your Name'; });
  }
  if (resTitle && prevTitle) {
    resTitle.addEventListener('input', () => { prevTitle.textContent = resTitle.value || 'Target Role Title'; });
  }
  if (resSummary && prevSummary) {
    resSummary.addEventListener('input', () => { prevSummary.textContent = resSummary.value || 'Professional summary...'; });
  }

  const btnAnalyzeResume = document.getElementById('btnAnalyzeResume');
  if (btnAnalyzeResume) {
    btnAnalyzeResume.addEventListener('click', () => {
      showToast('AI ATS Audit complete! Match score: 70/100.', 'info');
    });
  }

  const btnDownloadResumePDF = document.getElementById('btnDownloadResumePDF');
  if (btnDownloadResumePDF) {
    btnDownloadResumePDF.addEventListener('click', () => {
      showToast('Generating and downloading ATS Resume PDF...', 'success');
    });
  }

  // ── 7. Universal Action Delegation ──
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .btn, .role-fit-card');
    if (!btn) return;
    if (btn.id === 'sidebarToggle' || btn.id === 'menuBtn' || btn.id === 'notifBtn' || btn.id === 'notifClose') return;

    const btnText = btn.textContent.trim();

    if (btnText.includes('Apply Now')) {
      e.preventDefault();
      btn.textContent = 'Applied ✓';
      btn.style.background = 'linear-gradient(135deg,#22C55E,#16A34A)';
      btn.style.color = '#fff';
      showToast('Application submitted successfully! 🚀', 'success');
    } else if (btnText.includes('Start Assessment') || btnText.includes('Launch Challenge')) {
      e.preventDefault();
      showToast('Opening timed assessment test window...', 'info');
    } else if (btnText.includes('Join Call')) {
      e.preventDefault();
      showToast('Launching video interview room... 🎯', 'success');
    } else if (btnText.includes('Save Profile')) {
      e.preventDefault();
      showToast('Profile and academic credentials saved ✓', 'success');
    } else if (btn.classList.contains('role-fit-card')) {
      document.querySelectorAll('.role-fit-card').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const title = btn.querySelector('.rf-title')?.textContent.trim() || 'Role';
      showToast(`Selected Target Role: ${title}`, 'success');
    }
  });

  // ── 8. Global Keyboard Shortcut (⌘K Search) ──
  const globalSearch = document.getElementById('globalSearch');
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (globalSearch) {
        globalSearch.focus();
        globalSearch.select();
      }
    }
    if (e.key === 'Escape') {
      if (globalSearch) globalSearch.blur();
      closeNotifPanel();
      if (profileDropdown) profileDropdown.classList.remove('show');
    }
  });

  console.log('%c🚀 PLACED – Multi-Page Architecture Active (' + currentPath + ')', 'font-size:14px;font-weight:700;color:#2563EB');
});
