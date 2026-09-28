import { AppDataSource } from "../database/Data-source.js";
import Convite from "../entities/Convite.js";
import type { Papel } from "../enum/Papel.js";

export default class ConviteRepository {
  private repo = AppDataSource.getRepository(Convite);

  public async salvar(convite: Convite): Promise<void> {
    await this.repo.save(convite);
  }

  public async buscarPorId(id: string): Promise<Convite | undefined> {
    const encontrado = await this.repo.findOneBy({ id });
    return encontrado ?? undefined;
  }

  public async listarPorProjeto(projetoId: string): Promise<Convite[]> {
    return this.repo.findBy({ projetoId });
  }

  public async listarPendentesPorProjetoEPapel(
    projetoId: string,
    papel: Papel,
  ): Promise<Convite[]> {
    return this.repo.findBy({ projetoId, papel, status: "pendente" });
  }
}
