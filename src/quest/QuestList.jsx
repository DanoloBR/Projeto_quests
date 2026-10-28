import QuestItem from "./QuestItem.jsx";
import { STATUS } from "./UseQuest.jsx";

function QuestColumn({ title, variant, quests, emptyText, onEdit, onConclude, onDelete }) {
  return (
    
    <section className={`quest-column quest-column--${variant}`}>
      <header className="quest-column__header">
        <h2>{title}</h2>
        <span className="quest-column__count">{quests.length}</span>
      </header>
      {quests.length === 0 ? (
        <p className="quest-column__empty">{emptyText}</p>
      ) : (
        <ul className="quest-list">
          {quests.map((quest) => (
            <QuestItem
              key={quest.id}
              quest={quest}
              onEdit={onEdit}
              onConclude={onConclude}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function QuestList({ quests, onEdit, onConclude, onDelete }) {
  const openQuests = quests.filter((q) => q.status === STATUS.OPEN);
  const doneQuests = quests.filter((q) => q.status === STATUS.DONE);

  return (
    <div className="quest-board">
      <QuestColumn
        title="Abertas"
        variant="open"
        quests={openQuests}
        emptyText="Nenhuma quest em andamento."
        onEdit={onEdit}
        onConclude={onConclude}
        onDelete={onDelete}
    />
      <QuestColumn
        onDelete={onDelete}
        title="Concluídas"
        variant="done"
        quests={doneQuests}
        emptyText="Nada concluído ainda."
        onEdit={onEdit}
        onConclude={onConclude}
      />
    </div>
  );
}

export default QuestList;