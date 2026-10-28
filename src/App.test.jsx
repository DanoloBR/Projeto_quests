import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import App from "./App.jsx";

describe("App", () => {
  test("adiciona, conclui e exclui uma quest concluída", async () => {
    const user = userEvent.setup();
    render(<App />);

    // adicionar
    await user.type(screen.getByPlaceholderText("quest escolhida"), "Comprar pão");
    await user.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("Comprar pão")).toBeVisible();

    // concluir
    await user.click(
      screen.getByRole("checkbox", { name: 'Concluir "Comprar pão"' })
    );
    expect(screen.getByLabelText("Concluída")).toBeVisible();
    expect(screen.getByText("Nenhuma quest em andamento.")).toBeVisible();

    // excluir a concluída
    await user.click(screen.getByRole("button", { name: "Excluir" }));
    expect(screen.queryByText("Comprar pão")).toBeNull();
    expect(screen.getByText("Nada concluído ainda.")).toBeVisible();
  });

  test("não adiciona quest com título vazio", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "+" }));

    expect(screen.getByText("Nenhuma quest em andamento.")).toBeVisible();
  });

  test("a quest continua depois de recarregar (localStorage)", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.type(screen.getByPlaceholderText("quest escolhida"), "Persistir");
    await user.click(screen.getByRole("button", { name: "+" }));
    unmount();

    render(<App />);

    expect(screen.getByText("Persistir")).toBeVisible();
  });
});