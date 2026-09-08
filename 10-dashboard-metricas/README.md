# Desafio 10: Dashboard de Métricas

## 🎯 Objetivo

Criar um serviço que coleta, processa e serve métricas de aplicação.

## 📋 Contexto Real

O time precisa monitorar:
- Tempo de resposta de APIs
- Taxa de erros
- Uso de memória/CPU
- Métricas de negócio (vendas, cadastros)

## 📐 Requisitos

- [ ] Coletar métricas de diferentes fontes
- [ ] Agregar dados por período
- [ ] Calcular médias e percentis
- [ ] Servir métricas via API
- [ ] Dashboard com gráficos

## 🗂️ Estrutura dos Dados

```typescript
interface Metrica {
  nome: string;
  valor: number;
  timestamp: string;
  tags?: Record<string, string>;
}

interface MetricaAgregada {
  nome: string;
  media: number;
  minimo: number;
  maximo: number;
  p95: number;
  p99: number;
  contagem: number;
  periodo: { inicio: string; fim: string };
}

interface DashboardConfig {
  intervaloColeta: number;
  intervaloAggregacao: number;
  retencoesDias: number;
}
```

## 💡 Exemplo de Uso

```typescript
const dashboard = new Dashboard({ intervaloColeta: 5000 });

// Registrar métricas
dashboard.registrar("tempo_resposta", 120, { rota: "/api/users" });
dashboard.registrar("erro", 1, { tipo: "timeout" });

// Consultar métricas
const metricas = dashboard.obterMetricas("tempo_resposta", "1h");
console.log(`P95: ${metricas.p95}ms`);
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

- Use.histogram para distribuição
- Implemente downsampling para dados antigos
- Considere usar Prometheus/Grafana
- Otimize consultas com índices

---

**Dica:** Métricas devem ser leves. Não bloqueie o fluxo principal para coletar métricas.
