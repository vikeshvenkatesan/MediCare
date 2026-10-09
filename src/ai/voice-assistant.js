// ============================================
// Medicare – Voice Assistant
// Web Speech API integration
// ============================================

import { getLanguage } from '../i18n/index.js';

const LANG_CODES = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    ml: 'ml-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    bn: 'bn-IN',
    mr: 'mr-IN'
};

let recognition = null;
let isListening = false;

// Check if speech recognition is available
export function isSpeechSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

// Check if speech synthesis is available
export function isSpeechSynthesisSupported() {
    return 'speechSynthesis' in window;
}

// Start listening
export function startListening(onResult, onError, onStart, onEnd) {
    if (!isSpeechSupported()) {
        onError?.('Speech recognition is not supported in this browser.');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    const lang = getLanguage();
    recognition.lang = LANG_CODES[lang] || 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isListening = true;
        onStart?.();
    };

    recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
            if (event.results[i].isFinal) isFinal = true;
        }
        onResult?.(transcript, isFinal);
    };

    recognition.onerror = (event) => {
        isListening = false;
        if (event.error !== 'aborted') {
            onError?.(event.error);
        }
    };

    recognition.onend = () => {
        isListening = false;
        onEnd?.();
    };

    try {
        recognition.start();
    } catch (e) {
        onError?.(e.message);
    }
}

// Stop listening
export function stopListening() {
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
    }
}

// Check if currently listening
export function getIsListening() {
    return isListening;
}

// Text to speech
export function speak(text, onEnd) {
    if (!isSpeechSynthesisSupported()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = getLanguage();
    utterance.lang = LANG_CODES[lang] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
}

// Stop speaking
export function stopSpeaking() {
    if (isSpeechSynthesisSupported()) {
        window.speechSynthesis.cancel();
    }
}
