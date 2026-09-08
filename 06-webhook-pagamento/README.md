# Desafio 6: Webhook de Pagamento

## 🎯 Objetivo

Criar um serviço que recebe e processa webhooks de pagamento de provedores como Stripe, PagSeguro.

## 📋 Contexto Real

O sistema precisa processar notificações de pagamento:
- Receber webhook do gateway de pagamento
- Validar assinatura do webhook
- Processar pagamento
- Atualizar pedido
- Notificar cliente

## 📐 Requisitos

- [ ] Receber requisição POST com dados do pagamento
- [ ] Validar assinatura HMAC
- [ ] Processar diferentes eventos (pago, falhou, reembolsado)
- [ ] Atualizar status do pedido
- [ ] Retornar status HTTP adequado

## 🗂️ Estrutura dos Dados

```typescript
interface WebhookPagamento {
  evento: "pagamento.pago" | "pagamento.falhou" | "pagamento.reembolsado";
  dados: {
    pagamentoId: string;
    pedidoId: string;
    valor: number;
    metodo: string;
    data: string;
  };
  assinatura: string;
}

interface ResultadoProcessamento {
  success: boolean;
  mensagem: string;
  pedidoAtualizado?: string;
}
```

## 💡 Exemplo de Uso

```typescript
// Receber webhook
const resultado = await processarWebhook(webhook);

if (resultado.success) {
  return new Response("OK", { status: 200 });
} else {
  return new Response("Erro", { status: 400 });
}
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

- Sempre validar assinatura antes de processar
- Implementar idempotência (evitar processar duas vezes)
- Log detalhado para auditoria
- Responder rapidamente ao webhook (< 5s)

---

**Dica:** Webhooks podem ser reenviados. Implemente verificação de duplicatas.
