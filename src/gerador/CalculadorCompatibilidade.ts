import type VisitanteProjeto from "../interface/VisitanteProjeto.ts";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Avaliacao from "../entities/Avaliacao.js";

export default class CalculadorCompatibilidade implements VisitanteProjeto {
  public pontuacaoCompatibilidade: number = 0;

  visitarProjeto(projeto: Projeto): void {}

  visitarProfissional(profissional: Profissional): void {
    this.pontuacaoCompatibilidade += 10;
  }

  visitarAvaliacao(avaliacao: Avaliacao): void {
    this.pontuacaoCompatibilidade += avaliacao.nota;
  }
}
