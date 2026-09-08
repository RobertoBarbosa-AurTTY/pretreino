# Desafio 3: Notificação por Email

## 🎯 Objetivo

Criar um serviço de envio de emails com fila, retry e templates.

## 📋 Contexto Real

O sistema precisa enviar emails transacionais:
- Confirmação de cadastro
- Notificação de pedido
- Lembrete de pagamento

## 📐 Requisitos

- [ ] Criar sistema de fila de envio
- [ ] Implementar retry com backoff exponencial
- [ ] Usar templates HTML para emails
- [ ] Log de status de envio
- [ ] Tratar falhas e notificar admin

## 🗂️ Estrutura dos Dados

```typescript
interface Email {
  id: string;
  para: string;
  assunto: string;
  template: string;
  dados: Record<string, unknown>;
  status: "pendente" | "enviado" | "falha";
  tentativas: number;
}

interface ResultadoEnvio {
  success: boolean;
  emailId: string;
  erro?: string;
}
```

## 💡 Exemplo de Uso

```typescript
const email: Email = {
  id: "123",
  para: "cliente@email.com",
  assunto: "Confirmação de Pedido",
  template: "confirmacao-pedido",
  dados: { nome: "João", pedido: "456" },
  status: "pendente",
  tentativas: 0
};

await enfileirarEmail(email);
await processarFila();
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

- Use `setTimeout` para delay entre tentativas
- Implemente limite de tentativas
- Considere usar fila em memória ou Redis
- Valide email antes de enviar

---

**Dica:** Backoff exponencial: 1s, 2s, 4s, 8s... entre cada tentativa.
