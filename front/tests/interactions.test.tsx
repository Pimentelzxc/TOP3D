import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import React, { act } from "react";
import { products } from "../src/data/products";

const browser = new Window({ url: "http://localhost:5173" });
// DOM tests validate state and accessibility; layout and native animations require browser QA.
Object.defineProperty(browser.Element.prototype, "animate", {
  value: undefined,
  configurable: true,
});
Object.assign(globalThis, {
  window: browser,
  document: browser.document,
  HTMLElement: browser.HTMLElement,
  HTMLDialogElement: browser.HTMLDialogElement,
  Element: browser.Element,
  Node: browser.Node,
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", {
  value: browser.navigator,
  configurable: true,
});
Object.assign(globalThis, {
  IntersectionObserver: browser.IntersectionObserver,
  SVGElement: browser.SVGElement,
  getComputedStyle: browser.getComputedStyle.bind(browser),
  requestAnimationFrame: browser.requestAnimationFrame.bind(browser),
  cancelAnimationFrame: browser.cancelAnimationFrame.bind(browser),
});
browser.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
browser.HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
const { default: Catalog } = await import("../src/components/sections/Catalog");
const { default: MaterialGuide } = await import(
  "../src/components/sections/MaterialGuide"
);
const { default: FAQ } = await import("../src/components/sections/FAQ");
const { default: Brands } = await import("../src/components/sections/Brands");
const { default: AdminLogin } = await import(
  "../src/components/admin/AdminLogin"
);
const { MemoryRouter } = await import("react-router-dom");
const { createRoot } = await import("react-dom/client");

async function render(component: React.ReactNode) {
  const node = document.createElement("div");
  document.body.append(node);
  const root = createRoot(node);
  await act(async () => root.render(component));
  return {
    node,
    dispose: async () => {
      await act(async () => root.unmount());
      node.remove();
    },
  };
}
async function click(node: ParentNode, text: string) {
  const button = [...node.querySelectorAll("button")].find((b) =>
    b.textContent?.includes(text),
  );
  assert.ok(button, `Botão encontrado: ${text}`);
  await act(async () => button.click());
}

test("catálogo oculta produtos sem verificação e filtra produtos confirmados", async () => {
  const fixture = {
    id: "qa-1",
    name: "Produto de teste",
    category: "PLA",
    brand: "Marca teste",
    color: "Azul",
    description: "Fixture somente para validação",
    image: "/test.webp",
    verified: true,
    sourceUrl: "https://example.com/test",
  };
  products.push(
    fixture,
    { ...fixture, id: "qa-2", name: "Produto não verificado", verified: false },
    { ...fixture, id: "qa-3", name: "Outro produto", brand: "Outra marca" },
  );
  const view = await render(<Catalog />);
  assert.match(view.node.textContent || "", /Produto de teste/);
  assert.doesNotMatch(view.node.textContent || "", /Produto não verificado/);
  const filter = view.node.querySelector<HTMLButtonElement>(
    '[aria-label="Filtros e ordenação"]',
  )!;
  await act(async () => filter.click());
  assert.ok(view.node.querySelector("#catalog-filters"));
  const brand = view.node.querySelector<HTMLSelectElement>("select")!;
  await act(async () => {
    brand.value = "Marca teste";
    brand.dispatchEvent(
      new browser.Event("change", { bubbles: true }) as unknown as Event,
    );
  });
  assert.doesNotMatch(view.node.textContent || "", /Outro produto/);
  await click(view.node, "Ver detalhes");
  assert.ok(view.node.querySelector("dialog[open]"));
  const productContact = view.node.querySelector<HTMLAnchorElement>(
    'dialog a[href^="https://wa.me/"]',
  )!;
  assert.ok(productContact);
  const productUrl = new URL(productContact.href);
  assert.equal(productUrl.pathname, "/5541997765420");
  assert.match(productUrl.searchParams.get("text")!, /Produto de teste/);
  await act(async () =>
    view.node
      .querySelector<HTMLButtonElement>('[aria-label="Fechar janela"]')!
      .click(),
  );
  assert.equal(view.node.querySelector("dialog"), null);
  await view.dispose();
  products.length = 0;
});

test("assistente percorre cinco perguntas e apresenta material com base nas respostas", async () => {
  const view = await render(
    <MaterialGuide active="pla" setActive={() => {}} />,
  );
  await click(view.node, "Descobrir meu material");
  assert.ok(view.node.querySelector("dialog[open]"));
  for (const [i, answer] of [
    "Peça funcional",
    "Sim",
    "Não",
    "Não",
    "Iniciante",
  ].entries()) {
    await click(view.node, answer);
    await click(view.node, i === 4 ? "Ver sugestão" : "Continuar");
  }
  assert.match(view.node.querySelector("dialog")!.textContent || "", /PETG/);
  assert.match(
    view.node.querySelector("dialog")!.textContent || "",
    /Peça funcional/,
  );
  const projectContact = view.node.querySelector<HTMLAnchorElement>(
    'dialog a[href^="https://wa.me/"]',
  )!;
  const message = new URL(projectContact.href).searchParams.get("text")!;
  assert.match(message, /PETG/);
  assert.match(message, /O que pretendo imprimir: Peça funcional/);
  assert.match(message, /Minha experiência: Iniciante/);
  await click(view.node, "Refazer assistente");
  assert.match(
    view.node.querySelector("dialog")!.textContent || "",
    /PERGUNTA 1 DE 5/,
  );
  await view.dispose();
});

test("FAQ abre e fecha respostas com estado acessível", async () => {
  const view = await render(<FAQ />);
  const button = view.node.querySelector<HTMLButtonElement>("#faq-button-1")!;
  assert.equal(button.getAttribute("aria-expanded"), "false");
  await act(async () => button.click());
  assert.equal(button.getAttribute("aria-expanded"), "true");
  assert.match(
    view.node.querySelector("#faq-1")!.textContent || "",
    /tenacidade/,
  );
  await act(async () => button.click());
  assert.equal(button.getAttribute("aria-expanded"), "false");
  await view.dispose();
});

test("as cinco marcas têm imagens e a aba encaminha a seleção ao catálogo", async () => {
  let selection = "";
  const view = await render(
    <Brands
      onCatalogBrand={(brand) => {
        selection = brand;
      }}
    />,
  );
  assert.equal(view.node.querySelectorAll('[role="tab"]').length, 5);
  for (const name of [
    "Multfila",
    "3D Brothers",
    "Voolt3D",
    "3D Prime",
    "ELEGOO",
  ])
    assert.ok(view.node.querySelector(`img[alt="${name}"]`));
  assert.ok(
    view.node.querySelector('img[src="/images/brands/multfila-photo.webp"]'),
  );
  await click(view.node, "Ver no catálogo");
  assert.equal(selection, "Multfila");
  const message = new URL(
    view.node.querySelector<HTMLAnchorElement>(
      'a[href^="https://wa.me/"]',
    )!.href,
  ).searchParams.get("text")!;
  assert.match(message, /Multfila/);
  const tab = view.node.querySelector<HTMLButtonElement>('[role="tab"]')!;
  await act(async () =>
    tab.dispatchEvent(
      new browser.KeyboardEvent("keydown", {
        key: "End",
        bubbles: true,
      }) as unknown as KeyboardEvent,
    ),
  );
  assert.equal(
    view.node.querySelector("#brand-tab-elegoo")!.getAttribute("aria-selected"),
    "true",
  );
  await view.dispose();
});

test("o painel sem configuração não simula autenticação nem oferece cadastro público", async () => {
  const view = await render(
    <MemoryRouter>
      <AdminLogin />
    </MemoryRouter>,
  );
  assert.match(view.node.textContent || "", /Painel aguardando configuração/);
  const submit = view.node.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  )!;
  assert.ok(submit.closest("fieldset")!.disabled);
  assert.equal(
    view.node
      .querySelector('input[autocomplete="username"]')
      ?.getAttribute("type"),
    "email",
  );
  await click(view.node, "Esqueci minha senha");
  assert.match(view.node.textContent || "", /Vamos recuperar seu acesso/);
  assert.doesNotMatch(view.node.textContent || "", /Criar conta/);
  await view.dispose();
});
