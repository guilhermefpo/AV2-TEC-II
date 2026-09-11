import OrquestradorEquipe from "./OrquestradorEquipe.js";
import type Projeto from "../entities/Projeto.js";
import type Recomendacao from "../entities/Recomendacao.js";

export default class OrquestradorPadrao extends OrquestradorEquipe {
  protected normalizarEntrada(projeto: Projeto): Projeto {
    return projeto;
  }

  protected validarRestricoesOrcamentarias(projeto: Projeto): void {
    if (projeto.orcamento <= 0) {
      throw new Error("Orçamento do projeto deve ser maior que zero.");
    }
  }

  protected posProcessarRecomendacoes(
    recomendacao: Recomendacao,
  ): Recomendacao {
    return recomendacao;
  }
}
