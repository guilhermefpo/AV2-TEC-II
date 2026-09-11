export default class Competencia {
  constructor(
    public nome: string,
    public nivel: number,
  ) {
    this.nome = nome;
    this.nivel = nivel;
  }

  getNome(): string {
    return this.nome;
  }

  getNivel(): number {
    return this.nivel;
  }

  setNome(nome: string): void {
    this.nome = nome;
  }

  setNivel(nivel: number): void {
    this.nivel = nivel;
  }

  toString(): string {
    return `Competencia: ${this.nome} - Nivel: ${this.nivel}`;
  }
}
