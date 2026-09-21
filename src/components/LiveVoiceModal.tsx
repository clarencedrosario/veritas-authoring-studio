import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  X,
  Square,
  AlertCircle,
  Copy,
  Check,
  Headphones,
  Sliders,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { NovelProject } from '../types';

interface LiveVoiceModalProps {
  onClose: () => void;
  isDarkMode: boolean;
  project?: NovelProject;
  activeContextText?: string;
}

interface TranscriptEntry {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

const SUPPORTED_VOICES = [
  { name: 'Zephyr', description: 'Warm, thoughtful, and expressive (Recommended)' },
  { name: 'Kore', description: 'Calm, crisp, and articulate' },
  { name: 'Puck', description: 'Playful, lively, and energetic' },
  { name: 'Charon', description: 'Deep, resonant, and measured' },
  { name: 'Fenrir', description: 'Authoritative, clear, and confident' },
];

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  onClose,
  project,
  activeContextText,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'companion' | 'error'
  >('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQuotaIssue, setIsQuotaIssue] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('Zephyr');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [userAudioLevel, setUserAudioLevel] = useState(0);
  const [modelAudioLevel, setModelAudioLevel] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [isTTSActive, setIsTTSActive] = useState(true);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // Audio & WebSocket refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const activeAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextPlaybackTimeRef = useRef<number>(0);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMicMuted;

  // Speech Recognition ref for Companion Mode
  const recognitionRef = useRef<any>(null);

  // Transcript container auto-scroll
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Audio helper: Float32Array to 16-bit linear PCM little-endian
  const floatTo16BitPCM = (input: Float32Array): ArrayBuffer => {
    const output = new ArrayBuffer(input.length * 2);
    const view = new DataView(output);
    let offset = 0;
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return output;
  };

  // Audio helper: ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Audio helper: Base64 to Int16Array
  const base64ToInt16 = (base64: string): Int16Array => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Int16Array(bytes.buffer);
  };

  // Stop and clear all currently playing model audio chunks (barge-in / interrupt)
  const stopAllModelAudio = useCallback(() => {
    activeAudioSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {}
    });
    activeAudioSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextPlaybackTimeRef.current = outputAudioCtxRef.current.currentTime;
    }

    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    setIsModelSpeaking(false);
    setModelAudioLevel(0);
  }, []);

  // Text-to-Speech synthesis for Companion Mode
  const speakText = useCallback(
    (text: string) => {
      if (!isTTSActive || !window.speechSynthesis) return;

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = selectedVoice === 'Puck' ? 1.15 : selectedVoice === 'Charon' ? 0.85 : 1.0;

        // Try selecting an English voice matching tone if available
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
        );
        if (preferred) {
          utterance.voice = preferred;
        }

        setIsModelSpeaking(true);
        setModelAudioLevel(65);

        utterance.onend = () => {
          setIsModelSpeaking(false);
          setModelAudioLevel(0);
        };

        utterance.onerror = () => {
          setIsModelSpeaking(false);
          setModelAudioLevel(0);
        };

        window.speechSynthesis.speak(utterance);
      } catch (e: any) {
        console.warn('[Live Voice] Speech synthesis notice:', e?.message);
        setIsModelSpeaking(false);
        setModelAudioLevel(0);
      }
    },
    [isTTSActive, selectedVoice]
  );

  // Send message to Companion API (fallback mode or chat mode)
  const sendCompanionMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isGeneratingReply) return;

      const trimmed = userText.trim();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add user transcript
      setTranscripts((prev) => [
        ...prev,
        {
          id: `tr-${Date.now()}-${Math.random()}`,
          sender: 'user',
          text: trimmed,
          timestamp: timeStr,
        },
      ]);
      setTextInput('');
      setIsGeneratingReply(true);

      try {
        const res = await fetch('/api/gemini/companion-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            context: activeContextText || '',
            projectInfo: project ? `Project: "${project.title || 'Untitled'}" by ${project.authorName || 'Author'}` : '',
            voiceName: selectedVoice,
          }),
        });

        const data = await res.json();
        const reply = data.reply || 'I am ready to help brainstorm ideas, refine narrative passages, or discuss grammar.';

        setTranscripts((prev) => [
          ...prev,
          {
            id: `tr-${Date.now()}-${Math.random()}`,
            sender: 'gemini',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        speakText(reply);
      } catch (err: any) {
        console.warn('[Live Voice] Companion fetch notice:', err?.message);
        const fallbackReply = 'I am listening. Try focusing on the sensory contrast in this scene or examining sentence rhythm.';
        setTranscripts((prev) => [
          ...prev,
          {
            id: `tr-${Date.now()}-${Math.random()}`,
            sender: 'gemini',
            text: fallbackReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        speakText(fallbackReply);
      } finally {
        setIsGeneratingReply(false);
      }
    },
    [activeContextText, project, selectedVoice, isGeneratingReply, speakText]
  );

  // Start Browser Speech Recognition for Companion Mode
  const toggleSpeechRecognition = useCallback(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Speech recognition is not supported in this browser. You can type queries directly in the input bar below.');
      return;
    }

    if (isDictating && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsDictating(true);
        setUserAudioLevel(50);
      };

      recognition.onresult = (event: any) => {
        const speechText = event.results[0]?.[0]?.transcript || '';
        if (speechText.trim()) {
          sendCompanionMessage(speechText.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[Live Voice] Speech recognition notice:', event?.error);
        setIsDictating(false);
        setUserAudioLevel(0);
      };

      recognition.onend = () => {
        setIsDictating(false);
        setUserAudioLevel(0);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('[Live Voice] Could not start speech recognition:', err?.message);
      setIsDictating(false);
    }
  }, [isDictating, sendCompanionMessage]);

  // Connect to Gemini Live API via WebSocket
  const startSession = useCallback(async () => {
    setErrorMessage(null);
    setIsQuotaIssue(false);
    setConnectionStatus('connecting');

    try {
      // 1. Initialize output AudioContext (24kHz as required by Live API)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const outCtx = new AudioContextClass({ sampleRate: 24000 });
      if (outCtx.state === 'suspended') {
        await outCtx.resume();
      }
      outputAudioCtxRef.current = outCtx;
      nextPlaybackTimeRef.current = outCtx.currentTime;

      // 2. Request user microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 3. Initialize input AudioContext (16kHz as required by Live API)
      const inCtx = new AudioContextClass({ sampleRate: 16000 });
      if (inCtx.state === 'suspended') {
        await inCtx.resume();
      }
      inputAudioCtxRef.current = inCtx;

      // 4. Connect WebSocket to server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live?voice=${encodeURIComponent(selectedVoice)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.info('[Live Voice] WebSocket connected to server');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.status === 'connected') {
            setConnectionStatus('connected');
            setErrorMessage(null);
          } else if (data.status === 'connecting') {
            setConnectionStatus('connecting');
          } else if (data.status === 'closed') {
            stopAllModelAudio();
            if (data.isQuotaOrCreditIssue || (data.error && /credit|prepayment|depleted|billing/i.test(data.error))) {
              setIsQuotaIssue(true);
              setErrorMessage('Gemini prepayment credits are depleted for real-time WebSocket streaming audio. Speech & Chat companion mode is ready.');
              setConnectionStatus('companion');
            } else {
              setErrorMessage(data.error || 'Live voice session closed.');
              setConnectionStatus('companion');
            }
          }

          if (data.error && data.status !== 'closed') {
            if (/credit|prepayment|depleted|billing/i.test(data.error)) {
              setIsQuotaIssue(true);
              setErrorMessage('Gemini prepayment credits are depleted for real-time streaming audio. Switched to Speech & Chat companion mode.');
              setConnectionStatus('companion');
            } else {
              setErrorMessage(data.error);
            }
          }

          // Interruption: model audio interrupted by user speech (barge-in)
          if (data.interrupted) {
            stopAllModelAudio();
          }

          // Model transcription text
          if (data.text) {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'gemini') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: (last.text + ' ' + data.text).trim() },
                ];
              }
              return [
                ...prev,
                {
                  id: `tr-${Date.now()}-${Math.random()}`,
                  sender: 'gemini',
                  text: data.text,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ];
            });
          }

          // User transcription text
          if (data.userText) {
            setTranscripts((prev) => [
              ...prev,
              {
                id: `tr-${Date.now()}-${Math.random()}`,
                sender: 'user',
                text: data.userText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }

          // Play incoming audio chunk (24kHz 16-bit linear PCM)
          if (data.audio && outputAudioCtxRef.current) {
            const outAudioCtx = outputAudioCtxRef.current;
            const pcm16 = base64ToInt16(data.audio);
            const buffer = outAudioCtx.createBuffer(1, pcm16.length, 24000);
            const channelData = buffer.getChannelData(0);

            // Compute rough RMS for animation
            let sumSquare = 0;
            for (let i = 0; i < pcm16.length; i++) {
              const normalized = pcm16[i] / 32768.0;
              channelData[i] = normalized;
              sumSquare += normalized * normalized;
            }
            const rms = Math.sqrt(sumSquare / pcm16.length);
            setModelAudioLevel(Math.min(100, Math.round(rms * 150)));

            const source = outAudioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outAudioCtx.destination);

            const currentTime = outAudioCtx.currentTime;
            const startTime = Math.max(currentTime, nextPlaybackTimeRef.current);
            source.start(startTime);
            nextPlaybackTimeRef.current = startTime + buffer.duration;

            setIsModelSpeaking(true);
            activeAudioSourcesRef.current.push(source);

            source.onended = () => {
              activeAudioSourcesRef.current = activeAudioSourcesRef.current.filter((s) => s !== source);
              if (activeAudioSourcesRef.current.length === 0) {
                setIsModelSpeaking(false);
                setModelAudioLevel(0);
              }
            };
          }
        } catch (err: any) {
          console.warn('[Live Voice] Incoming WS message notice:', err?.message);
        }
      };

      // Safely handle WebSocket errors without causing unhandled console exceptions
      ws.onerror = (_e) => {
        console.info('[Live Voice] WebSocket streaming notice: switching to companion mode');
        setIsQuotaIssue(true);
        setErrorMessage('Streaming voice connection closed. Speech & Chat companion mode is active so you can converse seamlessly.');
        setConnectionStatus('companion');
      };

      ws.onclose = (e) => {
        console.info('[Live Voice] WebSocket closed', e.code, e.reason);
        stopAllModelAudio();
        if (e.code === 1011 || (e.reason && /credit|prepayment|depleted|billing/i.test(e.reason))) {
          setIsQuotaIssue(true);
          setErrorMessage('Gemini prepayment credits are depleted for real-time WebSocket streaming audio. Speech & Chat companion mode is ready.');
          setConnectionStatus('companion');
        } else {
          setConnectionStatus((prev) => (prev === 'connected' ? 'disconnected' : 'companion'));
        }
      };

      // 5. Connect microphone input processor node
      const sourceNode = inCtx.createMediaStreamSource(stream);
      const processor = inCtx.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          setUserAudioLevel(0);
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);

        // Compute RMS for live input visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setUserAudioLevel(Math.min(100, Math.round(rms * 220)));

        // Send 16kHz linear PCM to Gemini Live API
        const pcmBuffer = floatTo16BitPCM(inputData);
        const base64Chunk = arrayBufferToBase64(pcmBuffer);
        try {
          wsRef.current.send(JSON.stringify({ audio: base64Chunk }));
        } catch {}
      };

      sourceNode.connect(processor);
      processor.connect(inCtx.destination);
    } catch (err: any) {
      console.warn('[Live Voice] Initialization notice:', err?.message);
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission was denied. You can still use Speech & Chat companion mode by typing below.'
          : 'Could not connect streaming microphone. Speech & Chat companion mode is active.'
      );
      setConnectionStatus('companion');
    }
  }, [selectedVoice, stopAllModelAudio]);

  // Disconnect session and release audio tracks
  const endSession = useCallback(() => {
    stopAllModelAudio();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    if (wsRef.current) {
      try {
        wsRef.current.close(1000, 'Session ended by user');
      } catch {}
      wsRef.current = null;
    }

    if (processorNodeRef.current) {
      try {
        processorNodeRef.current.disconnect();
      } catch {}
      processorNodeRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch {}
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch {}
      outputAudioCtxRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setUserAudioLevel(0);
    setModelAudioLevel(0);
    setConnectionStatus('disconnected');
  }, [stopAllModelAudio]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  // Send typed text to Live API or Companion Mode
  const handleSendText = () => {
    if (!textInput.trim()) return;

    const userText = textInput.trim();

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: userText }));
      setTranscripts((prev) => [
        ...prev,
        {
          id: `tr-${Date.now()}`,
          sender: 'user',
          text: userText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTextInput('');
    } else {
      sendCompanionMessage(userText);
    }
  };

  // Quick suggestion prompt
  const handlePromptClick = (prompt: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: prompt }));
      setTranscripts((prev) => [
        ...prev,
        {
          id: `tr-${Date.now()}`,
          sender: 'user',
          text: prompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      sendCompanionMessage(prompt);
    }
  };

  // Inject active novel/grammar context into conversation
  const handleInjectContext = () => {
    let contextSummary = '';
    if (activeContextText) {
      contextSummary = `Current scene context: "${activeContextText.slice(0, 500)}..."`;
    } else if (project) {
      contextSummary = `Current project: "${project.title || 'Untitled Novel'}" by ${project.authorName || 'Author'}. Genre: ${project.genre || 'Literature'}. Chapters: ${project.chapters.length}.`;
    }

    if (!contextSummary) return;

    const prompt = `Here is my current creative workspace context: ${contextSummary}. Please keep this in mind as we converse.`;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: prompt }));
      setTranscripts((prev) => [
        ...prev,
        {
          id: `tr-${Date.now()}`,
          sender: 'user',
          text: `[Context Shared]: ${contextSummary}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      sendCompanionMessage(prompt);
    }
  };

  const copyTranscript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="modal-live-voice"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        className={`w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-200 ${
          isMinimized ? 'h-auto' : 'max-h-[90vh]'
        }`}
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
              <Radio
                className={`w-5 h-5 ${
                  connectionStatus === 'connected' ? 'animate-pulse text-emerald-400' : ''
                }`}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Live Voice Assistant
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {connectionStatus === 'connected' ? 'gemini-3.8-live' : 'Companion Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {connectionStatus === 'connected'
                  ? 'Low-latency bidirectional real-time audio conversation'
                  : 'Interactive voice dictation, speech synthesis & creative chat'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isMinimized ? 'Expand modal' : 'Minimize modal'}
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              id="btn-close-live-voice"
              onClick={() => {
                endSession();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Voice Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* STATUS & WAVE VISUALIZER BANNER */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center space-y-4">
              {/* Connection Pill */}
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    connectionStatus === 'connected'
                      ? 'bg-emerald-500 animate-ping'
                      : connectionStatus === 'connecting'
                      ? 'bg-amber-500 animate-pulse'
                      : connectionStatus === 'companion'
                      ? 'bg-blue-500'
                      : connectionStatus === 'error'
                      ? 'bg-rose-500'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {connectionStatus === 'connected'
                    ? isModelSpeaking
                      ? 'Gemini Speaking (24kHz)'
                      : isMicMuted
                      ? 'Microphone Muted'
                      : 'Listening (16kHz)...'
                    : connectionStatus === 'connecting'
                    ? 'Connecting to Live API...'
                    : connectionStatus === 'companion'
                    ? isModelSpeaking
                      ? 'Companion Speaking...'
                      : isDictating
                      ? 'Listening to Dictation...'
                      : 'Companion Ready (Voice & Chat)'
                    : connectionStatus === 'error'
                    ? 'Connection Notice'
                    : 'Session Inactive'}
                </span>
              </div>

              {/* Dynamic Soundwave Bars */}
              <div className="h-16 flex items-center justify-center space-x-1.5 w-full max-w-sm px-4">
                {Array.from({ length: 24 }).map((_, i) => {
                  let barHeight = 6;
                  if (connectionStatus === 'connected' || connectionStatus === 'companion') {
                    if (isModelSpeaking) {
                      const wave = Math.sin(i * 0.4 + Date.now() * 0.005) * 0.5 + 0.5;
                      barHeight = Math.max(6, (modelAudioLevel / 100) * 48 * wave + 8);
                    } else if (!isMicMuted && (userAudioLevel > 0 || isDictating)) {
                      const wave = Math.cos(i * 0.5) * 0.4 + 0.6;
                      barHeight = Math.max(6, (userAudioLevel / 100) * 44 * wave + 8);
                    }
                  }

                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        connectionStatus === 'connected' || connectionStatus === 'companion'
                          ? isModelSpeaking
                            ? 'bg-slate-800 dark:bg-white'
                            : 'bg-amber-500 dark:bg-amber-400'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>

              {/* Central Control Buttons */}
              <div className="flex items-center space-x-3">
                {connectionStatus !== 'connected' ? (
                  <>
                    <button
                      id="btn-connect-live-voice"
                      onClick={startSession}
                      disabled={connectionStatus === 'connecting'}
                      className="h-10 px-5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 flex items-center space-x-2 shadow-md transition-all disabled:opacity-50"
                      title="Connect real-time bidirectional streaming session"
                    >
                      <Zap className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                      <span>
                        {connectionStatus === 'connecting'
                          ? 'Connecting...'
                          : 'Start Live Stream'}
                      </span>
                    </button>

                    <button
                      id="btn-start-dictation"
                      onClick={toggleSpeechRecognition}
                      className={`h-10 px-4 rounded-xl font-bold text-xs flex items-center space-x-2 border transition-all ${
                        isDictating
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                      }`}
                      title="Dictate message using browser speech recognition"
                    >
                      <Mic className={`w-4 h-4 ${isDictating ? 'text-rose-500' : 'text-blue-500'}`} />
                      <span>{isDictating ? 'Listening...' : 'Dictate'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="btn-mute-live-mic"
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-colors ${
                        isMicMuted
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                      }`}
                      title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                    >
                      {isMicMuted ? <MicOff className="w-4 h-4 text-rose-500" /> : <Mic className="w-4 h-4 text-emerald-500" />}
                      <span>{isMicMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                    </button>

                    <button
                      id="btn-interrupt-live-model"
                      onClick={stopAllModelAudio}
                      disabled={!isModelSpeaking}
                      className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 transition-colors disabled:opacity-40"
                      title="Interrupt speech immediately"
                    >
                      <Square className="w-3.5 h-3.5 fill-current text-amber-500" />
                      <span>Interrupt</span>
                    </button>

                    <button
                      id="btn-end-live-voice"
                      onClick={endSession}
                      className="h-9 px-4 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center space-x-1.5 shadow-xs transition-colors"
                      title="End voice session"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>End Stream</span>
                    </button>
                  </>
                )}
              </div>

              {/* Informative Error / Quota Notice Banner */}
              {errorMessage && (
                <div className="w-full max-w-lg p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{errorMessage}</p>
                    {isQuotaIssue && (
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-normal">
                        Prepayment credits on the Gemini API account may need replenishment for real-time WebSockets.
                        In the meantime, you can ask any question below or click <strong>Dictate</strong> to speak!
                      </p>
                    )}
                    <div className="flex items-center space-x-3 pt-1">
                      <button
                        onClick={() => {
                          setConnectionStatus('companion');
                          setErrorMessage(null);
                        }}
                        className="font-bold underline hover:text-amber-950 dark:hover:text-white"
                      >
                        Dismiss Notice
                      </button>
                      <button
                        onClick={startSession}
                        className="font-bold underline hover:text-amber-950 dark:hover:text-white"
                      >
                        Retry WebSocket
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SETTINGS & QUICK PROMPTS BAR */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <span className="font-medium text-slate-500 dark:text-slate-400">Voice:</span>
                  <select
                    value={selectedVoice}
                    onChange={(e) => {
                      setSelectedVoice(e.target.value);
                      if (connectionStatus === 'connected') {
                        endSession();
                      }
                    }}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 outline-none font-semibold cursor-pointer text-xs"
                  >
                    {SUPPORTED_VOICES.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.name === 'Zephyr' ? 'Warm' : v.name === 'Kore' ? 'Calm' : v.name === 'Puck' ? 'Lively' : 'Deep'})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsTTSActive(!isTTSActive)}
                  className={`px-2 py-1 rounded-lg border flex items-center space-x-1 font-medium text-xs transition-colors ${
                    isTTSActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                  title={isTTSActive ? 'Text-to-speech audio enabled' : 'Mute text-to-speech audio'}
                >
                  {isTTSActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isTTSActive ? 'Speech Out: On' : 'Speech Out: Muted'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleInjectContext}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 flex items-center space-x-1 transition-colors"
                  title="Share current chapter or scene details with the voice assistant"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Share Project Context</span>
                </button>
              </div>
            </div>

            {/* CONVERSATION TRANSCRIPT LOG */}
            <div className="flex-1 min-h-[160px] max-h-[300px] overflow-y-auto p-4 space-y-3 font-sans">
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500 space-y-3">
                  <Headphones className="w-8 h-8 opacity-60" />
                  <div>
                    <p className="text-xs font-semibold">Ready for creative conversation</p>
                    <p className="text-[11px] max-w-sm mt-1">
                      Type below, click <strong>Dictate</strong> to speak, or click <strong>Start Live Stream</strong> for low-latency streaming audio.
                    </p>
                  </div>

                  {/* Quick Starters */}
                  <div className="pt-2 flex flex-wrap gap-1.5 justify-center max-w-md">
                    <button
                      onClick={() => handlePromptClick('Help me brainstorm sensory anchors for a nighttime storm scene.')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      "Brainstorm storm sensory anchors"
                    </button>
                    <button
                      onClick={() => handlePromptClick('Critique this idea: an antagonist whose flaw is extreme loyalty.')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      "Critique loyal antagonist flaw"
                    </button>
                    <button
                      onClick={() => handlePromptClick('Explain the difference between simple, compound, and complex sentences with clear examples.')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      "Explain sentence structures"
                    </button>
                  </div>
                </div>
              ) : (
                transcripts.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex flex-col ${
                      entry.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-1 px-1">
                      <span className="font-bold">
                        {entry.sender === 'user' ? 'You' : 'Gemini Voice Mentor'}
                      </span>
                      <span>&bull;</span>
                      <span>{entry.timestamp}</span>
                      <button
                        onClick={() => copyTranscript(entry.text, entry.id)}
                        className="ml-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === entry.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                        entry.sender === 'user'
                          ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white rounded-br-xs'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-bl-xs'
                      }`}
                    >
                      {entry.text}
                    </div>
                  </div>
                ))
              )}
              {isGeneratingReply && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 italic px-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Gemini is composing response...</span>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* TEXT & VOICE INPUT FOOTER */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendText();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type a creative question or prompt, or click Dictate..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                />

                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`h-9 px-3 rounded-xl border flex items-center space-x-1 text-xs font-semibold transition-colors ${
                    isDictating
                      ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                  title={isDictating ? 'Stop speech dictation' : 'Start speech dictation'}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isDictating ? 'Listening' : 'Dictate'}</span>
                </button>

                <button
                  type="submit"
                  disabled={!textInput.trim() || isGeneratingReply}
                  className="h-9 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 flex items-center space-x-1.5 transition-colors disabled:opacity-40"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
