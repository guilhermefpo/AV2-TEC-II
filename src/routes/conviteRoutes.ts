import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { conviteService } from "../Container.js";
import { Papel } from "../enum/Papel.js";

const criarConviteSchema = z.object({
  profissionalId: z.string(),
  papel: z.nativeEnum(Papel),
});

const responderConviteSchema = z.object({
  resposta: z.enum(["aceito", "recusado"]),
});

const conviteResponseSchema = z.object({
  id: z.string(),
  projetoId: z.string(),
  profissionalId: z.string(),
  papel: z.nativeEnum(Papel),
  status: z.enum(["pendente", "aceito", "recusado"]),
});
const erroResponseSchema = z.object({ message: z.string() });

export default async function conviteRoutes(
  app: FastifyInstance<any, any, any, any, ZodTypeProvider>,
) {
  app.post(
    "/projetos/:projetoId/convites",
    {
      schema: {
        params: z.object({ projetoId: z.string() }),
        body: criarConviteSchema,
        response: { 201: conviteResponseSchema, 404: erroResponseSchema },
      },
    },
    async (request, reply) => {
      const { projetoId } = request.params;
      const { profissionalId, papel } = request.body;

      let convite;
      try {
        convite = await conviteService.criarConvite(projetoId, profissionalId, papel);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Recurso não encontrado.";
        return reply.status(404).send({ message });
      }

      return reply.status(201).send(convite);
    },
  );

  app.patch(
    "/convites/:conviteId",
    {
      schema: {
        params: z.object({ conviteId: z.string() }),
        body: responderConviteSchema,
        response: { 200: conviteResponseSchema, 404: erroResponseSchema },
      },
    },
    async (request, reply) => {
      const { conviteId } = request.params;
      const { resposta } = request.body;

      let convite;
      try {
        convite = await conviteService.responderConvite(conviteId, resposta === "aceito");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Convite não encontrado.";
        return reply.status(404).send({ message });
      }

      return reply.send(convite);
    },
  );
}
