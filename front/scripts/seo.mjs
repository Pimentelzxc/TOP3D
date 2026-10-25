import { readFile, writeFile } from "node:fs/promises";
import { loadEnv } from "vite";
const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
const raw = env.VITE_SITE_URL?.trim();
let html = await readFile("dist/index.html", "utf8");
if (raw) {
  const url = new URL(raw);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "VITE_SITE_URL deve ser a origem pública, como https://seu-dominio.com.br",
    );
  const origin = url.origin;
  const escape = (s) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;");
  html = html
    .replace(
      "</head>",
      `<link rel="canonical" href="${escape(origin)}/" /><meta property="og:url" content="${escape(origin)}/" /><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "TOP3D", url: origin, sameAs: ["https://www.instagram.com/top3dd/"] }).replaceAll("<", "\\u003c")}</script></head>`,
    )
    .replaceAll(
      'content="/images/hero-spools-gold.webp"',
      `content="${escape(origin)}/images/hero-spools-gold.webp"`,
    );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(origin)}/</loc></url></urlset>`,
  );
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`,
  );
} else {
  console.info(
    "SEO: configure VITE_SITE_URL para gerar canonical, sitemap e dados estruturados com o domínio real. Prévia sem domínio permanece noindex.",
  );
  html = html.replace(
    "</head>",
    '<meta name="robots" content="noindex, follow" /></head>',
  );
  await writeFile("dist/robots.txt", "User-agent: *\nDisallow: /\n");
}
await writeFile("dist/index.html", html);
