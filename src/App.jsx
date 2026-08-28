import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import ReadinessDashboard from './components/student/ReadinessDashboard';
import MainDashboard from './components/student/MainDashboard';
import ResumeBuilder from './components/student/ResumeBuilder';
import Assessments from './components/student/Assessments';
import ImprovementPath from './components/student/ImprovementPath';
import Simulations from './components/student/Simulations';
import Opportunities from './components/student/Opportunities';
import Interviews from './components/student/Interviews';
import Profile from './components/student/Profile';
import ClassesModule from './components/student/ClassesModule';
import StudyModules from './components/student/StudyModules';
import PlacedWatermark from './components/common/PlacedWatermark';

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-area">
        <Topbar />
        {/* PLACED brand watermark – pure SVG wordmark background layer */}
        <PlacedWatermark />
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/readiness" element={<ReadinessDashboard />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/improvement" element={<ImprovementPath />} />
          <Route path="/simulations" element={<Simulations />} />
          <Route path="/classes" element={<ClassesModule />} />
          <Route path="/modules" element={<StudyModules />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
