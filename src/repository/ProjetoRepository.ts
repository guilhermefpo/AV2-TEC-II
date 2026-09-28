import { AppDataSource } from "../database/Data-source.js";
import Projeto from "../entities/Projeto.js";

export default class ProjetoRepository {
  private repo = AppDataSource.getRepository(Projeto);

  public async salvar(projeto: Projeto): Promise<void> {
    await this.repo.save(projeto);
  }

  public async buscarPorId(id: string): Promise<Projeto | undefined> {
    const encontrado = await this.repo.findOneBy({ id });
    return encontrado ?? undefined;
  }

  public async listarTodos(): Promise<Projeto[]> {
    return this.repo.find();
  }
}
