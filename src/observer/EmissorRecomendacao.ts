import type ObservadorRecomendacao from "./ObservadorRecomendacao.js";
import type EventoRecomendacao from "./EventoRecomendacao.js";

export default class EmissorRecomendacao {
  private observadores: ObservadorRecomendacao[] = [];

  public inscrever(obs: ObservadorRecomendacao): void {
    this.observadores.push(obs);
  }

  public desinscrever(obs: ObservadorRecomendacao): void {
    this.observadores = this.observadores.filter((o) => o !== obs);
  }

  public notificar(evento: EventoRecomendacao): void {
    for (const obs of this.observadores) {
      obs.atualizar(evento);
    }
  }
}
