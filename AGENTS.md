# Projeto EBD Digital - Manual de Estabilidade

Este arquivo registra a configuração estável que resolveu os problemas de build na Vercel (Next.js 15+). **Não altere estas diretrizes sem testar o build exaustivamente.**

## 1. Configuração de Build (Next.js 15.1.0+)
Para que o build ocorra sem erros de `PageNotFoundError: /_document` ou `SWC bindings`:
- **Versão do Next.js**: `^15.1.0` (estável)
- **Output**: Deve ser `export` no `next.config.mjs`.
- **Pages Fallback**: Se o erro `_document` retornar, a pasta `/pages` com `_document.tsx`, `_app.tsx` e `404.tsx` deve ser reintroduzida como ponte de compatibilidade. Atualmente, o projeto está operando de forma estável **apenas com App Router** usando `app/not-found.tsx`.

## 2. Scripts de Build Estáveis (`package.json`)
```json
"scripts": {
  "build": "next build && rm -rf dist && cp -r out dist"
}
```
*Nota: Na Vercel, o `next build` é o comando principal. A cópia para `dist` é para funcionamento interno do AI Studio.*

## 3. Configurações de Transpilação (`next.config.mjs`)
Bibliotecas de animação exigem transpilação explícita para evitar erros de renderização no servidor:
```javascript
transpilePackages: ['motion', 'framer-motion']
```

## 4. Estado de Recuperação (Checkpoint 2026-04-22)
As dependências no `package.json` devem manter o React na versão `19.0.0` e o Next na `15.1.0` (ou superior estável, evitando versões experimental/canary que quebram as bindings SWC).

---
**Assinado**: AI Coding Assistant
**Data**: 22 de Abril de 2026
**Status**: Operacional na Vercel (Ready)
