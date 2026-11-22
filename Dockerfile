# "Wer würde eher?": SvelteKit (adapter-node) und Socket.IO in einem Node-Prozess auf Port 3000.
# Angelehnt an IT25A/deploy-workflows examples/sveltekit-sqlite.

# Debian-basiertes Image ("slim"), weil better-sqlite3 ein natives Modul ist und dafür fertige Binaries mitbringt.
# Stage 1 "build": alles installieren, App bauen, danach die Entwicklungswerkzeuge wieder entfernen.
FROM node:26-slim AS build
# Build-Werkzeuge, falls für die Plattform kein fertiges better-sqlite3-Binary existiert (z. B. arm64).
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev

# Stage 2: nur die gebaute App, die Laufzeit-Abhängigkeiten und der Game-Server.
FROM node:26-slim
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
# Die mitgelieferte Datenbank wird beim ersten Start in das (leere) Volume kopiert, siehe src/lib/server/database.ts.
ENV DATABASE_SEED_PATH=/app/seed/Fragen.db
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
# Der Game-Server (TypeScript) wird von Node direkt ausgeführt und braucht diese Quelldateien.
COPY --from=build /app/server/src ./server/src
COPY --from=build /app/shared ./shared
COPY --from=build /app/src/lib/questions.ts ./src/lib/questions.ts
COPY --from=build /app/data/Fragen.db ./seed/Fragen.db

# Die Datenbank liegt in /data (Volume). Der Ordner muss vor "USER node" angelegt werden und "node" gehören.
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 3000
# Health check: Die Plattform wartet, bis /health antwortet; sonst wird das Update zurückgerollt.
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health',{signal:AbortSignal.timeout(3000)}).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/src/prod.ts"]
