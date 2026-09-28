import ProfissionalRepository from "./repository/ProfissionalRepository.js";
import EquipeRepository from "./repository/EquipeRepository.js";
import ConviteRepository from "./repository/ConviteRepository.js";
import ProjetoRepository from "./repository/ProjetoRepository.js";
import EmissorRecomendacao from "./observer/EmissorRecomendacao.js";
import NotificacaoEmail from "./observer/NotificacaoEmail.js";
import NotificacaoInterna from "./observer/NotificacaoInterna.js";
import AuditoriaOperacoes from "./observer/AuditoriaOperadores.js";
import OrquestradorPadrao from "./template/OrquestradorPadrao.js";
import EstrategiaCosseno from "./strategy/EstrategiaCosseno.js";
import FiltragemColaborativa from "./strategy/FiltragemColaborativa.js";
import RegraBaixoOrcamento from "./strategy/RegraBaixoOrcamento.js";
import RecomendacaoService from "./service/RecomendacaoService.js";
import ConviteService from "./service/ConviteService.js";
import RelatorioService from "./service/RelatorioService.js";

export const profissionalRepository = new ProfissionalRepository();
export const equipeRepository = new EquipeRepository(profissionalRepository);
export const conviteRepository = new ConviteRepository();
export const projetoRepository = new ProjetoRepository();

export const emissor = new EmissorRecomendacao();
emissor.inscrever(new NotificacaoEmail());
emissor.inscrever(new NotificacaoInterna());
emissor.inscrever(new AuditoriaOperacoes());

export const orquestradores = {
  cosseno: new OrquestradorPadrao(new EstrategiaCosseno()),
  colaborativa: new OrquestradorPadrao(new FiltragemColaborativa()),
  baixo_orcamento: new OrquestradorPadrao(new RegraBaixoOrcamento()),
};

export const orquestrador = orquestradores.cosseno;

export const recomendacaoService = new RecomendacaoService(
  profissionalRepository,
  orquestrador,
  emissor,
  projetoRepository,
);

export const conviteService = new ConviteService(
  conviteRepository,
  equipeRepository,
  profissionalRepository,
  emissor,
);

export const relatorioService = new RelatorioService(
  projetoRepository,
  equipeRepository,
);
