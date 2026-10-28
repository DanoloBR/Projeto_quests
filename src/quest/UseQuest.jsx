import { useEffect, useState } from "react";

export const STATUS = {
  OPEN: "aberto",
  DONE: "concluido",
};

function loadQuests() {
  try {
    const saved = localStorage.getItem("quests");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useQuests() {
  const [quests, setQuests] = useState(loadQuests);

  useEffect(() => {
    localStorage.setItem("quests", JSON.stringify(quests));
  }, [quests]);

  const addQuest = (title) => {
    const createdQuest = {
      id: crypto.randomUUID(),
      title,
      status: STATUS.OPEN,
      created_at: new Date().toISOString(),
    };
    setQuests((prev) => [...prev, createdQuest]);
  };

  const editQuest = (id, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, title: trimmed } : q))
    );
  };

  const concludeQuest = (id) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: STATUS.DONE } : q))
    );
  };

  const deleteQuest = (id) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  return { quests, addQuest, editQuest, concludeQuest, deleteQuest };
}