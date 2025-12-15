import React, { FC, useState, useEffect } from "react";
import { Box, Text, Icon } from "zmp-ui";

interface VoiceInputProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  language?: string;
}

// Browser Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

export const VoiceInput: FC<VoiceInputProps> = ({
  onResult,
  onError,
  placeholder = "Nhấn để nói...",
  language = "vi-VN",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Speech Recognition API is supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          onResult(finalTranscript);
          setIsListening(false);
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (onError) {
          const errorMessages: Record<string, string> = {
            "no-speech": "Không nghe thấy giọng nói. Vui lòng thử lại.",
            "audio-capture": "Không thể truy cập microphone.",
            "not-allowed": "Vui lòng cấp quyền truy cập microphone.",
            "network": "Lỗi kết nối mạng.",
            "aborted": "Đã hủy ghi âm.",
          };
          onError(errorMessages[event.error] || "Lỗi nhận dạng giọng nói.");
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
    }
  }, [onResult, onError]);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript("");
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        if (onError) {
          onError("Không thể bắt đầu ghi âm. Vui lòng thử lại.");
        }
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Box className="p-4 rounded-2xl bg-gray-100 text-center">
        <Icon icon="zi-warning" className="text-gray-400 mb-2" size={24} />
        <Text size="xSmall" className="text-gray-600">
          Trình duyệt không hỗ trợ nhận dạng giọng nói
        </Text>
      </Box>
    );
  }

  return (
    <Box className="space-y-2">
      <Box
        onClick={toggleListening}
        className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform active:scale-98 ${
          isListening
            ? "shadow-floating animate-pulse"
            : "shadow-card hover:shadow-lg"
        }`}
        style={{
          background: isListening
            ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
            : "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)",
        }}
      >
        <Box className="flex items-center justify-center space-x-3">
          <Box
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isListening ? "bg-white/30" : "bg-white/20"
            }`}
          >
            <Icon
              icon={isListening ? "zi-stop-circle" : "zi-microphone"}
              className="text-white"
              size={28}
            />
          </Box>
          <Box>
            <Text className="text-white font-bold text-base">
              {isListening ? "Đang nghe..." : placeholder}
            </Text>
            {isListening && (
              <Text size="xSmall" className="text-white/80 font-medium">
                Nhấn để dừng
              </Text>
            )}
          </Box>
        </Box>
      </Box>

      {transcript && (
        <Box
          className="p-4 rounded-2xl animate-fade-in"
          style={{
            background: "linear-gradient(135deg, #FEFCE8 0%, #FEF9C3 100%)",
          }}
        >
          <Box className="flex items-start space-x-2">
            <Icon icon="zi-check-circle" className="text-yellow-600 mt-0.5" size={18} />
            <Box className="flex-1">
              <Text size="xSmall" className="text-yellow-900 font-semibold mb-1">
                Văn bản nhận dạng:
              </Text>
              <Text className="text-gray-900 font-medium">{transcript}</Text>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
