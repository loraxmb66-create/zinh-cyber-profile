'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  CloudUpload,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Languages,
  Link2,
  LockKeyhole,
  MessageSquareText,
  Moon,
  Play,
  Plus,
  QrCode,
  Search,
  Send,
  Server,
  ShieldCheck,
  Sun,
  Upload,
  Users,
  Wifi
} from 'lucide-react';
import QRCode from 'qrcode';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';
import { Input, Textarea } from './ui/input';
import { modules, socials } from '@/lib/modules';

const statCards = [
  { label: 'Total Visits', value: '128,904', trend: '+18.2%' },
  { label: 'Online Now', value: '247', trend: 'Live' },
  { label: 'Short Links', value: '1,482', trend: '+322 clicks' },
  { label: 'API Uptime', value: '99.98%', trend: 'Stable' }
];

const apiRows = [
  { name: 'AI Gateway', status: 'Online', ping: '42ms', uptime: '99.99%' },
  { name: 'Short Link API', status: 'Online', ping: '28ms', uptime: '99.98%' },
  { name: 'File CDN', status: 'Online', ping: '61ms', uptime: '99.95%' },
  { name: 'FiveM Probe', status: 'Degraded', ping: '122ms', uptime: '98.41%' }
];

export function LoraxHub() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'EN' | 'VI'>('EN');
  const [chatInput, setChatInput] = useState('Write a secure API route for upload metadata.');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Welcome to **LORAX AI**. Streaming, markdown, file-aware chat is API-ready.' }
  ]);
  const [shortUrl, setShortUrl] = useState('https://lorax.dev/l/demo');
  const [qrValue, setQrValue] = useState('https://lorax.dev');
  const [qrData, setQrData] = useState('');
  const [uploadQueue, setUploadQueue] = useState([
    { name: 'network-audit.pdf', size: '2.8 MB', progress: 100 },
    { name: 'server-banner.png', size: '840 KB', progress: 72 }
  ]);

  const modeClass = theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-100 text-slate-950';
  const aiPreview = useMemo(() => chatMessages.map((message) => message.content).join('\n'), [chatMessages]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((current) => [
      ...current,
      { role: 'user', content: chatInput },
      {
        role: 'assistant',
        content: '```ts\nexport async function GET() {\n  return Response.json({ status: "secured" });\n}\n```\nThis response is mocked locally. Wire `/api/ai/chat` to your custom API for real streaming.'
      }
    ]);
    setChatInput('');
  };

  const generateQr = async () => {
    const data = await QRCode.toDataURL(qrValue, {
      color: { dark: '#00E5FF', light: '#0A0A0A00' },
      margin: 1,
      width: 320
    });
    setQrData(data);
  };

  return (
    <main className={`min-h-screen overflow-hidden ${modeClass}`}>
      <div className="animated-grid" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="#home" className="text-lg font-black tracking-wide">
            LORAX<span className="text-cyan-300"> HUB</span>
          </a>
          <div className="hidden items-center gap-4 text-sm text-slate-300 lg:flex">
            {['AI', 'Shortener', 'QR', 'Files', 'Analytics', 'Status', 'FiveM', 'Telegram', 'Admin'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-cyan-300">
                {item}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setLang(lang === 'EN' ? 'VI' : 'EN')}><Languages size={16} />{lang}</Button>
            <Button variant="secondary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </nav>
      </header>

      <section id="home" className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.28em] text-cyan-300">
            Everything Connected
          </p>
          <h1 className="neon-text text-5xl font-black leading-tight md:text-7xl">LORAX HUB</h1>
          <p className="mt-5 max-w-2xl text-xl text-slate-300">Everything Connected. Everything Under Control.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button><Play size={18} />Open Dashboard</Button>
            <Button variant="secondary"><ExternalLink size={18} />API Docs</Button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.label} className="p-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</span>
                <strong className="mt-2 block text-2xl text-white">{stat.value}</strong>
                <em className="text-sm not-italic text-cyan-300">{stat.trend}</em>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div className="relative" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <div className="absolute -inset-6 rounded-full bg-cyan-300/20 blur-3xl" />
          <Card className="relative p-4">
            <img src="/assets/zinh-avatar.png" alt="Lorax avatar" className="aspect-square w-full rounded-lg object-cover" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {socials.slice(0, 6).map((social) => (
                <a key={social.name} href={social.href} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center text-xs font-bold hover:border-cyan-300/45">
                  {social.name}
                  <span className="block text-cyan-300">{social.followers}</span>
                </a>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="p-5">
                <Icon className="mb-4 text-cyan-300" />
                <h3 className="font-black">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{module.status}</p>
                <strong className="mt-4 block text-cyan-300">{module.metric}</strong>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="ai" className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[.8fr_1.2fr]">
        <Card className="p-5">
          <CardHeader eyebrow="AI CHAT CENTER" title="Streaming AI Console" />
          <Textarea rows={5} value={chatInput} onChange={(event) => setChatInput(event.target.value)} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={sendChat}><Send size={16} />Send</Button>
            <Button variant="secondary"><Upload size={16} />Upload file</Button>
            <Button variant="secondary"><Plus size={16} />New chat</Button>
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black">Conversation Preview</h3>
            <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-300">Markdown + Code</span>
          </div>
          <div className="scrollbar-thin max-h-[24rem] overflow-auto rounded-lg bg-black/30 p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {aiPreview}
            </ReactMarkdown>
          </div>
        </Card>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-3">
        <Card id="shortener" className="p-5">
          <CardHeader eyebrow="URL SHORTENER" title="Link Command" />
          <Input placeholder="Target URL" defaultValue="https://lorax.dev/dashboard" />
          <Input className="mt-3" placeholder="Custom slug" defaultValue="demo" />
          <Button className="mt-3" onClick={() => setShortUrl('https://lor.ax/demo')}><Link2 size={16} />Shorten</Button>
          <div className="mt-4 rounded-lg bg-black/30 p-3 font-mono text-sm text-cyan-300">{shortUrl}</div>
        </Card>

        <Card id="qr" className="p-5">
          <CardHeader eyebrow="QR GENERATOR" title="QR Forge" />
          <Input value={qrValue} onChange={(event) => setQrValue(event.target.value)} />
          <Button className="mt-3" onClick={generateQr}><QrCode size={16} />Generate</Button>
          {qrData && <img src={qrData} alt="Generated QR" className="mt-4 h-40 w-40 rounded-lg border border-cyan-300/30 bg-black p-2" />}
          <div className="mt-3 flex gap-2">
            <Button variant="secondary"><Download size={16} />PNG</Button>
            <Button variant="secondary"><FileText size={16} />SVG</Button>
          </div>
        </Card>

        <Card id="files" className="p-5">
          <CardHeader eyebrow="FILE UPLOAD CENTER" title="Dropzone" />
          <div className="rounded-lg border border-dashed border-cyan-300/35 bg-cyan-300/5 p-8 text-center">
            <CloudUpload className="mx-auto mb-3 text-cyan-300" />
            <p className="font-bold">Drag files here</p>
            <span className="text-sm text-slate-400">Images, videos and documents</span>
          </div>
          <div className="mt-4 space-y-3">
            {uploadQueue.map((file) => (
              <div key={file.name}>
                <div className="mb-1 flex justify-between text-xs"><span>{file.name}</span><span>{file.size}</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-cyan-300" style={{ width: `${file.progress}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="analytics" className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5">
          <CardHeader eyebrow="VISITOR COUNTER" title="Analytics Overview" />
          <div className="grid gap-3 sm:grid-cols-3">
            {['Vietnam 42%', 'Desktop 58%', 'Chrome 71%', 'Top page /ai', 'Mobile 38%', 'Online 247'].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-bold">{item}</div>
            ))}
          </div>
          <div className="mt-5 flex h-40 items-end gap-2 rounded-lg bg-black/25 p-4">
            {[44, 62, 48, 88, 70, 96, 82, 110, 92, 120].map((height, index) => (
              <div key={index} className="flex-1 rounded-t bg-gradient-to-t from-violet-500 to-cyan-300" style={{ height }} />
            ))}
          </div>
        </Card>
        <Card id="social" className="p-5">
          <CardHeader eyebrow="SOCIAL HUB" title="Connected Profiles" />
          <div className="space-y-3">
            {socials.map((social) => (
              <a key={social.name} href={social.href} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="font-bold">{social.name}</span>
                <span className="text-cyan-300">{social.followers}</span>
              </a>
            ))}
          </div>
        </Card>
      </section>

      <section id="status" className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-2">
        <Card id="api" className="p-5">
          <CardHeader eyebrow="API STATUS CENTER" title="Service Health" />
          <div className="space-y-3">
            {apiRows.map((row) => (
              <div key={row.name} className="grid grid-cols-4 items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
                <strong>{row.name}</strong>
                <span className={row.status === 'Online' ? 'text-emerald-300' : 'text-yellow-300'}>{row.status}</span>
                <span>{row.ping}</span>
                <span>{row.uptime}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card id="fivem" className="p-5">
          <CardHeader eyebrow="FIVEM SERVER STATUS" title="LORAX RP" />
          <div className="rounded-lg bg-gradient-to-r from-cyan-300/20 to-violet-500/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black">LORAX Roleplay</h3>
                <p className="text-slate-300">84 online / 128 max</p>
              </div>
              <Server className="text-cyan-300" />
            </div>
            <div className="mt-5 flex gap-2">
              <Button><Wifi size={16} />Connect</Button>
              <Button variant="secondary">Discord</Button>
            </div>
          </div>
        </Card>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-2">
        <Card id="telegram" className="p-5">
          <CardHeader eyebrow="TELEGRAM ACCOUNT MANAGER" title="Session Vault" />
          <Input placeholder="Search account" />
          <div className="mt-4 space-y-3">
            {['@lorax_admin', '@lorax_support', '@lorax_alerts'].map((account) => (
              <div key={account} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <div>
                  <strong>{account}</strong>
                  <p className="text-sm text-slate-400">Last login: Today</p>
                </div>
                <Button variant="secondary">Export</Button>
              </div>
            ))}
          </div>
        </Card>
        <Card id="admin" className="p-5">
          <CardHeader eyebrow="ADMIN DASHBOARD" title="Control Matrix" />
          <div className="grid gap-3 sm:grid-cols-2">
            {['Users', 'Files', 'Short Links', 'AI Logs', 'Telegram', 'API', 'FiveM', 'Audit Logs'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="font-bold">{item}</span>
                <ArrowRight size={16} className="text-cyan-300" />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-2 px-4 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>© 2026 LORAX HUB</span>
        <span>Powered by LORAX</span>
        <a href="/api/docs" className="text-cyan-300">Swagger Documentation</a>
      </footer>
    </main>
  );
}
