import type Projeto from "../entities/Projeto.js";
import type Recomendacao from "../entities/Recomendacao.js";
import type OrquestradorEquipe from "../template/OrquestradorEquipe.js";
import EmissorRecomendacao from "../observer/EmissorRecomendacao.js";
import EventoRecomendacao from "../observer/EventoRecomendacao.js";
import type ProfissionalRepository from "../repository/ProfissionalRepository.js";
import type ProjetoRepository from "../repository/ProjetoRepository.js";
import type { Papel } from "../enum/Papel.js";
import type Profissional from "../entities/Profissional.js";

export default class RecomendacaoService {
  constructor(
    private repository: ProfissionalRepository,
    private orquestrador: OrquestradorEquipe,
    private emissor: EmissorRecomendacao,
    private projetoRepository: ProjetoRepository,
  ) {}

  public async gerarRecomendacoes(projeto: Projeto): Promise<Recomendacao[]> {
    let profissionaisDisponiveis: Profissional[];

    try {
      profissionaisDisponiveis = await this.repository.listarDisponiveis();
    } catch (erro) {
      profissionaisDisponiveis = [];
    }

    const recomendacoes = this.orquestrador.processarRecomendacao(
      projeto,
      profissionaisDisponiveis,
    );

    this.emissor.notificar(
      new EventoRecomendacao("recomendacao_gerada", {
        projetoId: projeto.id,
        totalPapeis: recomendacoes.length,
      }),
    );

    return recomendacoes;
  }

  public async recomendarParaPapel(
    projetoId: string,
    papel: Papel,
  ): Promise<Recomendacao> {
    const projeto = await this.projetoRepository.buscarPorId(projetoId);
    if (!projeto) {
      throw new Error(`Projeto ${projetoId} não encontrado.`);
    }

    const papelExiste = projeto.papeisObrigatorios.some(
      (p) => p.papel === papel,
    );
    if (!papelExiste) {
      throw new Error(`Papel ${papel} não é obrigatório neste projeto.`);
    }

    let profissionaisDisponiveis: Profissional[];
    try {
      profissionaisDisponiveis = await this.repository.listarDisponiveis();
    } catch (erro) {
      profissionaisDisponiveis = [];
    }

    const recomendacao = this.orquestrador.recomendarUnico(
      projeto,
      papel,
      profissionaisDisponiveis,
    );

    this.emissor.notificar(
      new EventoRecomendacao("recomendacao_gerada", {
        projetoId,
        papel,
        mensagem: "Nova rodada de recomendação para papel substituído.",
      }),
    );

    return recomendacao;
  }

  public async reavaliarCompleta(
    projetoId: string,
    novoOrcamento?: number,
    novoPrazo?: Date,
  ): Promise<Recomendacao[]> {
    const projeto = await this.projetoRepository.buscarPorId(projetoId);
    if (!projeto) {
      throw new Error(`Projeto ${projetoId} não encontrado.`);
    }

    if (novoOrcamento !== undefined) {
      projeto.orcamento = novoOrcamento;
    }
    if (novoPrazo !== undefined) {
      projeto.prazo = novoPrazo;
    }
    await this.projetoRepository.salvar(projeto);

    const recomendacoes = await this.gerarRecomendacoes(projeto);

    this.emissor.notificar(
      new EventoRecomendacao("recomendacao_gerada", {
        projetoId,
        mensagem: "Reavaliação completa da equipe solicitada pelo produtor.",
      }),
    );

    return recomendacoes;
  }
}
