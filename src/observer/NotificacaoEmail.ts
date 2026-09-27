import type ObservadorRecomendacao from "./ObservadorRecomendacao.js";
import type EventoRecomendacao from "./EventoRecomendacao.js";

export default class NotificacaoEmail implements ObservadorRecomendacao {
  atualizar(evento: EventoRecomendacao): void {
    console.log(`[Email] Processando evento: ${evento.tipo}`);
  }
}
