import type VisitanteProjeto from "../interface/VisitanteProjeto.ts";
import type Avaliacao from "./Avaliacao.js";
import type Competencia from "./Competencia.js";

export default class Profissional {
  constructor(
    public id: string,
    public nome: string,
    public competencias: Competencia[] = [],
    public avaliacoes: Avaliacao[] = [],
    public precoMedio: number = 0,
    public disponivel: boolean = true,
  ) {}

  public aceitar(visitante: VisitanteProjeto): void {
    visitante.visitarProfissional(this);
    for (const avaliacao of this.avaliacoes) {
      avaliacao.aceitar(visitante);
    }
  }
}
