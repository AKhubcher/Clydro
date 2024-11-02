import React from 'react';
import '../../styles/automation.css';

const RuleEditor = ({ rule, updateRule, removeRule }) => (
  <div className="rule-editor">
    <div className="rule-description">
      <div className="rule-condition">
        When {rule.condition} is {rule.operator} {rule.value}%:
      </div>
      <select
        value={rule.action}
        onChange={(e) => updateRule('action', e.target.value)}
      >
        <option value="start">Start</option>
        <option value="stop">Stop</option>
      </select>
      watering
      {rule.action === 'start' && (
        <> for <input
          type="number"
          value={rule.duration}
          onChange={(e) => updateRule('duration', parseInt(e.target.value))}
        /> minutes</>
      )}
    </div>
    <button className="remove-rule" onClick={removeRule}>Remove Rule</button>
  </div>
);

const AutomationRules = ({ rules, setRules }) => {
  const addRule = () => {
    setRules([...rules, {
      condition: 'moisture',
      operator: 'below',
      value: 30,
      action: 'start',
      duration: 30
    }]);
  };

  const updateRule = (index, field, value) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="automation-rules">
      {rules.map((rule, index) => (
        <RuleEditor
          key={index}
          rule={rule}
          updateRule={(field, value) => updateRule(index, field, value)}
          removeRule={() => removeRule(index)}
        />
      ))}
      <button className="add-rule" onClick={addRule}>Add Rule</button>
    </div>
  );
};

export default AutomationRules; 