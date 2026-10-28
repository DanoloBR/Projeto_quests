import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import QuestItem from "./QuestItem.jsx";
import { STATUS } from "./UseQuest.jsx";

const openQuest = {
  id: "1",
  title: "Falar com o ferreiro",
  status: STATUS.OPEN,
  created_at: "2026-01-01T10:00:00.000Z",
};

const doneQuest = {
  id: "2",
  title: "Falar com o cavaleiro",
  status: STATUS.DONE,
  created_at: "2026-01-01T10:00:00.000Z",
};

const noop = () => {};

function setup(quest, props = {}) {
  const handlers = {
    onEdit: vi.fn(),
    onConclude: vi.fn(),
    onDelete: vi.fn(),
    ...props,
  };
  const user = userEvent.setup();
  render(
    <ul>
      <QuestItem quest={quest} {...handlers} />
    </ul>
  );
  return { user, ...handlers };
}

describe("QuestItem aberta", () => {
  test("mostra o título, Editar e Excluir", () => {
    setup(openQuest);

    expect(screen.getByText("Falar com o ferreiro")).toBeVisible();
    expect(screen.getByRole("button", { name: "Editar" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Excluir" })).toBeVisible();
  });

  test("Editar abre o input com o título atual", async () => {
    const { user } = setup(openQuest);

    await user.click(screen.getByRole("button", { name: "Editar" }));

    expect(screen.getByRole("textbox")).toHaveValue("Falar com o ferreiro");
    expect(screen.getByRole("button", { name: "Salvar" })).toBeVisible();
  });

  test("Salvar chama onEdit com id e novo título", async () => {
    const { user, onEdit } = setup(openQuest);

    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Falar com o rei");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onEdit).toHaveBeenCalledWith("1", "Falar com o rei");
  });

  test("Escape cancela a edição sem chamar onEdit", async () => {
    const { user, onEdit } = setup(openQuest);

    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.type(screen.getByRole("textbox"), "{Escape}");

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText("Falar com o ferreiro")).toBeVisible();
  });

  test("marcar o checkbox chama onConclude com o id", async () => {
    const { user, onConclude } = setup(openQuest);

    await user.click(screen.getByRole("checkbox"));

    expect(onConclude).toHaveBeenCalledWith("1");
  });

  test("Excluir chama onDelete com o id", async () => {
    const { user, onDelete } = setup(openQuest);

    await user.click(screen.getByRole("button", { name: "Excluir" }));

    expect(onDelete).toHaveBeenCalledWith("1");
  });
});

describe("QuestItem concluída", () => {
  test("mostra o selo e não permite editar nem concluir de novo", () => {
    setup(doneQuest);

    expect(screen.getByText("Falar com o cavaleiro")).toBeVisible();
    expect(screen.getByLabelText("Concluída")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Editar" })).toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  test("permite excluir e chama onDelete com o id", async () => {
    const { user, onDelete } = setup(doneQuest);

    await user.click(screen.getByRole("button", { name: "Excluir" }));

    expect(onDelete).toHaveBeenCalledWith("2");
  });
});