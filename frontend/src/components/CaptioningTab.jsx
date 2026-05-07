import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { captionImage, evaluateCaption, saveFeedback } from '../utils/api';

const MetricBar = ({ label, value, color }) => (
  <div className="metric-ring p-4 rounded-xl bg-card border border-border">
    <div className={`font-display text-3xl font-bold ${color} mb-1`}>
      {(value * 100).toFixed(1)}
      <span className="text-lg">%</span>
    </div>
    <div className="text-text-secondary text-xs font-mono">{label}</div>
    <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${Math.min(value * 100, 100)}%`,
          background: color === 'text-primary' ? '#4fffb0' : color === 'text-accent' ? '#7b61ff' : '#ff6b6b',
        }}
      />
    </div>
  </div>
);

export default function CaptioningTab() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [editedCaption, setEditedCaption] = useState('');
  const [reference, setReference] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState({ caption: false, eval: false, feedback: false });
  const [step, setStep] = useState(0); // 0=upload, 1=caption, 2=evaluate

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setCaption('');
    setEditedCaption('');
    setMetrics(null);
    setStep(1);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!imageFile) return;
    setLoading((l) => ({ ...l, caption: true }));
    try {
      const data = await captionImage(imageFile);
      setCaption(data.caption);
      setEditedCaption(data.caption);
      setStep(2);
      toast.success('Caption generated!');
    } catch {
      toast.error('Failed to generate caption. Is the backend running?');
    } finally {
      setLoading((l) => ({ ...l, caption: false }));
    }
  };

  const handleEvaluate = async () => {
    if (!reference.trim() || !caption) return;
    setLoading((l) => ({ ...l, eval: true }));
    try {
      const data = await evaluateCaption(reference, caption);
      setMetrics(data);
      toast.success('Evaluation complete!');
    } catch {
      toast.error('Evaluation failed.');
    } finally {
      setLoading((l) => ({ ...l, eval: false }));
    }
  };

  const handleFeedback = async (rating) => {
    setLoading((l) => ({ ...l, feedback: true }));
    try {
      await saveFeedback({
        image_name: imageFile?.name || 'unknown',
        generated_caption: caption,
        edited_caption: editedCaption,
        rating,
      });
      toast.success(`Feedback saved: ${rating}`);
    } catch {
      toast.error('Failed to save feedback.');
    } finally {
      setLoading((l) => ({ ...l, feedback: false }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">🧠</div>
          <span className="font-mono text-xs text-primary tracking-widest">MODULE 01</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-text-primary mb-2">
          IMAGE <span className="text-primary">NARRATOR</span>
        </h1>
        <p className="text-text-secondary font-body">
          Upload an image and let BLIP generate a descriptive caption. Evaluate quality with NLP metrics and submit feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload + Image */}
        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center
              ${isDragActive ? 'dropzone-active' : 'border-border hover:border-border-bright bg-card'}`}
          >
            <input {...getInputProps()} />
            <div className="text-4xl mb-3">📸</div>
            <p className="text-text-secondary text-sm font-body">
              {isDragActive ? 'Drop it!' : 'Drag & drop an image, or click to browse'}
            </p>
            <p className="text-muted text-xs mt-1 font-mono">JPG, PNG, WEBP</p>
          </div>

          {/* Preview */}
          {imagePreview && (
            <div className="rounded-xl overflow-hidden border border-border bg-card">
              <img src={imagePreview} alt="Preview" className="w-full object-cover max-h-72" />
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-text-secondary text-xs font-mono truncate">{imageFile?.name}</span>
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); setCaption(''); setMetrics(null); setStep(0); }}
                  className="text-muted hover:text-secondary text-xs ml-2"
                >
                  ✕ Clear
                </button>
              </div>
            </div>
          )}

          {/* Generate button */}
          {step >= 1 && (
            <button
              onClick={handleGenerate}
              disabled={loading.caption}
              className="btn-primary w-full py-3.5 rounded-xl bg-primary text-bg font-heading font-bold text-sm tracking-wide hover:bg-primary/90 transition-all duration-200 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.caption ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                  Generating…
                </span>
              ) : (
                '⚡ Generate Caption'
              )}
            </button>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {/* Caption */}
          {caption && (
            <div className="p-5 rounded-xl bg-card border border-primary/20 shadow-glow">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs text-primary tracking-wider">GENERATED CAPTION</span>
              </div>
              <p className="text-text-primary font-heading text-base leading-relaxed">{caption}</p>
            </div>
          )}

          {/* Editable caption */}
          {caption && (
            <div className="p-5 rounded-xl bg-card border border-border">
              <label className="font-mono text-xs text-text-secondary tracking-wider mb-2 block">EDIT CAPTION</label>
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                rows={3}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm font-body resize-none focus:outline-none focus:border-primary/50 transition-colors"
              />
              {/* Feedback buttons */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleFeedback('Good')}
                  disabled={loading.feedback}
                  className="flex-1 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-heading font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  👍 Good
                </button>
                <button
                  onClick={() => handleFeedback('Needs Improvement')}
                  disabled={loading.feedback}
                  className="flex-1 py-2.5 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-sm font-heading font-semibold hover:bg-secondary/20 transition-colors disabled:opacity-50"
                >
                  👎 Improve
                </button>
              </div>
            </div>
          )}

          {/* Evaluation */}
          {step >= 2 && (
            <div className="p-5 rounded-xl bg-card border border-border">
              <label className="font-mono text-xs text-text-secondary tracking-wider mb-2 block">REFERENCE CAPTION (for metrics)</label>
              <textarea
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter your own reference caption to compare…"
                rows={2}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm font-body resize-none focus:outline-none focus:border-accent/50 transition-colors placeholder:text-muted mb-3"
              />
              <button
                onClick={handleEvaluate}
                disabled={loading.eval || !reference.trim()}
                className="w-full py-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-heading font-semibold hover:bg-accent/20 transition-colors disabled:opacity-50"
              >
                {loading.eval ? 'Evaluating…' : '📊 Run Evaluation'}
              </button>
            </div>
          )}

          {/* Metrics */}
          {metrics && (
            <div className="grid grid-cols-3 gap-3">
              <MetricBar label="BLEU" value={metrics.bleu} color="text-primary" />
              <MetricBar label="ROUGE-L" value={metrics.rouge_l} color="text-accent" />
              <MetricBar label="CIDEr" value={metrics.cider_like} color="text-secondary" />
            </div>
          )}

          {/* Empty state */}
          {!caption && !loading.caption && (
            <div className="h-48 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6">
              <div className="text-4xl mb-3 opacity-30">✨</div>
              <p className="text-muted text-sm font-body">Upload an image and generate a caption to see results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
