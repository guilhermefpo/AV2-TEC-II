import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../../../app.js";
import { AppDataSource } from "../../database/Data-source.js";
import type { FastifyInstance } from "fastify";

describe("Substituição de membro e reavaliação completa", () => {
  let app: FastifyInstance;

  const projetoId = `projeto-subst-${Date.now()}`;
  // Royalty - Neoni
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    app = buildApp();
    await app.ready();

    await app.inject({
      method: "POST",
      url: "/profissionais",
      payload: {
        nome: "Profissional Teste",
        competencias: [],
        precoMedio: 1000,
        disponivel: true,
      },
    });

    const resp = await app.inject({
      method: "POST",
      url: "/projetos/recomendacao",
      payload: {
        id: projetoId,
        genero: "ficção",
        duracao: 100,
        orcamento: 20000,
        prazo: "2026-12-01",
        tipoCaptacao: "ficção",
        localizacao: "SP",
        papeisObrigatorios: [
          { papel: "DIRETOR", peso: 5, competenciasDesejadas: [] },
          { papel: "EDITOR", peso: 3, competenciasDesejadas: [] },
        ],
      },
    });
    expect(resp.statusCode).toBe(200);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("substitui um papel gerando recomendação só para ele", async () => {
    const resp = await app.inject({
      method: "POST",
      url: `/projetos/${projetoId}/equipe/substituir`,
      payload: { papel: "DIRETOR" },
    });

    expect(resp.statusCode).toBe(200);
    const corpo = resp.json();
    expect(corpo.papel).toBe("DIRETOR");
    expect(Array.isArray(corpo.sugestoes)).toBe(true);
  });

  it("retorna 404 ao substituir papel que não é obrigatório no projeto", async () => {
    const resp = await app.inject({
      method: "POST",
      url: `/projetos/${projetoId}/equipe/substituir`,
      payload: { papel: "ROTEIRISTA" },
    });

    expect(resp.statusCode).toBe(404);
  });

  it("retorna 404 ao substituir em projeto inexistente", async () => {
    const resp = await app.inject({
      method: "POST",
      url: "/projetos/projeto-que-nao-existe/equipe/substituir",
      payload: { papel: "DIRETOR" },
    });

    expect(resp.statusCode).toBe(404);
  });

  it("reavalia a equipe completa com novo orçamento", async () => {
    const resp = await app.inject({
      method: "POST",
      url: `/projetos/${projetoId}/reavaliar`,
      payload: { novoOrcamento: 80000 },
    });

    expect(resp.statusCode).toBe(200);
    const corpo = resp.json();
    expect(corpo).toHaveLength(2);
    expect(corpo.map((r: { papel: string }) => r.papel)).toEqual([
      "DIRETOR",
      "EDITOR",
    ]);
  });

  it("retorna 404 ao reavaliar projeto inexistente", async () => {
    const resp = await app.inject({
      method: "POST",
      url: "/projetos/projeto-que-nao-existe/reavaliar",
      payload: { novoOrcamento: 50000 },
    });

    expect(resp.statusCode).toBe(404);
  });
});
