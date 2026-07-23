import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Loader, Toast } from '../components/ui';
import './Messages.css';

const Messages = () => {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const pollInterval = useRef(null);
  const chatContainerRef = useRef(null);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/messages/conversations', config);
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setToast({ message: 'Failed to load conversations.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchMessages = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`, config);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [token]);

  const markAsRead = useCallback(async (userId) => {
    try {
      await axios.put(`/api/messages/read/${userId}`, {}, config);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchConversations();
    } else {
      setLoading(false);
    }
  }, [token, fetchConversations]);

  useEffect(() => {
    const chatWith = searchParams.get('chatWith');
    const chatName = searchParams.get('name');
    if (chatWith && conversations.length > 0) {
      if (activeChat?.userId === chatWith) {
        return;
      }
      const existing = conversations.find(
        (c) => c.otherUser?._id === chatWith
      );
      if (existing) {
        handleSelectConversation(existing);
      } else if (chatName) {
        setActiveChat({ userId: chatWith, name: chatName, avatar: '', userType: '' });
        setMessages([]);
      }
    }
  }, [searchParams, conversations, activeChat?.userId]);

  useEffect(() => {
    if (activeChat) {
      pollInterval.current = setInterval(() => {
        fetchMessages(activeChat.userId);
        fetchConversations();
      }, 5000);
    }

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [activeChat, fetchMessages, fetchConversations]);

  const scrollToBottom = (force = false) => {
    const container = chatContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (force || distanceFromBottom < 100) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConversation = async (conversation) => {
    const otherUser = conversation.otherUser;
    if (!otherUser) return;

    setActiveChat({
      userId: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar,
      userType: otherUser.userType,
    });

    await fetchMessages(otherUser._id);
    await markAsRead(otherUser._id);
    fetchConversations();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;

    setSending(true);
    try {
      const { data } = await axios.post('/api/messages', {
        receiverId: activeChat.userId,
        text: newMessage.trim(),
      }, config);

      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      fetchConversations();

      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
      setTimeout(() => scrollToBottom(true), 50);
    } catch (error) {
      console.error('Failed to send message:', error);
      setToast({ message: 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await axios.delete(`/api/messages/${messageId}`, config);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      fetchConversations();
      setToast({ message: 'Message deleted.', type: 'info' });
    } catch (error) {
      console.error('Failed to delete message:', error);
      setToast({ message: error.response?.data?.message || 'Failed to delete message.', type: 'error' });
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeChat) return;
    if (!window.confirm(`Are you sure you want to delete the entire chat with ${activeChat.name}? This action cannot be undone.`)) return;

    try {
      await axios.delete(`/api/messages/conversation/${activeChat.userId}`, config);
      setActiveChat(null);
      setMessages([]);
      fetchConversations();
      setToast({ message: 'Conversation deleted.', type: 'info' });
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      setToast({ message: error.response?.data?.message || 'Failed to delete conversation.', type: 'error' });
    }
  };

  const handleTextareaInput = (e) => {
    const el = e.target;
    setNewMessage(el.value);

    const oldHeight = el.style.height;
    el.style.height = 'auto';
    const newHeight = Math.min(el.scrollHeight, 120) + 'px';
    
    if (oldHeight !== newHeight) {
      el.style.height = newHeight;
      setTimeout(() => scrollToBottom(true), 10);
    } else {
      el.style.height = oldHeight;
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const dateKey = new Date(msg.createdAt).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
    return groups;
  }, {});

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.otherUser?.name?.toLowerCase().includes(q) ||
      c.listingName?.toLowerCase().includes(q)
    );
  });

  const handleBackToList = () => {
    setActiveChat(null);
    setMessages([]);
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <h1>💬 Messages</h1>
        </div>

        <div className="messages-layout">
          {/* Conversations List */}
          <div className={`conversations-panel ${activeChat ? 'hidden-mobile' : ''}`}>
            <div className="conversations-search">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="conversations-list">
              {loading ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <Loader size="md" text="Loading messages..." />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="conversations-empty">
                  <div className="empty-icon">📭</div>
                  <h3>No messages yet</h3>
                  <p>When you contact a host or receive a message, it will appear here.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.conversationId}
                    className={`conversation-item ${
                      activeChat?.userId === conv.otherUser?._id ? 'active' : ''
                    } ${conv.unreadCount > 0 ? 'unread' : ''}`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      {conv.otherUser?.avatar ? (
                        <img
                          src={conv.otherUser.avatar}
                          alt={conv.otherUser.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        getInitials(conv.otherUser?.name)
                      )}
                    </div>

                    <div className="conversation-info">
                      <div className="conversation-info-top">
                        <span className="conversation-name">
                          {conv.otherUser?.name || 'Unknown User'}
                        </span>
                        <span className="conversation-time">
                          {formatTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <div className="conversation-preview">
                        {conv.lastSender?.toString() === user?.id || conv.lastSender?.toString() === user?._id
                          ? `You: ${conv.lastMessage}`
                          : conv.lastMessage}
                      </div>
                      <div className="conversation-meta">
                        {conv.listingName && (
                          <span className="conversation-listing-tag">
                            {conv.listingType === 'Destination' ? '🏔️' : '🏠'} {conv.listingName}
                          </span>
                        )}
                      </div>
                    </div>

                    {conv.unreadCount > 0 && (
                      <div className="conversation-unread-badge">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className={`chat-panel ${!activeChat ? 'hidden-mobile' : ''}`}>
            {activeChat ? (
              <>
                <div className="chat-header">
                  <button className="chat-back-btn" onClick={handleBackToList}>
                    ← 
                  </button>
                  <div className="chat-header-avatar">
                    {activeChat.avatar ? (
                      <img
                        src={activeChat.avatar}
                        alt={activeChat.name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      getInitials(activeChat.name)
                    )}
                  </div>
                  <div className="chat-header-info">
                    <h3>{activeChat.name}</h3>
                    <p>{activeChat.userType === 'host' ? '🏠 Host' : activeChat.userType === 'traveler' ? '🌍 Traveler' : '👤 User'}</p>
                  </div>
                  <button 
                    className="chat-delete-conv-btn" 
                    onClick={handleDeleteConversation} 
                    title="Delete entire conversation history"
                  >
                    🗑️ Delete Chat
                  </button>
                </div>

                <div className="chat-messages" ref={chatContainerRef}>
                  {messages.length === 0 ? (
                    <div className="chat-empty-state" style={{ margin: 'auto' }}>
                      <div className="empty-icon">👋</div>
                      <h3>Start the conversation</h3>
                      <p>Send your first message to {activeChat.name}.</p>
                    </div>
                  ) : (
                    Object.entries(groupedMessages).map(([dateKey, msgs]) => (
                      <React.Fragment key={dateKey}>
                        <div className="message-date-separator">
                          <span>{getDateLabel(msgs[0].createdAt)}</span>
                        </div>
                        {msgs.map((msg) => {
                          const isSent =
                            msg.sender?._id === user?.id ||
                            msg.sender?._id === user?._id ||
                            msg.sender === user?.id ||
                            msg.sender === user?._id;
                          return (
                            <div
                              key={msg._id}
                              className={`message-bubble ${isSent ? 'sent' : 'received'}`}
                            >
                              {msg.listingName && (
                                <div className="message-listing-context">
                                  Re: {msg.listingName}
                                </div>
                              )}
                              <p className="message-text">{msg.text}</p>
                              <div className="message-footer">
                                <span className="message-time">
                                  {formatMessageTime(msg.createdAt)}
                                </span>
                                {isSent && (
                                  <button
                                    className="message-delete-btn"
                                    title="Delete message"
                                    onClick={() => handleDeleteMessage(msg._id)}
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSendMessage}>
                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows={1}
                  />
                  <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? '...' : 'Send ➤'}
                  </button>
                </form>
              </>
            ) : (
              <div className="chat-empty-state">
                <div className="empty-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Messages;
