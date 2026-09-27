import type Profissional from "../entities/Profissional.js";

export default class ProfissionalRepository {
  private profissionais: Map<string, Profissional> = new Map();

  public async salvar(profissional: Profissional): Promise<void> {
    this.profissionais.set(profissional.id, profissional);
  }

  public async buscarPorId(id: string): Promise<Profissional | undefined> {
    return this.profissionais.get(id);
  }

  public async listarTodos(): Promise<Profissional[]> {
    return Array.from(this.profissionais.values());
  }

  public async listarDisponiveis(): Promise<Profissional[]> {
    const todos = await this.listarTodos();
    return todos.filter((p) => p.disponivel);
  }
}
