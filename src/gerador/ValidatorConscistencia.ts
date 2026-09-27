import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Avaliacao from "../entities/Avaliacao.js";
import type Equipe from "../entities/Equipe.js";
import type MembroEquipe from "../entities/MembroEquipe.js";
import { Papel } from "../enum/Papel.js";

export default class ValidadorConsistencia implements VisitanteProjeto {
  private papeisObrigatorios: Papel[] = [];
  private orcamentoDisponivel: number = 0;
  private papeisPreenchidos: Set<Papel> = new Set();
  private custoAcumulado: number = 0;
  private erros: string[] = [];

  visitarProjeto(projeto: Projeto): void {
    this.papeisObrigatorios = projeto.papeisObrigatorios.map((p) => p.papel);
    this.orcamentoDisponivel = projeto.orcamento;
    if (projeto.orcamento <= 0) {
      this.erros.push("Orçamento do projeto inválido.");
    }
  }

  visitarEquipe(_equipe: Equipe): void {}

  visitarMembroEquipe(membro: MembroEquipe): void {
    this.papeisPreenchidos.add(membro.papel);
  }

  visitarProfissional(profissional: Profissional): void {
    this.custoAcumulado += profissional.precoMedio;
    if (!profissional.disponivel) {
      this.erros.push(`Profissional ${profissional.nome} não está disponível.`);
    }
  }

  visitarAvaliacao(_avaliacao: Avaliacao): void {}

  public ehValido(): boolean {
    const papeisFaltando = this.papeisObrigatorios.filter(
      (p) => !this.papeisPreenchidos.has(p),
    );
    if (papeisFaltando.length > 0) {
      this.erros.push(
        `Papéis obrigatórios não preenchidos: ${papeisFaltando.join(", ")}`,
      );
    }
    if (this.custoAcumulado > this.orcamentoDisponivel) {
      this.erros.push(
        `Orçamento excedido: custo R$${this.custoAcumulado} > orçamento R$${this.orcamentoDisponivel}`,
      );
    }
    return this.erros.length === 0;
  }

  public obterErros(): string[] {
    return this.erros;
  }
}
