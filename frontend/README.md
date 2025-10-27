
# Frontend - Gerenciador de Projetos

## Descrição

Aplicação React + TypeScript + Vite para gestão de projetos colaborativos, integração com backend Node.js, permissões de membros, visualização OOP e exportação PDF.

## Principais Funcionalidades

- Listagem, criação, edição e remoção de projetos
- Adição e remoção de membros (com permissões OWNER/MEMBER)
- Visualização de estrutura de projeto (módulos, pacotes, classes, relações)
- Modal de confirmação para remoção de projetos e membros
- Exportação de projeto em PDF
- Autenticação integrada ao backend

## Como rodar localmente

1. Instale as dependências:

   ```sh
   npm install
   ```

2. Execute em modo desenvolvimento:

   ```sh
   npm run dev
   ```

   O app estará disponível em `http://localhost:5173` (ou porta configurada no Vite).

## Build para produção

1. Rode o build:

   ```sh
   npm run build
   ```

2. Sirva os arquivos estáticos do diretório `dist`.

## Estrutura de pastas

 - `src/pages` — Páginas principais (Projects, ProjectCreate, Login, etc.)
 - `src/components` — Componentes reutilizáveis (Button, ConfirmModal, Sidebar, etc.)
 - `src/api` — Integração com backend (axios, endpoints)
 - `src/routes` — Gerenciamento de rotas da aplicação (React Router)
 - `src/utils` — Funções utilitárias e helpers (ex: JWT, validações)

## Observações

- O frontend consome a API do backend (ver pasta `backend`).
- Permissões: apenas OWNER pode adicionar e remover membros.
- Modais de confirmação garantem segurança nas ações destrutivas.
- Para exportar PDF, o backend deve estar rodando e configurado.

---

Dúvidas? Abra uma issue!
