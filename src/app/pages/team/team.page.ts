import { Component, inject } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference, TeamMember } from '../../core/models';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  standalone: false,
})
export class TeamPage {
  readonly conf = inject(ConferenceService);

  get c(): Conference {
    return this.conf.data()!;
  }

  get members(): TeamMember[] {
    return this.conf.data()?.team ?? [];
  }

  mailto(member: TeamMember): string {
    return `mailto:${member.email ?? this.c.links.contactEmail}?subject=DevFest%20Douala%20${this.c.year}`;
  }
}
