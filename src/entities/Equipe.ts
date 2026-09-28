import { Entity, PrimaryColumn, Column } from "typeorm";
import type { ElementoProjeto } from "../interface/ElementoProjeto.js";
import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import MembroEquipe from "./MembroEquipe.js";
import { Papel } from "../enum/Papel.js";

export type StatusEquipe = "em_formacao" | "completa" | "em_revisao";

export interface MembroPersistido {
  papel: Papel;
  profissionalId: string;
  confirmado: boolean;
}

@Entity("equipes")
export default class Equipe implements ElementoProjeto {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  projetoId: string;

  @Column({ type: "simple-json", default: "[]" })
  membrosPersistidos: MembroPersistido[];

  @Column({ type: "timestamp" })
  dataFormacao: Date;

  @Column({ type: "varchar" })
  status: StatusEquipe;

  membros: MembroEquipe[];

  constructor(
    id: string = "",
    projetoId: string = "",
    membros: MembroEquipe[] = [],
    dataFormacao: Date = new Date(),
    status: StatusEquipe = "em_formacao",
  ) {
    this.id = id;
    this.projetoId = projetoId;
    this.membros = membros;
    this.membrosPersistidos = [];
    this.dataFormacao = dataFormacao;
    this.status = status;
  }

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
