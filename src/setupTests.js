import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// localStorage simples em memória: funciona igual em qualquer versão do Node
function createMemoryStorage() {
  let data = {};
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
    clear: () => {
      data = {};
    },
  };
}

vi.stubGlobal("localStorage", createMemoryStorage());

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});