# Pré-Treino Backend

Desafios práticos para exercitar raciocínio lógico e refinar habilidades como desenvolvedor backend.

## 📚 Desafios

| # | Desafio | Foco |
|---|---------|------|
| 01 | Integração API Clientes | HTTP, requisições |
| 02 | Relatório de Vendas | Processamento de dados |
| 03 | Notificação por Email | Fila, retry, templates |
| 04 | Importação CSV | Parsing de arquivos |
| 05 | Monitoramento de Estoque | Alertas, regras de negócio |
| 06 | Webhook Pagamento | Receber e processar eventos |
| 07 | Job Backup Database | Agendamento de tarefas |
| 08 | Cache API Externa | Cache, performance |
| 09 | Processamento de Fila | Filas assíncronas |
| 10 | Dashboard Métricas | Agregação de dados |
| 11 | Validar CPF | Lógica de programação |
| 12 | Autenticação JWT | Segurança, tokens |
| 13 | Database SQLite | Persistência de dados |
| 14 | Upload de Arquivos | Manipulação de arquivos |
| 15 | Rate Limiting | Controle de requisições |
| 16 | WebSocket | Comunicação em tempo real |
| 17 | Validação Zod | Validação de dados |
| 18 | Error Handling | Tratamento de erros |
| 19 | Middleware Chain | Padrões de design |
| 20 | API REST Completa | CRUD completo |
| 21 | Job Scheduler | Agendamento avançado |
| 22 | Autenticação Multi-Tenant | Isolamento de dados |
| 23 | Cache com Redis | Cache distribuído |
| 24 | Fila de Mensageria | Brokers de mensagens |
| 25 | API GraphQL | GraphQL, schemas |
| 26 | RBAC Permissões | Controle de acesso |
| 27 | Logging Monitoramento | Observabilidade |
| 28 | Integração API Externa | Resiliência |
| 29 | Processamento Assíncrono | Workers, concorrência |
| 30 | Segurança API | Proteção de APIs |
| 31 | Microserviços | Arquitetura distribuída |
| 32 | Versionamento de API | Compatibilidade |
| 33 | Event Sourcing | Histórico de estado |
| 34 | CQRS | Commands e Queries |
| 35 | Resilience Patterns | Circuit Breaker, Bulkhead |
| 36 | API Gateway | Roteamento centralizado |
| 37 | Service Mesh | Comunicação distribuída |
| 38 | Distributed Lock | Coordenação de processos |
| 39 | Idempotency | Prevenção de duplicação |
| 40 | Event Driven | Arquitetura orientada a eventos |
| 41 | API Compression | Compressão de dados |
| 42 | Request Validation | Validação de entrada |
| 43 | Response Caching | Cache de respostas |
| 44 | Webhook System | Integrações externas |
| 45 | Notification System | Multi-canal |
| 46 | File Storage | Armazenamento de arquivos |
| 47 | Search Engine | Full-text search |
| 48 | Task Scheduler | Cron jobs |
| 49 | API Monitoring | Métricas e alertas |
| 50 | Load Balancer | Distribuição de carga |

## 🛠️ Tecnologias

- **Runtime:** Deno
- **Linguagem:** TypeScript
- **Padrão:** Projetos independentes

## 🚀 Como Usar

```bash
# Escolha um desafio
cd 03-notificacao-email

# Instale dependências (se houver)
deno task dev

# Execute os testes
deno task test
```

## 📁 Estrutura

Cada desafio contém:
- `README.md` - Instruções e contexto
- `src/index.ts` - Pipeline principal
- `src/*.service.ts` - Serviços para implementar
- `deno.json` - Configuração do projeto
- `data/` - Dados de exemplo (quando aplicável)

---

Desenvolvido para prática de desenvolvimento backend.