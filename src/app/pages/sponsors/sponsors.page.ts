import { Component, computed, inject } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Sponsor } from '../../core/models';

const TIER_ORDER: Sponsor['tier'][] = ['Platine', 'Or', 'Argent', 'Communauté'];

interface SponsorGroup {
  tier: Sponsor['tier'];
  sponsors: Sponsor[];
}

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.page.html',
  styleUrls: ['./sponsors.page.scss'],
  standalone: false,
})
export class SponsorsPage {
  readonly conf = inject(ConferenceService);

  readonly groups = computed<SponsorGroup[]>(() => {
    const sponsors = this.conf.data()?.sponsors ?? [];
    return TIER_ORDER.map((tier) => ({
      tier,
      sponsors: sponsors.filter((sponsor) => sponsor.tier === tier),
    })).filter((group) => group.sponsors.length > 0);
  });

  get c(): Conference {
    return this.conf.data()!;
  }
}
