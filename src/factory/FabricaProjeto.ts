import type Projeto from "../entities/Projeto.js";
import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import type RecomendacaoStrategy from "../strategy/RecomendacaoStrategy.js";
import type EmissorRecomendacao from "../observer/EmissorRecomendacao.js";

export default interface FabricaProjeto {
  criarProjeto(dados: ConstructorParameters<typeof Projeto>): Projeto;
  criarValidador(): VisitanteProjeto;
  criarRecomendador(): RecomendacaoStrategy;
  criarNotificador(): EmissorRecomendacao;
}
