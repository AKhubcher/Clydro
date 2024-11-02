import React from 'react';
import '../../styles/scheduling.css';

const ScheduleEditor = ({ schedule, setSchedule }) => {
  const addScheduleItem = () => {
    setSchedule([...schedule, {
      day: 'Monday',
      time: '06:00',
      duration: 30,
      adjustForWeather: true
    }]);
  };

  const updateScheduleItem = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const removeScheduleItem = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  return (
    <div className="schedule-editor">
      {schedule.map((item, index) => (
        <div key={index} className="schedule-item-editor">
          <div className="schedule-field">
            <label>Day</label>
            <select
              value={item.day}
              onChange={(e) => updateScheduleItem(index, 'day', e.target.value)}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div className="schedule-field">
            <label>Time</label>
            <input
              type="time"
              value={item.time}
              onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
            />
          </div>
          
          <div className="schedule-field">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={item.duration}
              onChange={(e) => updateScheduleItem(index, 'duration', parseInt(e.target.value))}
            />
          </div>

          <div className="schedule-controls">
            <label className="weather-adjust-toggle">
              <input
                type="checkbox"
                checked={item.adjustForWeather}
                onChange={(e) => updateScheduleItem(index, 'adjustForWeather', e.target.checked)}
              />
              Adjust for weather
            </label>
            <button 
              className="remove-schedule"
              onClick={() => removeScheduleItem(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button className="add-schedule" onClick={addScheduleItem}>
        + Add Schedule
      </button>
    </div>
  );
};

export default ScheduleEditor; 