-- NEON SUPPLY e-commerce schema for PostgreSQL/Supabase.
-- This SQL is safe to run after database/lorax-hub.sql or on a fresh database.

create extension if not exists pgcrypto;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'OrderStatus') then
    create type "OrderStatus" as enum ('PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED');
  end if;
  if not exists (select 1 from pg_type where typname = 'PaymentMethod') then
    create type "PaymentMethod" as enum ('BANK_TRANSFER', 'E_WALLET', 'COD');
  end if;
  if not exists (select 1 from pg_type where typname = 'PaymentStatus') then
    create type "PaymentStatus" as enum ('UNPAID', 'PENDING', 'PAID', 'REFUNDED');
  end if;
  if not exists (select 1 from pg_type where typname = 'DiscountType') then
    create type "DiscountType" as enum ('PERCENT', 'AMOUNT');
  end if;
end $$;

create table if not exists "Category" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "slug" text not null unique,
  "description" text,
  "imageUrl" text,
  "isFeatured" boolean not null default false,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "Product" (
  "id" text primary key default gen_random_uuid()::text,
  "categoryId" text not null,
  "name" text not null,
  "slug" text not null unique,
  "sku" text unique,
  "description" text not null,
  "details" text not null,
  "imageUrl" text not null,
  "price" integer not null,
  "compareAt" integer,
  "stock" integer not null default 0,
  "status" text not null default 'ACTIVE',
  "isFeatured" boolean not null default false,
  "isNew" boolean not null default false,
  "sales" integer not null default 0,
  "rating" double precision not null default 5,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "Product_categoryId_fkey" foreign key ("categoryId") references "Category"("id") on delete restrict on update cascade
);

create table if not exists "Order" (
  "id" text primary key default gen_random_uuid()::text,
  "code" text not null unique,
  "userId" text,
  "customerName" text not null,
  "phone" text not null,
  "email" text not null,
  "address" text not null,
  "note" text,
  "subtotal" integer not null,
  "discount" integer not null default 0,
  "total" integer not null,
  "couponCode" text,
  "status" "OrderStatus" not null default 'PENDING',
  "paymentMethod" "PaymentMethod" not null,
  "paymentStatus" "PaymentStatus" not null default 'UNPAID',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "Order_userId_fkey" foreign key ("userId") references "User"("id") on delete set null on update cascade
);

create table if not exists "OrderItem" (
  "id" text primary key default gen_random_uuid()::text,
  "orderId" text not null,
  "productId" text not null,
  "name" text not null,
  "price" integer not null,
  "quantity" integer not null,
  "imageUrl" text,
  constraint "OrderItem_orderId_fkey" foreign key ("orderId") references "Order"("id") on delete cascade on update cascade,
  constraint "OrderItem_productId_fkey" foreign key ("productId") references "Product"("id") on delete restrict on update cascade
);

create table if not exists "Coupon" (
  "id" text primary key default gen_random_uuid()::text,
  "code" text not null unique,
  "type" "DiscountType" not null,
  "value" integer not null,
  "maxUses" integer,
  "usedCount" integer not null default 0,
  "expiresAt" timestamp(3),
  "isActive" boolean not null default true,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "ProductReview" (
  "id" text primary key default gen_random_uuid()::text,
  "productId" text not null,
  "userId" text,
  "name" text not null,
  "rating" integer not null,
  "comment" text not null,
  "createdAt" timestamp(3) not null default current_timestamp,
  constraint "ProductReview_productId_fkey" foreign key ("productId") references "Product"("id") on delete cascade on update cascade,
  constraint "ProductReview_userId_fkey" foreign key ("userId") references "User"("id") on delete set null on update cascade
);

create table if not exists "WishlistItem" (
  "id" text primary key default gen_random_uuid()::text,
  "userId" text not null,
  "productId" text not null,
  "createdAt" timestamp(3) not null default current_timestamp,
  constraint "WishlistItem_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade,
  constraint "WishlistItem_productId_fkey" foreign key ("productId") references "Product"("id") on delete cascade on update cascade,
  unique ("userId", "productId")
);

create table if not exists "ShopSetting" (
  "id" text primary key default 'main',
  "logoUrl" text,
  "bannerUrl" text,
  "primary" text not null default '#00E5FF',
  "footer" jsonb,
  "socials" jsonb,
  "bankInfo" jsonb,
  "wallet" jsonb,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create index if not exists "Product_categoryId_idx" on "Product"("categoryId");
create index if not exists "Product_status_idx" on "Product"("status");
create index if not exists "Product_sales_idx" on "Product"("sales");
create index if not exists "Order_code_idx" on "Order"("code");
create index if not exists "Order_status_idx" on "Order"("status");
create index if not exists "Order_createdAt_idx" on "Order"("createdAt");
create index if not exists "OrderItem_orderId_idx" on "OrderItem"("orderId");
create index if not exists "ProductReview_productId_idx" on "ProductReview"("productId");

insert into "Category" ("id", "name", "slug", "description", "imageUrl", "isFeatured") values
('cat-materials', 'Nguyen lieu', 'nguyen-lieu', 'Vat lieu san xuat va nguyen lieu thu cong.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80', true),
('cat-accessories', 'Phu kien', 'phu-kien', 'Phu kien dong goi va lap rap.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', true),
('cat-digital', 'San pham so', 'san-pham-so', 'Template, source code va tai nguyen digital.', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80', true),
('cat-tools', 'Cong cu', 'cong-cu', 'Tool va vat tu ho tro van hanh.', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80', true)
on conflict ("id") do nothing;

insert into "Product" ("id", "categoryId", "name", "slug", "sku", "description", "details", "imageUrl", "price", "compareAt", "stock", "status", "isFeatured", "isNew", "sales", "rating") values
('prod-resin', 'cat-materials', 'Epoxy Resin Premium 1KG', 'epoxy-resin-premium-1kg', 'NS-RESIN-1KG', 'Resin trong suot, it bot, phu hop handmade.', 'Bo epoxy resin 2 thanh phan, do trong cao, thoi gian kho on dinh.', 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=900&q=80', 245000, 290000, 18, 'ACTIVE', true, false, 342, 4.9),
('prod-packaging', 'cat-accessories', 'Bo Hop Dong Goi Neon Pack', 'bo-hop-dong-goi-neon-pack', 'NS-PACK-NEON', 'Hop, tem, card cam on va tui bao ve.', 'Combo dong goi cao cap cho shop online.', 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80', 159000, 199000, 42, 'ACTIVE', true, true, 517, 4.8),
('prod-template', 'cat-digital', 'Digital Storefront UI Kit', 'digital-storefront-ui-kit', 'NS-DIGI-UIKIT', 'Bo template giao dien ban hang dark mode.', 'File digital gom homepage, card, checkout va admin dashboard.', 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80', 399000, 599000, 999, 'ACTIVE', true, true, 88, 5),
('prod-toolkit', 'cat-tools', 'Mini Tool Kit Sua Chua', 'mini-tool-kit-sua-chua', 'NS-TOOL-MINI', 'Bo dung cu nho gon cho lap rap.', 'Gom tua vit da nang, nhip gap, dao cat va hop dung.', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80', 189000, null, 7, 'ACTIVE', false, false, 146, 4.7)
on conflict ("id") do nothing;

insert into "Coupon" ("code", "type", "value", "maxUses", "isActive") values
('NEON10', 'PERCENT', 10, 500, true),
('FREESHIP', 'AMOUNT', 30000, 300, true)
on conflict ("code") do nothing;

insert into "ShopSetting" ("id", "primary", "footer", "socials", "bankInfo", "wallet") values
('main', '#00E5FF', '{"company":"NEON SUPPLY","copyright":"2026 NEON SUPPLY"}', '{"telegram":"https://telegram.org","facebook":"https://facebook.com","zalo":"https://zalo.me"}', '{"bank":"LORAX BANK","account":"0123456789","owner":"NEON SUPPLY"}', '{"momo":"0123456789","zalopay":"0123456789"}')
on conflict ("id") do nothing;
