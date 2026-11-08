import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Room, Session } from '../../core/models';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.page.html',
  styleUrls: ['./venue.page.scss'],
  standalone: false,
})
export class VenuePage {
  readonly conf = inject(ConferenceService);
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  readonly activeRoomId = signal<string | null>(null);
  readonly venueSvg = signal<SafeHtml | null>(null);

  private readonly svgCache = new Map<string, SafeHtml>();
  private readonly pending = new Set<string>();
  private lastYear = 0;

  readonly rooms = computed<Room[]>(() => this.conf.data()?.venue.rooms ?? []);

  readonly activeRoom = computed<Room | null>(() => {
    const id = this.activeRoomId();
    return this.rooms().find((room) => room.id === id) ?? null;
  });

  readonly activeSessions = computed<Session[]>(() => {
    const room = this.activeRoom();
    return room ? this.conf.sessionsForRoom(room.id) : [];
  });

  constructor() {
    effect(() => {
      const data = this.conf.data();
      if (!data || data.year === this.lastYear) {
        return;
      }

      this.lastYear = data.year;
      this.activeRoomId.set(data.venue.rooms[0]?.id ?? null);
      this.loadSvg(data.venue.svg);
    });
  }

  get c(): Conference {
    return this.conf.data()!;
  }

  selectRoom(id: string): void {
    this.activeRoomId.set(id);
  }

  onMapClick(event: Event): void {
    this.activateFrom(event.target);
  }

  onMapKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      if (this.activateFrom(event.target)) {
        event.preventDefault();
      }
    }
  }

  trackColor(id?: string): string {
    return this.conf.track(id)?.color ?? 'var(--df-accent)';
  }

  trackName(id?: string): string {
    return this.conf.track(id)?.name ?? id ?? '';
  }

  private activateFrom(target: EventTarget | null): boolean {
    const element = target as Element | null;
    const room = element?.closest('[data-room]');
    const id = room?.getAttribute('data-room');
    if (!id) {
      return false;
    }
    this.activeRoomId.set(id);
    return true;
  }

  private loadSvg(path: string): void {
    const cached = this.svgCache.get(path);
    if (cached) {
      this.venueSvg.set(cached);
      return;
    }

    if (this.pending.has(path)) {
      return;
    }

    this.pending.add(path);
    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (svg) => {
        const safe = this.sanitizer.bypassSecurityTrustHtml(svg);
        this.svgCache.set(path, safe);
        this.venueSvg.set(safe);
        this.pending.delete(path);
      },
      error: () => {
        this.pending.delete(path);
        this.venueSvg.set(null);
      },
    });
  }
}
