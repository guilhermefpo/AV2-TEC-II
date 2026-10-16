# CineBridge

API para recomendar e formar equipes audiovisuais. Node.js, TypeScript estrito, Fastify, PostgreSQL e TypeORM. Não há interface gráfica; a documentação interativa da API fica em `/docs`.

Atividades práticas (ATVI e ATVII) — Engenharia de Software. Professor: Dr. Eng. Gerson Penha.

O projeto implementa o microsserviço de recomendação e orquestração de equipes da
plataforma CineBridge. A AV1 utiliza Strategy, Template Method, Observer e Visitor.
A AV2 acrescenta Prototype, Factory Method e Abstract Factory, mantendo o fluxo original.

## Executar

Com o Docker Desktop aberto, execute no PowerShell, na pasta do projeto:

```powershell
npm install
docker compose up -d
npm run dev
```

O PostgreSQL 16 sobe em `localhost:5432` (usuário, senha e banco `cinebridge`, definidos em `docker-compose.yml` e `src/database/data-source.ts`). As tabelas `profissionais`, `projetos`, `equipes` e `convites` são criadas automaticamente na primeira conexão (`synchronize: true`), então não há migração nem seed. O banco começa vazio: cadastre profissionais antes de pedir recomendações.

A API fica em `http://localhost:3333` e a documentação em `http://localhost:3333/docs`. Os dados persistem entre reinícios do servidor. Para apagar tudo e recomeçar: `docker compose down -v`.

No Ubuntu, os comandos são os mesmos (`npm install`, `docker compose up -d`, `npm run dev`). É necessário Node.js LTS e Docker com Compose.

## Testes

```bash
docker compose up -d
npm test
npm run test:coverage
```

- `npm test`: roda toda a suíte. Os testes de integração usam o PostgreSQL real, então o Docker precisa estar de pé.
- `npm run test:watch`: reexecuta os testes a cada alteração.
- `npm run test:coverage`: relatório de cobertura no terminal e em `coverage/index.html`.

Última medição: **20 testes em 7 arquivos, 89.41% de cobertura** (meta do enunciado: acima de 80%).

| Arquivo                                             | Tipo       | Demonstra                                                               |
| --------------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| `tests/strategy/EstrategiaCosseno.test.ts`          | Unitário   | Similaridade de cosseno e exclusão de indisponíveis                     |
| `tests/strategy/TrocaEstrategia.test.ts`            | Unitário   | A troca de estratégia altera o ranking para os mesmos dados             |
| `tests/template/OrquestradorPadrao.test.ts`         | Unitário   | Fluxo fixo: validação orçamentária e uma recomendação por papel         |
| `tests/observer/EmissorRecomendacao.test.ts`        | Unitário   | Observadores notificados de forma independente e inscrição/cancelamento |
| `tests/visitor/ValidatorConsistencia.test.ts`       | Unitário   | Validação de papéis e orçamento sem alterar as classes de domínio       |
| `tests/integration/FluxoCompleto.test.ts`           | Integração | Cadastro → recomendação → convite → aceite → relatório                  |
| `tests/integration/SubstituicaoReavaliacao.test.ts` | Integração | Substituição por papel, reavaliação e erros 404                         |

Os testes de integração gravam no mesmo banco usado no desenvolvimento e não limpam os registros ao terminar.

## API

| Método | Rota                                     | Ação                                                                 |
| ------ | ---------------------------------------- | -------------------------------------------------------------------- |
| POST   | `/profissionais`                         | Cadastra profissional (id gerado: `P1`, `P2`...)                     |
| GET    | `/profissionais`                         | Lista profissionais                                                  |
| POST   | `/projetos/recomendacao`                 | Salva o projeto e recomenda profissionais para cada papel            |
| POST   | `/projetos/:projetoId/convites`          | Convida um profissional para um papel (id `C1`, `C2`...)             |
| PATCH  | `/convites/:conviteId`                   | Registra aceite ou recusa do profissional                            |
| GET    | `/projetos/:projetoId/relatorio`         | Relatório, validação de consistência e compatibilidade               |
| POST   | `/projetos/:projetoId/equipe/substituir` | Nova rodada de recomendação só para um papel                         |
| POST   | `/projetos/:projetoId/reavaliar`         | Atualiza orçamento/prazo e refaz as recomendações de todos os papéis |

Exemplo completo no PowerShell (com o servidor rodando):

```powershell
$prof = Invoke-RestMethod -Method Post -Uri http://localhost:3333/profissionais -ContentType 'application/json' -Body '{"nome":"Ana","precoMedio":500}'
$prof.id

$projeto = @{
  id = 'projeto-1'
  genero = 'documentario'
  duracao = 90
  orcamento = 50000
  prazo = '2026-12-01'
  tipoCaptacao = 'documentario'
  localizacao = 'Sao Paulo'
  estrategia = 'cosseno'
  papeisObrigatorios = @(@{ papel = 'DIRETOR'; peso = 5; competenciasDesejadas = @() })
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri http://localhost:3333/projetos/recomendacao -ContentType 'application/json' -Body $projeto

$convite = Invoke-RestMethod -Method Post -Uri http://localhost:3333/projetos/projeto-1/convites -ContentType 'application/json' -Body ('{"profissionalId":"' + $prof.id + '","papel":"DIRETOR"}')
Invoke-RestMethod -Method Patch -Uri "http://localhost:3333/convites/$($convite.id)" -ContentType 'application/json' -Body '{"resposta":"aceito"}'
Invoke-RestMethod http://localhost:3333/projetos/projeto-1/relatorio
```

Outros corpos de requisição:

```json
{ "estrategia": "colaborativa" }
{ "estrategia": "baixo_orcamento" }
{ "resposta": "recusado" }
{ "papel": "DIRETOR" }
{ "novoOrcamento": 80000 }
```

- `estrategia` vai no corpo de `POST /projetos/recomendacao` e aceita `cosseno` (padrão), `colaborativa` ou `baixo_orcamento`.
- `resposta` vai em `PATCH /convites/:conviteId` e aceita `aceito` ou `recusado`.
- `papel` vai em `POST /projetos/:projetoId/equipe/substituir`. Os papéis válidos são `DIRETOR`, `DIRETOR_FOTOGRAFIA`, `SONOPLASTA`, `EDITOR`, `ROTEIRISTA` e `EFEITOS_VISUAIS`.
- `novoOrcamento` e `novoPrazo` (ambos opcionais) vão em `POST /projetos/:projetoId/reavaliar`.

Entradas que não respeitam o schema retornam 400 (validação Zod). Projeto ou papel inexistente nas rotas de relatório, substituição e reavaliação retorna 404. Nas rotas de convite, um profissional ou convite inexistente ainda resulta em erro 500 sem mensagem tratada (ver limitações).

## Organização e padrões

```
src/
  entities/       Projeto, Profissional, Equipe, MembroEquipe, Convite, Avaliacao, Competencia, Recomendacao
  enum/           Papel
  interface/      contratos do Visitor
  gerador/        visitantes concretos
  strategy/       algoritmos de recomendação
  template/       orquestrador de composição de equipe
  observer/       eventos e notificadores
  repository/     acesso ao banco (TypeORM)
  service/        casos de uso
  routes/         rotas Fastify com validação Zod
  database/       DataSource do TypeORM
  tests/          testes unitários e de integração
  utils/          gerador de ids sequenciais
  factory/        fábricas de projetos e sistema de recomendação
  container.ts    composition root (injeção de dependência)
  ---
  raiz:
  app.ts          montagem do Fastify, usada pelo servidor e pelos testes
  server.ts       conecta ao banco e sobe o HTTP
```

| Padrão          | Implementação                                                                         | Demonstração                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Strategy        | `EstrategiaCosseno`, `FiltragemColaborativa`, `RegraBaixoOrcamento`                   | A troca de estratégia altera o ranking (`TrocaEstrategia.test.ts`)                                                |
| Template Method | `OrquestradorEquipe` (abstrato) e `OrquestradorPadrao`                                | Normalizar → validar orçamento → recomendar por papel → pós-processar; o método principal não é sobrescrito       |
| Observer        | `EmissorRecomendacao`, `NotificacaoEmail`, `NotificacaoInterna`, `AuditoriaOperacoes` | Cada observador reage sozinho ao mesmo evento                                                                     |
| Visitor         | `ValidadorConsistencia`, `CalculadorCompatibilidade`, `GeradorRelatorio`              | Operações diferentes sobre `Projeto → Equipe → MembroEquipe → Profissional → Avaliacao` sem alterar essas classes |
| Prototype       | `Projeto.clonar()` e subclasses de projeto                                             | Clonagem profunda de projetos e seus papéis/competências |
| Factory Method  | `FabricaProjetoBase.criarProjeto()`                                                     | Criação de projetos especializados sem duplicar o fluxo da aplicação |
| Abstract Factory| `FabricaProjeto` e fábricas concretas                                                   | Criação coordenada de projeto, validador, estratégia e notificador |

As dependências são fornecidas por construtor e montadas uma única vez em `container.ts`. O mapa `orquestradores` do container guarda um orquestrador para cada estratégia, e a rota escolhe o orquestrador conforme o campo `estrategia` da requisição.

Na AV2, a rota também seleciona a fábrica conforme o gênero informado: gêneros que
contêm `anim` usam `FabricaAnimacao`, gêneros que contêm `public` usam
`FabricaPublicitario` e os demais usam `FabricaDocumentario`. A fachada
`SistemaRecomendacao` coordena a criação dos objetos da família.

Profissionais, projetos, equipes e convites têm tabela própria no PostgreSQL. Competências, avaliações, papéis obrigatórios e os membros da equipe são gravados como JSON dentro dessas tabelas. Ao carregar uma equipe, o repositório reconstrói cada membro buscando o profissional completo pelo id.

## Regras adotadas

- Os papéis do projeto vêm do enum `Papel`. Cada papel obrigatório tem um peso e uma lista de competências desejadas com nível.
- A recomendação é feita por papel: para cada papel obrigatório a estratégia ranqueia os profissionais disponíveis. O resultado é uma lista de sugestões com pontuação para cada papel.
- **Cosseno:** compara o vetor de competências desejadas para o papel com o vetor do profissional. Competências que o profissional não tem contam como zero.
- **Colaborativa:** pontua pela média das avaliações históricas do profissional.
- **Baixo orçamento:** descarta quem cobra mais que o orçamento total e prioriza a menor fatia do orçamento, usando a média de avaliações como desempate.
- Profissionais indisponíveis nunca são recomendados.
- Um orçamento menor ou igual a zero é rejeitado pelo orquestrador.
- Ao aceitar um convite, o profissional vira membro confirmado da equipe do projeto. A equipe é criada no primeiro aceite (id `E1`, `E2`...). Se já existir membro no mesmo papel, ele é substituído e a equipe passa para `em_revisao`.
- O relatório roda três visitantes sobre o projeto e a equipe. O validador verifica se todos os papéis obrigatórios estão preenchidos, se o custo acumulado cabe no orçamento e se nenhum membro está indisponível. A compatibilidade soma, para cada membro, a média das avaliações multiplicada pelo peso do papel.
- A substituição de um papel gera uma nova recomendação apenas para ele, sem alterar os demais. A reavaliação atualiza orçamento e prazo do projeto salvo e recalcula todos os papéis.
- Tolerância a falhas: se a leitura de profissionais falhar, o serviço segue com lista vazia em vez de derrubar a requisição.

## Notificações e eventos

Os eventos são `recomendacao_gerada`, `convite_aceito` e `convite_recusado`. Um único emissor notifica os três observadores, e o campo `tipo` do evento indica o que aconteceu. As reações são síncronas e em memória: os observadores escrevem uma linha no console do servidor. Não há envio real de e-mail, nem tabela de auditoria ou de notificações.

Os logs HTTP estruturados vêm do Pino, já embutido no Fastify.

## Requisitos não funcionais

| Requisito                                            | Situação                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| Algoritmo parametrizável                             | Atendido: estratégia escolhida por requisição                |
| Logs estruturados                                    | Parcial: Pino para HTTP e console para os eventos de negócio |
| Tolerância a falhas do repositório de profissionais  | Parcial: lista vazia como fallback                           |
| Cobertura de testes acima de 80%                     | Atendido: 89.41%                                             |
| Latência abaixo de 2 s e 100 requisições simultâneas | Não medido                                                   |
| Windows 10+ e Ubuntu 24.04+                          | Desenvolvido e testado no Windows; Ubuntu não validado       |

## Limitações

- Recusar um convite emite o evento `convite_recusado`, mas não dispara nova recomendação automática. O produtor usa o endpoint de substituição.
- O endpoint de substituição só devolve novas sugestões para o papel. Quem escolhe e convida o substituto é o produtor, pelas rotas de convite.
- Os ids `P1`, `C1` e `E1` vêm de contadores em memória que reiniciam a cada execução do servidor. Depois de reiniciar, um novo cadastro pode reutilizar um id já gravado no banco e sobrescrevê-lo. Para uma demonstração limpa, reinicie também o banco com `docker compose down -v`.
- Erros nas rotas de convite (profissional ou convite inexistente) resultam em resposta 500 genérica.
- Não há `RabbitMQ`, autenticação, migrações, seed, teste de carga nem envio real de e-mail.
- O modelo de profissional tem `precoMedio` e `disponivel`. Faixa de preço, janela de disponibilidade e localização não são modeladas, então a estratégia de baixo orçamento e o filtro de disponibilidade são simples.
- As credenciais do banco estão no código, para uso local de desenvolvimento.
- Os testes de integração acumulam registros no banco.
- A seleção das fábricas por gênero usa uma convenção simples baseada no nome do gênero;
  novos tipos devem receber uma fábrica e uma regra explícita de seleção.
- A suíte de testes exige PostgreSQL disponível e as dependências instaladas com `npm install`.
