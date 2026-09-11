import type VisitanteProjeto from "../interface/VisitanteProjeto.ts";

export default class Avaliacao {
  constructor(
    public readonly id: string,
    public nota: number,
    public data: Date,
    public profissionalId: string,
    public avaliadorId?: string,
    public comentario?: string,
  ) {
    if (nota < 0 || nota > 5) {
      throw new Error("A nota da avaliação deve estar entre 0 e 5.");
    }
  }

  public aceitar(visitante: VisitanteProjeto): void {
    visitante.visitarAvaliacao(this);
  }
}
