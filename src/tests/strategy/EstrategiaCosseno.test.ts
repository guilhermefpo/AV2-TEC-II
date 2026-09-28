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
    const profissional = Profissional.criar({
      id: "prof1",
      nome: "Ana",
      competencias: [new Competencia("roteiro", 5)],
      precoMedio: 1000,
      disponivel: true,
    });

    const estrategia = new EstrategiaCosseno();
    const recomendacao = estrategia.recomendar(projeto, Papel.DIRETOR, [
      profissional,
    ]);

    expect(recomendacao.sugestoes[0]!.score).toBeCloseTo(1, 5);
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
    const indisponivel = Profissional.criar({
      id: "prof1",
      nome: "Ana",
      precoMedio: 1000,
      disponivel: false,
    });

    const estrategia = new EstrategiaCosseno();
    const recomendacao = estrategia.recomendar(projeto, Papel.DIRETOR, [
      indisponivel,
    ]);

    expect(recomendacao.sugestoes).toHaveLength(0);
  });
});
