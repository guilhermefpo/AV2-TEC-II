import { describe, it, expect } from "vitest";
import OrquestradorPadrao from "../../template/OrquestradorPadrao.js";
import EstrategiaCosseno from "../../strategy/EstrategiaCosseno.js";
import Projeto from "../../entities/Projeto.js";
import { Papel } from "../../enum/Papel.js";

describe("OrquestradorPadrao", () => {
  it("lança erro se orçamento for zero ou negativo", () => {
    const projeto = new Projeto(
      "p1",
      "ficção",
      100,
      0,
      new Date(),
      "ficção",
      "SP",
      [{ papel: Papel.DIRETOR, peso: 5, competenciasDesejadas: [] }],
    );
    const orquestrador = new OrquestradorPadrao(new EstrategiaCosseno());

    expect(() => orquestrador.processarRecomendacao(projeto, [])).toThrow(
      "Orçamento do projeto deve ser maior que zero.",
    );
  });

  it("gera uma recomendação por papel obrigatório", () => {
    const projeto = new Projeto(
      "p1",
      "ficção",
      100,
      10000,
      new Date(),
      "ficção",
      "SP",
      [
        { papel: Papel.DIRETOR, peso: 5, competenciasDesejadas: [] },
        { papel: Papel.EDITOR, peso: 3, competenciasDesejadas: [] },
      ],
    );
    const orquestrador = new OrquestradorPadrao(new EstrategiaCosseno());
    const resultado = orquestrador.processarRecomendacao(projeto, []);

    expect(resultado).toHaveLength(2);
    expect(resultado.map((r) => r.papel)).toEqual([
      Papel.DIRETOR,
      Papel.EDITOR,
    ]);
  });
});
