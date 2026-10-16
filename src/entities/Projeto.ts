import { Entity, PrimaryColumn, Column } from "typeorm";
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

@Entity("projetos")
export default class Projeto implements ElementoProjeto {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  genero: string;

  @Column({ type: "int" })
  duracao: number;

  @Column({ type: "float" })
  orcamento: number;

  @Column({ type: "timestamp" })
  prazo: Date;

  @Column({ type: "varchar" })
  tipoCaptacao: string;

  @Column({ type: "varchar" })
  localizacao: string;

  @Column({ type: "simple-json", default: "[]" })
  papeisObrigatorios: PapelObrigatorio[];

  equipe?: Equipe | undefined;

  constructor(
    id: string = "",
    genero: string = "",
    duracao: number = 0,
    orcamento: number = 0,
    prazo: Date = new Date(),
    tipoCaptacao: string = "",
    localizacao: string = "",
    papeisObrigatorios: PapelObrigatorio[] = [],
    equipe?: Equipe | undefined,
  ) {
    this.id = id;
    this.genero = genero;
    this.duracao = duracao;
    this.orcamento = orcamento;
    this.prazo = prazo;
    this.tipoCaptacao = tipoCaptacao;
    this.localizacao = localizacao;
    this.papeisObrigatorios = papeisObrigatorios;
    this.equipe = equipe;
  }

  public aceitar(visitante: VisitanteProjeto): void {
    visitante.visitarProjeto(this);
    this.equipe?.aceitar(visitante);
  }

  public clonar(): Projeto {
    return new Projeto(
      this.id,
      this.genero,
      this.duracao,
      this.orcamento,
      new Date(this.prazo),
      this.tipoCaptacao,
      this.localizacao,
      this.papeisObrigatorios.map((papel) => ({
        papel: papel.papel,
        peso: papel.peso,
        competenciasDesejadas: papel.competenciasDesejadas.map(
          (competencia) => ({ ...competencia }),
        ),
      })),
    );
  }
}
