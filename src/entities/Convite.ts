import { Entity, PrimaryColumn, Column } from "typeorm";
import { Papel } from "../enum/Papel.js";

export type StatusConvite = "pendente" | "aceito" | "recusado";

@Entity("convites")
export default class Convite {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  projetoId: string;

  @Column({ type: "varchar" })
  profissionalId: string;

  @Column({ type: "varchar" })
  papel: Papel;

  @Column({ type: "varchar", default: "pendente" })
  status: StatusConvite;

  @Column({ type: "timestamp" })
  dataEnvio: Date;

  @Column({ type: "timestamp", nullable: true })
  dataResposta?: Date | undefined;

  constructor(
    id: string = "",
    projetoId: string = "",
    profissionalId: string = "",
    papel: Papel = Papel.DIRETOR,
    status: StatusConvite = "pendente",
    dataEnvio: Date = new Date(),
    dataResposta?: Date | undefined,
  ) {
    this.id = id;
    this.projetoId = projetoId;
    this.profissionalId = profissionalId;
    this.papel = papel;
    this.status = status;
    this.dataEnvio = dataEnvio;
    this.dataResposta = dataResposta;
  }

  public aceitar(): void {
    this.status = "aceito";
    this.dataResposta = new Date();
  }

  public recusar(): void {
    this.status = "recusado";
    this.dataResposta = new Date();
  }
}
