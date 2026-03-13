"use client";

import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface UseAIOptions {
  model?: string;
  systemPrompt?: string;
}

export function useAI(options: UseAIOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setLoading(true);
    setError(null);

    const userMessage: Message = { role: "user", content, timestamp: Date.now() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          model: options.model,
          systemPrompt: options.systemPrompt,
        }),
      });

      if (!res.ok) throw new Error("Failed to get AI response");
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

      const assistantMessage: Message = { role: "assistant", content: reply, timestamp: Date.now() };
      setMessages([...updatedMessages, assistantMessage]);
      return reply;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [messages, options.model, options.systemPrompt]);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, reset };
}
