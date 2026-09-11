import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Recomendacao from "../entities/Recomendacao.js";
import type RecomendacaoStrategy from "../strategy/RecomendacaoStrategy.js";

export default abstract class OrquestradorEquipe {
  constructor(protected estrategia: RecomendacaoStrategy) {}

  public processarRecomendacao(
    projeto: Projeto,
    profissionais: Profissional[],
  ): Recomendacao {
    const projetoNormalizado = this.normalizarEntrada(projeto);
    this.validarRestricoesOrcamentarias(projetoNormalizado);

    const recomendacao = this.estrategia.recomendar(
      projetoNormalizado,
      profissionais,
    );

    return this.posProcessarRecomendacoes(recomendacao);
  }

  protected abstract normalizarEntrada(projeto: Projeto): Projeto;
  protected abstract validarRestricoesOrcamentarias(projeto: Projeto): void;
  protected abstract posProcessarRecomendacoes(
    recomendacao: Recomendacao,
  ): Recomendacao;
}
