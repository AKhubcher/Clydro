import React, { useState } from 'react';
import { FaStopwatch, FaCog } from 'react-icons/fa';
import '../../styles/scheduling.css';

const SchedulingAndRules = ({ 
  automationRules, 
  schedule, 
  isAutoMode, 
  setIsConfigureOpen, 
  setConfigureTab 
}) => {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <section className="scheduling-rules">
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <FaStopwatch /> Watering Schedule
          </button>
          <button 
            className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <FaCog /> Automation Rules
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'schedule' && (
            <div className="schedule-content">
              <div className="content-header">
                <h3>Active Schedule</h3>
                {!isAutoMode && (
                  <button 
                    className="configure-button"
                    onClick={() => {
                      setConfigureTab('schedule');
                      setIsConfigureOpen(true);
                    }}
                  >
                    Configure Schedule
                  </button>
                )}
              </div>
              <div className="schedule-grid">
                {schedule.map((item, index) => (
                  <div key={index} className="schedule-item">
                    <div className="schedule-time">
                      <div className="time-info">
                        <div className="day-container">
                          <FaStopwatch className="schedule-icon" />
                          <span className="day">{item.day}</span>
                        </div>
                        <span className="time">
                          {new Date(`2000-01-01 ${item.time}`).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                      <span className="duration">{item.duration}min</span>
                    </div>
                    {item.adjustForWeather && (
                      <div className="weather-adjusted">
                        <FaCog className="weather-icon" />
                        Weather Adjusted
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="rules-content">
              <div className="content-header">
                <h3>Active Rules</h3>
                {!isAutoMode && (
                  <button 
                    className="configure-button"
                    onClick={() => {
                      setConfigureTab('rules');
                      setIsConfigureOpen(true);
                    }}
                  >
                    Configure Rules
                  </button>
                )}
              </div>
              <div className="rules-grid">
                {automationRules.map((rule, index) => (
                  <div key={index} className="rule-item">
                    <div className="rule-details">
                      <div className="rule-condition">
                        When {rule.condition} is {rule.operator} {rule.value}
                        {rule.condition === 'temperature' ? '°F' : '%'}
                      </div>
                      <div className="rule-action" data-action={rule.action}>
                        {rule.action === 'start' 
                          ? `Water for ${rule.duration}min` 
                          : 'Stop watering'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SchedulingAndRules; 