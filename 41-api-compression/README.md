# Desafio 41: API Compression

## 🎯 Objetivo

Implementar compressão de responses para reduzir tamanho de dados trafegados.

## 📋 Contexto Real

Performance de rede:
- Reduzir latência
- Economizar bandwidth
- Melhorar experiência do usuário

## 📐 Requisitos

- [ ] Implementar gzip/deflate
- [ ] Detectar suporte do cliente
- [ ] Comprimir responses grandes
- [ ] Cache de respostas comprimidas
- [ ] Métricas de compressão

## 🗂️ Estrutura dos Dados

```typescript
interface CompressionConfig {
  enabled: boolean;
  threshold: number;
  algorithms: ("gzip" | "deflate" | "br")[];
}

interface CompressionResult {
  data: Uint8Array;
  algorithm: string;
  originalSize: number;
  compressedSize: number;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Verifique Accept-Encoding do cliente
- Não comprima respostas pequenas
- Considere Brotli para melhor compressão

---

**Dica:** Comprima apenas se o ganho for significativo (>1KB).