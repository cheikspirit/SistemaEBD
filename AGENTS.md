# Projeto EBD Digital - Manual de Estabilidade

Este arquivo registra a configuração estável que resolveu os problemas de build na Vercel (Next.js 15+). **Não altere estas diretrizes sem testar o build exaustivamente.**

## 1. Configuração de Build (Next.js 15.1.0+)
Para que o build ocorra sem erros de `PageNotFoundError: /_document` ou `SWC bindings`:
- **Versão do Next.js**: `^15.1.0` (estável)
- **Output**: O modo standard (sem `export`) é mantido.
- **SSR**: O componente principal do app deve ser importado via `next/dynamic` com `ssr: false` no `app/page.tsx` para evitar erros de renderização no servidor relacionados a bibliotecas de animação e window APIs.
- **Pages Fallback**: A pasta `/pages` não deve existir. O erro `_document` é evitado ao remover qualquer vestígio do Pages Router e usar App Router puro.

## 2. Scripts de Build Estáveis (`package.json`)
```json
"scripts": {
  "build": "next build",
  "start": "next start -p 3000"
}
```
*Nota: O build standard gera a pasta `.next` que é utilizada pelo `next start`.*

## 3. Configurações de Transpilação
Bibliotecas de animação como `motion` (v12) geralmente não precisam de transpilação explícita no Next.js 15 se importadas via componentes dinâmicos com `ssr: false`.

## 4. Estado de Recuperação (Checkpoint 2026-04-22)
As dependências no `package.json` devem manter o React na versão `19.0.0` e o Next na `15.1.0` (ou superior estável, evitando versões experimental/canary que quebram as bindings SWC).

---
**Assinado**: AI Coding Assistant
**Data**: 22 de Abril de 2026
**Status**: Operacional na Vercel (Ready)
