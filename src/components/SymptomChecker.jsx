import React, { useEffect, useRef, useState } from 'react' // useState bhi add kiya hai agar local state manage karni ho
import ReactMarkdown from 'react-markdown'

function SymptomChecker({ setScreen }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! Main aapka AI Health Assistant hoon. Aapko kya pareshani ho rahi hai?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Scroll ke liye ref create kiya
  const messagesEndRef = useRef(null);

  // 3. Scroll function jo humesha bottom par le jayega
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 4. Jab bhi 'messages' change honge, scroll karega
  useEffect(scrollToBottom, [messages]);

  // 5. Send message function with Render backend connection
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsgText = inputText;
    const newUserMessage = { id: Date.now(), sender: 'user', text: userMsgText };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch("https://ai-medical-backend-0ick.onrender.com/api/check-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: userMsgText }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const aiMessage = { id: Date.now() + 1, sender: 'ai', text: data.result };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = { id: Date.now() + 1, sender: 'ai', text: "Error: " + (data.error || "Something went wrong") };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      const errorConnectionMsg = { id: Date.now() + 1, sender: 'ai', text: "🚨 Unable to connect to the server." };
      setMessages(prev => [...prev, errorConnectionMsg]);
    } finally {
      setIsLoading(false);
    }
  };

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
        
        {/* Yeh invisible div bottom mark karega */}
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

export default SymptomChecker;