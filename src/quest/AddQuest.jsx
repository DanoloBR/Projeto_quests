// AddQuest.jsx
import { useState } from "react";

function AddQuest({ saveAddQuest }) {
  const [questTitle, setQuestTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (questTitle.trim() === "") return;

    saveAddQuest(questTitle.trim());
    setQuestTitle("");
  };

  return (
    <form className="add-quest-container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="quest escolhida"
        className="quest-input"
        value={questTitle}
        onChange={(e) => setQuestTitle(e.target.value)}
      />
      <button type="submit" className="quest-button">
        +
      </button>
    </form>
  );
}

export default AddQuest;