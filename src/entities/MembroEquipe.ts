import { Papel } from "../enum/Papel.js";
import type { ElementoProjeto } from "../interface/ElementoProjeto.js";
import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import type Profissional from "./Profissional.js";

export default class MembroEquipe implements ElementoProjeto {
  constructor(
    public papel: Papel,
    public profissional: Profissional,
    public confirmado: boolean = false,
  ) {}

  public aceitar(visitante: VisitanteProjeto): void {
    visitante.visitarMembroEquipe(this);
    this.profissional.aceitar(visitante);
  }

  getPapel(): Papel {
    return this.papel;
  }

  getConfirmado(): boolean {
    return this.confirmado;
  }

  confirmar(): void {
    this.confirmado = true;
  }
}
