import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

    user: User | null = null;
    isScrolled = false;
    isMobileMenuOpen = false;
    isProfileDropdownOpen = false;
    isHome = true;

    private userSub!: Subscription;
    private routerSub!: Subscription;

    constructor(
        private authService: AuthService,
        public themeService: ThemeService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userSub = this.authService.user$.subscribe(user => {
            this.user = user;
        });
        
        this.checkIfHome(this.router.url);
        this.routerSub = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.checkIfHome(event.urlAfterRedirects);
        });
    }

    checkIfHome(url: string) {
        this.isHome = url === '/' || url === '/home';
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
        this.routerSub?.unsubscribe();
    }

    @HostListener('window:scroll')
    onScroll(): void {
        this.isScrolled = window.scrollY > 30;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-dropdown-wrapper')) {
            this.isProfileDropdownOpen = false;
        }
    }

    toggleMobileMenu(): void {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    closeMobileMenu(): void {
        this.isMobileMenuOpen = false;
    }

    toggleProfileDropdown(): void {
        this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    }

    logout(): void {
        this.authService.logout();
        this.isProfileDropdownOpen = false;
        this.closeMobileMenu();
        this.router.navigate(['/']);
    }

    get userInitial(): string {
        return this.user?.name?.charAt(0)?.toUpperCase() || 'U';
    }
}
