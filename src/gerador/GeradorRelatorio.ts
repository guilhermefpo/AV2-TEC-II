import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Avaliacao from "../entities/Avaliacao.js";
import type Equipe from "../entities/Equipe.js";
import type MembroEquipe from "../entities/MembroEquipe.js";

export default class GeradorRelatorio implements VisitanteProjeto {
  private linhas: string[] = [];

  visitarProjeto(projeto: Projeto): void {
    this.linhas.push(
      `PROJETO: ${projeto.id} - Orçamento: R$${projeto.orcamento}`,
    );
  }

  visitarEquipe(equipe: Equipe): void {
    this.linhas.push(`EQUIPE: ${equipe.id} - Status: ${equipe.status}`);
  }

  visitarMembroEquipe(membro: MembroEquipe): void {
    this.linhas.push(
      `  PAPEL: ${membro.papel} - Confirmado: ${membro.confirmado ? "sim" : "não"}`,
    );
  }

  visitarProfissional(profissional: Profissional): void {
    this.linhas.push(
      `    PROFISSIONAL: ${profissional.nome} - R$${profissional.precoMedio}`,
    );
  }

  visitarAvaliacao(avaliacao: Avaliacao): void {
    this.linhas.push(`      AVALIAÇÃO: Nota ${avaliacao.nota}`);
  }

  obterRelatorio(): string {
    return this.linhas.join("\n");
  }
}
