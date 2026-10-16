import { describe, expect, it } from "vitest";
import ProjetoAnimacao from "../../entities/ProjetoAnimacao.js";
import { Papel } from "../../enum/Papel.js";
import { FabricaAnimacao, FabricaDocumentario, FabricaPublicitario } from "../../factory/FabricasConcretas.js";

const dados = [
  "p1", "animacao", 90, 10000, new Date("2026-12-01"), "animacao", "SP",
  [{ papel: Papel.DIRETOR, peso: 5, competenciasDesejadas: [{ nome: "3d", nivel: 4 }] }],
] as ConstructorParameters<typeof ProjetoAnimacao>;

describe("Prototype e Abstract Factory", () => {
  it("clona profundamente o projeto e preserva o tipo concreto", () => {
    const original = new ProjetoAnimacao(...dados);
    const copia = original.clonar();
    copia.papeisObrigatorios[0]!.competenciasDesejadas[0]!.nivel = 1;

    expect(copia).toBeInstanceOf(ProjetoAnimacao);
    expect(original.papeisObrigatorios[0]!.competenciasDesejadas[0]!.nivel).toBe(4);
  });

  it("cria famílias concretas diferentes sem alterar o orquestrador", () => {
    const fabricas = [new FabricaDocumentario(), new FabricaAnimacao(), new FabricaPublicitario()];
    const projetos = fabricas.map((fabrica) => fabrica.criarProjeto(dados));

    expect(projetos.map((projeto) => projeto.constructor.name)).toEqual([
      "ProjetoDocumentario", "ProjetoAnimacao", "ProjetoPublicitario",
    ]);
    expect(fabricas.every((fabrica) => fabrica.criarValidador())).toBe(true);
    expect(fabricas.every((fabrica) => fabrica.criarNotificador())).toBe(true);
  });
});
