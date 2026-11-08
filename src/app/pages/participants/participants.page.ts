import { Component, computed, inject, signal } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Participant } from '../../core/models';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.page.html',
  styleUrls: ['./participants.page.scss'],
  standalone: false,
})
export class ParticipantsPage {
  readonly conf = inject(ConferenceService);

  readonly query = signal('');
  readonly tag = signal('all');

  readonly tags = computed<string[]>(() => {
    const values = new Set<string>();
    for (const participant of this.conf.data()?.participants ?? []) {
      for (const item of participant.tags) {
        values.add(item);
      }
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  });

  readonly filtered = computed<Participant[]>(() => {
    const participants = this.conf.data()?.participants ?? [];
    const needle = this.query().trim().toLowerCase();
    const tag = this.tag();

    return participants.filter((participant) => {
      if (tag !== 'all' && !participant.tags.includes(tag)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [participant.name, participant.role, participant.company ?? '', ...participant.tags]
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

  selectTag(tag: string): void {
    this.tag.set(tag);
  }
}
