import AddQuest from "./quest/AddQuest.jsx";
import QuestList from "./quest/QuestList.jsx";
import { useQuests } from "./quest/UseQuest.jsx";
import "./App.css";

function App() {
  const { quests, addQuest, editQuest, concludeQuest } = useQuests();

  return (
    <div className="screen-container">
      <div className="card-container">
        <h1 className="card-title">Quest To Do</h1>
        <AddQuest saveAddQuest={addQuest} />
        <QuestList
          quests={quests}
          onEdit={editQuest}
          onConclude={concludeQuest}
        />
      </div>
    </div>
  );
}

export default App;