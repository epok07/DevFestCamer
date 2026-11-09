import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'devfestcamer.theme';
const THEME_COLOR: Record<ThemeMode, string> = {
  dark: '#060b13',
  light: '#f4f7fb',
};

/**
 * Keeps the <html> element in sync with the selected theme. The initial value
 * comes from the small inline script in index.html, which avoids a flash of the
 * wrong palette before Angular bootstraps. Until the user picks a theme, the
 * service follows the operating system preference.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly root = this.document.documentElement;

  private explicit = this.readStored() !== null;

  readonly mode = signal<ThemeMode>(this.initialMode());
  readonly isLight = computed(() => this.mode() === 'light');

  constructor() {
    effect(() => this.apply(this.mode()));

    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', (event) => {
        if (!this.explicit) {
          this.mode.set(event.matches ? 'light' : 'dark');
        }
      });
  }

  set(mode: ThemeMode): void {
    this.explicit = true;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies.
    }
    this.mode.set(mode);
  }

  toggle(light = !this.isLight()): void {
    this.set(light ? 'light' : 'dark');
  }

  private initialMode(): ThemeMode {
    const attribute = this.root.getAttribute('data-theme');
    if (attribute === 'light' || attribute === 'dark') {
      return attribute;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  private readStored(): ThemeMode | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  private apply(mode: ThemeMode): void {
    this.root.setAttribute('data-theme', mode);
    this.root.classList.toggle('ion-palette-dark', mode === 'dark');
    this.root.style.colorScheme = mode;

    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[mode]);
  }
}
