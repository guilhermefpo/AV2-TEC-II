import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Recomendacao from "../entities/Recomendacao.js";

export default interface RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Recomendacao;
}
