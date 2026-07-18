import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './AIChat.css';

const defaultMessages = [
  { id: 1, text: 'Hello! I\'m your AI travel planner. How can I help you today?', sender: 'ai' }
];

const AIChat = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('aiChatMessages');
    return saved ? JSON.parse(saved) : defaultMessages;
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('aiChatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to delete this chat history?")) {
      setMessages(defaultMessages);
      localStorage.removeItem('aiChatMessages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        messages: newMessages
      });

      const aiResponse = {
        id: Date.now() + 1,
        text: response.data.text,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error connecting to AI:', error);
      const errorMsg = {
        id: Date.now() + 1,
        text: 'Sorry, I am having trouble connecting to my brain right now. Please try again later!',
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <h3>🤖 AI Travel Planner</h3>
        <button className="clear-chat-btn" onClick={handleClearChat} title="Clear Chat">
          🗑️ Clear
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message message-${message.sender}`}>
            <div className="message-content">
              {message.sender === 'ai' ? (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              ) : (
                message.text
              )}
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
          <i className="fas fa-paper-plane"></i> Send
        </button>
      </form>
    </div>
  );
};

export default AIChat;
