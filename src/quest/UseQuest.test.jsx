import { renderHook, act } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useQuests, STATUS } from "./UseQuest.jsx";

describe("useQuests", () => {
  test("começa vazio quando não há nada salvo", () => {
    const { result } = renderHook(() => useQuests());

    expect(result.current.quests).toEqual([]);
  });

  test("não quebra se o localStorage estiver corrompido", () => {
    localStorage.setItem("quests", "isso não é json");

    const { result } = renderHook(() => useQuests());

    expect(result.current.quests).toEqual([]);
  });

  test("adiciona quest aberta", () => {
    const { result } = renderHook(() => useQuests());

    act(() => result.current.addQuest("A"));

    expect(result.current.quests).toHaveLength(1);
    expect(result.current.quests[0]).toMatchObject({
      title: "A",
      status: STATUS.OPEN,
    });
  });

  test("ids são únicos mesmo criando quests no mesmo instante", () => {
    const { result } = renderHook(() => useQuests());

    act(() => {
      result.current.addQuest("A");
      result.current.addQuest("B");
    });

    const [a, b] = result.current.quests;
    expect(a.id).not.toBe(b.id);
  });

  test("edita o título só da quest escolhida", () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest("A");
      result.current.addQuest("B");
    });

    act(() => result.current.editQuest(result.current.quests[0].id, "  A2  "));

    expect(result.current.quests.map((q) => q.title)).toEqual(["A2", "B"]);
  });

  test("ignora edição com título vazio", () => {
    const { result } = renderHook(() => useQuests());
    act(() => result.current.addQuest("A"));

    act(() => result.current.editQuest(result.current.quests[0].id, "   "));

    expect(result.current.quests[0].title).toBe("A");
  });

  test("conclui só a quest escolhida", () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest("A");
      result.current.addQuest("B");
    });

    act(() => result.current.concludeQuest(result.current.quests[0].id));

    expect(result.current.quests.map((q) => q.status)).toEqual([
      STATUS.DONE,
      STATUS.OPEN,
    ]);
  });

  test("exclui apenas a quest escolhida", () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest("A");
      result.current.addQuest("B");
    });

    act(() => result.current.deleteQuest(result.current.quests[0].id));

    expect(result.current.quests).toHaveLength(1);
    expect(result.current.quests[0].title).toBe("B");
  });

  test("exclui também uma quest concluída", () => {
    const { result } = renderHook(() => useQuests());
    act(() => result.current.addQuest("A"));
    const id = result.current.quests[0].id;

    act(() => result.current.concludeQuest(id));
    act(() => result.current.deleteQuest(id));

    expect(result.current.quests).toEqual([]);
  });

  test("grava as mudanças no localStorage", () => {
    const { result } = renderHook(() => useQuests());

    act(() => result.current.addQuest("A"));
    expect(JSON.parse(localStorage.getItem("quests"))).toHaveLength(1);

    act(() => result.current.deleteQuest(result.current.quests[0].id));
    expect(JSON.parse(localStorage.getItem("quests"))).toEqual([]);
  });
});