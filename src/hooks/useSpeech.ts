"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = {
  error?: string;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type UseSpeechCallbacks = {
  onFinal?: (text: string) => void;
  onInterim?: (text: string) => void;
};

function getRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return (ctor as SpeechRecognitionConstructor | undefined) ?? null;
}

function pickEnInVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  return (
    voices.find((v) => v.lang === "en-IN") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en-in")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    null
  );
}

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isRecognitionSupported] = useState(
    () => getRecognitionCtor() !== null
  );
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const callbacksRef = useRef<UseSpeechCallbacks>({});
  const lastFinalRef = useRef("");

  // Warm up voices so the first speak() can pick an en-IN voice.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        onVoicesChanged
      );
    };
  }, []);

  // Stop recognition and speech on unmount.
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // already stopped
      }
      recognitionRef.current = null;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = useCallback(
    (callbacks?: UseSpeechCallbacks) => {
      if (!isRecognitionSupported) return;
      if (callbacks) callbacksRef.current = callbacks;

      const Ctor = getRecognitionCtor();
      if (!Ctor) return;

      // If already listening, restart cleanly.
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }

      lastFinalRef.current = "";
      const recognition = new Ctor();
      recognition.lang = "en-IN";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (!result) continue;
          const transcript = result[0]?.transcript ?? "";
          if (result.isFinal) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }
        // results are cumulative within a session, so walk from the start
        // for the running totals when resultIndex > 0 was the only delta.
        if (event.resultIndex > 0) {
          finalText = "";
          interimText = "";
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (!result) continue;
            const transcript = result[0]?.transcript ?? "";
            if (result.isFinal) {
              finalText += transcript;
            } else {
              interimText += transcript;
            }
          }
        }

        const delta = finalText.slice(lastFinalRef.current.length);
        if (delta) {
          lastFinalRef.current = finalText;
          callbacksRef.current.onFinal?.(delta);
        }
        callbacksRef.current.onInterim?.(interimText);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        setIsListening(false);
        callbacksRef.current.onInterim?.("");
      };

      recognition.onerror = () => {
        recognitionRef.current = null;
        setIsListening(false);
        callbacksRef.current.onInterim?.("");
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        recognitionRef.current = null;
        setIsListening(false);
      }
    },
    [isRecognitionSupported]
  );

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // already stopped
    }
    recognitionRef.current = null;
    setIsListening(false);
    callbacksRef.current.onInterim?.("");
  }, []);

  const speak = useCallback((text: string) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !text.trim()
    ) {
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickEnInVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
  }, []);

  const cancelSpeak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
  }, []);

  return {
    isListening,
    isRecognitionSupported,
    startListening,
    stopListening,
    speak,
    cancelSpeak,
  };
}
