import type VisitanteProjeto from "../interface/VisitanteProjeto.js";

export interface ElementoProjeto {
  aceitar(visitante: VisitanteProjeto): void;
}
