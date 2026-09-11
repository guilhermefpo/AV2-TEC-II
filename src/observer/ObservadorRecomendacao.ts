import type EventoRecomendacao from "./EventoRecomendacao.js";

export default interface ObservadorRecomendacao {
  atualizar(evento: EventoRecomendacao): void;
}
