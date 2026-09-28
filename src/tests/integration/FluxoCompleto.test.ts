import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../../../app.js";
import { AppDataSource } from "../../database/Data-source.js";
import type { FastifyInstance } from "fastify";

describe("Fluxo completo: cadastro → recomendação → convite → relatório", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("executa o ciclo de vida completo de um projeto", async () => {
    // 1. Cadastrar profissional
    const respProfissional = await app.inject({
      method: "POST",
      url: "/profissionais",
      payload: {
        nome: "Ana Teste",
        competencias: [],
        precoMedio: 1000,
        disponivel: true,
      },
    });
    expect(respProfissional.statusCode).toBe(201);
    const profissional = respProfissional.json();
    expect(profissional.id).toBeDefined();

    // 2. Gerar recomendação
    const respRecomendacao = await app.inject({
      method: "POST",
      url: "/projetos/recomendacao",
      payload: {
        id: "projeto-teste-integracao",
        genero: "ficção",
        duracao: 100,
        orcamento: 20000,
        prazo: "2026-12-01",
        tipoCaptacao: "ficção",
        localizacao: "SP",
        papeisObrigatorios: [
          { papel: "DIRETOR", peso: 5, competenciasDesejadas: [] },
        ],
      },
    });
    expect(respRecomendacao.statusCode).toBe(200);
    const recomendacoes = respRecomendacao.json();
    expect(recomendacoes[0].sugestoes[0].profissionalId).toBe(profissional.id);

    // 3. Criar convite
    const respConvite = await app.inject({
      method: "POST",
      url: "/projetos/projeto-teste-integracao/convites",
      payload: {
        profissionalId: profissional.id,
        papel: "DIRETOR",
      },
    });
    expect(respConvite.statusCode).toBe(201);
    const convite = respConvite.json();
    expect(convite.status).toBe("pendente");

    // 4. Aceitar convite
    const respAceite = await app.inject({
      method: "PATCH",
      url: `/convites/${convite.id}`,
      payload: { resposta: "aceito" },
    });
    expect(respAceite.statusCode).toBe(200);
    expect(respAceite.json().status).toBe("aceito");

    // 5. Consultar relatório
    const respRelatorio = await app.inject({
      method: "GET",
      url: "/projetos/projeto-teste-integracao/relatorio",
    });
    expect(respRelatorio.statusCode).toBe(200);
    const relatorio = respRelatorio.json();
    expect(relatorio.valido).toBe(true);
    expect(relatorio.relatorio).toContain("DIRETOR");
  });

  it("retorna 404 ao consultar relatório de projeto inexistente", async () => {
    const resp = await app.inject({
      method: "GET",
      url: "/projetos/projeto-que-nao-existe/relatorio",
    });
    expect(resp.statusCode).toBe(404);
  });
});
