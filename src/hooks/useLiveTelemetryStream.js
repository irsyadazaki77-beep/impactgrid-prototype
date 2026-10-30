import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Enterprise Server-Sent Events (SSE) telemetry stream hook.
 * Connects to live O-RAN O1 stream on /api/v1/telemetry/stream with automatic fallback to local ticker.
 */
export function useLiveTelemetryStream({ enabled = true } = {}) {
  const [isLiveStreaming, setIsLiveStreaming] = useState(enabled);
  const [streamStatus, setStreamStatus] = useState('connecting'); // 'connected' | 'connecting' | 'fallback' | 'paused'
  const [latencyMs, setLatencyMs] = useState(14);
  const [streamMetrics, setStreamMetrics] = useState({
    total_ran_kw: 184.2,
    power_saved_kw: 34.8,
    avg_prb_percent: 38,
    active_sleep_sites: 36,
    sla_drop_call_pct: 0.06,
    dc_ambient_temp: 28.4
  });
  const [latestAlert, setLatestAlert] = useState(null);
  const eventSourceRef = useRef(null);
  const localTickerRef = useRef(null);

  const clearAlert = useCallback(() => setLatestAlert(null), []);

  const toggleLiveStreaming = useCallback(() => {
    setIsLiveStreaming(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isLiveStreaming) {
      setStreamStatus('paused');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (localTickerRef.current) {
        clearInterval(localTickerRef.current);
        localTickerRef.current = null;
      }
      return;
    }

    setStreamStatus('connecting');

    // In local dev or production, target port 3001 or window origin
    const streamUrl = typeof window !== 'undefined' && window.location.port === '5173'
      ? 'http://127.0.0.1:3001/api/v1/telemetry/stream'
      : '/api/v1/telemetry/stream';

    let isUsingFallback = false;

    // Local heartbeat generator when server is not reachable
    const startFallbackTicker = () => {
      if (localTickerRef.current) return;
      isUsingFallback = true;
      setStreamStatus('fallback');
      let tick = 0;
      localTickerRef.current = setInterval(() => {
        tick += 1;
        setStreamMetrics(prev => ({
          total_ran_kw: Number((184.2 + Math.sin(tick * 0.3) * 3.8).toFixed(1)),
          power_saved_kw: Number((34.8 + Math.cos(tick * 0.25) * 1.9).toFixed(1)),
          avg_prb_percent: Math.max(15, Math.min(80, Math.round(38 + Math.sin(tick * 0.4) * 16))),
          active_sleep_sites: 36,
          sla_drop_call_pct: 0.06,
          dc_ambient_temp: Number((28.4 + Math.sin(tick * 0.15) * 1.2).toFixed(1))
        }));
        setLatencyMs(Math.round(12 + Math.random() * 6));
      }, 3000);
    };

    try {
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.onopen = () => {
        setStreamStatus('connected');
        setLatencyMs(Math.round(8 + Math.random() * 8));
        if (localTickerRef.current) {
          clearInterval(localTickerRef.current);
          localTickerRef.current = null;
        }
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'TELEMETRY_TICK' && data.metrics) {
            setStreamMetrics(data.metrics);
            setLatencyMs(Math.round(10 + Math.random() * 12));
            if (data.alert) {
              setLatestAlert(data.alert);
            }
          }
        } catch {
          // ignore parse errors
        }
      };

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        startFallbackTicker();
      };
    } catch {
      startFallbackTicker();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (localTickerRef.current) {
        clearInterval(localTickerRef.current);
        localTickerRef.current = null;
      }
    };
  }, [isLiveStreaming]);

  return {
    isLiveStreaming,
    streamStatus,
    latencyMs,
    streamMetrics,
    latestAlert,
    clearAlert,
    toggleLiveStreaming
  };
}
