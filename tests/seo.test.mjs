import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
const script = resolve("scripts/seo.mjs");
async function buildSeo(url) {
  const cwd = await mkdtemp(join(tmpdir(), "top3d-seo-"));
  await mkdir(join(cwd, "dist"));
  await writeFile(
    join(cwd, "dist/index.html"),
    '<html><head><meta property="og:image" content="/images/hero-spools-gold.webp"></head><body></body></html>',
  );
  execFileSync(process.execPath, [script], {
    cwd,
    env: { ...process.env, VITE_SITE_URL: url },
  });
  return {
    html: await readFile(join(cwd, "dist/index.html"), "utf8"),
    read: (name) => readFile(join(cwd, "dist", name), "utf8"),
  };
}
test("domínio real habilita SEO e sitemap sem inventar dados comerciais", async () => {
  const result = await buildSeo("https://top3d.example");
  assert.match(result.html, /rel="canonical" href="https:\/\/top3d.example\/"/);
  assert.match(result.html, /application\/ld\+json/);
  assert.match(
    result.html,
    /content="https:\/\/top3d.example\/images\/hero-spools-gold.webp"/,
  );
  assert.doesNotMatch(result.html, /telephone|address|aggregateRating|noindex/);
  assert.match(
    await result.read("sitemap.xml"),
    /<loc>https:\/\/top3d.example\/<\/loc>/,
  );
  assert.match(await result.read("robots.txt"), /Allow: \//);
});
test("prévia sem domínio fica noindex e sem canonical fictício", async () => {
  const result = await buildSeo("");
  assert.match(result.html, /noindex, follow/);
  assert.doesNotMatch(result.html, /canonical|application\/ld\+json/);
  assert.match(await result.read("robots.txt"), /Disallow: \//);
});
