export type EditionStatus = 'upcoming' | 'live' | 'archive' | 'planned';

export interface EditionSummary {
  year: number;
  name: string;
  city: string;
  theme: string;
  date: string;
  dateLabel: string;
  status: EditionStatus;
  tagline?: string;
}

export interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

export interface Track {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity?: number;
  description: string;
}

export type SessionLevel = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous';
export type SessionLanguage = 'FR' | 'EN';

export interface Session {
  id: string;
  title: string;
  abstract: string;
  start: string;
  end: string;
  trackId: string;
  roomId: string;
  level: SessionLevel;
  language: SessionLanguage;
  format?: string;
  speakerIds: string[];
}

export interface Day {
  date: string;
  label: string;
  sessions: Session[];
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company?: string;
  bio: string;
  trackId?: string;
  links: LinkItem[];
  featured?: boolean;
}

export interface Highlight {
  icon: string;
  tag: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  description: string;
  mapUrl: string;
  svg: string;
  rooms: Room[];
  arrival: { step: string; title: string; description: string }[];
  transport: { icon: string; title: string; description: string }[];
}

export type MaterialType = 'PDF' | 'Slides' | 'Lien' | 'Document' | 'Archive' | 'Code';

export interface Material {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  size?: string;
  url?: string;
  available: boolean;
  trackId?: string;
  sessionId?: string;
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  company?: string;
  bio: string;
  tags: string[];
  links: LinkItem[];
  avatar?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'Platine' | 'Or' | 'Argent' | 'Communauté';
  description: string;
  url?: string;
  logo?: string;
  monogram: string;
  accent?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  edition: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  email?: string;
  phone?: string;
  links: LinkItem[];
}

export interface ConferenceLinks {
  site?: string;
  register?: string;
  cfp?: string;
  challenge?: string;
  codeOfConduct?: string;
  contactEmail?: string;
  socials?: LinkItem[];
}

export interface Conference {
  year: number;
  name: string;
  chapter: string;
  city: string;
  theme: string;
  tagline: string;
  manifesto: string;
  date: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  demo?: boolean;
  stats: Stat[];
  highlights: Highlight[];
  tracks: Track[];
  days: Day[];
  speakers: Speaker[];
  venue: Venue;
  materials: Material[];
  participants: Participant[];
  sponsors: Sponsor[];
  testimonials: Testimonial[];
  team: TeamMember[];
  links: ConferenceLinks;
}
