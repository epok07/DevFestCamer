import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { ConferenceService } from './conference.service';
import { Conference } from './models';

@Injectable({ providedIn: 'root' })
export class ConferenceResolver implements Resolve<Conference> {
  private readonly conference = inject(ConferenceService);

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<Conference> {
    const year = Number(route.paramMap.get('year'));
    return this.conference.load(Number.isFinite(year) ? year : 2026);
  }
}
