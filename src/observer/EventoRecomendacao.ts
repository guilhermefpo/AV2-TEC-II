export type TipoEvento =
  | "recomendacao_gerada"
  | "convite_aceito"
  | "convite_recusado";

export default class EventoRecomendacao {
  constructor(
    public readonly tipo: TipoEvento,
    public readonly dados: Record<string, unknown>,
  ) {}
}
