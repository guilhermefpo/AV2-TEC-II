import type VisitanteProjeto from "../interface/VisitanteProjeto.js";
import type Profissional from "../entities/Profissional.js";
import type Projeto from "../entities/Projeto.js";

export default class ValorConscistencia {
  visitarProjeto(Projeto: Projeto): boolean {
    return true;
  }
  visitarProjetoProfissional(Profissional: Profissional): boolean {
    return true;
  }
}
