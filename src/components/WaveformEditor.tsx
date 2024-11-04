import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WaveformEditorProps {
  waveformData?: number[];
  duration: number;
  trimStart: number;
  trimEnd: number;
  onTrimChange: (start: number, end: number) => void;
}

export function WaveformEditor({
  waveformData = [],
  duration,
  trimStart,
  trimEnd,
  onTrimChange,
}: WaveformEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw waveform if data exists
    if (waveformData.length > 0) {
      const barWidth = rect.width / waveformData.length;
      const heightScale = rect.height / 2;

      ctx.beginPath();
      ctx.moveTo(0, rect.height / 2);
      waveformData.forEach((amplitude, i) => {
        const x = i * barWidth;
        const y = (1 - amplitude) * heightScale;
        ctx.lineTo(x, y);
      });
      
      // Draw the mirror of the waveform
      [...waveformData].reverse().forEach((amplitude, i) => {
        const x = (waveformData.length - 1 - i) * barWidth;
        const y = (1 + amplitude) * heightScale;
        ctx.lineTo(x, y);
      });
      
      ctx.closePath();
      ctx.fillStyle = '#60a5fa';
      ctx.fill();
    } else {
      // Draw placeholder line if no waveform data
      ctx.beginPath();
      ctx.moveTo(0, rect.height / 2);
      ctx.lineTo(rect.width, rect.height / 2);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw trim handles
    const startX = (trimStart / duration) * rect.width;
    const endX = (trimEnd / duration) * rect.width;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, startX, rect.height);
    ctx.fillRect(endX, 0, rect.width - endX, rect.height);

    // Draw trim lines
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX, rect.height);
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX, rect.height);
    ctx.stroke();
  }, [waveformData, duration, trimStart, trimEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;

    const startX = (trimStart / duration) * rect.width;
    const endX = (trimEnd / duration) * rect.width;

    if (Math.abs(x - startX) < 10) {
      setIsDragging('start');
    } else if (Math.abs(x - endX) < 10) {
      setIsDragging('end');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = (x / rect.width) * duration;

    if (isDragging === 'start') {
      onTrimChange(Math.min(time, trimEnd - 0.1), trimEnd);
    } else {
      onTrimChange(trimStart, Math.max(time, trimStart + 0.1));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  return (
    <div className="relative" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="w-full h-24 cursor-col-resize"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="absolute top-0 left-0 h-full" style={{ left: `${(trimStart / duration) * 100}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -left-3 bg-blue-600 rounded-full p-1 cursor-ew-resize">
          <ChevronLeft className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="absolute top-0 h-full" style={{ left: `${(trimEnd / duration) * 100}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -right-3 bg-blue-600 rounded-full p-1 cursor-ew-resize">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}