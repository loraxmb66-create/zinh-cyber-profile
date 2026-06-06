'use client';

import {
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Heart,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Minus,
  Moon,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Sun,
  Trash2,
  Truck,
  User,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input, Textarea } from './ui/input';
import { CartItem, CustomerInfo, ShopOrder, ShopProduct, categories, coupons, createOrderCode, formatCurrency, products, shopName } from '@/lib/shop-data';

type View = 'home' | 'products' | 'detail' | 'cart' | 'checkout' | 'account' | 'admin' | 'policy' | 'terms' | 'guide';
type AdminTab = 'dashboard' | 'products' | 'orders' | 'users' | 'coupons' | 'theme' | 'payments';
type AuthMode = 'login' | 'register' | 'forgot' | 'profile';
type LocalUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: 'USER' | 'ADMIN';
  locked: boolean;
  createdAt: string;
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Browser storage can be unavailable in private mode.
  }
}

const emptyCustomer: CustomerInfo = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  note: ''
};

export function ShopApp() {
  const [view, setView] = useState<View>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  const [selected, setSelected] = useState<ShopProduct>(products[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [coupon, setCoupon] = useState('');
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer);
  const [paymentMethod, setPaymentMethod] = useState<ShopOrder['paymentMethod']>('BANK_TRANSFER');
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [toast, setToast] = useState('');
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: 'admin@shop.local',
    phone: '',
    address: '',
    password: '123456Dinh',
    newPassword: ''
  });
  const [adminProducts, setAdminProducts] = useState<ShopProduct[]>(products);
  const [editingProduct, setEditingProduct] = useState<ShopProduct>(products[0]);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    setCart(readLocal<CartItem[]>('neon-cart', []));
    setOrders(readLocal<ShopOrder[]>('neon-orders', []));
    setWishlist(readLocal<string[]>('neon-wishlist', []));
    setAdminProducts(readLocal<ShopProduct[]>('neon-products', products));
    const savedUsers = readLocal<LocalUser[]>('neon-users', [
      {
        id: 'admin-local',
        fullName: 'Admin',
        email: 'admin@shop.local',
        phone: '0900000000',
        address: 'NEON SUPPLY HQ',
        password: '123456Dinh',
        role: 'ADMIN',
        locked: false,
        createdAt: new Date().toISOString()
      }
    ]);
    setUsers(savedUsers);
    const sessionUserId = readLocal<string | null>('neon-session-user', null);
    setCurrentUser(savedUsers.find((user) => user.id === sessionUserId) ?? null);
  }, []);

  useEffect(() => writeLocal('neon-cart', cart), [cart]);
  useEffect(() => writeLocal('neon-orders', orders), [orders]);
  useEffect(() => writeLocal('neon-wishlist', wishlist), [wishlist]);
  useEffect(() => writeLocal('neon-products', adminProducts), [adminProducts]);
  useEffect(() => writeLocal('neon-users', users), [users]);
  useEffect(() => writeLocal('neon-session-user', currentUser?.id ?? null), [currentUser]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleProducts = useMemo(() => {
    let result = adminProducts.filter((item) => item.status === 'ACTIVE');
    if (query) {
      const keyword = query.toLowerCase();
      result = result.filter((item) => `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(keyword));
    }
    if (category !== 'all') result = result.filter((item) => item.categoryId === category);
    if (stockOnly) result = result.filter((item) => item.stock > 0);
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'best') result = [...result].sort((a, b) => b.sales - a.sales);
    if (sort === 'newest') result = [...result].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return result;
  }, [adminProducts, category, query, sort, stockOnly]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = useMemo(() => {
    const found = coupons.find((item) => item.code === coupon.trim().toUpperCase());
    if (!found) return 0;
    return found.type === 'PERCENT' ? Math.round((subtotal * found.value) / 100) : found.value;
  }, [coupon, subtotal]);
  const total = Math.max(0, subtotal - discount);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  const shellClass = theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-100 text-slate-950';

  const addToCart = (product: ShopProduct, quantity = 1) => {
    if (product.stock <= 0) {
      setToast('San pham da het hang');
      return;
    }
    setCart((current) => {
      const existed = current.find((item) => item.id === product.id);
      if (existed) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...current, { ...product, quantity }];
    });
    setToast('Da them vao gio hang');
  };

  const buyNow = (product: ShopProduct) => {
    addToCart(product);
    setView('checkout');
  };

  const submitOrder = () => {
    if (!cart.length) {
      setToast('Gio hang dang trong');
      return;
    }
    if (!customer.fullName || !customer.phone || !customer.address) {
      setToast('Vui long nhap ho ten, so dien thoai va dia chi');
      return;
    }
    const order: ShopOrder = {
      code: createOrderCode(),
      customer,
      items: cart,
      subtotal,
      discount,
      total,
      paymentMethod,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setOrders((current) => [order, ...current]);
    setCart([]);
    setCustomer(emptyCustomer);
    setView('account');
    setToast(`Dat hang thanh cong: ${order.code}`);
  };

  const register = () => {
    if (!authForm.fullName || !authForm.email || !authForm.password) {
      setToast('Vui long nhap ten, email va mat khau');
      return;
    }
    if (users.some((user) => user.email.toLowerCase() === authForm.email.toLowerCase())) {
      setToast('Email da ton tai');
      return;
    }
    const user: LocalUser = {
      id: `user-${Date.now()}`,
      fullName: authForm.fullName,
      email: authForm.email,
      phone: authForm.phone,
      address: authForm.address,
      password: authForm.password,
      role: 'USER',
      locked: false,
      createdAt: new Date().toISOString()
    };
    setUsers((current) => [user, ...current]);
    setCurrentUser(user);
    setCustomer({ fullName: user.fullName, phone: user.phone, email: user.email, address: user.address, note: '' });
    setAuthMode('profile');
    setToast('Dang ky thanh cong');
  };

  const login = () => {
    const user = users.find((item) => item.email.toLowerCase() === authForm.email.toLowerCase() && item.password === authForm.password);
    if (!user) {
      setToast('Sai email hoac mat khau');
      return;
    }
    if (user.locked) {
      setToast('Tai khoan dang bi khoa');
      return;
    }
    setCurrentUser(user);
    setCustomer({ fullName: user.fullName, phone: user.phone, email: user.email, address: user.address, note: '' });
    setAuthMode('profile');
    setToast('Dang nhap thanh cong');
  };

  const resetPassword = () => {
    if (!authForm.email || !authForm.newPassword) {
      setToast('Nhap email va mat khau moi');
      return;
    }
    let updatedUser: LocalUser | null = null;
    setUsers((current) => current.map((user) => {
      if (user.email.toLowerCase() !== authForm.email.toLowerCase()) return user;
      updatedUser = { ...user, password: authForm.newPassword };
      return updatedUser;
    }));
    setToast(updatedUser ? 'Da dat lai mat khau local' : 'Khong tim thay email');
    if (updatedUser) setAuthMode('login');
  };

  const updateProfile = () => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      fullName: authForm.fullName || currentUser.fullName,
      phone: authForm.phone || currentUser.phone,
      address: authForm.address || currentUser.address,
      password: authForm.newPassword || currentUser.password
    };
    setUsers((current) => current.map((user) => user.id === updated.id ? updated : user));
    setCurrentUser(updated);
    setToast('Da cap nhat ho so');
  };

  const openDetail = (product: ShopProduct) => {
    setSelected(product);
    setView('detail');
  };

  const saveProduct = () => {
    setAdminProducts((current) => {
      const existed = current.some((item) => item.id === editingProduct.id);
      if (existed) return current.map((item) => (item.id === editingProduct.id ? editingProduct : item));
      return [{ ...editingProduct, id: `prod-${Date.now()}`, slug: editingProduct.slug || editingProduct.name.toLowerCase().replaceAll(' ', '-') }, ...current];
    });
    setToast('Da luu san pham');
  };

  return (
    <main className={`min-h-screen ${shellClass}`}>
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,229,255,.24)_1px,transparent_1px),linear-gradient(90deg,rgba(123,97,255,.2)_1px,transparent_1px)] bg-[size:44px_44px]" />
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-lg border border-cyan-300/30 bg-black/80 px-4 py-3 text-sm font-bold text-cyan-300 shadow-[0_0_30px_rgba(0,229,255,.22)]">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/55 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button onClick={() => setView('home')} className="text-lg font-black tracking-wide">
            {shopName.split(' ')[0]}<span className="text-cyan-300"> {shopName.split(' ')[1]}</span>
          </button>
          <div className="hidden items-center gap-5 text-sm text-slate-300 lg:flex">
            {[
              ['home', 'Trang chu'],
              ['products', 'San pham'],
              ['cart', `Gio hang (${cart.length})`],
              ['account', 'Tai khoan'],
              ['admin', 'Admin']
            ].map(([key, label]) => (
              <button key={key} onClick={() => setView(key as View)} className="hover:text-cyan-300">
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-white/10 bg-white/10 p-2" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="rounded-lg border border-white/10 bg-white/10 p-2 lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
        {mobileMenu && (
          <div className="grid gap-2 border-t border-white/10 bg-black/90 p-4 lg:hidden">
            {['home', 'products', 'cart', 'account', 'admin'].map((item) => (
              <button key={item} onClick={() => { setView(item as View); setMobileMenu(false); }} className="rounded-lg bg-white/5 px-3 py-2 text-left capitalize">
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      {view === 'home' && (
        <>
          <section className="relative z-10 mx-auto grid min-h-[72vh] max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.28em] text-cyan-300">Premium digital commerce</p>
              <h1 className="text-5xl font-black leading-tight md:text-7xl">Nguyen lieu, phu kien va san pham so cho shop hien dai.</h1>
              <p className="mt-5 max-w-2xl text-lg text-slate-300">Dark commerce storefront toi uu cho ban hang that: tim nhanh, mua nhanh, quan tri nhanh.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input className="pl-10" placeholder="Tim epoxy, template, hop dong goi..." value={query} onChange={(event) => setQuery(event.target.value)} />
                </div>
                <Button onClick={() => setView('products')}>Tim san pham <ChevronRight size={17} /></Button>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-white/10 p-4 shadow-[0_0_80px_rgba(0,229,255,.16)] backdrop-blur-2xl">
              <img src={products[0].imageUrl} alt={products[0].name} className="aspect-square w-full rounded-xl object-cover" />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <strong className="text-xl">{products[0].name}</strong>
                  <p className="text-cyan-300">{formatCurrency(products[0].price)}</p>
                </div>
                <Button onClick={() => addToCart(products[0])}><ShoppingCart size={17} /></Button>
              </div>
            </div>
          </section>

          <Section title="Danh muc noi bat">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((item) => (
                <button key={item.id} onClick={() => { setCategory(item.id); setView('products'); }} className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left">
                  <img src={item.imageUrl} alt={item.name} className="h-36 w-full object-cover transition group-hover:scale-105" />
                  <div className="p-4">
                    <h3 className="font-black">{item.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <ProductSection title="San pham ban chay" products={[...adminProducts].sort((a, b) => b.sales - a.sales).slice(0, 4)} openDetail={openDetail} addToCart={addToCart} />
          <ProductSection title="San pham moi" products={adminProducts.filter((item) => item.isNew).slice(0, 4)} openDetail={openDetail} addToCart={addToCart} />

          <Section title="Uu dai va danh gia">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-6 lg:col-span-1">
                <h3 className="text-2xl font-black">NEON10</h3>
                <p className="mt-2 text-slate-300">Giam 10% cho don hang dau tien. Nhap ma trong gio hang.</p>
              </div>
              {['Giao nhanh, dong goi rat dep.', 'Template digital dung duoc ngay.', 'Admin shop tu van ro rang.'].map((review, index) => (
                <div key={review} className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex text-cyan-300">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                  <p>{review}</p>
                  <strong className="mt-4 block">Khach hang #{index + 1}</strong>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {view === 'products' && (
        <Section title="Trang san pham">
          <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_180px_180px_170px]">
            <Input placeholder="Tim san pham..." value={query} onChange={(event) => setQuery(event.target.value)} />
            <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">Tat ca danh muc</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">Moi nhat</option>
              <option value="price-asc">Gia thap den cao</option>
              <option value="best">Ban chay</option>
            </select>
            <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} />
              Con hang
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} openDetail={openDetail} addToCart={addToCart} buyNow={buyNow} wishlist={wishlist} setWishlist={setWishlist} />)}
          </div>
        </Section>
      )}

      {view === 'detail' && (
        <Section title="Chi tiet san pham">
          <div className="grid gap-8 lg:grid-cols-2">
            <img src={selected.imageUrl} alt={selected.name} className="aspect-square w-full rounded-2xl object-cover" />
            <div>
              <p className="text-cyan-300">{selected.category}</p>
              <h1 className="mt-2 text-4xl font-black">{selected.name}</h1>
              <div className="mt-3 flex items-center gap-3">
                <strong className="text-3xl text-cyan-300">{formatCurrency(selected.price)}</strong>
                {selected.compareAt && <span className="text-slate-500 line-through">{formatCurrency(selected.compareAt)}</span>}
              </div>
              <p className="mt-5 text-slate-300">{selected.details}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Info label="Ton kho" value={`${selected.stock}`} />
                <Info label="Danh gia" value={`${selected.rating}/5`} />
                <Info label="Da ban" value={`${selected.sales}`} />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => addToCart(selected)}><ShoppingCart size={17} />Them vao gio</Button>
                <Button variant="secondary" onClick={() => buyNow(selected)}>Mua ngay</Button>
              </div>
            </div>
          </div>
          <ProductSection title="San pham lien quan" products={adminProducts.filter((item) => item.categoryId === selected.categoryId && item.id !== selected.id).slice(0, 4)} openDetail={openDetail} addToCart={addToCart} />
        </Section>
      )}

      {view === 'cart' && (
        <Section title="Gio hang">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[90px_1fr_auto]">
                  <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-black">{item.name}</h3>
                    <p className="text-cyan-300">{formatCurrency(item.price)}</p>
                    <button className="mt-2 text-sm text-red-300" onClick={() => setCart((current) => current.filter((cartItem) => cartItem.id !== item.id))}>Xoa</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setCart((current) => current.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) } : cartItem))}><Minus size={14} /></Button>
                    <strong>{item.quantity}</strong>
                    <Button variant="secondary" onClick={() => setCart((current) => current.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem))}><Plus size={14} /></Button>
                  </div>
                </div>
              ))}
            </div>
            <OrderSummary subtotal={subtotal} discount={discount} total={total} coupon={coupon} setCoupon={setCoupon} checkout={() => setView('checkout')} />
          </div>
        </Section>
      )}

      {view === 'checkout' && (
        <Section title="Thanh toan">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-4 text-xl font-black">Thong tin khach hang</h2>
              <div className="grid gap-3">
                <Input placeholder="Ho ten" value={customer.fullName} onChange={(event) => setCustomer({ ...customer, fullName: event.target.value })} />
                <Input placeholder="So dien thoai" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} />
                <Input placeholder="Email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} />
                <Input placeholder="Dia chi" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} />
                <Textarea placeholder="Ghi chu" value={customer.note} onChange={(event) => setCustomer({ ...customer, note: event.target.value })} />
              </div>
              <h3 className="mb-3 mt-6 font-black">Phuong thuc thanh toan</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['BANK_TRANSFER', 'Chuyen khoan'],
                  ['E_WALLET', 'Vi dien tu'],
                  ['COD', 'COD']
                ].map(([key, label]) => (
                  <button key={key} onClick={() => setPaymentMethod(key as ShopOrder['paymentMethod'])} className={`rounded-lg border p-3 ${paymentMethod === key ? 'border-cyan-300 bg-cyan-300/10 text-cyan-300' : 'border-white/10 bg-white/5'}`}>
                    {label}
                  </button>
                ))}
              </div>
              {paymentMethod !== 'COD' && (
                <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="font-bold">QR thanh toan demo</p>
                  <p className="text-sm text-slate-300">Ngan hang: LORAX BANK - STK: 0123456789 - Noi dung: ma don hang tu dong</p>
                </div>
              )}
            </div>
            <OrderSummary subtotal={subtotal} discount={discount} total={total} coupon={coupon} setCoupon={setCoupon} checkout={submitOrder} label="Gui don hang" />
          </div>
        </Section>
      )}

      {view === 'account' && (
        <Section title="Tai khoan nguoi dung">
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <User className="mb-3 text-cyan-300" />
              <h2 className="text-xl font-black">
                {currentUser ? 'Ho so ca nhan' : authMode === 'register' ? 'Dang ky' : authMode === 'forgot' ? 'Quen mat khau' : 'Dang nhap'}
              </h2>
              {!currentUser && (
                <div className="mt-4 flex gap-2">
                  <Button variant={authMode === 'login' ? 'primary' : 'secondary'} onClick={() => setAuthMode('login')}>Login</Button>
                  <Button variant={authMode === 'register' ? 'primary' : 'secondary'} onClick={() => setAuthMode('register')}>Register</Button>
                  <Button variant={authMode === 'forgot' ? 'primary' : 'secondary'} onClick={() => setAuthMode('forgot')}>Forgot</Button>
                </div>
              )}
              {(authMode === 'register' || currentUser) && (
                <Input className="mt-4" placeholder="Ho ten" value={authForm.fullName} onChange={(event) => setAuthForm({ ...authForm, fullName: event.target.value })} />
              )}
              <Input className="mt-3" placeholder="Email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} />
              {(authMode === 'register' || currentUser) && (
                <>
                  <Input className="mt-3" placeholder="So dien thoai" value={authForm.phone} onChange={(event) => setAuthForm({ ...authForm, phone: event.target.value })} />
                  <Input className="mt-3" placeholder="Dia chi" value={authForm.address} onChange={(event) => setAuthForm({ ...authForm, address: event.target.value })} />
                </>
              )}
              {authMode !== 'forgot' && <Input className="mt-3" placeholder="Mat khau" type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} />}
              {(authMode === 'forgot' || currentUser) && <Input className="mt-3" placeholder="Mat khau moi" type="password" value={authForm.newPassword} onChange={(event) => setAuthForm({ ...authForm, newPassword: event.target.value })} />}
              <div className="mt-4 flex flex-wrap gap-2">
                {!currentUser && authMode === 'login' && <Button onClick={login}><LockKeyhole size={16} />Dang nhap</Button>}
                {!currentUser && authMode === 'register' && <Button onClick={register}>Dang ky</Button>}
                {!currentUser && authMode === 'forgot' && <Button onClick={resetPassword}>Dat lai mat khau</Button>}
                {currentUser && <Button onClick={updateProfile}>Luu ho so</Button>}
                {currentUser && <Button variant="secondary" onClick={() => { setCurrentUser(null); setAuthMode('login'); setToast('Da dang xuat'); }}>Dang xuat</Button>}
              </div>
              {currentUser && (
                <div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm">
                  <strong>{currentUser.fullName}</strong>
                  <p>{currentUser.email} - {currentUser.role}</p>
                </div>
              )}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-4 text-xl font-black">Lich su don hang</h2>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.code} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong>{order.code}</strong>
                      <span className="text-cyan-300">{formatCurrency(order.total)}</span>
                      <span>{order.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{order.items.length} san pham - {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                ))}
                {!orders.length && <p className="text-slate-400">Chua co don hang.</p>}
              </div>
            </div>
          </div>
        </Section>
      )}

      {view === 'admin' && (
        <AdminPanel tab={adminTab} setTab={setAdminTab} products={adminProducts} setProducts={setAdminProducts} editing={editingProduct} setEditing={setEditingProduct} saveProduct={saveProduct} orders={orders} revenue={revenue} users={users} setUsers={setUsers} />
      )}

      {['policy', 'terms', 'guide'].includes(view) && (
        <Section title={view === 'policy' ? 'Chinh sach bao mat' : view === 'terms' ? 'Dieu khoan su dung' : 'Huong dan mua hang'}>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-300">
            <p>Thong tin minh bach ve mua hang, bao mat du lieu, thanh toan, giao hang va ho tro khach hang. Noi dung nay co the chinh sua trong admin khi ket noi database/CMS.</p>
          </div>
        </Section>
      )}

      <footer className="relative z-10 mx-auto mt-12 grid max-w-7xl gap-8 border-t border-white/10 px-4 py-10 text-sm text-slate-400 lg:grid-cols-4">
        <div>
          <strong className="text-lg text-white">{shopName}</strong>
          <p className="mt-3">Thuong mai dien tu cho nguyen lieu, vat lieu, phu kien va san pham so.</p>
        </div>
        <div><strong className="text-white">Ho tro</strong><p className="mt-3">Telegram · Facebook · Zalo</p></div>
        <div><strong className="text-white">Phap ly</strong><div className="mt-3 grid gap-2"><button onClick={() => setView('policy')}>Chinh sach bao mat</button><button onClick={() => setView('terms')}>Dieu khoan</button><button onClick={() => setView('guide')}>Huong dan mua hang</button></div></div>
        <div><strong className="text-white">Thanh toan</strong><p className="mt-3">Chuyen khoan · Vi dien tu · COD</p></div>
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 text-3xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function ProductSection({ title, products, openDetail, addToCart }: { title: string; products: ShopProduct[]; openDetail: (product: ShopProduct) => void; addToCart: (product: ShopProduct) => void }) {
  return (
    <Section title={title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} openDetail={openDetail} addToCart={addToCart} />)}
      </div>
    </Section>
  );
}

function ProductCard({ product, openDetail, addToCart, buyNow, wishlist, setWishlist }: { product: ShopProduct; openDetail: (product: ShopProduct) => void; addToCart: (product: ShopProduct) => void; buyNow?: (product: ShopProduct) => void; wishlist?: string[]; setWishlist?: (value: string[]) => void }) {
  const liked = wishlist?.includes(product.id);
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="h-52 w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-cyan-300">{product.stock > 0 ? `Con ${product.stock}` : 'Het hang'}</span>
        {setWishlist && wishlist && (
          <button className="absolute right-3 top-3 rounded-full bg-black/70 p-2" onClick={() => setWishlist(liked ? wishlist.filter((id) => id !== product.id) : [...wishlist, product.id])}>
            <Heart size={16} className={liked ? 'text-red-400' : 'text-white'} fill={liked ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-widest text-slate-400">{product.category}</p>
        <h3 className="mt-2 min-h-12 font-black">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-400">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <strong className="text-cyan-300">{formatCurrency(product.price)}</strong>
          <span className="flex items-center gap-1 text-sm"><Star size={14} fill="currentColor" className="text-cyan-300" />{product.rating}</span>
        </div>
        <div className="mt-4 grid gap-2">
          <Button onClick={() => openDetail(product)} variant="secondary">Xem chi tiet</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => addToCart(product)}><ShoppingCart size={15} /></Button>
            <Button variant="secondary" onClick={() => buyNow?.(product)}>Mua ngay</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/5 p-3"><span className="text-xs text-slate-400">{label}</span><strong className="block">{value}</strong></div>;
}

function OrderSummary({ subtotal, discount, total, coupon, setCoupon, checkout, label = 'Thanh toan' }: { subtotal: number; discount: number; total: number; coupon: string; setCoupon: (value: string) => void; checkout: () => void; label?: string }) {
  return (
    <div className="h-fit rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-black">Tong don hang</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><span>Tam tinh</span><strong>{formatCurrency(subtotal)}</strong></div>
        <div className="flex justify-between"><span>Giam gia</span><strong>{formatCurrency(discount)}</strong></div>
        <div className="flex justify-between border-t border-white/10 pt-3 text-lg"><span>Tong</span><strong className="text-cyan-300">{formatCurrency(total)}</strong></div>
      </div>
      <Input className="mt-4" placeholder="Ma giam gia: NEON10" value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())} />
      <Button className="mt-4 w-full" onClick={checkout}><CreditCard size={17} />{label}</Button>
    </div>
  );
}

function AdminPanel({ tab, setTab, products, setProducts, editing, setEditing, saveProduct, orders, revenue, users, setUsers }: { tab: AdminTab; setTab: (tab: AdminTab) => void; products: ShopProduct[]; setProducts: (products: ShopProduct[]) => void; editing: ShopProduct; setEditing: (product: ShopProduct) => void; saveProduct: () => void; orders: ShopOrder[]; revenue: number; users: LocalUser[]; setUsers: (users: LocalUser[]) => void }) {
  const lowStock = products.filter((item) => item.stock <= 8);
  return (
    <Section title="Admin Dashboard">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-white/10 bg-white/5 p-3">
          {[
            ['dashboard', 'Tong quan', LayoutDashboard],
            ['products', 'San pham', Boxes],
            ['orders', 'Don hang', PackageCheck],
            ['users', 'Nguoi dung', User],
            ['coupons', 'Ma giam gia', ShieldCheck],
            ['theme', 'Giao dien', Pencil],
            ['payments', 'Thanh toan', CreditCard]
          ].map(([key, label, Icon]) => {
            const AdminIcon = Icon as typeof LayoutDashboard;
            return <button key={key as string} onClick={() => setTab(key as AdminTab)} className={`mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left ${tab === key ? 'bg-cyan-300/15 text-cyan-300' : 'bg-white/5'}`}><AdminIcon size={16} />{label as string}</button>;
          })}
        </aside>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          {tab === 'dashboard' && (
            <>
              <div className="grid gap-4 sm:grid-cols-4">
                <Info label="Doanh thu" value={formatCurrency(revenue)} />
                <Info label="Don hang" value={`${orders.length}`} />
                <Info label="Khach hang" value={`${users.length}`} />
                <Info label="San pham" value={`${products.length}`} />
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div><h3 className="mb-3 font-black">Don hang moi</h3>{orders.slice(0, 5).map((order) => <Info key={order.code} label={order.code} value={order.status} />)}</div>
                <div><h3 className="mb-3 font-black">Sap het hang</h3>{lowStock.map((item) => <Info key={item.id} label={item.name} value={`${item.stock} con lai`} />)}</div>
              </div>
            </>
          )}
          {tab === 'products' && (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-3">{products.map((product) => <div key={product.id} className="flex items-center justify-between rounded-lg bg-black/20 p-3"><span>{product.name}</span><div className="flex gap-2"><Button variant="secondary" onClick={() => setEditing(product)}>Sua</Button><Button variant="secondary" onClick={() => setProducts(products.filter((item) => item.id !== product.id))}><Trash2 size={15} /></Button></div></div>)}</div>
              <div className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                <Input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} />
                <Input value={editing.imageUrl} onChange={(event) => setEditing({ ...editing, imageUrl: event.target.value })} />
                <Input type="number" value={editing.price} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} />
                <Input type="number" value={editing.stock} onChange={(event) => setEditing({ ...editing, stock: Number(event.target.value) })} />
                <Textarea value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} />
                <Button onClick={saveProduct}>Luu san pham</Button>
              </div>
            </div>
          )}
          {tab === 'orders' && <div className="space-y-3">{orders.map((order) => <div key={order.code} className="rounded-lg bg-black/20 p-4"><strong>{order.code}</strong><p>{order.customer.fullName} - {order.customer.phone}</p><p className="text-cyan-300">{formatCurrency(order.total)} · {order.status}</p><Button className="mt-2" variant="secondary" onClick={() => window.print()}>In hoa don</Button></div>)}</div>}
          {tab === 'users' && (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-black/20 p-4">
                  <div>
                    <strong>{user.fullName}</strong>
                    <p className="text-sm text-slate-400">{user.email} - {user.role}</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setUsers(users.map((item) => item.id === user.id ? { ...item, locked: !item.locked } : item))}
                  >
                    {user.locked ? 'Mo khoa' : 'Khoa'}
                  </Button>
                </div>
              ))}
            </div>
          )}
          {tab === 'coupons' && <p>Ma mau: NEON10 giam 10%, FREESHIP giam 30.000 VND. Co the mo rong qua bang Coupon.</p>}
          {tab === 'theme' && <p>Quan ly logo, banner, mau chu dao, footer va social link. Ban hien tai luu local de test nhanh.</p>}
          {tab === 'payments' && <p>Cau hinh ngan hang, vi dien tu, QR thanh toan va xac nhan thu cong.</p>}
        </div>
      </div>
    </Section>
  );
}
