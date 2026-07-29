-- Execute após criar o usuário aguiadigitalbr@gmail.com em Authentication > Users.
insert into public.ifa_admin_users (user_id, email)
select id, email
from auth.users
where lower(email) = lower('aguiadigitalbr@gmail.com')
on conflict (user_id) do update set email = excluded.email;

do $$
begin
  if not exists (
    select 1
    from public.ifa_admin_users
    where lower(email) = lower('aguiadigitalbr@gmail.com')
  ) then
    raise exception 'Usuário não encontrado no Supabase Auth. Crie-o antes de executar este script.';
  end if;
end
$$;
