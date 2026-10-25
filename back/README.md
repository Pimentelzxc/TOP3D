# Backend do catálogo TOP3D

O backend usa **Supabase: Postgres + Auth + Storage**. As migrações desta pasta definem a API de dados e suas permissões. A Vercel publica a SPA React; os dados persistem no Supabase, sem gravar arquivos no filesystem temporário da Vercel.

## Ativar no projeto existente

1. No Supabase, abra **SQL Editor**, copie o conteúdo de [001_catalog.sql](migrations/001_catalog.sql) e execute. O script cria as tabelas da TOP3D e o bucket de imagens, sem popular o catálogo com produtos fictícios.
2. Em **Authentication → Users → Add user**, crie a conta **top3d2k26@gmail.com**. Defina a senha no próprio Supabase e confirme o e-mail conforme o fluxo escolhido. Não coloque a senha no código.
3. No SQL Editor, execute [002_grant_admin.sql](migrations/002_grant_admin.sql). Somente essa conta será autorizada. O script falha de forma explícita se a conta ainda não existir.
4. No frontend, configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. A conexão local já está em `front/.env.local`, arquivo ignorado pelo Git. No deploy, cadastre as mesmas duas variáveis na Vercel e faça um novo build.
5. Em **Authentication → URL Configuration**, configure o domínio final em Site URL e permita o redirecionamento exato `https://SEU-DOMINIO/admin/recuperar`. Para desenvolvimento, adicione a origem local usada pelo Vite com `/admin/recuperar`. Configure o envio de e-mails do Supabase para que a recuperação funcione.
6. Acesse **`/admin`**, entre com o e-mail acima e cadastre o primeiro produto. Salve como rascunho ou marque **Publicar no catálogo**. Abra o site em outra sessão para confirmar a publicação.

O painel não oferece cadastro público. Uma conta autenticada comum também não pode administrar produtos: a autorização é feita pelas políticas do banco, não pelo código visual do painel.

## Estruturas criadas

- `public.top3d_catalog_products`: nome, marca, material, descrição, foto, cor, peso, diâmetro, preço opcional, disponibilidade, link opcional e publicação.
- `top3d_private.catalog_admins`: lista de contas autorizadas, inacessível ao cliente.
- `public.top3d_is_catalog_admin()`: consulta da permissão do usuário autenticado.
- Bucket `top3d-catalog-products`: fotos públicas de produtos em JPG, PNG ou WebP, até 5 MB. Upload e exclusão exigem administração. SVG e HTML não são aceitos.

As políticas usam `auth.uid()`, e o frontend usa somente a chave **publicável/anon**. A chave `service_role`/`sb_secret` nunca é necessária para o site. A chave secreta compartilhada na conversa deve ser revogada/rotacionada no projeto.

## Fluxo de publicação

Rascunhos só podem ser lidos pela administração. Visitantes recebem apenas os produtos publicados. A vitrine consulta o banco ao abrir, ao retornar à aba e a cada minuto enquanto a aba estiver visível; não exige novo deploy a cada cadastro.

O painel permite criar, editar, publicar, despublicar e excluir produtos, além de trocar a fotografia. Alterações concorrentes são detectadas por `updated_at`: uma edição antiga não sobrescreve uma mais recente silenciosamente. Os produtos não têm checkout; sem link de compra configurado, o atendimento usa WhatsApp com o nome do produto.

Ao trocar/excluir produtos, a foto anterior é removida após a confirmação do banco. Se a limpeza falhar, o painel informa e preserva o arquivo. Uploads concluídos antes de uma falha de salvamento podem deixar arquivos órfãos; revise o bucket periodicamente sem excluir imagens ainda referenciadas em `image_path`.

## Validação

`npm test`, pela raiz, executa também as migrações em PostgreSQL local via PGlite, com contratos mínimos de Auth/Storage. Testa a autorização, bloqueio de usuários comuns, isolamento de rascunhos, políticas de arquivos e validações de dados. Os testes não fazem alterações no projeto Supabase real e não substituem a execução das migrações nele.
