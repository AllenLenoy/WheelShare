import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle } from '../../models/vehicle';
import { Review } from '../../models/review';

@Component({
    selector: 'app-car-details',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './car-details.component.html',
    styleUrl: './car-details.component.css'
})
export class CarDetailsComponent implements OnInit {

    vehicle: Vehicle | null = null;
    reviews: Review[] = [];
    isLoading = true;
    isLoggedIn = false;

    // Review form
    newRating = 5;
    newComment = '';
    isSubmittingReview = false;
    reviewError = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private vehicleService: VehicleService,
        private reviewService: ReviewService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadVehicle(id);
            this.loadReviews(id);
        }
    }

    loadVehicle(id: string): void {
        this.vehicleService.getVehicleById(id).subscribe({
            next: (vehicle) => {
                this.vehicle = vehicle;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.router.navigate(['/vehicles']);
            }
        });
    }

    loadReviews(vehicleId: string): void {
        this.reviewService.getVehicleReviews(vehicleId).subscribe({
            next: (reviews) => this.reviews = reviews,
            error: () => this.reviews = []
        });
    }

    get ownerName(): string {
        if (this.vehicle && typeof this.vehicle.owner === 'object') {
            return this.vehicle.owner.name;
        }
        return 'Unknown';
    }

    get ownerEmail(): string {
        if (this.vehicle && typeof this.vehicle.owner === 'object') {
            return this.vehicle.owner.email;
        }
        return '';
    }

    get displayImage(): string {
        return this.vehicle?.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=500&fit=crop&q=80';
    }

    get displayImages(): string[] {
        if (this.vehicle?.images && this.vehicle.images.length > 0) {
            return this.vehicle.images;
        }
        // Fallback to a single main image if no variants
        return [this.displayImage];
    }

    // Gallery Modal State
    showGallery: boolean = false;
    currentGalleryIndex: number = 0;

    openGallery(index: number = 0): void {
        this.currentGalleryIndex = index;
        this.showGallery = true;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeGallery(): void {
        this.showGallery = false;
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }

    nextImage(event: Event): void {
        event.stopPropagation();
        const images = this.displayImages;
        this.currentGalleryIndex = (this.currentGalleryIndex + 1) % images.length;
    }

    prevImage(event: Event): void {
        event.stopPropagation();
        const images = this.displayImages;
        this.currentGalleryIndex = (this.currentGalleryIndex - 1 + images.length) % images.length;
    }

    getStars(rating: number): string[] {
        const stars: string[] = [];
        const full = Math.floor(rating);
        const hasHalf = rating - full >= 0.5;
        for (let i = 0; i < full; i++) stars.push('★');
        if (hasHalf) stars.push('★');
        while (stars.length < 5) stars.push('☆');
        return stars;
    }

    getReviewerName(review: Review): string {
        if (typeof review.user === 'object' && review.user) {
            return review.user.name;
        }
        return 'Anonymous';
    }

    submitReview(): void {
        if (!this.vehicle || !this.newComment.trim()) return;

        this.isSubmittingReview = true;
        this.reviewError = '';

        this.reviewService.addReview({
            vehicleId: this.vehicle._id,
            rating: this.newRating,
            comment: this.newComment.trim()
        }).subscribe({
            next: () => {
                this.loadReviews(this.vehicle!._id);
                this.newComment = '';
                this.newRating = 5;
                this.isSubmittingReview = false;
            },
            error: (err) => {
                this.reviewError = err.error?.message || 'Failed to submit review';
                this.isSubmittingReview = false;
            }
        });
    }

    bookNow(): void {
        if (this.vehicle) {
            this.router.navigate(['/book', this.vehicle._id]);
        }
    }
}
