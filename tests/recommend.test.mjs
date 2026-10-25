import test from "node:test";
import assert from "node:assert/strict";
import { recommend } from "../src/lib/recommend.mjs";
test("flexibilidade recebe prioridade sobre resistência", () =>
  assert.equal(
    recommend({ flexible: "Sim", resistant: "Sim", outdoor: "Não" }).material,
    "TPU",
  ));
test("uso externo não recebe promessa genérica de adequação", () =>
  assert.equal(
    recommend({ flexible: "Não", resistant: "Sim", outdoor: "Sim" }).material,
    "Avaliação técnica",
  ));
test("requisito mecânico sugere PETG", () =>
  assert.equal(
    recommend({ flexible: "Não", resistant: "Sim", outdoor: "Não" }).material,
    "PETG",
  ));
test("iniciante sem requisitos especiais começa por PLA", () =>
  assert.equal(
    recommend({
      flexible: "Não",
      resistant: "Não",
      outdoor: "Não",
      experience: "Iniciante",
    }).material,
    "PLA",
  ));
