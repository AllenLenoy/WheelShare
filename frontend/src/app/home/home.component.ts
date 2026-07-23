import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  searchLocation = '';
  searchDates = '';
  searchType = '';

  isNavScrolled = false;
  isMobileMenuOpen = false;
  currentYear = new Date().getFullYear();
  activeStep = -1;

  featuredCars = [
    {
      name: 'BMW 3 Series',
      type: 'Sedan',
      price: '₹3,500',
      period: '/day',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&q=80',
      rating: 4.8,
      seats: 5,
      fuel: 'Petrol',
      transmission: 'Automatic',
      location: 'Kochi'
    },
    {
      name: 'Toyota Fortuner',
      type: 'SUV',
      price: '₹4,200',
      period: '/day',
      image: 'https://images.unsplash.com/photo-1625231334401-3a07bf3b89b4?w=600&h=400&fit=crop&q=80',
      rating: 4.7,
      seats: 7,
      fuel: 'Diesel',
      transmission: 'Automatic',
      location: 'Hyderabad'
    },
    {
      name: 'Hyundai Creta',
      type: 'Compact SUV',
      price: '₹2,800',
      period: '/day',
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop&q=80',
      rating: 4.6,
      seats: 5,
      fuel: 'Petrol',
      transmission: 'Manual',
      location: 'Bangalore'
    }
  ];

  steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up in under a minute with your email or phone number.',
      icon: 'person_add'
    },
    {
      number: '02',
      title: 'Pick Your Ride',
      description: 'Browse hundreds of verified cars and find the one that fits your trip.',
      icon: 'directions_car'
    },
    {
      number: '03',
      title: 'Book Instantly',
      description: 'Reserve your car with a few taps. No paperwork, no hassle.',
      icon: 'event_available'
    },
    {
      number: '04',
      title: 'Hit the Road',
      description: 'Grab the keys and enjoy your journey with full peace of mind.',
      icon: 'route'
    }
  ];

  private observerInstances: IntersectionObserver[] = [];

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isNavScrolled = window.scrollY > 50;
  }

  onSearch(): void {
    const queryParams: any = {};
    if (this.searchLocation) queryParams.location = this.searchLocation;
    if (this.searchType) queryParams.type = this.searchType;
    
    this.router.navigate(['/vehicles'], { queryParams });
  }

  ngOnInit(): void {
    this.setupScrollAnimations();
  }

  ngAfterViewInit(): void {
    this.forcePlayVideo();
  }

  ngOnDestroy(): void {
    this.observerInstances.forEach(obs => obs.disconnect());
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  /** Force autoplay — browsers block it unless muted + user gesture */
  private forcePlayVideo(): void {
    const video = this.heroVideoRef?.nativeElement;
    if (!video) return;

    video.muted = true;
    video.loop = true;

    const tryPlay = () => {
      video.play().catch(() => {
        // If autoplay still blocked, retry on first user interaction
        const handler = () => {
          video.play();
          document.removeEventListener('click', handler);
          document.removeEventListener('scroll', handler);
        };
        document.addEventListener('click', handler, { once: true });
        document.addEventListener('scroll', handler, { once: true });
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true });
    }
  }

  private setupScrollAnimations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.fade-up');
      animatedElements.forEach((el) => observer.observe(el));
      this.observerInstances.push(observer);
    }, 100);
  }
}
