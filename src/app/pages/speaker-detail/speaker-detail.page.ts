import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Session, Speaker } from '../../core/models';

@Component({
  selector: 'app-speaker-detail',
  templateUrl: './speaker-detail.page.html',
  styleUrls: ['./speaker-detail.page.scss'],
  standalone: false,
})
export class SpeakerDetailPage {
  readonly conf = inject(ConferenceService);
  private readonly route = inject(ActivatedRoute);

  private readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );

  readonly speaker = computed<Speaker | null>(() => {
    const id = this.id();
    return id ? this.conf.data()?.speakers.find((item) => item.id === id) ?? null : null;
  });

  readonly sessions = computed<Session[]>(() => {
    const speaker = this.speaker();
    return speaker ? this.conf.sessionsForSpeaker(speaker.id) : [];
  });

  get c(): Conference {
    return this.conf.data()!;
  }

  trackColor(id?: string): string {
    return this.conf.track(id)?.color ?? 'var(--df-accent)';
  }

  trackName(id?: string): string {
    return this.conf.track(id)?.name ?? 'Communauté';
  }

  roomName(id?: string): string {
    return this.conf.room(id)?.name ?? id ?? '';
  }
}
