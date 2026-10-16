import type Projeto from "../entities/Projeto.js";
import type Recomendacao from "../entities/Recomendacao.js";
import type Profissional from "../entities/Profissional.js";
import type FabricaProjeto from "./FabricaProjeto.js";
import OrquestradorPadrao from "../template/OrquestradorPadrao.js";
import EventoRecomendacao from "../observer/EventoRecomendacao.js";

export default class SistemaRecomendacao {
  constructor(private readonly fabrica: FabricaProjeto) {}

  public criarProjeto(dados: ConstructorParameters<typeof Projeto>): Projeto {
    return this.fabrica.criarProjeto(dados);
  }

  public recomendar(
    projeto: Projeto,
    profissionais: Profissional[],
  ): Recomendacao[] {
    const notificador = this.fabrica.criarNotificador();
    const orquestrador = new OrquestradorPadrao(
      this.fabrica.criarRecomendador(),
      this.fabrica,
    );
    const resultado = orquestrador.processarRecomendacao(projeto, profissionais);
    notificador.notificar(new EventoRecomendacao("recomendacao_gerada", {
      projetoId: projeto.id,
      totalPapeis: resultado.length,
    }));
    return resultado;
  }

  public validar(projeto: Projeto): boolean {
    const validador = this.fabrica.criarValidador();
    projeto.aceitar(validador);
    const resultado = validador as VisitanteComResultado;
    return typeof resultado.ehValido === "function"
      ? resultado.ehValido()
      : true;
  }
}

interface VisitanteComResultado {
  ehValido?: () => boolean;
}
