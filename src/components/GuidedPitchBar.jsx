import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Clock3, Maximize2, Minimize2, Pause, Play, RotateCcw, X } from 'lucide-react';
import { PRESENTATION_DURATION_SECONDS, PRESENTATION_STEPS } from '../data/presentationScript';
import { isShortcutTargetEditable } from '../utils/demoState';

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

export default function GuidedPitchBar({
  isActive,
  onClose,
  onNavigateTab,
  shortcutsEnabled = true,
  onNotesExpandedChange,
  onRestartPresentation
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const current = PRESENTATION_STEPS[currentStep];
  const remainingSeconds = Math.max(0, PRESENTATION_DURATION_SECONDS - secondsElapsed);
  const isOvertime = secondsElapsed > PRESENTATION_DURATION_SECONDS;
  const progress = Math.min(100, secondsElapsed / PRESENTATION_DURATION_SECONDS * 100);

  const goToStep = useCallback((index) => {
    if (index < 0 || index >= PRESENTATION_STEPS.length) return;
    setCurrentStep(index);
    onNavigateTab?.(PRESENTATION_STEPS[index].tab);
  }, [onNavigateTab]);

  const resetPresentation = useCallback(() => {
    setCurrentStep(0);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
    setIsNotesExpanded(false);
    onNotesExpandedChange?.(false);
    onNavigateTab?.(PRESENTATION_STEPS[0].tab);
  }, [onNavigateTab, onNotesExpandedChange]);

  useEffect(() => {
    if (isActive) resetPresentation();
  }, [isActive, resetPresentation]);

  useEffect(() => {
    if (!isActive || !isTimerRunning) return undefined;
    const timer = window.setInterval(() => setSecondsElapsed((elapsed) => elapsed + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isActive, isTimerRunning]);

  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', updateFullscreen);
    return () => document.removeEventListener('fullscreenchange', updateFullscreen);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen may be unavailable in embedded or restricted browser contexts.
    }
  }, []);

  useEffect(() => {
    if (!isActive || !shortcutsEnabled) return undefined;
    const handleKey = (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isShortcutTargetEditable(event.target)) return;
      if (event.key === ' ' && event.target.closest?.('button, a, [role="button"]')) return;
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        goToStep(Math.min(PRESENTATION_STEPS.length - 1, currentStep + 1));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToStep(Math.max(0, currentStep - 1));
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFullscreen();
      } else if (event.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentStep, goToStep, isActive, onClose, shortcutsEnabled, toggleFullscreen]);

  const toggleNotes = useCallback(() => {
    setIsNotesExpanded((expanded) => {
      const next = !expanded;
      onNotesExpandedChange?.(next);
      return next;
    });
  }, [onNotesExpandedChange]);

  const stageStatus = useMemo(() => `${currentStep + 1} dari ${PRESENTATION_STEPS.length}`, [currentStep]);
  if (!isActive) return null;

  return (
    <section className={`presentation-dock ${isNotesExpanded ? 'has-presenter-notes' : ''}`} aria-label="Kontrol presentasi 7 menit">
      <div className="presentation-dock-inner">
        <div className="presentation-topline">
          <div className="presentation-heading">
            <span className="presentation-kicker">PRESENTASI DIREKSI · DEMO</span>
            <span className="presentation-stage-number" aria-label={`Tahap ${stageStatus}`}>{stageStatus}</span>
            <h2 key={current.step} className="presentation-title">{current.title}</h2>
          </div>
          <div className="presentation-controls" aria-label="Kontrol pitch">
            <div className={`presentation-timer ${isOvertime ? 'is-overtime' : ''}`} role="timer" aria-label={`Sisa waktu ${formatTime(remainingSeconds)}`}>
              <Clock3 aria-hidden="true" size={17} />
              <span className="presentation-time-main">{isOvertime ? `+${formatTime(secondsElapsed - PRESENTATION_DURATION_SECONDS)}` : formatTime(remainingSeconds)}</span>
              <span className="presentation-time-caption">{isOvertime ? 'lewat' : 'tersisa'}</span>
            </div>
            <button type="button" className="presentation-icon-button" onClick={() => setIsTimerRunning((running) => !running)} aria-label={isTimerRunning ? 'Jeda timer' : 'Lanjutkan timer'} title={isTimerRunning ? 'Jeda timer' : 'Lanjutkan timer'}>
              {isTimerRunning ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <button type="button" className="presentation-icon-button" onClick={onRestartPresentation || resetPresentation} aria-label="Ulangi presentasi dari awal" title="Ulangi presentasi dan preset demo dari awal">
              <RotateCcw size={17} />
            </button>
            <button type="button" className="presentation-icon-button" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'} title={isFullscreen ? 'Keluar layar penuh (F)' : 'Layar penuh (F)'}>
              {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
            <button type="button" className="presentation-icon-button is-close" onClick={onClose} aria-label="Tutup presentasi" title="Tutup presentasi (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        <div key={`message-${current.step}`} className="presentation-message" aria-live="polite">
          <p>{current.message}</p>
          <div className="presentation-visual"><span>Visual</span>{current.visual}</div>
        </div>

        <div className="presentation-progress-row">
          <div className="presentation-progress" role="progressbar" aria-label="Progress waktu presentasi" aria-valuemin={0} aria-valuemax={PRESENTATION_DURATION_SECONDS} aria-valuenow={Math.min(secondsElapsed, PRESENTATION_DURATION_SECONDS)}>
            <div className="presentation-progress-fill" style={{ width: `${progress}%` }} />
            {PRESENTATION_STEPS.slice(1).map((step) => <span key={step.step} className="presentation-progress-tick" style={{ left: `${step.startSeconds / PRESENTATION_DURATION_SECONDS * 100}%` }} />)}
          </div>
          <div className="presentation-step-nav">
            <button type="button" onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0} aria-label="Tahap sebelumnya (panah kiri)"><ChevronLeft size={18} /></button>
            <span>{current.timing}</span>
            <button type="button" onClick={() => goToStep(currentStep + 1)} disabled={currentStep === PRESENTATION_STEPS.length - 1} aria-label="Tahap berikutnya (panah kanan atau spasi)"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="presentation-shortcut-help">Panah kiri/kanan atau Spasi untuk berpindah · F layar penuh · W keluar/masuk presentasi</div>
        <button type="button" className="presentation-notes-toggle" onClick={toggleNotes} aria-expanded={isNotesExpanded}>
          <BookOpen size={16} /> {isNotesExpanded ? 'Sembunyikan presenter notes' : 'Buka presenter notes dan sumber'}
        </button>

        {isNotesExpanded && <div className="presentation-notes" aria-label="Presenter notes">
          <div><span className="presentation-note-label">SKRIP RESMI · {current.timing}</span><p className="presentation-script">“{current.script}”</p></div>
          <div className="presentation-notes-meta">
            <p><strong>Angka / sumber / asumsi</strong>{current.evidence}</p>
            <p><strong>Catatan presenter</strong>{current.presenterNote}</p>
          </div>
        </div>}
      </div>
    </section>
  );
}
