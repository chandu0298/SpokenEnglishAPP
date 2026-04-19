import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, BookOpen, Lightbulb, Send, Volume2, Sparkles, Check, ArrowRight, ChevronDown } from 'lucide-react';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

function App() {
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "Hi! I'm Priya, your English coach. Ready to practice? Ask me anything about English or start a conversation!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wordOrigin, setWordOrigin] = useState(null);
  const [showFullStory, setShowFullStory] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadDailyOrigin();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const loadDailyOrigin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vocab/daily-origin`);
      if (response.ok) {
        const data = await response.json();
        setWordOrigin(data);
      }
    } catch (error) {
      console.error('Failed to load word origin:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, user_level: 'B1' })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { role: 'ai', text: data.coach_reply }]);
        
        // Text-to-speech
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.coach_reply);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I'm having trouble connecting right now. Please try again!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app" data-testid="echofluent-app">
      {/* Navigation */}
      <nav className="navbar" data-testid="navbar">
        <div className="nav-container">
          <div className="logo" data-testid="logo">
            <Sparkles className="logo-icon" />
            <span>EchoFluent</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#chat" className="nav-link">Try Demo</a>
            <button className="btn-primary" data-testid="join-waitlist-btn">
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" data-testid="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered English Coach</span>
          </div>
          <h1 className="hero-title">
            Speak English with <span className="gradient-text">Confidence</span>
          </h1>
          <p className="hero-subtitle">
            Practice real conversations with Coach Priya, your personal AI English tutor. 
            Get instant feedback, improve pronunciation, and expand your vocabulary.
          </p>
          <div className="hero-buttons">
            <a href="#chat" className="btn-primary btn-large" data-testid="start-learning-btn">
              Start Learning Free
              <ArrowRight size={18} />
            </a>
            <a href="#features" className="btn-outline btn-large" data-testid="see-features-btn">
              See Features
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">3000+</span>
              <span className="stat-label">Words</span>
            </div>
            <div className="stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Scenarios</span>
            </div>
            <div className="stat">
              <span className="stat-value">AI</span>
              <span className="stat-label">Powered</span>
            </div>
          </div>
        </div>

        {/* Chat Demo Preview */}
        <div className="hero-visual">
          <div className="chat-preview-card" data-testid="chat-preview">
            <div className="chat-header">
              <div className="coach-avatar">P</div>
              <div className="coach-info">
                <span className="coach-name">Coach Priya</span>
                <span className="coach-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
              <Volume2 className="volume-icon" size={18} />
            </div>
            <div className="preview-messages">
              <div className="preview-bubble ai">
                "Let's practice ordering coffee today!"
              </div>
              <div className="preview-bubble user">
                "Sure, I'd like a latte please"
              </div>
              <div className="preview-bubble ai">
                "Great! Try: 'Could I have a latte, please?' - it's more polite."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features" data-testid="features-section">
        <div className="section-container">
          <h2 className="section-title">Everything you need to become fluent</h2>
          <p className="section-subtitle">
            From real-time conversations to smart vocabulary building
          </p>

          <div className="features-grid">
            <div className="feature-card" data-testid="feature-conversations">
              <div className="feature-icon-wrapper">
                <MessageSquare size={24} />
              </div>
              <h3>Real-time Conversations</h3>
              <p>Chat with Priya across hundreds of real-life scenarios—from job interviews to casual coffee talks.</p>
            </div>

            <div className="feature-card" data-testid="feature-pronunciation">
              <div className="feature-icon-wrapper purple">
                <Mic size={24} />
              </div>
              <h3>Pronunciation Analysis</h3>
              <p>Get instant feedback on your accent and clarity. Perfect your sounds with our speech analysis.</p>
            </div>

            <div className="feature-card" data-testid="feature-vocabulary">
              <div className="feature-icon-wrapper cyan">
                <BookOpen size={24} />
              </div>
              <h3>Smart Vocabulary</h3>
              <p>Build your word bank with 3000+ essential words. Learn through context, not memorization.</p>
            </div>

            <div className="feature-card word-origin-card" data-testid="feature-word-origin">
              <div className="feature-icon-wrapper gold">
                <Lightbulb size={24} />
              </div>
              <h3>
                {wordOrigin ? (
                  <span className="word-highlight">{wordOrigin.word}</span>
                ) : (
                  'Did You Know?'
                )}
              </h3>
              {wordOrigin ? (
                <div className="origin-content">
                  <p className="origin-preview">{wordOrigin.short_preview}</p>
                  {showFullStory && (
                    <p className="origin-full-story">{wordOrigin.full_story}</p>
                  )}
                  <button 
                    className="expand-btn"
                    onClick={() => setShowFullStory(!showFullStory)}
                    data-testid="expand-story-btn"
                  >
                    {showFullStory ? 'Show Less' : 'Read Full Story'}
                    <ChevronDown className={`chevron ${showFullStory ? 'rotated' : ''}`} size={16} />
                  </button>
                </div>
              ) : (
                <p>Loading today's word origin...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Chat Demo Section */}
      <section id="chat" className="chat-demo-section" data-testid="chat-section">
        <div className="section-container">
          <h2 className="section-title">Try Coach Priya Now</h2>
          <p className="section-subtitle">
            Experience a real conversation. No sign-up required.
          </p>

          <div className="chat-demo-wrapper">
            <div className="chat-card" data-testid="chat-demo">
              <div className="chat-card-header">
                <div className="coach-avatar large">P</div>
                <div className="coach-info">
                  <span className="coach-name">Coach Priya</span>
                  <span className="coach-status">
                    <span className="status-dot"></span>
                    Your AI English Coach
                  </span>
                </div>
              </div>

              <div className="chat-messages" ref={chatContainerRef} data-testid="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`chat-bubble ${msg.role}`}
                    data-testid={`chat-bubble-${msg.role}-${index}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-bubble ai typing" data-testid="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                )}
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message to practice English..."
                  className="chat-input"
                  data-testid="chat-input"
                />
                <button 
                  onClick={handleSendMessage}
                  className="send-btn"
                  disabled={isLoading || !inputValue.trim()}
                  data-testid="send-message-btn"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

            <div className="chat-tips">
              <h4>Try asking:</h4>
              <ul>
                <li onClick={() => setInputValue("What's the difference between 'affect' and 'effect'?")}>
                  What's the difference between 'affect' and 'effect'?
                </li>
                <li onClick={() => setInputValue("How do I politely decline an invitation?")}>
                  How do I politely decline an invitation?
                </li>
                <li onClick={() => setInputValue("Can you help me practice for a job interview?")}>
                  Can you help me practice for a job interview?
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" data-testid="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to transform your English?</h2>
            <p>Join thousands of learners improving their English with AI</p>
            <div className="cta-features">
              <div className="cta-feature">
                <Check size={16} />
                <span>Free demo available</span>
              </div>
              <div className="cta-feature">
                <Check size={16} />
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <Check size={16} />
                <span>Personalized learning</span>
              </div>
            </div>
            <form className="waitlist-form" onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              e.target.innerHTML = `<span class="success-message">🚀 Thanks! We'll reach out to ${email} soon.</span>`;
            }}>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                required 
                data-testid="email-input"
              />
              <button type="submit" className="btn-primary" data-testid="reserve-spot-btn">
                Reserve Your Spot
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              <Sparkles className="logo-icon" />
              <span>EchoFluent</span>
            </div>
            <p>Master English conversations with AI</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#chat">Demo</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 EchoFluent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
