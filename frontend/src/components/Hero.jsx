import React, { useEffect, useRef } from 'react';

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI Image Captioning',
    desc: 'BLIP transformer generates rich, accurate captions from any image.',
    color: 'primary',
  },
  {
    icon: '📊',
    title: 'NLP Metrics',
    desc: 'Evaluate captions with BLEU, ROUGE-L, and CIDEr-like scores.',
    color: 'accent',
  },
  {
    icon: '🎨',
    title: 'Image Filter Studio',
    desc: 'Apply Gaussian, Edge, Sepia, Emboss & 7 more filters in real time.',
    color: 'secondary',
  },
  {
    icon: '💾',
    title: 'Human Feedback Loop',
    desc: 'Rate and refine AI captions. Export your feedback as CSV.',
    color: 'primary',
  },
];

const STATS = [
  { value: '2', label: 'AI Tools' },
  { value: '10+', label: 'Image Filters' },
  { value: '3', label: 'NLP Metrics' },
  { value: '∞', label: 'Possibilities' },
];

export default function Hero({ setActiveTab }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll('.anim-item');
    els?.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      setTimeout(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + i * 120);
    });
  }, []);

  const colorMap = {
    primary: { bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' },
    secondary: { bg: 'bg-secondary/10', border: 'border-secondary/20', text: 'text-secondary' },
    accent: { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent' },
  };

  return (
    <div ref={containerRef} className="min-h-screen grid-bg flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      {/* Badge */}
      <div className="anim-item flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-primary text-xs font-mono tracking-widest">DEEP LEARNING + COMPUTER VISION</span>
      </div>

      {/* Headline */}
      <h1 className="anim-item font-display text-4xl sm:text-6xl lg:text-7xl font-black text-center mb-6 leading-none tracking-tight">
        <span className="text-text-primary">AI</span>{' '}
        <span className="text-primary glow-text">VISION</span>
        <br />
        <span className="text-text-primary">STUDIO</span>
      </h1>

      {/* Subtitle */}
      <p className="anim-item font-heading text-text-secondary text-center text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed">
        Production-grade AI image analysis platform. Generate intelligent captions,
        evaluate with NLP metrics, and apply real-time computer vision filters.
      </p>

      {/* CTAs */}
      <div className="anim-item flex flex-col sm:flex-row gap-4 mb-20">
        <button
          onClick={() => setActiveTab('captioner')}
          className="btn-primary px-8 py-3.5 rounded-xl bg-primary text-bg font-heading font-bold text-sm tracking-wide hover:bg-primary/90 transition-all duration-200 shadow-glow"
        >
          🧠 Image Narrator
        </button>
        <button
          onClick={() => setActiveTab('filter')}
          className="btn-primary px-8 py-3.5 rounded-xl bg-transparent border border-border-bright text-text-primary font-heading font-semibold text-sm tracking-wide hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
        >
          🎨 Filter Studio
        </button>
      </div>

      {/* Stats */}
      <div className="anim-item grid grid-cols-4 gap-6 mb-20 w-full max-w-lg">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-2xl sm:text-3xl font-black text-primary">{s.value}</div>
            <div className="font-mono text-xs text-text-secondary mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="anim-item grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
        {FEATURES.map((f) => {
          const c = colorMap[f.color];
          return (
            <div
              key={f.title}
              className={`card-hover p-5 rounded-xl bg-card border border-border flex gap-4 items-start cursor-default`}
            >
              <div className={`w-10 h-10 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center text-xl flex-shrink-0`}>
                {f.icon}
              </div>
              <div>
                <h3 className={`font-heading font-semibold text-sm ${c.text} mb-1`}>{f.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed font-body">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech stack */}
      <div className="anim-item mt-16 flex flex-wrap justify-center gap-3">
        {['BLIP Transformer', 'FastAPI', 'React 18', 'OpenCV', 'NLTK', 'ROUGE', 'scikit-learn'].map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full text-xs font-mono text-muted border border-border bg-surface"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
