import FabricaProjetoBase from "./FabricaProjetoBase.js";
import ProjetoDocumentario from "../entities/ProjetoDocumentario.js";
import ProjetoAnimacao from "../entities/ProjetoAnimacao.js";
import ProjetoPublicitario from "../entities/ProjetoPublicitario.js";
import EstrategiaCosseno from "../strategy/EstrategiaCosseno.js";
import FiltragemColaborativa from "../strategy/FiltragemColaborativa.js";
import RegraBaixoOrcamento from "../strategy/RegraBaixoOrcamento.js";

export class FabricaDocumentario extends FabricaProjetoBase {
  constructor() { super(ProjetoDocumentario, new EstrategiaCosseno()); }
}
export class FabricaAnimacao extends FabricaProjetoBase {
  constructor() { super(ProjetoAnimacao, new FiltragemColaborativa()); }
}
export class FabricaPublicitario extends FabricaProjetoBase {
  constructor() { super(ProjetoPublicitario, new RegraBaixoOrcamento()); }
}
