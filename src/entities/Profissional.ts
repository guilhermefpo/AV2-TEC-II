import { Entity, PrimaryColumn, Column } from "typeorm";
import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import Avaliacao from "./Avaliacao.js";
import Competencia from "./Competencia.js";

@Entity("profissionais")
export default class Profissional {
  @PrimaryColumn({ type: "varchar" })
  id: string = "";

  @Column({ type: "varchar" })
  nome: string = "";

  @Column({ type: "simple-json", default: "[]" })
  competencias: Competencia[] = [];

  @Column({ type: "simple-json", default: "[]" })
  avaliacoes: Avaliacao[] = [];

  @Column({ type: "float", default: 0 })
  precoMedio: number = 0;

  @Column({ type: "boolean", default: true })
  disponivel: boolean = true;

  public static criar(dados: {
    id: string;
    nome: string;
    competencias?: Competencia[];
    avaliacoes?: Avaliacao[];
    precoMedio?: number;
    disponivel?: boolean;
  }): Profissional {
    const profissional = new Profissional();
    profissional.id = dados.id;
    profissional.nome = dados.nome;
    profissional.competencias = dados.competencias ?? [];
    profissional.avaliacoes = dados.avaliacoes ?? [];
    profissional.precoMedio = dados.precoMedio ?? 0;
    profissional.disponivel = dados.disponivel ?? true;
    return profissional;
  }

  public aceitar(visitante: VisitanteProjeto): void {
    visitante.visitarProfissional(this);
    for (const avaliacao of this.avaliacoes) {
      const instancia = Object.assign(new Avaliacao(), avaliacao);
      instancia.aceitar(visitante);
    }
  }
}
