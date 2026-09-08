# Desafio 1: Integração API de Clientes

## 🎯 Objetivo

Criar um serviço que consome uma API de clientes, filtra por status e gera
relatório.

## 📋 Contexto Real

Você recebeu uma tarefa do time de negócios:

- Buscar lista de clientes em uma API externa
- Filtrar apenas clientes ativos
- Salvar em arquivo JSON para processamento posterior

## 📐 Requisitos

- [ ] Consumir API REST com `fetch()`
- [ ] Tratar erros de rede e HTTP
- [ ] Filtrar clientes por `status === "ativo"`
- [ ] Salvar resultado em arquivo JSON
- [ ] Implementar retry em caso de falha

## 🗂️ Estrutura dos Dados

```typescript
interface Cliente {
  id: string;
  nome: string;
  email: string;
  status: "ativo" | "inativo" | "pendente";
  dataCadastro: string;
}
```

## 💡 Exemplo de Uso

```typescript
const clientes = await buscarClientes();
const clientesAtivos = clientes.filter((c) => c.status === "ativo");
await salvarEmArquivo(clientesAtivos, "clientes-ativos.json");
```

## ⚙️ Setup

```bash
deno task dev
```

## 🧪 Testes

```bash
deno task test
```

## 📝 Notas

- Use try/catch para tratar erros
- Implemente timeout na requisição
- Valide a resposta da API antes de processar
- Log de erros para debugging

---

**Dica:** Sempre trate erros em chamadas de API. Uma requisição pode falhar por
timeout, rede, ou erro do servidor.
