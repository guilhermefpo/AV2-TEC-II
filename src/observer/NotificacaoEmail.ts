import type ObservadorRecomendacao from "./ObservadorRecomendacao.js";
import type EventoRecomendacao from "./EventoRecomendacao.js";

export class NotificacaoEmail implements ObservadorRecomendacao {
  atualizar(evento: EventoRecomendacao): void {
    console.log(`[Email] Processando evento: ${evento.tipo}`);
  }
}

export class NotificacaoInterna implements ObservadorRecomendacao {
  atualizar(evento: EventoRecomendacao): void {
    console.log(`[Mensagem Interna] Processando evento: ${evento.tipo}`);
  }
}

export class AuditoriaOperacoes implements ObservadorRecomendacao {
  atualizar(evento: EventoRecomendacao): void {
    console.log(`[Auditoria] Log registrado para evento: ${evento.tipo}`);
  }
}
