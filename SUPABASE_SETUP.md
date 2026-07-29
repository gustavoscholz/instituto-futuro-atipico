# Configuração do Supabase

1. Abra o projeto no Supabase e acesse **SQL Editor**.
2. Execute `supabase/migrations/20260729_ifa_content.sql`.
3. Execute `supabase/seed.sql` para criar os rascunhos demonstrativos.
4. Em **Authentication > Users**, crie `aguiadigitalbr@gmail.com` e defina uma senha forte.
5. Desative novos cadastros públicos nas configurações de autenticação.
6. Execute `supabase/register_admin.sql`.
7. No Vercel, configure:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

Os dados de exemplo são rascunhos e não aparecem nas páginas públicas até serem publicados
pelo painel. Somente o título é obrigatório para publicar um evento; os demais campos podem
ser preenchidos posteriormente.
