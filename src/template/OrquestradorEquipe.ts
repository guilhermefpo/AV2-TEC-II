import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import Recomendacao from "../entities/Recomendacao.js";
import type RecomendacaoStrategy from "../strategy/RecomendacaoStrategy.js";
import type { Papel } from "../enum/Papel.js";
import type FabricaProjeto from "../factory/FabricaProjeto.js";

export default abstract class OrquestradorEquipe {
  constructor(
    protected estrategia: RecomendacaoStrategy,
    protected fabrica?: FabricaProjeto,
  ) {}

  public obterEstrategia(): RecomendacaoStrategy { return this.estrategia; }

  public processarRecomendacao(
    projeto: Projeto,
    profissionaisDisponiveis: Profissional[],
  ): Recomendacao[] {
    const projetoNormalizado = this.normalizarEntrada(projeto);
    this.validarRestricoesOrcamentarias(projetoNormalizado);

    const recomendacoesPorPapel: Recomendacao[] = [];

    for (const papelObrigatorio of projetoNormalizado.papeisObrigatorios) {
      const recomendacao = (this.fabrica?.criarRecomendador() ?? this.estrategia).recomendar(
        projetoNormalizado,
        papelObrigatorio.papel,
        profissionaisDisponiveis,
      );
      recomendacoesPorPapel.push(recomendacao);
    }

    return this.posProcessarRecomendacoes(recomendacoesPorPapel);
  }

  public recomendarUnico(
    projeto: Projeto,
    papel: Papel,
    profissionaisDisponiveis: Profissional[],
  ): Recomendacao {
    const projetoNormalizado = this.normalizarEntrada(projeto);
    this.validarRestricoesOrcamentarias(projetoNormalizado);

    const recomendacao = (this.fabrica?.criarRecomendador() ?? this.estrategia).recomendar(
      projetoNormalizado,
      papel,
      profissionaisDisponiveis,
    );

    const resultados = this.posProcessarRecomendacoes([recomendacao]);
    const resultado = resultados[0];

    if (!resultado) {
      throw new Error(
        `Falha ao pós-processar recomendação para o papel ${papel}.`,
      );
    }

    return resultado;
  }

  protected abstract normalizarEntrada(projeto: Projeto): Projeto;
  protected abstract validarRestricoesOrcamentarias(projeto: Projeto): void;
  protected abstract posProcessarRecomendacoes(
    recomendacoes: Recomendacao[],
  ): Recomendacao[];
}
