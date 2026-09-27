import { describe, it, expect } from "vitest";
import EstrategiaCosseno from "../../strategy/EstrategiaCosseno.js";
import Projeto from "../../entities/Projeto.js";
import Profissional from "../../entities/Profissional.js";
import Competencia from "../../entities/Competencia.js";
import { Papel } from "../../enum/Papel.js";

describe("EstrategiaCosseno", () => {
  it("dá score alto quando as competências batem exatamente", () => {
    const projeto = new Projeto(
      "p1",
      "ficção",
      100,
      10000,
      new Date(),
      "ficção",
      "SP",
      [
        {
          papel: Papel.DIRETOR,
          peso: 5,
          competenciasDesejadas: [new Competencia("roteiro", 5)],
        },
      ],
    );
    const profissional = new Profissional(
      "prof1",
      "Ana",
      [new Competencia("roteiro", 5)],
      [],
      1000,
      true,
    );

    const estrategia = new EstrategiaCosseno();
    const recomendacao = estrategia.recomendar(projeto, Papel.DIRETOR, [
      profissional,
    ]);

    const primeira = recomendacao.sugestoes[0];
    expect(primeira).toBeDefined();
    expect(primeira?.score).toBeCloseTo(1, 5);
  });

  it("não recomenda profissional indisponível", () => {
    const projeto = new Projeto(
      "p1",
      "ficção",
      100,
      10000,
      new Date(),
      "ficção",
      "SP",
      [{ papel: Papel.DIRETOR, peso: 5, competenciasDesejadas: [] }],
    );
    const indisponivel = new Profissional("prof1", "Ana", [], [], 1000, false);

    const estrategia = new EstrategiaCosseno();
    const recomendacao = estrategia.recomendar(projeto, Papel.DIRETOR, [
      indisponivel,
    ]);

    expect(recomendacao.sugestoes).toHaveLength(0);
  });
});
