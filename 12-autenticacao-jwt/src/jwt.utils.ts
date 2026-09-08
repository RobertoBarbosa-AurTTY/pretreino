/**
 * Desafio 12: Autenticação JWT
 * 
 * Serviço de autenticação com JWT.
 */

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: "admin" | "user";
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  error?: string;
}

// Base64 URL encode
function base64UrlEncode(data: string): string {
  return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Base64 URL decode
function base64UrlDecode(data: string): string {
  data = data.replace(/-/g, "+").replace(/_/g, "/");
  while (data.length % 4) data += "=";
  return atob(data);
}

// Criar JWT
export async function criarToken(
  payload: TokenPayload,
  secret: string,
  expiresInMinutes: number = 60
): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (expiresInMinutes * 60)
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));

  const data = `${encodedHeader}.${encodedPayload}`;

  // Assinar com HMAC-SHA256
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const encodedSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));

  return `${data}.${encodedSignature}`;
}

// Verificar JWT
export async function verificarToken(
  token: string,
  secret: string
): Promise<TokenPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    // Verificar assinatura
    const data = `${encodedHeader}.${encodedPayload}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = Uint8Array.from(
      base64UrlDecode(encodedSignature),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(data)
    );

    if (!valid) return null;

    // Decodificar payload
    const payload: TokenPayload = JSON.parse(base64UrlDecode(encodedPayload));

    // Verificar expiração
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Gerar refresh token
export function gerarRefreshToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
}
