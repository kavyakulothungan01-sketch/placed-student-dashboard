import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { simulationService } from '../../services/simulationService';

const Simulations = () => {
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    simulationService.getSimulations().then(setSimulations);
  }, []);

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <Cpu size={24} style={{ marginRight: '10px' }} /> Practice & Multi-Stage Recruitment Simulations
          </h1>
          <p className="view-sub">Experience full multi-stage recruitment drives: Aptitude → Technical → Coding → HR Interview.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2 className="card-title">Active Simulation Environment</h2>
        </div>
        <div className="simulations-grid" style={{ padding: '20px' }}>
          {simulations.map((sim) => (
            <div className="sim-card active" key={sim.id}>
              <div className="sim-header">
                <span className="sim-badge">{sim.badge}</span>
                <span className="sim-time">{sim.stageText}</span>
              </div>
              <h4 className="sim-title">{sim.title}</h4>
              <p className="sim-sub">{sim.currentRoundText}</p>
              <div className="sim-pipeline">
                {sim.pipeline.map((p, i) => (
                  <span key={i} className={`pipeline-step ${p.status === 'done' ? 'done' : p.status === 'active' ? 'active' : ''}`}>
                    {p.name} {p.status === 'done' ? '✓' : ''}
                  </span>
                ))}
              </div>
              <div className="sim-footer">
                <span className="sim-score">Aptitude Score: {sim.aptitudeScore}</span>
                <button className="btn btn-primary btn-sm">Enter Technical Round</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Simulations;
