# Pré-Treino Backend

Desafios práticos em **Deno + TypeScript** para exercitar raciocínio lógico e
refinar habilidades de desenvolvimento backend, do `fetch` básico até padrões de
sistemas distribuídos.

Cada desafio vem **sem resposta**: as funções lançam
`throw new Error("Not implemented")` e seu trabalho é implementá-las seguindo os
requisitos do README do desafio.

## 🚀 Começando

Pré-requisito:
[Deno 2](https://docs.deno.com/runtime/getting_started/installation/) e, no VS
Code, a extensão recomendada `denoland.vscode-deno`.

```bash
cd 01-integracao-api-clientes
cp .env.example .env     # configure as variáveis do desafio
# implemente as funções em src/*.service.ts
deno task dev            # rode o desafio
```

Na raiz:

```bash
deno task check  # checagem de tipos em todo o repositório
```

## 🔌 Mock API

Os desafios que fazem requisições HTTP usam a API hospedada em
**https://api-mock-98te.onrender.com** (exige login com Bearer token).
Endpoints, credenciais de teste e modelos estão em **[API.md](./API.md)**.

> A primeira requisição depois de um tempo parada pode levar 30–60 s (plano
> gratuito do Render).

## 🧠 Trilha de Fundamentos

Antes (ou junto) dos desafios, a pasta [`fundamentos/`](./fundamentos/) ensina
**como o JavaScript funciona por dentro**, reimplementando o que você usa todo
dia. Cada exercício tem explicação, funções para implementar, um `index.ts` que
mostra "esperado vs obtido" e uma seção **🔮 Preveja antes de rodar**.

| #   | Exercício                                                        | Você implementa                                                     | Dificuldade |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------- | :---------: |
| F01 | [Event Loop](./fundamentos/01-event-loop/)                       | ordem de execução, microtasks vs macrotasks                         |     ⭐      |
| F02 | [Promises do Zero](./fundamentos/02-promises-do-zero/)           | `MyPromise` com `then`, `all`, `race`, `allSettled`, `any`          |   ⭐⭐⭐    |
| F03 | [Closures](./fundamentos/03-closures/)                           | `once`, `memoize`, `debounce`, `throttle`, `curry`                  |     ⭐      |
| F04 | [this e bind](./fundamentos/04-this-bind/)                       | `myCall`, `myApply`, `myBind`                                       |    ⭐⭐     |
| F05 | [Protótipos](./fundamentos/05-prototipos/)                       | `Object.create`, `instanceof` e `new` na mão                        |    ⭐⭐     |
| F06 | [Iterators e Generators](./fundamentos/06-iterators-generators/) | `range`, `take`, `map` preguiçosos, paginação com `async function*` |    ⭐⭐     |
| F07 | [Proxy e Reflect](./fundamentos/07-proxy-reflect/)               | objeto reativo, `readonly`, validação automática                    |   ⭐⭐⭐    |
| F08 | [Memória e GC](./fundamentos/08-memoria-gc/)                     | caches com `WeakMap`/`WeakRef`, medir e achar vazamentos            |   ⭐⭐⭐    |
| F09 | [Estruturas de Dados](./fundamentos/09-estruturas-de-dados/)     | `LRUCache`, `PriorityQueue` (heap), `Trie`                          |    ⭐⭐     |
| F10 | [Event Emitter](./fundamentos/10-event-emitter/)                 | `EventEmitter` tipado, `once`, `waitFor` com timeout                |    ⭐⭐     |

Sugestão de ordem: F01 → F03 → F04 → F05 → F02 → F06 → F10 → F09 → F07 → F08.

## 📚 Desafios

| #  | Desafio                                                      | Foco                            | Dificuldade |
| -- | ------------------------------------------------------------ | ------------------------------- | :---------: |
| 01 | [Integração API Clientes](./01-integracao-api-clientes/)     | HTTP, requisições               |     ⭐      |
| 02 | [Relatório de Vendas](./02-relatorio-vendas/)                | Processamento de dados          |     ⭐      |
| 03 | [Notificação por Email](./03-notificacao-email/)             | Fila, retry, templates          |     ⭐      |
| 04 | [Importação CSV](./04-importacao-csv/)                       | Parsing de arquivos             |     ⭐      |
| 05 | [Monitoramento de Estoque](./05-monitoramento-estoque/)      | Alertas, regras de negócio      |     ⭐      |
| 06 | [Webhook Pagamento](./06-webhook-pagamento/)                 | Receber e processar eventos     |     ⭐      |
| 07 | [Job Backup Database](./07-job-backup-database/)             | Agendamento de tarefas          |    ⭐⭐     |
| 08 | [Cache API Externa](./08-cache-api-externa/)                 | Cache, performance              |    ⭐⭐     |
| 09 | [Processamento de Fila](./09-processamento-fila/)            | Filas assíncronas               |    ⭐⭐     |
| 10 | [Dashboard Métricas](./10-dashboard-metricas/)               | Agregação de dados              |    ⭐⭐     |
| 11 | [Validar CPF](./11-validar-cpf/)                             | Lógica de programação           |     ⭐      |
| 12 | [Autenticação JWT](./12-autenticacao-jwt/)                   | Segurança, tokens               |    ⭐⭐     |
| 13 | [Database SQLite](./13-database-sqlite/)                     | Persistência de dados           |    ⭐⭐     |
| 14 | [Upload de Arquivos](./14-upload-arquivos/)                  | Manipulação de arquivos         |    ⭐⭐     |
| 15 | [Rate Limiting](./15-rate-limiting/)                         | Controle de requisições         |    ⭐⭐     |
| 16 | [WebSocket](./16-websocket/)                                 | Comunicação em tempo real       |    ⭐⭐     |
| 17 | [Validação Zod](./17-validacao-zod/)                         | Validação de dados              |    ⭐⭐     |
| 18 | [Error Handling](./18-error-handling/)                       | Tratamento de erros             |    ⭐⭐     |
| 19 | [Middleware Chain](./19-middleware-chain/)                   | Padrões de design               |    ⭐⭐     |
| 20 | [API REST Completa](./20-api-rest-completa/)                 | CRUD completo                   |    ⭐⭐     |
| 21 | [Job Scheduler](./21-job-scheduler/)                         | Agendamento avançado            |    ⭐⭐     |
| 22 | [Autenticação Multi-Tenant](./22-autenticacao-multi-tenant/) | Isolamento de dados             |    ⭐⭐     |
| 23 | [Cache com Redis](./23-cache-redis/)                         | Cache distribuído               |    ⭐⭐     |
| 24 | [Fila de Mensageria](./24-fila-mensageria/)                  | Brokers de mensagens            |    ⭐⭐     |
| 25 | [API GraphQL](./25-graphql-api/)                             | GraphQL, schemas                |    ⭐⭐     |
| 26 | [RBAC Permissões](./26-rbac-permissoes/)                     | Controle de acesso              |    ⭐⭐     |
| 27 | [Logging Monitoramento](./27-logging-monitoramento/)         | Observabilidade                 |    ⭐⭐     |
| 28 | [Integração API Externa](./28-integracao-api-externa/)       | Resiliência                     |    ⭐⭐     |
| 29 | [Processamento Assíncrono](./29-processamento-assincrono/)   | Workers, concorrência           |    ⭐⭐     |
| 30 | [Segurança API](./30-seguranca-api/)                         | Proteção de APIs                |    ⭐⭐     |
| 31 | [Microserviços](./31-microservicos/)                         | Arquitetura distribuída         |   ⭐⭐⭐    |
| 32 | [Versionamento de API](./32-api-versionamento/)              | Compatibilidade                 |    ⭐⭐     |
| 33 | [Event Sourcing](./33-event-sourcing/)                       | Histórico de estado             |    ⭐⭐     |
| 34 | [CQRS](./34-cqrs/)                                           | Commands e Queries              |    ⭐⭐     |
| 35 | [Resilience Patterns](./35-resilience-patterns/)             | Circuit Breaker, Bulkhead       |   ⭐⭐⭐    |
| 36 | [API Gateway](./36-api-gateway/)                             | Roteamento centralizado         |   ⭐⭐⭐    |
| 37 | [Service Mesh](./37-service-mesh/)                           | Comunicação distribuída         |   ⭐⭐⭐    |
| 38 | [Distributed Lock](./38-distributed-lock/)                   | Coordenação de processos        |   ⭐⭐⭐    |
| 39 | [Idempotency](./39-idempotency/)                             | Prevenção de duplicação         |    ⭐⭐     |
| 40 | [Event Driven](./40-event-driven/)                           | Arquitetura orientada a eventos |   ⭐⭐⭐    |
| 41 | [API Compression](./41-api-compression/)                     | Compressão de dados             |   ⭐⭐⭐    |
| 42 | [Request Validation](./42-request-validation/)               | Validação de entrada            |   ⭐⭐⭐    |
| 43 | [Response Caching](./43-response-caching/)                   | Cache de respostas              |   ⭐⭐⭐    |
| 44 | [Webhook System](./44-webhook-system/)                       | Integrações externas            |   ⭐⭐⭐    |
| 45 | [Notification System](./45-notification-system/)             | Multi-canal                     |   ⭐⭐⭐    |
| 46 | [File Storage](./46-file-storage/)                           | Armazenamento de arquivos       |   ⭐⭐⭐    |
| 47 | [Search Engine](./47-search-engine/)                         | Full-text search                |   ⭐⭐⭐    |
| 48 | [Task Scheduler](./48-task-scheduler/)                       | Cron jobs                       |   ⭐⭐⭐    |
| 49 | [API Monitoring](./49-api-monitoring/)                       | Métricas e alertas              |   ⭐⭐⭐    |
| 50 | [Load Balancer](./50-load-balancer/)                         | Distribuição de carga           |   ⭐⭐⭐    |

## 📁 Estrutura de um desafio

```
NN-nome-do-desafio/
├── README.md                    # objetivo, requisitos, dados, conceitos
├── .env.example                 # variáveis de ambiente (copie para .env)
├── deno.json                    # task: dev
├── src/
│   ├── index.ts                 # pipeline / servidor principal
│   └── *.service.ts             # funções para implementar
└── data/                        # dados de exemplo (quando aplicável)
```

Configuração compartilhada (`compilerOptions`, fmt e lint) fica no
[`deno.json`](./deno.json) da raiz, que é um _workspace_ com todos os desafios.

## 🧭 Fluxo de estudo sugerido

Mantenha a `main` sempre com os desafios **zerados** e resolva cada um numa
branch:

```bash
git switch -c solucao/01
# ... resolve, commita ...
git switch main          # volta para os desafios em branco
```

Assim você nunca perde uma solução e pode refazer um desafio do zero quando
quiser.
