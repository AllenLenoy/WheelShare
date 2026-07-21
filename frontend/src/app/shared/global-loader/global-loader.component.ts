import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-global-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="loader-overlay" *ngIf="isLoading$ | async">
            <div class="loader-spinner"></div>
        </div>
    `,
    styles: [`
        .loader-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--clr-gray-200);
            border-top-color: var(--clr-primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `]
})
export class GlobalLoaderComponent {
    isLoading$: Observable<boolean>;

    constructor(private loadingService: LoadingService) {
        this.isLoading$ = this.loadingService.isLoading$;
    }
}
