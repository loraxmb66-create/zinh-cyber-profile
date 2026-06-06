import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import {
  ChevronRight,
  Clock3,
  CloudSun,
  Copy,
  Mail,
  MessageCircle,
  MoonStar,
  Pause,
  Play,
  QrCode,
  Send,
  Share2,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Volume2,
  X,
  Zap
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { CursorAura } from './components/CursorAura';
import { NeuralBackground } from './components/NeuralBackground';
import { Section } from './components/Section';
import { badges, gallery, projects, skills, socials, stats, timeline, translations } from './data/profile';
import type { Project, ProjectCategory } from './data/profile';
import { useClock } from './hooks/useClock';
import { useTyping } from './hooks/useTyping';
import type { LucideIcon } from 'lucide-react';

const categories: ProjectCategory[] = ['All', 'Web', 'AI', 'Design', 'Security'];

export function App() {
  const [loaded, setLoaded] = useState(false);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [matrix, setMatrix] = useState(false);
  const [snow, setSnow] = useState(false);
  const [rain, setRain] = useState(true);
  const [accent, setAccent] = useState('#27fff2');
  const [category, setCategory] = useState<ProjectCategory>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState<(typeof gallery)[number] | null>(null);
  const [notice, setNotice] = useState('Zinh is online now');
  const [visitors, setVisitors] = useState(12048);
  const [music, setMusic] = useState(false);
  const audioRef = useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);
  const clock = useClock();
  const copyGuardRef = useRef<HTMLDivElement | null>(null);

  const t = translations[language];
  const typing = useTyping(t.typing);
  const filteredProjects = useMemo(
    () => (category === 'All' ? projects : projects.filter((project) => project.category === category)),
    [category]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 900);
    return () => window.clearTimeout(timer);
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
            {['about', 'social', 'portfolio', 'stats', 'gallery', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} className="hover:text-neon-cyan">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot" />
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
              <Sparkles size={14} /> Online Profile
            </p>
            <h1 className="font-display text-5xl font-black leading-tight text-white sm:text-7xl lg:text-8xl">
              Zinh
              <span className="block text-glow text-2xl text-neon-cyan sm:text-4xl">{typing}<span className="typing-caret">|</span></span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{t.slogan}</p>
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
              <img src="/assets/zinh-avatar.png" alt="Zinh cyberpunk avatar" loading="eager" />
            </div>
            <div className="profile-card">
              <span className="status-dot" /> Live status: Online
            </div>
          </motion.div>
        </section>

        <Section id="about" eyebrow="Identity Core" title="About Me">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass p-6 text-slate-300">{t.intro}</div>
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
            {socials.map((social) => {
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
            {gallery.map((item) => (
              <button className={`gallery-tile ${item.height} bg-gradient-to-br ${item.tone}`} key={item.title} onClick={() => setLightbox(item)}>
                <span>{item.title}</span>
              </button>
            ))}
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
                <a className="contact-btn" href="mailto:zinh@example.com"><Mail /> Email</a>
                <a className="contact-btn" href="https://m.me"><MessageCircle /> Messenger</a>
                <a className="contact-btn" href="https://telegram.org"><Send /> Telegram</a>
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
      </main>

      <aside className="control-panel">
        <button className="icon-btn" onClick={toggleMusic} aria-label="Toggle music">{music ? <Pause size={16} /> : <Play size={16} />}</button>
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
            <div className={`lightbox-art bg-gradient-to-br ${lightbox.tone}`} />
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
