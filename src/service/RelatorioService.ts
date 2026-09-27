import type ProjetoRepository from "../repository/ProjetoRepository.js";
import type EquipeRepository from "../repository/EquipeRepository.js";
import ValidadorConsistencia from "../gerador/ValidatorConscistencia.js";
import GeradorRelatorio from "../gerador/GeradorRelatorio.js";
import CalculadorCompatibilidade from "../gerador/CalculadorCompatibilidade.js";

export interface RelatorioResultado {
  relatorio: string;
  valido: boolean;
  erros: string[];
  pontuacaoCompatibilidade: number;
}

export default class RelatorioService {
  constructor(
    private projetoRepository: ProjetoRepository,
    private equipeRepository: EquipeRepository,
  ) {}

  public async gerarRelatorio(projetoId: string): Promise<RelatorioResultado> {
    const projeto = await this.projetoRepository.buscarPorId(projetoId);
    if (!projeto) {
      throw new Error(`Projeto ${projetoId} não encontrado.`);
    }

    const equipe = await this.equipeRepository.buscarPorProjetoId(projetoId);
    projeto.equipe = equipe;

    const geradorRelatorio = new GeradorRelatorio();
    const validador = new ValidadorConsistencia();
    const calculadorCompatibilidade = new CalculadorCompatibilidade();

    projeto.aceitar(geradorRelatorio);
    projeto.aceitar(validador);
    projeto.aceitar(calculadorCompatibilidade);

    return {
      relatorio: geradorRelatorio.obterRelatorio(),
      valido: validador.ehValido(),
      erros: validador.obterErros(),
      pontuacaoCompatibilidade: calculadorCompatibilidade.obterPontuacao(),
    };
  }
}
