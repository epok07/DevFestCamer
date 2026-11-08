import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Participant } from '../../core/models';

@Component({
  selector: 'app-participant-detail',
  templateUrl: './participant-detail.page.html',
  styleUrls: ['./participant-detail.page.scss'],
  standalone: false,
})
export class ParticipantDetailPage {
  readonly conf = inject(ConferenceService);
  private readonly route = inject(ActivatedRoute);

  private readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );

  readonly participant = computed<Participant | null>(() => {
    const id = this.id();
    return id
      ? this.conf.data()?.participants.find((item) => item.id === id) ?? null
      : null;
  });

  get c(): Conference {
    return this.conf.data()!;
  }
}
