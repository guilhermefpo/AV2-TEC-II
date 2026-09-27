import { describe, it, expect, vi } from "vitest";
import EmissorRecomendacao from "../../observer/EmissorRecomendacao.js";
import EventoRecomendacao from "../../observer/EventoRecomendacao.js";
import type ObservadorRecomendacao from "../../observer/ObservadorRecomendacao.js";

describe("EmissorRecomendacao", () => {
  it("notifica todos os observadores inscritos", () => {
    const emissor = new EmissorRecomendacao();
    const obs1: ObservadorRecomendacao = { atualizar: vi.fn() };
    const obs2: ObservadorRecomendacao = { atualizar: vi.fn() };

    emissor.inscrever(obs1);
    emissor.inscrever(obs2);

    const evento = new EventoRecomendacao("recomendacao_gerada", {
      projetoId: "p1",
    });
    emissor.notificar(evento);

    expect(obs1.atualizar).toHaveBeenCalledWith(evento);
    expect(obs2.atualizar).toHaveBeenCalledWith(evento);
  });

  it("não notifica observador desinscrito", () => {
    const emissor = new EmissorRecomendacao();
    const obs: ObservadorRecomendacao = { atualizar: vi.fn() };

    emissor.inscrever(obs);
    emissor.desinscrever(obs);
    emissor.notificar(new EventoRecomendacao("recomendacao_gerada", {}));

    expect(obs.atualizar).not.toHaveBeenCalled();
  });
});
