import { Papel } from "../enum/Papel.js";

export type StatusConvite = "pendente" | "aceito" | "recusado";

export default class Convite {
  constructor(
    public id: string,
    public projetoId: string,
    public profissionalId: string,
    public papel: Papel,
    public status: StatusConvite = "pendente",
    public dataEnvio: Date = new Date(),
    public dataResposta?: Date,
  ) {}

  public aceitar(): void {
    this.status = "aceito";
    this.dataResposta = new Date();
  }

  public recusar(): void {
    this.status = "recusado";
    this.dataResposta = new Date();
  }
}
