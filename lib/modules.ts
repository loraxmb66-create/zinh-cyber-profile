import {
  Activity,
  Bot,
  ChartNoAxesCombined,
  CloudUpload,
  Gauge,
  Link2,
  MessageSquareText,
  QrCode,
  RadioTower,
  ShieldCheck,
  Users,
  Wifi
} from 'lucide-react';

export const modules = [
  { id: 'ai', title: 'AI Chat Center', icon: Bot, metric: '12 chats', status: 'Streaming ready' },
  { id: 'shortener', title: 'URL Shortener', icon: Link2, metric: '2.4K clicks', status: 'API enabled' },
  { id: 'qr', title: 'QR Generator', icon: QrCode, metric: '5 formats', status: 'PNG/SVG' },
  { id: 'files', title: 'File Upload Center', icon: CloudUpload, metric: '8.2 GB', status: 'Drag & drop' },
  { id: 'visitors', title: 'Visitor Counter', icon: ChartNoAxesCombined, metric: '18.9K visits', status: 'Live analytics' },
  { id: 'social', title: 'Social Hub', icon: Users, metric: '6 networks', status: 'Share profile' },
  { id: 'api', title: 'API Status Center', icon: Activity, metric: '99.98%', status: 'Auto refresh' },
  { id: 'fivem', title: 'FiveM Server Status', icon: Gauge, metric: '84/128', status: 'Live server' },
  { id: 'telegram', title: 'Telegram Manager', icon: MessageSquareText, metric: '7 accounts', status: 'Sessions' },
  { id: 'admin', title: 'Admin Dashboard', icon: ShieldCheck, metric: 'RBAC', status: 'Audit logs' },
  { id: 'rest', title: 'REST API', icon: RadioTower, metric: '/api/docs', status: 'Swagger JSON' },
  { id: 'pwa', title: 'PWA + Cloudflare', icon: Wifi, metric: 'Edge ready', status: 'Optimized' }
];

export const socials = [
  { name: 'Facebook', href: 'https://facebook.com', followers: '12.4K' },
  { name: 'Telegram', href: 'https://telegram.org', followers: '8.8K' },
  { name: 'TikTok', href: 'https://tiktok.com', followers: '31.2K' },
  { name: 'Discord', href: 'https://discord.com', followers: '5.7K' },
  { name: 'GitHub', href: 'https://github.com', followers: '2.1K' },
  { name: 'Instagram', href: 'https://instagram.com', followers: '14.9K' }
];
