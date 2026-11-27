# 3Dream Project — loja de impressão 3D

Demonstração de e-commerce para impressoras 3D e filamentos. O visitante pesquisa e filtra o catálogo, abre a página de produto e adiciona itens ao carrinho. O painel demonstrativo permite simular vendas e reposição de estoque. [Abrir a demonstração](https://dream-project-store.caiohenry-2606.chatgpt.site/)

## Executar localmente

Com Node.js 22.13 ou superior e pnpm, execute na raiz:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Estrutura e publicação

A interface em React está em [app](app) e [components](components). Os pedidos e o estoque de demonstração usam Cloudflare D1. O comando `pnpm build` usa a configuração vinext/Vite do projeto. Uma migração para a Vercel exige revisar o runtime, a persistência D1 e as integrações do servidor.

## Guias do projeto

- [Roteiro de demonstração](DEMO.md)
- [Frete e Correios](CORREIOS.md)
- [Avaliações do Google](GOOGLE-REVIEWS.md)
- [Imagens do catálogo](PHOTO-ASSETS.md)
