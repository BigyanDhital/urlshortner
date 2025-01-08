FROM oven/bun:latest

WORKDIR /app

COPY package.json   ./
RUN bun install

COPY . .

ENV PORT=3333
EXPOSE 3333

CMD ["bun", "run", "index.ts"] 