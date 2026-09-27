const contadores: Record<string, number> = {};

export function gerarId(prefixo: string): string {
  contadores[prefixo] = (contadores[prefixo] ?? 0) + 1;
  return `${prefixo}${contadores[prefixo]}`;
}
