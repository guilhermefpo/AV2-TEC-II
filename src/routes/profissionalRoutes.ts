import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import Profissional from "../entities/Profissional.js";
import Competencia from "../entities/Competencia.js";
import { gerarId } from "../utils/GeradorID.js";
import { profissionalRepository } from "../Container.js";

const competenciaSchema = z.object({
  nome: z.string(),
  nivel: z.number(),
});

const criarProfissionalSchema = z.object({
  nome: z.string(),
  competencias: z.array(competenciaSchema).default([]),
  precoMedio: z.number().default(0),
  disponivel: z.boolean().default(true),
});

const profissionalResponseSchema = z.object({
  id: z.string(),
  nome: z.string(),
  competencias: z.array(competenciaSchema),
  precoMedio: z.number(),
  disponivel: z.boolean(),
});

const erroResponseSchema = z.object({
  message: z.string(),
});

export default async function profissionalRoutes(
  app: FastifyInstance<any, any, any, any, ZodTypeProvider>,
) {
  app.post(
    "/profissionais",
    {
      schema: {
        body: criarProfissionalSchema,
        response: {
          201: profissionalResponseSchema,
          409: erroResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const dados = request.body;

      const competencias = dados.competencias.map(
        (c) => new Competencia(c.nome, c.nivel),
      );

      const profissional = new Profissional(
        gerarId("P"), // ← id gerado automaticamente
        dados.nome,
        competencias,
        [],
        dados.precoMedio,
        dados.disponivel,
      );

      await profissionalRepository.salvar(profissional);

      return reply.status(201).send({
        id: profissional.id,
        nome: profissional.nome,
        competencias: profissional.competencias,
        precoMedio: profissional.precoMedio,
        disponivel: profissional.disponivel,
      });
    },
  );

  app.get(
    "/profissionais",
    {
      schema: {
        response: { 200: z.array(profissionalResponseSchema) },
      },
    },
    async (_request, reply) => {
      const todos = await profissionalRepository.listarTodos();
      return reply.send(
        todos.map((p) => ({
          id: p.id,
          nome: p.nome,
          competencias: p.competencias,
          precoMedio: p.precoMedio,
          disponivel: p.disponivel,
        })),
      );
    },
  );
}
