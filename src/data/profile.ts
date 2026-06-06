import {
  Award,
  Bot,
  Code2,
  Facebook,
  Github,
  Globe2,
  MessageCircle,
  Music2,
  Radio,
  Send,
  ShieldCheck,
  Trophy,
  Youtube
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ProjectCategory = 'All' | 'Web' | 'AI' | 'Design' | 'Security';

export type Social = {
  name: string;
  handle: string;
  url: string;
  icon: LucideIcon;
  accent: string;
};

export type Project = {
  title: string;
  category: Exclude<ProjectCategory, 'All'>;
  summary: string;
  details: string;
  stack: string[];
  demoUrl: string;
};

export const socials: Social[] = [
  { name: 'Facebook', handle: '@zinh.profile', url: 'https://facebook.com', icon: Facebook, accent: '#1bb6ff' },
  { name: 'TikTok', handle: '@zinh.cyber', url: 'https://tiktok.com', icon: Music2, accent: '#ff37d6' },
  { name: 'Telegram', handle: '@zinh', url: 'https://telegram.org', icon: Send, accent: '#27fff2' },
  { name: 'Discord', handle: 'zinh#0001', url: 'https://discord.com', icon: MessageCircle, accent: '#a855f7' },
  { name: 'YouTube', handle: 'Zinh Labs', url: 'https://youtube.com', icon: Youtube, accent: '#ff3d71' },
  { name: 'GitHub', handle: 'github.com/zinh', url: 'https://github.com', icon: Github, accent: '#f8fbff' },
  { name: 'Custom Link', handle: 'zinh.dev/hub', url: '#contact', icon: Globe2, accent: '#27fff2' }
];

export const skills = [
  { title: 'Cyber UI Systems', text: 'Glass interfaces, motion design, dark product surfaces.', icon: Code2 },
  { title: 'Automation Labs', text: 'Bots, dashboards, workflows, live status experiences.', icon: Bot },
  { title: 'Security Mindset', text: 'Privacy-first frontend patterns and defensive UX.', icon: ShieldCheck },
  { title: 'Creator Growth', text: 'Social hubs, media kits, community funnels.', icon: Radio }
];

export const timeline = [
  { year: '2026', title: 'Neon Identity OS', text: 'Launched a unified creator profile system with realtime widgets.' },
  { year: '2025', title: 'Automation Studio', text: 'Built AI-assisted dashboards, content pipelines, and notification centers.' },
  { year: '2024', title: 'Portfolio Grid', text: 'Shipped high-converting profile pages and interactive showcases.' }
];

export const projects: Project[] = [
  {
    title: 'Quantum Social Hub',
    category: 'Web',
    summary: 'A link-in-bio system with animated cards and creator analytics.',
    details: 'Premium social hub with verified badges, custom short links, click heatmaps, and animated profile sharing.',
    stack: ['React', 'Tailwind', 'Framer Motion'],
    demoUrl: 'https://example.com'
  },
  {
    title: 'Sentinel Matrix',
    category: 'Security',
    summary: 'Security dashboard concept with live anomaly monitoring.',
    details: 'Realtime-style cyber dashboard including threat widgets, event streams, protected states, and visual alerts.',
    stack: ['TypeScript', 'Three.js', 'GSAP'],
    demoUrl: 'https://example.com'
  },
  {
    title: 'EchoBot AI',
    category: 'AI',
    summary: 'Creator assistant for social replies, captions, and routing.',
    details: 'AI assistant workflow with templates, sentiment routing, automation queues, and multi-language content drafts.',
    stack: ['React', 'AI API', 'Node'],
    demoUrl: 'https://example.com'
  },
  {
    title: 'Holo Brand Kit',
    category: 'Design',
    summary: 'Cyberpunk visual system for badges, cards, and streams.',
    details: 'Identity kit with neon surfaces, avatar frames, achievement badges, QR cards, and stream-ready overlays.',
    stack: ['Figma', 'Motion', 'CSS'],
    demoUrl: 'https://example.com'
  }
];

export const stats = [
  { label: 'Followers', value: 128400, suffix: '+' },
  { label: 'Projects', value: 64, suffix: '' },
  { label: 'Years XP', value: 5, suffix: '+' },
  { label: 'Achievements', value: 31, suffix: '' }
];

export const gallery = [
  { title: 'Neon Alley', height: 'h-80', tone: 'from-cyan-400/40 via-blue-600/20 to-black' },
  { title: 'Control Room', height: 'h-56', tone: 'from-purple-500/40 via-cyan-500/20 to-black' },
  { title: 'Data Temple', height: 'h-72', tone: 'from-blue-500/40 via-purple-600/20 to-black' },
  { title: 'Night Signal', height: 'h-48', tone: 'from-pink-500/35 via-cyan-500/20 to-black' },
  { title: 'Holo ID', height: 'h-64', tone: 'from-cyan-300/35 via-purple-500/25 to-black' },
  { title: 'Skyline Grid', height: 'h-52', tone: 'from-blue-300/30 via-fuchsia-500/20 to-black' }
];

export const badges = [
  { label: 'Verified Creator', icon: Award },
  { label: 'Top Builder', icon: Trophy },
  { label: 'Secure Profile', icon: ShieldCheck }
];

export const translations = {
  en: {
    slogan: 'Building luminous digital identities for the next internet.',
    typing: ['Cyber Creator', 'Full-stack Builder', 'Automation Designer', 'Digital Strategist'],
    intro:
      'Zinh is a future-facing creator profile for social presence, portfolio proof, and realtime personal branding. This page combines visual impact with fast, maintainable frontend architecture.'
  },
  vi: {
    slogan: 'Xay dung danh tinh so ruc sang cho the he internet tiep theo.',
    typing: ['Cyber Creator', 'Full-stack Builder', 'Automation Designer', 'Digital Strategist'],
    intro:
      'Zinh la ho so ca nhan huong tuong lai, ket hop mang xa hoi, portfolio va thuong hieu ca nhan theo thoi gian thuc.'
  }
};
