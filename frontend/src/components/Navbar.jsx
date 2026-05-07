import React, { useState, useEffect } from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tabs = [
    { id: 'home',      label: 'Home' },
    { id: 'captioner', label: 'Image Narrator' },
    { id: 'filter',    label: 'Filter Studio' },
    { id: 'feedback',  label: 'Feedback Log' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-primary text-sm font-mono font-bold">AI</span>
          </div>
          <span className="font-display text-sm tracking-widest text-text-primary">
            VISION<span className="text-primary">STUDIO</span>
          </span>
        </div>

        {/* Tabs */}
        <div className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 text-sm font-heading font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(79,255,176,0.6)]" />
              )}
            </button>
          ))}
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            BLIP Powered
          </span>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex border-t border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-xs font-heading font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
