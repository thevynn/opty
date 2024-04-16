-- SQL Editor > New query

drop table if exists posts;
drop function if exists count_posts;
drop type if exists public.post_status;

create type public.post_status as enum ('publish', 'future', 'draft', 'pending', 'private', 'trash');
-- alter type public.type_name add value 'new_type';
-- alter type public.type_name rename value 'old_type' to 'new_type';
-- alter type public.type_name rename to new_type_name;

create table posts (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz,
  user_id uuid references users(id) on delete cascade,
  profile_id uuid references profiles(id),
  status public.post_status default 'draft'::post_status,
  password varchar(255),
  title text,
  excerpt text,
  content jsonb,
  thumbnail text,
  view integer,
  is_ban boolean default false,
  banned_until timestamptz
);
comment on column posts.status is 'publish, future, draft, pending, private, trash';

-- Secure the table
alter table posts enable row level security;

-- Add row-level security
create policy "Public posts are viewable by everyone." on posts for select to authenticated, anon using ( true );
create policy "Users can insert their own post." on posts for insert to authenticated with check ( auth.uid() = user_id );
create policy "Users can update their own post." on posts for update to authenticated using ( auth.uid() = user_id );
create policy "Users can delete their own post." on posts for delete to authenticated using ( auth.uid() = user_id );

-- Update a column timestamp on every update.
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "posts", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
drop trigger if exists handle_updated_at on posts;

create trigger handle_updated_at before update on posts
  for each row execute procedure moddatetime (updated_at);
