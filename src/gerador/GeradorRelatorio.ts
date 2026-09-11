import type VisitanteProjeto from "../interface/VisitanteProjeto.ts";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Avaliacao from "../entities/Avaliacao.js";

export default class GeradorRelatorio implements VisitanteProjeto {
  private linhas: string[] = [];

  visitarProjeto(projeto: Projeto): void {
    this.linhas.push(
      `PROJETO: ${projeto.id} - Orçamento: R$${projeto.orcamento}`,
    );
  }

  visitarProfissional(profissional: Profissional): void {
    this.linhas.push(
      `  PROFISSIONAL: ${profissional.nome} - R$${profissional.precoMedio}`,
    );
  }

  visitarAvaliacao(avaliacao: Avaliacao): void {
    this.linhas.push(`AVALIAÇÃO: Nota ${avaliacao.nota}`);
  }

  obterRelatorio(): string {
    return this.linhas.join("\n");
  }
}
