-- Statement upload storage setup for ClearFin.
-- Run this in the Supabase SQL editor for the project.
-- Files are stored in a private bucket and written by the Next.js API route
-- using SUPABASE_SERVICE_ROLE_KEY. Do not expose the service role key publicly.

create extension if not exists pgcrypto;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'statement_uploads',
  'statement_uploads',
  false,
  10485760,
  array[
    'application/pdf',
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.statement_uploads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  file_path text not null unique,
  file_name text not null,
  file_type text,
  file_size bigint not null,
  status text not null default 'received',
  created_at timestamptz not null default now(),
  constraint statement_uploads_email_has_at check (position('@' in email) > 1),
  constraint statement_uploads_status_check check (
    status in ('received', 'reviewing', 'complete', 'rejected')
  )
);

create index if not exists statement_uploads_email_idx
  on public.statement_uploads (email);

create index if not exists statement_uploads_created_at_idx
  on public.statement_uploads (created_at desc);

alter table public.statement_uploads enable row level security;

-- No public select/update/delete policies are created for this table or bucket.
-- The server-side API route uses SUPABASE_SERVICE_ROLE_KEY to insert metadata
-- and upload files into the private storage bucket.
