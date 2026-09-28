export default class Competencia {
  constructor(
    public nome: string = "",
    public nivel: number = 0,
  ) {}

  toString(): string {
    return `Competencia: ${this.nome} - Nivel: ${this.nivel}`;
  }
}
