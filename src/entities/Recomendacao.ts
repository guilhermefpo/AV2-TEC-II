import type Profissional from "./Profissional.js";

export default class Recomendacao {
  constructor(
    public projetoId: string,
    public profissionaisSugeridos: Profissional[] = [],
    public dataCriacao: Date = new Date(),
  ) {}
}
