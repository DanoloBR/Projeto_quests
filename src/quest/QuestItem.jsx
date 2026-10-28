import { useState } from "react";
import { STATUS } from "./UseQuest.jsx";

export default function QuestItem({ quest, onEdit, onConclude, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(quest.title);

  const done = quest.status === STATUS.DONE;

  function startEdit() {
    setDraft(quest.title);
    setEditing(true);
  }

  function saveEdit() {
    onEdit(quest.id, draft);
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setEditing(false);
  }

  return (
    <li className={`quest-item ${done ? "quest-item--done" : ""}`}>
      {!done && (
        <input
          type="checkbox"
          className="quest-check"
          checked={false}
          onChange={() => onConclude(quest.id)}
          aria-label={`Concluir "${quest.title}"`}
        />
      )}

      {editing ? (
        <input
          type="text"
          className="quest-edit-input"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="quest-title">{quest.title}</span>
      )}

      {!done && (
        <button
          type="button"
          className="quest-action"
          onClick={editing ? saveEdit : startEdit}
        >
          {editing ? "Salvar" : "Editar"}
        </button>
      )}

      {done && (
        <span className="quest-done-badge" aria-label="Concluída">
          ✓
        </span>
      )}

      {!done && (
        <>
          <button
            type="button"
            className="quest-action"
            onClick={editing ? saveEdit : startEdit}
          >
            {editing ? "Salvar" : "Editar"}
          </button>
          <button
            type="button"
            className="quest-action quest-action--danger"
            onClick={() => onDelete(quest.id)}
          >
            Excluir
          </button>
        </>
      )}
    </li>
  );
}