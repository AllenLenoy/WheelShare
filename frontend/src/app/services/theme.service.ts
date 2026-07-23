import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'wheelshare-theme';
  isDark = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.THEME_KEY, this.isDark ? 'dark' : 'light');
    }
  }

  private loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        if (savedTheme === 'dark') {
          this.isDark = true;
        } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.isDark = true;
        }
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
        if (this.isDark) {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
    }
  }
}
