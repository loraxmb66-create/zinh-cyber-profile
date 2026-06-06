-- LORAX HUB PostgreSQL schema
-- Run this in Supabase SQL Editor, Neon, Vercel Postgres, or any PostgreSQL database.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'Role') then
    create type "Role" as enum ('ADMIN', 'USER', 'VIEWER');
  end if;
end $$;

create or replace function set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

create table if not exists "User" (
  "id" text primary key default gen_random_uuid()::text,
  "email" text not null unique,
  "username" text not null unique,
  "passwordHash" text not null,
  "role" "Role" not null default 'USER',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "Conversation" (
  "id" text primary key default gen_random_uuid()::text,
  "title" text not null,
  "userId" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "Message" (
  "id" text primary key default gen_random_uuid()::text,
  "conversationId" text not null,
  "role" text not null,
  "content" text not null,
  "attachmentUrl" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  constraint "Message_conversationId_fkey"
    foreign key ("conversationId") references "Conversation"("id")
    on delete cascade on update cascade
);

create table if not exists "ShortLink" (
  "id" text primary key default gen_random_uuid()::text,
  "slug" text not null unique,
  "targetUrl" text not null,
  "title" text,
  "clicks" integer not null default 0,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "LinkClick" (
  "id" text primary key default gen_random_uuid()::text,
  "shortLinkId" text not null,
  "country" text,
  "browser" text,
  "device" text,
  "ipHash" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  constraint "LinkClick_shortLinkId_fkey"
    foreign key ("shortLinkId") references "ShortLink"("id")
    on delete cascade on update cascade
);

create table if not exists "FileAsset" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "mimeType" text not null,
  "size" integer not null,
  "url" text not null,
  "ownerId" text,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "ApiService" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "endpoint" text not null,
  "status" text not null default 'UNKNOWN',
  "responseTime" integer,
  "uptime" double precision not null default 100,
  "lastError" text,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "FiveMServer" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "endpoint" text not null,
  "bannerUrl" text,
  "discordUrl" text,
  "connectUrl" text,
  "maxPlayers" integer not null default 64,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "TelegramAccount" (
  "id" text primary key default gen_random_uuid()::text,
  "username" text,
  "phone" text,
  "avatarUrl" text,
  "sessionRef" text,
  "lastLogin" timestamp(3),
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "VisitorEvent" (
  "id" text primary key default gen_random_uuid()::text,
  "path" text not null,
  "country" text,
  "browser" text,
  "device" text,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "AuditLog" (
  "id" text primary key default gen_random_uuid()::text,
  "actorId" text,
  "action" text not null,
  "entity" text not null,
  "metadata" jsonb,
  "createdAt" timestamp(3) not null default current_timestamp,
  constraint "AuditLog_actorId_fkey"
    foreign key ("actorId") references "User"("id")
    on delete set null on update cascade
);

create index if not exists "Conversation_userId_idx" on "Conversation"("userId");
create index if not exists "Message_conversationId_idx" on "Message"("conversationId");
create index if not exists "ShortLink_slug_idx" on "ShortLink"("slug");
create index if not exists "LinkClick_shortLinkId_idx" on "LinkClick"("shortLinkId");
create index if not exists "LinkClick_createdAt_idx" on "LinkClick"("createdAt");
create index if not exists "FileAsset_ownerId_idx" on "FileAsset"("ownerId");
create index if not exists "VisitorEvent_path_idx" on "VisitorEvent"("path");
create index if not exists "VisitorEvent_createdAt_idx" on "VisitorEvent"("createdAt");
create index if not exists "AuditLog_actorId_idx" on "AuditLog"("actorId");
create index if not exists "AuditLog_createdAt_idx" on "AuditLog"("createdAt");

drop trigger if exists "User_set_updatedAt" on "User";
create trigger "User_set_updatedAt"
before update on "User"
for each row execute function set_updated_at();

drop trigger if exists "Conversation_set_updatedAt" on "Conversation";
create trigger "Conversation_set_updatedAt"
before update on "Conversation"
for each row execute function set_updated_at();

drop trigger if exists "ShortLink_set_updatedAt" on "ShortLink";
create trigger "ShortLink_set_updatedAt"
before update on "ShortLink"
for each row execute function set_updated_at();

drop trigger if exists "ApiService_set_updatedAt" on "ApiService";
create trigger "ApiService_set_updatedAt"
before update on "ApiService"
for each row execute function set_updated_at();

drop trigger if exists "FiveMServer_set_updatedAt" on "FiveMServer";
create trigger "FiveMServer_set_updatedAt"
before update on "FiveMServer"
for each row execute function set_updated_at();

drop trigger if exists "TelegramAccount_set_updatedAt" on "TelegramAccount";
create trigger "TelegramAccount_set_updatedAt"
before update on "TelegramAccount"
for each row execute function set_updated_at();

insert into "User" ("email", "username", "passwordHash", "role")
values (
  'admin@lorax.local',
  'admin',
  '$2a$10$replace_this_hash_after_first_login',
  'ADMIN'
)
on conflict ("username") do nothing;

insert into "ShortLink" ("slug", "targetUrl", "title")
values
  ('lorax', 'https://lorax.dev', 'LORAX HUB'),
  ('github', 'https://github.com', 'GitHub')
on conflict ("slug") do nothing;

insert into "ApiService" ("name", "endpoint", "status", "responseTime", "uptime")
values
  ('AI Gateway', '/api/ai/chat', 'ONLINE', 42, 99.99),
  ('Short Link API', '/api/links', 'ONLINE', 28, 99.98),
  ('QR API', '/api/qr', 'ONLINE', 35, 99.97),
  ('Visitor API', '/api/visitors', 'ONLINE', 31, 99.95)
on conflict do nothing;

insert into "FiveMServer" ("name", "endpoint", "bannerUrl", "discordUrl", "connectUrl", "maxPlayers")
values (
  'LORAX Roleplay',
  '127.0.0.1:30120',
  null,
  'https://discord.com',
  'fivem://connect/127.0.0.1:30120',
  128
)
on conflict do nothing;

insert into "TelegramAccount" ("username", "phone", "avatarUrl", "sessionRef", "lastLogin")
values
  ('lorax_admin', null, null, 'session://lorax-admin', now()),
  ('lorax_support', null, null, 'session://lorax-support', now()),
  ('lorax_alerts', null, null, 'session://lorax-alerts', now())
on conflict do nothing;
