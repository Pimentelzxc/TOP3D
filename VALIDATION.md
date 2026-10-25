# Validação

## Catálogo administrável e marcas

- `npm test`: **26 testes aprovados**. `npm run lint` e `npm run build`: aprovados.
- Catálogo renomeado na navegação e nos CTAs, com compatibilidade para o antigo hash `#produtos`.
- Cinco abas de marcas, dez imagens locais em WebP (372.184 bytes no total), textos com fontes e filtro por marca integrado ao catálogo.
- Configuração pública local do Supabase validada por HTTP; tabela `top3d_catalog_products` ainda retornou **PGRST205/404** na última consulta. As migrações remotas e o login real dependem da execução dos scripts no SQL Editor e da criação da conta.
- Testes de PostgreSQL via PGlite executam as duas migrações e verificam RLS para administrador, visitante e usuário comum; rascunhos; Storage; validações de preço e URLs.
- Testes do formulário verificam publicação como rascunho por padrão, valores opcionais, preço brasileiro, rejeição de URLs inseguras e validação de arquivos. Testes de interface verificam abas, consulta por marca e login sem configuração.
- O build inclui guardas que rejeitam chaves secretas/service_role em variáveis públicas. Apenas URL e chave publicável foram salvas em `front/.env.local`, ignorado pelo Git. Nenhuma chave secreta foi usada para consultar ou alterar o projeto remoto.
- Painel e editor separados em chunks; dependências React, roteamento e Supabase também têm bundles próprios. `/admin` recebe noindex por metatag e cabeçalho da Vercel.
- Navegador/Computer Use permanece indisponível. Não houve validação visual do painel ou Lighthouse; os testes de DOM e banco não substituem essa inspeção nem o teste de login/upload no Supabase real.

Executada em 25 de outubro de 2026, no Windows com Node.js 24.15.0.

Após a separação em `front/` e `back/`, a instalação e os comandos `npm run build`, `npm run lint` e `npm test` foram executados novamente pela raiz com sucesso. Os 12 testes continuam aprovados. `npm run dev` iniciou o frontend pelo workspace; a página, a entrada React e a logo retornaram HTTP 200. A configuração da Vercel foi ajustada para publicar `front/dist`.

Correção para o projeto Vercel configurado com Root Directory `front`: adicionado `front/vercel.json` com build `npm run build`, saída `dist`, fallback SPA e cabeçalhos. O build foi executado também diretamente em `front/`, verificando `dist/index.html`. A configuração do painel e o deploy remoto dependem da execução na Vercel; o sucesso local não atesta o sucesso remoto.

## Verificado

- `npm install`: instalação concluída; auditoria do npm sem vulnerabilidades no momento da instalação.
- `npm run lint`: aprovado, sem avisos ou erros.
- `npm test`: **12 testes aprovados** após a atualização de fotos e WhatsApp.
  - Normalização do telefone brasileiro, mensagens distintas para cada ação e consultas com o material selecionado.
  - Catálogo publica apenas produtos verificados, filtra por marca e abre/fecha detalhes; fixtures existem somente durante o teste.
  - Assistente percorre cinco perguntas, recomenda PETG no cenário funcional, inclui sugestão e respostas no WhatsApp e reinicia corretamente.
  - FAQ altera estado acessível e exibe a resposta correspondente.
  - Quatro cenários da lógica educativa: flexibilidade, uso externo, resistência e iniciante.
  - SEO com domínio válido e prévia sem domínio.
- `npm run build`: TypeScript estrito e build Vite aprovados; saída em `front/dist/`.
- `git diff --check`: aprovado.
- Servidor Vite inicializou; GET da página, entrada React transformada e imagem hero retornaram HTTP 200.
- Imagens geradas inspecionadas e otimizadas: hero inicial 127.296 bytes, composição de objetos 92.280 bytes, detalhe 30.718 bytes. A variante dourada usada após a atualização da identidade visual também foi inspecionada antes da conversão em WebP.
- Logo pública do Instagram inspecionada visualmente; foto original de 100 × 100 px preservada em WebP local e aplicada ao cabeçalho e rodapé. Favicon derivado da mesma imagem.

## Limites da verificação

O serviço de navegador/Computer Use não disponibilizou navegador nem conexão nativa nesta sessão; uma tentativa de abrir a prévia em IAB retornou `Browser is not available: iab`.

Os testes de interface usam Happy DOM, que valida estados React e semântica, mas **não renderiza layout real**. APIs de dialog e animação são adaptadas apenas no ambiente de teste. Não substituem validação visual ou testes de foco em navegador real.

Os estilos contemplam mobile a partir de 320 px, tablet e desktop, porém a inspeção visual nas resoluções **320, 375, 390, 430, 768, 1024, 1440 e 1920 px** permanece pendente, assim como swipe real, navegação por teclado em navegador e avaliação Lighthouse. Não foram atribuídas pontuações de performance ou acessibilidade sem medição.

Antes do lançamento, validar as resoluções acima, os fluxos em navegador, o domínio final e os dados comerciais listados em `RESEARCH.md`.
