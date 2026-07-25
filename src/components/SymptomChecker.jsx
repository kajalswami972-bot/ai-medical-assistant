import React, { useEffect, useRef } from 'react' // 1. useRef aur useEffect import kiya
import ReactMarkdown from 'react-markdown'

function SymptomChecker({ messages, inputText, setInputText, sendMessage, setScreen, isLoading }) {
  
  // 2. Scroll ke liye ref create kiya
  const messagesEndRef = useRef(null);

  // 3. Scroll function jo humesha bottom par le jayega
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 4. Jab bhi 'messages' change honge, scroll karega
  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="back-arrow" onClick={() => setScreen('dashboard')}>←</span>
        <div>
          <h3>AI Symptom Checker</h3>
          <p style={{ fontSize: '12px', color: '#009688', fontWeight: '600' }}>● Online</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.sender}-bubble`}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}

        {isLoading && (
          <div className="message-bubble ai-bubble" style={{ fontStyle: 'italic', color: '#666', backgroundColor: '#f0f0f0' }}>
            🤖 Dr. Llama is thinking...
          </div>
        )}
        
        {/* 5. Yeh invisible div bottom mark karega */}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          placeholder="Type your symptoms here..." 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
        />
        <button className="send-btn" onClick={sendMessage}>➔</button>
      </div>
    </div>
  )
}

export default SymptomChecker