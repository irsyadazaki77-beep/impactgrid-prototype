import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Clock3, Maximize2, Minimize2, Pause, Play, RotateCcw, X, Zap, ExternalLink } from 'lucide-react';
import { PRESENTATION_DURATION_SECONDS, PRESENTATION_STEPS } from '../data/presentationScript';
import { isShortcutTargetEditable } from '../utils/demoState';

const QA_JUMP_TARGETS = [
  { id: 'qos', label: 'Proteksi QoS & 112', tab: 'pilotvalidation', targetId: 'pitch-step-5-pilotvalidation', cue: 'Buka bukti mitigasi risiko layanan vital dan fail-safe rollback 120 detik.' },
  { id: 'npv', label: 'Sensitivitas Finansial', tab: 'financial', targetId: 'pitch-step-6-financial', cue: 'Bandingkan 50 kWh/hari vs 50 MWh/tahun; NPV bukan ramalan pasti.' },
  { id: 'vendor', label: 'Diferensiasi vs Vendor', tab: 'architecture', targetId: 'it-enterprise-hub', cue: 'Tampilkan matriks orkestrasi lintas vendor vs fitur silo Ericsson/Huawei.' },
  { id: 'gate', label: 'Gerbang Keputusan G0–G3', tab: 'overview', targetId: 'pitch-step-8-decisiongates', cue: 'Tunjukkan simulator Go/No-Go: Stop proyek jika kapabilitas internal cukup.' },
  { id: 'social', label: 'Dividen Sosial & Inklusi', tab: 'esg', targetId: 'social-dividend-card', cue: 'Tampilkan reinvestasi kas efisiensi daya ke program Jaga Cita & 3T.' }
];

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
    const step = PRESENTATION_STEPS[index];
    onNavigateTab?.(step.tab);
    if (step.targetId) {
      setTimeout(() => {
        const el = document.getElementById(step.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
  }, [onNavigateTab]);

  const resetPresentation = useCallback(() => {
    setCurrentStep(0);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
    setIsNotesExpanded(false);
    onNotesExpandedChange?.(false);
    onNavigateTab?.(PRESENTATION_STEPS[0].tab);
    if (PRESENTATION_STEPS[0].targetId) {
      setTimeout(() => {
        const el = document.getElementById(PRESENTATION_STEPS[0].targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    }
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

  const openPresenterConsole = useCallback(() => {
    const win = window.open('', 'ImpactGridPresenterConsole', 'width=800,height=650,menubar=no,toolbar=no');
    if (!win) return;
    win.document.title = 'ImpactGrid Executive Walkthrough · Telkomsel Energy Operations';
    win.document.body.style.margin = '0';
    win.document.body.style.fontFamily = 'system-ui, sans-serif';
    win.document.body.style.backgroundColor = '#0b1324';
    win.document.body.style.color = '#f8fafc';
    win.document.body.style.padding = '24px';
    win.document.body.innerHTML = `
      <div style="max-width: 720px; margin: 0 auto; line-height: 1.5;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ef4444; padding-bottom: 12px;">
          <div>
            <span style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase;">Executive Console · Telkomsel Operations</span>
            <h1 style="margin: 4px 0 0; font-size: 20px; font-weight: 900;">${current.title}</h1>
          </div>
          <div style="font-size: 24px; font-weight: 900; font-family: monospace; background: #1e293b; padding: 6px 14px; border-radius: 10px; color: #f59e0b;">
            ${formatTime(remainingSeconds)}
          </div>
        </div>

        <div style="margin-top: 18px; padding: 18px; background: #1e293b; border-radius: 16px; border: 1px solid #334155;">
          <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">Pokok Telaah Eksekutif · ${current.timing}</span>
          <p style="margin: 8px 0 0; font-size: 17px; font-weight: 600; line-height: 1.6; color: #ffffff;">“${current.script}”</p>
        </div>

        <div style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
          <div style="padding: 12px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
            <strong style="color: #94a3b8; display: block; font-size: 10px; text-transform: uppercase;">Visual Cue di Panggung</strong>
            <span style="color: #f1f5f9; margin-top: 4px; display: block;">${current.visual}</span>
          </div>
          <div style="padding: 12px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
            <strong style="color: #94a3b8; display: block; font-size: 10px; text-transform: uppercase;">Evidence & Batas Klaim</strong>
            <span style="color: #f59e0b; margin-top: 4px; display: block;">${current.evidence}</span>
          </div>
        </div>

        <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; text-align: center;">
          Gunakan tombol di jendela utama untuk berpindah tahap otomatis.
        </div>
      </div>
    `;
  }, [current, remainingSeconds]);

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
            <button type="button" className="presentation-icon-button" onClick={openPresenterConsole} aria-label="Buka Layar Presenter Terpisah" title="Buka Layar Presenter Terpisah (Dual-Screen)">
              <ExternalLink size={17} />
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

        {/* 8-Stage Step-Dots Quick Jump */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Lompat Tahap:</span>
          {PRESENTATION_STEPS.map((step, idx) => (
            <button
              key={step.step}
              type="button"
              onClick={() => goToStep(idx)}
              className={`h-6 px-2 rounded-md text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shrink-0 ${
                currentStep === idx
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={`${step.title} (${step.timing})`}
            >
              <span>{step.step}.</span>
              <span className="truncate max-w-[70px] sm:max-w-none">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Sesi Q&A Evaluasi Dewan Direksi */}
        <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="font-extrabold text-amber-500 flex items-center gap-1">
            <Zap size={12} />
            <span>Loncat Q&A:</span>
          </span>
          {QA_JUMP_TARGETS.map(target => (
            <button
              key={target.id}
              type="button"
              onClick={() => {
                onNavigateTab?.(target.tab);
                if (target.targetId) {
                  setTimeout(() => {
                    const el = document.getElementById(target.targetId);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }, 120);
                }
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-semibold transition cursor-pointer"
              title={target.cue}
            >
              {target.label}
            </button>
          ))}
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
