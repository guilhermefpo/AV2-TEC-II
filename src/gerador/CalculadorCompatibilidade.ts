import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Avaliacao from "../entities/Avaliacao.js";
import type Equipe from "../entities/Equipe.js";
import type MembroEquipe from "../entities/MembroEquipe.js";
import { Papel } from "../enum/Papel.js";

export default class CalculadorCompatibilidade implements VisitanteProjeto {
  private pesosPorPapel: Map<Papel, number> = new Map();
  private pontuacaoTotal: number = 0;
  private papelAtual: Papel | null = null;

  visitarProjeto(projeto: Projeto): void {
    this.pesosPorPapel = new Map(
      projeto.papeisObrigatorios.map((p) => [p.papel, p.peso]),
    );
  }

  visitarEquipe(_equipe: Equipe): void {
    // ponto de extensão futuro: penalizar equipe incompleta, por exemplo
  }

  visitarMembroEquipe(membro: MembroEquipe): void {
    this.papelAtual = membro.papel;
  }

  visitarProfissional(profissional: Profissional): void {
    const peso = this.papelAtual
      ? (this.pesosPorPapel.get(this.papelAtual) ?? 1)
      : 1;
    const mediaAvaliacoes =
      profissional.avaliacoes.length > 0
        ? profissional.avaliacoes.reduce((soma, a) => soma + a.nota, 0) /
          profissional.avaliacoes.length
        : 0;
    this.pontuacaoTotal += mediaAvaliacoes * peso;
  }

  visitarAvaliacao(_avaliacao: Avaliacao): void {
    // já considerada em visitarProfissional via média; evita contar duas vezes
  }

  public obterPontuacao(): number {
    return this.pontuacaoTotal;
  }
}
