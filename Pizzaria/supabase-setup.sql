-- ============================================================
-- CONFIGURAÇÃO DO BANCO NO SUPABASE
-- Rode este script uma vez em: Supabase > SQL Editor > New query
-- ============================================================

-- Tabela de perfis (dados extras do usuário, além do email/senha do Auth)
create table if not exists public.perfis (
  id uuid references auth.users on delete cascade primary key,
  nome text,
  telefone text,
  criado_em timestamp with time zone default now()
);

-- Ativa segurança por linha (cada usuário só acessa o próprio perfil)
alter table public.perfis enable row level security;

create policy "Usuários podem ver o próprio perfil"
  on public.perfis for select
  using (auth.uid() = id);

create policy "Usuários podem atualizar o próprio perfil"
  on public.perfis for update
  using (auth.uid() = id);

-- Função que cria automaticamente uma linha em "perfis"
-- toda vez que alguém se cadastra (auth.users)
create or replace function public.criar_perfil_novo_usuario()
returns trigger as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, new.raw_user_meta_data->>'nome');
  return new;
end;
$$ language plpgsql security definer;

-- Gatilho: dispara a função acima após cada novo cadastro
drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute procedure public.criar_perfil_novo_usuario();

-- ============================================================
-- Dica: em Authentication > Providers > Email, você pode
-- desativar a confirmação por email durante o desenvolvimento
-- (Confirm email) para testar login/cadastro mais rápido.
-- ============================================================
