import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { relatorioService } from "../Container.js";

const relatorioResponseSchema = z.object({
  relatorio: z.string(),
  valido: z.boolean(),
  erros: z.array(z.string()),
  pontuacaoCompatibilidade: z.number(),
});

const erroResponseSchema = z.object({
  message: z.string(),
});

export default async function relatorioRoutes(
  app: FastifyInstance<any, any, any, any, ZodTypeProvider>,
) {
  app.get(
    "/projetos/:projetoId/relatorio",
    {
      schema: {
        params: z.object({ projetoId: z.string() }),
        response: {
          200: relatorioResponseSchema,
          404: erroResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { projetoId } = request.params;

      try {
        const resultado = await relatorioService.gerarRelatorio(projetoId);
        return reply.send(resultado);
      } catch (erro) {
        return reply.status(404).send({
          message: erro instanceof Error ? erro.message : "Erro desconhecido.",
        });
      }
    },
  );
}
