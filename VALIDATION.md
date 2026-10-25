# Validação

Executada em 25 de outubro de 2026, no Windows com Node.js 24.15.0.

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
- `npm run build`: TypeScript estrito e build Vite aprovados; saída em `dist/`.
- `git diff --check`: aprovado.
- Servidor Vite inicializou; GET da página, entrada React transformada e imagem hero retornaram HTTP 200.
- Imagens geradas inspecionadas e otimizadas: hero inicial 127.296 bytes, composição de objetos 92.280 bytes, detalhe 30.718 bytes. A variante dourada usada após a atualização da identidade visual também foi inspecionada antes da conversão em WebP.
- Logo pública do Instagram inspecionada visualmente; foto original de 100 × 100 px preservada em WebP local e aplicada ao cabeçalho e rodapé. Favicon derivado da mesma imagem.

## Limites da verificação

O serviço de navegador/Computer Use não disponibilizou navegador nem conexão nativa nesta sessão; uma tentativa de abrir a prévia em IAB retornou `Browser is not available: iab`.

Os testes de interface usam Happy DOM, que valida estados React e semântica, mas **não renderiza layout real**. APIs de dialog e animação são adaptadas apenas no ambiente de teste. Não substituem validação visual ou testes de foco em navegador real.

Os estilos contemplam mobile a partir de 320 px, tablet e desktop, porém a inspeção visual nas resoluções **320, 375, 390, 430, 768, 1024, 1440 e 1920 px** permanece pendente, assim como swipe real, navegação por teclado em navegador e avaliação Lighthouse. Não foram atribuídas pontuações de performance ou acessibilidade sem medição.

Antes do lançamento, validar as resoluções acima, os fluxos em navegador, o domínio final e os dados comerciais listados em `RESEARCH.md`.
