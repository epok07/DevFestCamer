import { Component, computed, inject, signal } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Speaker } from '../../core/models';

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.page.html',
  styleUrls: ['./speakers.page.scss'],
  standalone: false,
})
export class SpeakersPage {
  readonly conf = inject(ConferenceService);

  readonly trackFilter = signal('all');
  readonly query = signal('');

  readonly filtered = computed<Speaker[]>(() => {
    const conference = this.conf.data();
    if (!conference) {
      return [];
    }

    const needle = this.query().trim().toLowerCase();
    const track = this.trackFilter();

    return conference.speakers.filter((speaker) => {
      if (track !== 'all' && speaker.trackId !== track) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [speaker.name, speaker.role, speaker.company ?? '']
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  });

  get c(): Conference {
    return this.conf.data()!;
  }

  onSearch(event: Event): void {
    const detail = (event as CustomEvent<{ value?: string | null }>).detail;
    this.query.set(detail?.value ?? '');
  }

  selectTrack(id: string): void {
    this.trackFilter.set(id);
  }

  trackColor(id?: string): string {
    return this.conf.track(id)?.color ?? 'var(--df-accent)';
  }

  trackName(id?: string): string {
    return this.conf.track(id)?.name ?? 'Communauté';
  }
}
