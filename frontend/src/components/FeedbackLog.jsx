import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getFeedback, clearFeedback } from '../utils/api';

export default function FeedbackLog() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getFeedback();
      setFeedback(data.feedback || []);
    } catch {
      toast.error('Could not load feedback. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleClear = async () => {
    if (!window.confirm('Clear all feedback? This cannot be undone.')) return;
    try {
      await clearFeedback();
      setFeedback([]);
      toast.success('Feedback cleared');
    } catch {
      toast.error('Failed to clear feedback.');
    }
  };

  const filtered = filter === 'All' ? feedback : feedback.filter((r) => r.rating === filter);
  const goodCount = feedback.filter((r) => r.rating === 'Good').length;
  const badCount  = feedback.filter((r) => r.rating === 'Needs Improvement').length;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-lg">💾</div>
          <span className="font-mono text-xs text-secondary tracking-widest">MODULE 03</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-text-primary mb-2">
          FEEDBACK <span className="text-secondary">LOG</span>
        </h1>
        <p className="text-text-secondary font-body">
          Human-in-the-loop caption ratings stored for model improvement and benchmarking.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <div className="font-display text-3xl font-bold text-primary">{feedback.length}</div>
          <div className="font-mono text-xs text-text-secondary mt-1">TOTAL</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-primary/20 text-center">
          <div className="font-display text-3xl font-bold text-primary">{goodCount}</div>
          <div className="font-mono text-xs text-text-secondary mt-1">GOOD 👍</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-secondary/20 text-center">
          <div className="font-display text-3xl font-bold text-secondary">{badCount}</div>
          <div className="font-mono text-xs text-text-secondary mt-1">IMPROVE 👎</div>
        </div>
      </div>

      {/* Filter + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {['All', 'Good', 'Needs Improvement'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading transition-all ${
                filter === f
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-card text-text-secondary border border-border hover:border-border-bright'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="px-3 py-1.5 rounded-lg text-xs font-heading bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
          >
            🔄 Refresh
          </button>
          {feedback.length > 0 && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg text-xs font-heading bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/20 transition-all"
            >
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="text-5xl mb-4 opacity-20">📭</div>
          <p className="text-text-secondary font-body">No feedback entries yet.</p>
          <p className="text-muted text-sm mt-1">Generate and rate captions in the Image Narrator tab.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {['Image', 'Generated Caption', 'Edited Caption', 'Rating', 'Timestamp'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-xs text-muted tracking-wider">
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary max-w-[120px] truncate">
                      {row.image}
                    </td>
                    <td className="px-4 py-3 text-text-primary text-xs max-w-[200px]">
                      <span title={row.generated_caption} className="line-clamp-2">{row.generated_caption}</span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs max-w-[200px]">
                      <span title={row.edited_caption} className="line-clamp-2">{row.edited_caption}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                        row.rating === 'Good'
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-secondary/10 text-secondary border border-secondary/20'
                      }`}>
                        {row.rating === 'Good' ? '👍' : '👎'} {row.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-border flex items-center justify-between">
            <span className="font-mono text-xs text-muted">{filtered.length} records</span>
            <span className="font-mono text-xs text-muted">Stored in feedback_log.csv</span>
          </div>
        </div>
      )}
    </div>
  );
}
