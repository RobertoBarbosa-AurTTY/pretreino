# Desafio 38: Distributed Lock

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um serviço de lock (bloqueio) com dono, expiração automática (TTL) e
retry com backoff, garantindo que apenas um processo por vez trabalhe em um
recurso compartilhado.

## 📋 Contexto Real

Recursos compartilhados precisam de sincronização:

- Processamento de pagamentos (não cobrar duas vezes)
- Atualização de estoque
- Jobs agendados rodando em várias instâncias

## 📐 Requisitos

Tudo fica em `src/lock.service.ts`. O lock roda em memória, mas a API imita a de
um lock distribuído (Redis/Redlock).

**`createLock(options)` → `acquire(resource, owner)`**

- [ ] Recurso livre (ou com lock expirado) → `{ success: true, lock }`, com
      `acquiredAt` = agora e `expiresAt` = agora + `options.timeout` (ISO 8601)
- [ ] O mesmo `owner` adquirindo de novo **renova** o lock (novo `expiresAt`) e
      retorna sucesso
- [ ] Recurso com lock de outro dono → tenta de novo até `options.retries`
      vezes, esperando `retryDelay * 2^(n-1)` ms antes da tentativa `n` (100,
      200, 400… para `retryDelay = 100`)
- [ ] Se continuar ocupado após as tentativas → `{ success: false, error }` (não
      lança exceção; `lock` fica `undefined`)
- [ ] Aquisições concorrentes (`Promise.all`) do mesmo recurso: exatamente uma
      tem sucesso
- [ ] Recursos diferentes são independentes

**`release(resource, owner)`**

- [ ] Só o dono atual libera: retorna `true`; outro dono ou recurso sem lock →
      `false` (e o lock continua)

**`isLocked(resource)`**

- [ ] `true` enquanto existe lock não expirado; `false` a partir de `expiresAt`

## 🗂️ Estrutura dos Dados

```typescript
export interface Lock {
  resource: string;
  owner: string;
  acquiredAt: string;
  expiresAt: string;
}

export interface LockOptions {
  timeout: number;
  retries: number;
  retryDelay: number;
}

export interface LockResult {
  success: boolean;
  lock?: Lock;
  error?: string;
}

export interface DistributedLock {
  acquire(resource: string, owner: string): Promise<LockResult>;
  release(resource: string, owner: string): Promise<boolean>;
  isLocked(resource: string): boolean;
}
```

## 💡 Exemplo de Uso

```typescript
import { createLock } from "./lock.service.ts";

const lock = createLock({ timeout: 30_000, retries: 3, retryDelay: 100 });

const result = await lock.acquire("pedido:123", "worker-1");
if (result.success) {
  try {
    // processa o pedido com exclusividade
  } finally {
    await lock.release("pedido:123", "worker-1");
  }
} else {
  console.log("Recurso ocupado:", result.error);
}
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [How to do distributed locking (Martin Kleppmann)](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
- [Deno KV: transações atômicas](https://docs.deno.com/deploy/kv/manual/transactions/)
- [Date.now() (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
- [setTimeout (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout)

## 📝 Notas

- Em JavaScript, código síncrono entre dois `await` é atômico: faça o "verificar
  e gravar" do lock sem `await` no meio
- Nunca confie em locks sem TTL — processos podem morrer segurando o lock
- Extras: `extend(resource, owner)` para renovar sem readquirir; detecção de
  deadlock (grafo de espera entre donos); versão com Redis ou Deno KV
  (`atomic().check()`)
