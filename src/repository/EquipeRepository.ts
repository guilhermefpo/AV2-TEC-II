import Equipe from "../entities/Equipe.js";
import { gerarId } from "../utils/GeradorID.js";

export default class EquipeRepository {
  private equipes: Map<string, Equipe> = new Map();

  public async salvar(equipe: Equipe): Promise<void> {
    this.equipes.set(equipe.id, equipe);
  }

  public async buscarPorId(id: string): Promise<Equipe | undefined> {
    return this.equipes.get(id);
  }

  public async buscarPorProjetoId(
    projetoId: string,
  ): Promise<Equipe | undefined> {
    return Array.from(this.equipes.values()).find(
      (e) => e.projetoId === projetoId,
    );
  }

  public async obterOuCriar(projetoId: string): Promise<Equipe> {
    const existente = await this.buscarPorProjetoId(projetoId);
    if (existente) return existente;

    const nova = new Equipe(
      gerarId("E"),
      projetoId,
      [],
      new Date(),
      "em_formacao",
    );
    await this.salvar(nova);
    return nova;
  }
}
