import { Papel } from "../enum/Papel.js";
import type Profissional from "./Profissional.js";

export interface SugestaoProfissional {
  profissional: Profissional;
  score: number;
}

export default class Recomendacao {
  constructor(
    public projetoId: string,
    public papel: Papel,
    public sugestoes: SugestaoProfissional[] = [],
    public dataCriacao: Date = new Date(),
  ) {}

  public melhorSugestao(): SugestaoProfissional | undefined {
    return [...this.sugestoes].sort((a, b) => b.score - a.score)[0];
  }
}
