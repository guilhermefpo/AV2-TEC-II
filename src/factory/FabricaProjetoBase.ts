import Projeto from "../entities/Projeto.js";
import type FabricaProjeto from "./FabricaProjeto.js";
import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import type RecomendacaoStrategy from "../strategy/RecomendacaoStrategy.js";
import EmissorRecomendacao from "../observer/EmissorRecomendacao.js";
import ValidadorConsistencia from "../gerador/ValidatorConscistencia.js";
import EstrategiaCosseno from "../strategy/EstrategiaCosseno.js";

export default class FabricaProjetoBase implements FabricaProjeto {
  constructor(
    private readonly ProjetoTipo: new (...args: ConstructorParameters<typeof Projeto>) => Projeto = Projeto,
    private readonly estrategia: RecomendacaoStrategy = new EstrategiaCosseno(),
  ) {}
  criarProjeto(dados: ConstructorParameters<typeof Projeto>): Projeto { return new this.ProjetoTipo(...dados); }
  criarValidador(): VisitanteProjeto { return new ValidadorConsistencia(); }
  criarRecomendador(): RecomendacaoStrategy { return this.estrategia; }
  criarNotificador(): EmissorRecomendacao { return new EmissorRecomendacao(); }
}
