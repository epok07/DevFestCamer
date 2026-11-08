import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { ConferenceService } from '../../core/conference.service';
import { EditionSummary } from '../../core/models';

@Component({
  selector: 'app-year-switcher',
  templateUrl: './year-switcher.component.html',
  styleUrls: ['./year-switcher.component.scss'],
  standalone: false,
})
export class YearSwitcherComponent {
  readonly conference = inject(ConferenceService);
  private readonly router = inject(Router);

  readonly editions = toSignal(this.conference.getEditions(), {
    initialValue: [] as EditionSummary[],
  });

  change(year: number | string): void {
    const target = Number(year);
    if (!Number.isFinite(target) || target === this.conference.currentYear) {
      return;
    }

    this.router.navigateByUrl('/' + this.pathForEdition(target).join('/'));
  }

  /**
   * Switches the year while keeping the current section. Detail pages are
   * collapsed to their list because a speaker or participant id from one
   * edition does not necessarily exist in another.
   */
  private pathForEdition(year: number): string[] {
    const [, ...rest] = this.router.url.split('/').filter(Boolean);
    const path = [String(year), ...rest];

    if (!path[1]) {
      return [String(year), 'highlights'];
    }

    if (path[1] === 'speakers' && path.length > 2) {
      return path.slice(0, 2);
    }

    if (path[1] === 'more' && path[2] === 'participants' && path.length > 3) {
      return path.slice(0, 3);
    }

    return path;
  }

  label(edition: EditionSummary): string {
    return edition.status === 'planned'
      ? `${edition.year} · à venir`
      : String(edition.year);
  }
}
