# NEON SUPPLY E-commerce

Website thương mại điện tử full-stack bằng Next.js 15, TypeScript, TailwindCSS, Prisma ORM và PostgreSQL.

## Tính năng

- Trang chủ: banner, search, danh mục nổi bật, best sellers, sản phẩm mới, ưu đãi, review, footer.
- Trang sản phẩm: tìm kiếm, lọc danh mục, lọc còn hàng, sort mới nhất/giá thấp/bán chạy.
- Chi tiết sản phẩm: ảnh, giá, mô tả, tồn kho, rating, sản phẩm liên quan.
- Giỏ hàng: thêm/xoá/tăng giảm số lượng, mã giảm giá, tổng tiền.
- Thanh toán: thông tin khách, phương thức chuyển khoản/ví/COD, tự tạo mã đơn.
- Tài khoản: đăng nhập/đăng ký UI, lịch sử đơn hàng local.
- Admin `/admin` trong UI: dashboard, sản phẩm, đơn hàng, users, coupons, theme, payments.
- Backend API: products, orders, coupons.
- Database SQL đầy đủ: `database/ecommerce.sql`.
- Fallback localStorage: vẫn test được khi chưa có PostgreSQL.

## Cài đặt

```bash
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

## Database

Chạy SQL trong PostgreSQL/Supabase/Neon:

```bash
psql "$DATABASE_URL" -f database/ecommerce.sql
```

Hoặc mở Supabase SQL Editor và paste nội dung:

```text
database/ecommerce.sql
```

Nếu dùng Prisma migrate:

```bash
npx prisma migrate dev
```

## Build

```bash
npm run build
```

## Deploy

Trên Vercel cần set:

```text
DATABASE_URL
JWT_SECRET
ADMIN_USERNAME
ADMIN_PASSWORD
NEXT_PUBLIC_APP_URL
```

File upload hiện có temporary local link để test. Production nên nối Cloudflare R2, S3, Vercel Blob hoặc Supabase Storage.
