import { describe, it, expect } from "vitest";
import ValidadorConsistencia from "../../gerador/ValidatorConscistencia.js";
import Projeto from "../../entities/Projeto.js";
import Equipe from "../../entities/Equipe.js";
import MembroEquipe from "../../entities/MembroEquipe.js";
import Profissional from "../../entities/Profissional.js";
import { Papel } from "../../enum/Papel.js";

describe("ValidadorConsistencia", () => {
  it("é inválido quando falta papel obrigatório", () => {
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

    const validador = new ValidadorConsistencia();
    projeto.aceitar(validador);

    expect(validador.ehValido()).toBe(false);
    expect(validador.obterErros()[0]).toContain("DIRETOR");
  });

  it("é válido quando todos os papéis estão preenchidos dentro do orçamento", () => {
    const profissional = Profissional.criar({
      id: "prof1",
      nome: "Ana",
      precoMedio: 1000,
      disponivel: true,
    });
    const equipe = new Equipe("e1", "p1", [
      new MembroEquipe(Papel.DIRETOR, profissional, true),
    ]);
    const projeto = new Projeto(
      "p1",
      "ficção",
      100,
      10000,
      new Date(),
      "ficção",
      "SP",
      [{ papel: Papel.DIRETOR, peso: 5, competenciasDesejadas: [] }],
      equipe,
    );

    const validador = new ValidadorConsistencia();
    projeto.aceitar(validador);

    expect(validador.ehValido()).toBe(true);
    expect(validador.obterErros()).toHaveLength(0);
  });
});
