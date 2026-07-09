FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://user:password@localhost:5432/card_debts"

RUN npm run build

EXPOSE 3333

CMD ["npm", "run", "start"]