import type VisitanteProjeto from "../interface/VisitanteProjeto.ts";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Avaliacao from "../entities/Avaliacao.js";

export default class CalculadorConsistencia implements VisitanteProjeto {
  public ehValido: boolean = true;
  public erros: string[] = [];

  visitarProjeto(projeto: Projeto): void {
    if (projeto.orcamento <= 0) {
      this.ehValido = false;
      this.erros.push("Orçamento do projeto inválido.");
    }
  }

  visitarProfissional(profissional: Profissional): void {
    if (!profissional.disponivel) {
      this.ehValido = false;
      this.erros.push(`Profissional ${profissional.nome} não está disponível.`);
    }
  }

  visitarAvaliacao(avaliacao: Avaliacao): void {}
}
