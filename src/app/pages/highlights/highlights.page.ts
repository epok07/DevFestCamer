import { Component, inject } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Session } from '../../core/models';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.page.html',
  styleUrls: ['./highlights.page.scss'],
  standalone: false,
})
export class HighlightsPage {
  readonly conf = inject(ConferenceService);

  get c(): Conference {
    return this.conf.data()!;
  }

  get featuredSessions(): Session[] {
    return this.conf.sessions.filter((session) => session.format === 'Talk').slice(0, 3);
  }

  speakerLine(ids: string[]): string {
    return this.conf.speakers(ids).map((speaker) => speaker.name).join(' · ');
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
}
