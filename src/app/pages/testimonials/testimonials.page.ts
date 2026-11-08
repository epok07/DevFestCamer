import { Component, computed, inject } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Testimonial } from '../../core/models';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.page.html',
  styleUrls: ['./testimonials.page.scss'],
  standalone: false,
})
export class TestimonialsPage {
  readonly conf = inject(ConferenceService);

  readonly testimonials = computed<Testimonial[]>(
    () => this.conf.data()?.testimonials ?? []
  );

  get c(): Conference {
    return this.conf.data()!;
  }
}
