import { Injectable } from '@angular/core';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  private addToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) {
    const id = new Date().getTime();
    if (this.toasts.length >= 5) {
      this.toasts.shift(); // Remove former toast if we are displaying more of 5 toasts
    }
    this.toasts.push({ id, message, type });

    // Defer the toast display in a non-blocking event loop
    setTimeout(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.dismissToast(id);
        }, 4000);
      });
    }, 100);
  }

  success(message: string) {
    this.addToast(message, 'success');
  }

  error(message: string) {
    this.addToast(message, 'error');
  }

  warning(message: string) {
    this.addToast(message, 'warning');
  }

  info(message: string) {
    this.addToast(message, 'info');
  }

  dismissToast(id: number) {
    setTimeout(() => {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
    }, 0);
  }
}
