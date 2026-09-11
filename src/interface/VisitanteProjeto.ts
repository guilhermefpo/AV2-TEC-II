import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Avaliacao from "../entities/Avaliacao.js";

export default interface VisitanteProjeto {
  visitarProjeto(projeto: Projeto): void;
  visitarProfissional(profissional: Profissional): void;
  visitarAvaliacao(avaliacao: Avaliacao): void;
}
