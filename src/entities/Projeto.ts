import type { ElementoProjeto } from "../interface/ElementoProjeto.js";
import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import { Papel } from "../enum/Papel.js";
import type Equipe from "./Equipe.js";
import type Competencia from "./Competencia.js";

export interface PapelObrigatorio {
  papel: Papel;
  peso: number;
  competenciasDesejadas: Competencia[];
}

export default class Projeto implements ElementoProjeto {
  constructor(
    public id: string,
    public genero: string,
    public duracao: number,
    public orcamento: number,
    public prazo: Date,
    public tipoCaptacao: string,
    public localizacao: string,
    public papeisObrigatorios: PapelObrigatorio[] = [],
    public equipe?: Equipe,
  ) {}

  public aceitar(visitante: VisitanteProjeto): void {
    visitante.visitarProjeto(this);
    this.equipe?.aceitar(visitante);
  }
}
