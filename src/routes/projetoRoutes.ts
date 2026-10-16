import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import Projeto from "../entities/Projeto.js";
import {
  recomendacaoService,
  projetoRepository,
  orquestradores,
} from "../Container.js";
import { Papel } from "../enum/Papel.js";
import { FabricaAnimacao, FabricaDocumentario, FabricaPublicitario } from "../factory/FabricasConcretas.js";
import OrquestradorPadrao from "../template/OrquestradorPadrao.js";

const papelObrigatorioSchema = z.object({
  papel: z.nativeEnum(Papel),
  peso: z.number(),
  competenciasDesejadas: z.array(
    z.object({ nome: z.string(), nivel: z.number() }),
  ),
});

const projetoSchema = z.object({
  id: z.string(),
  genero: z.string(),
  duracao: z.number(),
  orcamento: z.number(),
  prazo: z.coerce.date(),
  tipoCaptacao: z.string(),
  localizacao: z.string(),
  papeisObrigatorios: z.array(papelObrigatorioSchema),
  estrategia: z
    .enum(["cosseno", "colaborativa", "baixo_orcamento"])
    .default("cosseno"),
});

const recomendacaoResponseSchema = z.array(
  z.object({
    papel: z.nativeEnum(Papel),
    sugestoes: z.array(
      z.object({
        profissionalId: z.string(),
        nome: z.string(),
        score: z.number(),
      }),
    ),
  }),
);

export default async function projetoRoutes(
  app: FastifyInstance<any, any, any, any, ZodTypeProvider>,
) {
  app.post(
    "/projetos/recomendacao",
    {
      schema: {
        body: projetoSchema,
        response: { 200: recomendacaoResponseSchema },
      },
    },
    async (request, reply) => {
      const dados = request.body;

      const fabrica = dados.genero.toLowerCase().includes("anim")
        ? new FabricaAnimacao()
        : dados.genero.toLowerCase().includes("public")
          ? new FabricaPublicitario()
          : new FabricaDocumentario();
      const projeto = fabrica.criarProjeto([
        dados.id,
        dados.genero,
        dados.duracao,
        dados.orcamento,
        dados.prazo,
        dados.tipoCaptacao,
        dados.localizacao,
        dados.papeisObrigatorios,
      ] as ConstructorParameters<typeof Projeto>);
      const orquestradorPorTipo = new OrquestradorPadrao(
        orquestradores[dados.estrategia].obterEstrategia(),
      );

      await projetoRepository.salvar(projeto);

      const recomendacoes = await recomendacaoService.gerarRecomendacoes(
        projeto,
        orquestradorPorTipo,
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
    },
  );
}
