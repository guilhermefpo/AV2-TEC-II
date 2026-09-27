import type RecomendacaoStrategy from "./RecomendacaoStrategy.js";
import type Projeto from "../entities/Projeto.js";
import type Profissional from "../entities/Profissional.js";
import Recomendacao, {
  type SugestaoProfissional,
} from "../entities/Recomendacao.js";
import { Papel } from "../enum/Papel.js";

function similaridadeCosseno(a: number[], b: number[]): number {
  const produtoEscalar = a.reduce(
    (soma, val, i) => soma + val * (b[i] ?? 0),
    0,
  );
  const normaA = Math.sqrt(a.reduce((soma, val) => soma + val * val, 0));
  const normaB = Math.sqrt(b.reduce((soma, val) => soma + val * val, 0));
  if (normaA === 0 || normaB === 0) return 0;
  return produtoEscalar / (normaA * normaB);
}

export default class EstrategiaCosseno implements RecomendacaoStrategy {
  recomendar(
    projeto: Projeto,
    papel: Papel,
    profissionaisDisponiveis: Profissional[],
  ): Recomendacao {
    const papelInfo = projeto.papeisObrigatorios.find((p) => p.papel === papel);
    const vetorDesejado = papelInfo?.competenciasDesejadas ?? [];
    const nomesDesejados = vetorDesejado.map((c) => c.nome);
    const vetorAlvo = vetorDesejado.map((c) => c.nivel);

    const sugestoes: SugestaoProfissional[] = profissionaisDisponiveis
      .filter((p) => p.disponivel)
      .map((profissional) => {
        const vetorProfissional = nomesDesejados.map((nome) => {
          const comp = profissional.competencias.find((c) => c.nome === nome);
          return comp?.nivel ?? 0;
        });
        const score = similaridadeCosseno(vetorAlvo, vetorProfissional);
        return { profissional, score };
      })
      .sort((a, b) => b.score - a.score);

    return new Recomendacao(projeto.id, papel, sugestoes);
  }
}
