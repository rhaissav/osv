# Projeto Backend - Gerenciador de Projetos

## Descrição
API Node.js + TypeScript para gestão de projetos colaborativos, com autenticação JWT, múltiplos autores, exportação PDF e gestão de perfil de usuário.

## Principais Funcionalidades
- Cadastro e login de usuários (JWT)
- CRUD de projetos (com múltiplos autores)
- Adição de membros por e-mail
- Exportação de projeto em PDF
- Gestão de perfil do usuário (alterar nome, e-mail, senha, excluir conta)
- Proteção e autorização por recurso

## Funcionalidades de e-mail
- Recuperação de senha: `/password-recovery` (envia link para redefinir senha)
- Convite de membro: `/projects/:id/users` (envia convite por e-mail, com fluxo de completar cadastro se o usuário for novo)
- Completar cadastro: `/complete-signup` (finaliza cadastro de usuário pendente)

## Tecnologias
- Node.js + TypeScript
- Fastify
- Prisma ORM + PostgreSQL
- JWT
- PDFKit

## Configuração de e-mail (SMTP)
Adicione ao seu `.env`:
```env
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASS=sua_senha_ou_senha_app
MAIL_FROM=no-reply@seudominio.com
APP_URL=http://localhost:3000
```

## Como rodar localmente
1. **Clone o repositório:**
   ```sh
   git clone <url-do-repo>
   cd backend
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
3. **Configure o banco de dados:**
   - Edite o arquivo `.env` com sua string de conexão PostgreSQL e o segredo JWT:
     ```env
     DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_db
     JWT_SECRET=sua_chave_secreta
     ```
4. **Rode as migrations:**
   ```sh
   npx prisma migrate dev
   ```
5. **Inicie o servidor:**
   ```sh
   npm run start
   ```

## Rotas principais (atualizado)
- `POST /register` — Cadastro
- `POST /login` — Login
- `POST /password-recovery` — Recuperação de senha
- `POST /complete-signup` — Completar cadastro de usuário pendente
- `GET /me` — Perfil do usuário
- `PUT /me` — Atualizar perfil
- `DELETE /me` — Excluir conta
- `POST /projects` — Criar projeto
- `GET /projects` — Listar projetos do usuário
- `GET /projects/:id` — Buscar projeto do usuário por id
- `PUT /projects/:id` — Atualizar projeto do usuário por id
- `DELETE /projects/:id` — Deletar projeto do usuário por id
- `POST /projects/:id/users` — Adicionar membro por e-mail ao projeto
- `GET /projects/:id/export/pdf` — Exportar projeto em PDF

## Observações
- O segredo JWT, string do banco e credenciais SMTP devem estar no `.env` (não subir para o git).
- O projeto segue arquitetura modular e princípios SOLID.

---

Dúvidas? Abra uma issue!
