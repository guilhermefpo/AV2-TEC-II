import type ObservadorRecomendacao from "./ObservadorRecomendacao.js";
import type EventoRecomendacao from "./EventoRecomendacao.js";

export default class NotificacaoInterna implements ObservadorRecomendacao {
  public atualizar(evento: EventoRecomendacao): void {
    console.log(`[Mensagem Interna] Novo evento recebido: ${evento.tipo}`);
  }
}
