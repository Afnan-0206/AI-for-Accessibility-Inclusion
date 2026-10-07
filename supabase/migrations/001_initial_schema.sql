-- Samajh Database Migration: 001_initial_schema.sql
-- Target: Supabase PostgreSQL
-- Description: Creates users, documents, constraints, indexes, and enables RLS

-- 1. Create Users Table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- 2. Create Documents Table
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  file_name text not null,
  language text not null check (language in ('en', 'hi', 'kn')),
  analysis jsonb not null,
  created_at timestamptz not null default now()
);

-- 3. Create Index on documents for user history queries (ordered newest first)
create index if not exists documents_user_created_idx
on public.documents(user_id, created_at desc);

-- 4. Enable Row Level Security (RLS) on both tables
alter table public.users enable row level security;
alter table public.documents enable row level security;
