# Desafio 30: Segurança de API

## 🎯 Objetivo

Implementar medidas de segurança robustas para proteger APIs contra ataques comuns.

## 📋 Contexto Real

APIs estão expostas a diversas ameaças:
- Injeção de código
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Rate DDoS
- Enumeração de dados

## 📐 Requisitos

- [ ] Implementar validação de entrada robusta
- [ ] Proteger contra injeção (SQL, NoSQL, comando)
- [ ] Implementar sanitização de dados
- [ ] Configurar CORS adequadamente
- [ ] Implementar rate limiting por IP/usuário
- [ ] Criar headers de segurança

## 🗂️ Estrutura dos Dados

```typescript
interface SecurityConfig {
  cors: {
    origins: string[];
    methods: string[];
    headers: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    message: string;
  };
  helmet: {
    contentSecurityPolicy: boolean;
    crossOriginEmbedderPolicy: boolean;
  };
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  sanitized: unknown;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface SecurityEvent {
  tipo: "injecao" | "xss" | "rate_limit" | "acesso_nao_autorizado";
  ip: string;
  userId?: string;
  endpoint: string;
  timestamp: string;
  detalhes: Record<string, unknown>;
}

interface InputSanitizer {
  sanitize(input: unknown): unknown;
  isSafe(input: string): boolean;
}
```

## 💡 Exemplo de Uso

```typescript
// Validação de entrada
const schema = z.object({
  nome: z.string().min(3).max(100).regex(/^[a-zA-Z\s]+$/),
  email: z.string().email(),
  mensagem: z.string().max(5000).sanitize()
});

const resultado = await validateRequest(req.body, schema);

// Rate limiting
const rateLimiter = new RateLimiter({
  windowMs: 60000,
  maxRequests: 100,
  keyGenerator: (req) => req.ip
});

app.use(rateLimiter.middleware);

// Headers de segurança
app.use(helmet());
app.use(cors(securityConfig.cors));

// Detecção de ataques
const sanitizer = new InputSanitizer();
if (!sanitizer.isSafe(req.body.query)) {
  logSecurityEvent({
    tipo: "injecao",
    ip: req.ip,
    endpoint: req.path,
    timestamp: new Date().toISOString()
  });
  return res.status(400).json({ error: "Input inválido" });
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

- Use helmet para headers de segurança
- Implemente WAF rules básicas
- Valide Content-Type
- Implemente request ID para rastreabilidade
- Considere usar OWASP Top 10 como checklist

---

**Dica:** Nunca confie em dados do cliente - sempre valide e sanitize toda entrada, mesmo que venha de sistema interno.