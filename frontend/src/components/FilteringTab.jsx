import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { filterImage } from '../utils/api';

const FILTERS = [
  { id: 'Grayscale',      icon: '⬜', desc: 'Remove color' },
  { id: 'Gaussian Blur',  icon: '🌫️', desc: 'Smooth edges' },
  { id: 'Edge Detection', icon: '🔲', desc: 'Highlight edges' },
  { id: 'Median Blur',    icon: '💧', desc: 'Noise reduction' },
  { id: 'Erosion',        icon: '🔺', desc: 'Shrink shapes' },
  { id: 'Dilation',       icon: '🔷', desc: 'Expand shapes' },
  { id: 'Sharpening',     icon: '🔪', desc: 'Enhance details' },
  { id: 'Sepia',          icon: '🟫', desc: 'Vintage tone' },
  { id: 'Emboss',         icon: '🗿', desc: '3D relief effect' },
  { id: 'Invert',         icon: '🔄', desc: 'Flip colors' },
];

export default function FilteringTab() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Grayscale');
  const [filteredImage, setFilteredImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Params
  const [ksize, setKsize] = useState(5);
  const [thresh1, setThresh1] = useState(100);
  const [thresh2, setThresh2] = useState(200);
  const [iterations, setIterations] = useState(1);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFilteredImage(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: false,
  });

  const handleApplyFilter = async () => {
    if (!imageFile) { toast.error('Upload an image first'); return; }
    setLoading(true);
    try {
      const params = { filter_type: selectedFilter, ksize, thresh1, thresh2, iterations };
      const data = await filterImage(imageFile, params);
      setFilteredImage(data.filtered_image);
      toast.success(`${selectedFilter} applied!`);
    } catch {
      toast.error('Filter failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!filteredImage) return;
    const a = document.createElement('a');
    a.href = filteredImage;
    a.download = `filtered_${selectedFilter.replace(/\s/g, '_')}_${imageFile?.name || 'image.png'}`;
    a.click();
  };

  const needsKsize    = ['Gaussian Blur', 'Median Blur'].includes(selectedFilter);
  const needsEdge     = selectedFilter === 'Edge Detection';
  const needsIter     = ['Erosion', 'Dilation'].includes(selectedFilter);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-lg">🎨</div>
          <span className="font-mono text-xs text-accent tracking-widest">MODULE 02</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-text-primary mb-2">
          FILTER <span className="text-accent">STUDIO</span>
        </h1>
        <p className="text-text-secondary font-body">
          Apply 10 real-time OpenCV filters to your images. Tune parameters and download the result.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center
              ${isDragActive ? 'dropzone-active' : 'border-border hover:border-border-bright bg-card'}`}
          >
            <input {...getInputProps()} />
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-text-secondary text-sm font-body">
              {isDragActive ? 'Drop it!' : 'Upload an image'}
            </p>
            <p className="text-muted text-xs mt-1 font-mono">JPG, PNG, WEBP</p>
          </div>

          {/* Filter selector */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <label className="font-mono text-xs text-text-secondary tracking-wider mb-3 block">SELECT FILTER</label>
            <div className="grid grid-cols-2 gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { setSelectedFilter(f.id); setFilteredImage(null); }}
                  className={`p-2.5 rounded-lg text-left transition-all duration-150 border text-xs font-heading ${
                    selectedFilter === f.id
                      ? 'bg-accent/15 border-accent/30 text-accent'
                      : 'bg-surface border-border text-text-secondary hover:border-border-bright'
                  }`}
                >
                  <span className="mr-1">{f.icon}</span> {f.id}
                  <div className="text-muted text-[10px] font-body mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Params */}
          {(needsKsize || needsEdge || needsIter) && (
            <div className="p-4 rounded-xl bg-card border border-border space-y-4">
              <label className="font-mono text-xs text-text-secondary tracking-wider block">PARAMETERS</label>

              {needsKsize && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-text-secondary font-mono">Kernel Size</span>
                    <span className="text-xs text-primary font-mono">{ksize}</span>
                  </div>
                  <input type="range" min={1} max={31} step={2} value={ksize}
                    onChange={(e) => setKsize(Number(e.target.value))}
                    className="w-full accent-primary" />
                </div>
              )}

              {needsEdge && (
                <>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-text-secondary font-mono">Threshold 1</span>
                      <span className="text-xs text-primary font-mono">{thresh1}</span>
                    </div>
                    <input type="range" min={50} max={300} step={10} value={thresh1}
                      onChange={(e) => setThresh1(Number(e.target.value))}
                      className="w-full accent-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-text-secondary font-mono">Threshold 2</span>
                      <span className="text-xs text-primary font-mono">{thresh2}</span>
                    </div>
                    <input type="range" min={50} max={300} step={10} value={thresh2}
                      onChange={(e) => setThresh2(Number(e.target.value))}
                      className="w-full accent-primary" />
                  </div>
                </>
              )}

              {needsIter && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-text-secondary font-mono">Iterations</span>
                    <span className="text-xs text-primary font-mono">{iterations}</span>
                  </div>
                  <input type="range" min={1} max={10} value={iterations}
                    onChange={(e) => setIterations(Number(e.target.value))}
                    className="w-full accent-primary" />
                </div>
              )}
            </div>
          )}

          {/* Apply button */}
          <button
            onClick={handleApplyFilter}
            disabled={loading || !imageFile}
            className="btn-primary w-full py-3.5 rounded-xl bg-accent text-white font-heading font-bold text-sm tracking-wide hover:bg-accent/90 transition-all duration-200 shadow-glow-accent disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Applying…
              </span>
            ) : (
              `✨ Apply ${selectedFilter}`
            )}
          </button>
        </div>

        {/* Right: Before / After */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Original */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="px-4 py-2 border-b border-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-text-secondary" />
                <span className="font-mono text-xs text-text-secondary">ORIGINAL</span>
              </div>
              {imagePreview ? (
                <img src={imagePreview} alt="Original" className="w-full object-contain max-h-64" />
              ) : (
                <div className="h-48 flex items-center justify-center text-muted text-sm">No image</div>
              )}
            </div>

            {/* Filtered */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="px-4 py-2 border-b border-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-mono text-xs text-accent">{selectedFilter.toUpperCase()}</span>
              </div>
              {loading ? (
                <div className="h-48 shimmer" />
              ) : filteredImage ? (
                <img src={filteredImage} alt="Filtered" className="w-full object-contain max-h-64" />
              ) : (
                <div className="h-48 flex items-center justify-center text-muted text-sm">
                  {imageFile ? 'Hit Apply to see result' : 'No image'}
                </div>
              )}
            </div>
          </div>

          {/* Download */}
          {filteredImage && (
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-heading font-semibold text-sm hover:bg-primary/20 transition-colors"
            >
              ⬇️ Download Filtered Image
            </button>
          )}

          {/* Info card */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-heading font-semibold text-text-primary text-sm mb-3">Filter Reference</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FILTERS.map((f) => (
                <div key={f.id} className="flex items-center gap-2 text-xs">
                  <span>{f.icon}</span>
                  <div>
                    <div className="text-text-secondary font-heading">{f.id}</div>
                    <div className="text-muted font-body">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
