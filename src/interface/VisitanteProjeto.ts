import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import type Avaliacao from "../entities/Avaliacao.js";
import type Equipe from "../entities/Equipe.js";
import type MembroEquipe from "../entities/MembroEquipe.js";

export default interface VisitanteProjeto {
  visitarProjeto(projeto: Projeto): void;
  visitarProfissional(profissional: Profissional): void;
  visitarAvaliacao(avaliacao: Avaliacao): void;
  visitarEquipe(equipe: Equipe): void;
  visitarMembroEquipe(membro: MembroEquipe): void;
}
