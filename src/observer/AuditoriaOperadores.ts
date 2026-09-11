import type ObservadorRecomendacao from "./ObservadorRecomendacao.js";
import type EventoRecomendacao from "./EventoRecomendacao.js";

export default class AuditoriaOperacoes implements ObservadorRecomendacao {
  public atualizar(evento: EventoRecomendacao): void {
    console.log(`[Auditoria LOG] Registro salvo para o evento: ${evento.tipo}`);
  }
}
