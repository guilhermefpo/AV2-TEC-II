import type { ElementoProjeto } from "../interface/ElementoProjeto.js";
import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import type MembroEquipe from "./MembroEquipe.js";
import { Papel } from "../enum/Papel.js";

export type StatusEquipe = "em_formacao" | "completa" | "em_revisao";

export default class Equipe implements ElementoProjeto {
  constructor(
    public id: string,
    public projetoId: string,
    public membros: MembroEquipe[] = [],
    public dataFormacao: Date = new Date(),
    public status: StatusEquipe = "em_formacao",
  ) {}

  public aceitar(visitante: VisitanteProjeto): void {
    visitante.visitarEquipe(this);
    for (const membro of this.membros) {
      membro.aceitar(visitante);
    }
  }

  public substituirMembro(papel: Papel, novoMembro: MembroEquipe): void {
    const index = this.membros.findIndex((m) => m.papel === papel);
    if (index === -1) {
      this.membros.push(novoMembro);
      return;
    }
    this.membros[index] = novoMembro;
    this.status = "em_revisao";
  }

  public todosConfirmados(): boolean {
    return this.membros.every((m) => m.confirmado);
  }
}
