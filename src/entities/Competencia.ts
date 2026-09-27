export default class Competencia {
  constructor(
    public nome: string,
    public nivel: number,
  ) {}

  toString(): string {
    return `Competencia: ${this.nome} - Nivel: ${this.nivel}`;
  }
}
