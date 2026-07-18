import React from 'react';
import Hero from '../components/Hero';
import AIChat from '../components/AIChat';
import './TravelPlanner.css';

const TravelPlanner = () => {
  return (
    <div className="travel-planner">
      <Hero 
        title="AI Chat Assistant"
        subtitle="Get instant answers, local tips, and personalized travel recommendations."
      />

      <div className="planner-container">
        <div className="planner-chat-layout animate-fade-in">
          <div className="chat-section">
            <AIChat />
          </div>

          <div className="planner-glass-card chat-tips-card">
            <h3>Tips for Best Results</h3>
            <ul>
              <li><strong>Be Specific:</strong> Mention cities, dates, or interests (e.g., "Suggest 3 romantic restaurants in Paris").</li>
              <li><strong>Ask Follow-ups:</strong> The AI remembers context. Ask it to "add a budget hotel" to the previous plan.</li>
              <li><strong>Explore Alternatives:</strong> Not happy with a suggestion? Ask for "cheaper options" or "more adventurous activities".</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanner;
