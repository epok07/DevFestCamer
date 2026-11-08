import { Component, computed, inject, signal } from '@angular/core';

import { CalendarService } from '../../core/calendar.service';
import { ConferenceService } from '../../core/conference.service';
import { Conference, Day, Session } from '../../core/models';

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
}
