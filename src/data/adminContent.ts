export type EditableSocial = {
  name: string;
  handle: string;
  url: string;
};

export type EditableGalleryItem = {
  title: string;
  imageUrl: string;
};

export type SiteContent = {
  name: string;
  statusText: string;
  slogan: string;
  intro: string;
  avatarUrl: string;
  email: string;
  messengerUrl: string;
  telegramUrl: string;
  heroBadge: string;
  highlightTitle: string;
  highlightText: string;
  footerTitle: string;
  footerText: string;
  socials: EditableSocial[];
  gallery: EditableGalleryItem[];
};

export const CONTENT_STORAGE_KEY = 'zinh-site-content-v1';
export const ADMIN_SESSION_KEY = 'zinh-admin-session-v1';

export const defaultSiteContent: SiteContent = {
  name: 'Zinh',
  statusText: 'Live status: Online',
  slogan: 'Building luminous digital identities for the next internet.',
  intro:
    'Zinh is a future-facing creator profile for social presence, portfolio proof, and realtime personal branding. This page combines visual impact with fast, maintainable frontend architecture.',
  avatarUrl: '/assets/zinh-avatar.png',
  email: 'zinh@example.com',
  messengerUrl: 'https://m.me',
  telegramUrl: 'https://telegram.org',
  heroBadge: 'Online Profile',
  highlightTitle: 'Premium Cyber Identity',
  highlightText: 'Realtime profile, social proof, animated showcase, and creator-grade contact center in one neon command deck.',
  footerTitle: 'ZINH.OS',
  footerText: 'Luxury cyberpunk profile experience built for creators, builders, and digital brands.',
  socials: [
    { name: 'Facebook', handle: '@zinh.profile', url: 'https://facebook.com' },
    { name: 'TikTok', handle: '@zinh.cyber', url: 'https://tiktok.com' },
    { name: 'Telegram', handle: '@zinh', url: 'https://telegram.org' },
    { name: 'Discord', handle: 'zinh#0001', url: 'https://discord.com' },
    { name: 'YouTube', handle: 'Zinh Labs', url: 'https://youtube.com' },
    { name: 'GitHub', handle: 'github.com/zinh', url: 'https://github.com' },
    { name: 'Custom Link', handle: 'zinh.dev/hub', url: '#contact' }
  ],
  gallery: [
    { title: 'Neon Alley', imageUrl: '' },
    { title: 'Control Room', imageUrl: '' },
    { title: 'Data Temple', imageUrl: '' },
    { title: 'Night Signal', imageUrl: '' },
    { title: 'Holo ID', imageUrl: '' },
    { title: 'Skyline Grid', imageUrl: '' }
  ]
};

export function loadSiteContent(): SiteContent {
  try {
    const stored = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!stored) return defaultSiteContent;
    const parsed = JSON.parse(stored) as Partial<SiteContent>;
    return {
      ...defaultSiteContent,
      ...parsed,
      socials: parsed.socials?.length ? parsed.socials : defaultSiteContent.socials,
      gallery: parsed.gallery?.length ? parsed.gallery : defaultSiteContent.gallery
    };
  } catch {
    return defaultSiteContent;
  }
}

export function saveSiteContent(content: SiteContent) {
  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
}
