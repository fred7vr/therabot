// App.js - Main React component for TheraBot
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiSettings, FiUser, FiInfo } from 'react-icons/fi';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are TheraBot, a helpful, empathetic AI assistant focused on providing supportive conversations."
  );
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Define API URL based on environment
  const API_URL = process.env.NODE_ENV === 'production' 
    ? '/api/chat'  // Use relative path for same domain deployment on Render
    : 'http://localhost:3005/api/chat';
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize theme from localStorage or default
  useEffect(() => {
    const savedTheme = localStorage.getItem('therabot-theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('therabot-theme', newTheme);
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    // Prepare messages for API
    const apiMessages = [...messages, userMessage].map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    try {
      // Call your backend API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: systemPrompt
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`API error: ${data.error || response.statusText}`);
      }
      
      console.log('API Response:', data); // Log the full response
      
      // Handle different response formats
      if (data.response) {
        // If the backend returns { response: "message" }
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response
        }]);
      } else if (data.content && Array.isArray(data.content) && data.content.length > 0 && data.content[0].text) {
        // Original Claude API format with content array
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.content[0].text
        }]);
      } else if (data.content && typeof data.content === 'string') {
        // In case content is directly a string
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.content
        }]);
      } else if (data.text) {
        // Some API versions might return text directly
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.text
        }]);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}. Please check the console for more details.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Save conversation to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('therabot-conversation', JSON.stringify(messages));
    }
  }, [messages]);

  // Load conversation from local storage on initial load
  useEffect(() => {
    const savedConversation = localStorage.getItem('therabot-conversation');
    if (savedConversation) {
      try {
        const parsedConversation = JSON.parse(savedConversation);
        if (Array.isArray(parsedConversation) && parsedConversation.length > 0) {
          setMessages(parsedConversation);
        }
      } catch (e) {
        console.error('Error parsing saved conversation:', e);
      }
    }
  }, []);

  // Clear conversation
  const startNewChat = () => {
    setMessages([]);
    localStorage.removeItem('therabot-conversation');
  };

  return (
    <div className={`app ${theme}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>TheraBot</h2>
        </div>
        <button className="new-chat-btn" onClick={startNewChat}>
          + New Chat
        </button>
        
        <div className="sidebar-content">
          {/* You can add saved chats or other sidebar content here */}
        </div>
        
        <div className="sidebar-footer">
          <div className="sidebar-controls">
            <button onClick={() => setShowSettings(!showSettings)}>
              <FiSettings size={20} />
            </button>
            <button onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => setShowCredits(!showCredits)}>
              <FiInfo size={20} />
            </button>
          </div>
          
          <div className="author-credits">
            <p>Created by:</p>
            <p>Pratham Pattnaik</p>
            <p>Rong Yiran</p>
            <p>Ezekiel Ong</p>
          </div>
        </div>
      </div>
      
      <div className="main">
        {showSettings && (
          <div className="settings-panel">
            <h3>Settings</h3>
            <div className="setting-item">
              <label>System Prompt:</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
              />
            </div>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        )}
        
        {showCredits && (
          <div className="settings-panel credits-panel">
            <h3>About</h3>
            <p>This chatbot was created by:</p>
            <ul>
              <li>Pratham Pattnaik</li>
              <li>Rong Yiran</li>
              <li>Ezekiel Ong</li>
            </ul>
            <p>Powered by Claude API</p>
            <button onClick={() => setShowCredits(false)}>Close</button>
          </div>
        )}
        
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <h1>Welcome to TheraBot</h1>
              <p>Ask me anything to get started!</p>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-avatar">
                    {message.role === 'user' ? <FiUser /> : <img src={process.env.PUBLIC_URL + '/logo.png'} alt="AI" />}
                  </div>
                  <div className="message-content">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message assistant">
                  <div className="message-avatar">
                    <img src={process.env.PUBLIC_URL + '/logo.png'} alt="AI" />
                  </div>
                  <div className="message-content loading">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || input.trim() === ''}>
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;