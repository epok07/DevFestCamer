import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';

import { ConferenceService } from './conference.service';

/**
 * Sends `/` to the most recent edition that has content.
 * A planned edition (data file not published yet) is skipped.
 */
@Injectable({ providedIn: 'root' })
export class RootRedirectGuard implements CanActivate {
  private readonly conference = inject(ConferenceService);
  private readonly router = inject(Router);

  canActivate(): Observable<UrlTree> {
    return this.conference.getEditions().pipe(
      map((editions) => {
        const available = editions
          .filter((edition) => edition.status !== 'planned')
          .sort((a, b) => b.year - a.year);
        const target = available[0] ?? editions[0];
        return this.router.createUrlTree(
          target
            ? ['/', target.year, 'highlights']
            : ['/', 'not-found']
        );
      })
    );
  }
}

/**
 * Refuses a year that is not published (no data file) and falls back to the
 * 404 page instead of letting the resolver request a missing JSON file.
 */
@Injectable({ providedIn: 'root' })
export class EditionGuard implements CanActivate {
  private readonly conference = inject(ConferenceService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const year = Number(route.paramMap.get('year'));

    return this.conference.getEditions().pipe(
      map((editions) => {
        const edition = editions.find((item) => item.year === year);
        return edition && edition.status !== 'planned'
          ? true
          : this.router.createUrlTree(['/', 'not-found']);
      })
    );
  }
}
