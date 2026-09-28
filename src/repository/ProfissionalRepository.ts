import { AppDataSource } from "../database/Data-source.js";
import Profissional from "../entities/Profissional.js";

export default class ProfissionalRepository {
  private repo = AppDataSource.getRepository(Profissional);

  public async salvar(profissional: Profissional): Promise<void> {
    await this.repo.save(profissional);
  }

  public async buscarPorId(id: string): Promise<Profissional | undefined> {
    const encontrado = await this.repo.findOneBy({ id });
    return encontrado ?? undefined;
  }

  public async listarTodos(): Promise<Profissional[]> {
    return this.repo.find();
  }

  public async listarDisponiveis(): Promise<Profissional[]> {
    return this.repo.findBy({ disponivel: true });
  }
}
