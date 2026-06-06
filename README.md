# Hồ Sơ Cá Nhân Zinh

Website hồ sơ cá nhân cao cấp được xây dựng bằng React, TypeScript, Tailwind CSS, Framer Motion, Three.js và GSAP.

## Tính năng

- Giao diện người dùng cyberpunk tối màu, đáp ứng trên mọi thiết bị với hiệu ứng glassmorphism, điểm nhấn neon, hình nền động Three.js, hiệu ứng hào quang con trỏ, mưa/tuyết và chế độ ma trận.

- Phần Hero với ảnh đại diện được tạo tự động, gõ chữ động, khẩu hiệu, trạng thái trực tuyến và hành động chia sẻ thẻ.

- Giới thiệu, kỹ năng, dòng thời gian kinh nghiệm, trung tâm mạng xã hội, bộ lọc danh mục đầu tư, cửa sổ bật lên dự án, bảng điều khiển thống kê, hộp đèn thư viện ảnh, trung tâm liên hệ, thẻ QR, huy hiệu, trình phát nhạc, chuyển đổi ngôn ngữ, trình tùy chỉnh chủ đề, manifest/service worker PWA, siêu dữ liệu SEO, cảnh báo chống sao chép/menu ngữ cảnh, thông báo trực tiếp, đồng hồ, tiện ích kiểu thời tiết và bộ đếm lượt truy cập.

## Cài đặt

```bash
npm install
npm run dev
```

Bản dựng sản phẩm:

```bash
npm run build
```

Tài sản dự án được tạo:

- `public/assets/zinh-avatar.png`

# zinh-cyber-profile

## Admin

Open `/admin` and log in with:

```text
admin / 123456Dinh
```

The admin page can edit the main profile text, avatar, gallery images, social URLs, contact buttons, highlight banner, and footer content.

Current storage: Supabase table `site_content`, with browser `localStorage` as fallback cache.

Run this SQL in Supabase SQL Editor before saving from admin:

```sql
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.site_content to anon, authenticated;

drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
on public.site_content
for select
to anon
using (true);

drop policy if exists "Public write site content" on public.site_content;
create policy "Public write site content"
on public.site_content
for all
to anon
using (id = 'main')
with check (id = 'main');
```

The current admin login is frontend-only (`admin / 123456Dinh`). For real security, replace this with Supabase Auth and stricter RLS policies.
