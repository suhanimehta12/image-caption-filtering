import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CaptioningTab from './components/CaptioningTab';
import FilteringTab from './components/FilteringTab';
import FeedbackLog from './components/FeedbackLog';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':      return <Hero setActiveTab={setActiveTab} />;
      case 'captioner': return <CaptioningTab />;
      case 'filter':    return <FilteringTab />;
      case 'feedback':  return <FeedbackLog />;
      default:          return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg noise">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0e1020',
            color: '#e8eaf6',
            border: '1px solid #1a1d35',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#4fffb0', secondary: '#0e1020' } },
          error:   { iconTheme: { primary: '#ff6b6b', secondary: '#0e1020' } },
        }}
      />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="animate-fade-in">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="font-mono text-xs text-muted">
          AI VISION STUDIO · Built with FastAPI + React + BLIP + OpenCV
        </p>
      </footer>
    </div>
  );
}
