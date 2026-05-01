import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import InputBar from './components/InputBar';
import ParticleCanvas from './components/ParticleCanvas';
import './App.css';

const MODELS = [
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
];

const SUGGESTED_QUERIES = [
  'What is quantum entanglement?',
  "Explain Bell's theorem",
  'How does quantum teleportation work?',
  'Can entanglement transmit information faster than light?',
  'What are Bell states?',
  'What causes quantum decoherence?',
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    model: MODELS[0].id,
    temperature: 0.1,
    topK: 3,
  });
  const [status, setStatus] = useState('idle');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Current Session', active: true, time: 'Now' },
  ]);
  const abortRef = useRef(null);

  useEffect(() => {
    fetch('/health')
      .then(r => r.json())
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'));
  }, []);

  const sendMessage = useCallback(async (query) => {
    if (!query.trim() || isLoading) return;

    // Close sidebar on mobile when sending
    if (isMobile) setSidebarOpen(false);

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setStatus('processing');

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          top_k: config.topK,
          model: config.model,
          temperature: config.temperature,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer,
        chunksRetrieved: data.chunks_retrieved,
        chunksPreview: data.chunks_preview,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);

      if (messages.length === 0) {
        setChatHistory(prev =>
          prev.map(c => c.active ? { ...c, title: query.slice(0, 40) + (query.length > 40 ? '…' : '') } : c)
        );
      }
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `**Error:** ${err.message}`,
        isError: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      setStatus('ready');
    }
  }, [isLoading, config, messages.length, isMobile]);

  const newChat = () => {
    setMessages([]);
    setStatus('ready');
    const newId = Date.now();
    setChatHistory(prev => [
      { id: newId, title: 'New Chat', active: true, time: 'Now' },
      ...prev.map(c => ({ ...c, active: false })),
    ]);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen(o => !o);

  return (
    <div className="app">
      <ParticleCanvas />

      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="app-layout">
        <Sidebar
          open={sidebarOpen}
          isMobile={isMobile}
          chatHistory={chatHistory}
          onNewChat={newChat}
          onSelectChat={() => { if (isMobile) setSidebarOpen(false); }}
          config={config}
          setConfig={setConfig}
          models={MODELS}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="app-main">
          <Header
            status={status}
            model={config.model}
            models={MODELS}
            onToggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            suggestedQueries={SUGGESTED_QUERIES}
            onSuggestedQuery={sendMessage}
            isMobile={isMobile}
          />
          <InputBar
            onSend={sendMessage}
            isLoading={isLoading}
            config={config}
            setConfig={setConfig}
            models={MODELS}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}