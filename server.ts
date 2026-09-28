import "reflect-metadata";
import { AppDataSource } from "./src/database/Data-source.js";
import { buildApp } from "./app.js";

async function main() {
  await AppDataSource.initialize();
  console.log("Conectado ao PostgreSQL.");

  const app = buildApp();

  app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
    console.log("HTTP server running on http://localhost:3333");
    console.log("Docs available at http://localhost:3333/docs");
  });
}

main().catch((erro) => {
  console.error("Falha ao iniciar o servidor:", erro);
  process.exit(1);
});
