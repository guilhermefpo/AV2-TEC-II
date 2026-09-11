import type RecomendacaoStrategy from "./RecomendacaoStrategy.ts";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import Recomendacao from "../entities/Recomendacao.js";

export default class RegraBaixoOrcamento implements RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Recomendacao {
    // Filtra profissionais com base na restrição orçamentária
    return new Recomendacao(projeto.id, []);
  }
}
