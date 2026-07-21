import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    
    // Don't show loading for silent background requests (like polling) if any exist in the future
    loadingService.show();
    
    return next(req).pipe(
        finalize(() => {
            loadingService.hide();
        })
    );
};
