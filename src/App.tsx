import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import {
  ChevronRight,
  Clock3,
  CloudSun,
  Copy,
  CopyCheck,
  Fingerprint,
  Image as ImageIcon,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  MoonStar,
  Pause,
  Play,
  QrCode,
  RefreshCw,
  Router,
  Search,
  Send,
  Server,
  Share2,
  Shield,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Upload,
  Volume2,
  X,
  Zap
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { CursorAura } from './components/CursorAura';
import { NeuralBackground } from './components/NeuralBackground';
import { Section } from './components/Section';
import { ADMIN_SESSION_KEY, defaultSiteContent, loadRemoteSiteContent, loadSiteContent, saveSiteContent } from './data/adminContent';
import type { SiteContent } from './data/adminContent';
import { badges, gallery, projects, skills, socials, stats, timeline, translations } from './data/profile';
import type { Project, ProjectCategory } from './data/profile';
import { useClock } from './hooks/useClock';
import { useTyping } from './hooks/useTyping';
import type { LucideIcon } from 'lucide-react';

const categories: ProjectCategory[] = ['All', 'Web', 'AI', 'Design', 'Security'];
type GalleryViewItem = (typeof gallery)[number] & { imageUrl?: string };

export function App() {
  const [content, setContent] = useState<SiteContent>(() => loadSiteContent());
  const [loaded, setLoaded] = useState(false);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [matrix, setMatrix] = useState(false);
  const [snow, setSnow] = useState(false);
  const [rain, setRain] = useState(true);
  const [accent, setAccent] = useState('#27fff2');
  const [clickSound, setClickSound] = useState(true);
  const [syncing, setSyncing] = useState(true);
  const [category, setCategory] = useState<ProjectCategory>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState<GalleryViewItem | null>(null);
  const [notice, setNotice] = useState('Zinh is online now');
  const [visitors, setVisitors] = useState(12048);
  const [music, setMusic] = useState(false);
  const [publicIp, setPublicIp] = useState('Checking...');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [urlInput, setUrlInput] = useState('https://example.com');
  const [urlResult, setUrlResult] = useState('Ready');
  const [hashInput, setHashInput] = useState('Zinh');
  const [hashResult, setHashResult] = useState('');
  const audioRef = useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);
  const clock = useClock();
  const copyGuardRef = useRef<HTMLDivElement | null>(null);
  const isAdminRoute = window.location.pathname.replace(/\/$/, '') === '/admin';

  const t = translations[language];
  const typing = useTyping(t.typing);
  const mergedSocials = socials.map((social, index) => ({ ...social, ...(content.socials[index] ?? {}) }));
  const mergedGallery = gallery.map((item, index) => ({ ...item, ...(content.gallery[index] ?? {}) }));
  const filteredProjects = useMemo(
    () => (category === 'All' ? projects : projects.filter((project) => project.category === category)),
    [category]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    setSyncing(true);
    loadRemoteSiteContent()
      .then((remoteContent) => {
        if (active) setContent(remoteContent);
      })
      .catch(() => {
        if (active) setNotice('Using offline content cache');
      })
      .finally(() => {
        if (active) setSyncing(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    gsap.fromTo(
      '.gsap-rise',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
    );
  }, [loaded, language]);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem('zinh-visitors') ?? '12048');
    const next = stored + 1;
    window.localStorage.setItem('zinh-visitors', String(next));
    setVisitors(next);
  }, []);

  useEffect(() => {
    const messages = ['New portfolio view detected', 'Telegram channel synced', 'Achievement unlocked: Neon Architect'];
    const timer = window.setInterval(() => {
      setNotice(messages[Math.floor(Math.random() * messages.length)]);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: { ip?: string }) => setPublicIp(data.ip ?? 'Unavailable'))
      .catch(() => setPublicIp('Unavailable'));
  }, []);

  useEffect(() => {
    const warn = (event: Event) => {
      event.preventDefault();
      setNotice('Protected profile: copy and inspect actions are limited');
    };
    const keyWarn = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key))) {
        event.preventDefault();
        setNotice('Anti-inspect warning activated');
      }
    };
    document.addEventListener('contextmenu', warn);
    document.addEventListener('copy', warn);
    document.addEventListener('keydown', keyWarn);
    return () => {
      document.removeEventListener('contextmenu', warn);
      document.removeEventListener('copy', warn);
      document.removeEventListener('keydown', keyWarn);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  useEffect(() => {
    let ctx: AudioContext | null = null;
    const interactiveSelector = 'button, a, input, textarea, select, label, [role="button"], .social-card, .project-card, .gallery-tile';

    const playClick = (event: PointerEvent) => {
      if (!clickSound) return;
      const target = event.target as HTMLElement | null;
      if (!target?.closest(interactiveSelector)) return;

      const AudioCtor =
        window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return;

      ctx ??= new AudioCtor();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(1240, now);
      oscillator.frequency.exponentialRampToValueAtTime(620, now + 0.055);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.095);
    };

    window.addEventListener('pointerdown', playClick, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', playClick);
      ctx?.close();
    };
  }, [clickSound]);

  const handleSaveContent = async (nextContent: SiteContent) => {
    const savedContent = await saveSiteContent(nextContent);
    setContent(savedContent);
    setNotice('Admin changes saved to Supabase');
    return savedContent;
  };

  const handleReloadContent = async () => {
    const remoteContent = await loadRemoteSiteContent();
    setContent(remoteContent);
    return remoteContent;
  };

  const toggleMusic = () => {
    if (music) {
      audioRef.current?.ctx.close();
      audioRef.current = null;
      setMusic(false);
      return;
    }
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = new AudioCtor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 108;
    gain.gain.value = 0.025;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    audioRef.current = { ctx, osc, gain };
    setMusic(true);
  };

  const shareProfile = async () => {
    const text = 'Zinh | Cyber Profile';
    try {
      if (navigator.share) await navigator.share({ title: text, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
      setNotice('Profile card shared');
    } catch {
      setNotice('Share cancelled');
    }
  };

  const browserDetails = getBrowserDetails();
  const networkDetails = getNetworkDetails();

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice('Copied to clipboard');
    } catch {
      setNotice('Clipboard unavailable');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=';
    const bytes = new Uint32Array(18);
    crypto.getRandomValues(bytes);
    const password = Array.from(bytes, (value) => chars[value % chars.length]).join('');
    setGeneratedPassword(password);
  };

  const inspectUrl = () => {
    try {
      const parsed = new URL(urlInput);
      setUrlResult(`${parsed.protocol.replace(':', '').toUpperCase()} | ${parsed.hostname} | ${parsed.pathname || '/'}`);
    } catch {
      setUrlResult('Invalid URL');
    }
  };

  const hashText = async () => {
    const bytes = new TextEncoder().encode(hashInput);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    setHashResult(Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(''));
  };

  if (isAdminRoute) {
    return (
      <AdminPage
        content={content}
        onSave={handleSaveContent}
        onReload={handleReloadContent}
        syncing={syncing}
      />
    );
  }

  return (
    <div ref={copyGuardRef} className={`min-h-screen bg-void text-slate-100 ${matrix ? 'matrix-mode' : ''}`}>
      <AnimatePresence>
        {!loaded && (
          <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <div className="loader-core" />
            <p>INITIALIZING ZINH OS</p>
          </motion.div>
        )}
      </AnimatePresence>

      <NeuralBackground matrix={matrix} />
      <CursorAura />
      {rain && <div className="rain-layer" />}
      {snow && <div className="snow-layer" />}

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#hero" className="font-display text-lg font-black text-white">
            ZINH<span className="text-neon-cyan">.OS</span>
          </a>
          <div className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
            {['about', 'social', 'portfolio', 'stats', 'toolkit', 'gallery', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} className="hover:text-neon-cyan">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {syncing ? <span className="sync-pill">Syncing</span> : <span className="status-dot" />}
            <a className="icon-btn" href="/admin" aria-label="Admin">
              <Shield size={15} />
            </a>
            <button className="icon-btn" onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')} aria-label="Switch language">
              {language.toUpperCase()}
            </button>
          </div>
        </nav>
      </header>

      <main className="relative overflow-hidden pt-16">
        <section id="hero" className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="gsap-rise">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-neon-cyan">
              <Sparkles size={14} /> {content.heroBadge}
            </p>
            <h1 className="font-display text-5xl font-black leading-tight text-white sm:text-7xl lg:text-8xl">
              {content.name}
              <span className="block text-glow text-2xl text-neon-cyan sm:text-4xl">{typing}<span className="typing-caret">|</span></span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{language === 'en' ? content.slogan : t.slogan}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#portfolio" className="primary-btn">
                View Portfolio <ChevronRight size={18} />
              </a>
              <button onClick={shareProfile} className="secondary-btn">
                <Share2 size={18} /> Share Card
              </button>
            </div>
          </div>

          <motion.div className="avatar-shell gsap-rise" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="avatar-ring">
              <img src={content.avatarUrl || '/assets/zinh-avatar.png'} alt="Zinh cyberpunk avatar" loading="eager" />
            </div>
            <div className="profile-card">
              <span className="status-dot" /> {content.statusText}
            </div>
          </motion.div>
        </section>

        <Section id="about" eyebrow="Identity Core" title="About Me">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass p-6 text-slate-300">{language === 'en' ? content.intro : t.intro}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div className="glass p-5" key={skill.title}>
                    <Icon className="mb-4 text-neon-cyan" />
                    <h3 className="mb-2 font-display font-bold text-white">{skill.title}</h3>
                    <p className="text-sm text-slate-400">{skill.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {timeline.map((item) => (
              <div className="timeline-item" key={item.year}>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="social" eyebrow="Signal Network" title="Social Hub">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mergedSocials.map((social) => {
              const Icon = social.icon;
              return (
                <a className="social-card" href={social.url} key={social.name} style={{ '--social': social.accent } as CSSProperties}>
                  <Icon />
                  <strong>{social.name}</strong>
                  <span>{social.handle}</span>
                </a>
              );
            })}
          </div>
        </Section>

        <Section id="portfolio" eyebrow="Proof Deck" title="Portfolio">
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button className={`chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredProjects.map((project) => (
              <button className="project-card text-left" key={project.title} onClick={() => setSelectedProject(project)}>
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div>{project.stack.join(' / ')}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section id="stats" eyebrow="Telemetry" title="Statistics Dashboard">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div className="glass stat-card p-5" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value.toLocaleString()}{stat.suffix}</strong>
                <div className="chart"><i style={{ height: `${42 + index * 13}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Widget icon={Clock3} label="Clock" value={clock} />
            <Widget icon={CloudSun} label="Weather" value="Cyber mist 27C" />
            <Widget icon={Zap} label="Visitors" value={visitors.toLocaleString()} />
            <Widget icon={Sparkles} label="Live Notice" value={notice} />
          </div>
        </Section>

        <Section id="gallery" eyebrow="Visual Archive" title="Gallery">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {mergedGallery.map((item) => (
              <button
                className={`gallery-tile ${item.height} bg-gradient-to-br ${item.tone}`}
                key={item.title}
                onClick={() => setLightbox(item)}
                style={item.imageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,.12), rgba(0,0,0,.55)), url(${item.imageUrl})` } : undefined}
              >
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section id="toolkit" eyebrow="Operator Tools" title="IT Toolkit">
          <div className="toolkit-grid">
            <div className="glass toolkit-panel">
              <div className="toolkit-head">
                <Router className="text-neon-cyan" />
                <div>
                  <h3>Network Scanner</h3>
                  <span>Public IP and connection context</span>
                </div>
              </div>
              <div className="toolkit-readout">
                <span>Public IP</span>
                <strong>{publicIp}</strong>
                <button className="icon-btn" onClick={() => copyValue(publicIp)} aria-label="Copy IP"><Copy size={15} /></button>
              </div>
              <div className="toolkit-mini-grid">
                <InfoPill label="Protocol" value={window.location.protocol.replace(':', '').toUpperCase()} />
                <InfoPill label="Host" value={window.location.hostname} />
                <InfoPill label="Network" value={networkDetails.type} />
                <InfoPill label="Speed" value={networkDetails.downlink} />
              </div>
              <button className="secondary-btn w-fit" onClick={() => window.location.reload()}>
                <RefreshCw size={16} /> Refresh Probe
              </button>
            </div>

            <div className="glass toolkit-panel">
              <div className="toolkit-head">
                <MonitorSmartphone className="text-neon-cyan" />
                <div>
                  <h3>Browser Fingerprint</h3>
                  <span>Live client diagnostics</span>
                </div>
              </div>
              <div className="toolkit-mini-grid">
                <InfoPill label="Browser" value={browserDetails.browser} />
                <InfoPill label="OS" value={browserDetails.os} />
                <InfoPill label="Language" value={navigator.language} />
                <InfoPill label="Timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
                <InfoPill label="Screen" value={`${screen.width}x${screen.height}`} />
                <InfoPill label="Viewport" value={`${window.innerWidth}x${window.innerHeight}`} />
              </div>
              <button className="secondary-btn w-fit" onClick={() => copyValue(navigator.userAgent)}>
                <Fingerprint size={16} /> Copy User Agent
              </button>
            </div>

            <div className="glass toolkit-panel">
              <div className="toolkit-head">
                <Search className="text-neon-cyan" />
                <div>
                  <h3>URL Inspector</h3>
                  <span>Parse protocol, host, and path</span>
                </div>
              </div>
              <input value={urlInput} onChange={(event) => setUrlInput(event.target.value)} aria-label="URL inspector" />
              <div className="toolkit-output">{urlResult}</div>
              <button className="primary-btn w-fit" onClick={inspectUrl}>Analyze URL</button>
            </div>

            <div className="glass toolkit-panel">
              <div className="toolkit-head">
                <KeyRound className="text-neon-cyan" />
                <div>
                  <h3>Security Utility</h3>
                  <span>Password and SHA-256 helper</span>
                </div>
              </div>
              <button className="primary-btn w-fit" onClick={generatePassword}>Generate Password</button>
              <div className="toolkit-output with-copy">
                <span>{generatedPassword || 'No password generated yet'}</span>
                <button className="icon-btn" onClick={() => copyValue(generatedPassword)} aria-label="Copy password"><CopyCheck size={15} /></button>
              </div>
              <input value={hashInput} onChange={(event) => setHashInput(event.target.value)} aria-label="Hash input" />
              <button className="secondary-btn w-fit" onClick={hashText}>SHA-256 Hash</button>
              <div className="toolkit-output hash">{hashResult || 'Hash output'}</div>
            </div>

            <div className="glass toolkit-panel toolkit-wide">
              <div className="toolkit-head">
                <Server className="text-neon-cyan" />
                <div>
                  <h3>System Snapshot</h3>
                  <span>Useful data for IT support tickets</span>
                </div>
              </div>
              <div className="toolkit-mini-grid dense">
                <InfoPill label="Cookies" value={navigator.cookieEnabled ? 'Enabled' : 'Blocked'} />
                <InfoPill label="Online" value={navigator.onLine ? 'Online' : 'Offline'} />
                <InfoPill label="CPU Cores" value={String(navigator.hardwareConcurrency ?? 'Unknown')} />
                <InfoPill label="Device Memory" value={getDeviceMemory()} />
                <InfoPill label="Color Depth" value={`${screen.colorDepth} bit`} />
                <InfoPill label="Touch Points" value={String(navigator.maxTouchPoints ?? 0)} />
              </div>
            </div>
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact Center" title="Connect With Zinh">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <form className="glass grid gap-4 p-6" onSubmit={(event) => { event.preventDefault(); setNotice('Message encrypted and queued'); }}>
              <input placeholder="Name" aria-label="Name" />
              <input placeholder="Email" type="email" aria-label="Email" />
              <textarea placeholder="Message" aria-label="Message" rows={5} />
              <button className="primary-btn w-fit" type="submit">Send Message <Send size={18} /></button>
            </form>
            <div className="grid gap-4">
              <div className="glass grid grid-cols-3 gap-3 p-5">
                <a className="contact-btn" href={`mailto:${content.email}`}><Mail /> Email</a>
                <a className="contact-btn" href={content.messengerUrl}><MessageCircle /> Messenger</a>
                <a className="contact-btn" href={content.telegramUrl}><Send /> Telegram</a>
              </div>
              <div className="glass flex items-center gap-5 p-5">
                <div className="qr"><QrCode size={92} /></div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">QR Profile Card</h3>
                  <p className="mt-2 text-sm text-slate-400">Scan-ready contact panel for fast sharing.</p>
                  <button className="secondary-btn mt-4" onClick={shareProfile}><Copy size={16} /> Copy Link</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return <span className="badge" key={badge.label}><Icon size={16} />{badge.label}</span>;
                })}
              </div>
            </div>
          </div>
        </Section>
        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="highlight-band">
            <div>
              <p>{content.highlightTitle}</p>
              <h2>{content.highlightText}</h2>
            </div>
            <a href="#contact" className="primary-btn">Connect Now <ChevronRight size={18} /></a>
          </div>
          <footer className="site-footer">
            <strong>{content.footerTitle}</strong>
            <span>{content.footerText}</span>
            <a href="/admin">Admin</a>
          </footer>
        </section>
      </main>

      <aside className="control-panel">
        <button className="icon-btn" onClick={toggleMusic} aria-label="Toggle music">{music ? <Pause size={16} /> : <Play size={16} />}</button>
        <button className={`icon-btn ${clickSound ? 'sound-on' : ''}`} onClick={() => setClickSound((value) => !value)} aria-label="Toggle click sound">
          <Zap size={16} />
        </button>
        <button className="icon-btn" onClick={() => setMatrix((value) => !value)} aria-label="Matrix mode"><MoonStar size={16} /></button>
        <button className="icon-btn" onClick={() => setRain((value) => !value)} aria-label="Rain mode"><Volume2 size={16} /></button>
        <button className="icon-btn" onClick={() => setSnow((value) => !value)} aria-label="Snow mode"><Snowflake size={16} /></button>
        <label className="color-dot" aria-label="Theme accent"><SlidersHorizontal size={16} /><input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label>
      </aside>

      <AnimatePresence>
        {selectedProject && (
          <Modal onClose={() => setSelectedProject(null)}>
            <span className="modal-kicker">{selectedProject.category}</span>
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.details}</p>
            <div className="modal-stack">{selectedProject.stack.map((item) => <span key={item}>{item}</span>)}</div>
            <a className="primary-btn mt-6 w-fit" href={selectedProject.demoUrl}>Live Demo <ChevronRight size={18} /></a>
          </Modal>
        )}
        {lightbox && (
          <Modal onClose={() => setLightbox(null)}>
            <div
              className={`lightbox-art bg-gradient-to-br ${lightbox.tone}`}
              style={'imageUrl' in lightbox && lightbox.imageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,.08), rgba(0,0,0,.42)), url(${lightbox.imageUrl})` } : undefined}
            />
            <h3>{lightbox.title}</h3>
            <p>High-contrast holographic gallery frame with responsive lightbox viewing.</p>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Widget({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="glass widget p-4">
      <Icon className="text-neon-cyan" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getBrowserDetails() {
  const ua = navigator.userAgent;
  const browser =
    ua.includes('Edg/')
      ? 'Microsoft Edge'
      : ua.includes('OPR/')
        ? 'Opera'
        : ua.includes('Chrome/')
          ? 'Google Chrome'
          : ua.includes('Firefox/')
            ? 'Mozilla Firefox'
            : ua.includes('Safari/')
              ? 'Safari'
              : 'Unknown';

  const os =
    ua.includes('Windows')
      ? 'Windows'
      : ua.includes('Android')
        ? 'Android'
        : ua.includes('iPhone') || ua.includes('iPad')
          ? 'iOS'
          : ua.includes('Mac OS')
            ? 'macOS'
            : ua.includes('Linux')
              ? 'Linux'
              : 'Unknown';

  return { browser, os };
}

function getNetworkDetails() {
  const connection = (navigator as Navigator & {
    connection?: { effectiveType?: string; downlink?: number };
  }).connection;

  return {
    type: connection?.effectiveType?.toUpperCase() ?? 'Unknown',
    downlink: connection?.downlink ? `${connection.downlink} Mbps` : 'Unknown'
  };
}

function getDeviceMemory() {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return memory ? `${memory} GB` : 'Unknown';
}

function AdminPage({
  content,
  onSave,
  onReload,
  syncing
}: {
  content: SiteContent;
  onSave: (content: SiteContent) => Promise<SiteContent>;
  onReload: () => Promise<SiteContent>;
  syncing: boolean;
}) {
  const [authed, setAuthed] = useState(() => window.localStorage.getItem(ADMIN_SESSION_KEY) === 'active');
  const [login, setLogin] = useState({ username: '', password: '' });
  const [draft, setDraft] = useState<SiteContent>(content);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(content);
  }, [content, dirty]);

  const submitLogin = (event: FormEvent) => {
    event.preventDefault();
    if (login.username === 'admin' && login.password === '123456Dinh') {
      window.localStorage.setItem(ADMIN_SESSION_KEY, 'active');
      setAuthed(true);
      setMessage('Dang nhap thanh cong');
      return;
    }
    setMessage('Sai tai khoan hoac mat khau');
  };

  const updateDraft = (key: keyof SiteContent, value: string) => {
    setDirty(true);
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateSocial = (index: number, key: 'handle' | 'url', value: string) => {
    setDirty(true);
    setDraft((current) => ({
      ...current,
      socials: current.socials.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    }));
  };

  const updateGallery = (index: number, key: 'title' | 'imageUrl', value: string) => {
    setDirty(true);
    setDraft((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    }));
  };

  const uploadImage = (file: File | undefined, callback: (value: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('Dang luu len Supabase...');
    try {
      const savedContent = await onSave(draft);
      setDraft(savedContent);
      setDirty(false);
      setMessage('Da luu len Supabase. Tat ca nguoi xem se thay noi dung moi.');
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error
            ? JSON.stringify(error)
            : 'Unknown Supabase error';
      setMessage(`Chua luu duoc len Supabase: ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  const reloadRemote = async () => {
    setSaving(true);
    setMessage('Dang tai lai tu Supabase...');
    try {
      const remoteContent = await onReload();
      setDraft(remoteContent);
      setDirty(false);
      setMessage('Da tai lai noi dung moi nhat tu Supabase.');
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error
            ? JSON.stringify(error)
            : 'Unknown Supabase error';
      setMessage(`Chua tai duoc tu Supabase: ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  if (!authed) {
    return (
      <div className="admin-page">
        <NeuralBackground matrix />
        <form className="admin-login glass" onSubmit={submitLogin}>
          <LockKeyhole className="text-neon-cyan" size={34} />
          <h1>Admin Access</h1>
          <p>Dang nhap de chinh sua noi dung website.</p>
          <input value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} placeholder="Tai khoan" />
          <input value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} placeholder="Mat khau" type="password" />
          <button className="primary-btn w-full" type="submit">Dang nhap <ChevronRight size={18} /></button>
          {message && <span className="admin-message">{message}</span>}
          <a href="/" className="secondary-btn w-full">Ve trang chu</a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <NeuralBackground matrix={false} />
      <header className="admin-topbar">
        <a href="/" className="font-display text-lg font-black text-white">ZINH<span className="text-neon-cyan">.ADMIN</span></a>
        <div className="flex gap-2">
          <button
            className="secondary-btn"
            onClick={() => {
              window.localStorage.removeItem(ADMIN_SESSION_KEY);
              setAuthed(false);
            }}
          >
            Dang xuat
          </button>
          <a className="primary-btn" href="/">Xem website</a>
        </div>
      </header>

      <form className="admin-shell" onSubmit={save}>
        <section className="admin-hero-panel glass">
          <div>
            <p className="admin-kicker">Control Center</p>
            <h1>Chinh sua giao dien Zinh</h1>
            <span>{message || (syncing ? 'Dang dong bo du lieu tu Supabase...' : dirty ? 'Ban co thay doi chua luu.' : 'Du lieu da dong bo voi Supabase.')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="primary-btn" type="submit" disabled={saving}><Upload size={18} /> {saving ? 'Dang luu' : 'Luu thay doi'}</button>
            <button className="secondary-btn" type="button" onClick={reloadRemote} disabled={saving}>
              Tai tu Supabase
            </button>
            <button className="secondary-btn" type="button" onClick={() => { setDirty(true); setDraft(defaultSiteContent); }}>
              Khoi phuc mac dinh
            </button>
          </div>
        </section>

        <section className="admin-grid">
          <div className="glass admin-card">
            <h2>Noi dung chinh</h2>
            <label>Ten hien thi<input value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} /></label>
            <label>Badge hero<input value={draft.heroBadge} onChange={(event) => updateDraft('heroBadge', event.target.value)} /></label>
            <label>Trang thai<input value={draft.statusText} onChange={(event) => updateDraft('statusText', event.target.value)} /></label>
            <label>Slogan<textarea rows={3} value={draft.slogan} onChange={(event) => updateDraft('slogan', event.target.value)} /></label>
            <label>Gioi thieu<textarea rows={5} value={draft.intro} onChange={(event) => updateDraft('intro', event.target.value)} /></label>
          </div>

          <div className="glass admin-card">
            <h2>Hinh anh</h2>
            <div className="admin-preview">
              <img src={draft.avatarUrl || '/assets/zinh-avatar.png'} alt="Avatar preview" />
            </div>
            <label>Avatar URL<input value={draft.avatarUrl} onChange={(event) => updateDraft('avatarUrl', event.target.value)} /></label>
            <label className="upload-box">
              <ImageIcon size={18} /> Tai anh avatar tu may
              <input type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0], (value) => updateDraft('avatarUrl', value))} />
            </label>
          </div>
        </section>

        <section className="glass admin-card">
          <h2>Social links</h2>
          <div className="admin-list">
            {draft.socials.map((item, index) => (
              <div className="admin-row" key={item.name}>
                <strong>{item.name}</strong>
                <input value={item.handle} onChange={(event) => updateSocial(index, 'handle', event.target.value)} placeholder="Handle" />
                <input value={item.url} onChange={(event) => updateSocial(index, 'url', event.target.value)} placeholder="URL" />
              </div>
            ))}
          </div>
        </section>

        <section className="glass admin-card">
          <h2>Gallery</h2>
          <div className="admin-list">
            {draft.gallery.map((item, index) => (
              <div className="admin-row" key={`${item.title}-${index}`}>
                <input value={item.title} onChange={(event) => updateGallery(index, 'title', event.target.value)} placeholder="Ten anh" />
                <input value={item.imageUrl} onChange={(event) => updateGallery(index, 'imageUrl', event.target.value)} placeholder="Image URL" />
                <label className="upload-box compact">
                  Upload
                  <input type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0], (value) => updateGallery(index, 'imageUrl', value))} />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-grid">
          <div className="glass admin-card">
            <h2>Contact</h2>
            <label>Email<input value={draft.email} onChange={(event) => updateDraft('email', event.target.value)} /></label>
            <label>Messenger URL<input value={draft.messengerUrl} onChange={(event) => updateDraft('messengerUrl', event.target.value)} /></label>
            <label>Telegram URL<input value={draft.telegramUrl} onChange={(event) => updateDraft('telegramUrl', event.target.value)} /></label>
          </div>
          <div className="glass admin-card">
            <h2>Head / Footer noi bat</h2>
            <label>Tieu de highlight<input value={draft.highlightTitle} onChange={(event) => updateDraft('highlightTitle', event.target.value)} /></label>
            <label>Noi dung highlight<textarea rows={3} value={draft.highlightText} onChange={(event) => updateDraft('highlightText', event.target.value)} /></label>
            <label>Footer title<input value={draft.footerTitle} onChange={(event) => updateDraft('footerTitle', event.target.value)} /></label>
            <label>Footer text<textarea rows={3} value={draft.footerText} onChange={(event) => updateDraft('footerText', event.target.value)} /></label>
          </div>
        </section>
      </form>
    </div>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-card" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        {children}
      </motion.div>
    </motion.div>
  );
}
