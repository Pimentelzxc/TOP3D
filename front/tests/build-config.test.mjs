import test from "node:test";
import assert from "node:assert/strict";
import { loadConfigFromFile } from "vite";
test("o build bloqueia chaves privadas do Supabase antes de gerar o frontend", async () => {
  const previous = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  try {
    for (const key of [
      "sb_secret_TEST_ONLY_NOT_A_REAL_KEY",
      `eyJhbGciOiJub25lIn0.${Buffer.from(JSON.stringify({ role: "service_role" })).toString("base64url")}.test`,
    ]) {
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY = key;
      await assert.rejects(
        () => loadConfigFromFile({ command: "build", mode: "test" }),
        /Use somente a chave publicável/,
      );
    }
  } finally {
    if (previous === undefined)
      delete process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    else process.env.VITE_SUPABASE_PUBLISHABLE_KEY = previous;
  }
});
