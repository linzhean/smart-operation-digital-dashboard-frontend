import React, { useState } from 'react';
import DashboardService from '../../services/DashboardService';

const CreateDashboardForm: React.FC = () => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await DashboardService.createDashboard({ name });
      setName('');
      setFeedback('Dashboard created successfully!');
    } catch (error) {
      console.error('Error creating dashboard:', error);
      setFeedback('Error creating dashboard.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Dashboard Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button type="submit">Create Dashboard</button>
      {feedback && <p>{feedback}</p>}
    </form>
  );
};

export default CreateDashboardForm;
