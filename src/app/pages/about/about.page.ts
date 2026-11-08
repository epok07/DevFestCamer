import { Component, inject } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference } from '../../core/models';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: false,
})
export class AboutPage {
  readonly year = new Date().getFullYear();
  readonly conf = inject(ConferenceService);

  get c(): Conference {
    return this.conf.data()!;
  }
}
