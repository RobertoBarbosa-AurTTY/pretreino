# Desafio 41: API Compression

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar compressão de respostas HTTP (gzip/deflate) para reduzir o volume de
dados trafegados, negociando o algoritmo com o cliente via `Accept-Encoding`.

## 📋 Contexto Real

Respostas JSON grandes (listagens, relatórios) custam banda e tempo de rede.
Comprimir essas respostas:

- Reduz latência percebida pelo usuário
- Economiza bandwidth (e dinheiro, em clouds que cobram tráfego)
- Precisa ser feito com critério: comprimir respostas pequenas gasta CPU à toa

## 📐 Requisitos

- [ ] `compress(data, algorithm)` comprime com `"gzip"` ou `"deflate"` e retorna
      `CompressionResult` com `algorithm`, `originalSize` (bytes de entrada),
      `compressedSize` (igual a `data.byteLength` do resultado) e `data`
- [ ] `decompress(data, algorithm)` desfaz `compress`: o round-trip devolve
      exatamente os bytes originais
- [ ] Algoritmo desconhecido (ex: `"zstd"`) → `compress`/`decompress` lançam
      `Error` cuja mensagem contém `"Unsupported algorithm"`
- [ ] `negotiateEncoding(acceptEncoding, supported?)` lê o header
      `Accept-Encoding` e retorna o algoritmo suportado com maior `q` (padrão
      `q=1`); em empate, vale a ordem do header
- [ ] `negotiateEncoding` ignora algoritmos fora de `supported` (padrão
      `["gzip", "deflate"]`) e entradas com `q=0`; retorna `null` se nada servir
      (ex: header vazio ou `"identity"`)
- [ ] `shouldCompress(size, config)` retorna `true` somente se `config.enabled`
      for `true` e `size >= config.threshold`
- [ ] `src/index.ts`: servidor HTTP na porta `PORT` que usa as funções acima
      (com `threshold = COMPRESSION_THRESHOLD`) para comprimir as respostas e
      define os headers `Content-Encoding` e `Vary: Accept-Encoding`

## 🗂️ Estrutura dos Dados

```typescript
type CompressionAlgorithm = "gzip" | "deflate" | "br";

interface CompressionConfig {
  enabled: boolean;
  threshold: number;
  algorithms: CompressionAlgorithm[];
}

interface CompressionResult {
  data: Uint8Array;
  algorithm: string;
  originalSize: number;
  compressedSize: number;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  compress,
  decompress,
  negotiateEncoding,
  shouldCompress,
} from "./compression.service.ts";

const body = new TextEncoder().encode(JSON.stringify(bigPayload));
const encoding = negotiateEncoding(req.headers.get("accept-encoding") ?? "");

if (encoding && shouldCompress(body.byteLength, config)) {
  const result = await compress(body, encoding);
  console.log(`${result.originalSize} → ${result.compressedSize} bytes`);

  const original = await decompress(result.data, result.algorithm);
}
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [CompressionStream (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/CompressionStream)
- [DecompressionStream (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)
- [Accept-Encoding (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/Accept-Encoding)
- [Content-Encoding (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/Content-Encoding)
- [Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve)

## 📝 Notas

- Use as Web Streams nativas (`CompressionStream`/`DecompressionStream`), sem
  bibliotecas externas
- Não comprima respostas pequenas (< 1 KB) nem formatos já comprimidos (imagens,
  zip)
- Extra: suportar Brotli (`"br"`) e cachear respostas já comprimidas
- Extra: registrar métricas de taxa de compressão
