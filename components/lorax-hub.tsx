'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CloudUpload,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Languages,
  Link2,
  LockKeyhole,
  Moon,
  Play,
  Plus,
  QrCode,
  Send,
  Server,
  Sun,
  Upload,
  Wifi
} from 'lucide-react';
import QRCode from 'qrcode';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { useEffect, useMemo, useRef, useState } from 'react';
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

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

type ApiRow = { name: string; status: string; ping: string; uptime: string };
type UploadedFile = { name: string; size: string; progress: number; url?: string };
type ChatMessage = { role: string; content: string };
type LocalLink = { slug: string; targetUrl: string; shortUrl: string; clicks: number; createdAt: string };

function readLocal<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Large uploaded data URLs can exceed browser quota; ignore and keep current session state.
  }
}

export function LoraxHub() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'EN' | 'VI'>('EN');
  const [chatInput, setChatInput] = useState('Write a secure API route for upload metadata.');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Welcome to **LORAX AI**. Streaming, markdown, file-aware chat is API-ready.' }
  ]);
  const [conversationTitle, setConversationTitle] = useState('Default Conversation');
  const [targetUrl, setTargetUrl] = useState('https://lorax.dev/dashboard');
  const [customSlug, setCustomSlug] = useState('demo');
  const [shortUrl, setShortUrl] = useState('Create a short link to begin');
  const [shortenerStatus, setShortenerStatus] = useState('API + local fallback ready');
  const [linkHistory, setLinkHistory] = useState<LocalLink[]>([]);
  const [qrValue, setQrValue] = useState('https://lorax.dev');
  const [qrData, setQrData] = useState('');
  const [uploadQueue, setUploadQueue] = useState<UploadedFile[]>([
    { name: 'network-audit.pdf', size: '2.8 MB', progress: 100 },
    { name: 'server-banner.png', size: '840 KB', progress: 72 }
  ]);
  const [liveApiRows, setLiveApiRows] = useState<ApiRow[]>(apiRows);
  const [apiStatusMessage, setApiStatusMessage] = useState('Ready to probe services');
  const [fivemStatus, setFivemStatus] = useState({ name: 'LORAX Roleplay', online: 84, maxPlayers: 128, ping: 72 });
  const [visitorStats, setVisitorStats] = useState({ total: '128,904', online: '247' });
  const [adminLogin, setAdminLogin] = useState({ username: 'admin', password: '123456Dinh' });
  const [adminStatus, setAdminStatus] = useState('Not authenticated');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const modeClass = theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-100 text-slate-950';
  const aiPreview = useMemo(() => chatMessages.map((message) => message.content).join('\n'), [chatMessages]);

  useEffect(() => {
    const savedChat = readLocal<ChatMessage[]>('lorax-chat-messages', chatMessages);
    const savedLinks = readLocal<LocalLink[]>('lorax-short-links', []);
    const savedFiles = readLocal<UploadedFile[]>('lorax-uploaded-files', uploadQueue);
    setChatMessages(savedChat);
    setLinkHistory(savedLinks);
    setUploadQueue(savedFiles);

    const redirectSlug = new URLSearchParams(window.location.search).get('go');
    if (redirectSlug) {
      const link = savedLinks.find((item) => item.slug === redirectSlug);
      if (link) {
        const updatedLinks = savedLinks.map((item) =>
          item.slug === redirectSlug ? { ...item, clicks: item.clicks + 1 } : item
        );
        writeLocal('lorax-short-links', updatedLinks);
        window.location.href = link.targetUrl;
      }
    }

    refreshApiStatus();
    refreshFiveM();
    refreshVisitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeLocal('lorax-chat-messages', chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    writeLocal('lorax-short-links', linkHistory);
  }, [linkHistory]);

  useEffect(() => {
    writeLocal('lorax-uploaded-files', uploadQueue);
  }, [uploadQueue]);

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const prompt = chatInput;
    setChatLoading(true);
    setChatMessages((current) => [...current, { role: 'user', content: prompt }, { role: 'assistant', content: '' }]);
    setChatInput('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      if (!response.ok || !response.body) throw new Error('AI route unavailable');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setChatMessages((current) => {
          const next = [...current];
          next[next.length - 1] = { role: 'assistant', content: assistantText };
          return next;
        });
      }
    } catch {
      setChatMessages((current) => {
        const next = [...current];
        next[next.length - 1] = {
          role: 'assistant',
          content: '```ts\nexport async function GET() {\n  return Response.json({ status: "local-fallback" });\n}\n```\nAI API fallback is active. Set `CUSTOM_AI_API_URL` for real model responses.'
        };
        return next;
      });
    } finally {
      setChatLoading(false);
    }
  };

  const generateQr = async () => {
    const data = await QRCode.toDataURL(qrValue, {
      color: { dark: '#00E5FF', light: '#0A0A0A00' },
      margin: 1,
      width: 320
    });
    setQrData(data);
  };

  const createShortLink = async () => {
    setShortenerStatus('Creating...');
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl, slug: customSlug || undefined, title: 'Dashboard link' })
      });
      if (!response.ok) throw new Error('Shortener API unavailable');
      const data = await response.json();
      const slug = data.link.slug;
      const usableShortUrl = data.mode === 'fallback' ? `${window.location.origin}/?go=${slug}` : data.shortUrl || `${window.location.origin}/r/${slug}`;
      setShortUrl(usableShortUrl);
      setLinkHistory((current) => [
        { slug, targetUrl, shortUrl: usableShortUrl, clicks: 0, createdAt: new Date().toISOString() },
        ...current.filter((item) => item.slug !== slug)
      ]);
      setShortenerStatus(data.mode === 'fallback' ? 'Saved locally. Configure PostgreSQL for public redirects.' : 'Saved in PostgreSQL');
    } catch {
      const localSlug = customSlug || Math.random().toString(36).slice(2, 8);
      const localShortUrl = `${window.location.origin}/?go=${localSlug}`;
      setShortUrl(localShortUrl);
      setLinkHistory((current) => [
        { slug: localSlug, targetUrl, shortUrl: localShortUrl, clicks: 0, createdAt: new Date().toISOString() },
        ...current.filter((item) => item.slug !== localSlug)
      ]);
      setShortenerStatus('Local fallback link generated. Configure DATABASE_URL for persistent links.');
    }
  };

  const downloadQrPng = () => {
    if (!qrData) return;
    const link = document.createElement('a');
    link.href = qrData;
    link.download = 'lorax-qr.png';
    link.click();
  };

  const downloadQrSvg = async () => {
    const svg = await QRCode.toString(qrValue, {
      type: 'svg',
      color: { dark: '#00E5FF', light: '#0A0A0A00' },
      margin: 1
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lorax-qr.svg';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleFiles = async (files: FileList | File[]) => {
    const nextFiles = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<UploadedFile>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                size: formatBytes(file.size),
                progress: 100,
                url: typeof reader.result === 'string' ? reader.result : URL.createObjectURL(file)
              });
            };
            reader.onerror = () => resolve({ name: file.name, size: formatBytes(file.size), progress: 100, url: URL.createObjectURL(file) });
            reader.readAsDataURL(file);
          })
      )
    );
    setUploadQueue((current) => [...nextFiles, ...current]);
  };

  const refreshApiStatus = async () => {
    setApiStatusMessage('Probing...');
    try {
      const response = await fetch('/api/status', { cache: 'no-store' });
      if (!response.ok) throw new Error('Status API unavailable');
      const data = await response.json();
      setLiveApiRows(
        data.services.map((service: { name: string; status: string; responseTime: number; uptime: number }) => ({
          name: service.name,
          status: service.status === 'ONLINE' ? 'Online' : service.status,
          ping: `${service.responseTime}ms`,
          uptime: `${service.uptime.toFixed(2)}%`
        }))
      );
      setApiStatusMessage(`Last refresh ${new Date().toLocaleTimeString()}`);
    } catch {
      setLiveApiRows(apiRows);
      setApiStatusMessage('Using demo status. API/database not available.');
    }
  };

  const refreshFiveM = async () => {
    try {
      const response = await fetch('/api/fivem/status', { cache: 'no-store' });
      if (!response.ok) throw new Error('FiveM API unavailable');
      const data = await response.json();
      setFivemStatus({ name: data.name, online: data.online, maxPlayers: data.maxPlayers, ping: data.ping });
    } catch {
      setFivemStatus({ name: 'LORAX Roleplay', online: 84, maxPlayers: 128, ping: 72 });
    }
  };

  const refreshVisitors = async () => {
    try {
      const response = await fetch('/api/visitors', { cache: 'no-store' });
      if (!response.ok) throw new Error('Visitor API unavailable');
      const data = await response.json();
      setVisitorStats({ total: Number(data.total).toLocaleString(), online: String(data.onlineNow) });
    } catch {
      setVisitorStats({ total: '128,904', online: '247' });
    }
  };

  const loginAdmin = async () => {
    setAdminStatus('Authenticating...');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminLogin)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      setAdminStatus(`Authenticated as ${data.role}`);
    } catch (error) {
      setAdminStatus(error instanceof Error ? error.message : 'Login failed');
    }
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
            <Button onClick={sendChat} disabled={chatLoading}><Send size={16} />{chatLoading ? 'Streaming' : 'Send'}</Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}><Upload size={16} />Upload file</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setConversationTitle(`Conversation ${new Date().toLocaleTimeString()}`);
                setChatMessages([{ role: 'assistant', content: 'New conversation created. Ask anything.' }]);
              }}
            >
              <Plus size={16} />New chat
            </Button>
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-300">Active Conversation</p>
            <strong className="mt-1 block">{conversationTitle}</strong>
            <span className="text-xs text-slate-400">{chatMessages.length} messages saved locally</span>
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
          <Input placeholder="Target URL" value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} />
          <Input className="mt-3" placeholder="Custom slug" value={customSlug} onChange={(event) => setCustomSlug(event.target.value)} />
          <Button className="mt-3" onClick={createShortLink}><Link2 size={16} />Shorten</Button>
          <div className="mt-4 rounded-lg bg-black/30 p-3 font-mono text-sm text-cyan-300">{shortUrl}</div>
          <p className="mt-2 text-xs text-slate-400">{shortenerStatus}</p>
          <Button className="mt-3" variant="secondary" onClick={() => navigator.clipboard.writeText(shortUrl)}><Copy size={16} />Copy</Button>
          <div className="mt-4 space-y-2">
            {linkHistory.slice(0, 4).map((link) => (
              <div key={link.slug} className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-cyan-300">/{link.slug}</strong>
                  <span>{link.clicks} clicks</span>
                </div>
                <p className="mt-1 truncate text-slate-400">{link.targetUrl}</p>
                <div className="mt-2 flex gap-2">
                  <a className="font-bold text-cyan-300" href={link.shortUrl}>Open</a>
                  <button className="text-slate-300" onClick={() => navigator.clipboard.writeText(link.shortUrl)}>Copy</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card id="qr" className="p-5">
          <CardHeader eyebrow="QR GENERATOR" title="QR Forge" />
          <Input value={qrValue} onChange={(event) => setQrValue(event.target.value)} />
          <Button className="mt-3" onClick={generateQr}><QrCode size={16} />Generate</Button>
          {qrData && <img src={qrData} alt="Generated QR" className="mt-4 h-40 w-40 rounded-lg border border-cyan-300/30 bg-black p-2" />}
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" onClick={downloadQrPng}><Download size={16} />PNG</Button>
            <Button variant="secondary" onClick={downloadQrSvg}><FileText size={16} />SVG</Button>
          </div>
        </Card>

        <Card id="files" className="p-5">
          <CardHeader eyebrow="FILE UPLOAD CENTER" title="Dropzone" />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files) void handleFiles(event.target.files);
            }}
          />
          <div
            className="rounded-lg border border-dashed border-cyan-300/35 bg-cyan-300/5 p-8 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void handleFiles(event.dataTransfer.files);
            }}
          >
            <CloudUpload className="mx-auto mb-3 text-cyan-300" />
            <p className="font-bold">Drag files here</p>
            <span className="text-sm text-slate-400">Images, videos and documents</span>
            <Button className="mt-4" variant="secondary" onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
          </div>
          <div className="mt-4 space-y-3">
            {uploadQueue.map((file) => (
              <div key={file.name}>
                <div className="mb-1 flex justify-between gap-2 text-xs">
                  <span>{file.name}</span>
                  <span>{file.size}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-cyan-300" style={{ width: `${file.progress}%` }} /></div>
                {file.url && (
                  <div className="mt-2 flex gap-2">
                    <a className="text-xs font-bold text-cyan-300" href={file.url} target="_blank" rel="noreferrer">Open temporary link</a>
                    <button className="text-xs text-slate-300" onClick={() => navigator.clipboard.writeText(file.url ?? '')}>Copy link</button>
                    <button className="text-xs text-red-300" onClick={() => setUploadQueue((current) => current.filter((item) => item.name !== file.name))}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="analytics" className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5">
          <CardHeader eyebrow="VISITOR COUNTER" title="Analytics Overview" />
          <div className="grid gap-3 sm:grid-cols-3">
            {[`Total ${visitorStats.total}`, 'Desktop 58%', 'Chrome 71%', 'Top page /ai', 'Mobile 38%', `Online ${visitorStats.online}`].map((item) => (
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
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">{apiStatusMessage}</p>
            <Button variant="secondary" onClick={refreshApiStatus}>Refresh</Button>
          </div>
          <div className="space-y-3">
            {liveApiRows.map((row) => (
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
                <h3 className="text-2xl font-black">{fivemStatus.name}</h3>
                <p className="text-slate-300">{fivemStatus.online} online / {fivemStatus.maxPlayers} max · {fivemStatus.ping}ms</p>
              </div>
              <Server className="text-cyan-300" />
            </div>
            <div className="mt-5 flex gap-2">
              <Button onClick={refreshFiveM}><Wifi size={16} />Refresh</Button>
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
          <div className="mb-5 grid gap-3 rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-4">
            <Input value={adminLogin.username} onChange={(event) => setAdminLogin({ ...adminLogin, username: event.target.value })} />
            <Input type="password" value={adminLogin.password} onChange={(event) => setAdminLogin({ ...adminLogin, password: event.target.value })} />
            <Button onClick={loginAdmin}><LockKeyhole size={16} />Test JWT Login</Button>
            <span className="text-sm text-cyan-300">{adminStatus}</span>
          </div>
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
