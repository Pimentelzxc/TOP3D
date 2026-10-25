# Backend TOP3D

Diretório reservado para a futura API da TOP3D.

A versão atual é uma landing page estática. Os dados comerciais ficam em `../front/src/data/` e o atendimento abre o WhatsApp; não há servidor, banco de dados ou endpoints nesta versão.

Quando a API for implementada, adicione seu `package.json` nesta pasta e registre `back` nos workspaces do `package.json` da raiz. Mantenha credenciais e variáveis privadas somente no backend, sem o prefixo público `VITE_`.

O deploy atual da Vercel publica apenas `front/dist`. O backend poderá ter seu próprio processo e configuração de deploy quando houver funcionalidades de servidor.
