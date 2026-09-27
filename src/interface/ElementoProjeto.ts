import type VisitanteProjeto from "./VisitanteProjeto.js";

export interface ElementoProjeto {
  aceitar(visitante: VisitanteProjeto): void;
}
