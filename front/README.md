# Frontend TOP3D

SPA em React 19, TypeScript, Vite, Tailwind CSS, Motion e Lucide React.

Execute na raiz do repositório:

```sh
npm install
npm run dev
```

Os comandos da raiz encaminham para este workspace. Também é possível executar `npm run dev`, `npm run build`, `npm run preview`, `npm run lint` e `npm test` diretamente nesta pasta após a instalação na raiz.

- Configuração pública: copie `.env.example` para `.env.local` **nesta pasta**.
- Conteúdo e contatos: `src/data/`.
- Painel: `/admin`, com conta autorizada no Supabase. Ativação em [back/README.md](../back/README.md).
- Catálogo persistente: `src/lib/catalog.ts`; sessão e leitura pública em `src/hooks/`.
- Assets: `public/`.
- Saída de produção: `dist/` (equivalente a `front/dist/` a partir da raiz).
- Vercel com **Root Directory = `front`**: `vercel.json` desta pasta define `npm run build`, saída `dist` e fallback SPA. Não use `front/dist` no painel quando a raiz já for `front`.
- Instruções completas e deploy: [README principal](../README.md).
