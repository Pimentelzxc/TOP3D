import test from "node:test";
import assert from "node:assert/strict";
import {
  contactUrl,
  contactMessages,
  normalizeWhatsApp,
  type ContactIntent,
} from "../src/data/company";

test("WhatsApp aceita número local e usa o código do Brasil uma única vez", () => {
  assert.equal(normalizeWhatsApp("(41) 99776-5420"), "5541997765420");
  assert.equal(normalizeWhatsApp("+55 (41) 99776-5420"), "5541997765420");
});
test("cada ação de atendimento abre o WhatsApp com uma mensagem própria", () => {
  const messages = Object.keys(contactMessages).map((intent) => {
    const url = new URL(contactUrl({ intent: intent as ContactIntent }));
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, "/5541997765420");
    assert.ok(url.searchParams.get("text")?.startsWith("Olá"));
    return url.searchParams.get("text");
  });
  assert.equal(new Set(messages).size, messages.length);
});
test("consulta por material inclui o material selecionado", () => {
  for (const material of ["PLA", "PETG", "ABS", "TPU"]) {
    const message = new URL(
      contactUrl({ intent: "material", material }),
    ).searchParams.get("text")!;
    assert.ok(message.includes(`Tenho interesse em ${material}.`));
  }
});
