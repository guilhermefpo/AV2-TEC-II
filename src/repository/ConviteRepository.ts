import Convite from "../entities/Convite.js";

export default class ConviteRepository {
  private convites: Map<string, Convite> = new Map();

  public async salvar(convite: Convite): Promise<void> {
    this.convites.set(convite.id, convite);
  }

  public async buscarPorId(id: string): Promise<Convite | undefined> {
    return this.convites.get(id);
  }

  public async listarPorProjeto(projetoId: string): Promise<Convite[]> {
    return Array.from(this.convites.values()).filter(
      (c) => c.projetoId === projetoId,
    );
  }

  public async listarPendentesPorProjetoEPapel(
    projetoId: string,
    papel: string,
  ): Promise<Convite[]> {
    const doProjeto = await this.listarPorProjeto(projetoId);
    return doProjeto.filter(
      (c) => c.papel === papel && c.status === "pendente",
    );
  }
}
