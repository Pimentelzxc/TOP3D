# TOP3D

Landing page SPA em **React 19 + TypeScript + Vite + Tailwind CSS 4 + Motion for React + Lucide React**. Catálogo online e painel administrativo com **Supabase (Postgres, Auth e Storage)**. React Router organiza o site, `/admin` e `/admin/recuperar`.

O projeto está separado em `front/` (aplicação React) e `back/` (migrações, autorização e configuração do backend Supabase). A raiz usa npm workspaces e mantém um único `package-lock.json`. Execute os comandos abaixo na raiz; eles encaminham automaticamente para o frontend.

## Executar

Requer Node.js 22.12+ (desenvolvido com Node 24) e npm.

```sh
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. Para produção:

```sh
npm run build
npm run preview
```

Validação: `npm run lint` e `npm test`. O build também executa a checagem estrita de TypeScript.

## Funcionalidades

- Cabeçalho fixo, seção ativa, navegação mobile, progresso de leitura e voltar ao topo.
- Hero com render conceitual e resposta leve ao cursor; respeito a movimento reduzido.
- Cards educativos, comparativo com abas e assistente de cinco perguntas.
- Catálogo com pesquisa, filtros de material/marca/cor, ordenação, carrossel com swipe, modal e compartilhamento nativo ou clipboard.
- Seção **Marcas** com abas para Multfila, 3D Brothers, Voolt3D, 3D Prime e ELEGOO, fotos/logos locais, informações verificadas, consultas por marca e filtro direto no catálogo.
- Painel **`/admin`** com login por e-mail/senha, recuperação de acesso, pesquisa, contadores reais, cadastro/edição/exclusão e publicação de produtos.
- Upload de fotos, prévia do cadastro, rascunhos, preço/estoque opcionais e persistência online. A autorização é aplicada no banco via Row Level Security.
- Galeria em bento com lightbox preservada em `Gallery.tsx`, temporariamente fora da página e da navegação a pedido do responsável.
- Seções institucional, aplicações, contato, FAQ e depoimentos condicionais.
- Modais com foco contido, Escape, retorno de foco e bloqueio de rolagem.
- SEO, imagens locais e fonte variável local.

## Configurar os dados reais

Leia [RESEARCH.md](RESEARCH.md) antes da publicação comercial. Os contatos e produtos não verificados não foram inventados.

1. Copie `front/.env.example` para `front/.env.local` e preencha `VITE_SITE_URL` com o domínio público real. O WhatsApp **+55 (41) 99776-5420**, informado pelo responsável, já está configurado; `VITE_WHATSAPP_NUMBER` permite substituí-lo no deploy. Variáveis VITE são públicas; não inclua segredos.
2. Edite `front/src/data/company.ts`: endereço, e-mail, horários e URLs jurídicas aprovadas. A logo já usa a imagem pública do Instagram, salva localmente; pode ser substituída por um arquivo de maior resolução. Sem URLs aprovadas, links legais não aparecem.
3. Ative o backend conforme [back/README.md](back/README.md): execute as duas migrações, crie a conta administrativa e configure as variáveis públicas do Supabase na Vercel. Depois cadastre produtos em **`/admin`**. Somente produtos publicados aparecem no catálogo. `front/src/data/products.ts` permanece como fallback estático quando não há conexão configurada.
4. Cadastre avaliações reais e fontes em `front/src/data/testimonials.ts`. A seção fica oculta quando vazia.

Os CTAs de atendimento e o botão flutuante abrem o WhatsApp da loja com mensagens específicas para especialista, catálogo, opções, material, produto, FAQ, contato e rodapé. O assistente inclui o material sugerido e as cinco respostas na mensagem. O Instagram tem botão separado no navbar, além dos links institucionais. Nenhuma mensagem é enviada automaticamente.

A seção de materiais usa fotos reais de aplicações publicadas pela Prusa, armazenadas localmente em WebP, com créditos e links de origem. Esses exemplos são **educativos**, separados do catálogo comercial, e não representam produtos ou projetos da TOP3D. Consulte `ASSETS.md` para as fontes.

## Deploy na Vercel

1. Envie este projeto para seu repositório Git.
2. Importe o repositório em **Vercel → Add New → Project**.
3. Configure **Root Directory** como **`front`**. Selecione Vite; instalação `npm install`, build `npm run build`, saída **`dist`**. O `front/vercel.json` contém os comandos e as regras para esse modo de deploy.
4. Configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_WHATSAPP_NUMBER` e `VITE_SITE_URL`. A URL do Supabase e a chave publicável usadas localmente não são enviadas ao Git; precisam ser configuradas no painel da Vercel. `VITE_SITE_URL` deve ser a origem final, sem caminho, query ou fragmento. Não use chaves `service_role`/`sb_secret` no frontend.
5. Faça o deploy. Após mudar domínio ou variáveis, execute novo deploy.

`front/vercel.json` contém fallback SPA, cache para assets versionados e cabeçalhos básicos. O `vercel.json` da raiz também é mantido para quem optar por Root Directory vazio: nesse caso, a saída é `front/dist`. Não misture `front/dist` com Root Directory `front`, pois os caminhos de saída são relativos à raiz selecionada.

Se aparecer `STATIC_BUILD_NO_OUT_DIR`, confira Root Directory, Build Command e Output Directory juntos e faça um novo deploy do commit atualizado. Para Root Directory `front`, use `npm run build` e `dist`.

O build com domínio válido gera `front/dist/sitemap.xml`, `front/dist/robots.txt`, canonical, OG absoluto e Schema.org Organization. Sem domínio, a prévia recebe **noindex** e robots bloqueado para evitar indexação prematura; não se inventa uma URL de produção.

## Organização

```text
front/
  src/components/         Layout, seções e componentes de interface
  src/data/               Empresa, marcas, materiais, FAQ, avaliações
  src/pages/              LandingPage e AdminPage
  src/components/admin/   Login e editor de produtos
  src/hooks/              Sessão administrativa e catálogo online
  src/lib/                Lógica educativa de recomendação
  src/types/              Modelos TypeScript
  src/styles/             Tailwind e estilos responsivos
  scripts/seo.mjs         SEO gerado com domínio real
  tests/                  Interações, contatos, recomendações e SEO
  public/images/          Assets locais otimizados
  .env.example            Modelo de configuração pública
  package.json            Dependências e comandos do frontend
  vercel.json             Deploy quando Root Directory é front
back/
  migrations/             Tabelas, RLS, Storage e autorização da administradora
  README.md               Ativação e manutenção do backend Supabase
package.json              Workspaces e atalhos da raiz
package-lock.json         Lockfile único
vercel.json               Alternativa de deploy pela raiz do repositório
```

As metas Lighthouse do briefing precisam de medição no ambiente final; não são pontuações presumidas. Veja `VALIDATION.md` para os testes executados.
