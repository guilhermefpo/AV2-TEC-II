import { describe, it, expect } from "vitest";
import OrquestradorPadrao from "../../template/OrquestradorPadrao.js";
import EstrategiaCosseno from "../../strategy/EstrategiaCosseno.js";
import FiltragemColaborativa from "../../strategy/FiltragemColaborativa.js";
import RegraBaixoOrcamento from "../../strategy/RegraBaixoOrcamento.js";
import Projeto from "../../entities/Projeto.js";
import Profissional from "../../entities/Profissional.js";
import Avaliacao from "../../entities/Avaliacao.js";
import Competencia from "../../entities/Competencia.js";
import { Papel } from "../../enum/Papel.js";

describe("Troca de estratégia altera o resultado da recomendação", () => {
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
        competenciasDesejadas: [
          new Competencia("roteiro", 5),
          new Competencia("direcao", 5),
        ],
      },
    ],
  );

  const barato = Profissional.criar({
    id: "barato",
    nome: "Barato",
    precoMedio: 100,
    competencias: [
      new Competencia("roteiro", 5),
      new Competencia("direcao", 1),
    ],
    avaliacoes: [new Avaliacao("a1", 2, new Date(), "barato")],
  });

  const caro = Profissional.criar({
    id: "caro",
    nome: "Caro",
    precoMedio: 5000,
    competencias: [
      new Competencia("roteiro", 5),
      new Competencia("direcao", 5),
    ],
    avaliacoes: [new Avaliacao("a2", 5, new Date(), "caro")],
  });

  const primeiroId = (orquestrador: OrquestradorPadrao) =>
    orquestrador.processarRecomendacao(projeto, [barato, caro])[0]!
      .sugestoes[0]!.profissional.id;

  it("cosseno prioriza quem tem o perfil de competências mais parecido", () => {
    expect(primeiroId(new OrquestradorPadrao(new EstrategiaCosseno()))).toBe(
      "caro",
    );
  });

  it("colaborativa prioriza o melhor avaliado", () => {
    expect(
      primeiroId(new OrquestradorPadrao(new FiltragemColaborativa())),
    ).toBe("caro");
  });

  it("baixo orçamento prioriza o mais barato", () => {
    expect(primeiroId(new OrquestradorPadrao(new RegraBaixoOrcamento()))).toBe(
      "barato",
    );
  });

  it("baixo orçamento descarta quem estoura o orçamento do projeto", () => {
    const projetoApertado = new Projeto(
      "p2",
      "ficção",
      100,
      1000,
      new Date(),
      "ficção",
      "SP",
      [{ papel: Papel.DIRETOR, peso: 5, competenciasDesejadas: [] }],
    );
    const orquestrador = new OrquestradorPadrao(new RegraBaixoOrcamento());
    const sugestoes = orquestrador.processarRecomendacao(projetoApertado, [
      barato,
      caro,
    ])[0]!.sugestoes;

    expect(sugestoes.map((s) => s.profissional.id)).toEqual(["barato"]);
  });

  it("estratégias diferentes geram rankings diferentes para os mesmos dados", () => {
    const porCosseno = primeiroId(
      new OrquestradorPadrao(new EstrategiaCosseno()),
    );
    const porBaixoOrcamento = primeiroId(
      new OrquestradorPadrao(new RegraBaixoOrcamento()),
    );

    expect(porCosseno).toBe("caro");
    expect(porBaixoOrcamento).toBe("barato");
    expect(porCosseno).not.toBe(porBaixoOrcamento);
  });
});
