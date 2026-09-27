import type Projeto from "../entities/Projeto.js";

export default class ProjetoRepository {
  private projetos: Map<string, Projeto> = new Map();

  public async salvar(projeto: Projeto): Promise<void> {
    this.projetos.set(projeto.id, projeto);
  }

  public async buscarPorId(id: string): Promise<Projeto | undefined> {
    return this.projetos.get(id);
  }

  public async listarTodos(): Promise<Projeto[]> {
    return Array.from(this.projetos.values());
  }
}
