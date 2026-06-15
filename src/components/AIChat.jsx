import React, { useState } from 'react';
import './AIChat.css';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your AI travel planner. How can I help you today?', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: 'That sounds great! I can help you plan an amazing eco-tourism experience. What type of destination are you interested in?',
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <h3>🤖 AI Travel Planner</h3>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message message-${message.sender}`}>
            <div className="message-content">
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-ai">
            <div className="message-content typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me anything about your trip..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="chat-send-btn" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChat;
