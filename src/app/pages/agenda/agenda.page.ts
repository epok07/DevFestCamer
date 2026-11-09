import { Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { CalendarService } from '../../core/calendar.service';
import { ConferenceService } from '../../core/conference.service';
import { Conference, Day, Session } from '../../core/models';

type TimelineState = 'before' | 'during' | 'after';

interface AgendaTimeline {
  startLabel: string;
  endLabel: string;
  nowLabel: string;
  progress: number;
  state: TimelineState;
  status: string;
}

const DAY_IN_MS = 86_400_000;

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  standalone: false,
})
export class AgendaPage {
  readonly conf = inject(ConferenceService);
  private readonly calendar = inject(CalendarService);

  readonly dayIndex = signal(0);
  readonly trackFilter = signal('all');
  readonly selected = signal<Session | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private readonly now = signal(new Date());

  /**
   * Progress of the selected day, based on its first and last session. The
   * signal is refreshed every 30 s so the marker follows the clock without
   * competing with the schedule rendering.
   */
  readonly timeline = computed<AgendaTimeline | null>(() => {
    const day = this.day;
    if (!day || !day.sessions.length) {
      return null;
    }

    const start = Math.min(...day.sessions.map((item) => this.toMinutes(item.start)));
    const end = Math.max(...day.sessions.map((item) => this.toMinutes(item.end)));
    const now = this.now();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const offsetDays = Math.round(
      (this.dayDate(day.date).getTime() - this.startOfDay(now).getTime()) / DAY_IN_MS
    );

    let state: TimelineState = 'before';
    let status: string;

    if (offsetDays > 0) {
      status = offsetDays === 1 ? 'Jour J demain' : `Jour J dans ${offsetDays} jours`;
    } else if (offsetDays < 0) {
      state = 'after';
      status = 'Édition terminée';
    } else if (nowMinutes < start) {
      status = `Début à ${this.clock(start)}`;
    } else if (nowMinutes > end) {
      state = 'after';
      status = 'Journée terminée';
    } else {
      state = 'during';
      status = 'En direct';
    }

    let progress = 0;
    if (state === 'after') {
      progress = 100;
    } else if (state === 'during') {
      progress = Math.min(
        100,
        Math.max(0, ((nowMinutes - start) / Math.max(1, end - start)) * 100)
      );
    }

    return {
      startLabel: this.clock(start),
      endLabel: this.clock(end),
      nowLabel: this.clock(nowMinutes),
      progress,
      state,
      status,
    };
  });

  readonly nowLabel = computed(() => {
    const now = this.now();
    return this.clock(now.getHours() * 60 + now.getMinutes());
  });

  constructor() {
    const timer = setInterval(() => this.now.set(new Date()), 30_000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  readonly filteredSessions = computed(() => {
    const conference = this.conf.data();
    const day = conference?.days[this.dayIndex()];
    const filter = this.trackFilter();
    if (!day) {
      return [];
    }
    return day.sessions.filter(
      (session) => filter === 'all' || session.trackId === filter
    );
  });

  get c(): Conference {
    return this.conf.data()!;
  }

  get day(): Day | undefined {
    return this.c.days[this.dayIndex()] ?? this.c.days[0];
  }

  selectTrack(id: string): void {
    this.trackFilter.set(id);
  }

  /** True while the session is actually running. */
  isLive(session: Session): boolean {
    if (this.timeline()?.state !== 'during') {
      return false;
    }
    const now = this.nowMinutes();
    return now >= this.toMinutes(session.start) && now < this.toMinutes(session.end);
  }

  /** True once the session is over, on the event day or afterwards. */
  isPast(session: Session): boolean {
    const state = this.timeline()?.state;
    if (state === 'after') {
      return true;
    }
    return state === 'during' && this.nowMinutes() >= this.toMinutes(session.end);
  }

  /**
   * Inserts the "now" line before the first session that is still running or
   * upcoming. Returns false outside the day and when everything is over.
   */
  showNowMarker(session: Session): boolean {
    if (this.timeline()?.state !== 'during') {
      return false;
    }
    const now = this.nowMinutes();
    const next = this.filteredSessions().find(
      (item) => this.toMinutes(item.end) > now
    );
    return next?.id === session.id;
  }

  open(session: Session): void {
    this.selected.set(session);
  }

  close(): void {
    this.selected.set(null);
  }

  addToCalendar(session: Session): void {
    this.calendar.addSession(this.c, session);
  }

  addDayToCalendar(): void {
    if (this.day) {
      this.calendar.addDay(this.c, this.day);
    }
  }

  trackColor(id: string): string {
    return this.conf.track(id)?.color ?? 'var(--df-accent)';
  }

  trackName(id: string): string {
    return this.conf.track(id)?.name ?? id;
  }

  roomName(id: string): string {
    return this.conf.room(id)?.name ?? id;
  }

  speakerNames(ids: string[]): string {
    return this.conf.speakers(ids).map((speaker) => speaker.name).join(', ');
  }

  private nowMinutes(): number {
    const now = this.now();
    return now.getHours() * 60 + now.getMinutes();
  }

  private toMinutes(value: string): number {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private clock(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private dayDate(isoDate: string): Date {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
