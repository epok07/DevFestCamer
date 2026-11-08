import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';

import {
  Conference,
  Day,
  EditionSummary,
  Participant,
  Room,
  Session,
  Speaker,
  Track,
} from './models';

@Injectable({ providedIn: 'root' })
export class ConferenceService {
  private readonly http = inject(HttpClient);

  private readonly editions$ = this.http
    .get<EditionSummary[]>('assets/data/editions.json')
    .pipe(shareReplay(1));

  private readonly editions = signal<EditionSummary[]>([]);
  private readonly cache = new Map<number, Conference>();
  private readonly state = signal<Conference | null>(null);

  /** Reactive current edition. Pages derive everything from this signal. */
  readonly data = this.state.asReadonly();

  constructor() {
    this.editions$.subscribe((editions) => this.editions.set(editions));
  }

  getEditions(): Observable<EditionSummary[]> {
    return this.editions$;
  }

  getEditionsSnapshot(): EditionSummary[] {
    return this.editions();
  }

  load(year: number): Observable<Conference> {
    const cached = this.cache.get(year);
    if (cached) {
      this.state.set(cached);
      return of(cached);
    }

    return this.http.get<Conference>(`assets/data/${year}.json`).pipe(
      tap((conference) => {
        this.cache.set(year, conference);
        this.state.set(conference);
      })
    );
  }

  get currentYear(): number {
    return this.data()?.year ?? 2026;
  }

  get days(): Day[] {
    return this.data()?.days ?? [];
  }

  get sessions(): Session[] {
    return this.days.flatMap((day) => day.sessions);
  }

  track(id?: string): Track | undefined {
    return this.data()?.tracks.find((track) => track.id === id);
  }

  room(id?: string): Room | undefined {
    return this.data()?.venue.rooms.find((room) => room.id === id);
  }

  speaker(id: string): Speaker | undefined {
    return this.data()?.speakers.find((speaker) => speaker.id === id);
  }

  speakers(ids: string[] = []): Speaker[] {
    return ids
      .map((id) => this.speaker(id))
      .filter((speaker): speaker is Speaker => !!speaker);
  }

  participant(id: string): Participant | undefined {
    return this.data()?.participants.find((participant) => participant.id === id);
  }

  sessionsForSpeaker(id: string): Session[] {
    return this.sessions.filter((session) => session.speakerIds.includes(id));
  }

  sessionsForRoom(id: string): Session[] {
    return this.sessions.filter((session) => session.roomId === id);
  }

  sessionsForTrack(id: string): Session[] {
    return this.sessions.filter((session) => session.trackId === id);
  }

  day(date: string): Day | undefined {
    return this.days.find((day) => day.date === date);
  }
}
