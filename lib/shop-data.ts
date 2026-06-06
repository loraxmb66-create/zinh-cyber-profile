export type ProductStatus = 'ACTIVE' | 'HIDDEN' | 'OUT_OF_STOCK';

export type ShopCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
};

export type ShopProduct = {
  id: string;
  categoryId: string;
  category: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  details: string;
  imageUrl: string;
  price: number;
  compareAt?: number;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  sales: number;
  rating: number;
};

export type CartItem = ShopProduct & {
  quantity: number;
};

export type CustomerInfo = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
};

export type ShopOrder = {
  code: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'BANK_TRANSFER' | 'E_WALLET' | 'COD';
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
};

export const shopName = 'NEON SUPPLY';

export const categories: ShopCategory[] = [
  {
    id: 'cat-materials',
    name: 'Nguyen lieu',
    slug: 'nguyen-lieu',
    description: 'Vat lieu san xuat, nguyen lieu thu cong va linh kien co ban.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    isFeatured: true
  },
  {
    id: 'cat-accessories',
    name: 'Phu kien',
    slug: 'phu-kien',
    description: 'Phu kien ho tro dong goi, lap rap va kinh doanh.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    isFeatured: true
  },
  {
    id: 'cat-digital',
    name: 'San pham so',
    slug: 'san-pham-so',
    description: 'Template, file thiet ke, source code va tai nguyen digital.',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80',
    isFeatured: true
  },
  {
    id: 'cat-tools',
    name: 'Cong cu',
    slug: 'cong-cu',
    description: 'Tool, kit va vat tu ho tro van hanh.',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80',
    isFeatured: true
  }
];

export const products: ShopProduct[] = [
  {
    id: 'prod-resin',
    categoryId: 'cat-materials',
    category: 'Nguyen lieu',
    name: 'Epoxy Resin Premium 1KG',
    slug: 'epoxy-resin-premium-1kg',
    sku: 'NS-RESIN-1KG',
    description: 'Resin trong suot, it bot, phu hop lam handmade va decor.',
    details: 'Bo epoxy resin 2 thanh phan, do trong cao, thoi gian kho on dinh, dong goi chong tran. Phu hop san xuat phu kien, decor, moc khoa va san pham thu cong.',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=900&q=80',
    price: 245000,
    compareAt: 290000,
    stock: 18,
    status: 'ACTIVE',
    isFeatured: true,
    isNew: false,
    sales: 342,
    rating: 4.9
  },
  {
    id: 'prod-packaging',
    categoryId: 'cat-accessories',
    category: 'Phu kien',
    name: 'Bo Hop Dong Goi Neon Pack',
    slug: 'bo-hop-dong-goi-neon-pack',
    sku: 'NS-PACK-NEON',
    description: 'Hop, tem, card cam on va tui bao ve cho shop online.',
    details: 'Combo dong goi cao cap gom hop carton den, tem hologram, card cam on va tui zip bao ve. Giup san pham nhin chuyen nghiep hon khi giao hang.',
    imageUrl: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80',
    price: 159000,
    compareAt: 199000,
    stock: 42,
    status: 'ACTIVE',
    isFeatured: true,
    isNew: true,
    sales: 517,
    rating: 4.8
  },
  {
    id: 'prod-template',
    categoryId: 'cat-digital',
    category: 'San pham so',
    name: 'Digital Storefront UI Kit',
    slug: 'digital-storefront-ui-kit',
    sku: 'NS-DIGI-UIKIT',
    description: 'Bo template giao dien ban hang dark mode cho creator.',
    details: 'File digital gom layout homepage, product card, checkout, admin dashboard va component design system. Ban tai ve ngay sau khi thanh toan.',
    imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80',
    price: 399000,
    compareAt: 599000,
    stock: 999,
    status: 'ACTIVE',
    isFeatured: true,
    isNew: true,
    sales: 88,
    rating: 5
  },
  {
    id: 'prod-toolkit',
    categoryId: 'cat-tools',
    category: 'Cong cu',
    name: 'Mini Tool Kit Sua Chua',
    slug: 'mini-tool-kit-sua-chua',
    sku: 'NS-TOOL-MINI',
    description: 'Bo dung cu nho gon cho lap rap va bao tri san pham.',
    details: 'Gom tua vit da nang, nhip gap, dao cat, thuoc do va hop dung nho. Phu hop shop handmade, linh kien va sua chua nhanh.',
    imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80',
    price: 189000,
    stock: 7,
    status: 'ACTIVE',
    isFeatured: false,
    isNew: false,
    sales: 146,
    rating: 4.7
  },
  {
    id: 'prod-source',
    categoryId: 'cat-digital',
    category: 'San pham so',
    name: 'Source Code Landing Page Pro',
    slug: 'source-code-landing-page-pro',
    sku: 'NS-SRC-LANDING',
    description: 'Source Next.js landing page toi uu SEO va toc do.',
    details: 'Source code gom trang chu, pricing, contact, SEO metadata, sitemap va component responsive. Phu hop ban san pham so hoac dich vu.',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
    price: 699000,
    stock: 999,
    status: 'ACTIVE',
    isFeatured: false,
    isNew: true,
    sales: 54,
    rating: 4.9
  },
  {
    id: 'prod-label',
    categoryId: 'cat-accessories',
    category: 'Phu kien',
    name: 'Tem Hologram Chong Gia',
    slug: 'tem-hologram-chong-gia',
    sku: 'NS-LABEL-HOLO',
    description: 'Tem hologram tao do tin cay cho san pham.',
    details: 'Set 100 tem hologram kich thuoc 2x2cm, bam dinh tot, anh kim nhe, phu hop niem phong san pham va bao hanh.',
    imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=900&q=80',
    price: 89000,
    stock: 3,
    status: 'ACTIVE',
    isFeatured: false,
    isNew: false,
    sales: 624,
    rating: 4.6
  }
];

export const coupons = [
  { code: 'NEON10', type: 'PERCENT', value: 10 },
  { code: 'FREESHIP', type: 'AMOUNT', value: 30000 }
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function createOrderCode() {
  return `NS${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}
