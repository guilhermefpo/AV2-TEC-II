import type VisitanteProjeto from "../visitor/VisitanteProjeto.js";
import type Profissional from "./Profissional.js";

export default class Projeto {
  constructor(
    public id: string,
    public genero: string,
    public duracao: number,
    public orcamento: number,
    public prazo: Date,
    public tipoCaptacao: string,
    public localizacao: string,
    public papeisObrigatorios: string[] = [],
    public equipe: Profissional[] = [],
  ) {}

  public aceitar(visitante: VisitanteProjeto): void {
    visitante.visitarProjeto(this);
    for (const membro of this.equipe) {
      membro.aceitar(visitante);
    }
  }
}
