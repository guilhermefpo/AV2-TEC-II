import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { recomendacaoService } from "../Container.js";
import { Papel } from "../enum/Papel.js";

const substituirSchema = z.object({
  papel: z.nativeEnum(Papel),
});

const reavaliarSchema = z.object({
  novoOrcamento: z.number().optional(),
  novoPrazo: z.coerce.date().optional(),
});

const recomendacaoUnicaResponseSchema = z.object({
  papel: z.nativeEnum(Papel),
  sugestoes: z.array(
    z.object({
      profissionalId: z.string(),
      nome: z.string(),
      score: z.number(),
    }),
  ),
});

const recomendacaoListaResponseSchema = z.array(
  recomendacaoUnicaResponseSchema,
);

const erroResponseSchema = z.object({ message: z.string() });

export default async function equipeRoutes(
  app: FastifyInstance<any, any, any, any, ZodTypeProvider>,
) {
  app.post(
    "/projetos/:projetoId/equipe/substituir",
    {
      schema: {
        params: z.object({ projetoId: z.string() }),
        body: substituirSchema,
        response: {
          200: recomendacaoUnicaResponseSchema,
          404: erroResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { projetoId } = request.params;
      const { papel } = request.body;

      try {
        const recomendacao = await recomendacaoService.recomendarParaPapel(
          projetoId,
          papel,
        );
        return reply.send({
          papel: recomendacao.papel,
          sugestoes: recomendacao.sugestoes.map((s) => ({
            profissionalId: s.profissional.id,
            nome: s.profissional.nome,
            score: s.score,
          })),
        });
      } catch (erro) {
        return reply.status(404).send({
          message: erro instanceof Error ? erro.message : "Erro desconhecido.",
        });
      }
    },
  );

  app.post(
    "/projetos/:projetoId/reavaliar",
    {
      schema: {
        params: z.object({ projetoId: z.string() }),
        body: reavaliarSchema,
        response: {
          200: recomendacaoListaResponseSchema,
          404: erroResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { projetoId } = request.params;
      const { novoOrcamento, novoPrazo } = request.body;

      try {
        const recomendacoes = await recomendacaoService.reavaliarCompleta(
          projetoId,
          novoOrcamento,
          novoPrazo,
        );
        return reply.send(
          recomendacoes.map((r) => ({
            papel: r.papel,
            sugestoes: r.sugestoes.map((s) => ({
              profissionalId: s.profissional.id,
              nome: s.profissional.nome,
              score: s.score,
            })),
          })),
        );
      } catch (erro) {
        return reply.status(404).send({
          message: erro instanceof Error ? erro.message : "Erro desconhecido.",
        });
      }
    },
  );
}
