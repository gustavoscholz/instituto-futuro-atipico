# Instituto Futuro Atípico

Site institucional do Instituto Futuro Atípico, desenvolvido com React, TypeScript e Vite. O projeto inclui a landing page responsiva, páginas públicas de eventos e parceiros e um painel administrativo integrado ao Supabase.

## Requisitos

- Node.js 20 ou superior
- npm
- Projeto Supabase configurado

## Executar localmente

```bash
npm install
npm run dev
```

O Vite informará o endereço local disponível no terminal.

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Use [.env.example](./.env.example) como referência. Nunca envie `.env` ou `.env.local` ao GitHub.

## Supabase

As instruções para criar as tabelas, políticas, dados demonstrativos e usuário administrativo estão em [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

O build de produção é gerado em `dist`.

## Rotas

- `/`: landing page
- `/eventos`: agenda pública
- `/parceiros`: rede pública
- `/admin/login`: login administrativo
- `/admin`: resumo administrativo
- `/admin/eventos`: gestão de eventos
- `/admin/parceiros`: gestão de parceiros

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Confirme o framework **Vite**.
3. Use `npm install` como comando de instalação.
4. Use `npm run build` como comando de build.
5. Use `dist` como diretório de saída.
6. Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` em **Settings > Environment Variables**.
7. Faça o deploy ou redeploy após cadastrar as variáveis.

O arquivo [vercel.json](./vercel.json) mantém o fallback da SPA, permitindo acessar ou atualizar diretamente qualquer rota.
