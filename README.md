# CineBridge — Microsserviço de Recomendação e Orquestração de Equipes

Atividade prática (ATVI) — Engenharia de Software
Professor: Dr. Eng. Gerson Penha

## Visão geral

O CineBridge é um microsserviço que recebe as especificações de um projeto audiovisual (gênero, orçamento, prazo, papéis técnicos necessários) e recomenda profissionais para compor a equipe, respeitando restrições orçamentárias e de prazo. O sistema também gerencia o ciclo de convites (aceitar/recusar), substituição isolada de membros já confirmados, reavaliação completa da equipe, e permite consultar um relatório de consistência e compatibilidade da equipe formada.

O foco desta entrega é a aplicação consciente de **quatro padrões de projeto** — Strategy, Template Method, Observer e Visitor — dentro de uma arquitetura em camadas com injeção de dependência explícita.

## Stack técnica

| Camada                    | Tecnologia                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| Runtime                   | Node.js (LTS)                                                                                 |
| Linguagem                 | TypeScript (modo estrito)                                                                     |
| Framework HTTP            | Fastify                                                                                       |
| Validação                 | Zod (via `fastify-type-provider-zod`)                                                         |
| Documentação da API       | Swagger/OpenAPI + Scalar (`/docs`)                                                            |
| Testes                    | Vitest + cobertura via `@vitest/coverage-v8`                                                  |
| Persistência (fase atual) | Repositórios em memória (`Map`), preparados para substituição futura por PostgreSQL/ORM       |
| Comunicação interna       | Padrão Observer próprio (substituível por RabbitMQ no futuro sem alterar a lógica de negócio) |

## Como executar

```bash
npm install
npm run dev
```

Servidor: `http://localhost:3333`
Documentação interativa (Scalar): `http://localhost:3333/docs`

> ⚠️ O servidor mantém tudo em memória. Reiniciar o servidor (`Ctrl+C` + `npm run dev`) apaga todos os dados cadastrados e zera os contadores de id (`P1`, `C1`, `E1`...). Isso é esperado nesta fase do projeto.

## Como rodar os testes automatizados

```bash
npm run test            # roda a suíte uma vez
npm run test:watch      # roda em modo observador (reexecuta ao salvar)
npm run test:coverage   # roda com relatório de cobertura
```

**Cobertura atual: 81.15%** (requisito do enunciado: superior a 80%) ✅

A suíte contém 5 arquivos de teste, 10 casos:

- `tests/strategy/EstrategiaCosseno.test.ts` — Strategy
- `tests/template/OrquestradorPadrao.test.ts` — Template Method
- `tests/observer/EmissorRecomendacao.test.ts` — Observer
- `tests/visitor/ValidatorConsistencia.test.ts` — Visitor
- `tests/integration/FluxoCompleto.test.ts` — teste de integração completo via `fastify.inject()`, exercitando rotas, serviços e repositórios de ponta a ponta

## Estrutura de pastas

```
src/
├── entities/       # Entidades de domínio (Projeto, Profissional, Equipe, Convite, etc.)
├── enum/           # Papel.ts — papéis técnicos do projeto
├── interface/      # Contratos do Visitor (ElementoProjeto, VisitanteProjeto)
├── gerador/        # Visitantes concretos (ValidadorConsistencia, GeradorRelatorio, CalculadorCompatibilidade)
├── strategy/       # Padrão Strategy — algoritmos de recomendação
├── template/       # Padrão Template Method — orquestrador de composição de equipe
├── observer/       # Padrão Observer — eventos e notificações
├── repository/     # Repositórios em memória (Profissional, Projeto, Equipe, Convite)
├── service/        # Serviços de aplicação que conectam os padrões
├── routes/         # Rotas HTTP (Fastify)
├── tests/          # Testes unitários e de integração (Vitest)
├── utils/          # Utilitários (gerador de id sequencial para testes manuais)
├── container.ts    # Composition root — instâncias únicas de repositórios/serviços (DI manual)
├── app.ts          # Construção do app Fastify (usado tanto pelo server quanto pelos testes)
└── server.ts       # Bootstrap do servidor HTTP
```

## Padrões de projeto implementados

### 1. Strategy — algoritmos de recomendação

**Local:** `src/strategy/`

- `EstrategiaCosseno` — similaridade de cosseno entre competências desejadas e competências do profissional.
- `FiltragemColaborativa` — ranqueia por média histórica de avaliações.
- `RegraBaixoOrcamento` — prioriza preço baixo dentro do orçamento do projeto.

### 2. Template Method — orquestração da composição de equipe

**Local:** `src/template/`
`OrquestradorEquipe` define o fluxo fixo (`normalizarEntrada → validarRestricoesOrcamentarias → recomendar por papel → posProcessarRecomendacoes`). `OrquestradorPadrao` implementa as etapas variáveis. Também expõe `recomendarUnico`, usado na substituição isolada de um membro.

### 3. Observer — notificações e eventos assíncronos

**Local:** `src/observer/`
`EmissorRecomendacao` (subject) notifica `NotificacaoEmail`, `NotificacaoInterna` e `AuditoriaOperacoes` sempre que uma recomendação é gerada ou um convite é aceito/recusado.

### 4. Visitor — operações transversais sobre a árvore de dados

**Local:** `src/interface/` (contratos) e `src/gerador/` (visitantes concretos)
Percurso cascateado `Projeto → Equipe → MembroEquipe → Profissional → Avaliacao`. Visitantes: `ValidadorConsistencia`, `GeradorRelatorio`, `CalculadorCompatibilidade`.

## Endpoints disponíveis

| Método  | Rota                                     | Descrição                                                            |
| ------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `POST`  | `/profissionais`                         | Cadastra um profissional (id gerado automaticamente)                 |
| `GET`   | `/profissionais`                         | Lista profissionais cadastrados                                      |
| `POST`  | `/projetos/recomendacao`                 | Recebe um projeto, salva-o e gera recomendações para todos os papéis |
| `POST`  | `/projetos/:projetoId/convites`          | Cria um convite para um profissional em um papel                     |
| `PATCH` | `/convites/:conviteId`                   | Profissional aceita ou recusa o convite                              |
| `GET`   | `/projetos/:projetoId/relatorio`         | Relatório de consistência e compatibilidade da equipe (Visitor)      |
| `POST`  | `/projetos/:projetoId/equipe/substituir` | Gera nova recomendação isolada para um papel específico              |
| `POST`  | `/projetos/:projetoId/reavaliar`         | Reavalia a equipe inteira após mudança de orçamento/prazo            |

## Como testar manualmente (passo a passo, na ordem)

Abra `http://localhost:3333/docs` (Scalar). Cada endpoint tem um formulário com campos de **Path Parameters** (quando a rota tem `:algumaCoisa` na URL) separados do campo de **Body** (o JSON do corpo). Preencha os dois quando existirem, e clique no botão de enviar/executar a requisição (não confundir com o exemplo de `curl`, que é só ilustrativo).

Como o servidor guarda tudo em memória, sempre que reiniciar (`npm run dev`), refaça a sequência abaixo desde o passo 1.

### Passo 1 — Cadastrar um profissional

`POST /profissionais`

```json
{
  "nome": "Guilherme Fernando",
  "competencias": [],
  "precoMedio": 0,
  "disponivel": true
}
```

✅ Esperado: status `201`, resposta com `"id": "P1"`.

### Passo 2 — Gerar recomendação para um projeto

`POST /projetos/recomendacao`

```json
{
  "id": "projeto-1",
  "genero": "documentário",
  "duracao": 90,
  "orcamento": 50000,
  "prazo": "2026-12-01",
  "tipoCaptacao": "documentário",
  "localizacao": "São Paulo",
  "papeisObrigatorios": [
    {
      "papel": "DIRETOR",
      "peso": 5,
      "competenciasDesejadas": []
    }
  ]
}
```

✅ Esperado: status `200`, lista com uma recomendação para o papel `DIRETOR`, contendo `"profissionalId": "P1"`.
📋 Confira também o terminal do servidor: devem aparecer as três linhas de notificação do Observer (`[Email]`, `[Mensagem Interna]`, `[Auditoria LOG]`).

### Passo 3 — Criar um convite

`POST /projetos/{projetoId}/convites`

- Path parameter `projetoId`: `projeto-1`
- Body:

```json
{
  "profissionalId": "P1",
  "papel": "DIRETOR"
}
```

✅ Esperado: status `201`, resposta com `"id": "C1"`, `"status": "pendente"`.

### Passo 4 — Aceitar o convite

`PATCH /convites/{conviteId}`

- Path parameter `conviteId`: `C1`
- Body:

```json
{
  "resposta": "aceito"
}
```

✅ Esperado: status `200`, resposta com `"status": "aceito"`. Isso confirma o membro na equipe internamente.

### Passo 5 — Consultar o relatório da equipe (Visitor)

`GET /projetos/{projetoId}/relatorio`

- Path parameter `projetoId`: `projeto-1`
- Sem body

✅ Esperado: status `200`, resposta como:

```json
{
  "relatorio": "PROJETO: projeto-1 - Orçamento: R$50000\nEQUIPE: E1 - Status: em_formacao\n  PAPEL: DIRETOR - Confirmado: sim\n    PROFISSIONAL: Guilherme Fernando - R$0",
  "valido": true,
  "erros": [],
  "pontuacaoCompatibilidade": 0
}
```

### Passo 6 — Substituir um membro (nova rodada isolada por papel)

`POST /projetos/{projetoId}/equipe/substituir`

- Path parameter `projetoId`: `projeto-1`
- Body:

```json
{
  "papel": "DIRETOR"
}
```

✅ Esperado: status `200`, nova recomendação **apenas para o papel DIRETOR**, sem afetar os demais papéis do projeto (demonstra a garantia do Template Method: fluxo fixo, etapas reaproveitadas).

### Passo 7 — Reavaliação completa da equipe

`POST /projetos/{projetoId}/reavaliar`

- Path parameter `projetoId`: `projeto-1`
- Body:

```json
{
  "novoOrcamento": 80000
}
```

✅ Esperado: status `200`, lista de recomendações para **todos** os papéis obrigatórios do projeto, refletindo o novo orçamento salvo internamente.

### Casos de erro (opcional, mas recomendado para avaliação)

- `GET /projetos/projeto-inexistente/relatorio` → deve retornar `404`.
- `POST /projetos/recomendacao` com `orcamento: 0` → o Template Method deve lançar erro de validação orçamentária (visível como erro 500 ou mensagem tratada, dependendo do handler global de erros do Fastify).

## Requisitos não funcionais — status atual

| Requisito do enunciado                              | Status                                                                                          |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Resposta em menos de 2s por recomendação            | Não medido formalmente; endpoint é síncrono e leve (repositório em memória)                     |
| Suporte a 100 requisições simultâneas               | Não testado sob carga                                                                           |
| Algoritmo de recomendação parametrizável            | ✅ Atendido via Strategy                                                                        |
| Logs estruturados para auditoria                    | ✅ Fastify + Pino configurado; Observer também registra eventos de negócio                      |
| Tolerância a falhas do repositório de profissionais | ✅ Parcial — `RecomendacaoService` captura falha na consulta e segue com lista vazia (fallback) |
| Cobertura de testes superior a 80%                  | ✅ Atendido — 81.15% medido via `npm run test:coverage`                                         |

## Pendências conhecidas (próximos passos além desta entrega)

- **Persistência definitiva**: repositórios atuais são em memória; migração para PostgreSQL (via TypeORM/Prisma, conforme especificado no enunciado) ainda não realizada.
- **Fila de mensagens**: comunicação interna via Observer em memória; substituição futura por RabbitMQ não implementada (arquitetura já isola essa dependência via interface).
- **Perfil completo do profissional**: hoje `Profissional` só tem `disponivel: boolean` e `precoMedio: number`; faixa de preço, janela de disponibilidade temporal e localização geográfica ainda não modeladas, o que limita filtros de prazo/localização mencionados no enunciado.
- **Teste de carga/performance**: latência (<2s) e concorrência (100 requisições simultâneas) não foram medidas formalmente.
- **Cobertura de 100%**: alguns arquivos permanecem sem teste direto por não serem exercitados pelo fluxo de integração atual (ex: `FiltragemColaborativa`, `RegraBaixoOrcamento` — estratégias alternativas não usadas no fluxo padrão; `Avaliacao.ts` — entidade não populada nos cenários testados). Não impede o cumprimento da meta de 80%, mas fica registrado como próximo incremento possível.

## Compatibilidade de plataforma

Desenvolvido e testado no Windows. Compatibilidade com Linux Ubuntu 24.04+ e derivados ainda não validada formalmente — como o projeto usa apenas Node.js/TypeScript multiplataforma, não são esperados bloqueios, mas recomenda-se teste explícito antes da entrega final.
DATABASE_URL="postgresql://cinebridge:cinebridge@localhost:5432/cinebridge?schema=public"
