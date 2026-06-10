import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type ProgressContextType = {
  completedTopics: Set<string>;
  toggleProgress: (topicId: string) => void;
  isCompleted: (topicId: string) => boolean;
  lastRead: { topicId: string; sectionId: string; sectionTitle?: string } | null;
  setLastRead: (topicId: string, sectionId: string, sectionTitle?: string) => void;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [lastRead, setLastReadState] = useState<{ topicId: string; sectionId: string; sectionTitle?: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hb-completed-topics");
      if (saved) {
        setCompletedTopics(new Set(JSON.parse(saved)));
      }
      const savedLastRead = localStorage.getItem("hb-last-read");
      if (savedLastRead) {
        setLastReadState(JSON.parse(savedLastRead));
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const setLastRead = useCallback((topicId: string, sectionId: string, sectionTitle?: string) => {
    const newVal = { topicId, sectionId, sectionTitle };
    setLastReadState(newVal);
    try {
      localStorage.setItem("hb-last-read", JSON.stringify(newVal));
    } catch (e) {
      console.error("Failed to save lastRead to localStorage", e);
    }
  }, []);

  const toggleProgress = useCallback((topicId: string) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      
      try {
        localStorage.setItem("hb-completed-topics", JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error("Failed to save progress to localStorage", e);
      }
      return next;
    });
  }, []);

  const isCompleted = (topicId: string) => completedTopics.has(topicId);

  // Prevent hydration mismatch by rendering with hidden visibility until loaded
  const content = isLoaded ? children : <div style={{ visibility: "hidden", display: "contents" }}>{children}</div>;

  return (
    <ProgressContext.Provider value={{ completedTopics, toggleProgress, isCompleted, lastRead, setLastRead }}>
      {content}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
