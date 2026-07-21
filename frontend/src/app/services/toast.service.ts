import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new Subject<Toast>();
    toastState$ = this.toastSubject.asObservable();

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 4000) {
        const id = Math.random().toString(36).substring(2, 9);
        this.toastSubject.next({ id, message, type, duration });
    }

    success(message: string, duration?: number) { this.show(message, 'success', duration); }
    error(message: string, duration?: number) { this.show(message, 'error', duration); }
    info(message: string, duration?: number) { this.show(message, 'info', duration); }
    warning(message: string, duration?: number) { this.show(message, 'warning', duration); }
}
