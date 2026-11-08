import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConferenceService } from './conference.service';
import { Conference, EditionSummary } from './models';

const EDITION: Conference = {
  year: 2026,
  name: 'DevFest Test',
  chapter: 'GDG Douala',
  city: 'Douala',
  theme: 'Stand Alone Complex',
  tagline: 'Une édition de test',
  manifesto: '',
  date: '2026-11-28',
  dateLabel: 'Samedi 28 novembre 2026',
  startTime: '07:00',
  endTime: '18:00',
  stats: [],
  highlights: [],
  tracks: [{ id: 'web', name: 'Web', color: '#5cf2c4' }],
  days: [
    {
      date: '2026-11-28',
      label: 'Journée unique',
      sessions: [
        {
          id: 'session-1',
          title: 'Session de test',
          abstract: '',
          start: '09:00',
          end: '10:00',
          trackId: 'web',
          roomId: 'main',
          level: 'Tous',
          language: 'FR',
          speakerIds: ['speaker-1'],
        },
      ],
    },
  ],
  speakers: [
    {
      id: 'speaker-1',
      name: 'Ada Test',
      role: 'Développeuse',
      bio: '',
      links: [],
    },
  ],
  venue: {
    name: 'Campus de test',
    address: '',
    city: 'Douala',
    description: '',
    mapUrl: '',
    svg: '',
    rooms: [{ id: 'main', name: 'Salle principale', description: '' }],
    arrival: [],
    transport: [],
  },
  materials: [],
  participants: [],
  sponsors: [],
  testimonials: [],
  team: [],
  links: {},
};

const EDITIONS: EditionSummary[] = [
  {
    year: 2026,
    name: 'DevFest Test',
    city: 'Douala',
    theme: 'Stand Alone Complex',
    date: '2026-11-28',
    dateLabel: 'Samedi 28 novembre 2026',
    status: 'upcoming',
  },
];

describe('ConferenceService', () => {
  let service: ConferenceService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ConferenceService);
    http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/editions.json').flush(EDITIONS);
  });

  afterEach(() => http.verify());

  it('loads an edition, exposes it through signals and caches it', () => {
    let loaded: Conference | undefined;
    service.load(2026).subscribe((value) => (loaded = value));

    const request = http.expectOne('assets/data/2026.json');
    request.flush(EDITION);

    expect(loaded?.year).toBe(2026);
    expect(service.data()?.name).toBe('DevFest Test');
    expect(service.currentYear).toBe(2026);
    expect(service.getEditionsSnapshot().length).toBe(1);

    expect(service.sessionsForSpeaker('speaker-1').length).toBe(1);
    expect(service.sessionsForTrack('web').length).toBe(1);
    expect(service.sessionsForRoom('main').length).toBe(1);
    expect(service.track('web')?.name).toBe('Web');
    expect(service.room('main')?.name).toBe('Salle principale');

    service.load(2026).subscribe();
    http.expectNone('assets/data/2026.json');
  });
});
