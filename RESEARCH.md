# Pesquisa TOP3D

Consulta: **25 de outubro de 2026**. Briefing recebido como arquivo de texto; não havia código nem imagens da empresa no repositório.

## Marcas e catálogo administrável

O responsável confirmou que a TOP3D trabalha com **Multfila, 3D Brothers, Voolt3D, 3D Prime e ELEGOO**. Essa lista foi usada na nova seção Marcas e no painel de cadastro; não se afirmou que a loja é distribuidora oficial ou que um SKU específico está em estoque.

Fontes consultadas para os textos básicos:

- Multfila: https://multfila.com.br/ — portfólio PLA/PETG/TPU/ABS e acabamentos Silk, Matte e Multicolor. A loja oficial estava em manutenção; a foto do exemplo veio da página pública da Artbox3D, creditada separadamente.
- 3D Brothers: https://3dbrothers.com.br/sobre/ — fabricação brasileira em Curitiba, com PLA/PETG/ABS. Foto e logo da própria loja.
- Voolt3D: https://voolt3d.com.br/ — linhas PLA Velvet, V-Silk e PETG HF. Foto do PLA Dourado V-Silk e logo da loja oficial.
- 3D Prime: https://3dprime.com.br/ — linhas PLA Basic e PLA Premium HT High Speed. Foto do PLA Basic Branco e logo oficiais.
- ELEGOO: https://us.elegoo.com/pages/elegoo-filaments e https://us.elegoo.com/collections/filaments — materiais PLA/PETG, acabamentos Silk e opções TPU. Foto e logo oficiais.

Fotos e logos foram salvos em `front/public/images/brands/`; as fontes estão em `ASSETS.md`. Não foram copiados preços, promoções, avaliações ou condições comerciais dos fabricantes para o catálogo da TOP3D. O cadastro real passa a ser feito pela administradora no Supabase.

O usuário forneceu a URL e a chave publicável do projeto Supabase e indicou **top3d2k26@gmail.com** para administração. A conexão pública foi testada; na primeira consulta a tabela da TOP3D ainda não existia (PGRST205). As migrações foram preparadas para execução no SQL Editor. Nenhuma chave secreta foi incorporada ao código.

## Atualização fornecida pelo responsável

O usuário informou o WhatsApp **(41) 99776-5420** e solicitou seu uso em todos os contatos. Número configurado como **5541997765420**, incluindo o código do Brasil. A fonte dessa informação é a instrução direta do usuário; o número não foi inferido das buscas.

Também solicitou substituir as geometrias dos cards de materiais por fotos reais da internet. Foram utilizadas fotos dos exemplos de impressão dos guias da Prusa para PLA, PETG e ABS, e do artigo oficial sobre TPU 95A. Os arquivos estão locais em WebP; os créditos e links aparecem abaixo dos cards. São referências educativas de terceiros, não fotografias de produtos comercializados pela TOP3D. Fontes e arquivos em `ASSETS.md`.

## Fontes consultadas e resultado

### Atualização da identidade visual

Após a solicitação do usuário para seguir o Instagram, uma consulta HTTP direta à página pública `https://www.instagram.com/top3dd/` retornou 200 e permitiu ler as metatags públicas. A ferramenta de busca web continuou bloqueada por throttling, mas o HTML público trouxe título, bio e a foto de perfil em `og:image`. Não foram usados login, APIs privadas ou scraping contínuo.

A imagem confirma visualmente a marca TOP 3D Filamentos, com **preto, dourado e bege/creme**. A cópia pública de 100 × 100 px foi salva em `front/public/images/top3d-logo.webp` sem redesenho, remoção de fundo ou aumento artificial de resolução; o favicon PNG deriva dessa imagem. A interface usa aproximações visuais **#11100E**, **#E2B12B** e **#F9E7CE**. Não são valores declarados em um manual oficial de marca.

A bio pública também informa venda de PLA, PETG e TPU e o mesmo WhatsApp fornecido pelo usuário. Não foram extraídos SKUs, marcas, fotos de produtos ou preços para o catálogo. A tabela abaixo registra os resultados da pesquisa inicial.

| Fonte                                                                                           | Resultado                                                            | Uso                                                                                                      |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| https://www.instagram.com/top3dd/                                                               | Perfil indicado pelo usuário. Consulta web bloqueada por throttling. | Link de contato fornecido no briefing; não foi possível confirmar bio, logo, fotos ou catálogo.          |
| https://share.google/X8SxOJo89MuyTRx60                                                          | Link indicado pelo usuário, inacessível na ferramenta de consulta.   | Nenhum dado comercial extraído.                                                                          |
| Busca por `"top3dd" filamentos`, `"instagram.com/top3dd"` e `"TOP3D" filamentos instagram loja` | Resultados homônimos, sem vínculo seguro com o perfil informado.     | Não utilizados como identidade da empresa.                                                               |
| https://help.prusa3d.com/category/material-guide_220                                            | Guia técnico primário de fabricante de impressoras e materiais.      | Base educativa para PLA, PETG, ABS e materiais flexíveis. Não indica marcas vendidas pela TOP3D.         |
| https://help.prusa3d.com/article/drying-filament_332086                                         | Orientações de umidade, armazenamento e secagem.                     | FAQ de conservação; a página orienta seguir a ficha do fabricante, sem prescrever temperatura universal. |

## Identidade e dados

- Nome **TOP3D**, segmento filamentos 3D e perfil **@top3dd**: fornecidos no briefing e posteriormente corroborados pelos metadados públicos do perfil.
- Logo original obtida da foto pública do perfil, em resolução de 100 × 100 px. Paleta visual preta, dourada e creme aplicada. Arquivo original de alta resolução e manual de cores ainda não disponíveis.
- WhatsApp: informado pelo responsável na atualização acima. E-mail, endereço, horário, CNPJ, fundação, história, entregas, garantias, marcas, SKUs, preços e estoque: pendentes.
- Avaliações e depoimentos: não encontrados com vínculo verificável; componente preparado e oculto.
- Homônimos no Magalu, Shopee, Polônia e Coreia: **não vinculados** à TOP3D do briefing, logo não utilizados.

## Imagens

Não foram localizadas fotografias oficiais com autorização verificável. Foram geradas duas composições originais com a ferramenta integrada Imagegen, sem marcas de terceiros. São identificadas na página como **conceituais/ilustrativas** e não afirmam estoque, autoria de projetos ou produtos reais da empresa. Assets persistidos localmente e otimizados em WebP:

- `front/public/images/hero-spools-gold.webp`: bobinas dourada, creme e preta; hero, galeria e contato. Variante da composição inicial, adaptada à paleta da marca; original ciano preservado em `hero-spools.webp`.
- `front/public/images/creative-objects.webp`: vasos e objetos conceituais; galeria.
- `front/public/images/detail-objects.webp`: detalhe derivado da composição de objetos.

Prompts completos de geração: [ASSETS.md](ASSETS.md). Nenhuma imagem depende de URL temporária, scraping ou API privada.

## Decisões editoriais

- Sem SKUs confirmados, o catálogo permanece vazio com CTA de consulta ao WhatsApp. Todas as funções comerciais estão implementadas e serão alimentadas por dados verificados.
- PLA/PETG/ABS/TPU aparecem no guia como conteúdo educativo. A bio cita PLA/PETG/TPU, mas não confirma venda de ABS nem produtos específicos.
- Benefícios descrevem a experiência de aprender e criar; não inventam diferenciais comerciais.
- O texto institucional não inventa história, estrutura ou números.
- WhatsApp configurado com o número fornecido pelo responsável. Todos os CTAs de atendimento possuem mensagens contextuais; Instagram permanece separado no navbar e nos links institucionais.
- Sem domínio, não há canonical fictício; SEO final depende de `VITE_SITE_URL`.
- Links jurídicos só são exibidos quando URLs aprovadas são fornecidas. Não foram inventados termos ou políticas.

## Checklist para lançamento comercial

Obter logo em alta resolução e manual de cores, se disponíveis; demais dados de contato e condições comerciais; catálogo, fontes, fotos e autorização; preços e estoque se divulgados; endereço e horários se desejados; texto institucional; políticas aprovadas; domínio público; validar indicações técnicas com as fichas dos materiais efetivamente vendidos.
