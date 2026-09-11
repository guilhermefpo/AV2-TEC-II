import { Papel } from "../enum/Papel.js";

export default class MembroEquipe {
  constructor(
    public papel: Papel,
    public confirmado: boolean,
  ) {
    this.papel = papel;
    this.confirmado = confirmado;
  }

  getPapel(): Papel {
    return this.papel;
  }

  getConfirmado(): boolean {
    return this.confirmado;
  }

  setPapel(papel: Papel): void {
    this.papel = papel;
  }
}
