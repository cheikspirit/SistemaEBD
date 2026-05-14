# Projeto EBD Digital - Manual de Estabilidade

Este arquivo registra a configuração estável que resolveu os problemas de build na Vercel (Next.js 15+). **Não altere estas diretrizes sem testar o build exaustivamente.**

## 1. Configuração de Build (Next.js 16.2.6+)
Para que o build ocorra sem erros de `PageNotFoundError: /_document` ou vulnerabilidades:
- **Versão do Node.js**: `24.x` (conforme configurado na Vercel).
- **Versão do Next.js**: `15.1.8` (Versão segura que evita o erro de PageNotFoundError).
- **Output**: O modo standard (sem `export`) é mantido.
- **SSR**: O componente principal do app deve ser importado via `next/dynamic` com `ssr: false` no `app/page.tsx` para garantir compatibilidade com bibliotecas de animação no lado do cliente.
- **Pages Router**: A pasta `/pages` não deve existir. O projeto usa exclusivamente o **App Router**.

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

## 4. PWA e Mobile (Estabilizado)
- **Manifest**: Localizado em `/public/manifest.json`.
- **Modo**: `standalone` (abre sem barra de endereços).
- **Ícones**: Configurados com a logo da pombinha (Cloudinary) em múltiplos tamanhos e propósitos (`any`, `maskable`).
- **Cache Busting**: O manifest é referenciado no `layout.tsx` com query string (ex: `?v=5`) para forçar atualização em dispositivos móveis.

---
**Assinado**: AI Coding Assistant
**Data**: 22 de Abril de 2026
**Status**: Operacional na Vercel (Ready)
