# Object Set Visualizer (OSV)

Sistema de modelagem orientada a objetos com visualização baseada na Teoria dos Conjuntos.

## Descrição

O OSV é uma ferramenta para criação e visualização de modelos de classes orientados a objetos, apresentando a estrutura através da notação matemática da Teoria dos Conjuntos. O sistema permite criar módulos, pacotes, classes e relações, oferecendo uma representação formal e visual dos elementos do modelo.

## Arquitetura

- **Backend**: API REST em Node.js/TypeScript com Fastify e Prisma
- **Frontend**: Interface em React/TypeScript com Vite e TailwindCSS
- **Banco de dados**: PostgreSQL

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL (local ou remoto)

## Configuração e Execução

### 1. Backend (API)

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure o banco de dados
# 1. Crie um arquivo .env baseado no exemplo:
cp .env.example .env

# 2. Configure a variável DATABASE_URL no .env:
DATABASE_URL="postgresql://usuario:senha@localhost:5432/osv_db"

# 3. Execute as migrações do banco
npx prisma migrate dev

# 4. (Opcional) Visualize o banco de dados
npx prisma studio

# Inicie o servidor de desenvolvimento
npm run dev

# O backend estará rodando em http://localhost:3000
```

### 2. Frontend (Interface)

```bash
# Entre na pasta do frontend (em outro terminal)
cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# 1. Crie um arquivo .env baseado no exemplo:
cp .env.example .env

# 2. Configure a URL da API no .env:
VITE_API_URL=http://localhost:3000

# Inicie o servidor de desenvolvimento
npm run dev

# O frontend estará disponível em http://localhost:5173
```

## Execução com Docker (Recomendado para Portabilidade)

### 1. Preparar ambiente

```bash
# Na raiz do projeto
cp .env.example .env

# Ajuste os valores obrigatórios no .env
# - JWT_SECRET
# - SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS
# - MAIL_FROM
```

### 2. Subir todo o stack

```bash
docker compose up --build -d
```

Serviços após o deploy local com Docker:

- Frontend: http://localhost
- Backend: http://localhost:3000
- PostgreSQL: localhost:5433

### 3. Logs e troubleshooting rápido

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### 4. Parar e remover containers

```bash
docker compose down
```

Para remover também o volume do banco:

```bash
docker compose down -v
```


## Funcionalidades

### Modelagem

- Criação de **Módulos**: containers de alto nível
- Criação de **Pacotes**: agrupamentos lógicos dentro de módulos  
- Criação de **Classes**: elementos básicos com atributos e métodos
- **Tipos de classe**: concreta, abstrata, interface
- **Relações**: herança, associação, agregação entre classes

### Visualização

- **Contagem automática**: módulos, pacotes, classes, relações
- **Representação matemática**: notação de Teoria dos Conjuntos
- **Modo escuro/claro**: interface adaptável
- **Exportação PDF**: gera documento com a estrutura completa

### Colaboração

- **Projetos compartilhados**: proprietário e colaboradores
- **Controle de acesso**: edição restrita por papel do usuário
- **Gerenciamento de membros**: adicionar/remover colaborador
