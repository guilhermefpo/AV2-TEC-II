import type RecomendacaoStrategy from "./RecomendacaoStrategy.js";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import Recomendacao from "../entities/Recomendacao.js";

export default class FiltragemColaborativa implements RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Recomendacao {
    return new Recomendacao(projeto.id, []);
  }
}
