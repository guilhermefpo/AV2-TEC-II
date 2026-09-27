import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import Recomendacao from "../entities/Recomendacao.js";
import { Papel } from "../enum/Papel.js";

export default interface RecomendacaoStrategy {
  recomendar(
    projeto: Projeto,
    papel: Papel,
    profissionaisDisponiveis: Profissional[],
  ): Recomendacao;
}
