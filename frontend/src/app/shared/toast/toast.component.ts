import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
    toasts: Toast[] = [];
    private sub: Subscription = new Subscription();

    constructor(private toastService: ToastService) {}

    ngOnInit(): void {
        this.sub = this.toastService.toastState$.subscribe(toast => {
            this.toasts.push(toast);
            setTimeout(() => this.remove(toast.id), toast.duration || 4000);
        });
    }

    remove(id: string) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }

    ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }
}
