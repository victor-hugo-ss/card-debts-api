# Card Debts API

API para gerenciar dividas de amigos que utilizam cartoes de credito de um administrador para realizar compras.

## Tecnologias

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Prisma
- Zod
- Swagger
- JWT
- Vitest
- Docker

## Requisitos

- Node.js
- npm
- Docker
- Docker Compose

## Instalacao

```bash
npm install
```

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

Exemplo:

```env
DATABASE_URL="postgresql://card_debts:card_debts@localhost:5433/card_debts"
JWT_SECRET="sua-chave-secreta"

ADMIN_NAME="Admin"
ADMIN_EMAIL="admin@email.com"
ADMIN_PASSWORD="123456"
```

## Banco de dados com Docker

Suba o PostgreSQL:

```bash
docker compose up -d
```

Para parar:

```bash
docker compose stop
```

Para remover o container:

```bash
docker compose down
```

Para remover o container e apagar os dados:

```bash
docker compose down -v
```

## Migrations

Execute as migrations:

```bash
npx prisma migrate dev
```

## Seed

Crie o usuario admin inicial:

```bash
npm run db:seed
```

O seed cria um admin apenas se ainda nao existir nenhum usuario com perfil `ADMIN`.

## Rodando em desenvolvimento

```bash
npm run dev
```

A API ficara disponivel em:

```txt
http://localhost:3333
```

## Documentacao

Com a API rodando, acesse o Swagger em:

```txt
http://localhost:3333/docs
```

## Scripts

```bash
npm run dev
```

Roda a API em desenvolvimento.

```bash
npm run build
```

Compila o projeto TypeScript.

```bash
npm run start
```

Roda a versao compilada.

```bash
npm run test
```

Executa os testes automatizados.

```bash
npm run test:watch
```

Executa os testes em modo watch.

```bash
npm run db:seed
```

Cria o admin inicial.

## Fluxo da aplicacao

O sistema possui dois perfis:

### ADMIN

O admin pode:

- cadastrar amigos
- cadastrar cartoes de credito
- cadastrar compras
- visualizar dashboards
- listar compras
- listar parcelas
- marcar parcelas como pagas
- desfazer pagamento de parcelas

### FRIEND

O friend pode:

- fazer login
- visualizar suas compras
- visualizar suas parcelas
- filtrar parcelas por status e mes
- visualizar seu resumo de dividas

O friend nao pode cadastrar compras, cartoes ou marcar parcelas como pagas.

## Rotas principais

### Auth

```http
POST /sessions
GET /me
```

### Users

```http
POST /admin/friends
GET /users/friends
```

### Credit Cards

```http
POST /credit-cards
GET /credit-cards
GET /credit-cards/:id
PUT /credit-cards/:id
DELETE /credit-cards/:id
```

### Purchases

```http
POST /purchases
GET /purchases
GET /purchases/:id
```

### Installments

```http
GET /installments
PATCH /installments/:id/pay
PATCH /installments/:id/unpay
```

### Friend

```http
GET /friend/summary
GET /friend/purchases
GET /friend/installments
```

### Dashboard

```http
GET /dashboard/summary
GET /dashboard/by-friend
GET /dashboard/by-credit-card
GET /dashboard/upcoming-installments
GET /dashboard/by-month
```

## Testes

Execute:

```bash
npm run test
```

Os testes cobrem:

- health check
- autenticacao
- autorizacao por perfil
- cartoes de credito
- compras
- geracao de parcelas
- parcelas
- rotas do amigo
- dashboard

## Observacoes

As parcelas sao criadas automaticamente como pendentes.

Para compras antigas, o administrador pode marcar manualmente no frontend quais parcelas ja foram pagas.

A regra de fatura considera:

- compras ate o dia de fechamento entram na proxima fatura
- compras apos o dia de fechamento entram na fatura seguinte
